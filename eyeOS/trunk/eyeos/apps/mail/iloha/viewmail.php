<?php
error_reporting(E_ALL & ~E_NOTICE);
require 'imap.inc';
require 'icl_commons.inc';
require 'common.inc';
require 'utf8.inc';
require 'UTF-8.inc';
require 'mime.inc';

global $ICL_SSL;
$ICL_SSL = 1;
global $ICL_PORT;
$ICL_PORT = 993;
$conn = iil_Connect('imap.gmail.com', 'eyeosmail@gmail.com', '');
if (!$conn){
	echo "Connection failed: $iil_error <br> ";
	exit;
}

$id = $_GET['id'];
$folder = $_GET['folder'];
$part = "";

$header = iil_C_FetchHeader($conn, $folder, $id);
$structure_str=iil_C_FetchStructureString($conn, $folder, $id);
$structure=iml_GetRawStructureArray($structure_str);
$num_parts=iml_GetNumParts($structure, "");
$parent_type=iml_GetPartTypeCode($structure, "");
$uid = $header->uid;

//por que podría pasar esto? puede que sea por que sea un text plain y punto
if ($parent_type==1 && $num_parts==1){
	$part = 1;
	$num_parts=iml_GetNumParts($structure, $part);
	$parent_type=iml_GetPartTypeCode($structure, $part);
}

$attachments = array();
if($num_parts > 0) {
	for ($i=1;$i<=$num_parts;$i++) {
			//de momento, $code es $i, no se preveen, aun, subpartes.
			$code = $i;
			$type=iml_GetPartTypeCode($structure, $code);
			$name=iml_GetPartName($structure, $code);
			$typestring=iml_GetPartTypeString($structure,$code);
			list($dummy, $subtype) = explode("/", $typestring);
			$bytes=iml_GetPartSize($structure,$code);
			$encoding=iml_GetPartEncodingCode($structure, $code);
			$disposition = iml_GetPartDisposition($structure, $code);
			if (is_string($name)) {
				array_push($attachments, array(
					'name'=> htmlspecialchars(LangDecodeSubject($name, 'UTF-8')),
					'size' => $bytes,
					'encoding' => $encoding,
					'disposition' => $disposition,
					'part' => $i
				));
			}
	}
}

$typeCode=iml_GetPartTypeCode($structure, $part);
list($dummy,$subtype) = explode("/",iml_GetPartTypeString($structure,$part));

?>
<html>
	<head>
		<title>reading mail from <?php echo LangDecodeAddressList($header->from, 'UTF-8', ''); ?></title>
		<META http-equiv="Content-Type" Content="text/html;charset=UTF-8" />
		<style type="text/css">
			table {
				padding:0px;
				border: 1px solid #888888;
			}
			td, th {
				border: 1px solid #888888;
			}
			td {
				padding:5px;
			}
		</style>
	</head>
	<body>
		<br/>
		<center>
			<table cellpadding="0" cellspacing="0" width="800">
				<tr>
					<td><b>Date:</b> <?php echo date('d/m/Y G:i', $header->timestamp); ?></td>
				</tr>
				<tr>
					<td><b>From:</b> <?php echo htmlentities(LangDecodeAddressList($header->from, 'UTF-8', ''), ENT_QUOTES, 'UTF-8'); ?></td>
				</tr>
				<tr>
					<td><b>To:</b> <?php echo htmlentities(LangDecodeAddressList($header->to, 'UTF-8', ''), ENT_QUOTES, 'UTF-8'); ?></td>
				</tr>
				<tr>
					<td><b>Message ID:</b> <?php echo htmlentities($header->messageID, ENT_QUOTES, 'UTF-8'); ?></td>
				</tr>
				<tr>
					<td><b>In reply To:</b> <?php echo htmlentities($header->inreplyto, ENT_QUOTES, 'UTF-8'); ?></td>
				</tr>
				<tr>
					<td><b>Size:</b>
					<?php 
						if ($header->size > 1024){
							$kb=(int)($header->size/1024);
							echo $kb." KB";
						}else{
							echo $header->size." B";
						} 
					?>
					</td>
				</tr>
				<tr>
					<td><b>Attachments:</b>
					<?php
						for($i=0;$i<count($attachments);$i++) {
							echo '<a href="viewfile.php?id='.$id.'&folder='.$folder.'&part='.$attachments[$i]['part'].'">'.$attachments[$i]['name'].'</a>';
							if($i+1 != count($attachments)) {
								echo ' ';
							}
						}
					?>
					</td>
				</tr>
				<tr>
					<td>
					<?php
