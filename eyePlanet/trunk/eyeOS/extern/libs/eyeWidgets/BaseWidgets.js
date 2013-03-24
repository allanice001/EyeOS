/*
                                  ____   _____ 
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___  
                 / _ \ | | |/ _ \ |  | |\___ \ 
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/ 
                       __/ |                   
                      |___/   eyePlanet, based on eyeOS 1.2

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - eyeOS.org/whoarewe

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2008 eyeOS Team (team@eyeos.org)         
*/ 

function Line_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var mywidth = params['width'];
	var myheight = params['height'];
	var visible = params['visible'];
	
	var myLine = document.createElement('div');
	myLine.setAttribute('id',name);
	myLine.style.width = mywidth+'px';
	myLine.style.height = myheight+'px';
	myLine.style.backgroundColor = '#dddddd';
	createWidget(name+'_Container',father,myLine,horiz,vert,x,y,-1,-1,'eyeLineContainer',cent);
}

function Simplebox_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var myheight = params["height"];
	var mywidth = params["width"];
	
	var divBox = document.createElement('div');		
	divBox.setAttribute('id',name);
	divBox.style.width = mywidth+'px';
	divBox.style.height = myheight+'px';

	if(params["border"] == 1){
		createWidget(name+'_Container',father,divBox,horiz,vert,x,y,-1,-1,"eyeSimplebox",cent);
	}else{
		createWidget(name+'_Container',father,divBox,horiz,vert,x,y,-1,-1,"eyeSimpleboxNoBorder",cent);
	}
}
function Button_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var caption = params["caption"];
	var enabled = params["enabled"];
	var visible = params["visible"];
	var sync = params["sync"];
	var dis = params["disablemsg"];
	var sig = params["signal"];
	var myWidth = params["width"];
	var myHeight = params["height"];
	var myImg = params["img"];
	var myTop = params["imgY"];
	var myLeft = parseInt(params["imgX"]);
	var forceMsg = params["forceMsg"];
	myLeft = myLeft + 5;

	var myContainer = document.createElement('div');
	myContainer.setAttribute('id',name+'_GlobalContainer');
	if (myImg != "") {
		var myButton = document.createElement('img');
		myButton.src=myImg;
		var myContent = document.createElement('div');
		myContent.innerHTML = caption;
		myContent.setAttribute('id',name+'_cpt');
		myContent.style.position = 'absolute';
	} else {
		var myButton = document.createElement('button');
		caption = entityDecode(caption);
		theText=document.createTextNode(caption);
		myButton.appendChild(theText);
	}

	if(enabled == 0) {
		myButton.disabled=1;
	}
	
	if(myWidth > 0) {
		if(myImg != "") {
			myContainer.style.width = myWidth;
		} else {
			myButton.style.width = myWidth;
		}
	} 
	
	if(myHeight > 0) {
		if(myImg != "") {
			myContainer.style.height = myHeight;
		} else {
			myButton.style.height = myHeight;
		}
	}
	
	if(myImg != "") {
		myContent.style.top = '2px';
		myContent.style.left = myLeft+'px';
		myContainer.style.cursor = 'Pointer';
	} else {
		myButton.className = "eyeButtonClass";
	}

	if(visible == 0) {
		myButton.style.visibility = 'hidden';
	}
	if(dis == 0) {
		if(forceMsg == 0){
			myContainer.onclick = function(){sendMsg(checknum,sig,eval(sync))};				
		}else{
			var myParam = eyeParam(sig,forceMsg);
			myContainer.onclick = function(){sendMsg(checknum,sig,myParam)};				
		}
	}
	myButton.setAttribute('id',name);
	myContainer.appendChild(myButton);
	if(myContent) {
		myContainer.appendChild(myContent);
	}
	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,myWidth,myHeight,"eyeButton",cent);
}

