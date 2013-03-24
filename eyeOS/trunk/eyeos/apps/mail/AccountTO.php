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

class AccountTO {

	//Data of account
	private $id;
	private $userId; //Eyeos User ID
	private $mail; // mail address of account
	private $nameOfUser; // Name of Person (ex.: John Smith)
	private $description; //Short description
	private $lastReceived; //date of last mail received.

	//MailBox
	private $typeMailBox; // 'POP' or 'IMAP', etc...
	private $mailBoxUserName;
	private $mailBoxPassword;
	private $mailBoxServer;
	private $mailBoxPort;
	private $mailBoxSecure;

	//Sender
	private $typeSender; //SMTP, etc....
	private $senderUserName;
	private $senderPassword;
	private $senderServer;
	private $senderPort;
	private $senderSecure; //true or false

	public function setId($id) {
		$this->id = $id;
	}
	public function getId() {
		return $this->id;
	}

	public function setUserId($id) {
		$this->userId = $id;
	}
	public function getUserId() {
		return $this->userId;
	}

	public function setMail($mail) {
		$this->mail = $mail;
	}
	public function getMail() {
		return $this->mail;
	}

	public function setNameOfUser($nameOfUser) {
		$this->nameOfUser = $nameOfUser;
	}
	public function getNameOfUser() {
		return $this->nameOfUser;
	}

	public function setDescription($description) {
		$this->description = $description;
	}
	public function getDescription() {
		return $this->description;
	}

	public function setTypeMailBox($value) {
		$this->typeMailBox = $value;
	}
	public function getTypeMailBox() {
		return $this->typeMailBox;
	}

	public function setMailBoxUserName($userName) {
		$this->mailBoxUserName = $userName;
	}
	public function getMailBoxUserName() {
		return $this->mailBoxUserName;
	}

	public function setMailBoxPassword($password) {
		$this->mailBoxPassword = $password;
	}
	public function getMailBoxPassword() {
		return $this->mailBoxPassword;
	}

	public function setMailBoxServer($server) {
		$this->mailBoxServer = $server;
	}
	public function getMailBoxServer() {
		return $this->mailBoxServer;
	}

	public function setMailBoxPort($port) {
		$this->mailBoxPort = $port;
	}
	public function getMailBoxPort() {
		return $this->mailBoxPort;
	}

	public function setMailBoxSecure($secure) {
		$this->mailBoxSecure = $secure;
	}
	public function getMailBoxSecure() {
		return $this->mailBoxSecure;
	}

	public function setTypeSender($value) {
		$this->typeSender = $value;
	}
	public function getTypeSender() {
		return $this->typeSender;
	}

	public function setSenderUserName($userName) {
		$this->senderUserName = $userName;
	}
	public function getSenderUserName() {
		return $this->senderUserName;
	}

	public function setSenderPassword($password) {
		$this->senderPassword = $password;
	}
	public function getSenderPassword() {
		return $this->senderPassword;
	}

	public function setSenderServer($server) {
		$this->senderServer = $server;
	}
	public function getSenderServer() {
		return $this->senderServer;
	}

	public function setSenderPort($port) {
		$this->senderPort = $port;
	}
	public function getSenderPort() {
		return $this->senderPort;
	}

	public function setSenderSecure($secure) {
		$this->senderSecure = $secure;
	}
	public function getSenderSecure() {
		return $this->senderSecure;
	}

	public function setLastReceived($data) {
		$this->lastReceived = $data;
	}
	public function getLastReceived() {
		return $this->lastReceived;
	}

}
?>