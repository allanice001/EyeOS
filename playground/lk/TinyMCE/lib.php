<?php
/*
  ___  _   _  ___  ___  ___   ___  _ __ __ _ 
 / _ \| | | |/ _ \/ _ \/ __| / _ \| '__/ _` |
|  __/ \__, |  __/ (_) \__ \| (_) | |  \__  |
 \___| |___/ \___|\___/|___(_)___/|_|  |___/

eyeos is released under the GNU Affero General Public License Version 3 (AGPL3)
 -> provided with this release in license.txt
 -> or via web at www.gnu.org/licenses/agpl-3.0.txt

Copyright © 2005 - 2010 eyeos Team (team@eyeos.org)
             since 2010 Lars Knickrehm (mail@lars-sh.de)
*/

function lib_cleanPath($path,$file = 0) {
	$path = trim(substr($path,1),'/');
	$path = str_replace('//','/',str_replace('//','/',$path));
	if (!$file) {
		$path = substr($path,0,- strlen(basename($path)));
	}
	return $path;
}

function lib_css($path) {
	$url = 'index.php?extern=libs/eyeWidgets/' . lib_cleanPath($path);
	$content = file_get_contents($path);
	// url(
	$content = str_replace('url(','url(' . $url,$content);
	$content = str_replace('url(' . $url . "'","url('" . $url,$content);
	$content = str_replace('url(' . $url . '"','url("' . $url,$content);
	// url(index.php
	$content = str_replace('url(' . $url . 'index.php','url(index.php',$content);
	$content = str_replace("url('" . $url . 'index.php',"url('index.php",$content);
	$content = str_replace('url("' . $url . 'index.php','url("index.php',$content);
	file_put_contents($path,$content);
}

function lib_delete($path) {
	if (is_file($path)) {
		unlink($path);
	} elseif (is_dir($path)) {
		foreach (scandir($path) as $file) {
			if ($file != '.' && $file != '..') {
				lib_delete($path . '/' . $file);
			}
		}
		rmdir($path);
	}
}

function lib_html($path) {
	$url = 'index.php?extern=libs/eyeWidgets/' . lib_cleanPath($path);
	$content = file_get_contents($path);
	// href=
	$content = str_replace('href=','href=' . $url,$content);
	$content = str_replace('href=' . $url . "'","href='" . $url,$content);
	$content = str_replace('href=' . $url . '"','href="' . $url,$content);
	// href=#
	$content = str_replace('href=' . $url . '#','href=#',$content);
	$content = str_replace("href='" . $url . '#',"href='#",$content);
	$content = str_replace('href="' . $url . '#','href="#',$content);
	// href=http
	$content = str_replace('href=' . $url . 'http','href=http',$content);
	$content = str_replace("href='" . $url . 'http',"href='http",$content);
	$content = str_replace('href="' . $url . 'http','href="http',$content);
	// href=index.php
	$content = str_replace('href=' . $url . 'index.php','href=index.php',$content);
	$content = str_replace("href='" . $url . 'index.php',"href='index.php",$content);
	$content = str_replace('href="' . $url . 'index.php','href="index.php',$content);
	// href=javascript:
	$content = str_replace('href=' . $url . 'javascript:','href=javascript:',$content);
	$content = str_replace("href='" . $url . 'javascript:',"href='javascript:",$content);
	$content = str_replace('href="' . $url . 'javascript:','href="javascript:',$content);
	// src=
	$content = str_replace('src=','src=' . $url,$content);
	$content = str_replace('src=' . $url . 'index.php','src=index.php',$content);
	$content = str_replace('src=' . $url . "'","src='" . $url,$content);
	$content = str_replace('src=' . $url . '"','src="' . $url,$content);
	// src=http
	$content = str_replace('src=' . $url . 'http','src=http',$content);
	$content = str_replace("src='" . $url . 'http',"src='http",$content);
	$content = str_replace('src="' . $url . 'http','src="http',$content);
	// src=index.php
	$content = str_replace('src=' . $url . 'index.php','src=index.php',$content);
	$content = str_replace("src='" . $url . 'index.php',"src='index.php",$content);
	$content = str_replace('src="' . $url . 'index.php','src="index.php',$content);
	file_put_contents($path,$content);
}

function lib_parse($path) {
	if (is_file($path)) {
		if ($_REQUEST['rn2n'] && (substr($path, -4) == '.css' || substr($path, -3) == '.htm' || substr($path, -4) == '.html' || substr($path, -3) == '.js' || substr($path, -3) == '.txt')) {
			file_put_contents($path, str_replace("\r\n", "\n", file_get_contents($path)));
		}
		if ($_REQUEST['css'] && substr($path,-4) == '.css') {
			lib_css($path);
		} elseif ($_REQUEST['html'] && (substr($path,-4) == '.htm' || substr($path,-5) == '.html')) {
			lib_html($path);
		} elseif ($_REQUEST['movesrc'] && substr($path,-7) == '_src.js') {
			unlink(substr($path, 0, -7) . '.js');
			rename($path, substr($path, 0, -7) . '.js');
		}
	} elseif (is_dir($path)) {
		foreach (scandir($path) as $file) {
			if ($file != '.' && $file != '..') {
				lib_parse($path . '/' . $file);
			}
		}
	}
}

function lib_replace($changed, $original, $destination) {
	if (is_file($changed) === true) {
		$url = substr(lib_cleanPath($changed, 1), 6);
		if (!file_exists($destination) === true || md5_file($destination) === md5_file($original)) {
			copy($changed, $destination);
		} else {
			$warnings .= "\n" . '"' . $url . '" changed. Please merge the oneye changes manually.';
		}
	} else {
		if (is_dir($destination) === false) {
			@mkdir($destination);
		}
		foreach (@scandir($changed) as $file) {
			if ($file !== '.' && $file !== '..' && $file !== '.svn') {
				$warnings .= lib_replace($changed . '/' . $file, $original . '/' . $file, $destination . '/' . $file);
			}
		}
	}
	return $warnings;
}
?>