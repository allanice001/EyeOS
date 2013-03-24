<?php
$content = getRec('..\\..\\eyeOS\\extern\\');
$content .= 'pause';
file_put_contents('compiler.cmd', $content);

header('Content-type: text/plain');
echo $content;

function getRec($folder, $exclude = array()) {
	$content = '';
	foreach (scandir($folder) as $file) {
		if ($file !== '.' && $file !== '..' && !in_array($folder . $file, $exclude)) {
			if (is_dir($folder . $file)) {
				$content .= getRec($folder . $file . '\\', $exclude);
			} else if (substr($file, -3) === '.js' && substr($file, -7) !== '.min.js') {
				$content .= 'java -jar compiler.jar --js "' . $folder . $file . '" --js_output_file "' . $folder . substr($file, 0, -3) . '.min.js"' . "\r\n";
			}
		}
	}
	return $content;
}
?>