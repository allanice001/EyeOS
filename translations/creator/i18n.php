#!/usr/bin/php
<?php
//App initialitation
define('PARSERS_DIR','parsers');
define('APP_PARSERS','appsParsers');
define('UTILS_DIR','utils');

error_reporting(E_ALL ^ E_NOTICE);
ini_set('max_execution_time',0);
set_time_limit(0);

//Argument checking
if($_SERVER['argc'] <= 1){	
	show_usage();
	exit(1);
}

$argv = &$_SERVER['argv'];
$opts = getopt('u:a:o:d');
if(is_dir($opts['u'])){
	$path = $opts['u'];
}else{
	echo "Argument 1 must be the path of the folder where the index.php of eyeOS is located\n";
	show_usage();
	exit(1);
}
if(file_exists($path.'/settings.php')){
	include_once($path.'/settings.php');
}else{
	echo "settings.php file is not in $path folder\n";
	show_usage();
	exit(1);
}

$outputDir = '';
if(!empty($opts['o'])){
	if(!file_exists($opts['o'])){
		if(!mkdir($opts['o'])){
			echo "Unable to create output directory:\n";
			echo $opts['o']."\n";
			mkdir('./output');
			$outputDir = './output';
		}else{
			$outputDir = $opts['o'];
		}
	}else{
		$outputDir = $opts['o'];
	}
}
$onlyApp = '';
if(!empty($opts['a'])){
	$onlyApp = $opts['a'];
}
$GLOBALS['debug'] = false;
if(isset($opts['d'])){
	$GLOBALS['debug'] = true;
}
show_debug("Path: ".$path);
$path = $path.'/'.REAL_EYE_ROOT;

show_debug("Path eyeOS: ".$path);
$GLOBALS['path'] = $path;
if(!is_dir($path)){
	show_error("Impossible locate REAL_EYE_ROOT path, $path is not a folder");
}

//initialitating everything
require_once('init.php');

//Starting the application
$listOfFiles = array();
if(empty($onlyApp)){
	$listOfFiles = glob($path.'/'.APP_DIR.'/*');
}else{
	$listOfFiles[0] = $path.'/'.APP_DIR.'/'.$onlyApp;
	if(!file_exists($listOfFiles[0])){
		show_error("App $onlyApp doesn't exists!");
	}
}
$debug = "Applications to be checked ".print_r($listOfFiles,true);
show_debug($debug);

foreach($listOfFiles as $file){
	if(isApplication($file)){
		$appName = basename($file);
		$GLOBALS['currentApp'] = $appName;
		show_debug("================================================");
		show_debug("===============Checking: $appName===============");
		show_debug("================================================\n");
		$listOfFiles = getAllFiles($appName);
		$debug = "Files of $appName: ".print_r($listOfFiles,true);
 		show_debug($debug);
		if($listOfFiles){
			$appText = array('lang'=>array(array('info'=>array(array('revision'=>array(date('d/m/Y',time())))),'texts'=>array())));
			foreach($listOfFiles as $codeFile){
				$GLOBALS['currentFile'] = $codeFile;
				$content = file_get_contents($codeFile);
				generalParseFile($content);
				foreach($GLOBALS['parsers'] as $parser){
					$GLOBALS['currentParser'] = $parser;
					$toMerge = call_user_func('creator_parser_'.$parser,$content,$appText);
					if($toMerge != false){
						$appText['lang'][0]['texts'] = array_merge($appText['lang'][0]['texts'],$toMerge);
					}
				}
			}
			$GLOBALS['currentPath'] = '';
			if(!isStandar($appName)){
				if(file_exists('./'.APP_PARSERS.'/'.$appName.'.php')){
					require_once('./'.APP_PARSERS.'/'.$appName.'.php');
					$toMerge = call_user_func('creator_parser_'.$appName);
					if($toMerge != false){
						$appText['lang'][0]['texts'] = array_merge($appText['lang'][0]['texts'],$toMerge);
					}
				}
			}
			$appText['lang'][0]['texts'] = array_unique($appText['lang'][0]['texts']);
			if(!empty($appText['lang'][0]['texts'])){
				$xml = xml_write($appText);
				file_put_contents($outputDir.'/'.$appName.'.xml',$xml);
			}
		}else{
			show_warning("The $appName application doesn't have files!");
		}
	}
}

function show_usage(){
	echo "You've to use i18n creator like:\n";
	echo "i18n.php /path/to/where/your/eyeos/index/is/located\n";
}

function show_warning($string){
	echo $string."\n";
}

function show_error($string){
	echo "ERROR: ".$string."\n";
	show_usage();
	exit(1);
}

function show_debug($string){
	if($GLOBALS['debug'] == true){
		echo "DEBUG ".$string."\n";
	}
}
?>
