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


class SQLMailProvider implements IMailProvider {

	private $dao;

	public function __construct() {
		$this->dao = StorageManager::getInstance()->getHandler('SQL/EyeosDAO', array('prefix' => 'mail'));
		$this->dao->send('SET NAMES utf8');
	}

	/**
	 *
	 * @param Mail
	 */
	function storeNewMail(MailTO $mailTO) {
		try {
			//var_dump($mailTO);
			$this->dao->create($mailTO);
		} catch (Exception $e) {
			throw new EyeException('Unable to store mail ', 0, $e);
		}
	}

	function storeConversation(ConversationTO $conversationTO) {
		try {
			$this->dao->create($conversationTO);
		} catch (Exception $e) {
			throw new EyeException('Unable to store conversation ' . $conversationTO->getId(), 0, $e);
		}
	}

	function storeAttachment(Attachment $attachment) {
		try {
			$this->dao->create($attachment);
		} catch (Exception $e) {
			throw new EyeException('Unable to store conversation ' . $conversationTO->getId(), 0, $e);
		}
	}

	public function storeLocalTagPerMailTO(LocalTagPerMailTO $labelPerMailTO) {
		try {
			$this->dao->create($labelPerMailTO);
		} catch (Exception $e) {
			throw new EyeException('Unable to store labelPerMailTO ' . $labelPerMailTO->getId(), 0, $e);
		}
	}

	public function storeFolderPerMailTO(FolderPerMailTO $folderPerMailTO) {
		try {
			$this->dao->create($folderPerMailTO);
		} catch (Exception $e) {
			throw new EyeException('Unable to store labelPerMailTO ' . $labelPerMailTO->getId(), 0, $e);
		}
	}

	/**
	 * @return array of objects 'MailTO'
	 */
	function retrieveAllMails(MailTO $mailTO) {
		try {
			return $this->dao->readAll($mailTO);
		} catch (Exception $e) {
			throw new EyeException('Unable to retrieve all Mails ', 0, $e);
		}
	}

	function getAllMailsTOInConversation($conversationId) {
		$transferObject = new MailTO();

		$query = 'SELECT * FROM mail_mailto WHERE conversationid = ?';

		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $conversationId, PDO::PARAM_INT);

		if (!$stmt->execute()) {
			$errorInfo = $stmt->errorInfo();
			throw new EyeException($e->getMessage());
		}

		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$toReturn = array();

		foreach ($result as $entry) {
			   $objectClass = get_class($transferObject);
			   $row = new $objectClass;
			   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
				foreach ($entry as $key => $value) {
					$methodName = 'set' . ucfirst($key);
					$row->$methodName($value);
				}

				$toReturn[] = $row;
		}

