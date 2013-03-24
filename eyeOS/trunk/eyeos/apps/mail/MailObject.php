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

class MailObject {
	private $id;
	private $mailTO = null;
	private $localTagsPerMailTO = array(); //LocalTags
	private $foldersPerMailTO = array(); //Folders
	private $attachments = array();

	public function __construct(MailTO $mailTO) {
		$this->mailTO = $mailTO;
		$this->id = $this->mailTO->getId();

		$provider = new SQLMailProvider();
		$this->attachments = $provider->getAllAttachments($this->id);
		$this->localTagsPerMailTO = $provider->retrieveAllLocalTagsPerMailTO($this->id);
		$this->foldersPerMailTO = $provider->retrieveAllFoldersPerMailTO($this->id);

	}

	public function getId() {
		return $this->id;
	}

	public function getLocalTagsPerMailTO() {
		return $this->localTagsPerMailTO;
	}
	public function getFoldersPerMailTO() {
		return $this->foldersPerMailTO;
	}

	public function addTag($labelId) {
		$provider = new SQLMailProvider();
		$newLocalTagPerMailTO = new LocalTagPerMailTO();
		$newLocalTagPerMailTO->setLabelId($labelId);
		$newLocalTagPerMailTO->setMailId($this->mailTO->getId());

		$tagExist = false;
		$localTags = $this->localTagsPerMailTO;
		foreach ($localTags as $localTag) {
			if ($localTag->getLabelId() == $labelId) {
				$tagExist = true;
			}
		}
		if (!$tagExist) {
			$provider->storeLocalTagPerMailTO($newLocalTagPerMailTO);
		}
	}

	public function addFolder($labelId) {
		$provider = new SQLMailProvider();
		$newFolderPerMailTO = new FolderPerMailTO();
		$newFolderPerMailTO->setLabelId($labelId);
		$newFolderPerMailTO->setMailId($this->mailTO->getId());

		$provider->storeFolderPerMailTO($newFolderPerMailTO);
	}

	public function sendMailToTrash() {
		$this->removeAllFolder();

		$provider = new LabelManager();
		$trash = $provider->getFolderByName('Deleted Messages', $this->mailTO->getAccountId());
		$this->addFolder($trash->getId());

	}

	public function removeTag($labelId) {

		$localTagsPerMailTO = $this->localTagsPerMailTO;
		foreach ($localTagsPerMailTO as $currentLocalTagPerMailTO) {
			if ($labelId == $currentLocalTagPerMailTO->getLabelId()) {
				$localTagMailToRemove = $currentLocalTagPerMailTO;
				break;
			}
		}
		$provider = new SQLMailProvider();
		$provider->deleteLocalTagPerMailTO($localTagMailToRemove);
	}

	public function removeFolder($labelId) {

		$folderPerMailTO = $this->foldersPerMailTO;
		foreach ($folderPerMailTO as $currentFolderPerMailTO) {
			if ($labelId == $currentFolderPerMailTO->getLabelId()) {
				$folderMailToRemove = $currentFolderPerMailTO;
				break;
			}
		}
		$provider = new SQLMailProvider();
		$provider->deleteFolderPerMailTO($folderMailToRemove);
	}
	public function removeAllFolder() {
		$provider = new SQLMailProvider();
		$folderPerMailTO = $this->foldersPerMailTO;
		foreach ($folderPerMailTO as $currentFolderPerMailTO) {

			$provider->deleteFolderPerMailTO($currentFolderPerMailTO);

		}


	}

	public function getAccountId() {
		return $this->mailTO->getAccountId();
	}

	public function getMailTO() {
		return $this->mailTO;
	}

	public function setReaded($value) {
		$this->mailTO->setReaded($value);
	}
	public function getReaded() {
		return $this->mailTO->getReaded();
	}

	public function getAttachments() {
		return $this->attachments;
	}
	
	public function getArrayOfAttachments() {
		$attachments = $this->attachments;

		$arrayAttachments = array();
		if(count($attachments) > 0) {
			foreach($attachments as $currentAttachment) {
				//var_dump($currentAttachment);
				$arrayAttachments[] = array(
						'name' => $currentAttachment->getName(),
						'path' => $currentAttachment->getPath(),
						'type' => $currentAttachment->gettype(),
						'size' => $currentAttachment->getSize()
				);
			}
		}

		return $arrayAttachments;
	}
	public function setAttachments($arrayOfAttachments) {
		$this->attachments = $arrayOfAttachments;
	}

	public function addAttachment($path) {
		//TODO
	}
	public function removeAttachment(Attachment $file) {
		//TODO
	}

	public function getStarred() {
		$starred = false;

		$folders = $this->foldersPerMailTO;
		foreach($folders as $currentFolder) {
			$folderName = $this->getFolderName($currentFolder->getLabelId());
			if ($folderName == 'Starred') {
				$starred == true;
			}
		}

		return $starred;
	}

	private function getFolderName($labelId) {
		$labelManager = new LabelManager();
		$folder = $labelManager->getFolderById($labelId);
		return $folder->getName();
	}


	public static function cmp_obj($a, $b) {
		$al = strtolower($a->mailTO->getDateTime());
		$bl = strtolower($b->mailTO->getDateTime());
		if ($al == $bl) {
			return 0;
		}
		return ($al < $bl) ? +1 : -1;
	}

}
?>