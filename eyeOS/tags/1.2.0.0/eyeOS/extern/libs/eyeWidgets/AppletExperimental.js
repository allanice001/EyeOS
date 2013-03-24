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

     eyeOS is released under the GNU General Public License (GPL)
            provided with this release in license.txt
             or via web at gnu.org/licenses/gpl.txt

        Copyright 2005-2007 eyeOS Team (team@eyeos.org)

        EXPERIMENTAL APPLET WIDGET. TO BE MERGED WITH BASEWIDGETS WHEN
        FINISHED. PLEASE DO NOT MESS WITH IT
*/
function Applet_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var height = params["height"];
	var width = params["width"];
	var codebase = params["codebase"];
	var visible = params["visible"];
	var appletParamsNames = getArrayArg(params["appletParamsNames"]);
	var appletParamsValues = getArrayArg(params["appletParamsValues"]);
	
	if(IEversion == 0) {
		var myApplet = document.createElement("embed");
		myApplet.setAttribute('type', 'application/x-java-applet');
		myApplet.setAttribute('width', width);
		myApplet.setAttribute('height', height);
		myApplet.setAttribute('id', name);
		
		for(key in appletParamsNames){
			myApplet.setAttribute(appletParamsNames[key], appletParamsValues[key]);
		}
	} else {
		var myApplet = document.createElement("object");
	
		myApplet.setAttribute('width',width);
		myApplet.setAttribute('height',height);
		myApplet.setAttribute('id', name);

		for(key in appletParamsNames){
			var myTempParam = document.createElement('param');
			myTempParam.setAttribute('name',appletParamsNames[key]);
			myTempParam.setAttribute('value',appletParamsValues[key]);
			myApplet.appendChild(myTempParam);
		}
	}
	
	if( codebase) {
		myApplet.setAttribute('codebase', codebase);
	}
	
	if( visible == 0) {
	    myApplet.style.visibility = 'hidden';
	}
	
	createWidget(name+'_Container',father,myApplet,horiz,vert,x,y,width,height,"eyeApplet",cent);
}