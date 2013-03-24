<?php
define('INIT_DIR','init');
$basePath = dirname(__FILE__);
$basePath = $basePath.'/'.INIT_DIR.'/';
$listOfFiles = glob($basePath.'/*.php');
foreach($listOfFiles as $file){
	$name = basename($file,'.php');
	require_once($file);
	call_user_func('creator_init_'.$name);
}
?>