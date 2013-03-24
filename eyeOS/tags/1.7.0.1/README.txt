                                  ____   _____ 
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___  
                 / _ \ | | |/ _ \ |  | |\___ \ 
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/ 
                       __/ |                   
                      |___/              1.7

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - eyeOS.org/whoarewe

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2008 eyeOS Team (team@eyeos.org)

1 What's New in eyeOS 1.7.0.0
	1.1 Changed for Preview 1
	1.2 Changed for Preview 2
	1.3 Changed for 1.7 Final
2 Requirements
	2.1 Server
	2.2 Client (Web Browser)
3 Public Server
4 Downloading and Installing
	4.1 Downloading eyeOS 1.7.0.0
	4.2 Installing eyeOS
			4.2.1 Office Support
	4.3 Updating eyeOS
	4.4 Uninstalling eyeOS
5 Other Information
	5.1 Collaborating
			5.1.1 Report problems
			5.1.2 Localizations
	5.2 Professional services
	5.3 License
	5.4 The eyeOS Team
			5.4.1 Involved projects
6 Known Issues
	6.1 Milestone 1.7.0.0 Final
	6.2 All Systems
	6.3 Internet Explorer 6
	6.4 Opera
	6.5 Windows Servers


 _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _



What's New in eyeOS 1.7.0.0
===========================

eyeOS 1.7.0.0 is the latest release of the eyeOS Web Operating System.

The new features that eyeOS 1.7.0.0 includes are:

Changed for Preview 1
---------------------

 - Office support can be finally installed under Windows systems.
 - eyeOS is now full Internet Explorer 6 compatible, technically and graphically.
 - Applications now use the icons form the themes folders, which will make eyeOS more themes-friendly.
 - eyeDocs (component: TinyMCE) now uses inline popups, which look like native eyeOS windows.
 - All eyeOS applications can be completely translated.
 - Added many new options to eyeCalendar
 - Now eyeOS provides a cache system.
 - With this release we provide a completely new web installer.

Changed for Preview 2
---------------------

 - eyeIframize now loads swf files from the users home directory.
 - The language selection from eyeLogin now works correctly.
 - On HTTPS servers the "Advanced" eyeUpload method is not available if the browser is not IE.
 - eyeLogin stays in the middle while resizing the browser window.
 - Moving windows in IE does not set "left" to "0" the first time it's moved.
 - Width and height of the Opera windows are identified correctly now.
 - eyeSheets, eyeSoft and the "Simple" eyeUpload method work correctly now.
 - Showing "\" works in every widget now.
 - Maximizing windows while using eyeLightDesk now works correctly.
 - Fixed ending a process for some applications.
 - Cleaned the basic CSS files and fixed some small arguments.
 - The installer now uses the new eyeOS design, too.

Changed for 1.7 Final
---------------------

 - eyeCalendar is working great in all tested browsers now. (see known issues!)
 - New repository for eyeOS 1.7!
 - eyeMail is removed, because of instability (seperate package via eyeSoft)
 - Theme changes increase the user's EXTERN_CACHE_VERSION!
 - The Context menu can be called by pressing [Ctrl] + moving the mouse.
 - Option to save window positions
 - Resizing the browser window now does not break the system / desktop
 - Flash upload updated
 - Renaming a desktop icon now does not change its position
 - eyeImages works correctly in fullscreen mode now.
 - eyeFiles and eyeGroups Context menu in IE6 is corrected now
 - eyeDesk handles icons correctly now

Release Date: September 30, 2008


Requirements
============

Server
------

The main requirement for a new eyeOS Installation is a PHP compatible Web Server with PHP 5 or higher.

We recommend to use a server with Apache Web Server and PHP 5, but other webservers with PHP support are able to get eyeOS installed, too.

eyeOS has its own virtual file system and does not require a database to work. You will however need the capability of uploading files and directories to the webspace and to be able to change folder permissions.

Client (Web Browser)
--------------------

Your browser needs to be standards-compliant and support CSS. This includes the common modern browsers:

 - Mozilla Firefox 2 and higher
 - Internet Explorer 6 and higher
 - Safari 3 and higher

We strongly recommend the latest version of Mozilla Firefox to be able to see and use all the eyeOS effects.

You can use Opera, too, but eyeOS has some problems with it right now. Full Opera support is planned for any further version!


Downloading and Installing
==========================

Downloading eyeOS 1.7.0.0
-------------------------

Please visit http://eyeos.org/downloads/ to get eyeOS.

