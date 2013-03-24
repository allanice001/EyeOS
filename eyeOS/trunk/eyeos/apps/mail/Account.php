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

class Account {

	private $provider; //provider to save mails in database
	private $accountTO = null;

	function __construct(AccountTO $accountTO) {
		$this->provider = new SQLMailProvider(); //HARD-CODED

		$this->accountTO = new AccountTO();
		$this->accountTO = clone($accountTO);
	}

	/**
	 * Get all new mails of this account (in server). Attribute 'type' is protocol to get Mails from server.
	 * After, store this new mails in database
	 * @return Array of objects 'Mail'
	 */
	function getNewMails() {
		$mailBoxManager = new MailBoxManager($this->accountTO);
		//var_dump($mailBoxManager);

		$arrayReturning = $mailBoxManager->getNewMails();
		$newMails = $arrayReturning['mails'];
		$NewlastReceived = $arrayReturning['newDate'];
		
		if ($newMails !== null) {

			foreach ($newMails as $newMail) {
				try {
					$newMailTO = $newMail->getMailTO();
					$user = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
					$pathDir = 'user-conf://~'.$user->getName().'/mail/'.$this->accountTO->getId();
					$dir = FSI::getFile($pathDir);

					$newId = $this->provider->getMaxIdConversation();
					$newMailTO->setConversationId($newId);
					$this->provider->storeNewMail($newMailTO);

					//add attachments
					$attachments = $newMail->getAttachments();

					foreach ($attachments as $attachment) {
						$attachmentTO = new Attachment();
						$attachmentTO->setMailId($newMailTO->getId());
						$attachmentTO->setName($attachment['name']);
						$attachmentTO->setSize($attachment['size']);
						$fileName = rand(). '_' . $attachmentTO->getName();
						$attachmentTO->setPath($pathDir . '/' . $fileName);
						$attachmentTO->setType($attachment['type']);

						//save file with name timestamp+name
						$data = $attachment['data'];
						
						//path: /user/conf/mail/account/123456_picture.png
						$file = $dir->getChildFile($fileName);
						$file->putContents($data);

						//save attachmentTO in database
						$this->provider->storeAttachment($attachmentTO);
						
					}

					//if account is POP type, then add Folder INBOX to all new Mails, and save it into new conversations
					if (strtolower($this->accountTO->getTypeMailBox()) == 'pop') {
						$newMailTO = $this->provider->retrieveMailTOByMessageId($newMailTO->getMessageId());
						$mail = new MailObject($newMailTO);
						//add mail to inbox
						$provider = new LabelManager();
						$inbox = $provider->getFolderByName('INBOX', $this->accountTO->getId());
						$mail->addFolder($inbox->getId());

						//TO CHANGE: now, each mail have one conversation
						$conversationTO = new ConversationTO();
						$conversationTO->setAccountId($this->accountTO->getId());
						$conversationTO->setId($newId);
						$conversationTO->setLastDate($newMailTO->getDateTime());

						$this->provider->storeConversation($conversationTO);
					}
				} catch (Exception $e) {
					throw new EyeException('Unable to get New Mails', 0, $e);
				}
			}
		}

		//update account, with new LastReceived
		$this->accountTO->setLastReceived($NewlastReceived);
		$provider = new SQLAccountProvider();
		$provider->updateAccountTO($this->accountTO);

		return $newMails;

//		$newMailsTO = $mailBox->getNewMails();
//		$newMails = null;
//		foreach ($newMailsTO as $currentMailTO) {
//			$currentMailTO->setId($this->provider->getMaxIdMailTO());
//			$currentMailTO->setAccountId($this->accountTO->getId());
//			$this->provider->storeNewMail($currentMailTO);
//			$newMails[] = new MailObject($currentMailTO);
//			//TODO: Add label 'Inbox'
//			//TODO: Add attachments to mail
//		}
//		return $newMails;
	}

	/**
	 * Get all mails in local. NOT in remote servers.
	 */
	function getAllLocalMails() {
		$mailTO = new MailTO();
		$mailTO->setAccountId($this->accountTO->getId());
		$mailsTO = $this->provider->retrieveAllMails($mailTO);
		$localMails = null;
		foreach ($mailsTO as $currentMailTO) {
			$localMails[] = new MailObject($currentMailTO);
		}
		return $localMails;
	}

	function getMailsInFolder(Folder $folder, $pageNumber) {


		$mailTO = new MailTO();
		$mailTO->setAccountId($this->accountTO->getId());

		$mailsTO = $this->provider->getAllMailsInFolder($folder->getId(), $pageNumber);


		$mails = array();
		foreach ($mailsTO as $currentMailTO) {
			$mails[] = new MailObject($currentMailTO);
		}
		return $mails;


//		$mailTO = new MailTO();
//		if ($folder == 'sended') {
//			$mailTO->setSended(true);
//		} elseif ($folder == 'draft') {
//			$mailTO->setDraft(true);
//		}
//		$mailsTO = $this->provider->retrieveMailsInFolder($mailTO);
//		$localMails = null;
//		foreach ($mailsTO as $currentMailTO) {
//			$localMails[] = new MailObject($currentMailTO);
//		}
//		return $localMails;
	}


