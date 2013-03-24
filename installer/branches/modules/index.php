<?php
/*
  ___  _ __   ___ _   _  ___
 / _ \| '_ \ / _ \ | | |/ _ \
| (_) | | | |  __/ |_| |  __/
 \___/|_| |_|\___|\__, |\___|
                  |___/

oneye is released under the GNU Affero General Public License Version 3 (AGPL3)
 -> provided with this release in license.txt
 -> or via web at www.gnu.org/licenses/agpl-3.0.txt

Copyright © 2005 - 2010 eyeos Team (team@eyeos.org)
             since 2010 Lars Knickrehm (mail@lars-sh.de)
*/

date_default_timezone_set('UTC');
header('Content-Type: text/plain; charset=UTF-8');

$array = array('modules' => array(array(
	'browser' => array(get_modules_array('./files/browser')),
	'iphone' => array(get_modules_array('./files/iphone')),
	'mobile' => array(get_modules_array('./files/mobile'))
)));
var_dump($array);
xml_write('../stable/installer/files/modules.xml', $array);

function get_modules_array($prefix, $path = '', $array = array()) {
	if (is_file($prefix . $path) === true) {
		$array[substr($path, 1)] = array(base64_encode(file_get_contents($prefix . $path)));
	} else {
		foreach (scandir($prefix . $path) as $file) {
			if ($file != '.' && $file != '..' && $file != '.svn') {
				$array = get_modules_array($prefix, $path . '/' . $file, $array);
			}
		}
	}
	return $array;
}

function xml_write($file,$array) {
	return file_put_contents($file,xml_write_intern($array));
}

function xml_write_intern($array,$tabs = -1) {
	$tabs++;
	foreach ($array as $key => $value) {
		$key = htmlspecialchars($key,ENT_NOQUOTES,'UTF-8');
		$key = str_replace('?','&#63;',$key);
		$key = str_replace('!','&#33;',$key);
		$key = str_replace(' ','&nbsp;',$key);
		$key = str_replace('/','&#47;',$key);
		if (is_array($value)) {
			foreach ($value as $current) {
				$return .= str_pad('',$tabs,"\t") . '<' . $key . '>';
				if (is_array($current)) {
					$return .= "\n" . xml_write_intern($current,$tabs) . "\n" . str_pad('',$tabs,"\t");
				} else {
					$return .= htmlspecialchars($current,ENT_NOQUOTES,'UTF-8');
				}
				$return .= '</' . $key . '>' . "\n";
			}
		}
	}
	return trim($return,"\n");
}
?>