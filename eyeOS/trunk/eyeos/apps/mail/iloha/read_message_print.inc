<?php
				include_once('ryosimap.inc');

				/* figure out the body part's type */

					if (empty($typestring) || empty($type) || empty($subtype)){
						$typestring=iml_GetPartTypeString($structure, $part);
						list($type, $subtype) = explode("/", $typestring);
					}

				/* fetch body part */
					$body = iil_pop::iil_C_FetchPartBody($conn, $folder, $id, $part);

					//return;
				/* decode body part */
					$encoding=iml_GetPartEncodingCode($structure, $part);
					
					if ($encoding == 3 ) $body=base64_decode($body);
					else if ($encoding == 4) $body=quoted_printable_decode($body);

//				/* detect HTML */
//					if (eregi("^<!DOCTYPE", $body) && eregi("<html>", $body)){
//						if ($my_prefs["html_in_frame"]){
//							$subtype = "html";
//						}else{
//							$body = "";
//							$view_url = "view.php?user=$user&folder=$folder_url&id=$id&part=$part&is_html=1";
//							echo "<p>".$rmStrings[7];
//							echo '<a href="'.$view_url.'" target=_blank>'.$rmStrings[8].'</a>';
//						}
//					}

				/* check if UTF-8 */

					$charset=iml_GetPartCharset($structure, $part);
					if (empty($charset)){
						$part_header = iil_pop::iil_C_FetchPartHeader($conn, $folder, $id, $part);
						$pattern = "/charset=[\"]?([a-zA-Z0-9_-]+)[\"]?/";
						preg_match($pattern, $part_header, $matches);
						if (count($matches)==2) $charset = $matches[1];
					}

					if (strcasecmp($charset, "utf-8")==0){
						include_once("utf8.inc");
						$is_unicode = true;
						//$body = utf8ToUnicodeEntities($body);
					}else if (preg_match("/#[0-9]{5};/", $body)){
						//look for unicode that look like #12345; (without '&')
						$body = preg_replace("/(?<!&)(#[0-9]{5};)/", "&$1", $body);
						$is_unicode = false;
					}else{
						$is_unicode = false;
					}

				/* run through character encoding engine */
					$body=LangConvert($body, 'UTF-8', $charset);
				/* dump! */
//					echo "<p>";
					/* quote colorization */
					$process = 0;
//					echo "<p>".nl2br($body);
					return "<p>" . nl2br($body);
?>
