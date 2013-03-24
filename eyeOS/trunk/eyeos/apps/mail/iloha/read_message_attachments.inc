<?php
//get message info
unset($part);
$header = iil_pop::iil_C_FetchHeader($conn, $folder, $id);
$structure_str=iil_pop::iil_C_FetchStructureString($conn, $folder, $id);
$structure=iml_GetRawStructureArray($structure_str);
$num_parts=iml_GetNumParts($structure, $part);
$parent_type=iml_GetPartTypeCode($structure, $part);
$uid = $header->uid;

if (($parent_type==1) && ($num_parts==1)) {
	$part = 1;
	$num_parts=iml_GetNumParts($structure, $part);
	$parent_type=iml_GetPartTypeCode($structure, $part);
}

if ($num_parts > 0) {
	$attachments = array();
	for ($i=1;$i<=$num_parts;$i++) {
		//get attachment info
		if ($parent_type == 1)
			$code=$part.(empty($part)?"":".").$i;
		else if ($parent_type == 2) {
			$code=$part.(empty($part)?"":".").$i;
		}

		$type=iml_GetPartTypeCode($structure, $code);
		$name=iml_GetPartName($structure, $code);
		$typestring=iml_GetPartTypeString($structure,$code);
		list($dummy, $subtype) = explode("/", $typestring);
		$bytes=iml_GetPartSize($structure,$code);
		$encoding=iml_GetPartEncodingCode($structure, $code);
		$disposition = iml_GetPartDisposition($structure, $code);

		if (is_string($typestring)) {
			if (strcasecmp($typestring, "MULTIPART/alternative") != 0) {
				if (is_string($name) && ($bytes>0) && is_string($typestring))
					$attachments[] = array('name' => htmlspecialchars(LangDecodeSubject($name, $my_charset)),
											'size' => ShowBytes($bytes), 'type' => htmlspecialchars($typestring),
											'data' => iil_pop::iil_C_PrintBase64Body($conn, $folder, $id, $code));
			}
		}
	}
	return $attachments;
}

?>
