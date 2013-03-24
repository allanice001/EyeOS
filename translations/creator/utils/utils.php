<?php
function generalParseFile(&$content){
	$content = str_replace("\n","",$content);
	$content = str_replace("\t","",$content);
	$content = str_replace("\r","",$content);
}

function isStandar($appName){
	//APP_PARSERS defined in i18n.php!
	$appFile == __FILE__.'../'.APP_PARSERS.'/'.$appName.'.xml';
	if(!file_exists($appFile)){
		return false;
	}else{
		return true;
	}
}
function customParser($appName){
	return false;
}
function isApplication($file){
	if(basename($file) != 'share'){
		return true;
	}else{
		return false;
	}
}
function getAllfiles($appName){
	$file = $GLOBALS['path'].'/'.APP_DIR.'/'.$appName;
	$array = getRecursiveFiles($file);
 	$file = $GLOBALS['path'].'/'.EXTERN_DIR.'/apps/'.$appName;
	$more = getRecursiveFiles($file);
	if($more != false){
		$array = array_merge($array,$more);
	}
	return $array; 
}
function getRecursiveFiles($file){
	if(file_exists($file)){
		$listOfFiles = glob($file.'/*');
		$finalList = array();
		foreach($listOfFiles as $file){
			if(is_dir($file)){
				$result = getRecursiveFiles($file);
				$finalList = array_merge($finalList,$result);
			}else{
				if(strpos($file,EYE_CODE_EXTENSION) !== false){
					$finalList[] = $file;
				}
			}
		}
		return $finalList;
	}else{
		return false;
	}
}
function xml_write($array,$tabs = -1) {
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
					$return .= "\n" . xml_write($current,$tabs) . "\n" . str_pad('',$tabs,"\t");
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
