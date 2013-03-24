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

function eyeMp3_loadSound(myPid,path,title) {
	xGetElementById(myPid + '_eyeMp3_Flash').SetVariable('jsValue',path);
	xGetElementById(myPid + '_eyeMp3_Flash').SetVariable('jsMethod','newfile');
	xGetElementById(myPid + '_eyeMp3_Window_WindowTitle_text').innerHTML = title;
	xGetElementById(myPid + '_eyeMp3_Window_WindowOnBar').childNodes[0].innerHTML = title;
}