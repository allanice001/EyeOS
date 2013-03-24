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

class MailBoxManager {

	private $mailBox;
	private $accountTO;
	/**
	 * get New mails
	 * @param string $typeMailBox (POP, IMAP, etc...)
	 * @return array of 'MailTO'
	 */

	public function __construct(AccountTO $accountTO) {
		
		$typeMailBox = $accountTO->getTypeMailBox();
		if (strtolower($typeMailBox) == 'imap') {
			$this->mailBox = new IMAP($accountTO);
		} elseif (strtolower($typeMailBox) == 'pop') {
			$this->mailBox = new POP($accountTO);
		}
		$this->accountTO = $accountTO;
	}

	public function getNewMails() {
		return $this->mailBox->getNewMails($this->accountTO);
	}

	/**
	 *
	 * @param MailTO $mail
	 * @return
	 */
	public function removeMail(MailTO $mailTO) {
		//todo: remove mail from server
		//$this->mailBox->removeMail($mailTO);
	}

	public function markMailAsReaded(MailTO $mail) {
		$this->mailBox->markMailAsReaded($mail);
	}

	public function getFolders() {
		$rawFolders = $this->mailBox->getRawFolders();
		$folders = array();
		foreach($rawFolders as $currentRawFolder) {
			$folder = new Folder();
			$folder->setUserId($this->accountTO->getUserId());
			$folder->setPath($currentRawFolder);
			$folder->setName(basename($currentRawFolder));
			$folder->setAccount($this->accountTO->getId());

			$folders[] = $folder;
			//i don't have color and folderId;
		}
		
		return $folders;
	}

	public function createFolder($path) {
		$this->mailBox->createFolder($path);
	}

	public function editFolder(Folder $folderOld, Folder $folderNew) {
		$this->mailBox->editFolder($folderOld->getPath(), $folderNew->getPath());
	}

	public function removeFolder(Folder $folder) {
		$this->mailBox->removeFolder($folder->getPath());
	}
}


class iilConnection{
	var $fp;
	var $login;
	var $password;
	var $host;
	var $error;
	var $errorNum;
	var $selected;
	var $cacheFP;
	var $cacheMode;
}

class iilBasicHeader{
	var $id;
	var $uid;
	var $subject;
	var $from;
	var $to;
	var $cc;
	var $replyto;
	var $date;
	var $messageID;
	var $size;
	var $encoding;
	var	$ctype;
	var $flags;
	var $timestamp;
	var $seen;
	var $deleted;
	var $recent;
	var $answered;
	var $received;
	var $raw_header;
	var $bodyTxt;
	var $bodyHtml;
	var $attachments;
}

?>