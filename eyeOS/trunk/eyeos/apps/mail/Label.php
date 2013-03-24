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


Abstract class AbstractLabel {

	private $id;
	private $userId; //Eyeos User
	private $name;
	
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

	public function setName($name) {
		$this->name = $name;
	}
	public function getName() {
		return $this->name;
	}
}

class LocalTag extends AbstractLabel {
	private $color;

	public function setColor($color) {
		$this->color = $color;
	}
	public function getColor() {
		return $this->color;
	}

	public static function cmp_obj($a, $b) {
        $al = strtolower($a->getName());
        $bl = strtolower($b->getName());
        if ($al == $bl) {
            return 0;
        }
        return ($al > $bl) ? +1 : -1;
    }
}

class Folder extends AbstractLabel {

	private $account = null;
	private $path;
	private $noContent = false; //if true: this folder is directory only. No messages inside.

	public function setAccount($value) {
		$this->account = $value;
	}
	public function getAccount() {
		return $this->account;
	}

	public function setPath($value) {
		$this->path = $value;
	}
	public function getPath() {
		return $this->path;
	}

	public function setNoContent($value) {
		$this->noContent = $value;
	}
	public function getNoContent() {
		return $this->noContent;
	}

	public static function cmp_obj($a, $b) {
        $al = strtolower($a->getPath());
        $bl = strtolower($b->getPath());
        if ($al == $bl) {
            return 0;
        }
        return ($al > $bl) ? +1 : -1;
    }

}

?>