Installing eyeOS
----------------

Once you have downloaded eyeOS, follow these instructions to install:

 - Extract the package you downloaded.
 - Copy the extracted files to your web directory (e.g. via FTP).
 - Start your web browser and browse to "installer/".
 - Follow the instructions the installer gives you.

Notes:

 - The eyeOS installation system comes with only a few files and some documentation. The installation process will decompress "package.eyepackage" and create the whole system structure.
 - If you wish to have eyeOS installed in your root dir (for example, to install it in www.yourdomain.com instead of www.yourdomain.com/eyeOS or similar), you only need to upload the files from the just extracted eyeOS/ folder.

Office Support
--------------

eyeOS includes a library (eyeConverter) to load and save Microsoft Office and Open Document file formats. It uses the OpenOffice.org suite as backend with an eyeOS macro, created for this purpose. Currently it is only thought to work on Linux and Windows servers.

To install Office Support login as root user and start "System preferences" (eyeControl).

Now follow the instructions from the tab "Office Support" under "System".

Updating eyeOS
--------------

The updater works with eyeOS 1.5.0.0 and higher.

 - Follow the instructions from "Installing eyeOS".
 - Click "Update eyeOS!" to start updating to eyeOS 1.7.0.0.

Uninstalling eyeOS
------------------

The uninstaller only works with eyeOS 1.7.0.0.

 - Follow the instructions from "Installing eyeOS".
 - Select "Uninstall eyeOS" form the select box and click "Continue...".
 - Click "Yes" to confirm uninstalling eyeOS.


Other Information
=================

Collaborating
-------------

eyeOS is Open Source and many people have made their contribution. If you want to collaborate with eyeOS programming, designing, testing or otherwise, we would be glad to welcome you to our community: http://eyeos.org/community/ .

Contributions to the project are also possible via donations. You can read more information about donations at http://eyeos.org/donations/ .

Report problems
---------------

Please report all problems you notice. Browse to https://bugs.launchpad.net/eyeos and click "Report a bug". You need to register and login.

If you felt in trouble with Launchpad, please use our forums category [http://forums.eyeos.org/?board=39 Bug Reports > 1.7.0.0 Preview].

Notice: Please don't report bugs, which has been reported, yet! (see "Known Issues")

Localizations
-------------

All old language packs from eyeOS 1.5.0.0 and higher also work with eyeOS 1.7.0.0.

The translation system at http://eyeos.org/translate/ now also handles new strings for eyeOS 1.7.0.0. The new translations will be published with the final release and can be found at http://eyeos.org/?section=downloads&part=translations .

With this release we provide a new installer with localisation support. It can be translated via the translation system at http://eyeos.org/translate/ . All finished installer translations will be integrated into the final release.

For more information about how to translate parts from the eyeOS project please see http://wiki.eyeos.org/Translations

Professional services
---------------------

If you are interested in installing eyeOS in your Company, School or Public Environment, please visit the official eyeOS Website for Professional Services around the system. You can find all the information at http://eyeos.com/ .

License
-------

eyeOS is released under the Affero General Public License (AGPL). You can read the full license text at the license.txt file in each eyeOS package.

However, some parts of the eyeOS Project are released under the Lesser General Public License (LGPL), such as the Oxygen-derivated graphics, some system libraries and more. Each special part has its own license inside the eyeOS tarball, and all the sources are included in the eyeOS package, except the graphic sources (in SVG format) that can be found at the SVN server:

https://eyeos.svn.sourceforge.net/svnroot/eyeos/graphics/

The eyeOS Team
--------------

 - Alejandro Fiestas
 - Anaël Ollier
 - Daniel Gil
 - Jose Carlos Norte
 - Lars Knickrehm
 - Marc Cercós
 - Pau Garcia-Milà

And many, many more people, who help the eyeOS project to grow nonstop.

Involved projects
-----------------

Some Open Source projects have been involved in the eyeOS project creation. Some of the most significant are:

 - Cross-Browser.com (X Library)
 - Moxiecode (TinyMCE)
 - The phputf8 Project
 - Oxygen Icons


Known Issues
============

All Systems
-----------

 - The Tetravex Game is not translatable.

Internet Explorer 6
-------------------

 - It is not possible to move an event in eyeCalendar.

Opera
-----

 - It is not possible to use a scrollbar in some applications.
 - Some windows show a scrollbar, which should be hidden.

Windows Servers
---------------

 - eyeSheets cannot open files. The ods library need to be made Windows compatible!