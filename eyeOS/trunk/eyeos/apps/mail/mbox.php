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

class MBoxReader {
	private $path;

	public function __construct() {
	
	}	
	
	public function connect($path) {
		if(!file_exists($path)) {
			return 0;
		}
		$this->path = $path;
		return true;
	}
	
	public function listBoxes() {
		if(!$this->path) {
			return 0;
		}
		
		$return = array();
		
		if ($handle = opendir($this->path)) {
			while (false !== ($file = readdir($handle))) {
				if ($file != "." && $file != "..") {
				    $return[] = $file;
				}
			}
			closedir($handle);
		}
		
		return $return;
	}
	
	public function countNewMails($mailbox) {
		$secureName = basename($mailbox);
		$i = 0;
		
		if ($handle = opendir($this->path . '/' . $secureName . '/new/')) {
			while (false !== ($file = readdir($handle))) {
				if ($file != "." && $file != "..") {
				    $i++;
				}
			}
			closedir($handle);
		}	
		
		return $i;
	}
	
	public function countMails($mailbox) {
		$secureName = basename($mailbox);
		$i = 0;
		if ($handle = opendir($this->path . '/' . $secureName . '/cur/')) {
			while (false !== ($file = readdir($handle))) {
				if ($file != "." && $file != "..") {
				    $i++;
				}
			}
			closedir($handle);
		}
		
		if ($handle = opendir($this->path . '/' . $secureName . '/new/')) {
			while (false !== ($file = readdir($handle))) {
				if ($file != "." && $file != "..") {
				    $i++;
				}
			}
			closedir($handle);
		}	
		
		return $i;
	}
	
	public function listNewMails($mailbox) {
		$secureName = basename($mailbox);
		return $this->getMailList($this->path . '/' . $secureName . '/new/');		
	}
	
	public function listMails($mailbox) {
		$secureName = basename($mailbox);
		return $this->getMailList($this->path . '/' . $secureName . '/cur/');
	}
	
	private function getMailList($path) {
		if ($handle = opendir($path)) {
			while (false !== ($file = readdir($handle))) {
				if ($file != "." && $file != "..") {
				    $return[] = $file;
				}
			}
			closedir($handle);
		}	
		natsort($return);
		$return = array_reverse($return);
		return $return;
	}
	
	private function getMail($mailbox, $mail) {
		
	}
}
?>
