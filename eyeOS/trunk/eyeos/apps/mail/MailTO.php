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

class MailTO {
	//mail info
	private $id = null; //id of mail application
	private $messageId; //id sended by server
	private $accountId; //account of mail
	private $conversationId;
	private $readed = 'false'; // mail is readed? true or false

	//mail data
	private $fromName; // User Name <userName@domain.com>
	private $toName; //list of mails with ',' separator
	private $cc;
	private $bcc;
	private $dateTime; //timestamp format
	private $subject;
	private $header;
	private $bodyHtml;
	private $bodyText;

	public function setId($id) {
		$this->id = $id;
	}
	public function getId() {
		return $this->id;
	}

	public function setMessageId($id) {
		$this->messageId = $id;
	}
	public function getMessageId() {
		return $this->messageId;
	}
	
	public function setAccountId($id) {
		$this->accountId = $id;
	}
	public function getAccountId() {
		return $this->accountId;
	}

	public function setConversationId($id) {
		$this->conversationId = $id;
	}
	public function getConversationId() {
		return $this->conversationId;
	}

	public function setReaded($value) {
		$this->readed = $value;
	}
	public function getReaded() {
		return $this->readed;
	}

	public function setFromName($value) {
		$this->fromName = $value;
	}
	public function getFromName() {
		return $this->fromName;
	}

 	public function setToName($value) {
		$this->toName = $value;
	}
	public function getToName() {
		return $this->toName;
	}

	public function setCc($value) {
		$this->cc = $value;
	}
	public function getCc() {
		return $this->cc;
	}

	public function setBcc($value) {
		$this->bcc = $value;
	}
	public function getBcc() {
		return $this->bcc;
	}

	public function setDateTime($value) {
		$this->dateTime = $value;
	}
	public function getDateTime() {
		return $this->dateTime;
	}
	
	public function setSubject($value) {
		$this->subject = $value;
	}
	public function getSubject() {
		return $this->subject;
	}

	public function setHeader($value) {
		$this->header = $value;
	}
	public function getHeader() {
		return $this->header;
	}

	public function setBodyHtml($value) {
		$this->bodyHtml = $value;
	}
	public function getBodyHtml() {
		return $this->bodyHtml;
	}

	public function setBodyText($value) {
		$this->bodyText = $value;
	}
	public function getBodyText() {
		return $this->bodyText;
	}

}
?>