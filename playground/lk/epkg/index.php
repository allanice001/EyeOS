<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="content-type" content="application/xhtml+xml; charset=UTF-8" />
		<title>"epkg" filetype library</title>
	</head>
	<body>
		<br />
		<form action="index.php" method="get">
			<div>
				<input name="do" type="hidden" value="encode" />
				<input type="submit" value="Encode &quot;archive.epkg&quot; from &quot;input&quot;" />
			</div>
		</form>
		<br />
		<br />
		<form action="index.php" method="get">
			<div>
				<input name="do" type="hidden" value="decode" />
				<input type="submit" value="Decode &quot;archive.epkg&quot; to &quot;output&quot;" />
			</div>
		</form>
		<br />
		<br />
		<form action="index.php" method="get">
			<div>
				<input name="do" type="hidden" value="targz" />
				<input type="submit" value="Extract &quot;archive.tar.gz&quot; to &quot;output&quot;" />
			</div>
		</form>
		<br />
		<br />
		<div>
			<?php
			error_reporting(E_ALL);
			ini_set('max_execution_time',0);
			set_time_limit(0);
			if (isset($_REQUEST['do'])) {
				if ($_REQUEST['do'] == 'decode') {
					include_once('epkg.php');
					$time = microtime(1);
					$epkg = new epkg(array(
						'decodeCompress' => false,
						'decodeDest' => './output/',
						'decodeSource' => './archive.epkg'
					));
					$epkg->decode();
					echo 'Decoded "archive.epkg" to "output" in ' . (microtime(1) - $time) . ' seconds.';
					if ($epkg->getError()) {
						echo '<br />' . $epkg->getError();
					}
					echo '<br />' . str_replace("\n",'<br />',str_replace(' ','&nbsp;',print_r($epkg->listAll(),true)));
				} elseif ($_REQUEST['do'] == 'encode') {
					include_once('epkg.php');
					$time = microtime(1);
					$epkg = new epkg(array(
						'encodeCompress' => false,
						'encodeDest' => './archive.epkg',
						'encodeSource' => './input/'
					));
					$epkg->encode();
					echo 'Encoded "archive.epkg" from "input" in ' . (microtime(1) - $time) . ' seconds.';
					if ($epkg->getError()) {
						echo '<br />' . $epkg->getError();
					}
					echo '<br />' . str_replace("\n",'<br />',str_replace(' ','&nbsp;',print_r($epkg->listAll(),true)));
				} elseif ($_REQUEST['do'] == 'targz') {
					include_once('pcl-tar.php');
					$time = microtime(1);
					PclTarExtract('archive.tar.gz','./output/','','tgz');
					echo 'Extracted "archive.tar.gz" to "output" in ' . (microtime(1) - $time) . ' seconds.';
				}
				
				/*
				decodeCompress == false	: 18 to 20 seconds
				decodeCompress == true	: 18 to 20 seconds
				encodeCompress == false	: 5 to 7 seconds
				encodeCompress == true	: 8 to 14 seconds
				targz extracting takes about 37 to 41 seconds
				*/
			}
			?>
		</div>
	</body>
</html>