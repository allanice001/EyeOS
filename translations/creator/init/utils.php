<?php
	function creator_init_utils(){
		$basePath = dirname(__FILE__).'/../';
		$basePath = $basePath.'/'.UTILS_DIR.'/';
		$listOfFiles = glob($basePath.'/*.php');
		foreach($listOfFiles as $file){
			require_once($file);
		}
	}
?>