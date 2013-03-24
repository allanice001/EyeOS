/*jslint */
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

             eyeOS Engineering Team - www.eyeos.org/team

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2009 eyeOS Team (team@eyeos.org)
*/

var numberSnow = 5;
var snowInterval = 5;
var snowPrefix = 'index.php?version=' + EXTERN_CACHE_VERSION + '&theme=1&extern=images/apps/eyeSnow/';
var speed = 1;

function goPos(ele,go,speed) {
	var myEle = document.getElementById(ele);
	var pos = xTop(myEle);
	if(pos > go) {
		myEle.parentNode.removeChild(myEle);
	} else {
		pos = pos+speed;
		myEle.style.top = pos+'px';
		setTimeout("goPos('"+ele+"',"+go+","+speed+");",80);
	}
}

function drawFloc() {
	var flockType = Math.round(3*Math.random());
	var size = xClientWidth();

	var myFloc = document.createElement('img');
	myFloc.setAttribute('border',0);
	myFloc.setAttribute('src',snowPrefix+flockType+'.png');
	myFloc.style.zIndex = '1000';
	var myBody = document.getElementsByTagName("body")[0];
	var myPos = Math.round((size-15)*Math.random());
	myFloc.style.position = 'absolute';
	var myTop = Math.round(15*Math.random());
	myFloc.style.top = myTop+'px';
	myFloc.style.left = myPos+'px';
	myFloc.setAttribute('id',Math.round(999999*Math.random()));
	myFloc.style.border = '0px';
	myBody.appendChild(myFloc);
	var myDocSize = xDocSize();
	var myH = myDocSize.h;
	var tSpeed = speed + Math.round(3*Math.random());
	goPos(myFloc.id,myH-25,tSpeed);
}

function drawSnow() {
	var i;
	for(i=0;i<numberSnow;i++) {
		drawFloc();
	}
}

drawSnow();
setInterval(drawSnow,snowInterval*1000);