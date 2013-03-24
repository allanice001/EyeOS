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

What's new in eyeOS 1.8.7.0 Final
	* Fixed button caption while creating a new filetype in the system preferences.
	* Fixed problem while deactivating SAWASC without clearing the session.
	* Fixed selecting the web browser plugin as user without administrator rights.
	* Fixed wrong handling of mixed integer variables. (Example: Select widgets are enabled again now!)

What's new in eyeOS 1.8.7.0 Preview 3
	* Added addEnterEvent and addEnterEventMsg functions and friends management to the Select widget.
	* Added correct content type for ico and cur filetypes.
	* Added missing loading cursor to the default theme.
	* Added noserialize parameter to the show function of the Toolbar widget.
	* Fixed addEvent function of the Icon widget.
	* Fixed content type of javascript files.
	* Fixed dynamically loaded UTF-8 source.
	* Fixed problems with too long warnings in the installer.
	* Fixed remove function of the Toolbar widget.
	* Improved JSLint validation results. Most javascript files pass the test, others create errors with lower priority.
	* Removed save request before closing eyeSheets windows, since it was too unstable.
	* Rewrote the Window widget. It's managed by a single object and its functionality is accessible from PHP and JavaScript. Most PHP functions return the status of the request after setting it. It's possible to use such functions to toggle functions (such as setNoDrag).
	* Rewrote the fullscreen mode of windows. The desktop container gets maximized and content, which is out of it gets hidden. The window's titlebar is still visible.
	* Rewrote the eyeOS taskbar. It's managed by a single object and works faster and and more stable than the previous Window widget integration.
	* Updated the mobile eyeOS logo.

What's new in eyeOS 1.8.7.0 Preview 2
	* Added checks for the PHP extensions for SQLite and IMAP.
	* Added default IMAP, POP3 and SMTP ports to the account creation wizard of eyeMail.
	* Added eyeNav events "Download" and "SetAddress".
	* Added new "Edit this Menu" favorites entry to access eyeManageApps
	* Added possibility to set a background color.
	* Added possibility to use a select widget in a messageBox type 3.
	* Fixed ACL management in eyeControl by changing "nmap" to "mmap".
	* Fixed a small problem with moveDrag and a missing slash to specify folders.
	* Fixed a small problem with passing a new filename to eyeRename.
	* Fixed fetching mails after X minutes.
	* Fixed handling special HTML characters in the JavaScript function "eyeParam".
	* Fixed problems with the background image and higher resolutions.
	* Fixed problems with the eyeOS textarea TinyMCE integration.
	* Fixed problems with updating the position of split widgets.
	* Fixed showing arrows in the tab widget's header in the preferences of eyeMail.
	* Fixed sorting messages in eyeMessages.
	* Fixed textbox event in repositories section of eyeControl.
	* Fixed the position of the calendar at the right bottom of the desktop.
	* Fixed the window style of many eyeMail dialogs. Some are not resizable and listed any longer and one is not only maximizable, but also resizable.
	* Fixed wrong placing of ">" in replys of eyeMail.
	* Improved adding and changing autorun commands in eyeControl by using a simple select widget.
	* Improved eyeMail by showing the account creation wizard if no accunt exists, yet.
	* Improved saving eyeMail preferences. The dialog closes automatically now.
	* Improved the JavaScript function "cookieEnabled" to work faster and on Adobe Air basis.
	* Improved the left sidebar of eyeControl to use some before unused space.
	* Improved the look of the SourceForge logo.
	* Improved the order of incoming and outgoing data of eyeMail accounts by rouping them.
	* Improved translatability of labels in eyeMail's sidebar. They do not break on space characters any longer.
	* Improved writing mails by removing useless server requests.
	* Rewrote eyeCalc (the calculator). It has advanced functionality and it handles some float variable type problems.
	* Rewrote the filetypes and SMTP management of eyeControl.
	* Updated TinyMCE to version 5.2.6.
	* Updated and added the images of many messageBoxs type 3.
	* Updated X Library to version 4.19 (*Not Yet Released*), based on the latest available functions.

What's new in eyeOS 1.8.7.0 Preview 1
	* Added MP4 as new filetype associated with eyeVideo.
	* Added a native way of including eyeOS into forums and boards.
	* Added missing eyeOS file headers.
	* Added new "Full Trash" icons.
	* Added some more vfs function to the XML-RPC configuration file.
	* Added vfs functions filemtime and getFileBinary.
	* Fixed Flash in Internet Explorer 8.
	* Fixed Opera 9.27 support
	* Fixed UTF-8 integration.
	* Fixed eyeControl's invalid XML configuration structure.
	* Fixed eyeOS for PHP 5.3.0.
	* Fixed language detection of TinyMCE textareas.
	* Fixed problems with undefined PHP variables.
	* Fixed scrollbar problems with some Flash apps, such as eyeTetravex and eyeVideo.
	* Fixed showing the filetime of a folder in eyeFiles.
	* Rewrote createWidget, makeDrag and removeWidget to fix problems and improve their speed.
	* Rewrote eyeShare, which updates eyeFiles' content after copying automatically now.
	* Updated FlowPlayer to its latest version.
	* Updated installer translations
	* Updated logos to the new one.
	* Updated more than 30 extern libraries.

