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

             eyeOS Engineering Team - www.eyeos.org/team

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2009 eyeOS Team (team@eyeos.org)
*/

var eyeDeskItems=0;
var eyeFlag=0;
var IEversion=0;
var TimeViewClock=2000;
if (navigator.appVersion.indexOf("MSIE")!=-1){
	IEversion = parseFloat(navigator.appVersion.split('MSIE')[1]);
}

var minArrows = 0;
var spaceBetweenApps = 1;
var zLayers = 11;//One more than eyeApps (default and base layer for all apps)
var mouseX = 0;
var mouseY = 0;
var messageBoxDirection=0;

var eyeKeyDown = 0;
document.oncontextmenu = function(e) { if(!IEversion) { e.preventDefault(); e.cancelBubble = true; } return false; };
document.onkeydown = function (e) { e = new xEvent(e); if (e.which) { eyeKeyDown = e.which; } else { eyeKeyDown = e.keyCode; } };
document.onkeyup = function () { eyeKeyDown = 0; };

//For fix Internet explorer <6 png24 no alpha.
function fixPNG(myImage,type){
	if (IEversion && IEversion < 7) {
		if (!myImage.src) {
			myImage = xGetElementById(myImage);
		}
		if (myImage.src.substr(myImage.src.length - 4).toLowerCase() == '.png' && myImage.src.substr(myImage.src.length - 24).toLowerCase() != 'apps/eyex/gfx/spacer.gif') {
			if (!type) {
				type = 'scale';
			}
			myImage.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + myImage.src + "', sizingMethod='" + type + "')";
			myImage.src = 'index.php?version=' + EXTERN_CACHE_VERSION + '&extern=apps/eyeX/gfx/spacer.gif';
		}
	}
}

function cookieEnabled() {
	if (typeof navigator.cookieEnabled == 'boolean' && navigator.cookieEnabled) {
		return navigator.cookieEnabled;
	}
	var cookieNumber = 0;
	while (document.cookie.indexOf('cookieEnabled-' + cookieNumber) != -1) {
		cookieNumber++;
	}
	document.cookie = 'cookieEnabled-' + cookieNumber;
	if (document.cookie.indexOf('cookieEnabled-' + cookieNumber) != -1) {
		return true;
	} else {
		return false;
	}
}

//== eyeCursor Section ==
var isEyeCursorActivated = false;

//== (eyeCursor) Loading cursor Section ==
//Here is the "loading" special cursor that informs the user that a
//request has been sent and is processed by the server
function ViewLoading() {
	if (navigator.appVersion.indexOf("Mac")!=-1) {
		oCursor.style.top = mouseY-14+'px';
		oCursor.style.left = mouseX+10+'px';
		oCursor.style.display = 'block';
	} else {
		oApps.style.cursor = 'url(index.php?version='+EXTERN_CACHE_VERSION+'&theme=1&extern=images/desktop/loadingcursor/loading.cur), wait';
	}
	return true;
}
var loadingRequests = 0;
function NoViewLoading() {
	if (loadingRequests <= 0) {
		loadingRequests = 0;
		if (navigator.appVersion.indexOf("Mac")!=-1) {
			oCursor.style.display = 'none';
		} else {
			oApps.style.cursor = 'auto';
		}
	}
	return true;
}
//This function is called by the sendMsg() function.
//It makes the "loading" cursor appear and increase the number
//of loading request by one
function notifyLoadingRequest() {
	loadingRequests++;
	var ctime = setTimeout(ViewLoading,TimeViewClock);
	return ctime;
}
//This function is called by the localEngine() function.
//It makes the "loading" cursor disappear if the request
//was the last one waiting and decreases the number of loading
//request by one
function notifyEndOfLoadingRequest() {
	loadingRequests--;
	NoViewLoading();
	return true;
}
//This function can be used to force the "loading" cursor to
//reset and hide it
function resetLoadingRequests() {
	loadingRequests = 0;
	ViewLoading();
	return true;
}

if (navigator.appVersion.indexOf("Mac")!=-1) {
	document.onmousemove = function (e) {
		if (IEversion && IEversion < 8) {
		  mouseX = e.clientX + document.body.scrollLeft;
		  mouseY = e.clientY + document.body.scrollTop;
		} else {
		  mouseX = e.pageX;
		  mouseY = e.pageY;
		}
		if(typeof('oCursor')!='undefined' && loadingRequests > 0) {
			oCursor.style.left = mouseX+10+'px';
			oCursor.style.top = mouseY-14+'px';
		}
	};
}
//== (eyeCursor) End of Loading cursor Section ==
//== End of eyeCursor Section ==

//change the opacity with callbacks 0 -100 for exmaple
function updateOpacity(id, init, end, time, callback) {
	time = Math.round(time / 100);
	var count = 0;
	var i;

	if(init > end) {
		for(i = init; i >= end; i--) {
			setTimeout("updateOpacityOnce(" + i + ",'" + id + "')",(count * time));
			count++;
		}
		if (callback) {
			setTimeout(callback,(count * time));
		}
	} else if(init < end) {
		for(i = init; i <= end; i++) {
			setTimeout("updateOpacityOnce(" + i + ",'" + id + "')",(count * time));
			count++;
		}
		if(callback) {
			setTimeout(callback,(count * time));
		}
	}
}

//Update a div opacity (css3 opacity property or alpha filter in ie.
function updateOpacityOnce(opacity, id) {
	var object = xGetElementById(id);
 	object.style.opacity = (opacity / 100);
 	object.style.filter = "alpha(opacity=" + opacity + ")";
 	if (opacity == 0) {
 		object.style.display = "none";
 	} else{
 		if (object.style.display == "none") {
 			object.style.display = "block";
 		}
 	}
}

//sendMsg is a ajax wrapper, send request to index.php with App checknum mgs and params (optional)
function sendMsg(checknum,msg,parameters) {
	var http_request = false;
	var url = 'index.php';
	if (window.XMLHttpRequest) {
		http_request = new XMLHttpRequest();
	} else if (window.ActiveXObject && ActiveXObject) {
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (err) {
			try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (error) {}
		}
	}
	if (!http_request) {
		alert('Sorry, but eyeOS only works with AJAX capable browsers!');
		return false;
	}
	if (msg != 'ping') {
		var ctime = notifyLoadingRequest();
	}
	http_request.onreadystatechange = function() {
		if (http_request.readyState == 4) {
			var xmlDoc;
			try {
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async="false";
				xmlDoc.loadXML(http_request.responseText);
			} catch(e) {
				var parser=new DOMParser();
				parser.async="false";
				xmlDoc=parser.parseFromString(http_request.responseText,"text/xml");
			}
			if(http_request.responseText != '<eyeMessage><action><task>pong</task></action></eyeMessage>') {
				clearTimeout(ctime);
				localEngine(xmlDoc);
			}
		}
	};
	http_request.open('POST', url+'?checknum=' + checknum + '&msg=' + msg, true);
	http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
	http_request.send('params=' + encodeURIComponent(parameters));
}

//Add param to xml
function eyeParam(name,value,nocode) {
	name = String(name);
	value = String(value);
	if (!nocode) {
		name = htmlspecialchars(name);
		value = htmlspecialchars(value);
	}
	return '<' + name + '>' + value + '</' + name + '>';
}

//Load script dynamically
function dhtmlLoadScript(url)
{
   var e = document.createElement("script");
   e.src = url;
   e.type="text/javascript";
   document.getElementsByTagName("head")[0].appendChild(e);
}

//Load css dynamically
function dhtmlLoadCSS(url,id) {
	var oLink = document.createElement("link");
	oLink.setAttribute("href",url);
	oLink.setAttribute("rel","stylesheet");
	oLink.setAttribute("type","text/css");
	oLink.setAttribute("id",id);
	document.getElementsByTagName("head")[0].appendChild(oLink);
}

//Remove css dynamically
function dhtmlRemoveCSS(remid) {
	var oLink = document.getElementById(remid);
	if(oLink) {
		document.getElementsByTagName("head")[0].removeChild(oLink);
	}
}

/*
*
*This function is needed because firefox dom is a crap, so we have to use the
*firefox only "textContent" instead of nodeValue to be sure that we'll get the entire
*Node value, and not only the first 4096 chars.
*anyway, have an abstraction never is bad... or almost never
*/
function getNodeValue(node){
	if(!node){
		return '';
	}
	if(typeof(node.textContent) != 'undefined'){
		return node.textContent;
	}
	return node.firstChild.nodeValue;
}

function checkEnterKey(e) {
	var characterCode;
	if(e.which) {
		characterCode = e.which;
	} else {
		characterCode = e.keyCode;
	}
	if(characterCode == 13) {
		return true;
	} else {
		return false;
	}
}

function setWallpaper(newWllp,repeat,center, color) {
	var wllp = document.getElementById('eyeWallpaper');

	wllp.style.backgroundImage = "url('"+newWllp+"')";

	if (repeat == 1) {
		wllp.style.backgroundRepeat = "repeat";
	} else {
		wllp.style.backgroundRepeat = "no-repeat";
	}

	if (center == 0) {
		wllp.style.backgroundPosition = "left top";
	} else {
		wllp.style.backgroundPosition = "center";
	}

	if (color) {
		wllp.style.backgroundColor = color;
	} else {
		wllp.style.backgroundColor = 'transparent';
	}
}

function eyeMessageBoxShow(msg) {
	if (msg != '') {

		var i = 0;

		while(document.getElementById('eyeMessageBox_'+i)) {
			i++;
		}

		var box = document.createElement('div');
		box.setAttribute('id','eyeMessageBox_'+i);
		box.className = 'eyeMessageBox';

		if(i > 0) {
			var last = document.getElementById('eyeMessageBox_'+(i-1));
			if(messageBoxDirection == 0) {
				box.style.top = xTop(last)-xHeight(last)+20+'px';
			} else {
				box.style.top = xTop(last)+xHeight(last)+20+'px';
			}
		}

		var theMsg = document.createElement('div');
		theMsg.setAttribute('id','eyeMessageBoxText_'+i);
		theMsg.className = 'eyeMessageBoxText';

		theMsg.innerHTML = msg;

		box.appendChild(theMsg);
		document.getElementById('eyeScreen').appendChild(box);

		if (!IEversion) {
			updateOpacity("eyeMessageBox_"+i, 0, 100, 1000);
		} else {
			document.getElementById("eyeMessageBox_"+i).style.visibility='visible';
		}
		setTimeout("eyeMessageBoxHid("+i+")",2000);
	}
}

