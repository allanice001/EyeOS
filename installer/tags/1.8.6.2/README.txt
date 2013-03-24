                                  ____   _____
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___
                 / _ \ | | |/ _ \ |  | |\___ \
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/
                       __/ |
                      |___/              1.8.5

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - www.eyeos.org/team

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2009 eyeOS Team (team@eyeos.org)

What's new in eyeOS 1.8.6.2
	* [ADDED] SourceForge.net icon
	* [ADDED] translatability of TinyMCE component
	* [FIXED] inconsistency of the disableMsg parameter of some widgets
	* [FIXED] installer permission check for the root folder
	* [FIXED] mobile and iphone versions
	* [FIXED] translatability of eyeMail
	* [FIXED] xKill
	* [UPDATED] PEAR library

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