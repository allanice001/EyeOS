<?php
function creator_parser_eyeUpload(){
	$files[] = $GLOBALS['path'].'/'.EXTERN_DIR.'/libs/eyeWidgets/getFile.eyecode';
	$files[] = $GLOBALS['path'].'/'.EXTERN_DIR.'/libs/eyeWidgets/getMultipleFile.eyecode';
	$texts = array();

	$patt = "/i18n.*array.*\(['\"](.*)['\"][,\)].*;/U";
	foreach($files as $file){
		if(file_exists($file)){
			$content = file_get_contents($file);
			preg_match_all($patt,$content,$as);
			if(!empty($as[1])){
				$texts = array_merge($texts,$as[1]);
			}
		}else{
			echo "Error in eyeUpload custom parser, $file doesn't exists!!\n";
			return false;
		}
	}
	if(!empty($texts)){
		return $texts;
	}else{
		return false;
	}
}
?>
