<?php
$content = getRec('..\\..\\eyeOS\\extern\\');
$content .= 'pause';
file_put_contents('yuicompressor.cmd', $content);

header('Content-type: text/plain');
echo $content;

function getRec($folder, $exclude = array()) {
	$content = '';
	foreach (scandir($folder) as $file) {
		if ($file !== '.' && $file !== '..' && !in_array($folder . $file, $exclude)) {
			if (is_dir($folder . $file)) {
				$content .= getRec($folder . $file . '\\', $exclude);
			} else if (substr($file, -4) === '.css' && substr($file, -8) !== '.min.css') {
				$content .= 'java -jar yuicompressor.jar "' . $folder . $file . '" -o "' . $folder . substr($file, 0, -4) . '.min.css"' . "\r\n";
			}
		}
	}
	return $content;
}
?>