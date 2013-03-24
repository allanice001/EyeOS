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

focusWindow = '';
txtAreas = new Object();

function Box_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var myheight = params["height"];
	var mywidth = params["width"];
	var title = params["title"];
	var titleCss = params["titleCss"];
	var visible = params["visible"];
	var theText = document.createTextNode(title);

	var oTable = document.createElement("TABLE");
	var oTBody = document.createElement("TBODY");
	var myTitle = document.createElement("DIV");
	myTitle.className = titleCss;
	myTitle.setAttribute('id',name+'supText');
	myTitle.appendChild(theText);

	oTable.style.width = mywidth+'px';
	oTable.style.height = myheight+'px';
	oTable.border=0;
	oTable.cellpadding=0;
	oTable.cellspacing=0;
	oTable.className = 'eyeBoxTable';

	var oRow = document.createElement("TR");

	var oCell = document.createElement("TD");
	oCell.className = 'eyeBoxSupCent';
	oCell.appendChild(myTitle);
	oRow.appendChild(oCell);

	oTBody.appendChild(oRow);

	oCell = document.createElement("TD");
	oRow = document.createElement("TR");
	oCell.className='eyeBoxCent';
	oCell.width = '100%';
	oCell.setAttribute('id',name);
	oRow.appendChild(oCell);

	oTBody.appendChild(oRow);

	if (!IEversion || IEversion > 8) {
		oCell = document.createElement("TD");
		oRow = document.createElement("TR");
		oCell.className='eyeBoxBottCent';
		oCell.width = '100%';
		oRow.appendChild(oCell);
		oTBody.appendChild(oRow);
	}


	oTable.appendChild(oTBody);

	createWidget(name+'_Container',father,oTable,horiz,vert,x,y,-1,-1,"eyeBoxContainer",cent, 'px', visible,'Box');
}
function Line_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var mywidth = params['width'];
	var myheight = params['height'];
	var visible = params['visible'];

	var myLine = document.createElement('div');
	myLine.setAttribute('id',name);
	myLine.className = 'eyeLine';
	myLine.style.fontSize = '1px';
	myLine.style.width = mywidth+'px';
	myLine.style.height = myheight+'px';
	createWidget(name+'_Container',father,myLine,horiz,vert,x,y,-1,-1,'eyeLineContainer',cent,'px',visible,'Line');
}
function File_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var callback = params['callback'];
	var filename = params['filename'];
	var visible = params['visible'];
	var multiple = params['multiple'];
	var pid = params['pid'];
	var myIframe = document.createElement('iframe');

	if(multiple == 1){
		var withs = '300px';
		var height = '350px';
	}else{
		var withs = '250px';
		var height = '90px';
	}

	myIframe.setAttribute('id',name);
	myIframe.style.width = withs;
	myIframe.style.height = height;
	myIframe.style.border='none';
	myIframe.frameBorder='no';
	if(multiple == 1){
		myIframe.setAttribute('src','index.php?version='+EXTERN_CACHE_VERSION+'&extern=libs/eyeWidgets/getMultipleFile.eyecode&type=dynamic&params[]='+checknum+'&params[]='+callback+'&params[]='+filename+'&params[]='+pid)
	}else{
		myIframe.setAttribute('src','index.php?version='+EXTERN_CACHE_VERSION+'&extern=libs/eyeWidgets/getFile.eyecode&type=dynamic&params[]='+checknum+'&params[]='+callback+'&params[]='+filename+'&params[]='+pid)
	}
	createWidget(name+'_Container',father,myIframe,horiz,vert,x,y,-1,-1,'eyeLineContainer',cent,'px',visible,'File');
}
function Simplebox_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var myheight = params["height"];
	var mywidth = params["width"];
	var visible = params["visible"];

	var divBox = document.createElement('div');
	divBox.setAttribute('id',name);
	divBox.style.width = mywidth+'px';
	divBox.style.height = myheight+'px';

	if(params["border"] == 1){
		createWidget(name+'_Container',father,divBox,horiz,vert,x,y,-1,-1,"eyeSimplebox",cent,'px',visible,'Simplebox');
	}else{
		createWidget(name+'_Container',father,divBox,horiz,vert,x,y,-1,-1,"eyeSimpleboxNoBorder",cent,'px',visible,'Simplebox');
	}
}
function Button_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var highlight = params['highlight'];
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
	var imgWidth = params["imgWidth"];
	var imgHeight = params["imgHeight"];
	var forceMsg = params["forceMsg"];
	myLeft = myLeft + 5;

	var myContainer = document.createElement('div');
	myContainer.setAttribute('id',name+'_GlobalContainer');
	if (myImg != null) {
		var myButton = document.createElement('img');
		myButton.src=myImg;
		myButton.setAttribute('id',name+'_cpt_img');
		if (imgWidth > 0) {
			myButton.style.width = imgWidth + 'px';
		}
		if (imgHeight > 0) {
			myButton.style.height = imgHeight + 'px';
		}
		var myContent = document.createElement('div');
		myContent.innerHTML = caption;
		myContent.setAttribute('id',name+'_cpt');
		myContent.style.position = 'absolute';
	} else {
		var myButton = document.createElement('button');
		myButton.setAttribute('id',name);
		caption = tinyMCE.entityDecode(caption);
		theText=document.createTextNode(caption);
		myButton.appendChild(theText);
	}

	if(highlight == 1) {
		myButton.style.fontWeight = "bold";
	}

	if(enabled == 0) {
		myButton.disabled=1;
	}

	if(myWidth > 0) {
		if(myImg != null) {
			myContainer.style.width = myWidth+'px';
			myContent.style.width = (myWidth - imgWidth) + 'px';
		} else {
			myButton.style.width = myWidth+'px';
		}
	}

	if(myHeight > 0) {
		if(myImg != null) {
			myContainer.style.height = myHeight+'px';
		} else {
			myButton.style.height = myHeight+'px';
		}
	}

	if(myImg != null) {
		myContent.style.top = '2px';
		myContent.style.left = myLeft+'px';
		myContainer.style.cursor = 'Pointer';
	} else {
		myButton.className = "eyeButtonClass";
	}

	if(dis == 0) {
		if(forceMsg == 0){
			myContainer.onclick = function(){sendMsg(checknum,sig,eval(sync))};
		}else{
			var myParam = eyeParam(sig,forceMsg);
			myContainer.onclick = function(){sendMsg(checknum,sig,myParam)};
		}
	}

	myContainer.appendChild(myButton);
	if(myContent) {
		myContainer.appendChild(myContent);
	}
	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,myWidth,myHeight,"eyeButton",cent,'px',visible,'Button');
	if (myImg != null) {
		fixPNG(myButton);
	}
}
function Calendar_show(params,name,father,x,y,horiz,vert,checknum,cent)
{
	var myWidth = params['width'];
	var myPid = params['myPid'];
	var myHeight = params['height'];
	var visible = params['visible'];
	var selectFunc = params['selectFunc'];
	var drawOnClick = params['drawOnClick'];
	var drawHighlight = params['drawHighlight'];
	var weekHighlight = false;
	var globalDate = new Date();
	if(params['forceDate'] != ''){
		globalDate.setTime(params['forceDate']);
	}
	if(params['drawServerDate'] != ''){
		var drawServerDate = new Date();
		drawServerDate.setTime(params['drawServerDate']);
	}else{
		var drawServerDate = '';
	}

	var globalMonth = globalDate.getMonth();
	var myDay = globalDate.getDate();
	var globalYear = globalDate.getFullYear();
	var monthNames = getArrayArg(params['monthNames']);
	var weekDays = getArrayArg(params['weekDays']);
	var startMonday = params['startMonday'];
	var calendarBase = document.createElement('div');
	var lastSelect = false;

	calendarBase.setAttribute('id',name+'calendarBase');
	calendarBase.style.width = myWidth+'px';
	calendarBase.style.height = myHeight+'px';
	calendarBase.style.position = 'absolute';
		var rowsAndDate = getRowsAndDate();
		var weekDaysNames = getDaysNames();
		var calendarBody = getCalendarBody(globalDate);
	calendarBase.appendChild(rowsAndDate);
	calendarBase.appendChild(weekDaysNames);
	calendarBase.appendChild(calendarBody);

	createWidget(name+'_Container',father,calendarBase,horiz,vert,x,y,myWidth,myHeight,"eyeCalendar",cent,'px',visible,'Calendar');

	function getRowsAndDate()
	{
		var rowsAndDate = document.createElement('div');
		rowsAndDate.setAttribute('id',name+'rowsAndDate');
		rowsAndDate.style.color = params['rowsAndDate'];
		rowsAndDate.className = 'calendar_rowsAndDate';
			var rowLeft = document.createElement('div');
			rowLeft.setAttribute('id',name+'rowLeft');
			rowLeft.className = 'calendar_rowLeft';
			xAddEventListener(rowLeft,'click',previousMonth);
			var text = document.createTextNode('<<');
			rowLeft.appendChild(text);

			var dateMiddle = document.createElement('div');
			dateMiddle.setAttribute('id',name+'dateMiddle');
			dateMiddle.className = 'calendar_dateMiddle';
			text = document.createTextNode(monthNames[globalMonth]+' '+globalYear);
			dateMiddle.appendChild(text);

			var rowRight = document.createElement('div');
			rowRight.setAttribute('id',name+'rowRight');
			rowRight.className = 'calendar_rowRight';
			xAddEventListener(rowRight,'click',nextMonth);
			text = document.createTextNode('>>');
			rowRight.appendChild(text);

		rowsAndDate.appendChild(rowLeft);
		rowsAndDate.appendChild(dateMiddle);
		rowsAndDate.appendChild(rowRight);
		return rowsAndDate;
	}
	function getDaysNames()
	{
		//At the moment, only show the week in this order: sunday monday....saturday.
		var x = 0;//for loops
		var weekDaysNames = document.createElement('div');
		weekDaysNames.setAttribute('id',name+'weekDaysNames');
		weekDaysNames.className = 'calendar_weekDaysNames';
		weekDaysNames.style.backgroundColor = params['backgroundNames'];
			var dayNameContent = document.createElement('div');
			dayNameContent.style.textAlign = 'center';
				var left = 11;
				for(x=0;x<7;x++)
				{
					var dayName = document.createElement('div');
					dayName.style.left = left+'%'
					dayName.style.color = params['dayName'];
					dayName.className = 'calendar_dayName';
					var text = document.createTextNode(weekDays[x]);
					dayName.appendChild(text);
					dayNameContent.appendChild(dayName);
					left = left+12;
				}
		weekDaysNames.appendChild(dayNameContent);
		return weekDaysNames;
	}

	function getCalendarBody()
	{
		var date = new Date();
		date.setMonth(globalMonth);
		date.setYear(globalYear);
		var x,y = 0;//For bucles
		date.setDate(1);//First day of month
		var dayOfWeek = date.getDay();
		var calendarBody = document.createElement('div');
		calendarBody.className = 'calendar_calendarBody';
		//Calculating the the month lenght.
		var preMonthLenght = getMonthDays(globalMonth-1);
		var monthLenght = getMonthDays(globalMonth);
		var nextMonthLenght = getMonthDays(globalMonth+1);

//Creating the array with day numbers.
		//First fill the first days of first week.
		var dayNums = new Array(0);//I will use push ,metoth
		var dayColors = new Array(0);
		var monthDay = new Array(0);
		var dayIds = new Array(0);

		var discount = 1;
		if(startMonday == 1){
			if(dayOfWeek == 0){
				dayOfWeek = 7;
			}else if(dayOfWeek == 6){
				dayOfWeek = 0;
			}
			discount = 2;
		}
		for(x=dayOfWeek-discount;x>=0;x--)
		{
			dayNums.push(preMonthLenght-x);
			dayIds.push(name+'_'+(preMonthLenght-x)+'_pre');
			dayColors.push(params['preMonthDays']);//Hardcoded at the moment
		}
		//Fill all month day
		for(x=1;x<=monthLenght;x++)
		{
			dayNums.push(x);
			dayIds.push(name+'_'+x+'_current');
			date.setDate(x);
			if(date.getDay() == 0 || date.getDay() == 6)
			{
				dayColors.push(params['weekEnd']);
			}else{
				dayColors.push(params['workDays']);//Hardcoded at the moment
			}
		}
		//Fill rest days
		var rest = 42-dayNums.length;
		for(x=1;x<=rest;x++)
		{
			dayNums.push(x);
			dayIds.push(name+'_'+x+'_rest'	);
			dayColors.push(params['nextMonthDays']);//Hardcoded at the moment
		}

		//Now, fill the body with days!
		var top = 7.5;//Hardcoded at the moment
		var count = 0;
		var vdate = new Date(); // for today
		for(x=0;x<6;x++)
		{
			var weekMonth = document.createElement('div');
			weekMonth.className = 'calendar_weekMonth';
			weekMonth.style.top = top+'%';
			/*if(weekHighlight != false && weekHighlight == x && drawHighlight != 0){
				weekMonth.style.backgroundColor = params['clickedWeek'];
				weekMonth.style.borderColor = params['clickedWeek'];
				weekMonth.style.borderStyle = 'solid';
				weekMonth.style.borderWidth = '1px';
			}*/
			var left = 11;
			var vdate = new Date();
			for(y=0;y<7;y++)
			{
				var weekDay = document.createElement('div');
				weekDay.className = 'calendar_weekDay';
				weekDay.style.left = left+'%';
				weekDay.style.color = dayColors[count];
				weekDay.setAttribute('id',dayIds[count]);
				//!!! the dayColors fix is only for some time, in the next version this days will send a correct data
				if(dayColors[count] != params['preMonthDays'] && dayColors[count] != params['nextMonthDays'])
				{
					weekDay.style.cursor = 'pointer';
					if(dayNums[count] == vdate.getDate() && globalMonth == vdate.getMonth() && globalYear == vdate.getFullYear()){
						weekDay.className = 'calendar_weekDayToday';
						weekDay.style.borderColor = params['todayBorder'];
						weekDay.style.color = params['todayFontColor'];
						weekDay.style.backgroundColor = params['todayBackground'];

						weekMonth.className = 'calendar_weekMonthToday';
						weekMonth.style.backgroundColor = params['toWeekBackground'];
						weekMonth.style.borderColor = params['toWeekBackground'];

						weekMonth.current = true;
						weekDay.current = true;
						weekHighlight = x;
					}
					if(drawServerDate != ''){
						if(dayNums[count] == drawServerDate.getDate() && globalMonth == drawServerDate.getMonth() && globalYear == drawServerDate.getFullYear()){
							weekDay.className = 'calendar_weekDayClicked';
							weekDay.style.borderColor = params['clickedBorder'];
							weekMonth.className = 'calendar_weekMonthClicked';
							weekMonth.style.backgroundColor = params['clickedWeek'];
							weekMonth.style.borderColor = params['clickedWeek'];
							lastSelect = weekDay;
						}
					}
				}else{
					weekDay.style.cursor = 'default';
				}
				weekDay.day = dayNums[count];//Calcule the day of the month

				var text = document.createTextNode(dayNums[count]);
				//!!! the dayColors fix is only for some time, in the next version this days will send a correct data
				if(selectFunc != '' && dayColors[count] != params['preMonthDays'] && dayColors[count] != params['nextMonthDays'])
				{
					xAddEventListener(weekDay,'click',selectFunctionParser);
				}
				weekDay.appendChild(text);

				weekMonth.appendChild(weekDay);
				count++;
				left = left + 12;
			}
			calendarBody.appendChild(weekMonth);

			top = top+17;
		}
		return calendarBody;
	}

	function previousMonth()
	{
		calendarBase.removeChild(calendarBody);
		if(globalMonth == 0)
		{
			globalMonth = 11;
			globalYear = globalYear-1;
			globalDate.setFullYear(globalYear);
		}else{
			globalMonth = globalMonth-1;
		}
		globalDate.setMonth(globalMonth);
		calendarBody = getCalendarBody();
		calendarBase.appendChild(calendarBody);
		var dateMiddle = document.getElementById(name+'dateMiddle');
		var textNode = dateMiddle.firstChild;
		textNode.replaceData(0,textNode.length,monthNames[globalMonth]+' '+globalYear);

		var newDate = new Date();
		newDate.setMonth(globalMonth);
		newDate.setYear(globalYear);
		newDate.setDate(myDay);
		sendMsg(checknum,selectFunc,eyeParam('date',newDate.getTime()));
	}
	function nextMonth()
	{
		calendarBase.removeChild(calendarBody);
		if(globalMonth == 11)
		{
			globalMonth = 0;
			globalYear = globalYear+1;
			globalDate.setFullYear(globalYear);
		}else{
			globalMonth = globalMonth+1;
		}
		globalDate.setMonth(globalMonth);
		calendarBody = getCalendarBody();
		calendarBase.appendChild(calendarBody);
		var dateMiddle = document.getElementById(name+'dateMiddle');
		var textNode = dateMiddle.firstChild;
		textNode.replaceData(0,textNode.length,monthNames[globalMonth]+' '+globalYear);

		var newDate = new Date();
		newDate.setMonth(globalMonth);
		newDate.setYear(globalYear);
		newDate.setDate(myDay);
		sendMsg(checknum,selectFunc,eyeParam('date',newDate.getTime()));
	}
	function getMonthDays(myMonth)
	{
		if(myMonth == 3 || myMonth == 5 || myMonth == 8 || myMonth == 10)
		{
			return 30;
		}else if(myMonth == 1){
			/*A little hack for caculate if february have 28 or 29 days.*/
			var date = new Date();
			date.setMonth(2);
			date.setDate(0);
			return date.getDate();
		}else{
			return 31;
		}
	}

	function selectFunctionParser(e)
	{
		var event = new xEvent(e);
		var target = event.target;
		if(drawOnClick != 0){
			if(lastSelect != false){
				if(lastSelect.current != true){
					lastSelect.style.border = '';
				}
				if(lastSelect.parentNode && lastSelect.parentNode.current != true){
					lastSelect.parentNode.style.backgroundColor = '';
					lastSelect.parentNode.style.border = '';
				}
			}
			if(target.current != true){
				target.style.borderStyle = 'solid';
				target.style.borderColor = params['clickedBorder'];
				target.style.borderWidth = '1px';
			}
			if(target.parentNode.current != true){
				target.parentNode.style.borderStyle = 'solid';
				target.parentNode.style.borderColor = params['clickedWeek'];
				target.parentNode.style.borderWidth = '1px';
				target.parentNode.style.backgroundColor = params['clickedWeek'];
			}
		}
		lastSelect = target;

		var dayClicked = target.day;
		myDay = dayClicked;
		var selectDate = new Date();
		selectDate.setMonth(globalMonth);
		selectDate.setYear(globalYear);
		selectDate.setDate(dayClicked);
		sendMsg(checknum,selectFunc,eyeParam('date',selectDate.getTime()));
	}
}
function Checkbox_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var text = tinyMCE.entityDecode(params["text"]);
	var checked = params["checked"];
	var enabled = params["enabled"];
	var visible = params["visible"];
	var myWidth = params["width"];
	var myCheckbox = document.createElement('input');
	myCheckbox.setAttribute('type', 'checkbox');
	var myContainer = document.createElement('div');
	myContainer.setAttribute('id',name+'_textContainer');
	if(checked == 1) {
		if(IEversion && IEversion < 8) {
			myCheckbox.defaultChecked = true;
		} else {
			myCheckbox.setAttribute('checked',true);
		}
	}

	if (enabled == 0) {
		myCheckbox.disabled = 1;
	}
	if (myWidth > 0) {
		myContainer.style.width = myWidth + 'px';
	}

	myCheckbox.setAttribute('id',name);
	myCheckbox.className = 'eyeCheckbox';
	myContainer.appendChild(myCheckbox);
	myContainer.className='eyeCheckboxText';
	theText=document.createTextNode(text);
	myContainer.appendChild(theText);
	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,-1,-1,"eyeCheckboxContainer",cent,'px',visible,'Checkbox');
}
function Container_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var myheight = parseInt(params["height"]);
	var mywidth = parseInt(params["width"]);
	var unit = params["unit"];
	var visible = params["visible"];

	var myContainer = document.createElement("div");
	if(myheight > 0) {
		myContainer.style.height = myheight + unit;
	}
	if(mywidth > 0){
		myContainer.style.width = mywidth + unit;
	}
	myContainer.setAttribute('id',name);
	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,-1,-1,"eyeContainerContainer",cent,unit,visible,'Container');
}
function Flash_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var height = params["height"];
	var width = params["width"];
	var src = params["src"];
	var visible = params["visible"];
	var flashParamsNames = getArrayArg(params["flashParamsNames"]);
	var flashParamsValues = getArrayArg(params["flashParamsValues"]);
	var flashvars = '';

	for(key in flashParamsNames){
		if (flashParamsNames[key].toLowerCase() == "flashvars") {
			flashvars = "?"+flashParamsValues[key];
		}
	}

	if (!IEversion || IEversion > 7) {
		var myFlash = document.createElement("object");
		myFlash.setAttribute('width',width);
		myFlash.setAttribute('height',height);
		myFlash.setAttribute('data',src);
		myFlash.setAttribute('type','application/x-shockwave-flash');
		myFlash.setAttribute('id', name);

		for(key in flashParamsNames){
			var myTempParam = document.createElement('param');
			myTempParam.setAttribute('name',flashParamsNames[key]);
			myTempParam.setAttribute('value',flashParamsValues[key]);
			myFlash.appendChild(myTempParam);
		}
	} else {
		var myFlash = document.createElement("div");
		myFlash.setAttribute('id', name);
		myFlash.setAttribute('width',width);
		myFlash.setAttribute('height',height);

		//FIXME! NON STANDARD METHOD (<embed> tag is deprecated)
		//Should be replaced by an <object> element as soon as it is easily possible in IE...
		var myEmbedObject = document.createElement("embed");
		myEmbedObject.setAttribute('src', src+flashvars);
		myEmbedObject.setAttribute('quality', 'high');
		myEmbedObject.setAttribute('width', width);
		myEmbedObject.setAttribute('height', height);
		myEmbedObject.setAttribute('type', 'application/x-shockwave-flash');
		myEmbedObject.setAttribute('style', 'position: absolute; top: 0; right: 0;');
		myFlash.appendChild(myEmbedObject);
	}
	createWidget(name+'_Container',father,myFlash,horiz,vert,x,y,width,height,"eyeFlash",cent,'px',visible,'Flash');
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

	createWidget(name+'_Container',father,myHidden,horiz,vert,x,y,-1,-1,"eyeTextboxContainer",cent,'Hidden');
}
function Icon_show(params,name,father,x,y,horiz,vert,checknum) {
	var text = params["text"];
	var image = params["image"];
	var draggable = params["draggable"];
	var onclick = params["onclick"];
	var content = params["content"];
	var myWidth = params["width"];
	var myHeight = params["height"];
	var visible = params["visible"];
	var myOnLoad = params["myonload"];
	var realname = params["realname"];
	var overBorder = params["overBorder"];
	var overBorderBackground = params["overBorderBg"];
	var overBorderColor = params["overBorderColor"];
	var textColor = params["textColor"];
	var useClass = params["useClass"];
	overClass = params["overClass"];

	var myGlobalContainer = document.createElement('div');
	myGlobalContainer.style.width='65px';
	myGlobalContainer.setAttribute('id',name+'_globalContainer');

	var myImage = document.createElement('img');
	if(myOnLoad != null) {
		myImage.onload=function(){eval(myOnLoad);};
	}
	myImage.src = image;
	myImage.setAttribute('id','img_'+name);
	myImage.className = 'eyeIcon_Image';

	if(myWidth > 0) {
		myImage.setAttribute('width',myWidth);
	}
	if(myHeight > 0) {
		myImage.setAttribute('height',myHeight);
	}

	var myIconText = document.createElement('div');
	myIconText.className = 'eyeIcon_Text';
	myIconText.setAttribute('align','center');
	myIconText.setAttribute('id',name+'_text');
	myIconText.style.width = '65px';

	text = tinyMCE.entityDecode(text);
	var theText = document.createTextNode(text);
	myIconText.appendChild(theText);

	myGlobalContainer.appendChild(myImage);
	myGlobalContainer.appendChild(myIconText);

	var myContent = document.createElement('input');
	myContent.setAttribute('type', 'hidden');
	myContent.setAttribute('id',name+'_Content');
	myContent.value = content;

	myGlobalContainer.appendChild(myContent);
	realname = tinyMCE.entityDecode(realname);
	if(overBorder != 0) {
		if(IEversion && IEversion < 7) {
			myGlobalContainer.style.border = 'none';
		} else {
			myGlobalContainer.onmouseover = function() {
				myGlobalContainer.style.backgroundColor = overBorderBackground;
				myGlobalContainer.style.border = overBorderColor;
				myIconText.innerHTML = "";
				myIconText.appendChild(document.createTextNode(realname));
			}

			myGlobalContainer.onmouseout = function() {
				myGlobalContainer.style.border = '1px solid transparent';
				myGlobalContainer.style.backgroundColor = 'transparent';
				myIconText.innerHTML = "";
				myIconText.appendChild(document.createTextNode(text));
			}
			myGlobalContainer.style.border = '1px solid transparent';
		}
	}
	if(useClass != 0){
		myGlobalContainer.onmouseover = function() {
			myIconText.innerHTML = "";
			myIconText.appendChild(document.createTextNode(realname));
		}
		myGlobalContainer.onmouseout = function() {
			myIconText.innerHTML = "";
			myIconText.appendChild(document.createTextNode(text));
		}
	}
	createWidget(name+'_Container',father,myGlobalContainer,horiz,vert,x,y,-1,-1,'eyeIcon_blank',0,'px',visible,'Icon');
	xGetElementById(name + '_globalContainer').className = overClass;
	var globalContainer = xGetElementById(name+'_Container');
	globalContainer.checknum = checknum;
	globalContainer.style.color = textColor;
	if (draggable==1) {
			makeDrag(name+'_Container',father,'iconDragUpdate',checknum,content,1);
	}
	if(onclick==1){
		myGlobalContainer.onclick = function(){
			var myContent = getArrayArg(content);
			var result = '';
			for (var i in myContent) {
				result += eyeParam('arg'+i,tinyMCE.entityDecode(myContent[i]));
			}
			sendMsg(checknum,'Icon_Clicked',result);
		}
	} else if (onclick == 2) {
		myGlobalContainer.ondblclick = function() {
			var myContent = getArrayArg(content);
			var result = '';
			for (var i in myContent) {
				result += eyeParam('arg'+i,tinyMCE.entityDecode(myContent[i]));
			}
			sendMsg(checknum,'Icon_Clicked',result);
		}
	}
	fixPNG(myImage);
}
widgetDrop_behaviours = [];
dropIndex = 400;
function WidgetDrop_show(params,name,father,x,y,horiz,vert,checknum){
	//I don't know how it works under ie 8
	var widget = xGetElementById(father);
	if(widget.xDropEnabled == true){
		return false;
	}

	var widget = xGetElementById(father);
	var cOrder = params['cOrder'];
	var callback = params['callback'];
	var signal = params['signal'];
	var sender = params['sender'];
	var mySelf = params['mySelf'];

	//This is a wrapper function for handle the differents options when drop happens
	var widgetDrop = function widgetDrop(drop,drag,x,y,event){
		//If cOrder is 1 or 3, callback is called before send the msg.
		if(drag.id && drop.id){
			if(drag.id == drop.id && mySelf == false){
				return true;
			}
		}
		if((cOrder == 1 || cOrder == 3) && callback){
			_execDropCallback(callback,drop,drag,x,y,event,checknum,1);
		}
		//If sendMsg is true, a msg will be send
		if(signal){
			if(drop.content){
				var myContent = getArrayArg(drop.content);
				var result = '';
				for (var i in myContent) {
					result += eyeParam('arg'+i,tinyMCE.entityDecode(myContent[i]));
				}
				sendMsg(checknum,signal,result);
			}
		}
		if(sender){
			if(drag.content){
				var myContent = getArrayArg(drag.content);
				var result = '';
				for (var i in myContent) {
					result += eyeParam('arg'+i,tinyMCE.entityDecode(myContent[i]));
				}
				sendMsg(drag.checknum,sender,result);
			}
		}
		if(widgetDrop_behaviours[name]){
			try{
				eval("var behaviour = new "+widgetDrop_behaviours[name][0]+"('"+name+"');");
				behaviour.start(drop,drag,x,y,event,checknum);
			}catch(err){
				//waiting to eyeOS debug system
			}
		}
		//If cOrder is 2 or 3, callback is called after sendMsg
		if((cOrder == 2 || cOrder == 3) && callback){
			_execDropCallback(callback,drop,drag,x,y,event,checknum,2);
		}
	}
	function _execDropCallback(callback,drop,drag,x,y,event,checknum,num){
		if(typeof(callback) == 'string'){
			try{
				eval(callback);
			}catch(err){
			}
		}else{
			callback(drop,drag,x,y,event,checknum,num);
		}
	}
	xEnableDrop(widget,widgetDrop);
}

