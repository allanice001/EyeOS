//eyeSnow 1.0
//(c) 2007 Jose Carlos Norte
//http://www.eyeideas.es

//this script uses the X javascript kit, from http://cross-browser.com 
numberSnow = 5;
snowInterval = 5;
snowPrefix = 'index.php?extern=apps/eyeSnow/';
speed = 1;

drawSnow();
setInterval("drawSnow()",snowInterval*1000);

function drawSnow() {
	var i;
	for(i=0;i<numberSnow;i++) {
		drawFloc();
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
	var tSpeed = speed + Math.round(3*Math.random())
	goPos(myFloc.id,myH-25,tSpeed);
}

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


function xClientHeight()
{
  var v=0,d=document,w=window;
  if((!d.compatMode || d.compatMode == 'CSS1Compat') && !w.opera && d.documentElement && d.documentElement.clientHeight)
    {v=d.documentElement.clientHeight;}
  else if(d.body && d.body.clientHeight)
    {v=d.body.clientHeight;}
  else if(xDef(w.innerWidth,w.innerHeight,d.width)) {
    v=w.innerHeight;
    if(d.width>w.innerWidth) v-=16;
  }
  return v;
}
function xClientWidth()
{
  var v=0,d=document,w=window;
  if((!d.compatMode || d.compatMode == 'CSS1Compat') && !w.opera && d.documentElement && d.documentElement.clientWidth)
    {v=d.documentElement.clientWidth;}
  else if(d.body && d.body.clientWidth)
    {v=d.body.clientWidth;}
  else if(xDef(w.innerWidth,w.innerHeight,d.height)) {
    v=w.innerWidth;
    if(d.height>w.innerHeight) v-=16;
  }
  return v;
}
function xDef()
{
  for(var i=0; i<arguments.length; ++i){if(typeof(arguments[i])=='undefined') return false;}
  return true;
}
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

function xGetElementById(e)
{
  if(typeof(e)=='string') {
    if(document.getElementById) e=document.getElementById(e);
    else if(document.all) e=document.all[e];
    else e=null;
  }
  return e;
}
function xMoveTo(e,x,y)
{
  xLeft(e,x);
  xTop(e,y);
}
function xNum()
{
  for(var i=0; i<arguments.length; ++i){if(isNaN(arguments[i]) || typeof(arguments[i])!='number') return false;}
  return true;
}

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

function xStr(s)
{
  for(var i=0; i<arguments.length; ++i){if(typeof(arguments[i])!='string') return false;}
  return true;
}

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
