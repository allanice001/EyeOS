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
newUserOpen = 0;
init_login($myPid,$checknum);

function eyeLogin_keyPressed(characterCode,checknum,pid){
	if(characterCode == 13){ //if generated character code is equal to ascii 13 (if enter key)
		sendMsg(checknum,'doLogin',eyeParam('eyeLogin_Username',document.getElementById(pid+'_eyeLogin_Username').value)+eyeParam('eyeLogin_Password',document.getElementById(pid+'_eyeLogin_Password').value));
		return false;
	} else {
		return true;
	}
}

function eyeLogin_badLogin(user,pass,checknum,pid) {
	block(pid);
}

function eyeLogin_successLogin(user,checknum,pid) {
	updateOpacity(pid+'_wnd1_Container',100,0,150,'finish(\"'+checknum+'\");');
}

function block(pid) {
	document.getElementById(pid+'_eyeLogin_Username').disabled=true;
	document.getElementById(pid+'_eyeLogin_Password').disabled=true;
	movecount=0;
	setTimeout("mover('"+pid+"_wnd1_Container','"+pid+"')", 500);
}

function unblock(pid) {
	document.getElementById(pid+'_eyeLogin_Username').disabled=false;
	document.getElementById(pid+'_eyeLogin_Password').disabled=false;	
}

function mover(widget,pid) {
	var left = xLeft(widget);
	xLeft(widget,left+20);
	if(movecount > 0) {
		xLeft(widget,left+40);
	}
	if(movecount > 5) {
		xLeft(widget,left+20);
		unblock(pid);
		return;
	}
	movecount++;
	setTimeout("movel('"+widget+"','"+pid+"')",50);
}

function movel(widget,pid) {
	var left = xLeft(widget);
	var top = xTop(widget);
	xLeft(widget,left-40);
	setTimeout("mover('"+widget+"','"+pid+"')",50);
}

function finish(checknum) {
	sendMsg(checknum,'successLogin','');
}

function makeLight(id) {
	if (IEversion == 0){
		document.getElementById(id).style.backgroundImage ='url(index.php?extern=apps/eyeLogin/themes/default/gfx/box_x.png)';	
	}
}

function removeLight(id) {
	if (IEversion == 0){
		obj = document.getElementById(id);
		if(obj) {
			obj.style.backgroundImage='url(index.php?extern=apps/eyeLogin/themes/default/gfx/box.png)';
		}
	}
}

function init_login(pid,checknum) {
	var tmpObj = document.getElementById(pid+'_wnd2_Container');
	if(tmpObj) {
		tmpObj.style.display='block';
	}
	
	var objUsr = document.getElementById(pid+'_eyeLogin_Username');
	var objImg = document.getElementById(pid+'_eyeLogin_image_new1_Container');
	var objPwd = document.getElementById(pid+'_eyeLogin_Password');
	if(objImg) {
		objImg.onclick = function () {launch_newuserwnd(pid);};
		objImg.style.zIndex = '10000';
		var objTxt = document.getElementById(pid+'_eyeLogin_Label3_Container');
		objTxt.onclick = function () {launch_newuserwnd(pid);};
		objTxt.style.zIndex = '10000';
	}
	if(objUsr) {
		objUsr.onkeypress=function(e){
			var event = new xEvent(e);
			var ch = event.keyCode;
			eyeLogin_keyPressed(ch,checknum,pid);
		};
		objUsr.onfocus=function() {makeLight(pid+'_eyeLogin_Username');};
		objUsr.onblur=function() {removeLight(pid+'_eyeLogin_Username');};
	}
	if (objPwd) {
		objPwd.onkeypress=function(e){
		var event = new xEvent(e);
		var ch = event.keyCode;
		eyeLogin_keyPressed(ch,checknum,pid);
		};
		objPwd.onfocus=function() {makeLight(pid+'_eyeLogin_Password');};
		objPwd.onblur=function() {removeLight(pid+'_eyeLogin_Password');};
	}
	
	var objUsr2 = document.getElementById(pid+'_eyeLogin_Label4');
	var objImg2 = document.getElementById(pid+'_eyeLogin_image_enter_Container');
	
	if (objUsr2 && objImg2) {
		objUsr2.onclick = function () {sendMsg(checknum,'doLogin',eyeParam('eyeLogin_Username',document.getElementById(pid+'_eyeLogin_Username').value)+eyeParam('eyeLogin_Password',document.getElementById(pid+'_eyeLogin_Password').value));};
		objUsr2.style.zIndex = '10000';
		objImg2.onclick = function () {sendMsg(checknum,'doLogin',eyeParam('eyeLogin_Username',document.getElementById(pid+'_eyeLogin_Username').value)+eyeParam('eyeLogin_Password',document.getElementById(pid+'_eyeLogin_Password').value));};
		objImg2.style.zIndex = '10000';
	}
}

function eyeLogin_newuser_keyPressed(characterCode,checknum,pid)
{
	if(characterCode == 13) {		
		sendMsg(checknum,'doCreateUser',
				eyeParam('eyeLogin_newUser',document.getElementById(pid+'_eyeLogin_newUser').value)
				+eyeParam('eyeLogin_Pass1',document.getElementById(pid+'_eyeLogin_Pass1').value)
				+eyeParam('eyeLogin_Pass2',document.getElementById(pid+'_eyeLogin_Pass2').value)
				+eyeParam('eyeLogin_selectLang',document.getElementById(pid+'_eyeLogin_selectLang').value));				
		return false;
	} else {
		return true;
	}
}

