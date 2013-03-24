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

define('APP_USERSETTINGS_ITEMS_DIR', 'items');

abstract class UsersettingsApplication extends EyeosApplicationExecutable {	
	public static function __run(AppExecutionContext $context, MMapResponse $response) {
		//if ($context->getIncludeBody()) {
			$buffer = '';
		
			$buffer .= file_get_contents(dirname(__FILE__) . '/items/eyeos.app.usersettings.AbstractItem.js');
			$buffer .= file_get_contents(dirname(__FILE__) . '/items/myaccount.js');
			$buffer .= file_get_contents(dirname(__FILE__) . '/items/general.js');
			
			$response->appendToBody($buffer);
		//}
	}
	
	public static function changePassword($params) {
		$oldPassword = $params[0];
		$newPassword = $params[1];
		
		$currentUser = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
		
		try {
			$tmpSubject = new Subject();
			$tmpSubject->getPrivateCredentials()->append(new EyeosPasswordCredential($currentUser->getName(), $oldPassword));
			$tmpLoginContext = new LoginContext('eyeos-login', $tmpSubject);
			$tmpLoginContext->login();
			
			unset($tmpSubject);
			unset($tmpLoginContext);
		} catch (EyeLoginException $e) {
			return false;
		}
		
		// Here we need to apply the new password on a copy of the object: in case the update fails
		// we don't want the login context to be in an inconsistent state (user with unsynchronized password)
		$currentUserCopy = clone $currentUser;
		$currentUserCopy->setPassword($newPassword, true);
		UMManager::getInstance()->updatePrincipal($currentUserCopy);
		
		//If and only if the update process is successful, we can update the object in the login context
		$currentUser->setPassword($newPassword, true);
		
		return true;
	}
	
	public static function deleteAccount($params) {
		$password = $params['password'];
		
		$currentUser = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
		try {
			$tmpSubject = new Subject();
			$tmpSubject->getPrivateCredentials()->append(new EyeosPasswordCredential($currentUser->getName(), $password));
			$tmpLoginContext = new LoginContext('eyeos-login', $tmpSubject);
			$tmpLoginContext->login();
			
			unset($tmpSubject);
			unset($tmpLoginContext);
		} catch (EyeLoginException $e) {
			return false;
		}
		
		UMManager::getInstance()->deletePrincipal($currentUser);
		
		$_SESSION = array();
		$_COOKIE = array();
		
		$response = MMapManager::getCurrentResponse();
		$response->setBodyRenderer(new ControlMessageBodyRenderer('__control_refresh'));
	}
	
	public static function loadItemSections($params) {
		//TODO
	}
	
	public static function loadSettings($params) {
		$currentUser = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
		$settings = MetaManager::getInstance()->retrieveMeta($currentUser);
		
		if($settings === null) {
			$settings = MetaManager::getInstance()->getNewMetaDataInstance($currentUser);
		}
		$settings->set('eyeos.user.id', $currentUser->getId());
		$settings->set('eyeos.user.nickname', $currentUser->getName());
		
		return $settings->getAll();
	}
	
	public static function saveSettings($params) {
		$params = (array) $params;		
		$currentUser = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
		$settings = MetaManager::getInstance()->retrieveMeta($currentUser);
		
		unset($params['eyeos.user.id']);
		unset($params['eyeos.user.nickname']);
		
		if($settings === null) {
			$settings = MetaManager::getInstance()->getNewMetaDataInstance($currentUser);
		}
		$settings->setAll($params);
		MetaManager::getInstance()->storeMeta($currentUser, $settings);
		
		return $params;
	}
}
?>