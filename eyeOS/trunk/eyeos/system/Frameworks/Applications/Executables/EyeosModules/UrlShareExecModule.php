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
class UrlShareExecModule implements IEyeosExecutableModule {
	public function checkExecutePermission() {
		SecurityManager::getInstance()->checkExecute($this);
	}

	public function createUrl($params) {
		$path = $params['path'];
		$searchFile= new UrlFile();
		$searchFile->setPath($path);
		$files = UrlShareController::getInstance()->searchFile($searchFile);

		if (!is_array($files) || count($files) == 0) {
			$newFile = UrlShareController::getInstance()->createFile($searchFile);
		} else {
			$newFile = current($files);
		}

		$url = new UrlShare();
		$url->setFileId($newFile->getId());
		$url = UrlShareController::getInstance()->createUrl($url);
		$url->setName(self::idToHash($url->getId()));
		$url->setMailText(self::createNewUrlMessageText(basename($path), $url->getName()));
		$url->setPublicationDate(time());
		$url->setExpirationDate($url->getPublicationDate() + 60 * 60 * 24 * 31);
		$url->setEnabled(true);

		$returnUrl = UrlShareController::getInstance()->updateUrl($url);
		return $returnUrl->getAttributesMap();
	}

	private function createNewUrlMessageText ($fileName, $urlString) {
		$mailText = URLSHARE_MAIL;
		$mailText = preg_replace('/%%FILENAME%%/', $fileName, $mailText);
		$mailText = preg_replace('/%%URL%%/', $urlString, $mailText);

		return $mailText;
	}
	
	private static function idToHash($id) {
		$length = max(5, strlen($id));
		$zId = str_pad($id, $length, "0", STR_PAD_LEFT);
		$hashedString = "";
		$charArray = array("B", "X", "R", "M", "A", "Z", "U", "W", "E", "I");
		for ($i = 0; $i < $length; $i++) {
			$char = substr($zId, $i, 1);
			if ($i % 3) {
				$hashedString = $hashedString . $char;
			} else {
				$hashedString = $hashedString . $charArray[$char];
			}
		}
		return md5($hashedString);
	}

	public static function getUrlInfo($params) {
		$urlShareId = $params['urlId'];

		$urlShare = new UrlShare();
		$urlShare->setId($urlShareId);
		UrlShareController::getInstance()->readUrl($urlShare);
		$urlShare->setName($_SERVER['HTTP_REFERER'].'index.php?download=' . $urlShare->getName());

		$myUser = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
		$email = MetaManager::getInstance()->retrieveMeta($myUser)->get('eyeos.user.email');


		$urlMailSent = new UrlMailSent();
		$urlMailSent->setUrlId($urlShareId);
		$sentAddresses = UrlShareController::getInstance()->searchMailSent($urlMailSent);

		$sentList = array();
		foreach ($sentAddresses as $sentAddress) {
			$urlMail = new UrlMail();
			$urlMail->setId($sentAddress->getMailAddressId());
			UrlShareController::getInstance()->readMail($urlMail);
			$sentList[] = $urlMail->getAddress();
		}

		$urlMailByUser = new UrlMail();
		$urlMailByUser->setUserId($myUser->getId());
		$availableAddresses = UrlShareController::getInstance()->searchMail($urlMailByUser);
		$availableList = array();
		foreach ($availableAddresses as $availableAddress) {
			$availableList[] = $availableAddress->getAddress();
		}

		return array(
			"urlInformation" => $urlShare->getAttributesMap(),
			"sentList" => $sentList,
			"availableList" => $availableList
		);
	}

	public static function getShareURLSByFilePath($filePath) {
		$UrlShareController = UrlShareController::getInstance();
		$fileToSearch = new UrlFile();
		$fileToSearch->setPath($filePath);
		$urlFile = $UrlShareController->searchFile($fileToSearch);

		if ($urlFile === null || count($urlFile) < 1) {
			return null;
		}
		$urlFile = current($urlFile);
		$fileId = $urlFile->getId();

		$urlShareToSearch = new UrlShare();
		$urlShareToSearch->setFileId($fileId);
		$urlShares = $UrlShareController->searchUrl($urlShareToSearch);

		return self::toArray($urlShares);
	}

	public static function deleteURL($urlId) {
		$urlShare = new UrlShare();
		$urlShare->setId($urlId);
		UrlShareController::getInstance()->deleteUrl($urlShare);
	}

