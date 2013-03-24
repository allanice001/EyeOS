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

abstract class MailApplication extends EyeosApplicationExecutable {

	public static function __run(AppExecutionContext $context, MMapResponse $response) {
//		if ($context->getIncludeBody()) {
			//now append javascript files
			$buffer = '';

			$itemsPath = EYE_ROOT . '/' . APPS_DIR . '/mail/js';
			
			$buffer .= file_get_contents($itemsPath . '/eyeos.applications.mail.Account.js');
			$buffer .= file_get_contents($itemsPath . '/eyeos.applications.mail.NewAccountWindow.js');
			$buffer .= file_get_contents($itemsPath . '/eyeos.applications.mail.AccountSettingsWindow.js');
			$buffer .= file_get_contents($itemsPath . '/eyeos.applications.mail.TagsWindow.js');
			$buffer .= file_get_contents($itemsPath . '/eyeos.applications.mail.NewMailWindow.js');

			$buffer .= file_get_contents($itemsPath . '/utils.js');
			$buffer .= file_get_contents($itemsPath . '/applications.mail.Table.js');

			$buffer .= file_get_contents($itemsPath . '/genericbar.both.Actions.js');
			$buffer .= file_get_contents($itemsPath . '/genericbar.menubar.Items.js');
			$buffer .= file_get_contents($itemsPath . '/genericbar.toptoolbar.Items.js');
			
			$buffer .= file_get_contents($itemsPath . '/newmail.toolbar.Actions.js');
			$buffer .= file_get_contents($itemsPath . '/newmail.menubar.Items.js');
			$buffer .= file_get_contents($itemsPath . '/newmail.toolbar.top.Items.js');
			$buffer .= file_get_contents($itemsPath . '/newmail.toolbar.bottom.Items.js');

			$response->appendToBody($buffer);
//		}
	}

	public static function getTree() {

		//get Basic Folders
		$results = self::getAllFolders(0);

		//get Accounts Folders
		$tempAccounts = self::getAllAccountsTO();

		//get Accounts
		if (isset($tempAccounts)) {
			foreach ($tempAccounts as $currentAccount) {
				$results[] = array(
						'id' => $currentAccount->getId(),
						'name' => $currentAccount->getDescription(),
						'added' => 0,
						'path' => $currentAccount->getDescription(),
						'typeAccount' => $currentAccount->getTypeMailBox(),
						'subfolders' => self::getAllFolders($currentAccount->getId()) //get All Folders in accounts
				);
			}
		}

		//get Local Tags
		$results[] = array(
				'id' => '0',
				'name' => 'Local Tags',
				'path' => 'Local Tags',
				'added' => 0,
				'subfolders' => self::getAllLocalTags()
		);
		return $results;
	}

	public static function getAllLocalTags() {

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$tempResults = $mailController->getAllTags($currentUserId);
		if (count($tempResults) == 0) {
			$results = null;
		} else {
			foreach ($tempResults as $result) {
				$results[] = array(
						'id' => $result->getId(),
						'name' => $result->getName(),
						'path' => $result->getName(),
						'added' => 0,
						'color' => $result->getColor(),
						'type' => 'localTag'

				);

			}
			//$results = self::array_natsort($results,'name', 'name');
		}

		//print_r($results);
		return $results;

	}

	public static function getAllFolders($params = null) {
		//$params = $accountId

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$tempResults = $mailController->getAllFolders($currentUserId, $params);
		if (count($tempResults) == 0) {
			$results = null;
		} else {
			foreach ($tempResults as $result) {

				$results[] = array(
						'id' => $result->getId(),
						'path' => $result->getPath(),
						'name' => $result->getName(),
						'added' => 0,
						'type' => 'folder'
				);

			}
		}
		return $results;
	}


	public static function getAllAccountsTO() {
		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);
		$tempResults = $mailController->getAllAccountsTO($currentUserId);
		//var_dump($tempResults);
		if (isset($tempResults)) {
			foreach ($tempResults as $result) {
				$results[] = array(
						'id' => $result->getId(),
						'name' => $result->getDescription(),
						'type' => 'account'
				);

			}
		}