function eyeMessageBoxHid(i) {
	box = document.getElementById("eyeMessageBoxText_"+i);
	if (!IEversion) {
		if (document.getElementById("eyeMessageBox_"+i).style.opacity == 1) {
			updateOpacity("eyeMessageBox_"+i, 100, 0, 1000, 'document.getElementById("eyeScreen").removeChild(document.getElementById("eyeMessageBox_'+i+'"));');
		} else {
			document.getElementById('eyeScreen').removeChild(document.getElementById("eyeMessageBox_"+i));
		}
	} else {
		document.getElementById('eyeScreen').removeChild(document.getElementById("eyeMessageBox_"+i));
	}
}

var EventHandler = {
	List : {},
	LastEvent : 0,

	HandleEvent : function (e) {
		e = new xEvent(e);
		EventHandler.LastEvent = e;
		var isfriend = 0;
		for (var element in EventHandler.List[e.type]) {
			if (element != e.target.id && EventHandler.List[e.type][element]) {
				if (EventHandler.List[e.type][element].option) {
					var t = e.target.parentNode;
					while (!isfriend && t) {
						if (element == t.id) {
							isfriend = 1;
						} else {
							t = t.parentNode;
						}
					}
				}
				if (!isfriend) {
					for (var friend in EventHandler.List[e.type][element].friends) {
						if (EventHandler.List[e.type][element].friends[friend] == e.target.id) {
							isfriend = 1;
						}
					}
				}
				if (EventHandler.List[e.type][element]['function']) {
					isfriend = EventHandler.List[e.type][element]['function'](e, isfriend);
				}
				if (!isfriend) {
					var run = new Function(EventHandler.List[e.type][element].code);
					run();
				}
				isfriend = 0;
			}
		}
	},

	Add : function (handler, element, code, option, func) {
		if (typeof EventHandler.List[handler] != 'object') {
			EventHandler.List[handler] = {};
			xAddEventListener(document,handler,EventHandler.HandleEvent,false);
		}
		if (typeof EventHandler.List[handler][element] != 'object') {
			EventHandler.List[handler][element] = {};
			EventHandler.List[handler][element].friends = [];
		}
		EventHandler.List[handler][element].code = code;
		if (typeof option != 'undefined') {
			EventHandler.List[handler][element].option = option;
		}
		if (typeof func != 'undefined') {
			EventHandler.List[handler][element]['function'] = func;
		}
	},

	AddFriend : function (handler,element,friend) {
		if (EventHandler.List[handler] && EventHandler.List[handler][element]) {
			EventHandler.List[handler][element].friends.push(friend);
		}
	},

	Remove : function (handler,element) {
		if (EventHandler.List[handler] && EventHandler.List[handler][element]) {
			xRemoveEventListener(document,handler,EventHandler.HandleEvent,false);
			EventHandler.List[handler][element] = 0;
		}
	},

	RemoveFriend : function (handler,element,friend) {
		for (var f = 0; f < EventHandler.List[handler][element].friends.length; f++) {
			if (EventHandler.List[handler][element].friends[f] == friend) {
				EventHandler.List[handler][element].friends[f] = 0;
				return;
			}
		}
	}
};

function addClickHandler(element,code) {
	EventHandler.Add('click',element,code);
}

function addFriendClick(element,friend) {
	EventHandler.AddFriend('click',element,friend);
}

function delClickHandler(div) {
	EventHandler.Remove('click',element);
}

