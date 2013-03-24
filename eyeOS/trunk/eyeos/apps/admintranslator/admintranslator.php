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
* */

abstract class AdminTranslatorApplication extends EyeosApplicationExecutable {
	public static function __run(AppExecutionContext $context, MMapResponse $response) {
		$buffer = '';
		$basePath = EYE_ROOT . '/' . APPS_DIR . '/admintranslator/';
		$buffer .= file_get_contents($basePath . 'admintranslator.js');
		$buffer .= file_get_contents($basePath . 'LanguageAssignationView.js');
		$response->appendToBody($buffer);
	}

	/**
	 * Return if the current user can use this application,
	 * if so return also his language, and his code.
	 *
	 * @param <null> $params
	 * @return <Boolean>>
	 */
	public static function getCredential ($params) {
		$currentUserId = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		if ($currentUserId === 'eyeID_EyeosUser_root'){
			return 'true';
		} else {
			return 'false';
		}
	}

	/**
	 * Save Language assignation to the database
	 * 
	 * @param  $params => array (
	 *		language: String,
	 *		code: String,
	 *		assigned: String
	 *  )
	 */
	public static function saveLanguage ($params) {
		require_once APPS_DIR . '/admintranslator/LanguageAdminTO.php';
		
		if ($params === null || !is_array($params)) {
			throw new EyeInvalidArgumentException('Missing or invalid $params');
		}
		if (!isset($params['language']) || !is_string($params['language'])) {
			throw new EyeInvalidArgumentException('Missing or invalid $params[\'language\']');
		}
		if (!isset($params['code']) || !is_string($params['code'])) {
			throw new EyeInvalidArgumentException('Missing or invalid $params[\'code\']');
		}
		if (!isset($params['assigned']) || !is_string($params['assigned'])) {
			throw new EyeInvalidArgumentException('Missing or invalid $params[\'assigned\']');
		}
		
		$dao = StorageManager::getInstance()->getHandler('SQL/EyeosDAO');
		$to = new LanguageAdminTO();
		$to->setLanguage($params['language']);
		$to->setCode($params['code']);
		$to->setAssigned($params['assigned']);
		try {
			$dao->create($to);
		}catch (Exception $e) {
			if ($e instanceof EyeIntegrityConstraintViolationException) {
				throw new EyeIntegrityConstraintViolationException('Cannot add the same user for two translation assignation, or language already present', 0 ,$e);
			}
		}
	}

	/**
	 * Retrieve Language Assignation from Database
	 * 
	 * @param <null> $params
	 * @return <array>
	 */
	public static function retrieveLanguages($params) {
		require_once APPS_DIR . '/admintranslator/LanguageAdminTO.php';
		
		$dao = StorageManager::getInstance()->getHandler('SQL/EyeosDAO');
		$dbh = $dao->getConnection();
		$stmt = $dbh->prepare('SELECT * FROM languageadminto');
		try {
			$stmt->execute();
		} catch (Exception $e) {
			throw new EyeDAOException('Unable to retrieve Languages Assignation from database.', 0 ,$e);
		}

		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$toReturn = array();

		foreach ($result as $entry) {
			$objectClass = new LanguageAdminTo();
			$row = new $objectClass;
			foreach ($entry as $key => $value) {
				$methodName = 'set' . ucfirst($key);
				$row->$methodName($value);
			}
			$toReturn[] = $row;
		}

		return self::toArray($toReturn);
	}

	/**
	 * Delete an Assignation providing an id
	 * 
	 * @param <Integer> $param The id of the Assignation to delete
	 */
	public static function deleteLanguage ($params) {
		require_once APPS_DIR . '/admintranslator/LanguageAdminTO.php';
		
		if ($params === null || !is_numeric($params)) {
			throw new EyeInvalidArgumentException('Missing or invalid $params');
		}
		$to = new LanguageAdminTO();
		$to->setId($params);
		$dao = StorageManager::getInstance()->getHandler('SQL/EyeosDAO');
		try {
			$dao->delete($to);
		}catch (Exception $e) {
			throw new EyeDAOException('Unable to delete Language assignation from database.', 0 ,$e);
		}
	}

	/**
	 * Performs a PHP variable => JSON-compatible array conversion with objects of class EyeosEventNotification
	 * and array of EyeosEventNotification.
	 *
	 * @param public function getAttributesMap() $value
	 * @return array
	 */
	private static function toArray($value) {
		if ($value instanceof LanguageAdminTO) {
			$result = $value->getAttributesMap();
			return $result;
		}
		if (!is_array($value)) {
			throw new EyeInvalidArgumentException('Invalid $value must be an LanguageAdminTO or an array of LanguageAdminTO');
		}

		foreach($value as &$v) {
			$v = self::toArray($v);
		}
		return $value;
	}

		/**
	 * Retrieve all the User on the system (primaryGroupId = eyeID_EyeosGroup_users)
	 *
	 * @param array $params(
	 *		[filter => String]		Optional, a filter for the ID or the Name of the user
	 * )
	 * @return array(
	 *		'id' => String,
	 *		'name'=> String
	 * )
	 */
	public static function getAllUsers ($params) {
		$return = array();
		$users = UMManager::getInstance()->getAllUsers();

		if (isset($params) && $params['filter'] !== null && is_string($params['filter']) && strlen($params['filter'])) {
			$filter = $params['filter'];
		}

		foreach ($users as $user) {
			if ($user->getPrimaryGroupId() !== 'eyeID_EyeosGroup_users'){
				continue;
			}

			// Retrieve The Name of the User
			$settings = MetaManager::getInstance()->retrieveMeta($user);
			$firstName = '';
			$lastName = '';
			if (isset($settings)) {
				if ($settings->get('eyeos.user.firstname') != null) {
					$firstName = $settings->get('eyeos.user.firstname');
				}

				if ($settings->get('eyeos.user.lastname') != null) {
					$lastName = $settings->get('eyeos.user.lastname');
				}
			}

			$userId = $user->getId();
			$userName = $firstName . ' ' . $lastName;

			// If we provide $params['filter], we filter the results by the name or the id
			if (isset($filter)) {
				if ( (stristr($userId, $filter) === FALSE) && (stristr($userName, $filter) === FALSE) ) {
					continue;
				}
			}

			$return[] = array(
					'id' => $userId,
					'name' => $userName
			);
		}
		usort($return, 'AdminTranslatorApplication::userCMP');
		return $return;
	}

	/**
	 * Comparition function to compare return value of getAllUsers
	 */
	private static function userCMP ($a, $b) {
		return $a['name'] > $b['name'];
	}

	/**
	 * Get an first Name and Last Name of a user providing an Id
	 *
	 * @param String $params Userid
	 */
	public static function getUserNameById ($params) {
		if (!isset($params) || !is_string($params)) {
			throw new EyeInvalidArgumentException('Missing or invalid $params');
		}

		$user = UMManager::getInstance()->getUserById($params);
		$settings = MetaManager::getInstance()->retrieveMeta($user);

		return $settings->get('eyeos.user.firstname') . ' ' . $settings->get('eyeos.user.lastname');
	}
}

?>
