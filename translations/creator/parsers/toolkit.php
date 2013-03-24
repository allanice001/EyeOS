<?php
define('WIDGET_DEF','widgetsDef');
function creator_parser_toolkit(&$content){
	$definitions = getAllDefinitions();
	$texts = array();
	$patt = "/new\s+(\w+).+\;/U";
	preg_match_all($patt,$content,$array);
	$GLOBALS['methods'] = array();
	foreach($array[0] as $instance){
		preg_match("/new\s+(\w+)\W+/",$instance,$array);
		$widgetName = $array[1];
		if(empty($widgetName)){
			show_warning("Error getting the widget name\n");
			show_debug("\t\t--".$instance."--\n");
		}
 		if($definitions[$widgetName]){
			//Getting the array
			preg_match("/array\(.+\)/",$instance,$as);
			$arguments = $as[0];
			if(!empty($definitions[$widgetName]->arguments)){
				show_debug("GetArgumentStrings from: ".$widgetName."\n");
				show_debug(print_r($definitions[$widgetName]->arguments,true));
				$texts2 = getArgumentStrings($definitions[$widgetName]->arguments,$arguments);
				if(!empty($texts2)){
					show_debug("WidgetName: $widgetName Argument Texts:\n");
					$texts = array_merge($texts,$texts2);
					show_debug(print_r($texts2,true));
				}
			}
			if(!empty($definitions[$widgetName]->methods)){
				$texts2 = getMethodStrings($definitions[$widgetName]->methods,$content,$widgetName);
				if(!empty($texts2)){
					show_debug("WidgetName: $widgetName Method Texts:\n");
					$texts = array_merge($texts,$texts2);
					show_debug(print_r($texts2,true));
				}
			}
 		}
	}
	unset($GLOBALS['methods']);
	if(!empty($texts)){
		return $texts;
	}else{
		return false;
	}
}
function getMethodStrings(&$methods,$content,$widgetName){
	$texts = array();
	foreach($methods as $method){
		if(array_search($method,$GLOBALS['methods']) === false){
			if(!methodException($widgetName,$method)){
				$patt = "/->$method(.*[\$'\"](.*)['\"].*)/U";
				preg_match_all($patt,$content,$results);
				foreach($results[1] as $key=>$value){
					if(strpos($value,'$') !== false){
						show_warning("WARNING! VARIABLE USED IN i18n FUNCTION or SIMILAR!");
						show_warning("\t\t\tAppName: ".$GLOBALS['currentApp']. "\n\t\t\tcurrentFile: ".$GLOBALS['currentFile']."\n\t\t\tcurrentParser: ".$GLOBALS['currentParser']."\n");
						unset($results[2][$key]);
					}
				}
				if(!empty($results[2])){
					$texts = array_merge($texts,$results[2]);
				}
				$GLOBALS['methods'][] = $method;
			}else{
				$patt = "/->$method.*,.*,(.*['\"](.*)['\"].*)[\),]/U";
				preg_match_all($patt,$content,$results);
				foreach($results[1] as $key=>$value){
					if(strpos($value,'$') !== false){
						show_warning("WARNING! VARIABLE USED IN i18n FUNCTION or SIMILAR!");
						show_warning("\t\t\tAppName: ".$GLOBALS['currentApp']. "\n\t\t\tcurrentFile: ".$GLOBALS['currentFile']."\n\t\t\tcurrentParser: ".$GLOBALS['currentParser']."\n");
						unset($results[2][$key]);
					}
				}
				if(!empty($results[2])){
					$texts = array_merge($texts,$results[2]);
				}
			}
		}
	}
	if(!empty($texts)){
		return $texts;
	}else{
		return false;
	}
}
function methodException($widgetName,$method){
	if($widgetName == 'Toolbar' && $method == 'addItem'){
		return true;
	}else{
		return false;
	}
}
function getArgumentStrings(&$arguments,&$arrayArg){
	$texts = array();
	foreach($arguments as $argument){
		$patt = "/$argument.*=>(.*[\$'\"](.*)['\"])/U";
		preg_match($patt,$arrayArg,$as);
		if(!empty($as[1])){
			if(strpos($as[1],'$') === false){
				$texts[] = $as[2];
			}else{
				echo "WARNING! VARIABLE USED IN i18n FUNCTION or SIMILAR!\n";
			}
		}
	}
	if(!empty($texts)){
		return $texts;
	}else{
		return false;
	}
}

/**
*Each widget have a definition that defines what arguments are translatables
*This definitions are defined in a xml inside WIDGET_DEF folder
*/
function getAllDefinitions(){
	$basePath = dirname(__FILE__).'/../';
	$basePath = $basePath.'/'.WIDGET_DEF.'/';
	$listOfFiles = glob($basePath.'/*');
	$definitions = array();
	if($listOfFiles){
		foreach($listOfFiles as $file){
			$widgetName = basename($file,'.xml');
			$def = getWidgetDefinition($widgetName);
			if($def){
				$definitions[$widgetName] = $def;
			}
		}
		if(!empty($definitions)){
			return $definitions;
		}else{
			return false;
		}
	}
}
function getWidgetDefinition($widgetName){
	$basePath = dirname(__FILE__).'/../';
	$basePath = $basePath.'/'.WIDGET_DEF.'/'.$widgetName.'.xml';
	if(!is_file($basePath)){
		echo "The widget $widgetName doesn't have definition!\n";
		echo $basePath;exit;
		return false;
	}
	$obj = simplexml_load_file($basePath);
	if($obj){
		return $obj;
	}else{
		echo "The widget $widgetName seems have a wrong definition!\n";
		echo $basePath;exit;
		return false;
	}
}
?>
