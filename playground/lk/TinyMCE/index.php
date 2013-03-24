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

error_reporting(E_ALL ^ E_NOTICE);
require_once('./lib.php');
require_once('./xml.php');

if (!isset($_REQUEST['css']) && !isset($_REQUEST['delete']) && !isset($_REQUEST['html']) && !isset($_REQUEST['movesrc']) && !isset($_REQUEST['replace']) && !isset($_REQUEST['rn2n'])) {
	$_REQUEST['replace'] = 0;
	$_REQUEST['css'] = 1;
	$_REQUEST['delete'] = 1;
	$_REQUEST['html'] = 1;
	$_REQUEST['movesrc'] = 1;
	$_REQUEST['rn2n'] = 1;
}

$warnings = "\n";
if ($_REQUEST['replace']) {
	$warnings .= lib_replace('./changed/', './original/', './tiny_mce/');
}

if ($_REQUEST['delete']) {
	lib_delete('./tiny_mce/classes');
	lib_delete('./tiny_mce/jquery.tinymce.js');
	lib_delete('./tiny_mce/tiny_mce_dev.js');
	lib_delete('./tiny_mce/tiny_mce_jquery.js');
	lib_delete('./tiny_mce/tiny_mce_prototype.js');
	lib_delete('./tiny_mce/themes/simple');
}

lib_parse('./tiny_mce/');

echo nl2br('[replace] - Replaces TinyMCE files with oneye files.
[css] - Fixes all paths in CSS files.
[delete] - Deletes not needed files and folders.
[html] - Fixes all paths in HTML files.
[movesrc] - Renames all "_src.js" files into ".js" files.
[rn2n] - replaces all "\r\n" characters by "\n".' . $warnings);
?>