function addDropBehaviour(params,name,type){
	//Adding the behaviour to behaviour array
	try{
		//NOTE: I eval the classes directly for javascript load problems (in each browser is different)
		widgetDrop_behaviours[name] = [];
		widgetDrop_behaviours[name][0] = type;
		widgetDrop_behaviours[name][1] = params;
	}catch(err){
		//Waiting to eyeOS debug
		try{
			console.log(err);
		}catch(err){
			//none
		}
	}
}

function widgetDrop_simpleMenu(name){
	this.params = widgetDrop_behaviours[name][1];
	this.start = function start(drop,drag,x,y,event,checknum){
		this.action(drop,drag,x,y,event,checknum);
	}
	this.action = function (drop,drag,x,y,event,checknum){
		//If drag have content
		if(drop.father == drag.father){
			return false;
		}
		var result = '';
		var i = 1;
		if(drag.content){
			var myContent = getArrayArg(drag.content);
			for (var x in myContent) {
				result += eyeParam('arg'+i,tinyMCE.entityDecode(myContent[x]));
				i++;
			}
		}
		//if simpleMenu behaviour
		if(this.params['content']){
			var myContent = getArrayArg(this.params['content']);
			for (var x in myContent) {
				result += eyeParam('arg'+i,tinyMCE.entityDecode(myContent[x]));
				i++;
			}
		}
		sendMsg(checknum,this.params['signal'],result);
		//mostramos menu
		showSimpleMenu(event,this.params['widgetId']);
	}
}

function widgetDrop_simpleMsg(name){
	this.params = widgetDrop_behaviours[name][1];
	this.start = function start(drop,drag,x,y,event,checknum){
		this.action(drop,drag,x,y,event,checknum);
	}
	this.action = function (drop,drag,x,y,event,checknum){
		//If drag have content
		if(drop.father == drag.father || !drag.myPid){
			return false;
		}
		var result = '';
		var i = 0;
		if(drag.content){
			var myContent = getArrayArg(drag.content);
			for (var x in myContent) {
				result += eyeParam('arg'+i,tinyMCE.entityDecode(myContent[x]));
				i++;
			}
		}
		if(this.params['content']){
			result += eyeParam('arg'+i,tinyMCE.entityDecode(this.params['content']));
			i++;
		}
		sendMsg(checknum,this.params['signal'],result);
	}
}

