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

class LabelManager {

	private $provider = null;

	function __construct() {
		$this->provider = new SQLLabelProvider(); //HARD-CODED
	}

	// -------- FOLDERS --------------------------------------------

	function getAllFolders($userId, $accountId) {
		$folder = new Folder();
		$folder->setUserId($userId);
		$folder->setAccount($accountId);
		//$folders = $this->provider->retrieveAllFolders($folder);

		$provider = new SQLLabelProvider();
		$folders = $provider->retrieveAllFolders($folder);

		usort($folders, array("Folder", 'cmp_obj'));

		return $folders;
	}

	function createFolder($userId, $name, $path, $accountId) {
		$newFolder = new Folder();
		$newFolder->setId($this->provider->getFolderMaxId() + 1);
		$newFolder->setUserId($userId);
		$newFolder->setName($name);
        $newFolder->setPath($path);
		$newFolder->setAccount($accountId);

		//print_r($newFolder);
		$this->provider->storeFolder($newFolder);
	}

	function editFolder(Folder $folder) {
		$this->provider->updateFolder($folder);
	}

	function removeFolder(Folder $folder) {
		$this->provider->deleteFolder($folder);
	}

	function removeAllFolders($accountId) {
		$this->provider->deleteAllFolders($accountId);
	}

	function getFolderById($folderId) {
		return $this->provider->retrieveFolderById($folderId);
	}

	function getFolderByName($name, $accountId) {
		return $this->provider->retrieveFolderByName($name, $accountId);
	}

	function getFoldersByName($name, $user) {
		return $this->provider->retrieveFoldersByName($name, $user);
	}

	// -------- TAGS -------------------------------------------------

	function getAllTags($userId) {
		$tag = new LocalTag();
		$tag->setUserId($userId);
		$provider = new SQLLabelProvider();
		$tags = $provider->retrieveAllTags($tag);

		usort($tags, array("LocalTag", 'cmp_obj'));

		return $tags;
	}

	/**
	 * 
	 * @param color
	 * @param name
	 */
	function createTag($color, $name, $userId) {
		$newTag = new LocalTag();
		$newTag->setId($this->provider->getTagMaxId() + 1);
		$newTag->setName($name);
        $newTag->setColor($color);
		$newTag->setUserId($userId);

		$this->provider->storeTag($newTag);
		return $newTag;
	}

	/**
	 * 
	 * @param tag
	 * @param newName
	 */
	function editTag(LocalTag $tag) {
		$this->provider->updateTag($tag);
	}

	function getLocalTagById($localTagId) {
		return $this->provider->retrieveLocalTagById($localTagId);
	}

	/**
	 * 
	 * @param tag
	 */
	function removeTag(LocalTag $tag) {
		$this->provider->deleteTag($tag);
	}

	public function isSetUser($userId) {
		$result = $this->provider->retrieveUser($userId);
		if ($result != null) {
			//nothing to do;
		} else {
			//User not exist, so create basic folders and local tags
			$this->createFolder($userId, 'Inbox', 'Inbox', 0);
			$this->createFolder($userId, 'Drafts', 'Drafts', 0);
			$this->createFolder($userId, 'Sent', 'Sent', 0);
			$this->createFolder($userId, 'Starred', 'Starred', 0);
			$this->createFolder($userId, 'Trash', 'Trash', 0);

			$this->createTag('#660000', 'Important', $userId);
			$this->createTag('#993300', 'Later', $userId);
			$this->createTag('#CC0066', 'Personal', $userId);
			$this->createTag('#009900', 'To Do', $userId);
			$this->createTag('#000099', 'Work', $userId);
			
		}
	}

}
?>