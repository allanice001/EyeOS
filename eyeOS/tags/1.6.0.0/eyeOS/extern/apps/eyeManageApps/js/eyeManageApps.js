/*
                                  ____   _____ 
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___  
                 / _ \ | | |/ _ \ |  | |\___ \ 
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/ 
                       __/ |                   
                      |___/              1.6

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - eyeOS.org/whoarewe

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2008 eyeOS Team (team@eyeos.org)         
*/

function eyeManageApps_clean(pid) {
	var i;
	var myObj;
	for(i=0;;i++) {
		myObj = document.getElementById(pid+'_action_container_line_'+i);
		if(!myObj) {
			return;
		}
		myObj.style.backgroundColor = 'transparent';
		myObj.className = '';
	}
}

function eyeManageApps_refresh(checknum) {
	sendMsg(checknum,'ListApps');	
}