function getArrayArg(arg) {
	var ret = arg.split('""');
	for(var i = 0; i < ret.length; i++) {
		var temp=ret[i].replace(/\\\"/,'"');
		temp=temp.replace(/\\\'/,"'");
		var last=ret[i];
		while(temp != last) {
			last=temp;
			temp = temp.replace(/\\\"/,'"');
			temp = temp.replace(/\\\'/,"'");
		}
		ret[i]=temp;
	}
	var myRet = [];
	i = 0;
	for (var x in ret) {
		if (ret[x] !== '') {
			myRet[i] = ret[x];
			i++;
		}
	}
	return myRet;
}
zindex = 100;
function getParentWidgetType(widget,widgetType){
	if(!widget.parentNode){
		return false;
	}
	var widgetParent = widget.parentNode;
	while(1){
		if(widgetParent.widgetType == widgetType){
			return widgetParent;
		}
		if(!widgetParent.parentNode){
			return false;
 		}
		widgetParent = widgetParent.parentNode;
	}
}

function setWidgetPos(widget, father, horiz, vert, x, y, cent) {
	widget = xGetElementById(widget);
	father = xGetElementById(father);
	if (!widget || !father) {
		return false;
	}
	if (cent == 1 || cent == 2) {
		x = parseInt(x, 10) + (xWidth(father) - xWidth(widget)) / 2;
	} else if (cent == 4 || cent == 5) {
		x = parseInt(x, 10) + xWidth(father) / 2;
	}
	if (!isNaN(x) && x >= 0) {
		if (horiz == 1) {
			widget.style.right = String(parseInt(x, 10)) + 'px';
		} else {
			widget.style.left = String(parseInt(x, 10)) + 'px';
		}
	}

	if (cent == 1 || cent == 3) {
		y = parseInt(y, 10) + (xHeight(father) - xHeight(widget)) / 2;
	} else if (cent == 4 || cent == 6) {
		y = parseInt(y, 10) + xHeight(father) / 2;
	}
	if (!isNaN(y) && y >= 0) {
		if (vert == 1) {
			widget.style.bottom = String(parseInt(y, 10)) + 'px';
		} else {
			widget.style.top = String(parseInt(y, 10)) + 'px';
		}
	}
	return widget;
}

function createWidget(widgetid, fatherid, content, horiz, vert, x, y, width, height, className, cent, unit, visible, widgetType) {
	if (document.getElementById(widgetid)) {
		try{
			console.log(widgetid + ' already exists.');
		} catch(err) { }
		return false;
	}
	var father = document.getElementById(fatherid);
	if (!father) {
		try{
			console.log(fatherid + ' does not exist.');
		} catch(error) { }
		return false;
	}
	if (!unit) {
		unit = 'px';
	}

	var widget = document.createElement('div');
	widget.setAttribute('id', widgetid);
	father.appendChild(widget);
	if (content != '') {
		widget.appendChild(content);
	}
	if (className) {
		widget.className = className;
	}
	if (visible == 0) {
		widget.style.display = 'none';
	} else {
		widget.style.display = 'block';
	}
	if (parseInt(height, 10) > 0) {
		widget.style.height = String(parseInt(height, 10)) + unit;
	}
	if (parseInt(width, 10) > 0) {
		widget.style.width = String(parseInt(width, 10)) + unit;
	}
	widget.style.position = 'absolute';
	widget.widgetType = widgetType;
	return setWidgetPos(widget, father, horiz, vert, x, y, cent);
}

function makeDrag(widgetid, father, afterfunction, checknum, content, noIndex) {
	var widget = xGetElementById(widgetid);
	if (!widget) {
		return false;
	}
	if (!noIndex) {
		widget.onmousedown = function () {
			xZIndex(widget, zindex);
			zindex++;
		};
	}
	var firstX = 0;
	var firstY = 0;

	function savePositions(e, x, y) {
		firstX = x;
		firstY = y;
	}

	function callafterfunction(e, x, y) {
		if (afterfunction) {
			var contentid = '';
			if (content) {
				contentid = ",'" + content + "'";
			}
			var run = new Function(afterfunction + "('" + widgetid + "'," + firstX + ',' + firstY + ',' + x + ',' + y + ",'" + checknum + "'" + contentid + ');');
			run();
		}
	}

	xEnableDrag2(widgetid, savePositions, null, callafterfunction, father);
	xShow(widget);
}

function removeWidget(widgetid) {
	var widget = xGetElementById(widgetid);
	if (widget) {
		widget.parentNode.removeChild(widget);
	}
}

/** ------------- Layer Section -------------**/
function createLayer(name,father,layerClass){
	var myLayer = document.createElement('div');
	myLayer.setAttribute("id", name);
	myLayer.className = layerClass;
	myLayer.style.display = 'none';
	var divFather = document.getElementById(father);
	divFather.appendChild(myLayer);
}

function removeLayer(divid) {
	var father = document.getElementById('eyeScreen');//Hardcoded because all layer are child of eyeScreen
	var div = document.getElementById(divid);
	if (father && div) {
		father.removeChild(div);
	}
}

function showLayer(layerId){
	var myLayer = document.getElementById(layerId);
	if(myLayer){
			myLayer.style.display = 'block';
			xZIndex(myLayer,zLayers);
			zLayers++;
	}
}

function hideLayer(layerId){
	var myLayer = document.getElementById(layerId);
	if(myLayer){
			myLayer.style.display = 'none';
			xZIndex(myLayer,1);//1 is because the minim of zLayer is 10.
	}
}

function fadeOutLayer(layerId,startAlpha,endAlpha,time){
	var myLayer = document.getElementById(layerId);
	if(myLayer){
			updateOpacityOnce(0,layerId);
			myLayer.style.display = 'block';
			//Up to layers
			xZIndex(myLayer,zLayers);
			zLayers++;
			updateOpacity(layerId, startAlpha, endAlpha, time,'');
	}
}

function fadeInLayer(layerId,startAlpha,endAlpha,time){
	var myLayer = document.getElementById(layerId);
	if(myLayer){
			//fadein alpha and then call hideLayer for set zindex etc
			var callback = 'hideLayer("'+layerId+'");';//Totaly hide  put tis optional? maybe
			updateOpacity(layerId, startAlpha, endAlpha, time,callback);
	}
}

function updateCss(widgetid,prop,val) {
    var run = new Function('document.getElementById("'+widgetid+'").style.'+prop+'="'+val+'";');
    run();
}

//tty stuff
function printToTty(tty,text) {
	var oTty = document.getElementById(tty+'_tty');

	if(!oTty) {
		return false;
	}
	if(oTty.tagName == 'DIV') {
		oTty.appendChild(document.createTextNode(text));
		oTty.appendChild(document.createElement('br'));
	} else if(oTty.tagName == 'INPUT') {
		oTty.value += text;
		oTty.value += "\n";
	}
}

/*
*This functions parse the sendmsg response.
*/
function localEngine(msg) {
	//message is not set, could be an empty response to a request
	notifyEndOfLoadingRequest();
	if(msg.hasChildNodes()) {
		var actions = msg.getElementsByTagName('action');
		if (!actions) {
			actions = msg.firstChild.childNodes;
		}
		var mySize = actions.length;
		for (var count = 0; count < mySize; count++) {
			try {
				var task = getNodeValue(actions[count].getElementsByTagName('task')[0]);
				var content, endAlpha, father, id, myClass, name, run, startAlpha, time, url, widget;
				if(task == 'createWidget') {
				    var position = actions[count].getElementsByTagName('position')[0];
					var x = getNodeValue(position.getElementsByTagName('x')[0]);
					var y = getNodeValue(position.getElementsByTagName('y')[0]);
					var horiz = getNodeValue(position.getElementsByTagName('horiz')[0]);
					var vert = getNodeValue(position.getElementsByTagName('vert')[0]);
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
					var checknum = getNodeValue(actions[count].getElementsByTagName('checknum')[0]);
					father = getNodeValue(actions[count].getElementsByTagName('father')[0]);
					var widgetname = getNodeValue(actions[count].getElementsByTagName('widgetname')[0]);
					var cent = getNodeValue(actions[count].getElementsByTagName('cent')[0]);
					var paramStr = getNodeValue(actions[count].getElementsByTagName('params')[0]);
					try{
						run = new Function(widgetname+"_show("+paramStr+",'"+name+"','"+father+"','"+x+"','"+y+"','"+horiz+"','"+vert+"','"+checknum+"','"+cent+"');");
						run();
					}catch(e){
						try {
							console.log('widget error: '+e);
						} catch(er) { }
					}
				} else if(task == 'messageBox') {
					content = getNodeValue(actions[count].getElementsByTagName('content')[0]);
					content = tinyMCE.entityDecode(content);
					var type = getNodeValue(actions[count].getElementsByTagName('type')[0]);
					if (!type || type == 1) {
						eyeMessageBoxShow(content);
					} else if (type == 2) {
						alert(content);
					}
				} else if(task == 'setValue') {
					content = getNodeValue(actions[count].getElementsByTagName('content')[0]);
					widget = getNodeValue(actions[count].getElementsByTagName('widget')[0]);
					if(document.getElementById(widget)) {
						document.getElementById(widget).value = content;
					}
				} else if(task == 'setValueB64') {
					content = getNodeValue(actions[count].getElementsByTagName('content')[0]);
					widget = getNodeValue(actions[count].getElementsByTagName('widget')[0]);
					if(document.getElementById(widget)) {
						document.getElementById(widget).value = Base64.decode(content);
					}
				} else if(task == 'concatValue') {
					content = getNodeValue(actions[count].getElementsByTagName('content')[0]);
					widget = getNodeValue(actions[count].getElementsByTagName('widget')[0]);
					if(document.getElementById(widget)) {
						document.getElementById(widget).value = document.getElementById(widget).value+content;
					}
				} else if(task == 'concatValueB64') {
					content = getNodeValue(actions[count].getElementsByTagName('content')[0]);
					widget = getNodeValue(actions[count].getElementsByTagName('widget')[0]);
					if(document.getElementById(widget)) {
						document.getElementById(widget).value = document.getElementById(widget).value+Base64.decode(content);
					}
				} else if(task == 'concatDiv') {
					content = getNodeValue(actions[count].getElementsByTagName('content')[0]);
					widget = getNodeValue(actions[count].getElementsByTagName('widget')[0]);
					if(document.getElementById(widget)) {
						document.getElementById(widget).innerHTML = document.getElementById(widget).innerHTML+content;
					}
				} else if(task == 'rawjs') {
					var js = getNodeValue(actions[count].getElementsByTagName('js')[0]);
					js=js.replace(/\n/,"");
					js=js.replace(/\r/,"");
					run = new Function(js);
					run();
				} else if(task == 'setDiv') {
					content = getNodeValue(actions[count].getElementsByTagName('content')[0]);
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
					document.getElementById(name).innerHTML = content;
				} else if(task == 'loadScript') {
					url = getNodeValue(actions[count].getElementsByTagName('url')[0]);
					dhtmlLoadScript(url);
				} else if(task == 'loadCSS') {
					url = getNodeValue(actions[count].getElementsByTagName('url')[0]);
					id = getNodeValue(actions[count].getElementsByTagName('id')[0]);
					dhtmlLoadCSS(url,id);
				} else if(task == 'removeCSS') {
					id = getNodeValue(actions[count].getElementsByTagName('id')[0]);
					dhtmlRemoveCSS(id);
				} else if(task == 'removeWidget') {
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
					removeWidget(name);
				} else if(task == 'createDiv') {
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
					myClass = getNodeValue(actions[count].getElementsByTagName('class')[0]);
					father = getNodeValue(actions[count].getElementsByTagName('father')[0]);
					var myDiv = document.createElement('div');
					myDiv.setAttribute("id", name);
					myDiv.className = myClass;
					var divFather = document.getElementById(father);
					divFather.appendChild(myDiv);
				} else if(task == 'setWallpaper') {
					url = getNodeValue(actions[count].getElementsByTagName('url')[0]);
					var repeat = getNodeValue(actions[count].getElementsByTagName('repeat')[0]);
					var center = getNodeValue(actions[count].getElementsByTagName('center')[0]);
					var color = getNodeValue(actions[count].getElementsByTagName('color')[0]);
					setWallpaper(url, repeat, center, color);
				} else if(task == 'updateCss') {
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
					var prop = getNodeValue(actions[count].getElementsByTagName('property')[0]);
					var val = getNodeValue(actions[count].getElementsByTagName('value')[0]);
					updateCss(name,prop,val);
				} else if(task == 'makeDrag') {
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
					father = getNodeValue(actions[count].getElementsByTagName('father')[0]);
					//We use try catch for evade the differents beteewn browsers
					try{
						var noIndex = getNodeValue(actions[count].getElementsByTagName('noIndex')[0]);
						makeDrag(name,father,'','','',noIndex);
					}catch(err){
						makeDrag(name,father,'','','','');
					}
				} else if(task == 'rawSendMessage') {
					var myMsg = getNodeValue(actions[count].getElementsByTagName('msg')[0]);
					var myPar;
					if(actions[count].getElementsByTagName('par')[0].firstChild){
						myPar = getNodeValue(actions[count].getElementsByTagName('par')[0]);
					}else{
						myPar = '';
					}
					var myCheck = getNodeValue(actions[count].getElementsByTagName('checknum')[0]);
					sendMsg(myCheck,myMsg,myPar);
				} else if(task == 'addEvent') {
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
					var event = getNodeValue(actions[count].getElementsByTagName('event')[0]);
					var func = getNodeValue(actions[count].getElementsByTagName('func')[0]);
					var args = getNodeValue(actions[count].getElementsByTagName('args')[0]);
					if (args == 0) {
						run = new Function('document.getElementById("'+name+'").'+event+'=function(){'+func+'}');
						run();
					} else {
						run = new Function('document.getElementById("'+name+'").'+event+'=function('+args+'){'+func+'}');
						run();
					}
				} else if(task == 'createLayer') {
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
					myClass = getNodeValue(actions[count].getElementsByTagName('class')[0]);
					father = getNodeValue(actions[count].getElementsByTagName('father')[0]);
					createLayer(name,father,myClass);
				} else if(task == 'removeLayer') {
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
				 	removeLayer(name);
				} else if(task == 'showLayer') {
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
					showLayer(name);
				} else if(task == 'hideLayer') {
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
					hideLayer(name);
				} else if(task == 'fadeOutLayer') {
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
					time = getNodeValue(actions[count].getElementsByTagName('time')[0]);
					startAlpha = getNodeValue(actions[count].getElementsByTagName('startAlpha')[0]);
					endAlpha = getNodeValue(actions[count].getElementsByTagName('endAlpha')[0]);
					fadeOutLayer(name,startAlpha,endAlpha,time);
				} else if(task == 'fadeInLayer') {
					name = getNodeValue(actions[count].getElementsByTagName('name')[0]);
					time = getNodeValue(actions[count].getElementsByTagName('time')[0]);
					startAlpha = getNodeValue(actions[count].getElementsByTagName('startAlpha')[0]);
					endAlpha = getNodeValue(actions[count].getElementsByTagName('endAlpha')[0]);
					fadeInLayer(name,startAlpha,endAlpha,time);
				}
			} catch (erro) {
				try {
					console.log('Response error: '+erro);
				} catch(error) { }
			}
		}
	}
}

//This is the entityDecode version from tinyMCE2, the new one crash some widgets :/
tinyMCE.entityDecode = function entityDecode(s) {
	var e = document.createElement("div");
	e.innerHTML = s;
	return !e.firstChild ? s : e.firstChild.nodeValue;
};

/* Compiled from X 4.21 by XC 1.07 on 12Feb10 */
xLibrary={version:'4.21',license:'GNU LGPL',url:'http://cross-browser.com/'};
// xEvent r11, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xEvent(evt) // object prototype
{
  var e = evt || window.event;
  if (!e) return;
  this.type = e.type;
  this.target = e.target || e.srcElement;
  this.relatedTarget = e.relatedTarget;
  /*@cc_on if (e.type == 'mouseover') this.relatedTarget = e.fromElement;
  else if (e.type == 'mouseout') this.relatedTarget = e.toElement; @*/
  if (xDef(e.pageX)) { this.pageX = e.pageX; this.pageY = e.pageY; }
  else if (xDef(e.clientX)) { this.pageX = e.clientX + xScrollLeft(); this.pageY = e.clientY + xScrollTop(); }
  if (xDef(e.offsetX)) { this.offsetX = e.offsetX; this.offsetY = e.offsetY; }
  else if (xDef(e.layerX)) { this.offsetX = e.layerX; this.offsetY = e.layerY; }
  else { this.offsetX = this.pageX - xPageX(this.target); this.offsetY = this.pageY - xPageY(this.target); }
  this.keyCode = e.keyCode || e.which || 0;
  this.shiftKey = e.shiftKey; this.ctrlKey = e.ctrlKey; this.altKey = e.altKey;
  if (typeof e.type == 'string') {
    if (e.type.indexOf('click') != -1) {this.button = 0;}
    else if (e.type.indexOf('mouse') != -1) {
      this.button = e.button;
      /*@cc_on if (e.button & 1) this.button = 0;
      else if (e.button & 4) this.button = 1;
      else if (e.button & 2) this.button = 2; @*/
    }
  }
}
// xAddClass r3, Copyright 2005-2007 Daniel Frechette - modified by Mike Foster
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xAddClass(e, c)
{
  if ((e=xGetElementById(e))!=null) {
    var s = '';
    if (e.className.length && e.className.charAt(e.className.length - 1) != ' ') {
      s = ' ';
    }
    if (!xHasClass(e, c)) {
      e.className += s + c;
      return true;
    }
  }
  return false;
}
// xAddEventListener r8, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xAddEventListener(e,eT,eL,cap)
{
  if(!(e=xGetElementById(e)))return;
  eT=eT.toLowerCase();
  if(e.addEventListener)e.addEventListener(eT,eL,cap||false);
  else if(e.attachEvent)e.attachEvent('on'+eT,eL);
  else {
    var o=e['on'+eT];
    e['on'+eT]=typeof o=='function' ? function(v){o(v);eL(v);} : eL;
  }
}
// xBackground r4, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL

function xBackground(e,c,i)
{
  if(!(e=xGetElementById(e))) return '';
  var bg='';
  if(e.style) {
    if(xStr(c)) {e.style.backgroundColor=c;}
    if(xStr(i)) {e.style.backgroundImage=(i!='')? 'url('+i+')' : null;}
    bg=e.style.backgroundColor;
  }
  return bg;
}
// xCamelize r1, Copyright 2007-2009 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xCamelize(cssPropStr)
{
  var i, c, a, s;
  a = cssPropStr.split('-');
  s = a[0];
  for (i=1; i<a.length; ++i) {
    c = a[i].charAt(0);
    s += a[i].replace(c, c.toUpperCase());
  }
  return s;
}
// xClientHeight r6, Copyright 2001-2008 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xClientHeight()
{
  var v=0,d=document,w=window;
  if((!d.compatMode || d.compatMode == 'CSS1Compat') /* && !w.opera */ && d.documentElement && d.documentElement.clientHeight)
    {v=d.documentElement.clientHeight;}
  else if(d.body && d.body.clientHeight)
    {v=d.body.clientHeight;}
  else if(w.innerHeight && xDef(w.innerHeight)) {
    v=w.innerHeight;
    if(xDef(w.innerWidth,d.width) && d.width>w.innerWidth) v-=16;
  }
  return v;
}
// xClientWidth r5, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xClientWidth()
{
  var v=0,d=document,w=window;
  if((!d.compatMode || d.compatMode == 'CSS1Compat') && !w.opera && d.documentElement && d.documentElement.clientWidth)
    {v=d.documentElement.clientWidth;}
  else if(d.body && d.body.clientWidth)
    {v=d.body.clientWidth;}
  else if(w.innerWidth && xDef(w.innerWidth)) {
    v=w.innerWidth;
    if(xDef(w.innerHeight,d.height) && d.height>w.innerHeight) v-=16;
  }
  return v;
}
// xColor r2, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL

function xColor(e,s)
{
  if(!(e=xGetElementById(e))) return '';
  var c='';
  if(e.style && xDef(e.style.color)) {
    if(xStr(s)) e.style.color=s;
    c=e.style.color;
  }
  return c;
}
// xDef r1, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xDef()
{
  for(var i=0; i<arguments.length; ++i){if(typeof(arguments[i])=='undefined') return false;}
  return true;
}
// xDisableDrag r3, Copyright 2005-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xDisableDrag(id)
{
  xGetElementById(id).xDragEnabled = false;
}
// xDisableDrop r2, Copyright 2006-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xDisableDrop(id)
{
  xGetElementById(id).xDropEnabled = false;
}
// xDisplay r3, Copyright 2003-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
// This was alternative 1:
function xDisplay(e,s)
{
  if ((e=xGetElementById(e)) && e.style && xDef(e.style.display)) {
    if (xStr(s)) {
      try { e.style.display = s; }
      catch (ex) { e.style.display = ''; } // Will this make IE use a default value
    }                                      // appropriate for the element?
    return e.style.display;
  }
  return null;
}
// xDocSize r1, Copyright 2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xDocSize()
{
  var b=document.body, e=document.documentElement;
  var esw=0, eow=0, bsw=0, bow=0, esh=0, eoh=0, bsh=0, boh=0;
  if (e) {
    esw = e.scrollWidth;
    eow = e.offsetWidth;
    esh = e.scrollHeight;
    eoh = e.offsetHeight;
  }
  if (b) {
    bsw = b.scrollWidth;
    bow = b.offsetWidth;
    bsh = b.scrollHeight;
    boh = b.offsetHeight;
  }
//  alert('compatMode: ' + document.compatMode + '\n\ndocumentElement.scrollHeight: ' + esh + '\ndocumentElement.offsetHeight: ' + eoh + '\nbody.scrollHeight: ' + bsh + '\nbody.offsetHeight: ' + boh + '\n\ndocumentElement.scrollWidth: ' + esw + '\ndocumentElement.offsetWidth: ' + eow + '\nbody.scrollWidth: ' + bsw + '\nbody.offsetWidth: ' + bow);
  return {w:Math.max(esw,eow,bsw,bow),h:Math.max(esh,eoh,bsh,boh)};
}
// xEnableDrag r8, Copyright 2002-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xEnableDrag(id,fS,fD,fE)
{
  var mx = 0, my = 0, el = xGetElementById(id);
  if (el) {
    el.xDragEnabled = true;
    xAddEventListener(el, 'mousedown', dragStart, false);
  }
  // Private Functions
  function dragStart(e)
  {
    if (el.xDragEnabled) {
      var ev = new xEvent(e);
      xPreventDefault(e);
      mx = ev.pageX;
      my = ev.pageY;
      xAddEventListener(document, 'mousemove', drag, false);
      xAddEventListener(document, 'mouseup', dragEnd, false);
      if (fS) {
        fS(el, ev.pageX, ev.pageY, ev);
      }
    }
  }
  function drag(e)
  {
    if (el && el.xDragEnabled) {
    var ev, dx, dy;
    xPreventDefault(e);
    ev = new xEvent(e);
    dx = ev.pageX - mx;
    dy = ev.pageY - my;
    mx = ev.pageX;
    my = ev.pageY;
    if (fD) {
      fD(el, dx, dy, ev);
    }
    else {
      xMoveTo(el, xLeft(el) + dx, xTop(el) + dy);
    }
    }
  }
  function dragEnd(e)
  {
    var ev = new xEvent(e);
    xPreventDefault(e);
    xRemoveEventListener(document, 'mouseup', dragEnd, false);
    xRemoveEventListener(document, 'mousemove', drag, false);
    if (fE) {
      fE(el, ev.pageX, ev.pageY, ev);
    }
    if (xEnableDrag.drop) {
      xEnableDrag.drop(el, ev);
    }
  }
}

xEnableDrag.drops = []; // static property
// xEnableDrag2 r1, Copyright 2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xEnableDrag2(id,fS,fD,fE,x1,y1,x2,y2)
{
  var b = null; // boundary element
  if (typeof x1 != 'undefined' && !x2) {
    b = xGetElementById(x1);
  }
  xEnableDrag(id,
    function (el, x, y, ev) { // dragStart
      if (b) { // get rect from current size of ele
        x1 = xPageX(b);
        y1 = xPageY(b);
        x2 = x1 + b.offsetWidth;
        y2 = y1 + b.offsetHeight;
      }
      if (fS) fS(el, x, y, ev);
    },
    function (el, dx, dy, ev) { // drag
      var x = xPageX(el) + dx; // absolute coords of target
      var y = xPageY(el) + dy;
      var mx = ev.pageX; // absolute coords of mouse
      var my = ev.pageY;
      if  (!(x < x1 || x + el.offsetWidth > x2) && !(mx < x1 || mx > x2)) {
        el.style.left = (el.offsetLeft + dx) + 'px';
      }
      if (!(y < y1 || y + el.offsetHeight > y2) && !(my < y1 || my > y2)) {
        el.style.top = (el.offsetTop + dy) + 'px';
      }
      if (fD) fD(el, dx, dy, ev);
    },
    function (el, x, y, ev) { // dragEnd
      if (fE) fE(el, x, y, ev);
    }
  );
}
// xEnableDrop r3, Copyright 2006-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xEnableDrop(id, f)
{
  var e = xGetElementById(id);
  if (e) {
    e.xDropEnabled = true;
    xEnableDrag.drops[xEnableDrag.drops.length] = {e:e, f:f};
  }
}

xEnableDrag.drop = function (el, ev) // static method
{
  var i, hz = 0, d = null, da = xEnableDrag.drops;
  for (i = 0; i < da.length; ++i) {
    if (da[i] && xHasPoint(da[i].e, ev.pageX, ev.pageY)) {
      var z = getZindex(da[i].e);
      if (z >= hz) {
        hz = z;
        if (!da[i].e.xDropEnabled) {
          d = null;
        } else {
          d = da[i];
        }
      }
    }
  }
  if (d) {
    d.f(d.e, el, ev.pageX, ev.pageY); // drop event
  }
}

function getZindex(e) {
	var z = 0;
	while (e) {
		if (e.style && parseInt(e.style.zIndex)) z += parseInt(e.style.zIndex);
		e = e.parentNode ? e.parentNode : null;
	}
	return z;
}
// xFindAfterByClassName r1, Copyright 2005-2007 Olivier Spinelli
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xFindAfterByClassName( ele, clsName )
{
  var re = new RegExp('\\b'+clsName+'\\b', 'i');
  return xWalkToLast( ele, function(n){if(n.className.search(re) != -1)return n;} );
}
// xFindBeforeByClassName r1, Copyright 2005-2007 Olivier Spinelli
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xFindBeforeByClassName( ele, clsName )
{
  var re = new RegExp('\\b'+clsName+'\\b', 'i');
  return xWalkToFirst( ele, function(n){if(n.className.search(re) != -1)return n;} );
}
// xGetCSSRules r1, Copyright 2006-2007 Ivan Pepelnjak (www.zaplana.net)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
// xGetCSSRules - extracts CSS rules from the style sheet object (IE vs. DOM CSS level 2)
function xGetCSSRules(ss) { return ss.rules ? ss.rules : ss.cssRules; }
// xGetComputedStyle r7, Copyright 2002-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xGetComputedStyle(e, p, i)
{
  if(!(e=xGetElementById(e))) return null;
  var s, v = 'undefined', dv = document.defaultView;
  if(dv && dv.getComputedStyle){
    s = dv.getComputedStyle(e,'');
    if (s) v = s.getPropertyValue(p);
  }
  else if(e.currentStyle) {
    v = e.currentStyle[xCamelize(p)];
  }
  else return null;
  return i ? (parseInt(v) || 0) : v;
}

// xGetElementById r2, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xGetElementById(e)
{
  if (typeof(e) == 'string') {
    if (document.getElementById) e = document.getElementById(e);
    else if (document.all) e = document.all[e];
    else e = null;
  }
  return e;
}
// xGetElementsByClassName r6, Copyright 2002-2009 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xGetElementsByClassName(c,p,t,f)
{
  var r = [], re, e, i;
  re = new RegExp("(^|\\s)"+c+"(\\s|$)");
//  var e = p.getElementsByTagName(t);
  e = xGetElementsByTagName(t,p); // See xml comments.
  for (i = 0; i < e.length; ++i) {
    if (re.test(e[i].className)) {
      r[r.length] = e[i];
      if (f) f(e[i]);
    }
  }
  return r;
}
// xGetElementsByTagName r5, Copyright 2002-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xGetElementsByTagName(t,p)
{
  var list = null;
  t = t || '*';
  p = xGetElementById(p) || document;
  if (typeof p.getElementsByTagName != 'undefined') { // DOM1
    list = p.getElementsByTagName(t);
    if (t=='*' && (!list || !list.length)) list = p.all; // IE5 '*' bug
  }
  else { // IE4 object model
    if (t=='*') list = p.all;
    else if (p.all && p.all.tags) list = p.all.tags(t);
  }
  return list || [];
}
// xGetStyleSheetFromLink r1, Copyright 2006-2007 Ivan Pepelnjak (www.zaplana.net)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
// xGetStyleSheetFromLink - extracts style sheet object from the HTML LINK object (IE vs. DOM CSS level 2)
function xGetStyleSheetFromLink(cl) { return cl.styleSheet ? cl.styleSheet : cl.sheet; }

// xHasClass r3, Copyright 2005-2007 Daniel Frechette - modified by Mike Foster
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xHasClass(e, c)
{
  e = xGetElementById(e);
  if (!e || e.className=='') return false;
  var re = new RegExp("(^|\\s)"+c+"(\\s|$)");
  return re.test(e.className);
}
// xHasPoint r2, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xHasPoint(e,x,y,t,r,b,l)
{
  if (!xNum(t)){t=r=b=l=0;}
  else if (!xNum(r)){r=b=l=t;}
  else if (!xNum(b)){l=r; b=t;}
  var eX = xPageX(e), eY = xPageY(e);
  return (x >= eX + l && x <= eX + xWidth(e) - r &&
          y >= eY + t && y <= eY + xHeight(e) - b );
}
// xHasStyleSelector r1, Copyright 2006-2007 Ivan Pepelnjak (www.zaplana.net)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
// xHasStyleSelector(styleSelectorString)
//   checks whether any of the stylesheets attached to the document contain the definition of the specified
//   style selector (simple string matching at the moment)
//
// returns:
//   undefined  - style sheet scripting not supported by the browser
//   true/false - found/not found
function xHasStyleSelector(ss) {
  if (! xHasStyleSheets()) return undefined ;

  function testSelector(cr) {
    return cr.selectorText.indexOf(ss) >= 0;
  }
  return xTraverseDocumentStyleSheets(testSelector);
}
// xHasStyleSheets r1, Copyright 2006-2007 Ivan Pepelnjak (www.zaplana.net)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
// xHasStyleSheets - checks browser support for stylesheet related objects (IE or DOM compliant)
function xHasStyleSheets() {
  return document.styleSheets ? true : false ;
}
// xHeight r7, Copyright 2001-2009 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xHeight(e,h)
{
  var css, pt=0, pb=0, bt=0, bb=0, gcs;
  if(!(e=xGetElementById(e))) return 0;
  if (xNum(h)) {
    if (h<0) h = 0;
    else h=Math.round(h);
  }
  else h=-1;
  css=xDef(e.style);
  if (e == document || e.tagName.toLowerCase() == 'html' || e.tagName.toLowerCase() == 'body') {
    h = xClientHeight();
  }
  else if(css && xDef(e.offsetHeight) && xStr(e.style.height)) {
    if(h>=0) {
      if (document.compatMode=='CSS1Compat') {
        gcs = xGetComputedStyle;
        pt=gcs(e,'padding-top',1);
        if (pt !== null) {
          pb=gcs(e,'padding-bottom',1);
          bt=gcs(e,'border-top-width',1);
          bb=gcs(e,'border-bottom-width',1);
        }
        // Should we try this as a last resort?
        // At this point getComputedStyle and currentStyle do not exist.
        else if(xDef(e.offsetHeight,e.style.height)){
          e.style.height=h+'px';
          pt=e.offsetHeight-h;
        }
      }
      h-=(pt+pb+bt+bb);
      if(isNaN(h)||h<0) return;
      else e.style.height=h+'px';
    }
    h=e.offsetHeight;
  }
  else if(css && xDef(e.style.pixelHeight)) {
    if(h>=0) e.style.pixelHeight=h;
    h=e.style.pixelHeight;
  }
  return h;
}
// xHex r1, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xHex(n, digits, prefix)
{
  var p = '', n = Math.ceil(n);
  if (prefix) p = prefix;
  n = n.toString(16);
  for (var i=0; i < digits - n.length; ++i) {
    p += '0';
  }
  return p + n;
}
// xHide r3, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL

function xHide(e){return xVisibility(e,0);}
// xInsertRule r2, Copyright 2006-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xInsertRule(ss, sel, rule, idx)
{
  if (!(ss=xGetElementById(ss))) return false;
  if (ss.insertRule) { ss.insertRule(sel + "{" + rule + "}", (idx>=0?idx:ss.cssRules.length)); } // DOM
  else if (ss.addRule) { ss.addRule(sel, rule, idx); } // IE
  else return false;
  return true;
}
// xLeft r2, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xLeft(e, iX)
{
  if(!(e=xGetElementById(e))) return 0;
  var css=xDef(e.style);
  if (css && xStr(e.style.left)) {
    if(xNum(iX)) e.style.left=iX+'px';
    else {
      iX=parseInt(e.style.left);
      if(isNaN(iX)) iX=xGetComputedStyle(e,'left',1);
      if(isNaN(iX)) iX=0;
    }
  }
  else if(css && xDef(e.style.pixelLeft)) {
    if(xNum(iX)) e.style.pixelLeft=iX;
    else iX=e.style.pixelLeft;
  }
  return iX;
}
// xMoveTo r1, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xMoveTo(e,x,y)
{
  xLeft(e,x);
  xTop(e,y);
}
// xNum r2, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xNum()
{
  for(var i=0; i<arguments.length; ++i){if(isNaN(arguments[i]) || typeof(arguments[i])!='number') return false;}
  return true;
}
// xOpacity r1, Copyright 2006-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xOpacity(e, o)
{
  var set = xDef(o);
  //  if (set && o == 1) o = .9999; // FF1.0.2 but not needed in 1.5
  if(!(e=xGetElementById(e))) return 2; // error
  if (xStr(e.style.opacity)) { // CSS3
    if (set) e.style.opacity = o + '';
    else o = parseFloat(e.style.opacity);
  }
  else if (xStr(e.style.filter)) { // IE5.5+
    if (set) e.style.filter = 'alpha(opacity=' + (100 * o) + ')';
    else if (e.filters && e.filters.alpha) { o = e.filters.alpha.opacity / 100; }
  }
  else if (xStr(e.style.MozOpacity)) { // Gecko before CSS3 support
    if (set) e.style.MozOpacity = o + '';
    else o = parseFloat(e.style.MozOpacity);
  }
  else if (xStr(e.style.KhtmlOpacity)) { // Konquerer and Safari
    if (set) e.style.KhtmlOpacity = o + '';
    else o = parseFloat(e.style.KhtmlOpacity);
  }
  return isNaN(o) ? 1 : o; // if NaN, should this return an error instead of 1?
}
// xPageX r2, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xPageX(e)
{
  var x = 0;
  e = xGetElementById(e);
  while (e) {
    if (xDef(e.offsetLeft)) x += e.offsetLeft;
    try{
      e = xDef(e.offsetParent) ? e.offsetParent : null;
    } catch(err) {
      e = null;
    }
  }
  return x;
}
// xPageY r4, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xPageY(e)
{
  var y = 0;
  e = xGetElementById(e);
  while (e) {
    if (xDef(e.offsetTop)) y += e.offsetTop;
    try{
      e = xDef(e.offsetParent) ? e.offsetParent : null;
    } catch(err) {
      e = null;
    }
  }
  return y;
}
// xParent r2, Copyright 2001-2010 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xParent(e, s)
{
  e = xGetElementById(e);
  if (e) {
    e = e.parentNode;
    if (s) {
      while (e && e.nodeName.toLowerCase() != s) e = e.parentNode;
    }
  }
  return e;
}

/* r1
function xParent(e, bNode)
{
  if (!(e=xGetElementById(e))) return null;
  var p=null;
  if (!bNode && xDef(e.offsetParent)) p=e.offsetParent;
  else if (xDef(e.parentNode)) p=e.parentNode;
  else if (xDef(e.parentElement)) p=e.parentElement;
  return p;
}
*/
// xParseColor r1, Copyright 2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xParseColor(c)
{
  var o = {};
  if (xStr(c)) {
    if (c.indexOf('rgb')!=-1) {
      var a = c.match(/(\d*)\s*,\s*(\d*)\s*,\s*(\d*)/);
      o.r = parseInt(a[1]) || 0;
      o.g = parseInt(a[2]) || 0;
      o.b = parseInt(a[3]) || 0;
      o.n = (o.r << 16) | (o.g << 8) | o.b;
    }
    else {
      pn(parseInt(c.substr(1), 16));
    }
  }
  else {
    pn(c);
  }
  o.s = xHex(o.n, 6, '#');
  return o;
  function pn(n) { // parse num
    o.n = n || 0;
    o.r = (o.n & 0xFF0000) >> 16;
    o.g = (o.n & 0xFF00) >> 8;
    o.b = o.n & 0xFF;
  }
}
// xPreventDefault r1, Copyright 2004-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xPreventDefault(e)
{
  if (e && e.preventDefault) e.preventDefault();
  else if (window.event) window.event.returnValue = false;
}
// xRemoveClass r3, Copyright 2005-2007 Daniel Frechette - modified by Mike Foster
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xRemoveClass(e, c)
{
  if(!(e=xGetElementById(e))) return false;
  e.className = e.className.replace(new RegExp("(^|\\s)"+c+"(\\s|$)",'g'),
    function(str, p1, p2) { return (p1 == ' ' && p2 == ' ') ? ' ' : ''; }
  );
  return true;
}
// xRemoveEventListener r6, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xRemoveEventListener(e,eT,eL,cap)
{
  if(!(e=xGetElementById(e)))return;
  eT=eT.toLowerCase();
  if(e.removeEventListener)e.removeEventListener(eT,eL,cap||false);
  else if(e.detachEvent)e.detachEvent('on'+eT,eL);
  else e['on'+eT]=null;
}
// xResizeTo r2, Copyright 2001-2009 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xResizeTo(e, w, h)
{
  return {
    w: xWidth(e, w),
    h: xHeight(e, h)
  };
}
// xScrollLeft r4, Copyright 2001-2009 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xScrollLeft(e, bWin)
{
  var w, offset=0;
  if (!xDef(e) || bWin || e == document || e.tagName.toLowerCase() == 'html' || e.tagName.toLowerCase() == 'body') {
    w = window;
    if (bWin && e) w = e;
    if(w.document.documentElement && w.document.documentElement.scrollLeft) offset=w.document.documentElement.scrollLeft;
    else if(w.document.body && xDef(w.document.body.scrollLeft)) offset=w.document.body.scrollLeft;
  }
  else {
    e = xGetElementById(e);
    if (e && xNum(e.scrollLeft)) offset = e.scrollLeft;
  }
  return offset;
}
// xScrollTop r4, Copyright 2001-2009 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xScrollTop(e, bWin)
{
  var w, offset=0;
  if (!xDef(e) || bWin || e == document || e.tagName.toLowerCase() == 'html' || e.tagName.toLowerCase() == 'body') {
    w = window;
    if (bWin && e) w = e;
    if(w.document.documentElement && w.document.documentElement.scrollTop) offset=w.document.documentElement.scrollTop;
    else if(w.document.body && xDef(w.document.body.scrollTop)) offset=w.document.body.scrollTop;
  }
  else {
    e = xGetElementById(e);
    if (e && xNum(e.scrollTop)) offset = e.scrollTop;
  }
  return offset;
}
// xShow r3, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL

function xShow(e) {return xVisibility(e,1);}
// xSlideTo r3, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xSlideTo(e, x, y, uTime)
{
  if (!(e=xGetElementById(e))) return;
  if (!e.timeout) e.timeout = 25;
  e.xTarget = x; e.yTarget = y; e.slideTime = uTime; e.stop = false;
  e.yA = e.yTarget - xTop(e); e.xA = e.xTarget - xLeft(e); // A = distance
  if (e.slideLinear) e.B = 1/e.slideTime;
  else e.B = Math.PI / (2 * e.slideTime); // B = period
  e.yD = xTop(e); e.xD = xLeft(e); // D = initial position
  var d = new Date(); e.C = d.getTime();
  if (!e.moving) _xSlideTo(e);
}
function _xSlideTo(e)
{
  if (!(e=xGetElementById(e))) return;
  var now, s, t, newY, newX;
  now = new Date();
  t = now.getTime() - e.C;
  if (e.stop) { e.moving = false; }
  else if (t < e.slideTime) {
    setTimeout("_xSlideTo('"+e.id+"')", e.timeout);

    s = e.B * t;
    if (!e.slideLinear) s = Math.sin(s);
//    if (e.slideLinear) s = e.B * t;
//    else s = Math.sin(e.B * t);

    newX = Math.round(e.xA * s + e.xD);
    newY = Math.round(e.yA * s + e.yD);
    xMoveTo(e, newX, newY);
    e.moving = true;
  }  
  else {
    xMoveTo(e, e.xTarget, e.yTarget);
    e.moving = false;
    if (e.onslideend) e.onslideend();
  }  
}

// xStopPropagation r1, Copyright 2004-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xStopPropagation(evt)
{
  if (evt && evt.stopPropagation) evt.stopPropagation();
  else if (window.event) window.event.cancelBubble = true;
}
// xStr r1, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xStr(s)
{
  for(var i=0; i<arguments.length; ++i){if(typeof(arguments[i])!='string') return false;}
  return true;
}
// xStyle r1, Copyright 2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xStyle(sProp, sVal)
{
  var i, e;
  for (i = 2; i < arguments.length; ++i) {
    e = xGetElementById(arguments[i]);
    if (e.style) {
      try { e.style[sProp] = sVal; }
      catch (err) { e.style[sProp] = ''; } // ???
    }
  }
}
// xToggleClass r2, Copyright 2005-2007 Daniel Frechette
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
/* Added by DF, 2005-10-11
 * Toggles a class name on or off for an element
 */
function xToggleClass(e, c) {
  if (!(e = xGetElementById(e)))
    return null;
  if (!xRemoveClass(e, c) && !xAddClass(e, c))
    return false;
  return true;
}
// xTop r2, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xTop(e, iY)
{
  if(!(e=xGetElementById(e))) return 0;
  var css=xDef(e.style);
  if(css && xStr(e.style.top)) {
    if(xNum(iY)) e.style.top=iY+'px';
    else {
      iY=parseInt(e.style.top);
      if(isNaN(iY)) iY=xGetComputedStyle(e,'top',1);
      if(isNaN(iY)) iY=0;
    }
  }
  else if(css && xDef(e.style.pixelTop)) {
    if(xNum(iY)) e.style.pixelTop=iY;
    else iY=e.style.pixelTop;
  }
  return iY;
}
// xTraverseDocumentStyleSheets r1, Copyright 2006-2007 Ivan Pepelnjak (www.zaplana.net)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
// xTraverseDocumentStyleSheets(callback)
//   traverses all stylesheets attached to a document (linked as well as internal)
function xTraverseDocumentStyleSheets(cb) {
  var ssList = document.styleSheets; if (!ssList) return undefined;

  for (i = 0; i < ssList.length; i++) {
    var ss = ssList[i] ; if (! ss) continue;
    if (xTraverseStyleSheet(ss,cb)) return true;
  }
  return false;
}
// xTraverseStyleSheet r1, Copyright 2006-2007 Ivan Pepelnjak (www.zaplana.net)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
// xTraverseStyleSheet (stylesheet, callback)
//   traverses all rules in the stylesheet, calling callback function on each rule.
//   recursively handles stylesheets imported with @import CSS directive
//   stops when the callback function returns true (it has found what it's been looking for)
//
// returns:
//   undefined - problems with CSS-related objects
//   true      - callback function returned true at least once
//   false     - callback function always returned false
function xTraverseStyleSheet(ss,cb) {
  if (!ss) return false;
  var rls = xGetCSSRules(ss) ; if (!rls) return undefined ;
  var result;

  for (var j = 0; j < rls.length; j++) {
    var cr = rls[j];
    if (cr.selectorText) { result = cb(cr); if (result) return true; }
    if (cr.type && cr.type == 3 && cr.styleSheet) xTraverseStyleSheet(cr.styleSheet,cb);
  }
  if (ss.imports) {
    for (var j = 0 ; j < ss.imports.length; j++) {
      if (xTraverseStyleSheet(ss.imports[j],cb)) return true;
    }
  }
  return false;
}
// xVisibility r1, Copyright 2003-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xVisibility(e, bShow)
{
  if(!(e=xGetElementById(e))) return null;
  if(e.style && xDef(e.style.visibility)) {
    if (xDef(bShow)) e.style.visibility = bShow ? 'visible' : 'hidden';
    return e.style.visibility;
  }
  return null;
}
//function xVisibility(e,s)
//{
//  if(!(e=xGetElementById(e))) return null;
//  var v = 'visible', h = 'hidden';
//  if(e.style && xDef(e.style.visibility)) {
//    if (xDef(s)) {
//      // try to maintain backwards compatibility (???)
//      if (xStr(s)) e.style.visibility = s;
//      else e.style.visibility = s ? v : h;
//    }
//    return e.style.visibility;
//    // or...
//    // if (e.style.visibility.length) return e.style.visibility;
//    // else return xGetComputedStyle(e, 'visibility');
//  }
//  else if (xDef(e.visibility)) { // NN4
//    if (xDef(s)) {
//      // try to maintain backwards compatibility
//      if (xStr(s)) e.visibility = (s == v) ? 'show' : 'hide';
//      else e.visibility = s ? v : h;
//    }
//    return (e.visibility == 'show') ? v : h;
//  }
//  return null;
//}
// xWalkToFirst r1, Copyright 2005-2007 Olivier Spinelli
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xWalkToFirst( oNode, fnVisit, skip, data )
{
  var r = null;
  while(oNode)
  {
    if(oNode.nodeType==1&&oNode!=skip){r=fnVisit(oNode,data);if(r)return r;}
    var n=oNode;
    while(n=n.previousSibling){if(n!=skip){r=xWalkTreeRev(n,fnVisit,skip,data);if(r)return r;}}
    oNode=oNode.parentNode;
  }
  return r;
}
// xWalkToLast r1, Copyright 2005-2007 Olivier Spinelli
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xWalkToLast( oNode, fnVisit, skip, data )
{
  var r = null;
  if( oNode )
  {
    r=xWalkTree2(oNode,fnVisit,skip,data);if(r)return r;
    while(oNode)
    {
      var n=oNode;
      while(n=n.nextSibling){if(n!=skip){r=xWalkTree2(n,fnVisit,skip,data);if(r)return r;}}
      oNode=oNode.parentNode;
    }
  }
  return r;
}
// xWalkTree2 r1, Copyright 2005-2007 Olivier Spinelli
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
// My humble contribution to the great cross-browser xLibrary file x_dom.js
//
// This function is compatible with Mike's but adds:
// - 'fnVisit' can return a non null object to stop the walk. This result will be returned to caller.
// See function xFindAfterByClassName below: it uses it.
// - 'fnVisit' accept one optional 'data' parameter
// - 'skip' is an optional element that will be ignored during traversal. It is often useful to skip
// the starting node: when skip == oNode, 'fnVisit' is not called but, of course, child are processed.
function xWalkTree2( oNode, fnVisit, skip, data )
{
  var r=null;
  if(oNode){if(oNode.nodeType==1&&oNode!=skip){r=fnVisit(oNode,data);if(r)return r;}
  for(var c=oNode.firstChild;c;c=c.nextSibling){if(c!=skip)r  =xWalkTree2(c,fnVisit,skip,data);if(r)return r;}}
  return r;
}
// xWalkTreeRev r2, Copyright 2005-2007 Olivier Spinelli
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
// Same as xWalkTree2 except that traversal is reversed (last to first child).
function xWalkTreeRev( oNode, fnVisit, skip, data )
{
  var r=null;
  if(oNode){if(oNode.nodeType==1&&oNode!=skip){r=fnVisit(oNode,data);if(r)return r;}
  for(var c=oNode.lastChild;c;c=c.previousSibling){if(c!=skip)r=xWalkTreeRev(c,fnVisit,skip,data);if(r)return r;}}
  return r;
}
// xWidth r7, Copyright 2001-2009 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xWidth(e,w)
{
  var css, pl=0, pr=0, bl=0, br=0, gcs;
  if(!(e=xGetElementById(e))) return 0;
  if (xNum(w)) {
    if (w<0) w = 0;
    else w=Math.round(w);
  }
  else w=-1;
  css=xDef(e.style);
  if (e == document || e.tagName.toLowerCase() == 'html' || e.tagName.toLowerCase() == 'body') {
    w = xClientWidth();
  }
  else if(css && xDef(e.offsetWidth) && xStr(e.style.width)) {
    if(w>=0) {
      if (document.compatMode=='CSS1Compat') {
        gcs = xGetComputedStyle;
        pl=gcs(e,'padding-left',1);
        if (pl !== null) {
          pr=gcs(e,'padding-right',1);
          bl=gcs(e,'border-left-width',1);
          br=gcs(e,'border-right-width',1);
        }
        // Should we try this as a last resort?
        // At this point getComputedStyle and currentStyle do not exist.
        else if(xDef(e.offsetWidth,e.style.width)){
          e.style.width=w+'px';
          pl=e.offsetWidth-w;
        }
      }
      w-=(pl+pr+bl+br);
      if(isNaN(w)||w<0) return;
      else e.style.width=w+'px';
    }
    w=e.offsetWidth;
  }
  else if(css && xDef(e.style.pixelWidth)) {
    if(w>=0) e.style.pixelWidth=w;
    w=e.style.pixelWidth;
  }
  return w;
}
// xZIndex r1, Copyright 2001-2007 Michael Foster (Cross-Browser.com)
// Part of X, a Cross-Browser Javascript Library, Distributed under the terms of the GNU LGPL
function xZIndex(e,uZ)
{
  if(!(e=xGetElementById(e))) return 0;
  if(e.style && xDef(e.style.zIndex)) {
    if(xNum(uZ)) e.style.zIndex=uZ;
    uZ=parseInt(e.style.zIndex);
  }
  return uZ;
}

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}

function html_entity_decode (string, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: john (http://www.jd-tech.net)
    // +      input by: ger
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: marc andreu
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Ratheous
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Nick Kolosov (http://sammy.ru)
    // +   bugfixed by: Fox
    // -    depends on: get_html_translation_table
    // *     example 1: html_entity_decode('Kevin &amp; van Zonneveld');
    // *     returns 1: 'Kevin & van Zonneveld'
    // *     example 2: html_entity_decode('&amp;lt;');
    // *     returns 2: '&lt;'

    var hash_map = {}, symbol = '', tmp_str = '', entity = '';
    tmp_str = string.toString();
    
    if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
        return false;
    }

    // fix &amp; problem
    // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
    delete(hash_map['&']);
    hash_map['&'] = '&amp;';

    for (symbol in hash_map) {
        entity = hash_map[symbol];
        tmp_str = tmp_str.split(entity).join(symbol);
    }
    tmp_str = tmp_str.split('&#039;').join("'");
    
    return tmp_str;
}

function htmlspecialchars (string, quote_style, charset, double_encode) {
    // http://kevin.vanzonneveld.net
    // +   original by: Mirek Slugen
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Nathan
    // +   bugfixed by: Arno
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // +      input by: Mailfaker (http://www.weedem.fr/)
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +      input by: felix
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: charset argument not supported
    // *     example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
    // *     returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
    // *     example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
    // *     returns 2: 'ab"c&#039;d'
    // *     example 3: htmlspecialchars("my "&entity;" is still here", null, null, false);
    // *     returns 3: 'my &quot;&entity;&quot; is still here'

    var optTemp = 0, i = 0, noquotes= false;
    if (typeof quote_style === 'undefined' || quote_style === null) {
        quote_style = 2;
    }
    string = string.toString();
    if (double_encode !== false) { // Put this first to avoid double-encoding
        string = string.replace(/&/g, '&amp;');
    }
    string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE' : 1,
        'ENT_HTML_QUOTE_DOUBLE' : 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE' : 4
    };
    if (quote_style === 0) {
        noquotes = true;
    }
    if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (i=0; i < quote_style.length; i++) {
            // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
            if (OPTS[quote_style[i]] === 0) {
                noquotes = true;
            }
            else if (OPTS[quote_style[i]]) {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/'/g, '&#039;');
    }
    if (!noquotes) {
        string = string.replace(/"/g, '&quot;');
    }

    return string;
}

function get_html_translation_table (table, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: noname
    // +   bugfixed by: Alex
    // +   bugfixed by: Marco
    // +   bugfixed by: madipta
    // +   improved by: KELAN
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Frank Forte
    // +   bugfixed by: T.Wild
    // +      input by: Ratheous
    // %          note: It has been decided that we're not going to add global
    // %          note: dependencies to php.js, meaning the constants are not
    // %          note: real constants, but strings instead. Integers are also supported if someone
    // %          note: chooses to create the constants themselves.
    // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
    // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
    
    var entities = {}, hash_map = {}, decimal = 0, symbol = '';
    var constMappingTable = {}, constMappingQuoteStyle = {};
    var useTable = {}, useQuoteStyle = {};
    
    // Translate arguments
    constMappingTable[0]      = 'HTML_SPECIALCHARS';
    constMappingTable[1]      = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';

    useTable       = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
        throw new Error("Table: "+useTable+' not supported');
        // return false;
    }

    entities['38'] = '&amp;';
    if (useTable === 'HTML_ENTITIES') {
        entities['160'] = '&nbsp;';
        entities['161'] = '&iexcl;';
        entities['162'] = '&cent;';
        entities['163'] = '&pound;';
        entities['164'] = '&curren;';
        entities['165'] = '&yen;';
        entities['166'] = '&brvbar;';
        entities['167'] = '&sect;';
        entities['168'] = '&uml;';
        entities['169'] = '&copy;';
        entities['170'] = '&ordf;';
        entities['171'] = '&laquo;';
        entities['172'] = '&not;';
        entities['173'] = '&shy;';
        entities['174'] = '&reg;';
        entities['175'] = '&macr;';
        entities['176'] = '&deg;';
        entities['177'] = '&plusmn;';
        entities['178'] = '&sup2;';
        entities['179'] = '&sup3;';
        entities['180'] = '&acute;';
        entities['181'] = '&micro;';
        entities['182'] = '&para;';
        entities['183'] = '&middot;';
        entities['184'] = '&cedil;';
        entities['185'] = '&sup1;';
        entities['186'] = '&ordm;';
        entities['187'] = '&raquo;';
        entities['188'] = '&frac14;';
        entities['189'] = '&frac12;';
        entities['190'] = '&frac34;';
        entities['191'] = '&iquest;';
        entities['192'] = '&Agrave;';
        entities['193'] = '&Aacute;';
        entities['194'] = '&Acirc;';
        entities['195'] = '&Atilde;';
        entities['196'] = '&Auml;';
        entities['197'] = '&Aring;';
        entities['198'] = '&AElig;';
        entities['199'] = '&Ccedil;';
        entities['200'] = '&Egrave;';
        entities['201'] = '&Eacute;';
        entities['202'] = '&Ecirc;';
        entities['203'] = '&Euml;';
        entities['204'] = '&Igrave;';
        entities['205'] = '&Iacute;';
        entities['206'] = '&Icirc;';
        entities['207'] = '&Iuml;';
        entities['208'] = '&ETH;';
        entities['209'] = '&Ntilde;';
        entities['210'] = '&Ograve;';
        entities['211'] = '&Oacute;';
        entities['212'] = '&Ocirc;';
        entities['213'] = '&Otilde;';
        entities['214'] = '&Ouml;';
        entities['215'] = '&times;';
        entities['216'] = '&Oslash;';
        entities['217'] = '&Ugrave;';
        entities['218'] = '&Uacute;';
        entities['219'] = '&Ucirc;';
        entities['220'] = '&Uuml;';
        entities['221'] = '&Yacute;';
        entities['222'] = '&THORN;';
        entities['223'] = '&szlig;';
        entities['224'] = '&agrave;';
        entities['225'] = '&aacute;';
        entities['226'] = '&acirc;';
        entities['227'] = '&atilde;';
        entities['228'] = '&auml;';
        entities['229'] = '&aring;';
        entities['230'] = '&aelig;';
        entities['231'] = '&ccedil;';
        entities['232'] = '&egrave;';
        entities['233'] = '&eacute;';
        entities['234'] = '&ecirc;';
        entities['235'] = '&euml;';
        entities['236'] = '&igrave;';
        entities['237'] = '&iacute;';
        entities['238'] = '&icirc;';
        entities['239'] = '&iuml;';
        entities['240'] = '&eth;';
        entities['241'] = '&ntilde;';
        entities['242'] = '&ograve;';
        entities['243'] = '&oacute;';
        entities['244'] = '&ocirc;';
        entities['245'] = '&otilde;';
        entities['246'] = '&ouml;';
        entities['247'] = '&divide;';
        entities['248'] = '&oslash;';
        entities['249'] = '&ugrave;';
        entities['250'] = '&uacute;';
        entities['251'] = '&ucirc;';
        entities['252'] = '&uuml;';
        entities['253'] = '&yacute;';
        entities['254'] = '&thorn;';
        entities['255'] = '&yuml;';
    }

    if (useQuoteStyle !== 'ENT_NOQUOTES') {
        entities['34'] = '&quot;';
    }
    if (useQuoteStyle === 'ENT_QUOTES') {
        entities['39'] = '&#39;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';


    // ascii decimals to real symbols
    for (decimal in entities) {
        symbol = String.fromCharCode(decimal);
        hash_map[symbol] = entities[decimal];
    }
    
    return hash_map;
}

function md5 (str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // + namespaced by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: md5('Kevin van Zonneveld');
    // *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

    var xl;

    var rotateLeft = function (lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    };

    var addUnsigned = function (lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var _F = function (x,y,z) { return (x & y) | ((~x) & z); };
    var _G = function (x,y,z) { return (x & z) | (y & (~z)); };
    var _H = function (x,y,z) { return (x ^ y ^ z); };
    var _I = function (x,y,z) { return (y ^ (x | (~z))); };

    var _FF = function (a,b,c,d,x,s,ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _GG = function (a,b,c,d,x,s,ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _HH = function (a,b,c,d,x,s,ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _II = function (a,b,c,d,x,s,ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function (str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=new Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };

    var wordToHex = function (lValue) {
        var wordToHexValue="",wordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length-2,2);
        }
        return wordToHexValue;
    };

    var x=[],
        k,AA,BB,CC,DD,a,b,c,d,
        S11=7, S12=12, S13=17, S14=22,
        S21=5, S22=9 , S23=14, S24=20,
        S31=4, S32=11, S33=16, S34=23,
        S41=6, S42=10, S43=15, S44=21;

    str = this.utf8_encode(str);
    x = convertToWordArray(str);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    
    xl = x.length;
    for (k=0;k<xl;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=_FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=_FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=_FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=_FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=_FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=_FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=_FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=_FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=_GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=_GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=_HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=_HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=_II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=_II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=_II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=_II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=_II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=_II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=_II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=_II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=addUnsigned(a,AA);
        b=addUnsigned(b,BB);
        c=addUnsigned(c,CC);
        d=addUnsigned(d,DD);
    }

    var temp = wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d);

    return temp.toLowerCase();
}

function utf8_encode ( argString ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    var string = (argString+''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    var utftext = "";
    var start, end;
    var stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n+1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
}

/*
Copyright (c) Copyright (c) 2007, Carl S. Yestrau All rights reserved.
Code licensed under the BSD License: http://www.featureblend.com/license.txt
Version: 1.0.4
*/
var FlashDetect = new function(){
    var self = this;
    self.installed = false;
    self.raw = "";
    self.major = -1;
    self.minor = -1;
    self.revision = -1;
    self.revisionStr = "";
    var activeXDetectRules = [
        {
            "name":"ShockwaveFlash.ShockwaveFlash.7",
            "version":function(obj){
                return getActiveXVersion(obj);
            }
        },
        {
            "name":"ShockwaveFlash.ShockwaveFlash.6",
            "version":function(obj){
                var version = "6,0,21";
                try{
                    obj.AllowScriptAccess = "always";
                    version = getActiveXVersion(obj);
                }catch(err){}
                return version;
            }
        },
        {
            "name":"ShockwaveFlash.ShockwaveFlash",
            "version":function(obj){
                return getActiveXVersion(obj);
            }
        }
    ];
    /**
     * Extract the ActiveX version of the plugin.
     * 
     * @param {Object} The flash ActiveX object.
     */
    var getActiveXVersion = function(activeXObj){
        var version = -1;
        try{
            version = activeXObj.GetVariable("$version");
        }catch(err){}
        return version;
    };
    /**
     * Try and retrieve an ActiveX object having a specified name.
     * 
     * @param {String} name The ActiveX object name lookup.
     * @return One of ActiveX object or a simple object having an attribute of activeXError with a value of true.
     */
    var getActiveXObject = function(name){
        var obj = -1;
        try{
            obj = new ActiveXObject(name);
        }catch(err){
            obj = {activeXError:true};
        }
        return obj;
    };
    /**
     * Parse an ActiveX $version string into an object.
     * 
     * @param {String} str The ActiveX Object GetVariable($version) return value. 
     * @return An object having raw, major, minor, revision and revisionStr attributes.
     */
    var parseActiveXVersion = function(str){
        var versionArray = str.split(",");//replace with regex
        return {
            "raw":str,
            "major":parseInt(versionArray[0].split(" ")[1], 10),
            "minor":parseInt(versionArray[1], 10),
            "revision":parseInt(versionArray[2], 10),
            "revisionStr":versionArray[2]
        };
    };
    /**
     * Parse a standard enabledPlugin.description into an object.
     * 
     * @param {String} str The enabledPlugin.description value.
     * @return An object having raw, major, minor, revision and revisionStr attributes.
     */
    var parseStandardVersion = function(str){
        var descParts = str.split(/ +/);
        var majorMinor = descParts[2].split(/\./);
        var revisionStr = descParts[3];
        return {
            "raw":str,
            "major":parseInt(majorMinor[0], 10),
            "minor":parseInt(majorMinor[1], 10), 
            "revisionStr":revisionStr,
            "revision":parseRevisionStrToInt(revisionStr)
        };
    };
    /**
     * Parse the plugin revision string into an integer.
     * 
     * @param {String} The revision in string format.
     */
    var parseRevisionStrToInt = function(str){
        return parseInt(str.replace(/[a-zA-Z]/g, ""), 10) || self.revision;
    };
    /**
     * Is the major version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required major version.
     */
    self.majorAtLeast = function(version){
        return self.major >= version;
    };
    /**
     * Is the minor version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required minor version.
     */
    self.minorAtLeast = function(version){
        return self.minor >= version;
    };
    /**
     * Is the revision version greater than or equal to a specified version.
     * 
     * @param {Number} version The minimum required revision version.
     */
    self.revisionAtLeast = function(version){
        return self.revision >= version;
    };
    /**
     * Is the version greater than or equal to a specified major, minor and revision.
     * 
     * @param {Number} major The minimum required major version.
     */
    self.versionAtLeast = function(major){
        var properties = [self.major, self.minor, self.revision];
        var len = Math.min(properties.length, arguments.length);
        for(i=0; i<len; i++){
            if(properties[i]>=arguments[i]){
                if(i+1<len && properties[i]==arguments[i]){
                    continue;
                }else{
                    return true;
                }
            }else{
                return false;
            }
        }
    };
    /**
     * Constructor, sets raw, major, minor, revisionStr, revision and installed public properties.
     */
    self.FlashDetect = function(){
        if(navigator.plugins && navigator.plugins.length>0){
            var type = 'application/x-shockwave-flash';
            var mimeTypes = navigator.mimeTypes;
            if(mimeTypes && mimeTypes[type] && mimeTypes[type].enabledPlugin && mimeTypes[type].enabledPlugin.description){
                var version = mimeTypes[type].enabledPlugin.description;
                var versionObj = parseStandardVersion(version);
                self.raw = versionObj.raw;
                self.major = versionObj.major;
                self.minor = versionObj.minor; 
                self.revisionStr = versionObj.revisionStr;
                self.revision = versionObj.revision;
                self.installed = true;
            }
        }else if(navigator.appVersion.indexOf("Mac")==-1 && window.execScript){
            var version = -1;
            for(var i=0; i<activeXDetectRules.length && version==-1; i++){
                var obj = getActiveXObject(activeXDetectRules[i].name);
                if(!obj.activeXError){
                    self.installed = true;
                    version = activeXDetectRules[i].version(obj);
                    if(version!=-1){
                        var versionObj = parseActiveXVersion(version);
                        self.raw = versionObj.raw;
                        self.major = versionObj.major;
                        self.minor = versionObj.minor; 
                        self.revision = versionObj.revision;
                        self.revisionStr = versionObj.revisionStr;
                    }
                }
            }
        }
    }();
};
FlashDetect.JS_RELEASE = "1.0.4";