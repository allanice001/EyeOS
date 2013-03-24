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

abstract class TranslatorApplication extends EyeosApplicationExecutable {
	public static function __run(AppExecutionContext $context, MMapResponse $response) {
		$buffer = '';
		$basePath = EYE_ROOT . '/' . APPS_DIR . '/translator/';
		$buffer .= file_get_contents($basePath . 'translator.js');
		$response->appendToBody($buffer);
	}

	/**
	 * Return if the current user can use this application,
	 * if so return also his language, and his code.
	 * 
	 * @param <null> $params
	 * @return null | <mixed>
	 */
	public static function getCredential ($params) {
		$currentUserId = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();

		$dao = StorageManager::getInstance()->getHandler('SQL/EyeosDAO');
		$dbh = $dao->getConnection();
		$stmt = $dbh->prepare('SELECT * FROM languageadminto WHERE assigned = ? ');
		$stmt->bindParam(1, $currentUserId, PDO::PARAM_STR);
		$stmt->execute();

		$return = $stmt->fetch(PDO::FETCH_ASSOC);
		if ($return) {
			return $return;
		} else {
			return null;
		}
	}

	/**
	 * Retrieve all the application to translate and his relative status of traduction
	 * ( 2=> complete, 1=>partial, 0=>none)
	 * 
	 * @param <String> The code of the language
	 * @return <array>
	 */
	public static function getApplications ($params) {
		$directory = new DirectoryIterator(EYE_ROOT . '/' . APPS_DIR);
		$applications = array();
		foreach ($directory as $fileInfo) {
			$fileInfoName = $fileInfo->getFilename();
			// We look for applications that have already an english translation
			if ($fileInfo->isDir() && $fileInfoName{0} != '.' && file_exists(EYE_ROOT . '/' . APPS_DIR. '/' . $fileInfoName . '/lang/en/en.js')) {
				$applications[] = array(
					'app' => $fileInfoName,
					'status' => self::getTranslationStatus($fileInfoName, $params)
				);
			}
		}
		return $applications;
	}
	
	/**
	 * Return a numerical code rapresenting the status of the traduction
	 * 
	 * @param <String> $appName The name of the dir of the application
	 * @param <String> $code The 2 digit code for the language
	 * @return <Numeric> 0=> no traduction, 1=> partial traduction, 2=> full traduction
	 */
	private static function getTranslationStatus($appName, $code) {
		// Check Status 0 => No traduction
		if (!file_exists(EYE_ROOT . '/' . APPS_DIR. '/' . $appName . '/lang/' . $code . '/' . $code . '.js')) {
			return 0;
		}

		// Check other status
		$enTrad = self::loadTranslation(array(
			'appName' => $appName,
			'code' => 'en'
		));
		$yourTrad = self::loadTranslation(array(
			'appName' => $appName,
			'code' => $code
		));

		// Retrieve english traduction keys
		$enKeys = array_keys($enTrad);
		sort($enKeys);
		//Retrieve your language keys only for not empty values
		$yourKeys = array_keys(array_filter($yourTrad, 'TranslatorApplication::isNotNull'));
		sort($yourKeys);

		if (count($yourKeys) == 0) {
			//File exist but no string was translated
			return 0;
		}
		if (!array_diff($enKeys, $yourKeys)){
			//Full translated
			return 2;
		} else {
			//Partial traduction
			return 1;
		}
	}

	/**
	 * Callback function for array_filter
	 */
	private static function isNotNull($var) {
		return($var !== null && $var !== '');
	}

	/**
	 * Callback function for array_walk
	 */
	private static function setNull(&$element, $key) {
		$element = null;
	}

