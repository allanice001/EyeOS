<?php
	function creator_init_parsers(){
		$basePath = dirname(__FILE__).'/../';
		$basePath = $basePath.'/'.PARSERS_DIR.'/';
		$listOfFiles = glob($basePath.'/*.php');
		$GLOBALS['parsers'] = array();
		foreach($listOfFiles as $file){
			require_once($file);
			$fileName = basename($file,'.php');
			$GLOBALS['parsers'][] = $fileName;
			if(function_exists($fileName.'_init')){
				call_user_func($fileName.'_init');
			}
		}
	}
?>