function Container_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var myheight = parseInt(params["height"]);
	var mywidth = parseInt(params["width"]);
	var unit = params["unit"];
	var cssClass = params["cssClass"];

	var myContainer = document.createElement("div");
	if(myheight > 0) {
		myContainer.style.height = myheight + unit;
	}
	if(mywidth > 0){
		myContainer.style.width = mywidth + unit;
	}
	myContainer.setAttribute('id',name);
	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,-1,-1,cssClass,cent,unit);
}
function Hidden_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var text = params["text"];

	var myHidden = document.createElement('input');
	myHidden.setAttribute('type','hidden');
	
	if(text) {
		myHidden.value = text;
	}
	
	myHidden.setAttribute('id',name);
	myHidden.className = 'eyeHidden';
	
	createWidget(name+'_Container',father,myHidden,horiz,vert,x,y,-1,-1,"eyeTextboxContainer",cent);
}
function Iframe_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var url = params["url"];
	var myheight = params["height"];
	var mywidth = params["width"];
	var scroll = params["scroll"];
	
	var myFrame = document.createElement('iframe');
	myFrame.setAttribute('id',name);
	myFrame.setAttribute('src',url);
	myFrame.setAttribute('width',mywidth);
	myFrame.setAttribute('height',myheight);
	myFrame.style.border='0px solid black';
	myFrame.frameBorder='no';
	if(scroll == 0) {
		myFrame.setAttribute('scrolling','no');
	}
	createWidget(name+'_Container',father,myFrame,horiz,vert,x,y,-1,-1,"eyeIframe",cent);
}
function Imagebox_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var url = params["url"];
	var visible = params["visible"];
	var alt = params["alt"];
	var myWidth = params["width"];
	var myHeight = params["height"];
	var myClass = params["cssClass"];
	var sig = params["signal"];
	var sync = params["sync"];
	var dis = params["disableMsg"];

	var myImage = document.createElement('img');
	myImage.src=url;
	myImage.setAttribute('alt',alt);
	if(myWidth > 0) { 
		myImage.setAttribute('width',myWidth);
	}
	if(myHeight > 0) {
		myImage.setAttribute('height',myHeight);
	}

	myImage.setAttribute('id',name);
	
	if(dis == 0) {
		myImage.onclick = function(){sendMsg(checknum,sig,eval(sync))};
	}

	if(myClass != '') {
		createWidget(name+'_Container',father,myImage,horiz,vert,x,y,myWidth,myHeight,myClass,cent);
	} else {
		createWidget(name+'_Container',father,myImage,horiz,vert,x,y,myWidth,myHeight,"eyeImagebox",cent);
	}
	
	if (visible == 0) {
		var container = document.getElementById(name+'_Container');
		container.style.visibility = 'hidden';
	}
}
function Label_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var text = params["text"];
	var visible = params["visible"];
	var sync = params["sync"];
	var dis = params["disablemsg"];
	var sig = params["signal"];
	var cssClass = params["cssClass"];
	
	var myLabel = document.createElement('div');
	myLabel.setAttribute('id',name);
	if (visible == 0) {
		myLabel.style.visibility='hidden';
	} 
	if(dis == 0) {
		myLabel.onclick = function() {sendMsg(checknum,sig,eyeParam(name,text)+eval(sync))};
	}

	text = entityDecode(text);
	myLabel.appendChild(document.createTextNode(text));
	createWidget(name+'_Container',father,myLabel,horiz,vert,x,y,-1,-1,cssClass,cent);
}
function Textbox_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var text = entityDecode(params["text"]);
	var enabled = params["enabled"];
	var visible = params["visible"];
	var myPassword = params["password"];
	var mywidth = params["width"];
	var noborder = params["noborder"];

	var myTextbox = document.createElement('input');
	if(myPassword==1) {
		myTextbox.setAttribute('type','password');
	} else {
		myTextbox.setAttribute('type','text');
	}
	
	if(text) {
		myTextbox.value = text;
	}
	
	if(mywidth != "") {
		myTextbox.style.width = mywidth+'px';
	}
	if(visible == 0) {
		myTextbox.style.visibility = 'hidden';
	}

	if(enabled == 0) {
		myTextbox.setAttribute('disabled',1);
	}

	if(noborder == 1) {
		myTextbox.style.border = 0;
		myTextbox.style.backgroundColor = "transparent";
	}
	
	myTextbox.setAttribute('id',name);
	myTextbox.className = 'eyeTextbox';
	
	createWidget(name+'_Container',father,myTextbox,horiz,vert,x,y,-1,-1,"eyeTextboxContainer",cent);
}

function Toolbar_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var obj = document.getElementById(father);
	if(!obj) {
		return;
	}
	var myBar = document.createElement('div');
	myBar.setAttribute('id',name);
	myBar.className = 'blockbar';
	obj.appendChild(myBar);
}

function addLinkToBar(mibarra, itemName, text, href) {
	var obj = document.getElementById(mibarra);
        var container = document.createElement('div');
	var link = document.createElement('a');
	var first = false;
	try{
		obj.firstChild.nodeValue;
		first = false;
	}catch(err){
		first = true;
	}

	container.setAttribute('id',itemName+'_Container');
        container.className = 'blockbarItem';

	link.setAttribute('id',itemName+'_Link');
	link.setAttribute('href', href);
	link.className = 'blockbarText';
	link.innerHTML = text;

	if(first == false){
		var myText = document.createElement('div');
		myText.className = 'blockbarSeparator';
		myText.innerHTML = '|';
		obj.appendChild(myText);
	}

	container.appendChild(link);
	obj.appendChild(container);
}

function addItemToBar(mibarra,itemName,itemImg,itemText,sync,checknum) {
	var obj = document.getElementById(mibarra);
	var container = document.createElement('div');
	var myFriends = Base64.decode(sync);
	//checking if the item is the first.
	var first;
	try{
		obj.firstChild.nodeValue;
		first = false;
	}catch(err){	
		first = true;		
	}
	
	
	container.setAttribute('id',itemName+'_Container');
	container.className = 'blockbarItem';
	
	//if item don't is the first put a separator
	if(first == false){
		var myText = document.createElement('div');
		myText.className = 'blockbarSeparator';
		myText.innerHTML = '|';
		obj.appendChild(myText);		
	}
	
	if(myImg) {
		var myImg = document.createElement('img');
		myImg.setAttribute('id',itemName+'_img');
		myImg.className = 'blockbarImg';
		myImg.setAttribute('src',itemImg);
		container.appendChild(myImg);
	}
	
	var myText = document.createElement('div');
	myText.setAttribute('id',itemName+'_txt');
	myText.className = 'blockbarText';
	myText.innerHTML = itemText;
	container.appendChild(myText);
	container.onclick = function(){sendMsg(checknum,itemName,eval(myFriends))};
		
	obj.appendChild(container);
}

function Select_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var visible = params["visible"];
	var mywidth = params["width"];
	var enabled = params["params"];
	var mySelect = document.createElement("select");
	
	if(enabled == 0) {
		mySelect.disabled = 1;
	}
	
	if(visible == 0) {
		mySelect.style.visibility = 'hidden';
	}	
	
	if(mywidth > 0) {
		mySelect.style.width = mywidth+'px';	
	}
	mySelect.setAttribute('id',name);
	mySelect.className = 'eyeSelect';
	createWidget(name+'_Container',father,mySelect,horiz,vert,x,y,-1,-1,"",cent);
}