	function getMailsWithTag(LocalTag $tag) {
		$mailsTO = $this->provider->retrieveMailsWithTag($tag);
		$localMails = null;
		foreach ($mailsTO as $currentMailTO) {
			$localMails[] = new MailObject($currentMailTO);
		}
		return $localMails;
	}
	/**
	 *
	 * @param Mail
	 */
	function sendMail(MailObject $mail) {

		$sender = new SenderManager();
		$result = $sender->sendMail($mail, $this->accountTO);

		if ($result == true) {
			//TODO assign Folder SENDED, and delete folder tag DRAFT if exist
			$provider = new LabelManager();
			$folder = $provider->getFolderByName('Sent Messages', $this->accountTO->getId());
			$mail->addFolder($folder->getId());
			$this->provider->storeNewMail($mail->getMailTO());

			//TO CHANGE: now, each mail have one conversation
			$conversationTO = new ConversationTO();
			$conversationTO->setAccountId($this->accountTO->getId());
			$conversationTO->setId($mail->getMailTO()->getMessageId());
			$conversationTO->setLastDate($mail->getMailTO()->getDateTime());

			$this->provider->storeConversation($conversationTO);
		}
		return $result;
	}

	/**
	 *
	 * @param Mail
	 */
	function removeMail(MailObject $mail) {
		//remove Folders
		$labelsPerMailTO = $mail->getFoldersPerMailTO();
		foreach ($labelsPerMailTO as $currentLabelPerMailTO) {
			$this->provider->deleteFolderPerMailTO($currentLabelPerMailTO);
		}

		//remove Tags
		$labelsPerMailTO = $mail->getLocalTagsPerMailTO();
		foreach ($labelsPerMailTO as $currentLabelPerMailTO) {
			$this->provider->deleteLocalTagPerMailTO($currentLabelPerMailTO);
		}

		//remove Attachments in db and file
		$attachments = $mail->getAttachments();
		foreach ($attachments as $currentAttachment) {
			$this->provider->deleteAttachment($currentAttachment);

			$file = FSI::getFile($currentAttachment->getPath());
			$file->delete();
		}

		//remove mail in server (if need)
		$mailBoxManager = new MailBoxManager($this->accountTO);
		$mailBoxManager->removeMail($mail->getMailTO());
		
		//remove mail in db
		$this->provider->removeMail($mail->getMailTO());

		
	}

	/**
	 *
	 * @param Mail
	 */
	function markMailAsReaded(MailObject $mail) {
		$mailBox = new MailBoxManager($this->accountTO);
		$mailBox->markMailAsReaded($mail);
		//If mail is readed, mark as Not readed. And viceversa
		if ($mail->getReaded() == 'true') {
			$mail->setReaded('false');
		} else {
			$mail->setReaded('true');
		}
		$this->provider->updateMail($mail->getMailTO());
	}

	/**
	 *
	 * @param Mail
	 */
	function saveMail(MailObject $mail) {
		//if not saved...
		if ($mail->getId() == null) {
			$mail->getMailTO()->setId($this->provider->getMaxIdMailTO());
			$this->provider->storeNewMail($mail->getMailTO());
		} else {
			$this->provider->updateMail($mail->getMailTO());
		}

	}

	function saveDraft(MailObject $mail) {

		//ADD LABEL DRAFT;
		
		$this->saveMail($mail);
	}

	/**
	 *
	 * @param Mail
	 * @param label
	 */
	function addLocalTagToMail(MailObject $mail, $labelId) {
		$mail->addTag($labelId);
	}
	function addFolderToMail(MailObject $mail, $labelId) {
		$mail->addFolder($labelId);
	}
	function sendMailToTrash(MailObject $mail) {
		$mail->sendMailToTrash();
	}

	function removeLocalTagToMail(MailObject $mail, $localTagId) {
		$mail->removeTag($localTagId);
	}
	function removeFolderToMail(MailObject $mail, $folderId) {
		$mail->removeFolder($folderId);
	}

	public function getAccountTO() {
		return $this->accountTO;
	}

	public function removeAllMail() {

		$mails = $this->getAllLocalMails();

		if (count($mails) > 0) {
			foreach ($mails as $mail) {
				$this->removeMail($mail);
			}
		}
		

		//$this->provider->removeAllMail($this->getAccountTO()->getId());

	}

	public function getAllConversations() {
		$conversationTO = new ConversationTO();
		$conversationTO->setAccountId($this->accountTO->getId());

		$conversationsTO = $this->provider->retrieveAllConversations($conversationTO);
		$conversations = null;
		foreach ($conversationsTO as $currentConversationTO) {
			$conversations[] = new ConversationObject($currentConversationTO);
		}
		return $conversations;
	}

	public function getAllConversationsInFolder(Folder $folder, $pageNumber) {

		$conversationTO = new ConversationTO();
		$conversationTO->setAccountId($this->accountTO->getId());

		$conversationsTO = $this->provider->getAllConversationsInFolder($folder->getId(), $pageNumber);


		$conversations = array();
		foreach ($conversationsTO as $currentConversationTO) {
			$conversations[] = new ConversationObject($currentConversationTO);
		}
		return $conversations;
	}


	public function getFolders() {
		$mailboxManager = new MailBoxManager($this->accountTO);
		return $mailboxManager->getFolders($this->accountTO);
	}

	public function createRemoteFolder($path) {
		$mailBox = new MailBoxManager($this->accountTO);
		$mailBox->createFolder($path);
	}

	public function editRemoteFolder(Folder $folderOld, Folder $folderNew) {
		$mailBox = new MailBoxManager($this->accountTO);
		$mailBox->editFolder($folderOld, $folderNew);
	}

	public function removeRemoteFolder(Folder $folder) {
		$mailBox = new MailBoxManager($this->accountTO);
		$mailBox->removeFolder($folder);
	}
}
?>