function launch_newuserwnd(pid) {
	var background = xGetElementById(pid+'_wnd2_Container');
	var objnUsr = document.getElementById(pid+'_eyeLogin_newUser');
	
	var objUsr3 = document.getElementById(pid+'_eyeLogin_LabelCreate');
	var objImg3 = document.getElementById(pid+'_eyeLogin_image_create_Container');
	if(objUsr3) {
		objUsr3.onclick = function () {sendMsg(checknum,'doCreateUser',eyeParam('eyeLogin_newUser',document.getElementById(pid+'_eyeLogin_newUser').value)+eyeParam('eyeLogin_Pass1',document.getElementById(pid+'_eyeLogin_Pass1').value)+eyeParam('eyeLogin_Pass2',document.getElementById(pid+'_eyeLogin_Pass2').value)+eyeParam('eyeLogin_selectLang',document.getElementById(pid+'_eyeLogin_selectLang').value));};
		objImg3.onclick = function () {sendMsg(checknum,'doCreateUser',eyeParam('eyeLogin_newUser',document.getElementById(pid+'_eyeLogin_newUser').value)+eyeParam('eyeLogin_Pass1',document.getElementById(pid+'_eyeLogin_Pass1').value)+eyeParam('eyeLogin_Pass2',document.getElementById(pid+'_eyeLogin_Pass2').value)+eyeParam('eyeLogin_selectLang',document.getElementById(pid+'_eyeLogin_selectLang').value));};
	}
	
	
	if (newUserOpen == 0) {
		if (IEversion > 0) {
			background.style.visibility = 'visible';
			document.getElementById(pid+'_wnd2_Container').style.display='block';
		} else {
			updateOpacityOnce(0,pid+'_wnd2_Container');
			background.style.visibility = 'visible';
			document.getElementById(pid+'_wnd2_Container').style.display='block';
			updateOpacity(pid+'_wnd2_Container',0,100,500,'');	
		}

		newUserOpen = 1;
		objnUsr.focus();
		removeLight(pid+'_eyeLogin_Username');
		removeLight(pid+'_eyeLogin_Password');
		makeLight(pid+'_eyeLogin_newUser');
	} else {
		if (IEversion > 0) {
			document.getElementById(pid+'_wnd2_Container').style.display='none';
		} else {
			updateOpacity(pid+'_wnd2_Container',100,0,500,'document.getElementById("'+pid+'_wnd2_Container").style.display="none";');	
		}
		newUserOpen = 0;
		var objnLog = document.getElementById(pid+'_eyeLogin_Username');
		objnLog.focus();
		removeLight(pid+'_eyeLogin_newUser');
		removeLight(pid+'_eyeLogin_Pass1');
		removeLight(pid+'_eyeLogin_Pass2');		
		makeLight(pid+'_eyeLogin_Username');
	}
	
	objnUsr.onkeypress=function(e){
		var characterCode;
		var event = new xEvent(e);
		characterCode = event.keyCode;
		eyeLogin_newuser_keyPressed(characterCode,checknum,pid);
	};
	var objPwd1 = document.getElementById(pid+'_eyeLogin_Pass1');
	objPwd1.onkeypress=function(e){
		var characterCode;
		event = new xEvent(e);
			characterCode = event.keyCode;
		eyeLogin_newuser_keyPressed(characterCode,checknum,pid);
	};
	var objPwd2 = document.getElementById(pid+'_eyeLogin_Pass2');
	objPwd2.onkeypress=function(e){
		var characterCode;
		var event = new xEvent(e);
		characterCode = event.keyCode;
		eyeLogin_newuser_keyPressed(characterCode,checknum,pid);
	};
	objnUsr.onfocus=function() {makeLight(pid+'_eyeLogin_newUser');};
	objnUsr.onblur=function() {removeLight(pid+'_eyeLogin_newUser');};
	objPwd1.onfocus=function() {makeLight(pid+'_eyeLogin_Pass1');};
	objPwd1.onblur=function() {removeLight(pid+'_eyeLogin_Pass1');};
	objPwd2.onfocus=function() {makeLight(pid+'_eyeLogin_Pass2');};
	objPwd2.onblur=function() {removeLight(pid+'_eyeLogin_Pass2');};
}

function eyeLoginCleanWindow(pid) {
	var obj = document.getElementById(pid+'_eyeLogin_NewUser_Label1');
	if(obj) {
		obj.style.display = 'none';
	}
	obj = document.getElementById(pid+'_eyeLogin_NewUser_Label2');
	if(obj) {
		obj.style.display = 'none';
	}
	obj = document.getElementById(pid+'_eyeLogin_NewUser_Label3');
	if(obj) {
		obj.style.display = 'none';
	}
	obj = document.getElementById(pid+'_eyeLogin_newUser');
	if(obj) {
		obj.style.display = 'none';
	}
	obj = document.getElementById(pid+'_eyeLogin_Pass1');
	if(obj) {
		obj.style.display = 'none';
	}
	obj = document.getElementById(pid+'_eyeLogin_Pass2');
	if(obj) {
		obj.style.display = 'none';
	}
	obj = document.getElementById(pid+'_eyeLogin_LabelCreate');
	if(obj) {
		obj.style.display = 'none';
	}
	obj = document.getElementById(pid+'_eyeLogin_image_create_Container');
	if(obj) {
		obj.style.display = 'none';
	}
	obj = document.getElementById(pid+'_eyeLogin_selectLang');
	if(obj) {
		obj.style.display = 'none';
	}
	obj = document.getElementById(pid+'_eyeLogin_NewUser_Label4');
	if(obj) {
		obj.style.display = 'none';
	}	
}