function moveAndClick(name){
	this.params = widgetDrop_behaviours[name][1];
	this.start = function start(drop,drag,x,y,event,checknum){
		if(!drag.myPid){
			return false;
		}
		var dropPid = this.params['pid'];
		var iconPid = drag.myPid;
		//If drag is an eyeFiles icon child, only move it
		//If not is a child, trhow th emenu
		if(dropPid == iconPid){
			this.moveAction(drop,drag,x,y,event,checknum);
		}else{
			this.menuAction(drop,drag,x,y,event,checknum);
		}
	}
	this.moveAction = function moveAction(drop,drag,x,y,event,checknum){
		if (this.params['moveType'] < 2) {
			this.moveUpdate(drag.id,xLeft(drag),xTop(drag),drag.diffX,drag.diffY,drag.checknum,drag.content);
		}
		if (this.params['moveType'] < 3) {
			drag.style.left = drag.diffX+'px';
			drag.style.top = drag.diffY+'px';
		}
	}
	this.menuAction = function menuAction(drop,drag,x,y,event,checknum){
		var result = '';
		var i = 0;
		if(drag.content){
			var myContent = getArrayArg(drag.content);
			for (var x in myContent) {
				result += eyeParam('arg'+i,tinyMCE.entityDecode(myContent[x]));
				i++;
			}
		}
		if(this.params['content']){
			result += eyeParam('arg'+i,tinyMCE.entityDecode(this.params['content']));
			i++;
		}

		sendMsg(checknum,this.params['signal'],result);
	}
	this.moveUpdate = function moveUpdate(widgetid,ancientX,ancientY,newX,newY,checknum,content) {
		var minDiff = 0;//hardcoded at the moment
		var movedX = newX - ancientX;
		var movedY = newY - ancientY;
		var myContent = getArrayArg(content);

		/*var result="";
		for (var i in myContent) {
			result += eyeParam('arg'+i,tinyMCE.entityDecode(myContent[i]));
		}*/

		if ((movedX > minDiff || movedX < (minDiff)) || ((movedY > minDiff || movedY < minDiff))) {
			if (!this.params['moveMaster']) {
				this.params['moveMaster'] = 0;
			}
			var sendxml = eyeParam('eyeArg',eyeParam('content',myContent[this.params['moveMaster']])+eyeParam('newX',newX)+eyeParam('newY',newY)+eyeParam('rName',myContent[4]),1);
			sendMsg(checknum,'Icon_Moved',sendxml);
		}
	}
}


//Handle drag and drop callbacks


//ele = the element that the callback will be applied
//dragWidget = the widget that will be moved with drag & drop action
//contnet = the information that will recive the drop object
//checknum = checknum, needed for sendMsg
//clickCallback = if the user only click, it can activate a callback
//clickSignal = if the user only click, a msg is send
//cursor = the cursor that will be setted on global father (eyeapps)
//cursorPos = 0: natural position, 1: the mouse is in the top-left corner.
//overload = When overload is true, only the *Back functions are called.
//params,name,father,x,y,horiz,vert,checknum

function WidgetDrag_show(params,name,father,x,y,horiz,vert,checknum,cent){
	//Initialing some local vars, needed in some browsers for share it between subfunctions
	var widget= xGetElementById(father);

	var dragWidget = xGetElementById(father).cloneNode(true);
	var dragCssNames = getArrayArg(params['dragCssNames']);
	var dragCssContent = getArrayArg(params['dragCssContent']);

	var content = params['content'];
	var clickCallback = params['clickCallback'];
	var clickSignal = params['clickSignal'];
	var cursor = params['cursor'];
	var cursorPos = params['cursorPos'];
	var dragAlpha = params['dragAlpha'];
	var myPid = params['myPid'];

	widget.myPid = myPid;
	widget.drag = dragWidget;
	widget.father = father;
	widget.content = content;

	var startX = 0;
	var startY = 0;
	var cursorBack = '';

	var xBack = widget.style.left;
	var yBack = widget.style.top;

	var dragStarted = false;

	//This is called when user mousedown in a drag element
	var widgetDragStart = function widgetDragStart(ele,mouseX,mouseY,event){
		//If overLoad is true, call only the start callback function
		//Restarting the initial values

		dragWidget.style.left = xBack;
		dragWidget.style.top = yBack;

		startX = 0;
		startY = 0;
		widget.diffX = xLeft(widget);
		widget.diffY = xTop(widget);

		//The drag don't start if the mouse isn't moved
		dragStarted = false;

		//Respect where de user click in the drag object

		var left = xLeft('eyeApps');
		if(!left){
			left = 0;
		}
		var top = xTop('eyeApps');
		if(!top){
			top = 0;
		}
 		mouseX -= left;
		mouseY -= top;
		if(cursorPos == 0){
			startX = mouseX-event.offsetX;
			startY = mouseY-event.offsetY;
		}else if(cursorPos == 1){
			startX = mouseX;
			startY = mouseY;
		}
	}

	//Called when dragWidget is moved (onmousemove)
	var widgetDragMove = function widgetDragMove(ele,mouseDX,mouseDY,bWithinRect,xEventObj){

		//If the drag isn't started, start it. Set some vars and create the real dragWidget
		if(dragStarted == false){
			dragStarted = true;//Now drag is started because mouse is moved

			var eyeApps = xGetElementById('eyeApps');//Getting global father

			//Setting the style
			eyeApps.style.cursor = cursor;
			dragWidget.style.cursor = cursor

			//Moving the dragWidget to start position
			xMoveTo(dragWidget,startX,startY);

			//Adding it to global father
			dragWidget.setAttribute('id',father+'_drag');//Setting a unique id
			eyeApps.appendChild(dragWidget);

			xZIndex(widget,zindex);
			zindex++;

			xZIndex(dragWidget, zindex);zindex++;//Moving it on top of layers
			//updating the css style if it is set
			if(dragCssNames){
				for (var i in dragCssNames) {
					updateCss(dragWidget.id,dragCssNames[i],dragCssContent[i]);
				}
			}
			if(dragAlpha){
				updateOpacityOnce(dragAlpha,dragWidget.id);
			}

		//If drag is started, only move the dragWidget
		}else{
			//Moving seamless
			widget.diffX += mouseDX;
			widget.diffY += mouseDY;
			xMoveTo(dragWidget,xLeft(dragWidget)+mouseDX,xTop(dragWidget)+mouseDY);
		}
	}
	//This is called when user "mouseup" the cursor.
	var widgetDragEnd = function widgetDragEnd(ele,mouseX,mouseY,xEventObj){
		//If drag isn't started, only simulate a click with a custom function.
		if(dragStarted == false){
			//If callback is passed as argument, call it
			if(clickCallback){
				_execDragCallback(clickCallback,ele,mouseX,mouseY,xEventObj);
			}

			var myContent = getArrayArg(content);
			var result = '';
			for (var i in myContent) {
				result += eyeParam('arg'+i,tinyMCE.entityDecode(myContent[i]));
			}
			if(clickSignal){
				sendMsg(checknum,clickSignal,result);
			}
		//If drag started, restart the initial values
		}else{
			dragWidget.parentNode.removeChild(dragWidget);
		}
		xGetElementById('eyeApps').style.cursor=cursorBack;
	}

	xEnableDrag(widget,widgetDragStart,widgetDragMove,widgetDragEnd,'eyeApps');
}

function _execDragCallback(clickCallback,ele,mouseX,mouseY,xEventObj){
	if(typeof(callback) == 'string'){
		try{
			eval(callback);
		}catch(err){
		}
	}else{
		callback(ele,mouseX,mouseY,xEventObj);
	}
}

function iconDragUpdate(widgetid,ancientX,ancientY,newX,newY,checknum,content) {
	var movedX = newX - ancientX;
	var movedY = newY - ancientY;
	myContent = getArrayArg(content);

	var result="";
	for (var i in myContent) {
		result += eyeParam('arg'+i,tinyMCE.entityDecode(myContent[i]));
	}

	xZIndex(xGetElementById(widgetid),zindex);
	zindex++;

	if (movedX < 1 && movedX > (-1) && movedY < 1 && movedY > (-1)) {
		sendMsg(checknum,'Icon_Clicked',result);
	} else {
		var sendxml = eyeParam('eyeArg',eyeParam('content',content)+eyeParam('newX',newX)+eyeParam('newY',newY),1);
		sendMsg(checknum,'Icon_Moved',sendxml);
	}
}
function Iframe_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var url = params["url"];
	var myheight = params["height"];
	var mywidth = params["width"];
	var visible = params["visible"];
	var scroll = params["scroll"];

	var myFrame = document.createElement('iframe');
	myFrame.setAttribute('id',name);
	myFrame.setAttribute('name',name);
	myFrame.setAttribute('src',url);
	myFrame.setAttribute('width',mywidth);
	myFrame.setAttribute('height',myheight);
	myFrame.style.border='0px solid black';
	myFrame.frameBorder='no';
	if(scroll == 0) {
		myFrame.setAttribute('scrolling','no');
	}
	createWidget(name+'_Container',father,myFrame,horiz,vert,x,y,-1,-1,"eyeIframe",cent,'px',visible,'Iframe');
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
		createWidget(name+'_Container',father,myImage,horiz,vert,x,y,myWidth,myHeight,myClass,cent,'px',visible,'Imagebox');
	} else {
		createWidget(name+'_Container',father,myImage,horiz,vert,x,y,myWidth,myHeight,"eyeImagebox",cent,'px',visible,'Imagebox');
	}
	fixPNG(myImage);
}
function Label_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var text = params["text"];
	var visible = params["visible"];
	var sync = params["sync"];
	var dis = params["disablemsg"];
	var sig = params["signal"];

	var myLabel = document.createElement('div');
	myLabel.setAttribute('id',name);
	if(dis == 0) {
		myLabel.onclick = function() {sendMsg(checknum,sig,eyeParam(name,text)+eval(sync))};
	}
	text = tinyMCE.entityDecode(text);
	myLabel.appendChild(document.createTextNode(text));
	createWidget(name+'_Container',father,myLabel,horiz,vert,x,y,-1,-1,"eyeLabel",cent,'px',visible,'Label');
}
function Radio_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var checked = params["checked"];
	var enabled = params["enabled"];
	var visible = params["visible"];
	var group = params["group"];
	var text = params["text"];
	var myContainer = document.createElement('div');
	var myRadio = document.createElement('input');

	myContainer.setAttribute('id', name+'_textContainer');
	myRadio.setAttribute('name',group);
	myRadio.setAttribute('id', name);
	myRadio.setAttribute('type','radio');
	myContainer.appendChild(myRadio);
	if (IEversion && IEversion < 8) {
		myRadio.onclick = function() {
			this.checked = 1;
			inputs = document.getElementsByTagName('input');
			for (i = 0; i < inputs.length; i++) {
				if (inputs[i].type == 'radio' && inputs[i].name == this.name && inputs[i].id != this.id) {
					inputs[i].checked = 0;
				}
			}
		};
	}
	myContainer.appendChild(document.createTextNode(text));
	if(checked == 1) {
		myRadio.setAttribute('checked','checked');
		myRadio.setAttribute('defaultChecked','true');
	}
	if(enabled == 0) {
		myRadio.setAttriute('disabled', 'true');
	}
	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,-1,-1,"eyeRadio",cent,'px',visible,'Radio');
}
function Select_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var visible = params["visible"];
	var mywidth = params["width"];
	var enabled = params["params"];
	var mySelect = document.createElement("select");

	if(enabled == 0) {
		mySelect.disabled = 1;
	}

	if(mywidth > 0) {
		mySelect.style.width = mywidth+'px';
	}
	mySelect.setAttribute('id',name);
	mySelect.className = 'eyeSelect';
	createWidget(name+'_Container',father,mySelect,horiz,vert,x,y,-1,-1,"",cent,'px',visible,'Select');
}

function Sortabletable_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var visible = params["visible"];
	var myTheader = getArrayArg(params["theader"]);
	var width = params["width"];
	var height = params["height"];
	var sizeUnit = params["sizeUnit"];
	var signal = params["signal"];
	var dsignal = params["doubleClickSignal"];
	var sortypes = getArrayArg(params["sortypes"]);
	var master = params["master"];
	var realName = params["realName"];
	var tBorder = params["border"];
	var oTable = document.createElement("TABLE");
	var oTHead = document.createElement("THEAD");
	var oTBody = document.createElement("TBODY");
	var widget = document.createElement('div');
	widget.style.width=width+sizeUnit;
	widget.style.height=height+sizeUnit;
	widget.className='sort-table-container';
	widget.setAttribute('id',name+'_generalContainer');
	if(tBorder != 1) {
		widget.style.border = '0px';
	}
	var oRow, oCell;
	var i,j;
	var myRows;

	var strSortypes = '[';

	var myHiddens = new Array();

	for(keyVar in sortypes) {
		if(sortypes[keyVar] == 'Hidden') {
			myHiddens[keyVar] = 1;
		} else {
			myHiddens[keyVar] = 0;
		}
		if(strSortypes == '[') {
			strSortypes += '"'+sortypes[keyVar]+'"';
		} else {
			strSortypes += ',"'+sortypes[keyVar]+'"';
		}
	}

	strSortypes += ']';

	//create the header
	oRow = document.createElement("TR");
	for(i=0;i<myTheader.length;i++){
		if(myHiddens[i] == 0) {
			oCell = document.createElement("TD");
			oCell.innerHTML = myTheader[i];
			oRow.appendChild(oCell);
		}
	}
	oTHead.appendChild(oRow);
	oTable.appendChild(oTHead);
	oTBody.setAttribute('id',name+'_Body');
	oTable.appendChild(oTBody);
	oWidthNoHorizScrollbar = width - 17;
	oTable.style.width=oWidthNoHorizScrollbar+sizeUnit;
	oTable.setAttribute('id',name);
	oTable.className="sort-table";
	widget.appendChild(oTable);
	createWidget(name+'_Container',father,widget,horiz,vert,x,y,-1,-1,"eyeTable",cent,sizeUnit,visible,'SortableTable');
	eval('table_'+name+' = new SortableTable(document.getElementById("'+name+'"),'+strSortypes+',"'+signal+'","'+master+'","'+realName+'","'+checknum+'","'+name+'","'+dsignal+'");');
}
function SortableTable(oTable, oSortTypes, signal, master,rName,checknum,entireName, dsignal) {

	this.sortTypes = oSortTypes || [];
	this.normalSort = oSortTypes;

	this.sortColumn = null;
	this.descending = null;
	this.lastClick = null;
	this.mySignal = signal;
	this.mydSignal = dsignal;
	this.myMaster = master;
	this.realName = rName;
	this.mychecknum = checknum;
	this.entName = entireName;
	this.lastID = 0;

	var oThis = this;
	this._headerOnclick = function (e) {
		oThis.headerOnclick(e);
	};


	this._bodyOnclick = function (e) {
		oThis.bodyOnclick(e);
	}

	this._bodyOndblclick = function (e) {
		oThis.bodyOndblclick(e);
	}

	if (oTable) {
		this.setTable( oTable );
		this.document = oTable.ownerDocument || oTable.document;
	}
	else {
		this.document = document;
	}

	// only IE needs this
	var win = this.document.defaultView || this.document.parentWindow;
	this._onunload = function () {
		oThis.destroy();
	};
	if (win && typeof win.attachEvent != "undefined") {
		win.attachEvent("onunload", this._onunload);
	}
}

SortableTable.gecko = navigator.product == "Gecko";
SortableTable.msie = /msie/i.test(navigator.userAgent);
// Mozilla is faster when doing the DOM manipulations on
// an orphaned element. MSIE is not
SortableTable.removeBeforeSort = SortableTable.gecko;

SortableTable.prototype.onsort = function () {};

// default sort order. true -> descending, false -> ascending
SortableTable.prototype.defaultDescending = false;

// shared between all instances. This is intentional to allow external files
// to modify the prototype
SortableTable.prototype._sortTypeInfo = {};

SortableTable.prototype.setTable = function (oTable) {
	if ( this.tHead )
		this.uninitHeader();
	this.element = oTable;
	this.setTHead( oTable.tHead );
	this.setTBody( oTable.tBodies[0] );
};

SortableTable.prototype.setTHead = function (oTHead) {
	if (this.tHead && this.tHead != oTHead )
		this.uninitHeader();
	this.tHead = oTHead;
	this.initHeader( this.sortTypes );
};

