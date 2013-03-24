<?php
/*
                                  ____   _____
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___
                 / _ \ | | |/ _ \ |  | |\___ \
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/
                       __/ |
                      |___/

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - www.eyeos.org/team

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2009 eyeOS Team (team@eyeos.org)
*/

error_reporting(E_ALL ^ E_NOTICE);
require_once('./lib.php');
require_once('./xml.php');

if (!isset($_REQUEST['count']) && !isset($_REQUEST['doubles']) && !isset($_REQUEST['revision']) && !isset($_REQUEST['sort']) && !isset($_REQUEST['system'])) {
	$_REQUEST['doubles'] = 1;
	$_REQUEST['sort'] = 1;
}

@mkdir('./output/');

$system = xml_read('./input/System.xml');
if (is_array($system)) {
	if ($_REQUEST['doubles']) {
		$system = lib_doubles($system);
	}
	if ($_REQUEST['revision']) {
		$system = lib_revision($system);
	}
	if ($_REQUEST['sort']) {
		$system = lib_sort($system);
	}
	xml_write('./output/System.xml',$system);
}

foreach (scandir('./input/') as $file) {
	if (substr($file,-4) == '.xml' && basename($file) != 'System.xml') {
		$xml = xml_read('./input/' . basename($file));
		if ($_REQUEST['doubles']) {
			$xml = lib_doubles($xml);
		}
		if ($_REQUEST['revision']) {
			$xml = lib_revision($xml);
		}
		if ($_REQUEST['sort']) {
			$xml = lib_sort($xml);
		}
		if ($_REQUEST['system'] && basename($file) != 'SimpleSpreadSheets.xml') {
			$xml = lib_system($xml,$system);
		}
		if ($_REQUEST['count'] && basename($file) != 'SimpleSpreadSheets.xml') {
			$counted = lib_count($xml,$counted);
		}
		xml_write('./output/' . basename($file),$xml);
	}
}

if ($_REQUEST['xx']) {
	lib_xx();
}

if ($_REQUEST['en']) {
	lib_en();
}

echo nl2br('[doubles] - remove entries, which are available to or more times
[sort] - sorts all file entries

[count] - counts all entries in all files
[revision] - updates all revisions
[system] - remove entries, which are available in the system file, too
[xx] - creates an xx source file for offline translations
[en] - creates an en source file for offline translations

- - - - - - - - - - - - - - - - - - - - - - - - -

');

if ($_REQUEST['count']) {
	arsort($counted);
	echo nl2br(print_r($counted,1));
} else {
	foreach (scandir('./output/') as $file) {
		if (substr($file,-4) == '.xml') {
			echo basename($file) . '<br />';
		}
	}
}
?>