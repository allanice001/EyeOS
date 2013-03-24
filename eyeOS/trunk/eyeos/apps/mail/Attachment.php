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


class Attachment {

	private $id;
	private $mailId;
	private $name;
	private $size;
	private $type;
	private $path;

	public function setId($id) {
		$this->id = $id;
	}
	public function getId() {
		return $this->id;
	}

	public function setMailId($mailId) {
		$this->mailId = $mailId;
	}
	public function getMailId() {
		return $this->mailId;
	}

	public function setName($name) {
		$this->name = $name;
	}
	public function getName() {
		return $this->name;
	}

	public function setSize($value) {
		$this->size = $value;
	}
	public function getSize() {
		return $this->size;
	}

	public function setType($value) {
		$this->type = $value;
	}
	public function getType() {
		return $this->type;
	}

	public function setPath($value) {
		$this->path = $value;
	}
	public function getPath() {
		return $this->path;
	}

}
?>