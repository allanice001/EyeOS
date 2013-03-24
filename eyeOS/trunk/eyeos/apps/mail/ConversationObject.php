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

class ConversationObject {

	private $id;
	private $conversationTO = null;
	private $mailsTO = null;
	private $mails;
	private $starred = false;
	private $date;
	private $from;
	private $subject;
	private $tags;
	private $attachments; //number of attachments
	private $unread; //number of unread messages
	private $messages; //number of messages


	public function __construct(ConversationTO $conversationTO) {
		$this->conversationTO = clone($conversationTO);
		$this->id = $this->conversationTO->getId();

		$provider = new SQLMailProvider();

		$this->mailsTO = $provider->getAllMailsTOInConversation($this->id);
		$this->mails = $this->getMails();

//		$this->starred = $this->getStarred();
//		$this->date = $this->getDate();
//		$this->from = $this->getFrom();
//		$this->tags = $this->getTags();
//		$this->subject = $this->getSubject();
//		$this->attachments = $this->getAttachments();
//		$this->unread = $this->getUnreadMessages();
//		$this->messages = $this->getNumberOfMessages();
	}

	public function getId() {
		return $this->id;
	}
	public function getMails() {
		$mails = array();
		foreach ($this->mailsTO as $currentMailTO) {
			$newMail = new MailObject($currentMailTO);
			$mails[] = $newMail;
		}
		usort($mails, array("MailObject", 'cmp_obj'));

		//print_r($mails);
		return $mails;
	}

	public function getStarred() {
		$starred = false;
		foreach($this->mails as $currentMail) {
			$labels = $currentMail->getFoldersPerMailTO();
			foreach($labels as $currentLabel) {
				$labelName = $this->getLabelName($currentLabel->getLabelId());
				if ($labelName == 'Starred') {
					$starred == true;
				}
			}
		}
		return $starred;
	}

	public function getDate() {
		$date = 0;
		foreach($this->mailsTO as $currentMailTO) {
			if ($currentMailTO->getDateTime() > $date) {
				$date = $currentMailTO->getDateTime();
			}
		}
		return $date;
	}

	public function getFrom() {
		$from = array();
		foreach ($this->mails as $currentMail) {
			if (!in_array($currentMail->getMailTO()->getFromName(), $from)) {
				$from[] = $currentMail->getMailTO()->getFromName();
			}
		}
		return $from;
	}

	public function getLabelName($labelId) {
		$labelManager = new LabelManager();
		$folder = $labelManager->getFolderById($labelId);
		//var_dump($folder);exit;
		return $folder->getName();
	}

	public function getSubject() {
		
		return $this->mails[0]->getMailTO()->getSubject();
	}


	public function getTags() {

		$tags = array();
		foreach ($this->mails as $currentMail) {
			foreach($currentMail->getLocalTagsPerMailTO() as $label) {
				$labelId = $label->getLabelId();
				if (!in_array($labelId, $tags)) {
					$tags[] = $labelId;
				}
			}
		}
		return $tags;
	}

	public function getTagsNames() {

		$tags = array();
		foreach ($this->mails as $currentMail) {
			foreach($currentMail->getLocalTagsPerMailTO() as $label) {
				$labelId = $label->getLabelId();
				$provider = new LabelManager();
				$label = $provider->getLocalTagById($labelId);
				$labelName = $label->getName();
				if (!in_array($labelName, $tags)) {
					$tags[] = $labelName;
				}
			}
		}
		return $tags;
	}

	public function getNumberOfAttachments() {
		$numberOfAttachments = 0;
		foreach ($this->mails as $currentMail) {
			$provider = new SQLMailProvider();
			$attachments = count($provider->getAllAttachments($currentMail->getId()));
			$numberOfAttachments += $attachments;
		}
		return $numberOfAttachments;
	}

	public function getUnreadMessages() {
		$unReadMessages = 0;
		foreach($this->mails as $currentMail) {
			if ($currentMail->getReaded() == 'false') {
				$unReadMessages += 1;
			}
		}
		return $unReadMessages;
	}

	public function getNumberOfMessages() {
		return  count($this->mails);
	}

}
?>