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

/**
 *
 *  This class control all Mail application
 */
// including all the Modules in Interfaces directory
$directory = new DirectoryIterator(APPS_DIR . '/mail/interfaces');

foreach ( $directory as $fileInfo ) {
	$fileInfoName = $fileInfo->getFileName();

	if( !$fileInfo->isDot() && strpos( $fileInfoName, '.php' ) ) {
		require_once APPS_DIR . '/mail/interfaces/' . $fileInfoName;
	}
}

// including all the Modules in Providers directory
$directory = new DirectoryIterator(APPS_DIR . '/mail/Providers');

foreach ( $directory as $fileInfo ) {
	$fileInfoName = $fileInfo->getFileName();

	if( !$fileInfo->isDot() && strpos( $fileInfoName, '.php' ) ) {
		require_once APPS_DIR . '/mail/Providers/' . $fileInfoName;
	}
}

// including all the classes in phpmailer directory
$directory = new DirectoryIterator(APPS_DIR . '/mail/phpmailer');

foreach ( $directory as $fileInfo ) {
	$fileInfoName = $fileInfo->getFileName();

	if( !$fileInfo->isDot() && strpos( $fileInfoName, '.php' ) ) {
		require_once APPS_DIR . '/mail/phpmailer/' . $fileInfoName;
	}
}

require_once APPS_DIR . '/mail/Account.php';
require_once APPS_DIR . '/mail/AccountTO.php';
require_once APPS_DIR . '/mail/AccountsManager.php';
require_once APPS_DIR . '/mail/Attachment.php';
require_once APPS_DIR . '/mail/ConversationObject.php';
require_once APPS_DIR . '/mail/ConversationTO.php';
require_once APPS_DIR . '/mail/IMAP.php';
require_once APPS_DIR . '/mail/Label.php';
require_once APPS_DIR . '/mail/LabelManager.php';
require_once APPS_DIR . '/mail/LabelPerMailTO.php';
require_once APPS_DIR . '/mail/MailAppController.php';
require_once APPS_DIR . '/mail/MailBoxManager.php';
require_once APPS_DIR . '/mail/MailObject.php';
require_once APPS_DIR . '/mail/MailTO.php';
require_once APPS_DIR . '/mail/POP.php';
require_once APPS_DIR . '/mail/SMTP.php';
require_once APPS_DIR . '/mail/SenderManager.php';

class MailAppController {

	private $labelManager;
	private $accountsManager;

	function __construct($userId) {
		$this->labelManager = new LabelManager($userId);
		$this->accountsManager = new AccountsManager();
	}

	/*-------------------- LABELS --------------------*/

	/**
	 *  This function returns all Folders of all accounts
	 * @return Array of Folders
	 */
	function getAllFolders($userId, $accountId) {
		return $this->labelManager->getAllFolders($userId, $accountId);
	}

	function getAllTags($userId) {
		return $this->labelManager->getAllTags($userId);
	}

	function getRemoteFolders(Account $account) {
		return $this->accountsManager->getRemoteFolders($account);
	}


	/**
	 * function to create new Tag.
	 * @param color: color of new Label. In Hex
	 * @param name: name of new tag
	 */
	function createTag($color, $name, $userId) {
		return $this->labelManager->createTag($color, $name, $userId);
	}

	/**
	 * function to edit a existent Label
	 * @param label: object Label, with new values inside
	 */
	function editTag(localTag $tag) {
		$this->labelManager->editTag($tag);
	}

	/**
	 * function to delete a Label.
	 * @param label: Label to delete
	 */
	function removeTag(localTag $tag, $userId) {
		$this->accountsManager->deleteLocalTagPerMailTO($tag, $userId);
		$this->labelManager->removeTag($tag);
	}

	/**
	 * function to create new Tag.
	 * @param color: color of new Label. In Hex
	 * @param name: name of new tag
	 */
	function createFolder($userId, $name, $path, $accountId) {
		$this->accountsManager->createRemoteFolder($path, $accountId);
		$this->labelManager->createFolder($userId, $name, $path, $accountId);
	}

	/**
	 * function to edit a existent Label
	 * @param label: object Label, with new values inside
	 */
	function editFolder(Folder $folderOld, Folder $folderNew) {
		$this->accountsManager->editRemoteFolder($folderOld, $folderNew);
		$this->labelManager->editFolder($folderNew);
	}

