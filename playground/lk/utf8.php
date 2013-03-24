<html>
	<head>
		<title></title>
	</head>
	<body>
		<pre contenteditable="true">
<?php
error_reporting(E_ALL ^ E_NOTICE);

$path = '../../eyeOS/branches/1.9';

$utf8funcs = array(
	'basename',
	'getExtension',
	'getFileName',
	'ireplace',
	'ltrim',
	'ord',
	'pathinfo',
	'rtrim',
	'str_pad',
	'str_split',
	'strcasecmp',
	'strcspn',
	'stristr',
	'strlen',
	'strpos',
	'strrev',
	'strrpos',
	'strspn',
	'strtolower',
	'strtoupper',
	'substr',
	'substr_replace',
	'trim',
	'ucfirst',
	'ucwords',
	'wordwrap'
);

$excludes = array();
foreach (array(
	'eyeOS/apps/eyeControl/default/newuser.eyecode | 84 | ord',                                // comment   : Password (again)
	'eyeOS/apps/eyeControl/default/newuser.eyecode | 90 | ord',                                // string    : Password (again)
	'eyeOS/apps/eyeControl/default/password.eyecode | 68 | ord',                               // comment   : New password (again)
	'eyeOS/apps/eyeControl/default/password.eyecode | 74 | ord',                               // string    : New password (again)
	'eyeOS/apps/eyeControl/events/account.eyecode | 24 | ord',                                 // function  : eyeControl_on_account_password($params = '')
	'eyeOS/apps/eyeDialog/func.eyecode | 479 | trim',                                          // function  : utf8_ltrim(strrchr($file,'.'),'.')
	'eyeOS/apps/eyeDock/modules/datetime.eyecode | 31 | substr',                               // javascript: e.target.id.substr(0,(%s).length)
	'eyeOS/apps/eyeFeeds/simplepie.eyecode',                                                   // library   : SimplePie
	'eyeOS/apps/eyeFTP/lib-local.eyecode | 158 | trim',                                        // function  : utf8_ltrim(strrchr($file,'.'),'.')
	'eyeOS/apps/eyeMail/class.phpmailer.php',                                                  // library   : PHPMailer
	'eyeOS/apps/eyeMail/class.smtp.php',                                                       // library   : PHPMailer
	'eyeOS/apps/eyeRename/app.eyecode | 31 | trim',                                            // function  : utf8_rtrim($params[0],'/') | function: utf8_rtrim($params[2],'/')
	'eyeOS/system/lib/eyeFileArchive/lib/Archive/MIME/Extension.eyecode | 283 | getExtension', // function  : getExtension($type)
	'eyeOS/system/lib/eyeFileArchive/lib/Archive/Predicate',                                   // library  : File_Archive
	'eyeOS/system/lib/eyeFileArchive/lib/Archive/Reader',                                      // library  : File_Archive
	'eyeOS/system/lib/eyeFileArchive/lib/Archive/Writer',                                      // library  : File_Archive
	'eyeOS/system/lib/eyeFileArchive/lib/Archive/Predicate.eyecode',                           // library  : File_Archive
	'eyeOS/system/lib/eyeFileArchive/lib/Archive/Reader.eyecode',                              // library  : File_Archive
	'eyeOS/system/lib/eyeFileArchive/lib/Archive/Writer.eyecode',                              // library  : File_Archive
	'eyeOS/system/lib/eyeFileArchive/lib/Archive.eyecode',                                     // library  : File_Archive
	'eyeOS/system/lib/eyeSockets/main.eyecode',                                                // library  : Net_Socket
	'eyeOS/system/lib/eyeString/replaces',                                                     // library   : PHP UTF-8
	'eyeOS/system/lib/eyeString/utils/unicode_util.eyecode',                                   // library   : PHP UTF-8
	'eyeOS/system/lib/eyeURL/main.eyecode',                                                    // comment   : password (string)
	'eyeOS/system/lib/eyeURL/main.eyecode | 815 | ord',                                        // comment   : password (string)
	'eyeOS/system/lib/eyeURL/main.eyecode | 1516 | strlen',                                    // function  : mb_strlen($postdata, 'iso-8859-1')
	'eyeOS/system/lib/eyeURL/main.eyecode | 1524 | strlen',                                    // function  : mb_strlen($this->_body, 'iso-8859-1')
	'eyeOS/system/lib/eyeURL/main.eyecode | 1780 | strlen',                                    // function  : mb_strlen($data, 'iso-8859-1')
	'eyeOS/system/lib/eyeURL/main.eyecode | 1824 | trim',                                      // function  : utf8_ltrim($headervalue)
	'eyeOS/system/lib/eyeURL/main.eyecode | 1912 | strlen',                                    // function  : mb_strlen($data, 'iso-8859-1')
	'eyeOS/system/lib/eyeXML/parsers/expat.eyecode | 100 | trim',                              // function  : utf8_rtrim($data,"\t\n\r")
	'eyeOS/system/lib/eyeZip/main.eyecode | 5160 | ord',                                       // comment   : Record (Hex)
	'eyeOS/system/lib/simpleZip/main.eyecode',                                                 // library   : zipfile (GFM package)
	'eyeOS/system/services/vfs/modules/real.eyecode | 2125 | getExtension',                    // function  : service_vfs_real_getExtension($params)
	'eyeOS/system/services/vfs/modules/real.eyecode | 2143 | getExtension',                    // function  : _getExtension($path)
	'eyeOS/system/services/vfs/modules/real.eyecode | 2148 | getExtension',                    // function  : _getExtension($path)
	'eyeOS/system/services/vfs/modules/real.eyecode | 2164 | getExtension',                    // function  : service_vfs_getExtension($params)
	'eyeOS/system/services/vfs/modules/real.eyecode | 2229 | getExtension',                    // function  : _getExtension($path)
	'eyeOS/system/services/vfs/modules/virtual.eyecode | 1991 | getExtension',                 // function  : service_vfs_real_getExtension($params)
	'eyeOS/system/services/vfs/modules/virtual.eyecode | 2009 | getExtension',                 // function  : _getExtension($path)
	'eyeOS/system/services/vfs/modules/virtual.eyecode | 2014 | getExtension',                 // function  : _getExtension($path)
	'eyeOS/system/services/vfs/modules/virtual.eyecode | 2030 | getExtension',                 // function  : service_vfs_getExtension($params)
	'eyeOS/system/services/vfs/modules/virtual.eyecode | 2092 | getExtension',                 // function  : _getExtension($path)
	'eyeOS/xml-rpc',                                                                           // library   : XML-RPC
) as $exclude) {
	$excludes[] = $path . '/' . $exclude;
}