	/**
	 * Save the actual translation to the related file, if the file or the dir doesn't exist
	 * will be created
	 * 
	 * @param <array> $param
	 */
	public static function saveTranslation($params) {
		if (!isset($params) && !is_array($params)) {
			throw new EyeInvalidArgumentException('Missing or invalid $params');
		}
		if (!isset($params['appName']) || !is_string($params['appName'])) {
			throw new EyeInvalidArgumentException('Missing or invalid $params[\'appName\']');
		}
		$appName = $params['appName'];
		if (!isset($params['code']) || !is_string($params['code'])) {
			throw new EyeInvalidArgumentException('Missing or invalid $params[\'code\']');
		}
		$code = $params['code'];
		if (!isset($params['traduction']) || !is_array($params['traduction'])) {
			throw new EyeInvalidArgumentException('Missing or invalid $params[\'traduction\']');
		}
		$traduction = $params['traduction'];

		$fileName = EYE_ROOT . '/' . APPS_DIR. '/' . $appName . '/lang/' . $code . '/' . $code . '.js';
		if (!file_exists(EYE_ROOT . '/' . APPS_DIR. '/' . $appName . '/lang/' . $code)) {
			mkdir(EYE_ROOT . '/' . APPS_DIR. '/' . $appName . '/lang/' . $code);
		}
		$fileHandler = fopen($fileName, 'w');

		foreach ($traduction as $key => $value){
			$key = addslashes($key);
			$value = addslashes($value);
			$string = 'lang[\'' . $key . '\'] = \'' . $value . '\';';
			fwrite($fileHandler, $string . "\n");
		}
		fclose($fileHandler);
	}

	/**
	 * Load the translation for an application and a language
	 * 
	 * @return <array>
	 */
	public static function loadTranslation($params) {
		$appName = $params['appName'];
		$code = $params['code'];

		/**
		 * If the file doesn't exist
		 * 1) Retrieve English scheme of translation
		 * 2) Set null all the values, so we have just the key with no value
		 */
		if (!file_exists(EYE_ROOT . '/' . APPS_DIR. '/' . $appName . '/lang/' . $code . '/' . $code . '.js')) {
			$param = array(
				'appName' => $appName,
				'code' => 'en'
			);
			$enTrad = self::loadTranslation($param);
			array_walk($enTrad, 'TranslatorApplication::setNull');
			$param = array(
				'appName' => $appName,
				'code' => $code,
				'traduction' => $enTrad
			);
			self::saveTranslation($param);
			return $enTrad;
		}

		/**
		 * If language is english, just retrieve the language as normal
		 */
		if ($code === 'en') {
			$file = fopen(EYE_ROOT . '/' . APPS_DIR. '/' . $appName . '/lang/' . $code . '/' . $code . '.js', "r");
			$return = array();
			while(!feof($file)) {
				$line =  stripslashes(fgets($file));
				$regex_pattern = "|^lang\['(.+)'\]\s*=\s*'(.+)'\s*;\s*$|u";
				preg_match($regex_pattern, $line, $matches);
				if (isset($matches) && count($matches) == 3) {
					if (count($matches[2])) {
						$return[$matches[1]] = $matches[2];
					}
				}
			}
			fclose($file);
			return $return;
		} else {
			/**
			 * If the language is not english, retrieve english scheme and update id with actual traduction.
			 * In this way if there are somes update on the main language, the actual language will be affected.
			 */
			$param = array(
				'appName' => $appName,
				'code' => 'en'
			);
			$enTrad = self::loadTranslation($param);
			array_walk($enTrad, 'TranslatorApplication::setNull');
			$file = fopen(EYE_ROOT . '/' . APPS_DIR. '/' . $appName . '/lang/' . $code . '/' . $code . '.js', "r");
			$return = $enTrad;
			while(!feof($file)) {
				$line =  stripslashes(fgets($file));
				$regex_pattern = "|^lang\['(.+)'\]\s*=\s*'(.+)'\s*;\s*$|u";
				preg_match($regex_pattern, $line, $matches);
				if (isset($matches) && count($matches) == 3) {
					if (count($matches[2])) {
						$return[$matches[1]] = $matches[2];
					}
				}
			}
			fclose($file);
			return $return;
		}
	}
}
?>
