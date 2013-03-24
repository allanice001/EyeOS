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

             eyeOS Engineering Team - eyeOS.org/whoarewe

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2008 eyeOS Team (team@eyeos.org)

*/

/*
 *                __________      ___________  
 *               /  _____/  \    /  \_   ___ \ 
 *              /   \  __\   \/\/   /    \  \/ 
 *              \    \_\  \        /\     \____
 *               \______  /\__/\  /  \______  /
 *                      \/      \/          \/ 
 * 
 * 
 *     eyeMediaVault is by Hunter Perrin, aka GuyWithCable
 * 
 *   Released under the GNU General Public License Version 2
 * 
 *       If you like my software, check out my homepage:
 * 
 *                 SciActive.com
 * 
 */

function eyeMediaVault_Next(myPid, Keep_Playing, Check_Num){
	var Current_Row = document.getElementById(myPid+'_eyeMediaVault_tblPlaylist_Body').firstChild;
	while (Current_Row.className != "sort-table-select")
		Current_Row = Current_Row.nextSibling;
	Current_Row.className = "";
	if (document.getElementById('tlbToolbar_Shuffle_Container').className == 'blockbarItemPress') {
		var Random_Number = Math.floor(Math.random()*(Current_Row.parentNode.childNodes.length));
		Current_Row = Current_Row.parentNode.childNodes[Random_Number];
		eyeMediaVault_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row);
	} else {
		if (!(Current_Row.nextSibling)) {
			if (document.getElementById('tlbToolbar_Repeat_Container').className == 'blockbarItemPress') {
				Current_Row = Current_Row.parentNode.firstChild;
				eyeMediaVault_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row);
			}
		} else {
			Current_Row = Current_Row.nextSibling;
			eyeMediaVault_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row);
		}
	}
}

function eyeMediaVault_Previous(myPid, Keep_Playing, Check_Num){
	var Current_Row = document.getElementById(myPid+'_eyeMediaVault_tblPlaylist_Body').firstChild;
	while (Current_Row.className != "sort-table-select")
		Current_Row = Current_Row.nextSibling;
	Current_Row.className = "";
	if (!(Current_Row.nextSibling)) {
		if (document.getElementById('tlbToolbar_Repeat_Container').className == 'blockbarItemPress') {
			Current_Row = Current_Row.parentNode.lastChild;
			eyeMediaVault_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row);
		}
	} else {
		Current_Row = Current_Row.previousSibling;
		eyeMediaVault_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row);
	}
}

function eyeMediaVault_SelectFirst(myPid, Keep_Playing, Check_Num){
	var Current_Row = document.getElementById(myPid+'_eyeMediaVault_tblPlaylist_Body').firstChild;
	eyeMediaVault_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row);
	while (Current_Row.className != "sort-table-select")
		Current_Row = Current_Row.nextSibling;
	if (Current_Row.rowIndex != 1) {
		Current_Row.className = "";
	}
	if (Keep_Playing) {
		setTimeout("sendMsg("+Check_Num+",'tlbToolbar_Play')",500);
	}
}

function eyeMediaVault_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row){
	Current_Row.className = "sort-table-select";
	eval('This_Table = table_'+myPid+'_eyeMediaVault_tblPlaylist;');
	This_Table.lastClick = Current_Row;
	//alert(This_Table.lastClick.className+' vs '+Current_Row.className);
	if(This_Table.mySignal) {
		sendMsg(This_Table.mychecknum,This_Table.mySignal,eyeParam(This_Table.realName,This_Table.getSelectValue(This_Table.myMaster)));
	}
	if (Keep_Playing) {
		setTimeout("sendMsg("+Check_Num+",'tlbToolbar_Play')",500);
	}
}
