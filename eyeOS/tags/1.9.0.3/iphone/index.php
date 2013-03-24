<?php
/**
                                  ____   _____ 
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___  
                 / _ \ | | |/ _ \ |  | |\___ \ 
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/ 
                       __/ |                   
                      |___/              1.9

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - eyeOS.org/whoarewe

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2008 eyeOS Team (team@eyeos.org)
**/
define('INDEX_TYPE','iphone');

if(!defined('EYE_INDEX')){
	//Maybe a redirection here?
	include_once('../index.php');
}
$_POST = arrayToUtf8($_POST);
$_GET = arrayToUtf8($_GET);
$_REQUEST = arrayToUtf8($_REQUEST);
// arrayToUtf8(&$_COOKIE);
include_once('../settings.php');

chdir('../'.REAL_EYE_ROOT);

//Loaded before kernel for kernel utf8 compatibility
include_once(EYE_ROOT.'/'.SYSTEM_DIR.'/'.LIB_DIR.'/eyeString/main'.EYE_CODE_EXTENSION);
call_user_func('lib_eyeString_start');
//setting library loaded
define('LIB_'.utf8_strtoupper('eyeString').'_LOADED',1);

//Loading the Kernel
include_once(EYE_ROOT.'/'.SYSTEM_DIR.'/'.KERNEL_DIR.'/kernel'.EYE_CODE_EXTENSION);

//Loading the service configuration from XML
loadServiceConfig();

define('IPHONE_PATH','../iphone/');

//Hiding warnings and notices if Debug Mode is Off
if(EYEOS_DEBUG_MODE == 0) {
	error_reporting(0);
} elseif(EYEOS_DEBUG_MODE == 2) {
	error_reporting(E_ALL);
}else {
	error_reporting(E_ERROR); //TODO: SUPPORT E_ALL
}

//Loading the Error Codes
reqLib('errorCodes','loadCodes');
//load pear library class
reqLib('eyePear','loadPear');

//Setting the Running Log check var to 0
global $LOG_RUNNING;
$LOG_RUNNING = 0;

//Loading the Security Service (sec) if eyeOS Security is turned on (by default is On)
if(EYEOS_SECURITY == 1) {
	service('sec','start');
}

//set the default charset
ini_set('default_charset', DEFAULT_CHARSET);

session_start();

include_once(IPHONE_PATH.'lib/message.eyecode');

if(isset($_SESSION['auth']) && $_SESSION['auth'] == 1) {
	global $currentUser;
	$currentUser = $_SESSION['user'];
}
if(!isset($_GET['action'])) {
	require_once(IPHONE_PATH.'top.eyecode');
	if(isset($_SESSION['auth']) && $_SESSION['auth'] == 1) {
		require_once(IPHONE_PATH.'apps/eyeMenu/app.eyecode');
		eyeMenu_execute();
	} else {
		require_once(IPHONE_PATH.'apps/login/app.eyecode');
		login_execute();
	}
	require_once(IPHONE_PATH.'bottom.eyecode');
} else {
	if(!isset($_SESSION['auth']) || $_SESSION['auth'] == 0) {
		require_once(IPHONE_PATH.'top.eyecode');
		if ($_GET['action']=='login' && $_GET['do']=='login') {
			require_once(IPHONE_PATH.'apps/login/events.eyecode');
			call_user_func('login_login');
		} else {
			require_once(IPHONE_PATH.'apps/login/app.eyecode');
			login_execute();
		}
		require_once(IPHONE_PATH.'bottom.eyecode');
	} else {
		$action = utf8_basename($_GET['action']);
		if (isset($_GET['noPropagate']) && $_GET['noPropagate']== 2) {
			require_once(IPHONE_PATH.'top_back.eyecode');
		}
		if(file_exists(IPHONE_PATH.'apps/'.$action.'/app.eyecode')) {
			if(!isset($_GET['do'])) {
				require_once(IPHONE_PATH.'apps/'.$action.'/app.eyecode');
				call_user_func($action.'_execute');
			} else {
				$func = utf8_basename($_GET['do']);
				require_once(IPHONE_PATH.'apps/'.$action.'/events.eyecode');
				if(function_exists($action.'_'.$func)) {
					call_user_func($action.'_'.$func);
				} else {
					msgIphone(array('title' => 'Error', 'content' => 'Undefined Error'));
				}
			}
		} else {
			require_once(IPHONE_PATH.'404.eyecode');
		}
		if(isset($_GET['noPropagate']) && $_GET['noPropagate']== 2) {
			require_once(IPHONE_PATH.'bottom.eyecode');
		}
	}
}


function arrayToUtf8($array = null) {
	foreach($array as $key=>$value){
		if(!is_array($value)){
			$array[$key] = utf8_encode($value);
		}else{
			$array[$key] = arrayToUtf8($value);
		}
	}
	return $array;
}
?>