$typeCode=iml_GetPartTypeCode($structure, $part);
list($dummy,$subtype) = explode("/",iml_GetPartTypeString($structure,$part));

if (($typeCode==3)&&(strcasecmp($subtype, "ms-tnef")==0)){
	//ms-tnef
	$type = $dummy;
//	include_once("../include/tnef_decoder.inc");
//	include("../include/read_tnef_print.inc");
}else if ($typeCode==0){
	// major type is "TEXT"
	$typestring=iml_GetPartTypeString($structure, $part);

	// if part=0, and there's a conflict in content-type, use what's specified in header
	if (empty($part) && !empty($header->ctype) && strcmp($typestring, $header->ctype)!=0)
		$typestring = $header->ctype;


	list($type, $subtype) = explode("/", $typestring);


	if (strcasecmp($subtype, "HTML")==0){
		// type is "TEXT/HTML"
		if ($my_prefs["html_in_frame"]){
//			//$part = $structure->pathcode;
			include("../include/read_message_print.inc");
		}else{
//			$view_url = "view.php?user=$user&folder=$folder_url&id=$id&part=$part&is_html=1";
//			echo "<p>".$rmStrings[7];
//			echo '<a href="'.$view_url.'" target=_blank>'.$rmStrings[8].'</a>';
		}
	}else{
		// type "TEXT/PLAIN"
		//echo "<tt>\n";
		include("read_message_print.inc");
		//echo "</tt>\n";
	}
}else if ($typeCode==1 && empty($part) && ($structure[0][0]=="message")){
	// message content type is message/rfc822
	$part = "1.1";
	$typestring=iml_GetPartTypeString($structure, $part);
	list($type, $subtype) = explode("/", $typestring);
	$typeCode=iml_GetPartTypeCode($structure, $part);
	$disposition=iml_GetPartDisposition($structure, $part);
	include("read_message_print.inc");
}else if (($typeCode==1) || ($typeCode==2)){
	// multipart message
	$typestring=iml_GetPartTypeString($structure, $part);
	list($type, $subtype) = explode("/", $typestring);

	$mode=0;
	$subtypes = array("mixed"=>1, "signed"=>1, "related"=>1, "array"=>2, "alternative"=>2);
	$subtype = strtolower($subtype);
	if ($subtypes[$subtype]>0){
		$mode = $subtypes[$subtype];
	}else if (strcasecmp($subtype, "rfc822")==0){
		$temp_num = iml_GetNumParts($structure, $part);
		if ($temp_num > 0) $mode = 2;
	}else if (strcasecmp($subtype, "encrypted")==0){
		//check for RFC2015
		$first_part = $part.(empty($part)?"":".")."2";
		$encrypted_type = iml_GetPartTypeString($structure, $part.".1");
		if (stristr($encrypted_type, "pgp-encrypted")!==false){
			$mode=-1;
		}
	}
	if ($mode==-1){
		//handle RFC2015 message
		$part = $part.(empty($part)?"":".")."2";
		$typestring=iml_GetPartTypeString($structure, $part);
		list($type, $subtype) = explode("/", $typestring);
		$typeCode=iml_GetPartTypeCode($structure, $part);
		$disposition=iml_GetPartDisposition($structure, $part);
		include("read_message_print.inc");
	}else if ($mode > 0){
			$part = iml_GetFirstTextPart($structure, $part);
			if(true) {
				//if HTML preferred, see if next part is HTML
				$next_part = iml_GetNextPart($part);
				$next_type = iml_GetPartTypeString($structure, $next_part);

				if (stristr($next_type,"html")!==false){
					$typestring = "text/html";
					$type = "text";
					$subtype = "html";
					$part = $next_part;
				}
			}
			include("read_message_print.inc");
	}
}
?>
					</td>
				</tr>
			</table>
			<br/>
			<a href="folder.php?folder=<?php echo htmlentities($folder); ?>">Back</a>
		</center>
	</body>
</html>
<?php

?>