SortableTable.prototype.addEntry = function(entry) {
	var myEntry = getArrayArg(entry);

	var i = this.lastID;
	this.lastID++;
	var oRow = document.createElement("TR");
	oRow.setAttribute('id',this.entName+'_row_'+i);
	var i=0;
	var oCell=0;
	var sortypes = this.normalSort;
	var myHiddens = new Array();
	var myHtml = new Array();
	for(keyVar in sortypes) {
		if(sortypes[keyVar] == 'Hidden') {
			myHiddens[keyVar] = 1;
		} else {
			myHiddens[keyVar] = 0;
		}
		if(sortypes[keyVar] == 'Html') {
			myHtml[keyVar] = 1;
		} else if(sortypes[keyVar] == 'HtmlButNoSort') {
			myHtml[keyVar] = 1;
		} else {
			myHtml[keyVar] = 0;
		}
	}
	for(i=0;i<myEntry.length;i++) {
		oCell = document.createElement("TD");
		myEntry[i] = tinyMCE.entityDecode(myEntry[i]);
		if(myHtml[i] == 1) {
			oCell.innerHTML = myEntry[i];
		} else {
			oCell.appendChild(document.createTextNode(myEntry[i]));
		}

		if(myHiddens[i] == 1) {
			oCell.style.display = 'none';
		}
		oRow.appendChild(oCell);
	}
	var tBody = document.getElementById(this.entName+'_Body');
	if(tBody)
		tBody.appendChild(oRow);
}

SortableTable.prototype.delEntry = function(entry) {
	var i=0;
	var j=0;
	var oRow = document.getElementById(this.entName).rows;
	for(i=0;i<oRow.length;i++) {
		var oCells = oRow[i].cells;
		if(oCells[this.myMaster]) {
			if(oCells[this.myMaster].innerHTML == entry) {
				oRow[i].parentNode.removeChild(oRow[i]);
			}
		}
	}
}

SortableTable.prototype.setTBody = function (oTBody) {
	this.tBody = oTBody;
	var c = oTBody;
	if (typeof c.addEventListener != "undefined") {
		c.addEventListener("click", this._bodyOnclick, false);
		c.addEventListener("dblclick", this._bodyOndblclick, false);
	} else if (typeof c.attachEvent != "undefined") {
		c.attachEvent("onclick", this._bodyOnclick);
		c.attachEvent("ondblclick", this._bodyOndblclick);
	} else {
		c.onclick = this._bodyOnclick;
		c.ondblclick = this._bodyOndblclick;
	}
};

SortableTable.prototype.setSortTypes = function ( oSortTypes ) {
	if ( this.tHead )
		this.uninitHeader();
	this.sortTypes = oSortTypes || [];
	if ( this.tHead )
		this.initHeader( this.sortTypes );
};

// adds arrow containers and events
// also binds sort type to the header cells so that reordering columns does
// not break the sort types
SortableTable.prototype.initHeader = function (oSortTypes) {
	if (!this.tHead) return;
	var cells = this.tHead.rows[0].cells;
	var doc = this.tHead.ownerDocument || this.tHead.document;
	this.sortTypes = oSortTypes || [];
	var l = cells.length;
	var img, c;
	for (var i = 0; i < l; i++) {
		c = cells[i];
		if (this.sortTypes[i] != null && this.sortTypes[i] != "None" && this.sortTypes[i] != "HtmlButNoSort") {
			img = doc.createElement("IMG");
			img.src = "index.php?version=" + EXTERN_CACHE_VERSION + "&theme=1&extern=images/widgets/blank.png";
			c.appendChild(img);
			if (this.sortTypes[i] != null)
				c._sortType = this.sortTypes[i];
			if (typeof c.addEventListener != "undefined")
				c.addEventListener("click", this._headerOnclick, false);
			else if (typeof c.attachEvent != "undefined")
				c.attachEvent("onclick", this._headerOnclick);
			else
				c.onclick = this._headerOnclick;
		}
		else
		{
			c.setAttribute( "_sortType", oSortTypes[i] );
			if (this.sortTypes[i] != null) {
				c._sortType = "None";
			} else {
				c._sortType = this.sortTypes[i];
			}
		}
	}
	this.updateHeaderArrows();
};

// remove arrows and events
SortableTable.prototype.uninitHeader = function () {
	if (!this.tHead) return;
	var cells = this.tHead.rows[0].cells;
	var l = cells.length;
	var c;
	for (var i = 0; i < l; i++) {
		c = cells[i];
		if (c._sortType != null && c._sortType != "None" && c._sortType != "HtmlButNoSort") {
			c.removeChild(c.lastChild);
			if (typeof c.removeEventListener != "undefined")
				c.removeEventListener("click", this._headerOnclick, false);
			else if (typeof c.detachEvent != "undefined")
				c.detachEvent("onclick", this._headerOnclick);
			c._sortType = null;
			c.removeAttribute( "_sortType" );
		}
	}
};

SortableTable.prototype.updateHeaderArrows = function () {
	if (!this.tHead) return;
	var cells = this.tHead.rows[0].cells;
	var l = cells.length;
	var img;
	for (var i = 0; i < l; i++) {
		if (cells[i]._sortType != null && cells[i]._sortType != "None" && cells[i]._sortType != "HtmlButNoSort") {
			img = cells[i].lastChild;
			if (i == this.sortColumn)
				img.className = "sort-arrow " + (this.descending ? "descending" : "ascending");
			else
				img.className = "sort-arrow";
		}
	}
};

SortableTable.prototype.getSelectValue = function(i) {
	if(this.lastClick) {
		return this.lastClick.childNodes.item(i).innerHTML;
	} else {
		return "";
	}
};

SortableTable.prototype.bodyOndblclick = function(e) {
	var el = e.target || e.srcElement;
	while (el.tagName != "TR")
		el = el.parentNode;
	if(this.lastClick) {
		this.lastClick.className = '';
	}
	this.lastClick = el;
	el.className = 'sort-table-select';
	if(this.mydSignal) {
		sendMsg(this.mychecknum,this.mydSignal,eyeParam(this.realName,this.getSelectValue(this.myMaster)));
	}
}

SortableTable.prototype.bodyOnclick = function(e) {
	var el = e.target || e.srcElement;
	while (el.tagName != "TR")
		el = el.parentNode;
	if(this.lastClick) {
		this.lastClick.className = '';
	}
	this.lastClick = el;
	el.className = 'sort-table-select';
	if(this.mySignal) {
		sendMsg(this.mychecknum,this.mySignal,eyeParam(this.realName,this.getSelectValue(this.myMaster)));
	}
}

SortableTable.prototype.headerOnclick = function (e) {
	// find TD element
	var el = e.target || e.srcElement;
	while (el.tagName != "TD")
		el = el.parentNode;

	this.sort(SortableTable.msie ? SortableTable.getCellIndex(el) : el.cellIndex);

};

// IE returns wrong cellIndex when columns are hidden
SortableTable.getCellIndex = function (oTd) {
	var cells = oTd.parentNode.childNodes
	var l = cells.length;
	var i;
	for (i = 0; cells[i] != oTd && i < l; i++)
		;
	return i;
};

SortableTable.prototype.getSortType = function (nColumn) {
	return this.sortTypes[nColumn] || "String";
};

// only nColumn is required
// if bDescending is left out the old value is taken into account
// if sSortType is left out the sort type is found from the sortTypes array

SortableTable.prototype.sort = function (nColumn, bDescending, sSortType) {
	if (!this.tBody) return;
	if (sSortType == null)
		sSortType = this.getSortType(nColumn);

	// exit if None or HtmlButNoSort
	if (sSortType == "None" || sSortType == "HtmlButNoSort")
		return;

	if (bDescending == null) {
		if (this.sortColumn != nColumn)
			this.descending = this.defaultDescending;
		else
			this.descending = !this.descending;
	}
	else
		this.descending = bDescending;

	this.sortColumn = nColumn;

	if (typeof this.onbeforesort == "function")
		this.onbeforesort();

	var f = this.getSortFunction(sSortType, nColumn);
	var a = this.getCache(sSortType, nColumn);
	var tBody = this.tBody;

	a.sort(f);

	if (this.descending)
		a.reverse();

	if (SortableTable.removeBeforeSort) {
		// remove from doc
		var nextSibling = tBody.nextSibling;
		var p = tBody.parentNode;
		p.removeChild(tBody);
	}

	// insert in the new order
	var l = a.length;
	for (var i = 0; i < l; i++)
		tBody.appendChild(a[i].element);

	if (SortableTable.removeBeforeSort) {
		// insert into doc
		p.insertBefore(tBody, nextSibling);
	}

	this.updateHeaderArrows();

	this.destroyCache(a);

	if (typeof this.onsort == "function")
		this.onsort();
};

SortableTable.prototype.asyncSort = function (nColumn, bDescending, sSortType) {
	var oThis = this;
	this._asyncsort = function () {
		oThis.sort(nColumn, bDescending, sSortType);
	};
	window.setTimeout(this._asyncsort, 1);
};

SortableTable.prototype.getCache = function (sType, nColumn) {
	if (!this.tBody) return [];
	var rows = this.tBody.rows;
	var l = rows.length;
	var a = new Array(l);
	var r;
	for (var i = 0; i < l; i++) {
		r = rows[i];
		a[i] = {
			value: this.getRowValue(r, sType, nColumn),
			element: r
		};
	};
	return a;
};

SortableTable.prototype.destroyCache = function (oArray) {
	var l = oArray.length;
	for (var i = 0; i < l; i++) {
		oArray[i].value = null;
		oArray[i].element = null;
		oArray[i] = null;
	}
};

SortableTable.prototype.getRowValue = function (oRow, sType, nColumn) {
	// if we have defined a custom getRowValue use that
	if (this._sortTypeInfo[sType] && this._sortTypeInfo[sType].getRowValue)
		return this._sortTypeInfo[sType].getRowValue(oRow, nColumn);

	var s;
	var c = oRow.cells[nColumn];
	if (typeof c.innerText != "undefined")
		s = c.innerText;
	else
		s = SortableTable.getInnerText(c);
	return this.getValueFromString(s, sType);
};

SortableTable.getInnerText = function (oNode) {
	var s = "";
	var cs = oNode.childNodes;
	var l = cs.length;
	for (var i = 0; i < l; i++) {
		switch (cs[i].nodeType) {
			case 1: //ELEMENT_NODE
				s += SortableTable.getInnerText(cs[i]);
				break;
			case 3: //TEXT_NODE
				s += cs[i].nodeValue;
				break;
		}
	}
	return s;
};

SortableTable.prototype.getValueFromString = function (sText, sType) {
	if (this._sortTypeInfo[sType])
		return this._sortTypeInfo[sType].getValueFromString( sText );
	return sText;
	/*
	switch (sType) {
		case "Number":
			return Number(sText);
		case "CaseInsensitiveString":
			return sText.toUpperCase();
		case "Date":
			var parts = sText.split("-");
			var d = new Date(0);
			d.setFullYear(parts[0]);
			d.setDate(parts[2]);
			d.setMonth(parts[1] - 1);
			return d.valueOf();
	}
	return sText;
	*/
	};

SortableTable.prototype.getSortFunction = function (sType, nColumn) {
	if (this._sortTypeInfo[sType])
		return this._sortTypeInfo[sType].compare;
	return SortableTable.basicCompare;
};

SortableTable.prototype.destroy = function () {
	this.uninitHeader();
	var win = this.document.parentWindow;
	if (win && typeof win.detachEvent != "undefined") { // only IE needs this
		win.detachEvent("onunload", this._onunload);
	}
	this._onunload = null;
	this.element = null;
	this.tHead = null;
	this.tBody = null;
	this.document = null;
	this._headerOnclick = null;
	this.sortTypes = null;
	this._asyncsort = null;
	this.onsort = null;
};

// Adds a sort type to all instance of SortableTable
// sType : String - the identifier of the sort type
// fGetValueFromString : function ( s : string ) : T - A function that takes a
//	string and casts it to a desired format. If left out the string is just
//	returned
// fCompareFunction : function ( n1 : T, n2 : T ) : Number - A normal JS sort
//	compare function. Takes two values and compares them. If left out less than,
//	<, compare is used
// fGetRowValue : function( oRow : HTMLTRElement, nColumn : int ) : T - A function
//	that takes the row and the column index and returns the value used to compare.
//	If left out then the innerText is first taken for the cell and then the
//	fGetValueFromString is used to convert that string the desired value and type

SortableTable.prototype.addSortType = function (sType, fGetValueFromString, fCompareFunction, fGetRowValue) {
	this._sortTypeInfo[sType] = {
		type: sType,
		getValueFromString: fGetValueFromString || SortableTable.idFunction,
		compare: fCompareFunction || SortableTable.basicCompare,
		getRowValue: fGetRowValue
	};
};

// this removes the sort type from all instances of SortableTable
SortableTable.prototype.removeSortType = function (sType) {
	delete this._sortTypeInfo[sType];
};

SortableTable.basicCompare = function compare(n1, n2) {
	if (n1.value < n2.value)
		return -1;
	if (n2.value < n1.value)
		return 1;
	return 0;
};

SortableTable.idFunction = function (x) {
	return x;
};

SortableTable.toUpperCase = function (s) {
	return s.toUpperCase();
};

SortableTable.toDate = function (s) {
	var parts = s.split("-");
	var d = new Date(0);
	d.setFullYear(parts[0]);
	d.setDate(parts[2]);
	d.setMonth(parts[1] - 1);
	return d.valueOf();
};


// add sort types
SortableTable.prototype.addSortType("Number", Number);
SortableTable.prototype.addSortType("CaseInsensitiveString", SortableTable.toUpperCase);
SortableTable.prototype.addSortType("Date", SortableTable.toDate);
SortableTable.prototype.addSortType("String");
// None is a special case

function Tab_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var myheight = parseInt(params["height"]);
	var mywidth = parseInt(params["width"]);
	var sig = params["signal"];

	var myObj = document.createElement('div');
	myObj.setAttribute('id',name);
	myObj.useDisplay = params['useDisplay'];
	myObj.className = 'eyeTab';
	if(mywidth > 0) {
		myObj.style.width = mywidth+'px';
	}
	if(myheight > 0) {
		myObj.style.height = myheight+'px';
	}
	createWidget(name+'_Container',father,myObj,horiz,vert,x,y,-1,-1,"eyeTabContainer",cent,'Tab');
	eval('tab_'+name+' = new eyeTab(document.getElementById("'+name+'"),"'+sig+'","'+checknum+'","' + parseInt(params["tabwidth"]) + '");');
}
//eyeTab class
function eyeTab(oTab,signal,mychecknum,tabwidth) {
	this.csignal = signal; //signal to use when a tab is requested to be closed
	this.checknum = mychecknum; //checknum to send messages to eyeos
	this.lastClick = null; //store the last tab selected
	this.tabWidth = tabwidth;
	this.initialOffset = 0;
	this.tabHeight = 23;
	this.myName = oTab.id;
	this.moTab = oTab;
	this.myTabs= new Array();

	var oThis = this; //get the instance of our tab group

	var myHeader = document.createElement('div');
	myHeader.setAttribute('id',oTab.id+'_header');
	myHeader.className = 'eyeTabHeader';
	myHeader.style.width = xWidth(oTab)-9+'px';

	var buttonLeft = document.createElement('div');
	var buttonRight = document.createElement('div');

	buttonLeft.className = 'eyeTabArrowLeft';
	buttonRight.className = 'eyeTabArrowRight';

	buttonLeft.setAttribute('id',oTab.id+'_buttonLeft');

	buttonLeft.onmousedown=function(){
		this.interval=setInterval('document.getElementById("'+oTab.id+'_header").scrollLeft-=10',50);
	};

	buttonLeft.onmouseup=function(){
		clearTimeout(this.interval);
	};

	buttonLeft.onmouseout=function(){
		clearTimeout(this.interval);
	};

	buttonRight.setAttribute('id',oTab.id+'_buttonRight');

	buttonRight.onmousedown=function(){
		this.interval=setInterval('document.getElementById("'+oTab.id+'_header").scrollLeft+=10',50);
	};

	buttonRight.onmouseup=function(){
		clearTimeout(this.interval);
	};

	buttonRight.onmouseout=function(){
		clearTimeout(this.interval);
	};
	buttonLeft.style.display='none';
	buttonRight.style.display='none';

	oTab.appendChild(buttonLeft);
	oTab.appendChild(myHeader);
	oTab.appendChild(buttonRight);

	this.oHeader = myHeader;

	this.oHeader.onclick = function(e) {
		oThis.headerClick(e);
	}

	//when the class is unload, it destroy itself
	this._onunload = function () {
		oThis.destroy();
	};
}

