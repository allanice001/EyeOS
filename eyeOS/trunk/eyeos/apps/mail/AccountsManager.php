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

class AccountsManager {

	/**
	 * Get all new mails of all accounts (in servers)
	 * @return Array of objects 'Mail'
	 */
	public function getNewMails($userId) {
		$arrayNewMails = null;
		$arrayAccounts = $this->getAccounts($userId);
		foreach ($arrayAccounts as $currentAccount) {
			$arrayNewMails[] = $currentAccount->getNewMails();
		}
		return $arrayNewMails;
	}

	/**
	 * Get all accounts
	 * @return Array of objects 'AccountTO'
	 */
	public function getAccounts($userId) {
		$accountsProvider = new SQLAccountProvider(); //HARD-CODED
		$accountTO = new AccountTO();
		$accountTO->setUserId($userId);
		$accountsTO = $accountsProvider->retrieveAccountsTO($accountTO);

		//print_r('accountsTO: ' . $accountsTO);
		$toReturn = null;
		foreach ($accountsTO as $currentAccountTO) {
			$account = new Account($currentAccountTO);
			$toReturn[] = $account;
		}
		return $toReturn;
	}

	/**
	 * Get a account by Id
	 * @return object 'Account'
	 */
	public function getAccountById($id) {
		$accountsProvider = new SQLAccountProvider(); //HARD-CODED
		$accountsTO = $accountsProvider->retrieveAccountTOById($id);
		//var_dump($accountTO);
		if ($accountsTO) {
			$account = new Account($accountsTO[0]);
			return $account;
		}
		return null;
	}

	/**
	 * This function search account of a new mail, and send it
	 * @param Mail
	 */
	public function sendMail(MailObject $mail) {
		$accountId = $mail->getAccountId();
		$account = $this->getAccountById($accountId);

		try {
			$result = $account->sendMail($mail);
		} catch (Exception $e) {
			throw new EyeException('Unable to send Mail', 0, $e);
		}
//		//print_r($result);
//		$mail->setReaded('true');
//		$mail->setSended('true');
//		$this->saveMail($mail);

		return $result;
	}

	/**
	 * @param Mail
	 */
	public function removeMail(MailObject $mail) {
		$account = $this->getAccountById($mail->getAccountId());
		$account->removeMail($mail);
	}

	/**
	 * Mark a mail as readed. If mail is 'readed', mark as 'not readed'
	 * @param Mail: Object Mail
	 */
	public function markMailAsReaded(MailObject $mail) {
		$account = $this->getAccountById($mail->getAccountId());
		$account->markMailAsReaded($mail);
	}

	/**
	 *
	 * @param Mail
	 */
	public function saveMail(MailObject $mail) {
		$account = $this->getAccountById($mail->getAccountId());
		$account->saveMail($mail);
	}

	public function saveDraft(MailObject $mail) {
		$account = $this->getAccountById($mail->getAccountId());
		$account->saveDraft($mail);
	}

	public function addLocalTagToMail(MailObject $mail, $labelId) {
		$account = $this->getAccountById($mail->getAccountId());
		$account->addLocalTagToMail($mail, $labelId);
	}
	public function addFolderToMail(MailObject $mail, $labelId) {
		$account = $this->getAccountById($mail->getAccountId());
		$account->addFolderToMail($mail, $labelId);
	}
	
	public function sendMailToTrash(MailObject $mail) {
		$account = $this->getAccountById($mail->getAccountId());
		$account->sendMailToTrash($mail);
	}


	public function removeLocalTagToMail(MailObject $mail, $localTagId) {
		if ($mail) {
			$account = $this->getAccountById($mail->getAccountId());
			$account->removeLocalTagToMail($mail, $localTagId);
		}

	}
	public function removeFolderToMail(MailObject $mail, $folderId) {
		$account = $this->getAccountById($mail->getAccountId());
		$account->removeFolderToMail($mail, $folderId);
	}