		return $tempResults;
	}

	public static function syncFolders() {
		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);
		//$result = $mailController->syncFolders($currentUserId);
		$result = false;
		return $result;
	}

	public static function createFolder($params) {
		$name = $params[0];
		$path = $params[1];
		$accountId = $params[2];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);
		$mailController->createFolder($currentUserId, $name, $path, $accountId);

	}

	public static function removeFolder($params) {
		$id = $params[0];
		$name = $params[1];
		$path = $params[2];
		$accountId = $params[3];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$folder = new Folder();
		$folder->setId($id);
		$folder->setAccount($accountId);
		$folder->setName($name);
		$folder->setPath($path);
		$folder->setUserId($currentUserId);

		$mailController->removeFolder($folder);
	}

	public static function editFolder($params) {
		$id = $params[0];
		$name = $params[1];
		$path = $params[2];
		$newPath = $params[3];
		$accountId = $params[4];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$folderOld = new Folder();
		$folderOld->setId($id);
		$folderOld->setAccount($accountId);
		$folderOld->setName($name);
		$folderOld->setPath($path);
		$folderOld->setUserId($currentUserId);

		$folderNew = new Folder();
		$folderNew->setId($id);
		$folderNew->setAccount($accountId);
		$folderNew->setName(basename($newPath));
		$folderNew->setPath($newPath);
		$folderNew->setUserId($currentUserId);

		$mailController->editFolder($folderOld, $folderNew);
	}

	public static function createTag($params) {
		$name = $params[0];
		$color = $params[1];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);
		$newTag = $mailController->createTag($color, $name, $currentUserId);

		$results[] = array(
						'id' => $newTag->getId(),
						'name' => $newTag->getName(),
						'color' => $result->getColor(),
						'type' => 'localTag'
				);
		
		return $results;
	}

	public static function removeTag($params) {
		$id = $params[0];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$tag = new LocalTag();
		$tag->setId($id);

		$mailController->removeTag($tag, $currentUserId);
	}
	
	public static function editTag($params) {
		$id = $params[0];
		$nameNew = $params[1];
		$colorNew = $params[2];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$tag = new LocalTag();
		$tag->setId($id);
		$tag->setName($nameNew);
		$tag->setColor($colorNew);
		$tag->setUserId($currentUserId);

		$mailController->editTag($tag);
	}

	public static function createAccount($params) {

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$userId = $currentUserId; //Eyeos User ID
		$mail = $params[0]; // mail address of account
		$nameOfUser = $params[1]; // Name of Person (ex.: John Smith)
		$description = $params[2]; //Short description

		//MailBox
		$typeMailBox = $params[3]; // 'POP' or 'IMAP', etc...
		$mailBoxUserName = $params[4];
		$mailBoxPassword = $params[5];
		$mailBoxServer = $params[6];
		$mailBoxPort = $params[7];
		$mailBoxSecure = $params[8];

		//Sender
		$typeSender = $params[9]; //SMTP, etc....
		$senderUserName = $params[10];
		$senderPassword = $params[11];
		$senderServer = $params[12];
		$senderPort = $params[13];
		$senderSecure = $params[14]; //true or false

		$accountTO = new AccountTO();

		$provider = new SQLAccountProvider();
		$id = $provider->getMaxId() + 1;
		$accountTO->setId($id);
		$accountTO->setUserId($userId);
		$accountTO->setMail($mail);
		$accountTO->setNameOfUser($nameOfUser);
		$accountTO->setDescription($description);
		$accountTO->setTypeMailBox(strtolower($typeMailBox));
		$accountTO->setMailBoxUserName($mailBoxUserName);
		$accountTO->setMailBoxPassword($mailBoxPassword);
		$accountTO->setMailBoxServer($mailBoxServer);
		$accountTO->setMailBoxPort($mailBoxPort);
		$accountTO->setMailBoxSecure($mailBoxSecure);
		$accountTO->setTypeSender(strtolower($typeSender));
		$accountTO->setSenderUserName($senderUserName);
		$accountTO->setSenderPassword($senderPassword);
		$accountTO->setSenderServer($senderServer);
		$accountTO->setSenderPort($senderPort);
		$accountTO->setSenderSecure($senderSecure);

		$account = new Account($accountTO);

		$mailController->newAccount($account);

		//now create basic folders of this new account
		$inbox = array('INBOX', 'INBOX', $id);
		self::createFolder($inbox);

		$trash = array('Deleted Messages', 'Deleted Messages', $id);
		self::createFolder($trash);

		$sent = array('Sent Messages', 'Sent Messages', $id);
		self::createFolder($sent);

		return $id;
	}

	public static function editAccount($params) {

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$id = $params[0];
		$userId = $currentUserId; //Eyeos User ID
		$mail = $params[1]; // mail address of account
		$nameOfUser = $params[2]; // Name of Person (ex.: John Smith)
		$description = $params[3]; //Short description

		//MailBox
		$typeMailBox = $params[4]; // 'POP' or 'IMAP', etc...
		$mailBoxUserName = $params[5];
		$mailBoxPassword = $params[6];
		$mailBoxServer = $params[7];
		$mailBoxPort = $params[8];
		$mailBoxSecure = $params[9];

		//Sender
		$typeSender = $params[10]; //SMTP, etc....
		$senderUserName = $params[11];
		$senderPassword = $params[12];
		$senderServer = $params[13];
		$senderPort = $params[14];
		$senderSecure = $params[15]; //true or false

		$accountTO = new AccountTO();
		$accountTO->setId($id);
		$accountTO->setUserId($currentUserId);
		$accountTO->setMail($mail);
		$accountTO->setNameOfUser($nameOfUser);
		$accountTO->setDescription($description);
		$accountTO->setTypeMailBox(strtolower($typeMailBox));
		$accountTO->setMailBoxUserName($mailBoxUserName);
		$accountTO->setMailBoxPassword($mailBoxPassword);
		$accountTO->setMailBoxServer($mailBoxServer);
		$accountTO->setMailBoxPort($mailBoxPort);
		$accountTO->setMailBoxSecure($mailBoxSecure);
		$accountTO->setTypeSender(strtolower($typeSender));
		$accountTO->setSenderUserName($senderUserName);
		$accountTO->setSenderPassword($senderPassword);
		$accountTO->setSenderServer($senderServer);
		$accountTO->setSenderPort($senderPort);
		$accountTO->setSenderSecure($senderSecure);

		$account = new Account($accountTO);


		$mailController->updateAccount($account);
		return true;
	}

	public static function removeAccount($params) {

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$id = $params;

		$accountTO = new AccountTO();
		$accountTO->setId($id);

		$account = new Account($accountTO);

		$mailController->removeAccount($account);
		return true;
	}

	public static function getAllAccounts($params = null) {
		//$params = $accountId

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$tempResults = $mailController->getAllAccountsTO($currentUserId);
		if (count($tempResults) == 0) {
			$results = null;
		} else {
			foreach ($tempResults as $result) {
				$results[] = array(
						'id' => $result->getId(),
						'mail' => $result->getMail(),
						'name' => $result->getNameOfUser(),
						'description' => $result->getDescription(),
						'typemailbox' => $result->getTypeMailBox(),
						'mbusername' => $result->getMailBoxUserName(),
						'mbpassword' => $result->getMailBoxPassword(),
						'mbserver' => $result->getMailBoxServer(),
						'mbport' => $result->getMailBoxPort(),
						'mbsecure' => $result->getMailBoxSecure(),
						'typesender' => $result->getMailBoxUserName(),
						'senderusername' => $result->getSenderUserName(),
						'senderpassword' => $result->getSenderPassword(),
						'senderserver' => $result->getSenderServer(),
						'senderport' => $result->getSenderPort(),
						'sendersecure' => $result->getSenderSecure()
				);
			}
		}
		return $results;
	}

	public static function getConversationsInFolder($params) {
		$folders = $params[0];
		$pageNumber = $params[1];

		if (count($folders) == 0 || $pageNumber <= 0) {
			return null;
		}

		$results = array();
		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$tempResults = $mailController->getConversationsInFolder($folders, $pageNumber);
		if (count($tempResults) == 0) {
			$results = null;
		} else {
			foreach ($tempResults as $result) {
				$results[] = array(
						'id' => $result->getId(),
						'star' => $result->getStarred(),
						'date' => date("j.n.Y H:i",$result->getDate()),
						'from' => $result->getFrom(),
						'tags' => $result->getTags(),
						'tagsNames' => $result->getTagsNames(),
						'subject' => $result->getSubject(),
						'attachments' => $result->getNumberOfAttachments(),
						'unread' => $result->getUnreadMessages(),
						'messages' => $result->getNumberOfMessages()
				);
			}
		}
		return $results;
	}

	public static function getConversationsInLocalTag($params) {
		$tags = $params[0];
		$pageNumber = $params[1];

		if (count($tags) == 0 || $pageNumber <= 0) {
			return null;
		}

		$results = array();
		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$tempResults = $mailController->getConversationsInLocalTag($tags, $pageNumber);
		if (count($tempResults) == 0) {
			$results = null;
		} else {
			foreach ($tempResults as $result) {
				$results[] = array(
						'id' => $result->getId(),
						'star' => $result->getStarred(),
						'date' => date("j.n.Y H:i",$result->getDate()),
						'from' => $result->getFrom(),
						'tags' => $result->getTags(),
						'tagsNames' => $result->getTagsNames(),
						'subject' => $result->getSubject(),
						'attachments' => $result->getNumberOfAttachments(),
						'unread' => $result->getUnreadMessages(),
						'messages' => $result->getNumberOfMessages()
				);
			}
		}
		return $results;
	}

	public static function getMailsFromImap($path) {
		require_once APPS_DIR . '/mail/mbox.php';
		//there is no conf:/// ?
		$filepath = 'home:///';
		$myFile = FSI::getFile($filepath);
		$myFile->checkReadPermission();
		$myRealFile = $myFile->getRealFile();
		$fileNameDestination = AdvancedPathLib::getPhpLocalHackPath($myRealFile->getPath());
		$parts = explode('/', $path);
		$part = $parts[0];
		$mailbox = substr($path, strlen($part)+1);
		$mailbox = str_replace('/', '--', $mailbox);
		$fileNameDestination .= '/../conf/mail/imap/'.$part;
		$mbox = new MBoxReader();
		$mbox->connect($fileNameDestination);
		$mails = $mbox->listMails($mailbox);
		$results = array();
		foreach ($mails as $result) {
			$results[] = array(
					'star' => "",
					'date' => "",
					'from' => "",
					'tags' => $mailbox,
					'subject' => "",
					'attachments' => "",
					'unread' => 0,
					'messages' => 1
			);
		}
		return $results;
	}

	public static function removeConversation($conversationId) {
		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$mails = $mailController->getMailsInConversation($conversationId);

		foreach ($mails as $mail) {
			$mailController->removeMail($mail);
		}
	}
	public static function removeMail($id) {
		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$provider = new SQLMailProvider();
		$mailTO = $provider->retrieveMailTOById($id);
		//print_r($id);
		//var_dump($mailTO);
		$mail = new MailObject($mailTO);

		$mailController->removeMail($mail);

	}

	public static function addTagToConversation($params) {
		$conversationId = $params[0];
		$labelId = $params[1];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$mailsInConversation = $mailController->getMailsInConversation($conversationId);
		//var_dump($mailsInConversation);
		foreach ($mailsInConversation as $currentMail) {
			$mailController->addLocalTagToMail($currentMail, $labelId);
		}
	}

	public static function addTagToMail($params) {
		$messageId = $params[0]; //messageID, NO mailId
		$labelId = $params[1];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$provider = new SQLMailProvider();
		$mailTO = $provider->retrieveMailTOByMessageId($messageId);
		$mail = new MailObject($mailTO);

		$mailController->addLocalTagToMail($mail, $labelId);
	}

	public static function addFolderToMail($params) {
		$mailId = $params[0];
		$labelId = $params[1];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$provider = new SQLMailProvider();
		$mailTO = $provider->retrieveMailTOByMessageId($mailId);
		$mail = new MailObject($mailTO);

		$mailController->addFolderToMail($mail, $labelId);
	}

	public static function addFolderToConversation($params) {
		$conversationId = $params[0];
		$labelId = $params[1];

		//print_r($conversationId. ' ' . $labelId);
		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$mailsInConversation = $mailController->getMailsInConversation($conversationId);
		//var_dump($mailsInConversation);
		foreach ($mailsInConversation as $currentMail) {
			$mailController->addFolderToMail($currentMail, $labelId);
		}
	}

	public static function removeTagToConversation($params) {
		$conversationId = $params[0];
		$labelId = $params[1];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$mailsInConversation = $mailController->getMailsInConversation($conversationId);
		foreach ($mailsInConversation as $currentMail) {
			$mailController->removeLocalTagToMail($currentMail, $labelId);
		}
	}
	
	public static function removeTagToMail($params) {
		$mailId = $params[0];
		$labelId = $params[1];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$provider = new SQLMailProvider();
		$mailTO = $provider->retrieveMailTOByMessageId($mailId);
		$mail = new MailObject($mailTO);

		$mailController->removeLocalTagToMail($mail, $labelId);
	}

	public static function removeFolderToMail($params) {
		$mailId = $params[0];
		$labelId = $params[1];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$provider = new SQLMailProvider();
		$mailTO = $provider->retrieveMailTOByMessageId($mailId);
		$mail = new MailObject($mailTO);

		$mailController->removeFolderToMail($mail, $labelId);
	}

	public static function removeFolderToConversation($params) {
		$conversationId = $params[0];
		$labelId = $params[1];

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$mailsInConversation = $mailController->getMailsInConversation($conversationId);
		foreach ($mailsInConversation as $currentMail) {
			$mailController->removeFolderToMail($currentMail, $labelId);
		}
	}

	public static function sendMailToTrash($params) {
		$id = $params;

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$provider = new SQLMailProvider();
		$mailTO = $provider->retrieveMailTOById($id);
		$mail = new MailObject($mailTO);

		$mailController->sendMailToTrash($mail);
	}

	public static function sendConversationToTrash($params) {
		$conversationId = $params;

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);
//
//		$provider = new SQLMailProvider();
//		$mailTO = $provider->retrieveMailTOByMessageId($mailId);
//		$mail = new MailObject($mailTO);

		$mails = $mailController->getMailsInConversation($conversationId);
		foreach ($mails as $currentMail) {
			$mailController->sendMailToTrash($currentMail);
		}

		
	}

	public function getNewMails() {
		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		session_write_close();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		return $mailController->getNewMails($currentUserId);
	}
	/**
	 * @return Returns the array sorted as required
	 * @param $aryData Array containing data to sort
	 * @param $strIndex Name of column to use as an index
	 * @param $strSortBy Column to sort the array by
	 * @param $strSortType String containing either asc or desc [default to asc]
	 * @desc Naturally sorts an array using by the column $strSortBy
	 */
	function array_natsort($aryData, $strIndex, $strSortBy, $strSortType=false) {
		//    if the parameters are invalid
		if (!is_array($aryData) || !$strIndex || !$strSortBy)
		//    return the array
			return $aryData;

		//    create our temporary arrays
		$arySort = $aryResult = array();

		//    loop through the array
		foreach ($aryData as $aryRow)
		//    set up the value in the array
			$arySort[$aryRow[$strIndex]] = $aryRow[$strSortBy];

		//    apply the natural sort
		natsort($arySort);

		//    if the sort type is descending
		if ($strSortType=="desc")
		//    reverse the array
			arsort($arySort);

		//    loop through the sorted and original data
		foreach ($arySort as $arySortKey => $arySorted)
			foreach ($aryData as $aryOriginal)
			//    if the key matches
				if ($aryOriginal[$strIndex]==$arySortKey)
				//    add it to the output array
					array_push($aryResult, $aryOriginal);

		//    return the return
		return $aryResult;
	}

	// retrieves the content of an image file, used to insert
	// images in NewMail editor.
	public static function getImg($path) {
		if(dirname($path) == 'images') {
			$name = utf8_basename($path);
			echo $path;
			exit;
		} else {
			$myFile = FSI::getFile($path);
			$len = $myFile->getSize();

			$response = MMapManager::getCurrentResponse();

			$myExt = strtolower($myFile->getExtension());

			// setting headers
			$response->getHeaders()->append('Content-Type: image/' . $myExt);
			$response->getHeaders()->append('Content-Length: ' . $len);
			$response->getHeaders()->append('Accept-Ranges: bytes');
			$response->getHeaders()->append('X-Pad: avoid browser bug');

			// preparing the rendering of the response (with the content of target file)
			$response->setBodyRenderer(new FileReaderBodyRenderer($myFile->getInputStream()));
		}
	}

	public static function sendMail($params) {
		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$mailTO = new MailTO();

		$providerMails = new SQLMailProvider();

		//print_r('maxId:' . $providerMails->getMaxIdMailTO());
		$mailTO->setId($providerMails->getMaxIdMailTO()); //id of mail application
		$mailTO->setMessageId(strval($mailTO->getId())); //id sended by server
		$mailTO->setAccountId(intval($params['id'])); //account of mail
		$mailTO->setConversationId($mailTO->getMessageId());
		$mailTO->setReaded('true'); // mail is readed? true or false

		//mail data
		$mailTO->setFromName($params['from']); // User Name <userName@domain.com>
		$mailTO->setToName($params['to']); //list of mails with ',' separator
		$mailTO->setCc($params['cc']);
		$mailTO->setBcc($params['bcc']);
		$mailTO->setDateTime(time()); //timestamp format
		$mailTO->setSubject($params['subject']);
		//$header;
		$mailTO->setBodyHtml($params['htmlText']);
		$mailTO->setBodyText($params['plainText']);
//		$mailTO->setInReplyTo($params[]);

		$mail = new MailObject($mailTO);
		return $mailController->sendMail($mail);
	}

	public static function getMailToShow($conversationId) {
		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$mails = $mailController->getMailsInConversation($conversationId);

		//var_dump($mails[0]);
		//now send data from mail 0 because conversations only have 1 mail.
		$result[] = array(
				'id' => $mails[0]->getId(),
				'star' => $mails[0]->getStarred(),
				'from' => $mails[0]->getMailTO()->getFromName(),
				'subject' => $mails[0]->getMailTO()->getSubject(),
				'to' => $mails[0]->getMailTO()->getToName(),
				'date' => date("j.n.Y H:i", $mails[0]->getMailTO()->getDateTime()),
				'bodyHtml' => $mails[0]->getMailTO()->getBodyHtml(),
				'bodyText' => $mails[0]->getMailTO()->getBodyText(),
				'attachments' => $mails[0]->getArrayOfAttachments()
		);

		$params[0] = $mails[0]->getMailTO()->getMessageId();
		$params[1] = 'true';
		self::setMailReaded($params);


		return $result;
	}

	public static function setMailReaded($params) {
		$messageId = $params[0];
		$value = $params[1];  // 'true' or 'false'

		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$provider = new SQLMailProvider();
		$mailTO = $provider->retrieveMailTOByMessageId($messageId);
		$mail = new MailObject($mailTO);

		$mail->setReaded($value);

		$mailController->saveMail($mail);
	}
	
	public static function saveToDraft ($params) {
		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$mailTO = new MailTO();

		$providerMails = new SQLMailProvider();

		if ($params['mailId'] <> '') {
			$mailId = $params['mailId'];
		} else {
			$mailId = $providerMails->getMaxIdMailTO();
		}
		$mailTO->setId($mailId); //id of mail application
		$mailTO->setMessageId(strval($mailTO->getId())); //id sended by server
		$mailTO->setAccountId(intval($params['id'])); //account of mail
		$mailTO->setConversationId($mailTO->getMessageId());
		$mailTO->setReaded('true'); // mail is readed? true or false

		//mail data
		$mailTO->setFromName($params['from']); // User Name <userName@domain.com>
		$mailTO->setToName($params['to']); //list of mails with ',' separator
		$mailTO->setCc($params['cc']);
		$mailTO->setBcc($params['bcc']);
		$mailTO->setDateTime(time()); //timestamp format
		$mailTO->setSubject($params['subject']);
		//$header;
		$mailTO->setBodyHtml($params['htmlText']);
		$mailTO->setBodyText($params['plainText']);
//		$mailTO->setInReplyTo($params[]);

		$mail = new MailObject($mailTO);
		return $mailController->saveDraft($mail);
	}

	//this function check if current user is new user, and create basic folders anf local tags if is a new user.
	//Then, return true if not exist any account, and false if exist.
	public static function initDatabaseScheme() {
		$myProcManager = ProcManager::getInstance();
		$currentUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		require_once APPS_DIR . '/mail/MailAppController.php';
		$mailController = new MailAppController($currentUserId);

		$mailController->isSetUser($currentUserId);
		return $mailController->isSetAccounts($currentUserId);
	}
}
?>