eyeTab.prototype.getCurrentTab = function() {
	var oThis = this;
	return oThis.lastClick;
}

eyeTab.prototype.headerClick = function (e) {
	var event = new xEvent(e);
	if (event.target.className == 'eyeTabText') {
		event.target = event.target.parentNode;
	}
	if(event.target.className == 'eyeTabSelected' || event.target.className == 'eyeTabNotSelected') {
		this.selectTab(event.target.id);
	}
}


eyeTab.prototype.addTab = function (tabName,counter,noclose) {
	var oThis = this;
	var myNewTab = document.createElement('div');
	var myTabName = document.createElement('div');
	myTabName.innerHTML = tabName;
	myTabName.className = 'eyeTabText';
	myNewTab.className = 'eyeTabNotSelected';
	myNewTab.setAttribute('id',this.myName+'_'+counter);
	myNewTab.style.width = this.tabWidth+'px';
	myNewTab.style.position = 'absolute';
	myNewTab.style.top = '0px';
	myNewTab.style.height = this.tabHeight + 'px';
	if (IEversion && IEversion < 7) {
		offset2 = 0;
	} else {
		offset2 = 1;
	}
	var offset = counter * (Number(this.tabWidth) + offset2) + this.initialOffset;
	myNewTab.style.left = offset+'px';
	myNewTab.appendChild(myTabName);
	this.oHeader.appendChild(myNewTab);
	var myContent = document.createElement('div');
	myContent.setAttribute('id',myNewTab.id+'_Content');
	myContent.className = 'eyeTabBody';
	myContent.style.width = xWidth(this.moTab)+'px';
	var cHeight = xHeight(this.moTab) - xHeight(this.oHeader);
	myContent.style.height = cHeight+'px';
	this.moTab.appendChild(myContent);
	this.selectTab(myNewTab.id);
	if(noclose == 0) {
		var tabCross = document.createElement('div');
		tabCross.setAttribute('id',tabName.id+'_cross');
		tabCross.className = 'eyeTabCross';
		tabCross.onclick = function(e) {
			sendMsg(oThis.checknum,oThis.csignal,eyeParam('arg',myNewTab.id));
		}
		myNewTab.appendChild(tabCross);
	}
	this.myTabs[myNewTab.id] = offset;

	var numTabs = this.oHeader.childNodes.length;
	var sizeTab = numTabs * this.tabWidth;
	if(sizeTab>xWidth(this.oHeader)) {
		var oLeft = document.getElementById(this.moTab.id+'_buttonLeft');
		oLeft.style.display = 'block';
		var oRight = document.getElementById(this.moTab.id+'_buttonRight');
		oRight.style.display = 'block';
	}
}

eyeTab.prototype.removeTab = function (tabname) {
	var myObj = document.getElementById(tabname);
	if(!myObj) {
		return;
	}
	for (var i in this.myTabs) {
		if(this.myTabs[i] > this.myTabs[tabname]){
			var num = this.tabWidth;
			this.myTabs[i] = this.myTabs[i] - num;
			document.getElementById(i).style.left = this.myTabs[i]+'px';
		}
	}
	var myContent = document.getElementById(myObj.id+'_Content');
	this.oHeader.removeChild(myObj);
	this.moTab.removeChild(myContent);
	//TODO: delete the position, no set to null
	this.myTabs[tabname] = null;
}

eyeTab.prototype.selectTab = function (tabname) {
	var myObj = document.getElementById(tabname);
	if(!myObj) {
		return;
	}
	if(myObj.id != this.lastClick) {
		myObj.className = 'eyeTabSelected';
		var myContent = document.getElementById(myObj.id+'_Content');
		if (this.moTab.useDisplay == 0) {
			myContent.style.visibility = 'visible';
		} else {
			myContent.style.display = 'block';
		}
		if(this.lastClick) {
			var tObj = document.getElementById(this.lastClick);
			if(tObj) {
				tObj.className = 'eyeTabNotSelected';
				var tContent = document.getElementById(tObj.id+'_Content');
				if (this.moTab.useDisplay == 0) {
					tContent.style.visibility = 'hidden';
				} else {
					tContent.style.display = 'none';
				}
			}
		}
		this.lastClick = tabname;
	}
}
function Textarea_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var Wwidth = params["width"];
	var Hheight = params["height"];
	var rich = params["rich"];
	var code = params["code"];
	var lang = params["lang"];
	var rows = params["rows"];
	var cols = params["cols"];
	var enabled = params["enabled"];
	var CcssClass = params["cssClass"];
	var visible = params["visible"];

	var myTextarea = document.createElement('textarea');
	if(code == 1) {
		myTextarea.id = name + '_cp';
		myTextarea.name = name + '_cp';
	} else {
		myTextarea.setAttribute('id',name);
		myTextarea.setAttribute('name',name);
	}
	if (rows) {
		myTextarea.setAttribute('rows',rows);
	}
	if (cols) {
		myTextarea.setAttribute('cols',cols);
	}

	if (Wwidth > 0) {
		myTextarea.style.width = Wwidth+'px';
	}
	if (Hheight > 0) {
		myTextarea.style.height = Hheight+'px';
	}

	if (enabled == 0) {
		myTextarea.readOnly = 1;
	}

	if (CcssClass) {
		myTextarea.className = CcssClass;
		createWidget(name+'_Container',father,myTextarea,horiz,vert,x,y,Wwidth,Hheight,CcssClass,cent,'px',visible,'Textarea');
	} else {
		myTextarea.className = 'eyeTextarea';
		createWidget(name+'_Container',father,myTextarea,horiz,vert,x,y,Wwidth,Hheight,"eyeTextareaContainer",cent,'px',visible,'Textarea');
	}
	if(rich == 1) {
		txtAreas[name+'_objTxt'] = new tinymce.Editor(name, {
			mode : "specific_textareas",
			theme : "advanced",
			plugins : "safari,pagebreak,style,layer,table,save,advhr,advimage,advlink,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
			theme_advanced_buttons1 : "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|formatselect,fontselect,fontsizeselect,|,tablecontrols",
			theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
			theme_advanced_buttons3 : "",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			auto_reset_designmode : true,
			theme_advanced_statusbar_location : "bottom",
			theme_advanced_path : false,
			skin : "o2k7",
			skin_variant : "silver"
		});
		txtAreas[name+'_objTxt'].render();
	} else if (rich == 2) {
		txtAreas[name+'_objTxt'] = new tinymce.Editor(name, {
			mode : "specific_textareas",
			theme : "advanced",
			plugins : "safari,pagebreak,style,layer,table,save,advhr,advimage,advlink,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
			theme_advanced_buttons1 : "newdocument,open,save,saveAs,print,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|formatselect,fontselect,fontsizeselect,|,tablecontrols",
			theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,forecolor,backcolor,|,zoomselect",
			theme_advanced_buttons3 : "",
			theme_advanced_toolbar_location : "top",
			theme_advanced_toolbar_align : "left",
			auto_reset_designmode : true,
			theme_advanced_statusbar_location : "bottom",
			theme_advanced_path : false,
			skin : "o2k7",
			skin_variant : "silver",
			save_onsavecallback : function(ed) {
				sendMsg(checknum,'Save',eyeParam(name.substring(6),Base64.encode(ed.getContent())));
			}
		});
		txtAreas[name+'_objTxt'].addButton('open', {
			title : 'Open File',
			image : 'index.php/extern/externVersion/1/externPath/libs/eyeWidgets/tiny_mce/themes/advanced/img/open.png',
			onclick : function() {
				sendMsg(checknum,'Open','');
			}
		});
		txtAreas[name+'_objTxt'].addButton('saveAs', {
			title : 'Save as',
			image : 'index.php/extern/externVersion/1/externPath/libs/eyeWidgets/tiny_mce/themes/advanced/img/saveAs.png',
			onclick : function() {
				sendMsg(checknum,'saveAs',eyeParam(name.substring(6),Base64.encode(txtAreas[name+'_objTxt'].getContent())));
			}
		});
		txtAreas[name+'_objTxt'].checknum = checknum;
		txtAreas[name+'_objTxt'].render();
		txtAreas[name+'_objTxt'].onInit.add(function(ed) {
			document.getElementById(name+'_path_row').innerHTML = '';
			var obj_tbl = document.getElementById(name+'_tbl');
			var obj_ifr = document.getElementById(name+'_ifr');
			//the father of the iframe must have text-aglin center, only god and the IE developers know why...
			if(IEversion == 6){
				obj_ifr.parentNode.style.textAlign = 'center';
			}
			//this *maybe* will be moved into css.
			obj_ifr.style.width = '650px';
			obj_ifr.style.marginLeft = 'auto';
			obj_ifr.style.marginRight = 'auto';
			obj_ifr.style.height = xHeight(obj_ifr)-50+'px';
			obj_ifr.style.marginTop = '49px';
			enableShadow(obj_ifr.id);
		});
	} else if(code == 1) {
			myTextarea.className ='codepress '+lang;
			eval("cp_"+name+" = new CodePress('"+myTextarea.id+"');");
			CodePress.path = 'index.php?version='+EXTERN_CACHE_VERSION+'&extern=libs/eyeWidgets/codepress/';
			myTextarea.parentNode.insertBefore(eval("cp_"+name), myTextarea);
	}
}function Textbox_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var text = tinyMCE.entityDecode(params["text"]);
	var enabled = params["enabled"];
	var visible = params["visible"];
	var myPassword = params["password"];
	var mywidth = params["width"];
	var noborder = params["noborder"];

	var myTextbox = document.createElement('input');
	if (myPassword) {
		myTextbox.setAttribute('type','password');
	} else {
		myTextbox.setAttribute('type','text');
	}

	if(text) {
		myTextbox.value = text;
	}

	if(mywidth != null) {
		myTextbox.style.width = mywidth+'px';
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

	createWidget(name+'_Container',father,myTextbox,horiz,vert,x,y,-1,-1,"eyeTextboxContainer",cent,'px',visible,'Textbox');
}

activeWindow = "";

min_apps_width = 100;
min_apps_height = 70;
minspace=new Array();
openWindows=new Array();

firstButtonPosition = 6;
secondButtonPosition = 21;
thirdButtonPosition = 38;
function Window_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var sync = params["sync"];
	var title = params["title"];
	var type = params["type"];
	var showtitle = params["showtitle"];
	var listed = params["listed"];
	var max = params["max"];
	var max_pos = params["max_pos"];
	var min = params["min"];
	var min_pos = params["min_pos"];
	var close = params["close"];
	var close_pos = params["close_pos"];
	var resize = params["resize"];
	var nodrag = params["nodrag"];
	var width = params["width"];
	var minWidth = params["minWidth"];
	var minHeight = params["minHeight"];
	var height = params["height"];
	var sendCloseMsg = params["sendCloseMsg"];
	var sendResizeMsg = params["sendResizeMsg"];
	var background = params["background"];
	var sigResize = params["sigResize"];
	var removeWin = parseInt(params["removeWin"]);
	var savePosition = params["savePosition"];
	var saveFunc = params["saveFunc"];
	var xChecknum = params["xChecknum"];
	var sigClose = params["sigClose"];
	var dragBgColor = params["dragBgColor"];
	var dragBgAlpha = params["dragBgAlpha"];
	var showDragContent = params["showDragContent"];
	var noZindex = params['noZindex'];
	var allDrag = params['allDrag'];

	//Css classes for each window part
	var wCssMain = params['wMain'];
	var wCssTitle = params['wTitle'];
	var wCssTitleRight = params['wTitleRight'];
	var wCssTitleLeft = params['wTitleLeft'];
	var wCssTitleCenter = params['wTitleCenter'];
	var wCssTitleText = params['wTitleText'];
	var wCssBottomCenter = params['wBottomCenter'];
	var wCssBottomRight = params['wBottomRight'];
	var wCssBottomLeft = params['wBottomLeft'];
	var wCssLeft = params['wLeft'];
	var wCssRight = params['wRight'];
	var wCssContent = params['wContent'];

	var theText = document.createTextNode('');
	var createdWindow = createWidget(name,father,theText,horiz,vert,x,y,width,height,wCssMain,cent,null,null,'Window');

	createdWindow.dragBgColor = dragBgColor;
	createdWindow.dragBgAlpha = dragBgAlpha;
	createdWindow.showDragContent = showDragContent;
	createdWindow.minWidth = minWidth;
	createdWindow.minHeight = minHeight;

	createdWindow.xDropEnabled = false;
	xEnableDrag.drops[xEnableDrag.drops.length] = {e:createdWindow};
	//Getting window for set a few properties
	title = tinyMCE.entityDecode(title);

	if (type == 2) {
		createWidget(name+"_Content",name,theText,0,0,-1,-1,-1,-1,"eyeWindowContentInvisible",0);
		makeWindow(name, title, father, "", checknum, null,null,null,null,null,1,1,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,saveFunc,xChecknum,sigClose,noZindex,null,sync);
	} else if ((type == 3 || type == 4) && background != null) {
		var myImage = document.createElement('img');
		myImage.setAttribute('id',name+'_background');
		myImage.src=background;
		myImage.style.width = width + 'px';
		var myDiv = document.createElement('div');
		myDiv.style.overflow = "hidden";
		myDiv.appendChild(myImage);
		createWidget(name+"_Content",name,myDiv,0,0,-1,-1,-1,-1,"eyeWindowContentInvisible",0);
		myImage.style.position = 'static';
		if(type == 3) {
			makeWindow(name, title, father, "", checknum, null,null,null,null,null,0,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,saveFunc,xChecknum,sigClose,noZindex,allDrag,sync);
		} else {
			makeWindow(name, title, father, "", checknum, null,null,null,null,null,1,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,saveFunc,xChecknum,sigClose,noZindex,allDrag,sync);
		}
		fixPNG(myImage,'crop');
	} else {
		/* CreateWidgets for Title Bar */
		createWidget(name+"_WindowTitle",name,theText,0,0,-1,-1,-1,-1,wCssTitle,0);
		createWidget(name+"_WindowTitle_border_right",name+"_WindowTitle",theText,0,0,-1,-1,-1,-1,wCssTitleRight,0);
		createWidget(name+"_WindowTitle_border_left",name+"_WindowTitle",theText,0,0,-1,-1,-1,-1,wCssTitleLeft,0);
		createWidget(name+"_WindowTitle_center",name+"_WindowTitle",theText,0,0,-1,-1,-1,-1,wCssTitleCenter,0);
		createWidget(name+"_WindowTitle_text",name+"_WindowTitle",document.createTextNode(title),0,0,-1,-1,-1,-1,wCssTitleText,0);
		/* CreateWidgets for Window Bottom */
		createWidget(name+"_WindowBottom_center",name,theText,0,0,-1,-1,-1,-1,wCssBottomCenter,0);
		createWidget(name+"_WindowBottom_right",name,theText,0,0,-1,-1,-1,-1,wCssBottomRight,0);
		createWidget(name+"_WindowBottom_left",name,theText,0,0,-1,-1,-1,-1,wCssBottomLeft,0);
		/* Left */
		createWidget(name+"_WindowLeft",name,theText,0,0,-1,-1,-1,-1,wCssLeft,0);
		/* Right */
		createWidget(name+"_WindowRight",name,theText,0,0,-1,-1,-1,-1,wCssRight,0);
		/* CreateWidgets for Window Content */
		createWidget(name+"_Content",name,theText,0,0,-1,-1,-1,-1,wCssContent,0);


		if (showtitle == 0) {
			showtitle = null;
		} else {
			showtitle = name+"_WindowTitle";
		}

		if (listed == 0) {
			listed = 1;
		} else {
			listed = 0;
		}

		if (min == 0) {
			min = null;
		} else {
			if (min_pos == 1) {
				min_pos = firstButtonPosition;
			} else if (min_pos == 2) {
				min_pos = secondButtonPosition;
			} else if (min_pos == 3) {
				min_pos = thirdButtonPosition;
			}
			createWidget(name+"_WindowMinimizeButton",name,theText,1,0,min_pos,-1,-1,-1,"eyeWindowMinimizeButton",0);
			min = name+"_WindowMinimizeButton";
		}

		if (max == 0) {
			max = null;
		} else {
			if (max_pos == 1) {
				max_pos = firstButtonPosition;
			} else if (max_pos == 2) {
				max_pos = secondButtonPosition;
			} else if (max_pos == 3) {
				max_pos = thirdButtonPosition;
			}
			createWidget(name+"_WindowMaxButton",name,theText,1,0,max_pos,-1,-1,-1,"eyeWindowMaxButton",0);
			max = name+"_WindowMaxButton";
		}

		if (close == 0) {
			close = null;
		} else {
			if (close_pos == 1) {
				close_pos = firstButtonPosition;
			} else if (close_pos == 2) {
				close_pos = secondButtonPosition;
			} else if (close_pos == 3) {
				close_pos = thirdButtonPosition;
			}
			createWidget(name+"_WindowCloseButton",name,theText,1,0,close_pos,-1,-1,-1,"eyeWindowCloseButton",0);
			close = name+"_WindowCloseButton";
		}

		if (resize == 0) {
			resize = null;
		} else {
			createWidget(name+"_WindowResizeButton",name,theText,0,0,-1,-1,-1,-1,"eyeWindowResizeButton",0);
			resize = name+"_WindowResizeButton";
		}

		if (nodrag == 1) {
			nodrag = 1;
		} else {
			nodrag = 0;
		}
		makeWindow(name,title,father,"",checknum,max,resize,showtitle,close,min,listed,nodrag,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,saveFunc,xChecknum,sigClose,noZindex,allDrag,sync);
        // Fix Title
//         var maxlong = xGetElementById(name+"_WindowTitle_center").offsetWidth - 10;
//         if (max) {
//             maxlong -= xGetElementById(name+"_WindowMaxButton").offsetWidth;
//         }
//         if (close) {
//             maxlong -= xGetElementById(name+"_WindowCloseButton").offsetWidth;
//         }
//         if (min) {
//             maxlong -= xGetElementById(name+"_WindowMinimizeButton").offsetWidth;
//         }

//         Window_fixTitle(name,xGetElementById(name+"_WindowTitle_text").title,maxlong,false);
    }
}

        // Fix large title