$checkFolder = checkFolder($path, $utf8funcs, $excludes);
if ($checkFolder) {
	echo $checkFolder;
} else {
	echo 'No missing utf8 functions found.';
}

function checkFile($path, $utf8funcs, $excludes, $depth) {
	$echo = '';
	$i = 1;
	foreach (explode("\n", str_replace("\r", "\n", str_replace("\r\n", "\n", file_get_contents($path)))) as $line) {
		if ($line && strpos($line, '(') && !in_array($path . ' | ' . $i, $excludes)) {
			$line = implode('(', array_map('trim', explode('(', $line)));
			foreach ($utf8funcs as $utf8func) {
				if (!in_array($path . ' | ' . $utf8func, $excludes) && !in_array($path . ' | ' . $i . ' | ' . $utf8func, $excludes)) {
					$native = count(explode($utf8func . '(', $line));
					$utf8 = count(explode('utf8_' . $utf8func . '(', $line));
					if ($native - $utf8 > 1) {
						$echo .= str_pad('', $depth, "\t") . 'Line ' . $i . ', Function "' . $utf8func . '" (' . ($native - $utf8) . ')' . "\n";
					} else if ($native - $utf8 > 0) {
						$echo .= str_pad('', $depth, "\t") . 'Line ' . $i . ', Function "' . $utf8func . '"' . "\n";
					}
				}
			}
		}
		$i++;
	}
	return $echo;
}

function checkFolder($path, $utf8funcs, $excludes, $depth = 0) {
	$echo = '';
	$path .= '/';
	foreach (scandir($path) as $element) {
		if ($element{0} != '.' && !in_array($path . $element, $excludes)) {
			if (is_dir($path . $element)) {
				$checkFolder = checkFolder($path . $element, $utf8funcs, $excludes, $depth + 1);
				if ($checkFolder) $echo .= str_pad('', $depth, "\t") . $element . '/' . "\n" . $checkFolder;
			} else if (substr($element, -8) == '.eyecode' || substr($element, -4) == '.inc' || substr($element, -4) == '.php') {
				$checkFile = checkFile($path . $element, $utf8funcs, $excludes, $depth + 1);
				if ($checkFile) $echo .= str_pad('', $depth, "\t") . $element . "\n" . $checkFile;
			}
		}
	}
	return $echo;
}
?>
		</pre>
	</body>
<html>