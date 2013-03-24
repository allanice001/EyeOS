  ___  _ __   ___ _   _  ___
 / _ \| '_ \ / _ \ | | |/ _ \
| (_) | | | |  __/ |_| |  __/
 \___/|_| |_|\___|\__, |\___|
                  |___/

oneye is released under the GNU Affero General Public License Version 3 (AGPL3)
 -> provided with this release in license.txt
 -> or via web at www.gnu.org/licenses/agpl-3.0.txt

Copyright © 2005 - 2010 eyeos Team (team@eyeos.org)
             since 2010 Lars Knickrehm (mail@lars-sh.de)

What's new in oneye 0.8.0
	* Added official API to set the text color property of Label widgets.
	* Changed eyeMedia notifications to silent mode.
	* Fixed eyeMp3 window position saving.
	* Fixed eyeMp3 window title changing.
	* Fixed first start in a session of eyeVideo.
	* Fixed iPhone files images.
	* Improved dragging elements using either a mouse, a touch or both.
	* Improved iPad support slightly.
	* Improved layer handling of browser plugins.
	* Improved window dragging and resizing.
	* Removed eyeMovies application.
	* Updated bookmarks of eyeFeeds and eyeNav.

What's new in oneye 0.8.0 (RC 1)
	* Added eyePictures application.
	* Added initial Touch support (e.g. for tables and smartphones).
	* Added eyePdf plugin "pdf.js" for inline pdf viewing.
	* Added launching links directly form within eyeFiles.
	* Added per user quota.
	* Added "Go Up" button to eyeFiles.
	* Added missing eyeApp category icons.
	* Added SESSION_EXPIRE (in seconds, default: 3600 -> 1 hour).
	* Added PING_INTERVAL (in seconds, default: 120 -> 2 minutes).
	* Added eyeFiles library function to imitate "imagebmp".
	* Added utf8_chr function.
	* Rewrote utf8_wordwrap function for full PHP compliance.
	* Rewrote extern service for better cache and mimetype management.
	* Rewrote xml library for better performance and improved output.
	* Changed default theme to "defaultPlus".
	* Changed http requests to be asynchronous to minimize problems with different states at the same time on highly called files / functions.
	* Changed flash widget to automatically use "wmode=opaque".
	* Improved Icon widget ellipsis calculation.
	* Improved haptic of the exit application.
	* Improved eyeIframize by adding additional parameters.
	* Fixed calendar week day calculation.
	* Fixed thumbnail creation.
	* Fixed updating eyeDock after removing an element.
	* Fixed theme integration of the color selection control.
	* Fixed default eyeSoft repository.
	* General overall improvements by
		-> improving widgets on either the server or clients side
		-> fixing different vfs functions
		-> fixing rand, srand, mt_rand, ... usage
		-> and so on
	* Updated SoundManager 2.
	* Updated TinyMCE.
	* Switched to UglifyJS for improved experience with minified js files.

Requirements
	Server
		The main requirement for a new oneye installation is a PHP compatible Web Server with PHP 5 or higher.
		We recommend to use a server with Apache Web Server and PHP 5, but other webservers with PHP support are able to run oneye, as well.
		oneye has its own virtual file system and does not require a database to work. You will however need the capability of uploading files and directories to the webspace and to be able to change folder permissions.
		More help on getting a server installed along with oneye can be found at our Setup oneye
	Client (Web Browser)
		Your browser needs to be standards-compliant and support CSS. This includes the common modern browsers:
			* Mozilla Firefox 3 and higher
			* Internet Explorer 7 and higher
			* Apple Safari 3 and higher
			* Google Chrome 3 and higher
			* Opera 9 and higher (Please, use "Ctrl + Click" instead of right clicking.)
		Lower versions -like Safari 2- or other browsers -like Konqueror 3- may also work, but are not officially supported by the oneye Team.
		We strongly recommend Mozilla Firefox 3.6 to be able to use all oneye effects!

Installing oneye
	Once you have downloaded oneye, follow these instructions to install:
		* Extract the package you downloaded.
		* Copy the extracted files to your web directory (e.g. via FTP).
		* Start your web browser and browse to "installer/".
		* Follow the instructions the installer gives you.
		* Log into your new oneye system. (username: "root")
	Notes:
		* The oneye installation system comes with only a few files and some documentation. The installation process will decompress "package.eyepackage" and create the whole system structure.
		* If you wish to have oneye installed in your root dir (for example, to install it in www.yourdomain.com instead of www.yourdomain.com/oneye or similar), you only need to upload the files from the just extracted oneye/ folder.

Updating oneye
	The updater works with oneye 1.5 and higher.
		* Follow the instructions from "Installing oneye".
		* Click "Update oneye!" to start updating.

Office Support
	oneye includes a library (eyeConverter) to load and save Microsoft Office and Open Document file formats. It uses the OpenOffice.org suite as backend with an oneye macro, created for this purpose. Currently it is only thought to work on Linux and Windows servers.
	To install Office Support login as root user and start "System Preferences" (eyeControl).
	Now follow the instructions from the tab "Office Support" under "System".

Uninstalling oneye
	* Follow the instructions from "Installing oneye".
	* Select "Uninstall oneye" form the select box and click "Continue...".
	* Click "Yes" to confirm uninstalling oneye.

Collaboration
	oneye is Open Source and many people have made their contribution. If you want to collaborate with oneye programming, designing, testing or otherwise, we would be glad to welcome you to our community: [http://lars-sh.de/].
	Contributions to the project are also possible via donations. You can read more information about donations at [http://lars-sh.de/donate/].

Report problems
	Please report all problems you notice to our forums [http://forums.lars-sh.de/].

Localizations
	All old language packs from eyeos 1.5 and higher also work with oneye.
	The translation can be found at [http://wiki.lars-sh.de/translations] or via eyeSoft.

License
	oneye is released under the Affero General Public License (AGPL). You can read the full license text at the license.txt file in each oneye package.
	However, some parts of the oneye Project are released under the Lesser General Public License (LGPL), such as the Oxygen-derived graphics, some system libraries and more. Each special part has its own license inside the oneye tarball, and all the sources are included in the oneye package, except the graphic sources (in SVG format) that can be found at the SVN server: