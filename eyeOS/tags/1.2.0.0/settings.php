<?php
/*
                                  ____   _____ 
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___  
                 / _ \ | | |/ _ \ |  | |\___ \ 
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/ 
                       __/ |                   
                      |___/              1.2

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - eyeOS.org/whoarewe

     eyeOS is released under the GNU General Public License (GPL)
            provided with this release in license.txt
             or via web at gnu.org/licenses/gpl.txt

        Copyright 2005-2007 eyeOS Team (team@eyeos.org)

*/
/*
	Main configuration file.
	Please read the eyeOS configuration documentation 
	for more information before modifying anything here.
*/

//Paths
define('EYE_ROOT','.');
define('REAL_EYE_ROOT','eyeOS');
define('SYSTEM_DIR','system');
define('KERNEL_DIR','kernel');
define('SERVICE_DIR','services');
define('LIB_DIR','lib');
define('APP_DIR','apps');
define('USERS_DIR','users');
define('CONF_USER_DIR','conf');
define('FILES_USER_DIR','files');
define('SHARE_USER_DIR','share');
define('THEMES_DIR',APP_DIR.'/'.'eyeX'.'/'.'themes'); //DEPRECATED
define('SYSTEM_CONF_DIR','conf');
define('APP_CONF_SHARE','share');
define('EXTERN_DIR','extern');
define('TRASH_USER_DIR','trash');
define('ACCOUNT_DIR','accounts');
define('GROUPS_DIR','groups');
define('FILES_GROUP_DIR','files');

//eyeOS file extensions
define('EYEOS_INFO_EXT','eyeInfo');
define('EYEOS_FILE_EXT','eyeFile');
define('EYEOS_LINK_EXT','eyeLink');
define('EYE_CODE_EXTENSION','.eyecode');
define('EYEOS_TRASH_EXT','eyeTrash');

//vfs module to use
define('VFS_MODULE','virtual');

//um module to use
define('UM_MODULE','eyeos');

//Extras
define('ROOTUSER','root');
define('EYEOS_VERSION','1.2.0.0');

?>
