                                  ____   _____ 
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___  
                 / _ \ | | |/ _ \ |  | |\___ \ 
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/ 
                       __/ |                   
                      |___/              1.6
                                           README

Summary
_______

Introduction


Requirements
   -Server
   -Client (Web Browser)

Installation Instructions
   -Office formats support

Getting support
   -Professional services

License

Projects involved / Open source contributions

Collaborating

_______________________________________________________________________________


Introduction
____________

In first place, welcome to eyeOS 1.6. You're about to discover a completely free,
Open Source Web Operating System.

The purpose of this User Manual is to provide documentation for new eyeOS users
for installing it and doing the first steps with it.


Requirements
____________

 - Server

The main requirement for a new eyeOS 1.5 Installation is a PHP compatible
Web Server with PHP v5.

We recommend to use a Linux server with Apache Web Server and PHP 5.x, but 
other webservers with PHP support should be able to get eyeOS installed too.

eyeOS 1.5 has it's own virtual file system, and does not require a database to work
You will however need the capability of uploading files and directories to the
webspace and to be able to change folder permissions.


  - Client (Web Browser)

Your browser needs to be standards-compliant and support CSS. This includes
the common modern browsers: Internet Explorer 7, Firefox 2.x, Safari...

We strongly recommend a browser with a good standards support such as Mozilla
Firefox to be able to see and use all the eyeOS 1.6 effects.


Installation Instructions
_________________________

In first place, download the last eyeOS version available trought the website,
http://www.eyeos.org/downloads , and uncompress it.

Once uncompressed, you only need to upload the uncompressed eyeOS directory to 
your webspace using FTP or similar. 

If you wish to have eyeOS installed in your root dir (for example, to install it
in www.yourdomain.com instead of www.yourdomain.com/eyeOS or similar), you only 
need to upload the files inside the eyeOS/ folder just uncompressed.

NOTE: eyeOS installation system comes with only a few files and some documentation.
The installation process will decompress the eyeOS_XXYY.eyepackage file and create
the whole system structure.

When the upload finishes, just give full permissions to the uploaded files
and the folder that contains eyeOS. If you can't give permissions to the
folder which contains eyeOS, you may need to create a new folder and install it
there. (Some hosts do not allow to give full permissions to the root's path).

Once completed, you only have to run from your web browser the install.php file
and follow the screen instructions to end the installation.


Office formats support
_______________
eyeOS 1.5+ does include a library (eyeConverter) to load and save Microsoft Office
and OpenOffice.org file formats. It uses the OpenOffice suite as backend with an
eyeOS macro created for this prupose. Currently it's only thought to work on Linux
servers.

To install Office Support follow this steps:

1. Install OpenOffice (eyeOS uses OpenOffice to convert formats).

2. Install xvfb (OpenOffice needs a X server to be executed in).

3. Make sure that the owner of the home directory of the apache user (www-data or nobody 
in some installations) is the apache user. For example, in Debian installations 
the Apache user is www-data and the home for the user is /var/www but this directory 
is owned by root. You can change the home for apache user to /tmp if you don't want to 
change the owner or create a new directory.

4. Copy extras/OpenOffice/eyeOS.xba from the eyeOS installation directory to 
/usr/lib/openoffice/share/basic/Tools/

5. Edit /usr/lib/openoffice/share/basic/Tools/script.xlb and add 
<library:element library:name="eyeOS"/> under <library:element library:name="Debug"/>

6. Execute Xvfb :1 -ac -screen 0 800x600x16 -fbdir /tmp & 

If you want to execute Xvfb in each boot of your system, you can add a simple script 
in /etc/init.d/ called xvfb, with the following content:

Xvfb :1 -ac -screen 0 800x600x16 -fbdir /tmp &

Remember to give the script executable permissions.


Update instructions
_________________________

To update your current eyeOS installation to a newer version, just uncompress the
files inside your eyeOS directory, give full permissions to the update files and 
load update.php from your web browser.

The update script will then pop up and inform you if everything is ready to 
do an update.

If you are updating from eyeOS 1.2.x to eyeOS 1.5+ you may want to have Office formats
support. Check Office formats support in this README.


Getting support
_______________

If you have any problems with the installation process, questions or suggestions, 
you can use the eyeOS public forums, available at http://forums.eyeos.org. 
You can also contact us at team@eyeos.org.


Professional services
_____________________

If you are interested in installing eyeOS in your Company, School or Public Environment,
please visit the official eyeOS Website for Professional Services around the system.
You can find all the information at www.eyeOS.com.


License
_______

eyeOS is released under the Affero General Public License (AGPL).You can read the
full license text at the license.txt file.

However, some parts of the eyeOS Project are released under the Lesser General Public 
License (LGPL), such as the Oxygen-derivated graphics, some system libraries and 
more. Each special part has its own license inside the eyeOS tarball, and all the 
sources are included in the eyeOS package, except the graphic sources (in SVG format) 
that can be found at the SVN server:

	   https://eyeos.svn.sourceforge.net/svnroot/eyeos/graphics/


Projects involved / Open source contributions
_____________________________________________
Some Open Source projects have been involved in the eyeOS project creation. Some of the 
most significant are:
	-Cross-Browser.com (X Library)
	-Moxiecode (tinyMCE)
	-The phputf8 Project
	-Oxygen Icons


Collaborating
_____________

eyeOS is Open Source, and many people have made their contribution. If you want to
collaborate with eyeOS programming, designing, testing or otherwise, we would be 
glad to welcome you to our community: www.eyeOS.org/community

Contributions to the project are also possible via donations. You can read more
information about donations at www.eyeOS.org/donations .


The eyeOS Team
______________
	-Pau Garcia-Milà
	-Marc Cercós
	-Jose Carlos Norte
	-Daniel Gil
	-Alejandro Fiestas
	-Pol Watine


Special Thanks to
_________________
	-Anaël Ollier
	-Lars Knickrehm
	-David Comuñas
	-Edouard Daubin
	-Alexandre Mejat
	-Ricardo Galli
	-Juan Lao Tebar
	-Jordi Vivancos
	-Llorenç Vallès
	-Daniel Sousa
	-Nick McMillen
	-Frank Karlitschek
	

And many, many more people who is helping the eyeOS project to grow nonstop.

Enjoy eyeOS!

http://www.eyeOS.org
team@eyeos.org