	/**
	 *
	 * @param Account
	 */
	public function newAccount(Account $account) {
		$provider = new SQLAccountProvider(); //HARD CODED
		//$account->getAccountTO()->setId($provider->getMaxId() + 1);
		$provider->storeAccountTO($account->getAccountTO());
		$user = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
		$dir = FSI::getFile('user-conf://~'.$user->getName().'/mail/'.$provider->getMaxId());
		$dir->mkdirs();
	}

	/**
	 *
	 * @param Account
	 */
	public function removeAccount(Account $account) {
		$account->removeAllMail();
		$accountId = $account->getAccountTO()->getId();

		$provider = new SQLAccountProvider(); //HARD CODED
		$provider->removeAccountTO($account->getAccountTO());
		//deleting folders with attachments
		$user = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
		$dir = FSI::getFile('user-conf://~'.$user->getName().'/mail/'.$accountId);
		$dir->delete();
	
	}

	/**
	 *
	 * @param Account
	 */
	public function updateAccount(Account $account) {
		$provider = new SQLAccountProvider(); //HARD CODED
		$provider->updateAccountTO($account->getAccountTO());
	}

	/**
	 * Get all mails in local. NOT in remote servers.
	 * @return array of objects 'Mail'
	 */
	public function getAllLocalMails($userId) {
		$arrayAllMails = null;
		$arrayAccounts = $this->getAccounts($userId);
		foreach ($arrayAccounts as $currentAccount) {
			$arrayAllLocalMails[] = $currentAccount->getAllLocalMails();
		}
		return $arrayAllLocalMails;
	}

	public function getMailsInFolder($folders, $pageNumber) {
		$provider = new LabelManager();

		$mails = array();
		foreach ($folders as $currentFolder) {
			$folder = $provider->getFolderById($currentFolder);
			if (!($folder == null || !$folder->getAccount())) {
				$currentAccount = $this->getAccountById($folder->getAccount());
				$mails = array_merge($mails, $currentAccount->getMailsInFolder($folder, $pageNumber));
			}
		}

		return $mails;




//		$arrayAllMailsInFolder = null;
//		$arrayAccounts = $this->getAccounts($userId);
//		foreach ($arrayAccounts as $currentAccount) {
//			$arrayAllMailsInFolder[] = $currentAccount->getMailsInFolder($folder);
//		}
//		return $arrayAllMailsInFolder;
	}

	public function getMailsWithTag(LocalTag $tag, $userId) {
		$arrayAllMailsWithTag = array();
		$arrayAccounts = $this->getAccounts($userId);
		foreach ($arrayAccounts as $currentAccount) {
			$newMails = $currentAccount->getMailsWithTag($tag);
			if ($newMails) {
				$arrayAllMailsWithTag = array_merge($arrayAllMailsWithTag, $newMails);
			}
			
		}
		return $arrayAllMailsWithTag;
	}

	public function getAllConversations($userId) {
		$arrayAllConversations = null;
		$arrayAccounts = $this->getAccounts($userId);
		foreach ($arrayAccounts as $currentAccount) {
			$arrayAllConversations[] = $currentAccount->getAllConversations();
		}
		return $arrayAllConversations;
	}

	public function getConversationsInFolder($folders, $pageNumber) {
		//$arrayAllConversations = null;
		$provider = new LabelManager();
		$conversations = array();
		if (count($folders > 0)) {
			foreach ($folders as $currentFolder) {
				$folder = $provider->getFolderById($currentFolder);
				if (!($folder == null || $folder->getAccount() == 0)) {
					$currentAccount = $this->getAccountById($folder->getAccount());
					$newConversations = $currentAccount->getAllConversationsInFolder($folder, $pageNumber);
					foreach($newConversations as $currentConversation) {
						if (!in_array($currentConversation, $conversations)) {
							$conversations[] = $currentConversation;
						}
					}
				}
			}
		} else {
			return null;
		}


		return $conversations;
	}

