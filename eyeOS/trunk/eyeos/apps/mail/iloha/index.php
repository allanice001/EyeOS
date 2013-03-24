<?php
error_reporting(E_ALL & ~E_NOTICE);
require 'imap.inc';
require 'icl_commons.inc';
require 'pop3.inc';

global $ICL_SSL;
$ICL_SSL = 1;
global $ICL_PORT;
$ICL_PORT = 993;
$conn = iil_pop::iil_Connect('imap.gmail.com', 'eyeosmail@gmail.com', '');
if (!$conn){
	echo "Connection failed: $iil_error <br> ";
	exit;
}

$folders = iil_pop::iil_C_ListMailboxes($conn,"","*");
if(!$folders || !is_array($folders)) {
	echo 'There is no folders in your imap account!';
	exit;
}

$delim = iil_C_GetHierarchyDelimiter($conn);
$folder_container = array();
$containers = array();

foreach($folders as $k=>$path) {
	while (false !== ($pos = strrpos($path, $delim))){
		$container = substr($path, 0, $pos);
		//esto indica que carpetas tienen subcarpeta
		if ($containers[$container]!=1) {
			$containers[$container]=1;
		}
		//va rellenando el array con la herarquia
		$folder_container[$path] = $container;
		$path = substr($path, 0, $pos);
	}
}

reset($containers);
//si un elemento es padre de otro, tiene que estar dentro de folders.
//ejemplo:
//b/c/d es posible que no nos desolviesen 'c' en listmailboxes.
foreach($containers as $container=>$v) {
	if (!InArray($folders,$container)) {
		array_push($folders, $container);
	}
}

natcasesort($folders);

echo '<h2>IMAP Folders('.count($folders).'):</h2><br/>';

foreach($folders as $value) {
	$unseen = iil_C_CountUnseen($conn, $value);
	if($unseen && $unseen > 0) {
		$unseen_str = "<b>&nbsp;&nbsp;(".$unseen.")</b>";
	} else {
		$unseen_str = "";
	}
	
	echo '<a style="font-family:Verdana;color:#222222;margin-bottom:3px;text-decoration:none" href="folder.php?folder='.urlencode(iil_utf7_decode($value)).'">'.iil_utf7_decode($value).$unseen_str.'</a><br/>';
}

function InArray($array, $item){
	if (!is_array($array)) return false;
	else if (strcasecmp($item, "inbox")==0) return false;
	else return in_array($item, $array);
}

?>