	/**
	 * function to delete a Label.
	 * @param label: Label to delete
	 */
	function removeFolder(Folder $folder) {
		$this->accountsManager->removeRemoteFolder($folder);
		$this->labelManager->removeFolder($folder);
	}

	function syncFolders($userId) {
		$result = $this->accountsManager->syncFolders($userId);
		return $result;
	}


	/*-------------------- MAILS --------------------*/

	/**
	 * Get all new mails of all accounts (in servers), and save in db
	 * @return Array of objects 'Mail'
	 */
	function getNewMails($userId) {
		return $this->accountsManager->getNewMails($userId);
	}

	/**
	 * Get all mails in local. NOT in remote servers.
	 */
	function getAllLocalMails($userId) {
		return $this->accountsManager->getAllLocalMails($userId);
	}

	function getMailsInFolder($folders, $pageNumber) {
		//$folders is array with ids
		return $this->accountsManager->getMailsInFolder($folders, $pageNumber);
	}

	function getMailsWithTag (LocalTag $tag, $userId) {
		return $this->accountsManager->getMailsWithTag($tag, $userId);
	}

	/**
	 *
	 * @param Mail
	 */
	function saveMail(MailObject $mail) {
		$this->accountsManager->saveMail($mail);
	}

	function saveDraft(MailObject $mail) {
		$this->accountsManager->saveDraft($mail);
	}

	/**
	 * Send mail to subject(s) with appropriate account
	 * @param mail
	 */
	function sendMail(MailObject $mail) {
		return $this->accountsManager->sendMail($mail);
	}

	/**
	 * delete Mail in local, and server if appropriate
	 * @param mail: object Mail
	 */
	function removeMail(MailObject $mail) {
		$this->accountsManager->removeMail($mail);
	}

	/**
	 * Mark a mail as readed. If mail is 'readed', mark as 'not readed'
	 * @param Mail: Object Mail
	 */
	function markMailAsReaded(MailObject $mail) {
		$this->accountsManager->markMailAsReaded($mail);
	}

	function addLocalTagToMail(MailObject $mail, $labelId) {
		$this->accountsManager->addLocalTagToMail($mail, $labelId);
	}
	function addFolderToMail(MailObject $mail, $labelId) {
		$this->accountsManager->addFolderToMail($mail, $labelId);
	}

	function removeLocalTagToMail(MailObject $mail, $localTagId) {
		$this->accountsManager->removeLocalTagToMail($mail, $localTagId);
	}
	function removeFolderToMail(MailObject $mail, $folderId) {
		$this->accountsManager->removeFolderToMail($mail, $folderId);
	}
function sendMailToTrash(MailObject $mail) {
		$this->accountsManager->sendMailToTrash($mail);
	}
	/*-------------------- ACCOUNTS --------------------*/

	function getAllAccountsTO($userId) {
		$accounts = $this->accountsManager->getAccounts($userId);
		$accountsToReturn = null;
		if (isset($accounts)) {
			foreach ($accounts as $account) {
				$accountsToReturn[] = $account->getAccountTO();
			}
			
		}
		return $accountsToReturn;
	}

	/**
	 * Store new Account.
	 * @param Account: id is null.
	 */
	function newAccount(Account $account) {
		$this->accountsManager->newAccount($account);
	}

	/**
	 * Remove an account and ALL mails in this account
	 * @param Account
	 */
	function removeAccount(Account $account) {
		$this->labelManager->removeAllFolders($account->getAccountTO()->getId());
		$this->accountsManager->removeAccount($account);
	}

	/**
	 *
	 * @param Account
	 */
	function updateAccount(Account $account) {
		$this->accountsManager->updateAccount($account);
	}

	/*-------------------- CONVERSATIONS --------------------*/

	function getAllConversations($userId) {
		return $this->accountsManager->getAllConversations();
	}

	function getConversationsInFolder($folders, $pageNumber) {
		return $this->accountsManager->getConversationsInFolder($folders, $pageNumber);
	}
	function getConversationsInLocalTag($tags, $pageNumber) {
		return $this->accountsManager->getConversationsInLocalTags($tags, $pageNumber);
	}

	function getMailsInConversation($conversationId) {
		return $this->accountsManager->getMailsInConversation($conversationId);
	}


	/*-------------------- USERS --------------------------------*/
	//check if this user is a user pof MailApplication. If not, create Folders and LocalTags
	function isSetUser($userId) {
		$this->labelManager->isSetUser($userId);
	}

	public function isSetAccounts($userId) {
		return $this->accountsManager->isSetAccounts($userId);
	}
}
?>