Requirements
	Server
		The main requirement for a new eyeOS Installation is a PHP compatible Web Server with PHP 5 or higher.
		We recommend to use a server with Apache Web Server and PHP 5, but other webservers with PHP support are able to run eyeOS, as well.
		eyeOS has its own virtual file system and does not require a database to work. You will however need the capability of uploading files and directories to the webspace and to be able to change folder permissions.
		More help on getting a server installed along with eyeOS can be found at our Setup eyeOS
	Client (Web Browser)
		Your browser needs to be standards-compliant and support CSS. This includes the common modern browsers:
			* Mozilla Firefox 2 and higher
			* Internet Explorer 6 and higher
			* Safari 3 and higher
			* Opera 9.5 and higher (It does not support right click, so you have to use "ctrl + click" instead!)
		We strongly recommend the latest version of Mozilla Firefox to be able to see and use all the eyeOS effects.

Installing eyeOS
	Once you have downloaded eyeOS, follow these instructions to install:
		* Extract the package you downloaded.
		* Copy the extracted files to your web directory (e.g. via FTP).
		* Start your web browser and browse to "installer/".
		* Follow the instructions the installer gives you.
		* Log into your new eyeOS system. (username: "root")
	Notes:
		* The eyeOS installation system comes with only a few files and some documentation. The installation process will decompress "package.eyepackage" and create the whole system structure.
		* If you wish to have eyeOS installed in your root dir (for example, to install it in www.yourdomain.com instead of www.yourdomain.com/eyeOS or similar), you only need to upload the files from the just extracted eyeOS/ folder.

Updating eyeOS
	The updater works with eyeOS 1.5 and higher.
		* Follow the instructions from "Installing eyeOS".
		* Click "Update eyeOS!" to start updating to eyeOS 1.8.

Office Support
	eyeOS includes a library (eyeConverter) to load and save Microsoft Office and Open Document file formats. It uses the OpenOffice.org suite as backend with an eyeOS macro, created for this purpose. Currently it is only thought to work on Linux and Windows servers.
	To install Office Support login as root user and start "System preferences" (eyeControl).
	Now follow the instructions from the tab "Office Support" under "System".

Uninstalling eyeOS
	The uninstaller only works with eyeOS 1.8.
		* Follow the instructions from "Installing eyeOS".
		* Select "Uninstall eyeOS" form the select box and click "Continue...".
		* Click "Yes" to confirm uninstalling eyeOS.

Collaboration
	eyeOS is Open Source and many people have made their contribution. If you want to collaborate with eyeOS programming, designing, testing or otherwise, we would be glad to welcome you to our community: http://eyeos.org/community/ .
	Contributions to the project are also possible via donations. You can read more information about donations at http://eyeos.org/donations/ .


Report problems
	Please report all problems you notice. To our Bog Reporting system at Launchpad. Start by browsing http://wiki.eyeos.org/HowTo_Report_A_Bug .
	If you feel unconfterble with Launchpad, please use our forums category ( http://forums.eyeos.org/?board=39 ).
	Notice: Please do not report bugs, which already have been reported. (see "Known Issues")


Localizations
	All old language packs from eyeOS 1.5 and higher also work with eyeOS 1.8.
	The translation system at http://eyeos.org/translate/ now also handles new strings for eyeOS 1.8. The new translations will be published some days after the final release and can be found at http://eyeos.org/?section=downloads&part=translations or via eyeSoft.

Professional services
	If you are interested in installing eyeOS in your Company, School or Public Environment, please visit the official eyeOS Website for Professional Services around the system. You can find all the information at http://eyeos.com/ .

License
	eyeOS is released under the Affero General Public License (AGPL). You can read the full license text at the license.txt file in each eyeOS package.
	However, some parts of the eyeOS Project are released under the Lesser General Public License (LGPL), such as the Oxygen-derived graphics, some system libraries and more. Each special part has its own license inside the eyeOS tarball, and all the sources are included in the eyeOS package, except the graphic sources (in SVG format) that can be found at the SVN server:

Known Issues
	Internet Explorer 6
		* Minor issues with the Fullscreen mode
	Opera
		* Scrollbars are not usable in some windows.