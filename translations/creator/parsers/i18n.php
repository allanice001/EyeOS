<?php
function creator_parser_i18n($content){
	$patt = "/i18n.*array.*\(['\"](.*)['\"][,\)].*[;\)]/U";
// 	$patt = "/i18n.*array.*\(['\"](.*)['\"][,\)].*;/U";
	preg_match_all($patt,$content,$as);
	if(!empty($as[1])){
		echo "Standar i18n calls:\n";
		print_r($as[1]);
		return $as[1];
	}else{
		return false;
	}
}
?>
