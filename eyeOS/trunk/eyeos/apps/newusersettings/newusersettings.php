<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

abstract class NewusersettingsApplication extends EyeosApplicationExecutable {

	public static function loadSettings() {
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

	public static function savePositionsWidget($params) {
		$widgets = $params;

		$currentUser = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
		$meta = MetaManager::getInstance()->retrieveMeta($currentUser);
		$widgetsXML = $meta->get('eyeos.user.desktop.widgets');

		foreach($widgets as $widget) {
			$widgetsXML[$widget['id']]['column'] = $widget['column'];
			$widgetsXML[$widget['id']]['position'] = $widget['position'];
			$widgetsXML[$widget['id']]['minimized'] = $widget['minimized'];
		}

		$meta->set('eyeos.user.desktop.widgets', $widgetsXML);
		MetaManager::getInstance()->storeMeta($currentUser, $meta);
	}

	public static function changePassword($params) {
		$oldPassword = $params[0];
		$newPassword = $params[1];

		$currentUser = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();

		$fakeUser = UMManager::getInstance()->getNewUserInstance();
		$fakeUser->setName($currentUser->getName(), true);
		$fakeUser->setPassword($oldPassword, true);

		try {
			$tmpSubject = new Subject();
			$tmpSubject->getPrivateCredentials()->append(new EyeosPasswordCredential($currentUser->getName(), $oldPassword));
			$tmpLoginContext = new LoginContext('eyeos-login', $tmpSubject);
			$tmpLoginContext->login();

			unset($tmpSubject);
			unset($tmpLoginContext);
		} catch (EyeLoginException $e) {
			throw new EyeLoginException('The old password supplied is not correct');
			//return false;
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

	public static function copy($params) {
		$currentUser = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
		$settings = MetaManager::getInstance()->retrieveMeta($currentUser);
		$target = FSI::getFile($params[0]);
		$results = array();
		for($i = 1; $i < count($params); $i++) {
			$source = FSI::getFile($params[$i]);
			$name = split("\.", $source->getName());
			$extension = (string) $name[count($name) - 1];
			$theName = substr($source->getName(), 0, strlen($source->getName()) - strlen($extension) - 1);
			$nameForCheck = $theName;
			$nameForCheck .= '.' . $extension;
			$i = 1;
			$newFile = FSI::getFile($params[0] . "/" . $nameForCheck);
			while ($newFile->exists()) {
				$futureName = Array($theName, $i);
				$nameForCheck = implode(' ', $futureName);
				$nameForCheck .= '.' . $extension;
				$i++;
				$newFile = FSI::getFile($params[0] . "/" . $nameForCheck);
			}
			$source->copyTo($newFile);
		}
	}

	/*
	 * Remove an User from the system
     * @param String $params The id of the user to remove
     */
    public static function deleteUser () {
        $myUManager = UMManager::getInstance();
		$currentUserId = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
        $myUManager->deletePrincipal($myUManager->getUserById($currentUserId));
	}
}

?>
