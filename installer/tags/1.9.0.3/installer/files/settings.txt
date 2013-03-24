<?php
/*
                                  ____   _____
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___
                 / _ \ | | |/ _ \ |  | |\___ \
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/
                       __/ |
                      |___/              1.9

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - www.eyeos.org/team

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2009 eyeOS Team (team@eyeos.org)
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
define('TMP_USER_DIR','tmp');
define('SHARE_USER_DIR','share');
define('PUBLIC_USER_DIR','public');
define('THEMES_DIR',APP_DIR . '/eyeX/themes');
define('THEME_CONF_DIR','conf');
define('SYSTEM_CONF_DIR','conf');
define('APP_CONF_SHARE','share');
define('EXTERN_DIR','extern');
define('TRASH_USER_DIR','trash');
define('ACCOUNT_DIR','accounts');
define('GROUPS_DIR','groups');
define('FILES_GROUP_DIR','files');
define('CONF_GROUP_DIR','conf');
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

//The real god of eyeOS users, master of masters
define('REAL_ROOTUSER','root');

//Extras
define('FORCE_NOUTF8',0);
define('EYEOS_TMP_DIR','tmp');
define('EYEOS_VERSION','1.9.0.3');
define('XML_COMPAT',1);
define('XML_PARSER','pure');
define('ACL_SUPPORT',1);
//eyeDialog that defines should be moved to another place desinged for it.
define('EYEDIALOG_TYPE_OPENFILE', 0);
define('EYEDIALOG_TYPE_SAVEFILE', 1);
define('EYEDIALOG_TYPE_SELECTFOLDER', 2);

define('CHECK_MOBILE',1);

?>