	public function getConversationsInLocalTags($tags, $pageNumber) {
		//$arrayAllConversations = null;
		$provider = new LabelManager();
		$mailProvider = new SQLMailProvider();

		$conversations = array();
		if (count($tags > 0)) {
			foreach ($tags as $currentTag) {
				$localTag = $provider->getLocalTagById($currentTag);
				if ($localTag != null) {
					$newConversations  =  $mailProvider->getAllConversationsInLocalTag($localTag->getId(), $pageNumber);
					foreach($newConversations as $currentConversation) {
						if (!in_array($currentConversation, $conversations)) {
							$conversations[] = $currentConversation;
						}
					}

				}
			}
		} else {
			return null;
		}


		return $conversations;
	}


	public function getMailsInConversation($conversationId) {
		$conversationTO = new ConversationTO();
		$conversationTO->setId($conversationId);

		$conversation = New ConversationObject($conversationTO);
		return $conversation->getMails();
	}

	public function getRemoteFolders(Account $account) {
		return $account->getFolders();
	}

	public function createRemoteFolder($path, $accountId) {
		$account = $this->getAccountById($accountId);
		//var_dump($account);
		$account->createRemoteFolder($path);
	}

	public function editRemoteFolder(Folder $folderOld, Folder $folderNew) {
		$currentAccount = $this->getAccountById($folderOld->getAccount());
		$currentAccount->editRemoteFolder($folderOld, $folderNew);
	}

	public function removeRemoteFolder(Folder $folder) {
		$currentAccount = $this->getAccountById($folder->getAccount());
		$currentAccount->removeRemoteFolder($folder);
	}

	public function syncFolders($userId) {
		$result = false;
		$labelManager = new LabelManager($userId);
		$accounts = $this->getAccounts($userId);
		if (isset($accounts)) {
			foreach ($accounts as $currentAccount) {
				$currentAccountTO = $currentAccount->getAccountTO();
				if ($currentAccountTO->getTypeMailBox() == 'imap') {
					$account = new Account($currentAccountTO);
					$remoteFolders = $this->getRemoteFolders($account);
					$localFolders = $labelManager->getAllFolders($userId, $account->getAccountTO()->getId());

					//if a remote Folder isn't in Local, i create in Local
					foreach ($remoteFolders as $currentRemoteFolder) {
						$remotePath= $currentRemoteFolder->getPath();

						$existFolder = false;
						foreach ($localFolders as $currentLocalFolder) {
							$localPath = $currentLocalFolder->getPath();
							if ($remotePath == $localPath) {
								$existFolder = true;
								break;
							}
						}
						if ($existFolder == false) {
							//If remote folder not exist in local, create local Folder
							$labelManager->createFolder($userId, basename($remotePath), $remotePath, $account->getAccountTO()->getId());
							$result = true;
						}
					}

					$localFolders = $labelManager->getAllFolders($userId, $account->getAccountTO()->getId());

					//if a Local Folder isn't in Server, i delete in Local
					foreach ($localFolders as $currentLocalFolder) {
						$localPath= $currentLocalFolder->getPath();

						$existFolder = false;
						foreach ($remoteFolders as $currentRemoteFolder) {
							$remotePath = $currentRemoteFolder->getPath();
							if ($remotePath == $localPath) {
								$existFolder = true;
								break;
							}
						}
						if ($existFolder == false) {
							//If remote folder not exist in local, create local Folder
							$labelManager->removeFolder($currentLocalFolder);
							$result = true;
						}
					}
				}

			}
		}
		return $result;
	}

	public function deleteLocalTagPerMailTO(LocalTag $tag, $userId) {
		$mails = $this->getMailsWithTag($tag, $userId);
		foreach ($mails as $currentMail) {
			$this->removeLocalTagToMail($currentMail, $tag->getId());
		}
	}

	public function isSetAccounts($userId) {
		$accountsProvider = new SQLAccountProvider();
		$result =  $accountsProvider->isSetAccounts($userId);
		if ($result != null) {
			return false;
		} else {
			return true;
		}
	}

}
?>