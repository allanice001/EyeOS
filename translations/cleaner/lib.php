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

function lib_count($xml,$counted) {
	if (is_array($xml['lang'][0]['texts'][0])) {
		foreach ($xml['lang'][0]['texts'][0] as $texts) {
			foreach ($texts as $text) {
				$counted[$text]++;
			}
		}
		return $counted;
	}
}

function lib_doubles($xml) {
	if (is_array($xml['lang'][0]['texts'][0]['text'])) {
		$texts = array();
		foreach ($xml['lang'][0]['texts'][0]['text'] as $text) {
			if (!in_array($text,$texts)) {
				$texts[] = $text;
			}
		}
		$xml['lang'][0]['texts'][0]['text'] = $texts;
	}
	return $xml;
}

function lib_revision($xml) {
	$xml['lang'][0]['info'][0]['revision'][0] = $_REQUEST['revision'];
	return $xml;
}

function lib_sort($xml) {
	if (is_array($xml['lang'][0]['texts'][0])) {
		uksort($xml['lang'][0]['texts'][0], 'strnatcasecmp');
		if (is_array($xml['lang'][0]['texts'][0]['text'])) {
			natcasesort($xml['lang'][0]['texts'][0]['text']);
		}
	}
	return $xml;
}

function lib_system($xml,$system) {
	if (is_array($xml['lang'][0]['texts'][0])) {
		foreach ($xml['lang'][0]['texts'][0]['text'] as $text) {
			if (!in_array($text,$system['lang'][0]['texts'][0]['text'])) {
				$texts[] = $text;
			}
		}
	}
	$xml['lang'][0]['texts'][0]['text'] = $texts;
	return $xml;
}

function lib_xx() {
	$xx['lang'][0]['info'][0]['lang'][0] = 'xx';
	$xx['lang'][0]['info'][0]['lang-en'][0] = 'xx';
	$xx['lang'][0]['info'][0]['author'][0] = 'xx';
	$xx['lang'][0]['info'][0]['version'][0] = 'xx';
	$xx['lang'][0]['info'][0]['revision'][0] = '1';
	
	foreach (scandir('./output/') as $file) {
		if (substr($file,-4) == '.xml') {
			$xml = xml_read('./output/' . basename($file));
			if (is_array($xml['lang'][0]['texts'][0])) {
				$temp = array();
				$temp['name'][0] = basename($file,'.xml');
				foreach ($xml['lang'][0]['texts'][0] as $text => $texts) {
					foreach ($texts as $old) {
						$array = array();
						if ($text == 'text') {
							$array['old'][0] = $old;
						} else {
							$array['old'][0] = $text;
						}
						$array['new'][0] = 'xx';
						$temp['text'][] = $array;
					}
				}
				$xx['lang'][0]['part'][] = $temp;
			}
		}
	}
	xml_write('./xx.xml',$xx);
}

function lib_en() {
	$en['lang'][0]['info'][0]['lang'][0] = 'English';
	$en['lang'][0]['info'][0]['lang-en'][0] = '';
	$en['lang'][0]['info'][0]['author'][0] = 'eyeOS Team';
	$en['lang'][0]['info'][0]['version'][0] = 'xx';
	$en['lang'][0]['info'][0]['revision'][0] = '1';
	
	foreach (scandir('./output/') as $file) {
		if (substr($file,-4) == '.xml') {
			$xml = xml_read('./output/' . basename($file));
			if (is_array($xml['lang'][0]['texts'][0])) {
				$temp = array();
				$temp['name'][0] = basename($file,'.xml');
				foreach ($xml['lang'][0]['texts'][0] as $text => $texts) {
					foreach ($texts as $old) {
						$array = array();
						if ($text == 'text') {
							$array['old'][0] = $old;
						} else {
							$array['old'][0] = $text;
						}
						$array['new'][0] = $old;
						$temp['text'][] = $array;
					}
				}
				$en['lang'][0]['part'][] = $temp;
			}
		}
	}
	xml_write('./en.xml',$en);
}
?>