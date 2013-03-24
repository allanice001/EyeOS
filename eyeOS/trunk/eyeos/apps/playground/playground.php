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

abstract class PlaygroundApplication extends EyeosApplicationExecutable {	
	public static function __run(AppExecutionContext $context, MMapResponse $response) {
		$response->appendToBody(file_get_contents('./extern/js/eyeos/ui/widgets/LocationSelectBox.js'));
		$response->appendToBody(file_get_contents('./extern/js/eyeos/ui/widgets/LocationComboBox.js'));
		$response->appendToBody(file_get_contents('./extern/js/eyeos/ui/widgets/TreeLocationComboBox.js'));
		$response->appendToBody(file_get_contents('./extern/js/eyeos/ui/widgets/celleditor.LocationSelectBox.js'));
		$response->appendToBody(file_get_contents('./extern/js/eyeos/ui/widgets/FilesTree.js'));
		$response->appendToBody(file_get_contents('./extern/js/eyeos/ui/widgets/Image.js'));
		$response->appendToBody(file_get_contents('./extern/js/eyeos.dialogs.js'));
		$response->appendToBody(file_get_contents('./extern/js/eyeos.dialogs.FileChooser.js'));
	}
    public static function createNetSyncMessage () {
        new NetSyncMessage('presence', 'userConnect', 'ciao');
    }
	
	public static function sendBusMessage() {
		$message = new ClientBusMessage('debug', 'infoMessage', 'Hello! This is a message sent from PHP to the Javascript message bus.');
		ClientMessageBusController::getInstance()->queueMessage($message);
		
		return 'Hi! I am the value returned from the method ' . __METHOD__;
	}
	
	public static function throwException() {
		try {
			throw new Exception("test exception");
		} catch (Exception $e) {
			throw new EyeException("Re-thrown exception", 0, $e);
		} 
	}

	public static function throwError() {
		require_once SERVICE_META_HANDLERS_PATH . '/DefaultEyeosUserXMLMetaHandler.php';
		require_once SERVICE_META_HANDLERS_PATH . '/DefaultEyeosUserPDOMetaHandler.php';
		$dir = new DirectoryIterator(SERVICE_META_PROVIDERS_PATH);
		foreach($dir as $file) {
			if ($file->isFile()) {
				require_once SERVICE_META_PROVIDERS_PATH . '/' . $file->getFilename();
			}
		}

		$users = UMManager::getInstance()->getAllUsers();
		foreach ($users as $user) {
			if ($user->getPrimaryGroupId() === 'eyeID_EyeosGroup_users') {
				$meta = DefaultEyeosUserXMLMetaHandler::getInstance()->retrieveMeta($user, 'PrincipalMetaData');
				DefaultEyeosUserPDOMetaHandler::getInstance()->storeMeta($user, $meta, 'PrincipalMetaData');
			}
		}

		exit;
	}
	public static function copyWithFSI() {
		$Logger = Logger::getLogger('Application.playground');

		$Logger->debug("copyWithFSI step 1");
		$origin = FSI::getFile("home:///test.txt");
		$Logger->debug("copyWithFSI step 2");
		$destination = FSI::getFile("home:///test2.txt");
		$Logger->debug("copyWithFSI step 3");
		$origin->copyTo($destination);
		$Logger->debug("copyWithFSI End");
		}
}
?>