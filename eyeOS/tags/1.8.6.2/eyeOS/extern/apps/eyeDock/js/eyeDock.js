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

eyeDock_handled = new Array();
eyeDockLastObject = new Object();
eyeDockLastIcon = '';
eyeDockLastId = '';
eyeDockMenuState = '';
init_eyeDock($checknum);

function dockActiveMenu(id,icon,but,pid){
	//Besure that when the dock is actived, the button is also "pulsed"
	var iconObj = xGetElementById(pid+'_'+id+'_Container');
	iconObj.classNameBack = iconObj.className;
	iconObj.className = iconObj.className+'_active';
	xGetElementById(pid + '_menu_items_' + id).style.display = 'block';
	eyeDockLastIcon = icon;
	eyeDockLastId = id;
	eyeDockLastObject = but;
	eyeDockMenuState = id;
}

function dockAdvanceXIcon(id,intx,pid,menuNum) {
	var dockIconLeft = xGetElementById(pid + '_' + id);
	dockIconLeft.style.left = '50%';
	dockIconLeft.style.marginLeft = - (110 - 31 * menuNum) + 'px';
}

function dockButOnClick(id,icon,pid) {
	var but = xGetElementById(pid + '_' + id);
	if (!eyeDock_handled[id]) {
		eyeDockClickHandler(id,pid);
	}
	if (eyeDockMenuState == '') {
		dockActiveMenu(id,icon,but,pid);
	} else {      
		if (eyeDockLastObject.id == but.id) {
			dockDesactiveMenu(pid);
		} else {
			dockDesactiveMenu(pid);
			dockActiveMenu(id,icon,but,pid);
		}
	}
}

function dockButOnMouseOut(id,icon,pid) {
	xGetElementById(pid + '_menu_text_items_' + id).style.display = 'none';
	if (eyeDockMenuState != id) {
		xGetElementById(pid + '_' + id).src = 'index.php?version=' + EXTERN_CACHE_VERSION + '&theme=1&extern=images/apps/eyeDock/icons/' + icon + '.png';
		fixPNG(pid + '_' + id);
	}
}

function dockButOnMouseOver(id,icon,pid) {
	var but = xGetElementById(pid + '_' + id);
	but.src = 'index.php?version=' + EXTERN_CACHE_VERSION + '&theme=1&extern=images/apps/eyeDock/icons/' + icon + '_x.png';
	fixPNG(but);
	xGetElementById(pid + '_menu_text_items_' + id).style.display = 'block';
	if (eyeDockMenuState != '' && eyeDockMenuState != id) {
		dockDesactiveMenu(pid);
		dockActiveMenu(id,icon,but,pid);
		if (!eyeDock_handled[id]) {
			eyeDockClickHandler(id,pid);
		}
	}
}

function dockCenter(id,pid) {
	var styleLeft = xWidth(xGetElementById('eyeApps')) / 2 - xWidth(xGetElementById(pid + '_eyeDockContent')) / 2;
	if (styleLeft > 0) {
		xGetElementById(pid + '_' + id).style.left = styleLeft + 'px';
	}
}

function dockDesactiveMenu(pid) {
	var iconObj  = xGetElementById(pid+'_'+eyeDockLastId+'_Container');
	iconObj.className = iconObj.classNameBack;
	eyeDockLastObject.src = 'index.php?version=' + EXTERN_CACHE_VERSION + '&theme=1&extern=images/apps/eyeDock/icons/' + eyeDockLastIcon + '.png';
	fixPNG(eyeDockLastObject);
	xGetElementById(pid + '_menu_items_' + eyeDockLastId).style.display = 'none';
	eyeDockMenuState = '';
}

function dockMenuHeight(id,inty,pid) {
	xGetElementById(pid + '_' + id).style.height = inty + 'px';
}

function eyeDockClickHandler(id,pid) {
	eyeDock_handled[id] = id;
	addClickHandler(pid + '_' + id,'if (eyeDockMenuState == "' + id + '") { dockDesactiveMenu("' + pid + '"); }');
 	addFriendClick(pid + '_' + id,pid + '_' + id+'_Container');
}

function init_eyeDock(checknum) {
	sendMsg(checknum,'Launch','');
}
function dockCenter2(id,pid,num){
	var item = xGetElementById(pid+'_'+id);
	var eyeApps = xGetElementById('eyeApps');
	var left = item.parentNode.offsetLeft;
	item.style.left = left+'px';
	eyeApps.appendChild(item);
}