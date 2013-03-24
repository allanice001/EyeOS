/*
                                  ____   _____ 
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___  
                 / _ \ | | |/ _ \ |  | |\___ \ 
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/ 
                       __/ |                   
                      |___/              1.2

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - eyeOS.org/whoarewe

     eyeOS is released under the GNU General Public License Version 3 (GPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/gpl.txt

        Copyright 2005-2007 eyeOS Team (team@eyeos.org)         
*/
init_eyeFiles($myPid,$checknum);

function init_eyeFiles(pid,checknum) {
	var myName = pid+'_WND_1_WindowResizeButton';
	var state=0;
	var w = xWidth(pid+'_WND_1');
	var h = xHeight(pid+'_WND_1');
	var widget = pid+'_WND_1';
	var x,y;
	var father = document.getElementById(widget).parentNode;


	var leftBorder = xWidth(xGetElementById(widget+"_WindowBottom_left"));
	var rightBorder = xWidth(xGetElementById(widget+"_WindowBottom_right"));
	var barX = xGetElementById(widget+'_WindowTitle');
	
	var barX_height = xHeight(barX);
	var wstart = 10;
	//TODO: remove it, when widget line implemented
	//var objHr = document.createElement('div');
	//objHr.setAttribute('id','line1');
	//objHr.className = 'eyeLine';
	//objHr.style.position= 'absolute';
	//objHr.style.top = '32px';
	//document.getElementById(widget+'_Content').appendChild(objHr);
	document.getElementById(pid+'_WND_2_Content').style.overflowY='auto';
	document.getElementById(pid+'_WND_2_Content').style.overflowX='hidden';
	document.getElementById(pid+'_WND_3_Content').style.overflow='hidden';
	if(father.id == 'eyeApps') {
		barX_height = 0;
	}
	if(document.getElementById(pid+'_eyeFilesText')) {
		document.getElementById(pid+'_eyeFilesText').onkeypress=function (e) { 
			var event = new xEvent(e);
			if(event.keyCode == '13') {
				var myW = xWidth(pid+'_WND_2');
				sendMsg(checknum,'EnterBar',eyeParam('arg0',document.getElementById(pid+'_eyeFilesText').value)+eyeParam('arg1',myW));
			}
		}
	}
	xDisableDrag(myName,true);
	function onEyeFilesResize () {
		var wWidget = xWidth(pid+'_WND_1');
		var wHeight = xHeight(pid+'_WND_1');
		
		var corrected=0;
		if(wWidget < 400) {
			wWidget = 400;
			corrected = 1;
		} 
		
		if(wHeight <200) {
			wHeight = 200;
			corrected = 1;
		}
		
		if(corrected == 1) {
			xResizeTo(pid+'_WND_1',wWidget,wHeight);
		}
		
		xResizeTo(pid+'_WND_2',wWidget-220,wHeight-60);
		xResizeTo(pid+'_WND_3',xWidth(pid+'_WND_3'),wHeight-60);
		var TextWidth = wWidget-94;
		if(document.getElementById(pid+'_eyeFilesText')) {
			document.getElementById(pid+'_eyeFilesText').style.width = TextWidth+'px';
		}
		var myLeft = parseInt(TextWidth);
		myLeft += 49;
		if(document.getElementById(pid+'_right_textbox_img_Container')) {
			document.getElementById(pid+'_right_textbox_img_Container').style.left = myLeft+'px';
		}
		
		var i=0;
		var ele = xGetElementById(pid+'_eyeFiles_icon_'+i+'_Container');
		var separation = 30;
		var myx=wstart;
		var myy=10;
		var imgW,imgH;
		while(ele) {
			imgW = document.getElementById('img_'+pid+'_eyeFiles_icon_'+i).width;
			imgH = document.getElementById('img_'+pid+'_eyeFiles_icon_'+i).height;
			xSlideTo(ele,myx,myy,500);
			i++;
			myx +=imgW+separation;
			if(myx > wWidget-imgW-220) {
				myx = wstart;
				myy = myy+imgH+separation;
			}
			ele = xGetElementById(pid+'_eyeFiles_icon_'+i+'_Container');
		}
	}
	xEnableDrag(myName, null, resOnDrag, onEyeFilesResize);
	var mBtn = document.getElementById(pid+'_WND_1_WindowMaxButton');
	mBtn.onclick = maximize;
	function minimize () {
		maximized = false;
		xResizeTo(widget, w, h);
		xMoveTo(widget, x, y);
		mBtn.onclick = maximize;
		onEyeFilesResize();
	}
	function maximize (){
		w = xWidth(widget);
		h = xHeight(widget);
		x = xLeft(widget);
		y = xTop(widget);
		maximized = true;
		xResizeTo(widget, xWidth(father)-leftBorder-rightBorder, xHeight(father)-barX_height-barX_height-spaceBetweenApps-spaceBetweenApps);
		xMoveTo(widget, leftBorder, barX_height+spaceBetweenApps);
		xMoveTo(widget,null,barX_height+spaceBetweenApps);
		mBtn.onclick = minimize;
		onEyeFilesResize();
	}
}

function eyeFiles_clean(pid) {
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

function eyeFiles_reloadFiles(pid,checknum,path) {
	var myW = xWidth(pid+'_WND_2');
	if(path || !document.getElementById(pid+'_eyeFilesText')) {
		sendMsg(checknum,'Icon_Clicked',eyeParam('arg0',path)+eyeParam('arg1',myW));	
	} else {
		sendMsg(checknum,'Icon_Clicked',eyeParam('arg0',document.getElementById(pid+'_eyeFilesText').value)+eyeParam('arg1',myW));	
	}
}

