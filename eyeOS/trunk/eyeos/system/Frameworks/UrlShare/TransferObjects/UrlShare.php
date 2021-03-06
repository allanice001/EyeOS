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

class UrlShare implements IUrlShare {
	protected $id;
	protected $name;
	protected $password;
	protected $publicationDate;
	protected $expirationDate;
	protected $sendFrom;
	protected $mailText;
	protected $fileId;
	protected $lastDownloadDate;
	protected $enabled;
	
	public function getId () {
		return $this->id;
	}
	public function setId ($id) {
		$this->id = $id;
	}
	public function setName($name) {
		$this->name = $name;
	}
	public function getName() {
		return $this->name;
	}
	public function setPassword ($password) {
		$this->password = $password;
	}
	public function getPassword () {
		return $this->password;
	}
	public function setPublicationDate ($date) {
		$this->publicationDate = $date;
	}
	public function getPublicationDate () {
		return $this->publicationDate;
	}
	public function setExpirationDate ($date) {
		$this->expirationDate = $date;
	}
	public function getExpirationDate () {
		return $this->expirationDate;
	}
	public function setSendFrom ($from) {
		$this->sendFrom = $from;
	}
	public function getSendFrom () {
		return $this->sendFrom;
	}
	public function setMailText ($mailText) {
		$this->mailText = $mailText;
	}
	public function getMailText () {
		return $this->mailText;
	}
	public function setFileId ($id) {
		$this->fileId = $id;
	}
	public function getFileId () {
		return $this->fileId;
	}
	public function setLastDownloadDate ($date) {
		$this->lastDownloadDate = $date;
	}
	public function getLastDownloadDate () {
		return $this->lastDownloadDate;
	}
	public function setEnabled ($enabled) {
		$this->enabled = $enabled;
	}
	public function getEnabled () {
		return $this->enabled;
	}
	public function getAttributesMap() {
		return get_object_vars($this);
	}

	public function __toString() {
		$props = get_object_vars($this);
		$string = get_class($this) . '[';
		foreach($props as $name => $value) {
			if (!is_object($value) && $value !== null) {
				$string .= $name . '=' . $value . ',';
			}
		}
		$string = utf8_substr($string, 0, -1) . ']';
		return $string;
	}
}

?>
