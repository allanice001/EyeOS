/*jslint evil: true */
/*
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

             eyeOS Engineering Team - eyeOS.org/whoarewe

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2008 eyeOS Team (team@eyeos.org)

*/

function eyeMedia_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row){
	Current_Row.className = "sort-table-select";
	var This_Table;
	eval('This_Table = table_'+myPid+'_eyeMedia_tblPlaylist;');
	This_Table.lastClick = Current_Row;
	//alert(This_Table.lastClick.className+' vs '+Current_Row.className);
	if(This_Table.mySignal) {
		sendMsg(This_Table.mychecknum,This_Table.mySignal,eyeParam(This_Table.realName,This_Table.getSelectValue(This_Table.myMaster)));
	}
	if (Keep_Playing) {
		setTimeout("sendMsg("+Check_Num+",'tlbToolbar_Play')",500);
	}
}

function eyeMedia_Next(myPid, Keep_Playing, Check_Num){
	var Current_Row = document.getElementById(myPid+'_eyeMedia_tblPlaylist_Body').firstChild;
	while (Current_Row.className != "sort-table-select") {
		Current_Row = Current_Row.nextSibling;
	}
	Current_Row.className = "";
	if (document.getElementById(myPid+'_tlbToolbar_Shuffle_Container').className == 'blockbarItemPress') {
		var Random_Number = Math.floor(Math.random()*(Current_Row.parentNode.childNodes.length));
		Current_Row = Current_Row.parentNode.childNodes[Random_Number];
		eyeMedia_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row);
	} else {
		if (!(Current_Row.nextSibling)) {
			if (document.getElementById(myPid+'_tlbToolbar_Repeat_Container').className == 'blockbarItemPress') {
				Current_Row = Current_Row.parentNode.firstChild;
				eyeMedia_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row);
			}
		} else {
			Current_Row = Current_Row.nextSibling;
			eyeMedia_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row);
		}
	}
}

function eyeMedia_Previous(myPid, Keep_Playing, Check_Num){
	var Current_Row = document.getElementById(myPid+'_eyeMedia_tblPlaylist_Body').firstChild;
	while (Current_Row.className != "sort-table-select") {
		Current_Row = Current_Row.nextSibling;
	}
	Current_Row.className = "";
	if (!(Current_Row.nextSibling)) {
		if (document.getElementById(myPid+'_tlbToolbar_Repeat_Container').className == 'blockbarItemPress') {
			Current_Row = Current_Row.parentNode.lastChild;
			eyeMedia_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row);
		}
	} else {
		Current_Row = Current_Row.previousSibling;
		eyeMedia_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row);
	}
}

function eyeMedia_SelectFirst(myPid, Keep_Playing, Check_Num){
	var Current_Row = document.getElementById(myPid+'_eyeMedia_tblPlaylist_Body').firstChild;
	eyeMedia_NextPreviousDo(myPid, Keep_Playing, Check_Num, Current_Row);
	while (Current_Row.className != "sort-table-select") {
		Current_Row = Current_Row.nextSibling;
	}
	if (Current_Row.rowIndex != 1) {
		Current_Row.className = "";
	}
	if (Keep_Playing) {
		setTimeout("sendMsg("+Check_Num+",'tlbToolbar_Play')",500);
	}
}