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

Important note!
	If you update from eyeos 1.8 and lower, the dock configuration of all of your users will be set back to the defaults.

What's new in eyeos 1.9.0.0 Final
	* Added "eyeArchive" to the "Open with..." dialog.
	* Added "eyeDock" calendar highlighting for the current day and the selected day and week.
	* Added "eyeDock" calendar support for monday as startday. eyeDock just uses the settings of eyeCalendar.
	* Added eyeos logo to be used for the iPhone menu.
	* Changed "iPhone" version. It starts in fullscreen mode on iPhones now.
	* Changed: display_errors gets turned off. For debugging it will be turned on.
	* Changed: html_errors is turned off for better readability of the error messages now.
	* Fixed "Calendar" widget problem displaying the first week if the startday is monday.
	* Fixed "Gecko" engine support for dependent themes.
	* Fixed "WebKit" engine support.
	* Fixed "eyeControl" saving configurations in some cases.
	* Fixed "eyeFileArchive" library. This fixes eyeArchive and the translation system.
	* Fixed "eyeMail" setting problems.
	* Fixed file extensions "tar.bz2" and "tar.gz".

What's new in eyeos 1.9.0.0 Preview 2
	* Added "Container" widget parameter "noserialize" to show method.
	* Added "Help" buttons to many applications.
	* Added "Window" widget function, called "setNoResize".
	* Added "Window" widget functionality, which automatically updates the X and Y coordinates of that PHP Window object before saving them.
	* Added "Window" widget property, called "noresize".
	* Added "eyeApps" category functionality.
	* Added "eyeInstaller" button to close after finishing.
	* Added "eyeNav" function "Open As App" to open a bookmark wwith eyeIframize directly.
	* Added "eyePdf" application, which were rewritten from scratch. It supports "Full Screen" and "Open" thanks to a Toolbar widget now.
	* Added "eyeSheets" application Toolbar button "Full Screen".
	* Added missing removeListener* function calls on the PHP side. This change keeps the session a lot smaller than before.
	* Added special css theme file for browsers based on Gecko.
	* Updated "eyeHelp" content.
	* Changed "eyeControl" behaviour after creating a new group as root or administrator. That user will be added as first user of the group automatically.
	* Changed "eyeHelp" startup behaviour: It shows all its content for default now.
	* Changed "Window" widget height/width if the browser window is too small for the default size.
	* Fixed "Calendar" widget problem with setting the correct left/right position.
	* Fixed "ContextMenu" widget problem on Linux systems, which caused the menu to close if the right click left its down state.
	* Fixed "Default Plus" theme glitches in many places.
	* Fixed "Default" theme glitches in many places.
	* Fixed "EventHandler" JS function. It now removes registered event listeners correctly.
	* Fixed "Hidden" widget friends management.
	* Fixed "SimpleMenu" widget problem on Linux systems, which caused the menu to close if the right click left its down state.
	* Fixed "Textarea" widget resizing if CodePress is used.
	* Fixed "Window" widget "setFullScreen" function problem while calling the application's "Resize" function.
	* Fixed "eyeCalendar" JavaScript warnings.
	* Fixed "eyeCatch" for default users and maintainers.
	* Fixed "eyeDock" configuration updating machnism.
	* Fixed "eyeIframize" Window resizing.
	* Fixed "eyeShow" application loading.
	* Fixed "vfs" fucntion "restore".
	* Removed "Air" theme. It will be available as seperate eyePackage.
	* Removed "Oxygen" theme. It will be available as seperate eyePackage.
	* Removed "eyeWidgets" application.

What's new in eyeos 1.9.0.0 Preview 1
	* Added "DEFAULT_I18N" to "system.xml" to specify base language to choose (Default: "en").
	* Added "USE_COMPRESSED" to "system.xml" to specify if CSS and JavaScript files with the additional ending ".min" should be used automatically (Default: "1").
	* Added "air" theme.
	* Added "defaultPlus" theme.
	* Added "eyeCatch" as new catching game.
	* Added "eyeDock" as new task bar application. This applications has been rewritten from scratch and replaces all the legacy applications "eyeBar", "eyeDesk_extras", "eyeDock" and "eyeDockText".
	* Added "eyeMail" functionality "Full screen".
	* Added "eyeNav" functionality: A new text box allows everyone to search with the default search engine.
	* Added "eyeNav" functionality: Bookmarks can be managed the same way as in eyeFeeds.
	* Added "eyeShow" as new presentation software.
	* Added "eyeWidgets" as new central for all installed widget applications.
	* Added "jscolor" to show a colour table. eyeControl uses it in the "Desktop" section.
	* Added "miniToDo" to manage an own todo list.
	* Added Select widget "select*" functions.
	* Added Select widget groups functionality.
	* Added Sortabletable widget friends abstraction. (Thanks to Steven_FR)
	* Added Tab widget function "removeByName".
	* Added Window widget functionality: It is possible to maximize a window in width or height only by just double clicking one of the four window borders.
	* Added compatibility for "register_globals", "magic_quotes_gpc", "magic_quotes_runtime" and "magic_quotes_sybase".
	* Added eyex service "systemSound" function.
	* Added new "eyeManageApps". The old one is not necessary any longer and the new (smaller) one comes with all global features needed.
	* Added support for own CSS files for "Apple Safari", "Google Chrome" and "Opera".
	* Added um service functionality to force a user to reset the password on next login.
	* Updated "eyeHelp" help files.
	* Updated "PHPMailer" to version "5.1".
	* Updated "default" theme.
	* Updated "iui" to version "0.30".
	* Updated "oxygen" theme.
	* Changed Checkbox widget "setCss" function. It changes the container element instead of the input element now.
	* Changed widget management: Widgets will be shown in an own layer between the desktop and real windows. They will not minimize if "Show Desktop" gets pressed.
	* Fixed "eyeCalc" initialising. Before the numeric buttons did not have any event in background.
	* Fixed "eyeControl" section "Autoruns" problem with getting the list of all installed applications.
	* Fixed JavaScript check if Cookies are enabled or not.
	* Fixed "eyeFeeds" bookmarks directory renaming.
	* Fixed Select widget "addEnterEventMsg" function.
	* Fixed Sortabletable widget style: Its header does not scroll any longer. This allowed us to remove the empty space from the right side.
	* Fixed Tab widget function "removeTab".
	* Fixed Toolbar widget function "remove".
	* Fixed Window widget "type" argument handling, which could have failed. This fixes a regression.
	* Fixed proc service problems if launching a new process fails.
	* Fixed vfs service function "getFolderList". This function is thought to be used for XML-RPC.
	* Fixed vfs service problems with the php function "glob", which sometimes causes problems if a second parameter is passed.
	* Minimized size of most images by using a better compression.
	* Removed "classic" theme.
	* Removed "eyeFusion" theme.
	* Removed "eyeLightDesk" application.
	* Removed "lightdesk" theme. 

