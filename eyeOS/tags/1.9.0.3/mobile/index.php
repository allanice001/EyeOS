<?php
/*
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

             eyeOS Engineering Team - www.eyeos.org/team

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2009 eyeOS Team (team@eyeos.org)
*/

define('INDEX_TYPE','mobile');
if(!defined('EYE_INDEX')){
	include_once('../index.php');
}

//Check if index.php is being used to load images/files from extern directory
if (isset($_GET['extern'])) {
		$myExtern = $_GET['extern'];
		//get the type for the header content-type
		if(isset($_GET['type'])) {
			$type = $_GET['type'];
		} else {
			$type = "";
		}
		//call to extern to throw the file
		//Only start session if we already have a session (keep in mind that extern doesn't have session)
		reqLib('eyeSessions','checkAndSstartSession');
		service('extern','getFile',array($myExtern,$type),1);
} else {
	//Loading eyeWidgets definitions
	reqLib('eyeWidgets','loadWidgets');

	//Starting a simple session
	reqLib('eyeSessions','startSession');

	//If widget table does not exist, create it 
	reqLib('eyeWidgets','checkTable');

	//if there are a shorturl in the url, like index.php/file
	if(isset($_SERVER['PATH_INFO'])) {
		$myInfo = $_SERVER['PATH_INFO'];
		if($myInfo{0} == '/') {
			$myInfo = utf8_substr($myInfo,1,utf8_strlen($myInfo));
		}
	} else {
		$myInfo="";
	}
	//if a shorturl is present
	if(!empty($myInfo)) {
		//check if the shorturl exists, and get the msg and checknum associated to it
		if(is_array($_SESSION['shortUrls'][$myInfo])) {
			$msg = $_SESSION['shortUrls'][$myInfo]['msg'];
			$checknum = $_SESSION['shortUrls'][$myInfo]['checknum'];
			$_GET['msg'] = $msg;
			$_REQUEST['msg'] = $msg;
			$_GET['checknum'] = $checknum;
			$_REQUEST['checknum'] = $checknum;
		}
	}
	//Checking if checknum and message are set
	if(isset($_GET['checknum']) && !empty($_GET['checknum'])) {
		if(isset($_REQUEST['params']) && !empty($_REQUEST['params'])) {
			$params = $_REQUEST['params'];
		} else {
			$params = null;
		}
		if(isset($_GET['msg'])) {
			$msg = $_GET['msg'];
		} else {
			$msg = null;
		}
		$array_msg = array($_GET['checknum'],$msg,$params);
		echo service('mmap','routemsg',$array_msg);
	} else {
		//if a ping response is received
		if(isset($_GET['msg']) && $_GET['msg'] == 'ping') {
			//throw a pong!
			header("Content-type:text/xml");//override header type
			echo "<eyeMessage><action><task>pong</task></action></eyeMessage>";
			$_SESSION['ping'] = time();
			exit;
		}
		//Loading the Mobile eyeOS code
		include_once("../mobile/mobile_eyeFiles.eyecode");
	}
}

?>