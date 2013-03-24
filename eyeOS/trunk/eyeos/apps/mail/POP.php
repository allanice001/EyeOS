<?php
/*
*                 eyeos - The Open Source Cloud's Web Desktop
*                               Version 2.0
*                   Copyright (C) 2007 - 2010 eyeos Team 
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License
* version 3 along with this program in the file "LICENSE".  If not, see 
* <http://www.gnu.org/licenses/agpl-3.0.txt>.
* 
* See www.eyeos.org for more details. All requests should be sent to licensing@eyeos.org
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* eyeos" logo and retain the original copyright notice. If the display of the 
* logo is not reasonably feasible for technical reasons, the Appropriate Legal Notices
* must display the words "Powered by eyeos" and retain the original copyright notice. 
*/

require_once 'iloha/pop3.inc';
require_once 'iloha/icl_commons.inc';


class POP implements IMailBoxProtocol {

	private $conn; //provider to save mails in database

	function __construct(AccountTO $accountTO) {
		//$this->conn = $this->connection($accountTO);
	}

	private function connection (AccountTO $accountTO) {

		$server = $accountTO->getMailBoxServer();
		$user = $accountTO->getMailBoxUserName();
		$password = $accountTO->getMailBoxPassword();
		$ssl = $accountTO->getMailBoxSecure();
		$port = $accountTO->getMailBoxPort();

		global $ICL_SSL;
		$ICL_SSL = $ssl;
		global $ICL_PORT;
		$ICL_PORT = $port;
		$conn = iil_pop::iil_Connect($server, $user, $password);
		//var_dump($conn);
		if (!$conn) {
			return false;
			exit;
		}
		return $conn;
	}
	
	public function getNewMails(AccountTO $accountTO) {

		$folder = 'INBOX';

		$server = $accountTO->getMailBoxServer();
		$port = $accountTO->getMailBoxPort();
		$user = $accountTO->getMailBoxUserName();
		$password = $accountTO->getMailBoxPassword();
		$secure = $accountTO->getMailBoxSecure();
		$lastReceived = $accountTO->getLastReceived();
		$NewlastReceived = $lastReceived;
		$currentDate = time();

		global $ICL_SSL;
		$ICL_SSL = $secure;
		global $ICL_PORT;
		$ICL_PORT = $port;

		$conn = iil_pop::iil_Connect($server, $user, $password, $secure, $port);

		if (!$conn) {
			throw new EyeException('Unable to connect to server');
			exit;
		}
		$total_num = iil_pop::iil_C_CountMessages($conn, $folder);
		
		while ($lastReceived < $currentDate && $total_num > 0) {

			$range = $total_num . ':'. $total_num;
			$headers = iil_pop::iil_C_FetchHeaders($conn, $folder, $range);

			foreach($headers as $header) {
				$currentDate = $header->timestamp;
				if ($currentDate > $lastReceived) {
					$mailTO = new MailTO();

					$mailTO->setMessageId($header->messageID);
					$mailTO->setAccountId($accountTO->getId());
					$mailTO->setFromName($header->from);
					$mailTO->setToName($header->to);
					$mailTO->setCc($header->cc);
					$mailTO->setDateTime($header->timestamp); //OJO
					$mailTO->setSubject($header->subject);
					$mailTO->setBodyHtml($header->bodyHtml);
					$mailTO->setBodyText($header->bodyTxt);
					
					$mailTO->setHeader($header->raw_header);
					$mailTO->setReaded('false');

					$mail = new MailObject($mailTO);
					$mail->setAttachments($header->attachments);

					$mails[] = $mail;

					if ($currentDate > $NewlastReceived) {
						$NewlastReceived = $currentDate;
					}
				}
				$total_num--;
			}
		}


		//now, i delete mails in server (only in POP)
		//iil_pop::iil_C_Delete($conn, $folder, $range);
		
		return array('mails' => $mails, 'newDate' => $NewlastReceived) ;
	}

	public function removeMail(MailTO $mail) {
	}

	public function markMailAsReaded(MailTO $mail) {
	}

	public function retrieveAllLabelsPerMailTO($mailId) {
		//retrieve all mailboxes (Labels in this application)
	}

	public function getRawFolders() {
//		$folders = iil_C_ListMailboxes($this->conn,"","*");
//
////		if(!$folders || !is_array($folders)) {
////			echo 'There is no folders in your imap account!';
////			exit;
////		}
//
//		$delim = iil_C_GetHierarchyDelimiter($this->conn);
//		$folder_container = array();
//		$containers = array();
//
//		foreach($folders as $k=>$path) {
//			while (false !== ($pos = strrpos($path, $delim))) {
//
//				$container = substr($path, 0, $pos);
//				//var_dump($container);
//				//esto indica que carpetas tienen subcarpeta
//				//if ($containers[$container]!=1) {
//					$containers[$container]=1;
//				//}
//				//va rellenando el array con la herarquia
//				$folder_container[$path] = $container;
//				$path = substr($path, 0, $pos);
//			}
//		}
//
//		reset($containers);
//		//si un elemento es padre de otro, tiene que estar dentro de folders.
//		//ejemplo:
//		//b/c/d es posible que no nos desolviesen 'c' en listmailboxes.
//		foreach($containers as $container=>$v) {
//			if (!$this->InArray($folders,$container)) {
//				array_push($folders, $container);
//			}
//		}
//
//		natcasesort($folders);
//
//		//echo '<h2>IMAP Folders('.count($folders).'):</h2><br/>';
//		$foldersToReturn = array();
//		foreach($folders as $value) {
////			$unseen = iil_C_CountUnseen($conn, $value);
////			if($unseen && $unseen > 0) {
////				$unseen_str = "<b>&nbsp;&nbsp;(".$unseen.")</b>";
////			} else {
////				$unseen_str = "";
////			}
//			$foldersToReturn[] = iil_utf7_decode($value);
////			echo '<a style="font-family:Verdana;color:#222222;margin-bottom:3px;text-decoration:none" href="folder.php?folder='.urlencode(iil_utf7_decode($value)).'">'.iil_utf7_decode($value).$unseen_str.'</a><br/>';
//				//return array of Folders in server
//		}
//		return $foldersToReturn;

		return true;
	}

	public function createFolder($path) {
		//iil_C_CreateFolder($this->conn, $path);
		//create a folder in imap server
	}

	public function editFolder($pathOld, $pathNew) {
		//iil_C_RenameFolder($this->conn, $pathOld, $pathNew);
	}

	public function removeFolder($path) {
		//iil_C_DeleteFolder($this->conn, $path);
	}

	private function InArray ($array, $item) {
//		if (!is_array($array)) return false;
//		else if (strcasecmp($item, "inbox")==0) return false;
//		else return in_array($item, $array);
	}
}
?>
