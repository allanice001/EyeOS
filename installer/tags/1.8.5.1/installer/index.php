<?php
/*
                                  ____   _____
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___
                 / _ \ | | |/ _ \ |  | |\___ \
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/
                       __/ |
                      |___/              1.8

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - www.eyeos.org/team

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2009 eyeOS Team (team@eyeos.org)
*/

chdir('./../');
error_reporting(0);
@ini_set('arg_separator.output','&amp;');
@ini_set('max_execution_time',0);
@session_start();
@set_time_limit(0);

define('INSTALL_DIR','./installer/');
define('INSTALL_INDEX','./index.html');
define('INSTALL_MD5','35dc565c4833bb3405710daa6578062f');
define('INSTALL_PACKAGE','./package.eyepackage');
define('INSTALL_VERSION','1.8.5.1');

// Include libraries
include_once(INSTALL_DIR . 'libraries.eyecode');
lang_init();
check_init();

// Include section
if (TYPE_INSTALL) {
	include_once(INSTALL_DIR . 'modules/install.eyecode');
} elseif (TYPE_UPDATE) {
	include_once(INSTALL_DIR . 'modules/update.eyecode');
} elseif (TYPE_SYSTEM) {
	include_once(INSTALL_DIR . 'modules/system.eyecode');
}
?>