// function Window_fixTitle(name,title,maxlong,pass) {
    // var titlediv = xGetElementById(name+"_WindowTitle_text");
    // if (titlediv.offsetWidth > maxlong) {
        // title = title.substr(0,title.length-4);
        // while(title.substr(title.length-1) == " ") {
            // title = title.substr(0,title.length-1);
        // }
        // title = title + "...";
        // titlediv.innerHTML = title;
        // Window_fixTitle(name,title,maxlong,true);
    // } else if (!pass) {
        // titlediv.innerHTML = title;
    // }
// }

function makeWindow (widgetid,title,fatherid,afterfunction,checknum,maxButton,resButton,barId,closeButton,minButton,notList,notDrag,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,saveFunc,xChecknum,sigClose,noZindex,allDrag,sync) {
    var widget = xGetElementById(widgetid);
	widget.notDrag = notDrag;
	widget.noZindex = noZindex;

	if (!widget) {
		return;
	}
	var father = xGetElementById(fatherid);
	var mBtn = xGetElementById(maxButton);
	var minBtn = xGetElementById(minButton);
	var rBtn = xGetElementById(resButton);
	var cBtn = xGetElementById(closeButton);
	var barX = xGetElementById(barId);
	if (fatherid != "eyeApps") {
		var rightBorder = xWidth(xGetElementById(widgetid+"_WindowBottom_right"));
		var leftBorder = xWidth(xGetElementById(widgetid+"_WindowBottom_left"));
		var barX_height = xHeight(barX);
		var grandfatid = fatherid;
		var height_minimized = 0;
		var height_minimized = 0;
	} else {
		var rightBorder = 0;
		var leftBorder = 0;
		var barX_height = 0;
		var height_minimized = 55;
		var start_at_y = 30;
		fatherid = "minimizedAppsIn";
		var grandfatid = "minimizedApps";
	}

	if (document.getElementById(widgetid + '_Content').className != 'eyeWindowContentInvisible') {
		if (IEversion && IEversion < 7) {
			aw = document.getElementById(activeWindow);
			if (aw) {
				selects = aw.getElementsByTagName('select');
				for (i = 0;i < selects.length;i++) {
					if (selects[i].style.visibility != 'hidden') {
						selects[i].name = 'visible';
						selects[i].style.visibility = 'hidden';
					}
				}
			}
		}
		activeWindow = widgetid;
	}

	if (notList != 1) {
		var x, y, w, h, minimized, maximized = false;
		if (!minspace[fatherid]) {
			minspace[fatherid] = 0;
		}
		createWidget(widgetid+"_WindowOnBarContainer",fatherid,"",0,0,-1,-1,-1,-1,"eyeWindowOnBar_Container");
		var myTitleWinDiv = document.createElement('div');
		myTitleWinDiv.className='eyeWindowOnBar_text';
		myTitleWinDiv.innerHTML = title;
		createWidget(widgetid+"_WindowOnBar",widgetid+"_WindowOnBarContainer",myTitleWinDiv,0,1,minspace[fatherid],-1,-1,-1,"eyeWindowOnBar_Off");
		var barWin = xGetElementById(widgetid+"_WindowOnBar");
		var barWin_height = xHeight(barWin);
		var barWin_width = xWidth(barWin);
		var appsList = xGetElementById(widgetid+"_WindowOnBarContainer");
		openWindows[openWindows.length] = widgetid;
		minspace[fatherid] = minspace[fatherid] + barWin_width;
		//TODO: WARNING: remove lame html code and replace xWidth
		if (minspace[fatherid] > xWidth(grandfatid) && minArrows == 0) {
			var minIconLeft = document.getElementById("minIconLeft");
			var minIconRight = document.getElementById("minIconRight");
			var myImgRight = document.createElement('img');
			myImgRight.setAttribute('id','minIconRight_img');
			myImgRight.setAttribute('src','index.php?version='+EXTERN_CACHE_VERSION+'&theme=1&extern=images/desktop/right.png');
			myImgRight.onclick = function(e) {
				minArrowRight();
			}
			minIconRight.appendChild(myImgRight);

			var myImgLeft = document.createElement('img');
			myImgLeft.setAttribute('id','minIconLeft_img');
			myImgLeft.setAttribute('src','index.php?version='+EXTERN_CACHE_VERSION+'&theme=1&extern=images/desktop/left.png');
			myImgLeft.onclick = function(e) {
				minArrowLeft();
			}
			minIconLeft.appendChild(myImgLeft);

			minIconLeft.style.display="block";
			minIconRight.style.display="block";
			minArrows = 1;
			if(IEversion && IEversion < 7) {
				fixPNG(myImgRight);
				fixPNG(myImgLeft);
			}
		}
		if(fatherid != 'eyeApps'){
			var bar = document.getElementById(focusWindow+'_WindowOnBar');
			var obj = document.getElementById(focusWindow+'_WindowTitle');
			if(obj){
				obj.className = 'inactiveWindow';
				document.getElementById(focusWindow+'_WindowTitle_border_left').className = 'inactiveWindow_border_left';
				document.getElementById(focusWindow+'_WindowTitle_border_right').className = 'inactiveWindow_border_right';
				bar.className = 'eyeWindowOnBar_Off';
			}
			focusWindow = widgetid;
			var bar = document.getElementById(focusWindow+'_WindowOnBar');
			var obj = document.getElementById(focusWindow+'_WindowTitle');
			if(obj){
				obj.className = 'activeWindow';
				document.getElementById(focusWindow+'_WindowTitle_border_left').className = 'activeWindow_border_left';
				document.getElementById(focusWindow+'_WindowTitle_border_right').className = 'activeWindow_border_right';
				bar.className = 'eyeWindowOnBar_On';
			}
		}
		function barWinOnClick()
		{
			if(fatherid != 'eyeApps'){
				if (!minimized) {
					if(activeWindow == this.id){
						minimized = true;
						if (widget.showDragContent == 2) {
							widget.style.visibility = 'hidden';
						} else {
							widget.style.display = 'none';
						}
						barWin.className = "eyeWindowOnBar_Off";
					}else{
						if (IEversion && IEversion < 7) {
							aw = document.getElementById(activeWindow);
							if (aw) {
								selects = aw.getElementsByTagName('select');
								for (i = 0;i < selects.length;i++) {
									if (selects[i].style.visibility != 'hidden') {
										selects[i].name = 'visible';
										selects[i].style.visibility = 'hidden';
									}
								}
							}
						}
						xZIndex(widget, zindex);
						zindex++;
						var bar = xGetElementById(focusWindow+"_WindowOnBar");
						var obj = document.getElementById(focusWindow+'_WindowTitle');
						if(obj){
							obj.className = 'inactiveWindow';
							document.getElementById(focusWindow+'_WindowTitle_border_left').className = 'inactiveWindow_border_left';
							document.getElementById(focusWindow+'_WindowTitle_border_right').className = 'inactiveWindow_border_right';
							bar.className = 'eyeWindowOnBar_Off';
						}
						focusWindow = widgetid;
						activeWindow = this.id;
						if (IEversion && IEversion < 7) {
							selects = this.getElementsByTagName('select');
							for (i = 0;i < selects.length;i++) {
								if (selects[i].name == 'visible') {
									selects[i].style.visibility = 'visible';
								}
							}
						}
						var bar = xGetElementById(focusWindow+"_WindowOnBar");
						var obj = document.getElementById(focusWindow+'_WindowTitle');
						if(obj){
							obj.className = 'activeWindow';
							document.getElementById(focusWindow+'_WindowTitle_border_left').className = 'activeWindow_border_left';
							document.getElementById(focusWindow+'_WindowTitle_border_right').className = 'activeWindow_border_right';
							bar.className = 'eyeWindowOnBar_On';
						}
					}
				} else {
					if (IEversion && IEversion < 7) {
						aw = document.getElementById(activeWindow);
						if (aw) {
							selects = aw.getElementsByTagName('select');
							for (i = 0;i < selects.length;i++) {
								if (selects[i].style.visibility != 'hidden') {
									selects[i].name = 'visible';
									selects[i].style.visibility = 'hidden';
								}
							}
						}
					}
					minimized = false;
					if (widget.showDragContent == 2) {
						widget.style.visibility = 'visible';
					} else {
						widget.style.display = 'block';
					}
					var bar = document.getElementById(focusWindow+'_WindowOnBar');
					var obj = document.getElementById(focusWindow+'_WindowTitle');
					if(obj){
						obj.className = 'inactiveWindow';
						document.getElementById(focusWindow+'_WindowTitle_border_left').className = 'inactiveWindow_border_left';
						document.getElementById(focusWindow+'_WindowTitle_border_right').className = 'inactiveWindow_border_right';
						bar.className = "eyeWindowOnBar_Off";
					}
					focusWindow = widgetid;
					activeWindow = this.id;
					xZIndex(widget, zindex);zindex++;
					if (IEversion && IEversion < 7) {
						selects = this.getElementsByTagName('select');
						for (i = 0;i < selects.length;i++) {
							if (selects[i].name == 'visible') {
								selects[i].style.visibility = 'visible';
							}
						}
					}
					var bar = document.getElementById(focusWindow+'_WindowOnBar');
					var obj = document.getElementById(focusWindow+'_WindowTitle');
					if(obj){
						obj.className = 'activeWindow';
						document.getElementById(focusWindow+'_WindowTitle_border_left').className = 'activeWindow_border_left';
						document.getElementById(focusWindow+'_WindowTitle_border_right').className = 'activeWindow_border_right';
						bar.className = "eyeWindowOnBar_On";
					}
				}
			}
		}

		barWin.onclick = barWinOnClick;
		if (minBtn) {
			function minOnClick()
			{
				if (!minimized) {
					minimized = true;
					if (widget.showDragContent == 2) {
						widget.style.visibility = 'hidden';
					} else {
						widget.style.display = 'none';
					}
					barWin.className = "eyeWindowOnBar_Off";
				}
			}
			minBtn.onclick = minOnClick;
		}
	} else {
		var barWin_height = 0;
	}

	if (mBtn) {
		function maxOnClick()
		{
			if (maximized) {
				maximized = false;
				xResizeTo(widget, w, h);
				xMoveTo(widget, x, y);
			}
			else {
				w = xWidth(widget);
				h = xHeight(widget);
				x = xLeft(widget);
				y = xTop(widget);
				maximized = true;
				xResizeTo(widget, xWidth(father)-leftBorder-rightBorder, xHeight(father)-barX_height-barX_height-height_minimized);
				xMoveTo(widget,leftBorder,barX_height+start_at_y);
			}
			if(sendResizeMsg==1) {
				wndresize();
			}
		}
		mBtn.onclick = maxOnClick;
		xGetElementById(widgetid+"_WindowTitle").ondblclick = maxOnClick;
	}

	if (cBtn) {
		function closeOnClick()
		{
			if(removeWin == 1) {
				father.removeChild(widget);
				if (notList != 1) {
					slideClose(fatherid,widgetid);
				}
			} else if(removeWin != 2) {
				widget.style.display = 'none';
			}
			if(sendCloseMsg == 1) {
				sendMsg(checknum,sigClose,eval(sync));
			}
		}
		cBtn.onclick = closeOnClick;
	}

	if (rBtn){
		if(sendResizeMsg==1) {
			xEnableDrag(rBtn, wndsresize, resOnDrag, wndresize);
		}
	}

	function wndsresize() {
		if(!xGetElementById(widgetid).showDragContent){
			widgetDragStart(widgetid);
		}
	}

	function wndresize() {
		widgetDragEnd(widgetid);
		var element = xGetElementById(widgetid);
		var wWidth = xWidth(widgetid);
		var wHeight = xHeight(widgetid);
		if(wWidth < element.minWidth){
			wWidth = element.minWidth;
		}
		if(wHeight < element.minHeight){
			wHeight = element.minHeight;
		}
		xResizeTo(element,wWidth,wHeight);
		var myParams = eyeParam('arg',wWidth)+eyeParam('arg',wHeight);
		sendMsg(checknum,sigResize,myParams);
        // Fix Large Title
// 		var thetitle = xGetElementById(widgetid+"_WindowTitle_text");
// 		thetitle.innerHTML = thetitle.title;
//         var maxlong = xGetElementById(widgetid+"_WindowTitle_center").offsetWidth - 10;
//         if (maxButton) {
//             maxlong -= xGetElementById(widgetid+"_WindowMaxButton").offsetWidth;
//         }
//         if (closeButton) {
//             maxlong -= xGetElementById(widgetid+"_WindowCloseButton").offsetWidth;
//         }
//         if (minButton) {
//             maxlong -= xGetElementById(widgetid+"_WindowMinimizeButton").offsetWidth;
//         }
//         Window_fixTitle(widgetid,thetitle.title,maxlong,false);
	}

	if (barId && !notDrag && !allDrag) {
		xGetElementById(barId).onselectstart = function(){
				return false;
		}
		xEnableDrag(barId, begindrag, barOnDrag, callafterfunction);
	}
	if (allDrag && !notDrag) {
		xEnableDrag(widget, begindrag, barOnDrag, callafterfunction);
	}
	function begindrag() {
		if(!xGetElementById(widgetid).showDragContent && !xGetElementById(widgetid).notDrag){
			widgetDragStart(widgetid);
		}
	}

	function GoToTop()
	{
		if(fatherid != 'eyeApps'){
			if (IEversion && IEversion < 7) {
				aw = document.getElementById(activeWindow);
				if (aw) {
					selects = aw.getElementsByTagName('select');
					for (i = 0;i < selects.length;i++) {
						if (selects[i].style.visibility != 'hidden') {
							selects[i].name = 'visible';
							selects[i].style.visibility = 'hidden';
						}
					}
				}
			}

			var bar = document.getElementById(focusWindow+'_WindowOnBar');
			var obj = document.getElementById(focusWindow+'_WindowTitle');
			if(obj && bar){
				obj.className = 'inactiveWindow';
				document.getElementById(focusWindow+'_WindowTitle_border_left').className = 'inactiveWindow_border_left';
				document.getElementById(focusWindow+'_WindowTitle_border_right').className = 'inactiveWindow_border_right';
				bar.className = 'eyeWindowOnBar_Off';
			}
			activeWindow = this.id; //Set window active.
			focusWindow = activeWindow;
			var bar = document.getElementById(focusWindow+'_WindowOnBar');
			var obj = document.getElementById(focusWindow+'_WindowTitle');
			if(obj && bar){
				obj.className = 'activeWindow';
				document.getElementById(focusWindow+'_WindowTitle_border_left').className = 'activeWindow_border_left';
				document.getElementById(focusWindow+'_WindowTitle_border_right').className = 'activeWindow_border_right';
				bar.className = 'eyeWindowOnBar_On';
			}

			if (!widget.noZindex) {
				xZIndex(widget, zindex);
				zindex++;
			}
			if (IEversion && IEversion < 7) {
				selects = this.getElementsByTagName('select');
				for (i = 0;i < selects.length;i++) {
					if (selects[i].name == 'visible') {
						selects[i].style.visibility = 'visible';
					}
				}
			}
		}
	}

	function barOnDrag(e, mdx, mdy)
	{
		var ele = xGetElementById(widgetid);
		if(ele.notDrag == 1){
			return true;
		}
		var x = xLeft(widget) + mdx;
		var y = xTop(widget) + mdy;
		var xright = xWidth(father) - xWidth(widget) - rightBorder;
		var ybottom = xHeight(father) - xHeight(widget);

		if(ele.parentNode.id == "eyeApps") {
			if (x < leftBorder - xWidth(widget) + 75) x = leftBorder - xWidth(widget) + 75;
			if (x > xright + xWidth(widget) - 75) x = xright + xWidth(widget) - 75;
			if (y > ybottom + xHeight(widget) - 50) y = ybottom + xHeight(widget) - 50;
		} else {
			if (x < 0) x = 0;
			if (x > xright) x = xright;
			if (y > ybottom) y = ybottom;
		}
		if (y < 0) y = 0;

		xMoveTo(widget, x, y);
	}

	function callafterfunction()
	{

		var ele = xGetElementById(widgetid);

		if(ele.notDrag == 1){
			return true;
		}
		if(!ele.showDragContent){
			widgetDragEnd(widgetid);
		}
		if(savePosition == 1){
			if(saveFunc != ''){
				try{
					sendMsg(checknum,saveFunc,eyeParam('x',xLeft(widget))+eyeParam('y',xTop(widget))+eyeParam('winName',widget.id));
				}catch(err){}
			}else{
				//Getting vars here because at the moment, callafterfunction only to anything if savePosition are setted
				var top = xTop(widget);//Getting the top.
				var left = xLeft(widget);//Getting the left
				sendMsgParam = eyeParam('top',top);
				sendMsgParam = sendMsgParam + eyeParam('left',left);
				sendMsgParam = sendMsgParam + eyeParam('winName',widget.id);
				sendMsgParam = sendMsgParam + eyeParam('appChecknum',checknum);
				sendMsg(xChecknum,'saveWinPosition',sendMsgParam);
			}
		}
	}
	widget.onmousedown = GoToTop;
	xShow(widget);
}