		return $toReturn;
	}

	function retrieveMailsInFolder($folder) {
		try {
			$mailTO = new MailTO();
			return $this->dao->search($mailTO);
		} catch (Exception $e) {
			throw new EyeException('Unable to retrieve all Mails in folder' . $folder, 0, $e);
		}
	}

	function retrieveMailTOById($mailId) {
		$transferObject = new MailTO();

		$query = 'SELECT * FROM mail_mailto WHERE id = ? LIMIT 1';
		//print_r($query);

		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $mailId, PDO::PARAM_STR);


		if (!$stmt->execute()) {
			$errorInfo = $stmt->errorInfo();
			throw new EyeException($e->getMessage());
		}

		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		//$toReturn = array();

		foreach ($result as $entry) {
			   $objectClass = get_class($transferObject);
			   $row = new $objectClass;
			   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
				foreach ($entry as $key => $value) {
					$methodName = 'set' . ucfirst($key);
					$row->$methodName($value);
				}

				$toReturn = $row;
		}

		return $toReturn;
	}

	function retrieveMailTOByMessageId($mailMessageId) {
		$transferObject = new MailTO();

		$query = 'SELECT * FROM mail_mailto WHERE messageid = ? LIMIT 1';
		//print_r($query);

		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $mailMessageId, PDO::PARAM_STR);

		if (!$stmt->execute()) {
			$errorInfo = $stmt->errorInfo();
			throw new EyeException($e->getMessage());
		}

		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		//$toReturn = array();

		foreach ($result as $entry) {
			   $objectClass = get_class($transferObject);
			   $row = new $objectClass;
			   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
				foreach ($entry as $key => $value) {
					$methodName = 'set' . ucfirst($key);
					$row->$methodName($value);
				}

				$toReturn = $row;
		}

		return $toReturn;
	}

	function retrieveMailsWithTag(LocalTag $tag) {
		$transferObject = new MailTO();
		$id = $tag->getId();

		$query = 'SELECT mail_mailto.id, mail_mailto.messageid, mail_mailto.accountid, mail_mailto.conversationid, mail_mailto.readed, mail_mailto.fromname, mail_mailto.toname, mail_mailto.cc, mail_mailto.bcc, mail_mailto.subject, mail_mailto.bodyhtml, mail_mailto.bodytext, mail_mailto.datetime
			FROM mail_mailto INNER JOIN mail_localtagpermailto ON mail_mailto.id = mail_localtagpermailto.mailid WHERE mail_localtagpermailto.labelid = ?';

		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $id, PDO::PARAM_STR);

		if (!$stmt->execute()) {
			$errorInfo = $stmt->errorInfo();
			throw new EyeException($e->getMessage());
		}

		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$toReturn = array();

		foreach ($result as $entry) {
			   $objectClass = get_class($transferObject);
			   $row = new $objectClass;
			   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
				foreach ($entry as $key => $value) {
					$methodName = 'set' . ucfirst($key);
					$row->$methodName($value);
				}

				$toReturn[] = $row;
		}

		return $toReturn;
	}

	/**
	 *
	 * @param Mail
	 */
	function updateMail(MailTO $mailTO) {
		try {
			$this->dao->update($mailTO);
		} catch (Exception $e) {
			throw new EyeException('Unable to update mail ' . $mailTO->getId(), 0, $e);
		}
	}

	/**
	 *
	 * @param Mail
	 */
	function removeMail(MailTO $mailTO) {
		try {
			$this->dao->delete($mailTO);
		} catch (Exception $e) {
			throw new EyeException('Unable to delete mail ' . $mailTO->getId(), 0, $e);
		}
	}

	/*
	 * Remove All mail of one account. Using for remove account
	 */
	public function removeAllMail($accountId) {

		$query = 'DELETE FROM mail_mailto WHERE accountid = ?';
		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $accountId, PDO::PARAM_STR);


		if (!$stmt->execute()) {
			$errorInfo = $stmt->errorInfo();
			throw new EyeException($e->getMessage());
		}
	}

	public function retrieveAllFoldersPerMailTO($mailId) {
		$transferObject = new FolderPerMailTO();

		$query = 'SELECT * FROM mail_folderpermailto WHERE mailId = ?';

		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $mailId, PDO::PARAM_STR);

		if (!$stmt->execute()) {
			$errorInfo = $stmt->errorInfo();
			throw new EyeException($e->getMessage());
		}

		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$toReturn = array();

		foreach ($result as $entry) {
			   $objectClass = get_class($transferObject);
			   $row = new $objectClass;
			   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
				foreach ($entry as $key => $value) {
					$methodName = 'set' . ucfirst($key);
					$row->$methodName($value);
				}

				$toReturn[] = $row;
		}

		return $toReturn;
	}

	public function retrieveAllLocalTagsPerMailTO($mailId) {
		$transferObject = new LocalTagPerMailTO();

		$query = 'SELECT * FROM mail_localtagpermailto WHERE mailId = ?';

		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $mailId, PDO::PARAM_STR);

		if (!$stmt->execute()) {
			$errorInfo = $stmt->errorInfo();
			throw new EyeException($e->getMessage());
		}

		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$toReturn = array();

		foreach ($result as $entry) {
			   $objectClass = get_class($transferObject);
			   $row = new $objectClass;
			   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
				foreach ($entry as $key => $value) {
					$methodName = 'set' . ucfirst($key);
					$row->$methodName($value);
				}

				$toReturn[] = $row;
		}

		return $toReturn;
	}

	public function deleteLocalTagPerMailTO(LocalTagPerMailTO $labelPerMailToRemove) {
		try {
			$this->dao->delete($labelPerMailToRemove);
		} catch (Exception $e) {
			throw new EyeException('Unable to delete LabelPerMailTO' . $labelPerMailToRemove->getId(), 0, $e);
		}
	}
	public function deleteFolderPerMailTO(FolderPerMailTO $labelPerMailToRemove) {
		try {
			$this->dao->delete($labelPerMailToRemove);
		} catch (Exception $e) {
			throw new EyeException('Unable to delete LabelPerMailTO' . $labelPerMailToRemove->getId(), 0, $e);
		}
	}
	public function deleteAttachment(Attachment $attachment) {
		try {
			$this->dao->delete($attachment);
		} catch (Exception $e) {
			throw new EyeException('Unable to delete LabelPerMailTO' . $labelPerMailToRemove->getId(), 0, $e);
		}
	}

	public function getMaxIdLabelPerMailTO() {
		try {
			$maxId = 0;
			$labelPerMailTO = new LabelPerMailTO();
			$arrayLabels = $this->dao->readAll($labelPerMailTO);

			foreach($arrayLabels as $currentArray) {
				if (intval($currentArray->getId()) > $maxId) {
					$maxId = intval($currentArray->getId());
				}
			}

			return intval($maxId);
		} catch (Exception $e) {
			throw new EyeException('Unable to get LabelPerMailTO Max Id', 0, $e);
		}
	}

	public function getAllAttachments($mailId) {
		$transferObject = new Attachment();

		$query = 'SELECT * FROM mail_attachment WHERE mailId = ?';

		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $mailId, PDO::PARAM_STR);

		if (!$stmt->execute()) {
			$errorInfo = $stmt->errorInfo();
			throw new EyeException($e->getMessage());
		}

		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$toReturn = array();

		foreach ($result as $entry) {
			   $objectClass = get_class($transferObject);
			   $row = new $objectClass;
			   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
				foreach ($entry as $key => $value) {
					$methodName = 'set' . ucfirst($key);
					$row->$methodName($value);
				}

				$toReturn[] = $row;
		}

		return $toReturn;
	}

	function getAllConversationsInFolder($folderId, $pageNumber) {
		$items = 50; //HARDCODED!
		$item = ($pageNumber - 1) * $items;
		$transferObject = new ConversationTO();

		$query = 'SELECT mail_conversationto.id, mail_conversationto.accountid, mail_conversationto.lastdate
FROM mail_conversationto
INNER JOIN (
mail_mailto
INNER JOIN mail_folderpermailto ON mail_mailto.id = mail_folderpermailto.mailid
) ON mail_conversationto.id = mail_mailto.conversationid
WHERE mail_folderpermailto.labelid = "' . $folderId . '" ORDER BY mail_conversationto.lastdate DESC LIMIT ?,?';

		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $folderId, PDO::PARAM_STR);
		$stmt->bindParam(2, $item, PDO::PARAM_INT);
		$stmt->bindParam(3, $items, PDO::PARAM_INT);

		if (!$stmt->execute()) {
			$errorInfo = $stmt->errorInfo();
			throw new EyeException($e->getMessage());
		}

		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$toReturn = array();

		foreach ($result as $entry) {
			   $objectClass = get_class($transferObject);
			   $row = new $objectClass;
			   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
				foreach ($entry as $key => $value) {
					$methodName = 'set' . ucfirst($key);
					$row->$methodName($value);
				}

				$toReturn[] = $row;
		}

		return $toReturn;
	}

	function getAllConversationsInLocalTag($localTagId, $pageNumber) {
		$items = 50; //HARDCODED!
		$item =  ($pageNumber - 1) * $items;
		$transferObject = new ConversationTO();

		$query = 'SELECT mail_conversationto.id, mail_conversationto.accountid, mail_conversationto.lastdate
FROM mail_conversationto
INNER JOIN (
mail_mailto
INNER JOIN mail_localtagpermailto ON mail_mailto.id = mail_localtagpermailto.mailid
) ON mail_conversationto.id = mail_mailto.conversationid
WHERE mail_localtagpermailto.labelid = ? ORDER BY mail_conversationto.lastdate DESC LIMIT ?,?';

		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $localTagId, PDO::PARAM_STR);
		$stmt->bindParam(2, $item, PDO::PARAM_INT);
		$stmt->bindParam(3, $items, PDO::PARAM_INT);

		if (!$stmt->execute()) {
			$errorInfo = $stmt->errorInfo();
			throw new EyeException($e->getMessage());
		}

		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$toReturn = array();

		foreach ($result as $entry) {
			   $objectClass = get_class($transferObject);
			   $row = new $objectClass;
			   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
				foreach ($entry as $key => $value) {
					$methodName = 'set' . ucfirst($key);
					$row->$methodName($value);
				}
				$newConversation = new ConversationObject($row);
				$toReturn[] = $newConversation;
		}

		return $toReturn;
	}

	function getAllMailsInFolder($folderId, $pageNumber) {
		$items = 50; //HARDCODED!
		$item =  ($pageNumber - 1) * $items;
		$pageNumber = 1; //HARDCODED
		$transferObject = new MailTO();


		$query = 'SELECT mail_mailto.id, mail_mailto.accountid, mail_mailto.datetime
				FROM mail_mailto
				INNER JOIN mail_folderpermailto ON mail_mailto.id = mail_folderpermailto.mailid
				WHERE mail_folderpermailto.labelid = ? ORDER BY mail_mailto.datetime DESC LIMIT ?,?';

		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $folderId, PDO::PARAM_STR);
		$stmt->bindParam(2, $item, PDO::PARAM_INT);
		$stmt->bindParam(3, $items, PDO::PARAM_INT);

		if (!$stmt->execute()) {
			$errorInfo = $stmt->errorInfo();
			throw new EyeException($e->getMessage());
		}

		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$toReturn = array();

		foreach ($result as $entry) {
			   $objectClass = get_class($transferObject);
			   $row = new $objectClass;
			   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
				foreach ($entry as $key => $value) {
					$methodName = 'set' . ucfirst($key);
					$row->$methodName($value);
				}

				$toReturn[] = $row;
		}

		return $toReturn;
	}


	public function getMaxIdMailTO() {
		try {
			$maxId = 0;
			$mailTO = new MailTO();
			$arrayMailsTO = $this->dao->readAll($mailTO);

			foreach($arrayMailsTO as $currentArray) {
				if (intval($currentArray->getId()) > $maxId) {
					$maxId = intval($currentArray->getId());
				}
			}
			return intval($maxId + 1);
		} catch (Exception $e) {
			throw new EyeException('Unable to get MailTO Max Id', 0, $e);
		}
	}

	public function getMaxIdConversation() {
		try {
			$maxId = 0;
			$object = new ConversationTO();
			$arrayObjects = $this->dao->readAll($object);

			foreach($arrayObjects as $currentArray) {
				if (intval($currentArray->getId()) > $maxId) {
					$maxId = intval($currentArray->getId());
				}
			}

			return intval($maxId + 1);
		} catch (Exception $e) {
			throw new EyeException('Unable to get Conversation Max Id', 0, $e);
		}
	}

}
?>
