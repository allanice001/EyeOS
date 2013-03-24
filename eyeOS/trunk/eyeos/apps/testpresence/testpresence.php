<?php
/*

				                   ____  _____
				  ___  __  _____  / __ \/ ___/
				 / _ \/ / / / _ \/ / / /\__ \
				/  __/ /_/ /  __/ /_/ /___/ /
				\___/\__, /\___/\____//____/
				    /____/        2.0 Future

               Cloud Computing Operating System
                        www.eyeos.org

                  eyeos is released under the
		GNU Affero General Public License Version 3 (AGPL3)
         provided with this release in the file "LICENSE"
        or via web at http://gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2009 eyeos Team (team@eyeos.org)
*/

/**
 * An application to manage user.
 * Administrator can create/modify/delete user, assign or unassing to a Workgroup
 */
abstract class TestPresenceApplication extends EyeosApplicationExecutable {
	public static function __run(AppExecutionContext $context, MMapResponse $response) {
		$buffer = '';
		$basePath = EYE_ROOT . '/' . APPS_DIR . '/testpresence/';
		$buffer .= file_get_contents($basePath . 'testpresence.js');

		$response->appendToBody($buffer);
	}
}

?>