function widgetDragStart(widgetid){
	document.getElementById(widgetid+'_Content').style.display = 'none';
	var window = document.getElementById(widgetid);
	window.className = 'eyeWindowMainDrag';
	if (window.dragBgColor) {
		window.style.backgroundColor = window.dragBgColor;
	}
	if (!IEversion || IEversion > 6) {
		updateOpacityOnce(window.dragBgAlpha, window.id);
	}
}
function widgetDragEnd(widgetid){
	document.getElementById(widgetid+'_Content').style.display = 'block';
	xShow(widgetid+'_Content');
	var window = document.getElementById(widgetid);
	window.className = 'eyeWindowMain';
	if (window.dragBgColor) {
		window.style.backgroundColor = 'transparent';
	}
	if (!IEversion || IEversion > 6) {
		updateOpacityOnce(100, window.id);
	}
}
function slideClose(fatherid,widgetid) {

	if (fatherid != "eyeApps" && fatherid != "minimizedAppsIn" && fatherid != "minimizedApps") {
		var grandfatid = fatherid;
		var eyeAppsId = 1;
	} else {
		fatherid = "minimizedAppsIn";
		var grandfatid = "minimizedApps";
		var eyeAppsId = 0;
	}

	var barWin = xGetElementById(widgetid+"_WindowOnBar");
	var barWin_width = xWidth(barWin);
	minspace[fatherid] = minspace[fatherid] - barWin_width;

	if (openWindows.length > 0)
	{
		var minLeft = xLeft(barWin);
		var reduceWidth = xWidth(barWin);

		for (var i = 0; i < openWindows.length; i++)
		{
			var actWin = openWindows[i]+"_WindowOnBar";
			if (xLeft(actWin) > minLeft) {
				xMoveTo(actWin,xLeft(actWin),xTop(actWin));
				xSlideTo(actWin,xLeft(actWin)-reduceWidth,xTop(actWin),1000);
			}
		}
	}

	if (eyeAppsId == 0 && minspace[fatherid] < xWidth(grandfatid) && minArrows == 1) {
		var minIconLeft = document.getElementById("minIconLeft");
		var minIconRight = document.getElementById("minIconRight");
		minIconLeft.innerHTML = "";
		minIconRight.innerHTML = "";
		minIconLeft.style.display="none";
		minIconRight.style.display="none";
		minArrows = 0;
		xSlideTo("minimizedAppsIn",0,0,1000);
	}

	if (document.getElementById(widgetid+"_WindowOnBarContainer")){
		var ele = xGetElementById(widgetid+"_WindowOnBarContainer");
		ele.removeChild(barWin);
		ele.parentNode.removeChild(ele);
	}
}

function resOnDrag(e, mdx, mdy) {
	widget = e.parentNode;
	var x = xWidth(widget) + mdx;
	var y = xHeight(widget) + mdy;
	if (x < widget.minWidth) x = widget.minWidth;
	if (y < widget.minHeight) y = widget.minHeight;
	xResizeTo(widget, x, y);
}

function minArrowLeft() {
	if (xLeft("minimizedAppsIn") < 0 && minArrows == 1){
		xSlideTo("minimizedAppsIn",xLeft("minimizedAppsIn")+125,0,1000);
	}
}

function minArrowRight() {
	if(minArrows == 1){
		xSlideTo("minimizedAppsIn",xLeft("minimizedAppsIn")-125,0,1000);
	}
}

function ProgressBar_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var visible = params["visible"];
	var mywidth = params["width"];
	var pogress = params['progress'];

	var myProgress = document.createElement('div');

	if(mywidth != null) {
		myProgress.style.width = mywidth+'px';
	}

	myProgress.setAttribute('id',name);
	myProgress.className = 'eyeProgress';

	var myProgressBar = document.createElement('div');
	myProgressBar.setAttribute('id',name+'_bar');
	myProgressBar.className = 'eyeProgressBar';
	myProgressBar.style.height = '100%';
	myProgressBar.style.width = pogress+'%';

	var myProgressText = document.createElement('div');
	myProgressText.setAttribute('id',name+'_txt');
	myProgressText.className = 'eyeProgressText';
	myProgressText.innerHTML = pogress+"%";
	var myProgressC = document.createElement('center');
	myProgressC.style.position='absolute';
	myProgressC.style.top='2px';
	myProgressC.style.width = mywidth+'px';
	myProgressC.appendChild(myProgressText);
	myProgress.appendChild(myProgressBar);
	myProgress.appendChild(myProgressC);

	createWidget(name+'_Container',father,myProgress,horiz,vert,x,y,-1,-1,"eyeProgressContainer",cent,'px',visible,'ProgressBar');
}

function Toolbar_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var obj = document.getElementById(father);
	if(!obj) {
		return;
	}
	var myBar = document.createElement('div');
	myBar.setAttribute('id',name);
	myBar.className = 'blockbar';
	myBar.paintClick = params['paintOnClick'];
	myBar.pressed = params['pressed'];
	myBar.select = params['select'];
	myBar.widgetType = 'Toolbar';
	obj.appendChild(myBar);
}

function Toolbar_groups(params,checknum,mypid,sync) {
	var obj;
	var temp;
	var length = params.length;
	var myFriends;
	for (var i = 0; i < length; i++) {
		obj = document.getElementById(mypid+"_"+params[i]+"_"+"Container");
		obj.onmousedown = function() {
			for (var j = 0; j < length; j++) {
				temp = document.getElementById(mypid+"_"+params[j]+"_"+"Container");
				if (temp.className == 'blockbarItemPress_right') {
					temp.className = 'blockbarItem_right';
				} else if (temp.className == 'blockbarItemPress') {
					temp.className = 'blockbarItem';
				}
			}
			if(this.className == 'blockbarItem_right'){
				this.className = 'blockbarItemPress_right';
			}else if (obj.className == 'blockbarItem'){
				this.className = 'blockbarItemPress';
			}
			for ( var z in sync ) {
				if (z == this.id) {
					myFriends = Base64.decode(sync[z]);
					sendMsg(checknum,this.getAttribute("name"),eval(myFriends));
				}
			}
		}
		obj.onmouseup = function() {
		}
	}
}

function Toolbar_pressed(value,boolvar) {
	var obj = document.getElementById(value);
	if (boolvar) {
		if (obj.className == 'blockbarItem_right') {
			obj.className = 'blockbarItemPress_right';
		} else if (obj.className == 'blockbarItem') {
			obj.className = 'blockbarItemPress';
		}
	} else {
		if (obj.className == 'blockbarItemPress_right') {
			obj.className = 'blockbarItem_right';
		} else if (obj.className == 'blockbarItemPress') {
			obj.className = 'blockbarItem';
		}
	}
}

function addLineToBar(myToolbar,id,right) {
	var obj = document.getElementById(myToolbar);
	var container = document.createElement('div');
	if (id) {
		container.id = id;
	}
	container.className = 'blockbarline';
	if (right) {
		container.className = 'blockbarline_right';
	}
	container.innerHTML = '&nbsp;';
	obj.appendChild(container);
}

function addItemToBar(myToolbar,itemName,itemImg,itemText,sync,checknum,myHeight,myWidth,right,mypid) {
	var obj = document.getElementById(myToolbar);
	var paintClick = obj.paintClick;
	var select = obj.select;

	var container = document.createElement('div');
	var myFriends = Base64.decode(sync);
	container.setAttribute('id',mypid+'_'+itemName+'_Container');
	container.setAttribute('name',itemName);
	if(right == 1){
		container.className = 'blockbarItem_right';
	}else{
		container.className = 'blockbarItem';
	}

	if(paintClick == 1){
		container.onmousedown = function(){
			if(right == 1){
				container.className = 'blockbarItemPress_right';
			}else{
				container.className = 'blockbarItemPress';
			}
		}
		container.onmouseup = function(){
			if(right == 1){
				container.className = 'blockbarItem_right';
			}else{
				container.className = 'blockbarItem';
			}
			sendMsg(checknum,itemName,eval(myFriends));
		}
	}

	var myImg = document.createElement('img');
	myImg.setAttribute('id',itemName+'_img');
	myImg.className = 'blockbarImg';
	myImg.setAttribute('src',itemImg);
	if (myHeight > 0) {
		myImg.style.height = myHeight + 'px';
	}
	if (myWidth > 0) {
		myImg.style.width = myWidth + 'px';
	}
	container.appendChild(myImg);

	var myText = document.createElement('div');
	myText.setAttribute('id',itemName+'_txt');
	myText.className = 'blockbarText';
	myText.innerHTML = itemText;
	container.appendChild(myText);
	obj.appendChild(container);
	fixPNG(myImg);
}

function Tree_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var myWidth = params["width"];
	var myHeight = params["height"];
	var signal = params["signal"];
	var clickTree = params["clickTree"];
	var sync = params["sync"];
	eval('tree_'+name+' = new Tree("'+father+'","'+signal+'","'+checknum+'","'+name+'",'+myHeight+','+myWidth+','+x+','+y+',"'+clickTree+'","'+sync+'");');
}

treeClass="mktree";
nodeClosedClass="liClosed";
nodeOpenClass="liOpen";
nodeBulletClass="liBullet";
nodeLinkClass="bullet";
preProcessTrees=true;

function Tree(father, signal, checknum, name, height, width, x, y, clickTree,sync) {
	this.father = father;
	this.name = name;
	this.myHeight = height;
	this.myWidth = width;
	this.h = x;
	this.v = y;
	this.mySignal = signal;
	this.myChecknum = checknum;
	this.myClickTree = clickTree;
	this.mySync = sync;
	this.widgetType = 'Tree';
	var oThis = this;

	this._listOnClick = function (e) {
		oThis.listOnClick(e);
	}

	var oFather = document.getElementById(this.father);
	if(!oFather) {
		return;
	}

	var tree = document.createElement('ul');
	tree.setAttribute('id',this.name);
	tree.className = "mktree";
	tree.style.position = 'absolute';
	tree.style.top = this.v+'px';
	tree.style.left = this.h+'px';
	tree.style.height = this.myHeight+'px';
	tree.style.width = this.myWidth+'px';
	oFather.appendChild(tree);
	this.setLBody(tree);
}


Tree.prototype.setLBody = function (oLBody) {
	this.lBody = oLBody;
	var c = oLBody;
	if (typeof c.addEventListener != "undefined")
		c.addEventListener("click", this._listOnClick, false);
	else if (typeof c.attachEvent != "undefined")
		c.attachEvent("onclick", this._listOnClick);
	else
		c.onclick = this._listOnClick;
};

Tree.prototype.getValue = function(e) {
	if(this.lastClick) {
		var obj = this.lastClick;
		if(obj.tagName != 'SPAN') {
			var str=obj.innerHTML;
			str = str.replace(/^<[^>]+>[^>]+>/i,"");
			var content = str;
		} else {
			var content = "";
		}
		obj = obj.parentNode;
		var tmpContent="";
		while(obj.tagName == 'UL' || obj.tagName == 'LI' || obj.tagName == 'SPAN') {
			if(obj.tagName == 'LI') {
				if(obj.childNodes.item(0).innerHTML) {
					tmpContent = obj.childNodes.item(0).innerHTML;
					if (tmpContent.substr(0,6) != '&nbsp;') {
						tmpContent = tmpContent.substr(1);
					} else {
						tmpContent = tmpContent.substring(6,tmpContent.length);
					}
					content = tmpContent+'/'+content;
				}
			}
			obj = obj.parentNode;
		}
		return content;
	}
	return false;
}

Tree.prototype.listOnClick = function(e) {
	var el = e.target || e.srcElement;
	var itemName;
	this.selectItem(el);
	var myValue = this.getValue();
	if(this.myClickTree == 1) {
		//send the path to the clicked element + its internal name
		if (el.tagName == 'LI')
			itemName = el.id.substring(6,el.id.length); //simple item
		else
			itemName = el.parentNode.id.substring(6,el.parentNode.id.length); //sublist
		if (myValue != false) {
			sendMsg(this.myChecknum,this.mySignal,eval(this.mySync)+eyeParam('itemName',itemName));
		}
	}
}

Tree.prototype.selectItem = function(el) {
	if(el.tagName != "LI" && el.tagName != 'SPAN') {
		return true;
	}
	if(el.parentNode.className == 'liBullet') {
		el = el.parentNode;
	}
	if(this.lastClick) {
		this.lastClick.style.backgroundColor = '';
	}
	this.lastClick = el;
	el.style.backgroundColor = '#99CCFF';
}