Requirements
	Server
		The main requirement for a new eyeos installation is a PHP compatible Web Server with PHP 5 or higher.
		We recommend to use a server with Apache Web Server and PHP 5, but other webservers with PHP support are able to run eyeos, as well.
		eyeos has its own virtual file system and does not require a database to work. You will however need the capability of uploading files and directories to the webspace and to be able to change folder permissions.
		More help on getting a server installed along with eyeos can be found at our Setup eyeos
	Client (Web Browser)
		Your browser needs to be standards-compliant and support CSS. This includes the common modern browsers:
			* Mozilla Firefox 3 and higher
			* Internet Explorer 7 and higher
			* Apple Safari 3 and higher
			* Google Chrome 3 and higher
			* Opera 9 and higher (It does not support right click, but you can use "Ctrl + Click" instead!)
		Lower versions -like Safari 2- or other browsers -like Konqueror 3- may also work, but are not officially supported by the eyeos Team.
		We strongly recommend the latest version of Mozilla Firefox to be able to use all eyeos effects.

Installing eyeos
	Once you have downloaded eyeos, follow these instructions to install:
		* Extract the package you downloaded.
		* Copy the extracted files to your web directory (e.g. via FTP).
		* Start your web browser and browse to "installer/".
		* Follow the instructions the installer gives you.
		* Log into your new eyeos system. (username: "root")
	Notes:
		* The eyeos installation system comes with only a few files and some documentation. The installation process will decompress "package.eyepackage" and create the whole system structure.
		* If you wish to have eyeos installed in your root dir (for example, to install it in www.yourdomain.com instead of www.yourdomain.com/eyeos or similar), you only need to upload the files from the just extracted eyeOS/ folder.

Updating eyeos
	The updater works with eyeos 1.5 and higher.
		* Follow the instructions from "Installing eyeOS".
		* Click "Update eyeOS!" to start updating to eyeos 1.9.

Office Support
	eyeos includes a library (eyeConverter) to load and save Microsoft Office and Open Document file formats. It uses the OpenOffice.org suite as backend with an eyeos macro, created for this purpose. Currently it is only thought to work on Linux and Windows servers.
	To install Office Support login as root user and start "System Preferences" (eyeControl).
	Now follow the instructions from the tab "Office Support" under "System".

Uninstalling eyeos
	The uninstaller only works with eyeos 1.9.
		* Follow the instructions from "Installing eyeOS".
		* Select "Uninstall eyeOS" form the select box and click "Continue...".
		* Click "Yes" to confirm uninstalling eyeos.

Collaboration
	eyeos is Open Source and many people have made their contribution. If you want to collaborate with eyeos programming, designing, testing or otherwise, we would be glad to welcome you to our community: [http://eyeos.org/community/].
	Contributions to the project are also possible via donations. You can read more information about donations at [http://eyeos.org/donations/].

Report problems
	Please report all problems you notice. To our Bog Reporting system at Launchpad. Start by browsing [http://wiki.eyeos.org/HowTo_Report_A_Bug].
	If you feel unconfterble with Launchpad, please use our forums category [http://forums.eyeos.org/?board=39].

Localizations
	All old language packs from eyeos 1.5 and higher also work with eyeos 1.9.
	The translation system at [http://eyeos.org/translate/] now also handles new strings for eyeos 1.9. The new translations will be published some days after the final release and can be found at [http://eyeos.org/downloads/translations] or via eyeSoft.

License
	eyeos is released under the Affero General Public License (AGPL). You can read the full license text at the license.txt file in each eyeos package.
	However, some parts of the eyeos Project are released under the Lesser General Public License (LGPL), such as the Oxygen-derived graphics, some system libraries and more. Each special part has its own license inside the eyeos tarball, and all the sources are included in the eyeos package, except the graphic sources (in SVG format) that can be found at the SVN server: