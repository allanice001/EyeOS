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

What's new in eyeos 1.9.0.3
	* Security: Fixed XSS vulnerabilities on loading images.
	* Changed default eyeSoft repository.
	* Changed default xml parser back to pure php.
	* Fixed advanced upload tab for non-IE browsers.
	* Fixed downloading files and folders as zip archive.
	* Fixed eyeNotes.
	* Fixed eyeSoft stability.
	* Fixed loading SourceForge.net logo in HTTPS environments.
	* Fixed taskbars outside of the left/bottom element.

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
			* Opera 9 and higher (Please, use "Ctrl + Click" instead of right clicking.)
		Lower versions -like Safari 2- or other browsers -like Konqueror 3- may also work, but are not officially supported by the eyeos Team.
		We strongly recommend Mozilla Firefox 3.6 to be able to use all eyeos effects!

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