function selectTreeItem(list,name) {
	var item = document.getElementById(name);
	if (item == null) { return false; }
	if(item.className == 'liOpen' || item.className == 'liClosed') {
		for(var i=0; i<item.childNodes.length; i++) {
			if (item.childNodes[i].tagName == 'SPAN') {
				item = item.childNodes[i];
				break;
			}
		}
	}
	expandToItem(list,name);
	eval('tree_'+list+'.selectItem(item)');
}

function addSubList(list,name) {
	var father = document.getElementById(list);
	var item = document.createElement('ul');
	item.setAttribute('id',name);
	father.appendChild(item);
}

function addItem(list, name, content) {
	var father = document.getElementById(list);
	var item = document.createElement('li');
	item.setAttribute('id',name);
	item.innerHTML = content;
	father.appendChild(item);
}
// Full expands a tree with a given ID
function expandTree(treeId) {
	var ul = document.getElementById(treeId);
	if (ul == null) { return false; }
	expandCollapseList(ul,nodeOpenClass);
}

// Fully collapses a tree with a given ID
function collapseTree(treeId) {
	var ul = document.getElementById(treeId);
	if (ul == null) { return false; }
	expandCollapseList(ul,nodeClosedClass);
}

// Expands enough nodes to expose an LI with a given ID
function expandToItem(treeId,itemId) {
	var ul = document.getElementById(treeId);
	if (ul == null) { return false; }
	var ret = expandCollapseList(ul,nodeOpenClass,itemId);
	if (ret) {
		var o = document.getElementById(itemId);
		if (o.scrollIntoView) {
			o.scrollIntoView(false);
		}
	}
}

// Performs 3 functions:
// a) Expand all nodes
// b) Collapse all nodes
// c) Expand all nodes to reach a certain ID
function expandCollapseList(ul,cName,itemId) {
	if (!ul.childNodes || ul.childNodes.length == 0) { return false; }
	// Iterate UL's children
	for (var i=0;i<ul.childNodes.length;i++) {
		var item = ul.childNodes[i];
		// Searched item has been reached
		if (itemId != null && item.id == itemId) { return true; }

		// Current item is a LI
		if (item.nodeName == "LI") {
			// Iterate things in this LI
			var itemHasSubList = false;
			var nbOfSubItems = 0;
			for (var j=0; j<item.childNodes.length; j++) {
				var subItem = item.childNodes[j];
				// Current sub item is a potential list
				if (subItem.nodeName=="UL") {
					// The sublist has children items
					if (subItem.childNodes.length > 0) {
						nbOfSubItems = subItem.childNodes.length;
					}
					itemHasSubList = true;
					var ret = expandCollapseList(subItem,cName,itemId);
					if (itemId!=null && ret) {
						item.className=cName;
						//That's is to evade some odd behaviour in the most sucking browser around the world,
						//Our friend, IE!
						//I've discover a secred style property to evade it, it's TETAS!
						xGetElementById('bakcground').style.tetas = '';
						return true;
					}
				}
				else {
					// The sub item is a final node
					if (subItem.nodeName == "LI") {
						nbOfSubItems = 1;
					}
				}
			}
			if (nbOfSubItems != 0 && itemHasSubList && itemId==null) {
				item.className = cName;
				xGetElementById('bakcground').style.tetas = '';
			}
		}
	}
}



function processList(ul) {
	if (!ul.childNodes || ul.childNodes.length==0) { return; }
	// Iterate LIs
	for (var itemi=0;itemi<ul.childNodes.length;itemi++) {
		var item = ul.childNodes[itemi];
		if (item.nodeName == "LI") {
			// Iterate things in this LI
			var subLists = false;
			for (var sitemi=0;sitemi<item.childNodes.length;sitemi++) {
				var sitem = item.childNodes[sitemi];
				if (sitem.nodeName=="UL") {
					subLists = true;
					processList(sitem);
				}
			}
			var s= document.createElement("SPAN");
			var t= '\u00A0'; // &nbsp;
			s.className = nodeLinkClass;
			if (subLists) {
				// This LI has UL's in it, so it's a +/- node
				if (item.className==null || item.className=="") {
					item.className = nodeClosedClass;
				}
				// If it's just text, make the text work as the link also
				if (item.firstChild.nodeName=="#text") {
					t = t+item.firstChild.nodeValue;
					item.removeChild(item.firstChild);
				}
				s.onclick = function () {
					this.parentNode.className = (this.parentNode.className==nodeOpenClass) ? nodeClosedClass : nodeOpenClass;
					return false;
				}
			}
			else {
				// No sublists, so it's just a bullet node
				item.className = nodeBulletClass;
				s.onclick = function () { return false; }
			}
			s.appendChild(document.createTextNode(t));
			item.insertBefore(s,item.firstChild);
		}
	}
}

function SimpleMenu_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var sFather = params["sFather"];
	var myFather = params["mFather"];
	var rFather = params['rFather'];
	var obj = document.getElementById(father);
	if(!obj) {
		return false;
	}

	var myMenu = document.createElement('div');
	myMenu.setAttribute('id',name);
	myMenu.widgetType = 'SimpleMenu';
	myMenu.className = 'eyeContextMenu';
	myMenu.style.display = 'none';
	if(IEversion && IEversion < 7){
		myMenu.style.position = 'absolute';
	}else{
		myMenu.style.position = 'fixed';
	}
	myMenu.style.zIndex = 9000000;
	if(myFather) {
		document.getElementById(myFather).appendChild(myMenu);
	} else {
		obj.appendChild(myMenu);
	}
	var openedDiv = name;
	var codeClick = "hideSimpleMenu('"+name+"');";
	addClickHandler(openedDiv,codeClick);
}

function showSimpleMenu(e,menuName,rFather) {
	if(lastMenu != "") {
		hideSimpleMenu(lastMenu);
	}
	lastMenu = menuName;
	var top = e.pageY;
	var left = e.pageX;
	if(IEversion && IEversion < 7){
		var father = document.getElementById(rFather);
		top = e.offsetY;
		left = e.offsetX;
		top += xTop(father);
		left += xLeft(father);
	}
	myMenu = document.getElementById(menuName);
	myMenu.style.top = top+'px';
	myMenu.style.left = left+'px';
	myMenu.style.display = 'block';
}

function addSimpleMenuEntry(menuName,text,entryName,signal,checknum,params,imgId) {
	var obj = document.getElementById(menuName);
	if(!obj) {
		return false;
	}

	var myEntry = document.createElement('div');
	myEntry.setAttribute('id',entryName);
	myEntry.className = 'eyeContextMenuEntry';
	myEntry.innerHTML = text;
	myEntry.onclick = function() { sendMsg(checknum,signal,params);};
	obj.appendChild(myEntry);
	fixPNG(imgId);
}

function hideSimpleMenu(menuName) {
	obj = document.getElementById(menuName);
	if(!obj) {
		return;
	}
	document.getElementById(menuName).style.display='none';
}

function ContextMenu_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var sFather = params["sFather"];
	var myFather = params["mFather"];
	var rFather = params['rFather'];
	var obj = document.getElementById(father);
	if(!obj) {
		return false;
	}

	var myMenu = document.createElement('div');
	myMenu.setAttribute('id',name);
	myMenu.className = 'eyeContextMenu';
	myMenu.widgetType = 'ContextMenu';
	myMenu.style.display = 'none';
	if(IEversion && IEversion < 7){
		myMenu.style.position = 'absolute';
	}else{
		myMenu.style.position = 'fixed';
	}
	myMenu.style.zIndex = 9000000;
	if(myFather) {
		document.getElementById(myFather).appendChild(myMenu);
	} else {
		obj.appendChild(myMenu);
	}
	obj.oncontextmenu = function(e) {
		var e = new xEvent(e);
		if(e.target.id == father || ( (e.target.parentNode.id == father) && (sFather == 1) ) ) {
			showContextMenu(e,name,rFather,myFather);
			return false;
		}
	}
	obj.onmousemove = function (e) {
		if (eyeKeyDown == 17) {
			var e = new xEvent(e);
			if (e.target.id == father || ((e.target.parentNode.id == father) && (sFather == 1))) {
				showContextMenu(e,name,rFather,myFather);
				eyeKeyDown = 0;
				return false;
			}
		}
	}

	var openedDiv = name;
	var codeClick = "hideContextMenu('"+name+"');";
	addClickHandler(openedDiv,codeClick);
}
lastMenu = "";
function showContextMenu(e,menuName,rFather,myFather) {
	if(lastMenu != "") {
		hideContextMenu(lastMenu);
	}
	lastMenu = menuName;
	var top = e.pageY;
	var left = e.pageX;
	if (IEversion && IEversion < 7) {
		var father = xGetElementById(rFather);
		top = e.offsetY;
		left = e.offsetX;
		top += xTop(father);
		left += xLeft(father);
	}
	myMenu = document.getElementById(menuName);
	myMenu.style.top = top+'px';
	myMenu.style.left = left+'px';
	myMenu.style.display = 'block';
}

function addContextEntry(menuName,text,entryName,signal,checknum,params,imgId) {
	var obj = document.getElementById(menuName);
	if(!obj) {
		return false;
	}

	var myEntry = document.createElement('div');
	myEntry.setAttribute('id',entryName);
	myEntry.className = 'eyeContextMenuEntry';
	myEntry.innerHTML = text;
	myEntry.onclick = function() { sendMsg(checknum,signal,params);};
	obj.appendChild(myEntry);
	fixPNG(imgId);
}

function hideContextMenu(menuName) {
	obj = document.getElementById(menuName);
	if(!obj) {
		return;
	}
	document.getElementById(menuName).style.display='none';
}

function Applet_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var height = params["height"];
	var width = params["width"];
	var codebase = params["codebase"];
	var visible = params["visible"];
	var appletParamsNames = getArrayArg(params["appletParamsNames"]);
	var appletParamsValues = getArrayArg(params["appletParamsValues"]);

	if(!IEversion || IEversion > 8) {
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
	createWidget(name+'_Container',father,myApplet,horiz,vert,x,y,width,height,"eyeApplet",cent,'px',visible,'Applet');
}

function Split_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var myheight = params["height"];
	var mywidth = params["width"];
	var orientation = parseInt(params["orientation"]);
	var position = params["position"];
	var visible = params["visible"];
	var sendResizeMsg = parseInt(params["sendResizeMsg"]);
	var sigResize = params["sigResize"];

	var globalContainer = document.createElement('div');
	globalContainer.className = 'eyeSplit';
	globalContainer.setAttribute('id',name+'_split');
	globalContainer.style.position='absolute';
	globalContainer.style
	if(visible == 1) {
		globalContainer.style.display='block';
	} else {
		globalContainer.style.display='none';
	}
	globalContainer.style.width = mywidth+'px';
	globalContainer.style.height = myheight+'px';

	var firstPanel = document.createElement('div');
	firstPanel.className = 'eyeSplitPanel';
	firstPanel.setAttribute('id',name+'_first');
	firstPanel.style.position='absolute';

	var lastPanel = document.createElement('div');
	lastPanel.className = 'eyeSplitPanel';
	lastPanel.setAttribute('id',name+'_last');
	lastPanel.style.position='absolute';

	var splitter = document.createElement('div');
	splitter.className = 'eyeSplitter';
	splitter.setAttribute('id',name+'_splitter');
	splitter.style.position='absolute';

	if(orientation == 1) { //vertical
		splitter.className = 'eyeSplitter_vertical';
		firstPanel.style.height = myheight+'px';
		firstPanel.style.left = '0px';
		firstPanel.style.top = '0px';
		lastPanel.style.height = myheight+'px';
		lastPanel.style.right = '0px';
		lastPanel.style.top = '0px';
		splitter.style.height = myheight+'px';
		splitter.style.width = '3px';
		splitter.style.top = '0px';
		splitter.style.cursor = 'w-resize';

		var totalWidth = mywidth - 3;

		splitter.style.left = position+'px';

		firstPanel.style.width = totalWidth - (totalWidth - position)+'px';
		lastPanel.style.width = totalWidth - position -1+'px';

	} else {
		splitter.className = 'eyeSplitter_horizontal';
		firstPanel.style.width = mywidth+'px';
		firstPanel.style.top = '0px';
		firstPanel.style.left = '0px';
		lastPanel.style.width = mywidth+'px';
		lastPanel.style.bottom = '0px';
		lastPanel.style.left = '0px';
		splitter.style.width = mywidth+'px';
		splitter.style.height = '3px';
		splitter.style.left = '0px';
		splitter.style.zIndex = '1';
		splitter.style.cursor = 's-resize';

		var totalHeight = myheight - 3;

		splitter.style.top = position +'px';

		firstPanel.style.height = totalHeight - (totalHeight - position)+'px';
		lastPanel.style.height = totalHeight - position-1+'px';
	}

	globalContainer.appendChild(firstPanel);
	globalContainer.appendChild(lastPanel);
	globalContainer.appendChild(splitter);

	xEnableDrag2(splitter,
		function(el, x, y, ev) {
			firstPanel.style.display = 'none';
			lastPanel.style.display = 'none';
		},null,function(el, x, y, ev) {
			var myY = el.style.top;
			myY = parseInt(myY.substring(0,myY.length-2));
			var myX = el.style.left;
			myX = parseInt(myX.substring(0,myX.length-2));
			if(orientation == 1) {
				position = myX;
				totalWidth = globalContainer.style.width;
				totalWidth = parseInt(totalWidth.substring(0,totalWidth.length-2))-3;
				firstPanel.style.width = totalWidth - (totalWidth - position)+'px';
				lastPanel.style.width = totalWidth - position-1+'px';
				sendMsg(checknum,sigResize,eyeParam('arg',totalWidth - (totalWidth - position))+eyeParam('arg',totalWidth - position));
			} else {
				position = myY;
				totalHeight = globalContainer.style.height;
				totalHeight = parseInt(totalHeight.substring(0,totalHeight.length-2))-3;
				firstPanel.style.height = totalHeight - (totalHeight - position)+'px';
				lastPanel.style.height = totalHeight - position-1+'px';
				sendMsg(checknum,sigResize,eyeParam('arg',totalHeight - (totalHeight - position))+eyeParam('arg',totalHeight - position));
			}
			firstPanel.style.display = 'block';
			lastPanel.style.display = 'block';
		}
	,globalContainer);

	createWidget(name+'_Container',father,globalContainer,horiz,vert,x,y,-1,-1,"eyeSplitContainer",cent, 'px', visible);
}

function splitter_setPosition(id,pos,orientation,checknum,sigResize) {
	var position = parseInt(pos);
	var globalContainer = document.getElementById(id+'_split');
	var firstPanel = document.getElementById(id+'_first');
	var lastPanel = document.getElementById(id+'_last');
	var splitter = document.getElementById(id+'_splitter');
	if(orientation == 1) {
		splitter.style.left = position+'px';
		totalWidth = globalContainer.style.width;
		totalWidth = parseInt(totalWidth.substring(0,totalWidth.length-2))-3;
		firstPanel.style.width = totalWidth - (totalWidth - position)+'px';
		lastPanel.style.width = totalWidth - position-1+'px';
		sendMsg(checknum,sigResize,eyeParam('arg',totalWidth - (totalWidth - position))+eyeParam('arg',totalWidth - position));
	} else {
		splitter.style.top = position+'px';
		totalHeight = globalContainer.style.height;
		totalHeight = parseInt(totalHeight.substring(0,totalHeight.length-2))-3;
		firstPanel.style.height = totalHeight - (totalHeight - position)+'px';
		lastPanel.style.height = totalHeight - position-1+'px';
		sendMsg(checknum,sigResize,eyeParam('arg',totalHeight - (totalHeight - position))+eyeParam('arg',totalHeight - position));
	}
}

function increaseWidth(ele,w) {
	var myEle = document.getElementById(ele);
	var myW = myEle.style.width;
	myW = parseInt(myW.substring(0,myW.length-2));
	myEle.style.width = myW+w+'px';
}

function increaseHeight(ele,h) {
	var myEle = document.getElementById(ele);
	var myH = myEle.style.height;
	myH = parseInt(myH.substring(0,myH.length-2));
	myEle.style.height = myH+h+'px';
}