	public static function updateURL($params) {
		$urlId = $params['id'];
		$password = $params['password'];
		$expirationDate = $params['expirationDate'];
		$mailsToSend = $params['mailsToSend'];
		$mailText = $params['mailText'];
		$enabled = $params['enabled'];
		$sendFrom = URLSHARE_MAILFROM;

		$myProcManager = ProcManager::getInstance();
		$myUserId = $myProcManager->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();

		$UrlShareController = UrlShareController::getInstance();
		$urlShare = new UrlShare();
		$urlShare->setId($urlId);
		$UrlShareController->readUrl($urlShare);

		$urlShare->setPassword($password);
		$urlShare->setExpirationDate($expirationDate);
		$urlShare->setSendFrom($sendFrom);
		$urlShare->setMailtext($mailText);
		$urlShare->setEnabled($enabled);
		$UrlShareController->updateURL($urlShare);

		foreach ($mailsToSend as $mailToSend) {
			$mailAddress = new UrlMail();
			$mailAddress->setAddress($mailToSend);
			$mailAddress->setUserId($myUserId);
			$searchMailAddress = $UrlShareController->searchMail($mailAddress);
			if ($searchMailAddress !== null && count($searchMailAddress) == 1) {
				$mailAddress = current($searchMailAddress);
			} else {
				$mailAddress = $UrlShareController->createMail($mailAddress);
			}

			$mailAddressSent = new UrlMailSent();
			$mailAddressSent->setUrlId($urlId);
			$mailAddressSent->setUserId($myUserId);
			$mailAddressSent->setMailAddressId($mailAddress->getId());
			$searchMailAddressSent = $UrlShareController->searchMailSent($mailAddressSent);
			if ($searchMailAddressSent === null || count($searchMailAddressSent) == 0) {
				$UrlShareController->createMailSent($mailAddressSent);
			}
			
		}

		$urlFile = new UrlFile();
		$urlFile->setId($urlShare->getFileId());
		$UrlShareController->readFile($urlFile);

		
		$fileName = basename($urlFile->getPath());
		if (count($mailsToSend) > 0) {
			//Send Mail
			self::prepareMail($sendFrom, implode(',', $mailsToSend), $urlShare, $fileName, $password, $expirationDate, $mailText);
		}
	}


	private static function prepareMail($from, $to, $urlShare, $fileName, $password, $expirationDate, $message) {
		if ($message) {
			$urlAddress = $_SERVER['HTTP_REFERER'].'index.php?download=' . $urlShare->getName();
			$message = self::rearrangeMessage($message, $fileName, $urlAddress, $password, $expirationDate);
			self::sendMail($from, $to, $message);
		}
	}

	private static function rearrangeMessage($message, $fileName, $urlString, $password, $expirationDate) {
		if (!$message) {
			return null;
		}
		if ($password === null || $password == '') {
			$message = str_replace("%%PASSWORD%%", $password, $message);
		} else {
			$message = str_replace('<tr><td bgcolor="#999999"><strong>Password:</strong></td><td bgcolor="#CCCCCC">%%PASSWORD%%</td></tr>', '', $message);
		}

		if ($expirationDate) {
			$message = str_replace("%%TIMELIMIT%%", date("j/ n/ Y", $expirationDate), $message);
		} else {
			$message = str_replace('<tr>
					<td bgcolor="#999999"><strong>Data de caducitat:</strong></td>
					<td bgcolor="#cccccc">%%TIMELIMIT%%</td>
					</tr>', "", $message);
		}
		if ($fileName) {
			$message = str_replace("%%FILENAME%%", $fileName, $message);
		}
		$message = str_replace("%%URLSTRING%%", $urlString, $message);
		return $message;
	}

	private static function sendMail($from, $to, $message) {
		// subject
		$subject = URLSHARE_SUBJECT;

		// To send HTML mail, the Content-type header must be set
		$headers = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

		// Additional headers
		$headers .= 'To: ' . trim($to) . "\r\n";
		$headers .= 'From: ' . $from . ';';


		// Mail it
		mail($to, $subject, $message, $headers);
	}

	/**
	 * Performs a PHP variable => JSON-compatible array conversion with objects of class IWorkgroup,
	 * IUserWorkgroupAssignation, IUser, and arrays of the previous types.
	 *
	 * @param mixed $value
	 * @return array
	 */
	private static function toArray($value) {
		if (!isset($value)) {
			return null;
		}
		if ($value instanceof IMetaData) {
			return $value->getAll();
		}
		if ($value instanceof ISimpleMapObject) {
			return $value->getAttributesMap();
		}
		if (!is_array($value)) {
			throw new EyeInvalidArgumentException('$value must be implement an ISimpleMapObject');
		}

		foreach($value as &$v) {
			$v = self::toArray($v);
		}
		return $value;
	}
}

?>
