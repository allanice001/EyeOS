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
	
	if (IEversion == 0) {
		oCell = document.createElement("TD");
		oRow = document.createElement("TR");
		oCell.className='eyeBoxBottCent';	
		oCell.width = '100%';
		oRow.appendChild(oCell);
		oTBody.appendChild(oRow);
	}


	oTable.appendChild(oTBody);
	
	createWidget(name+'_Container',father,oTable,horiz,vert,x,y,-1,-1,"eyeBoxContainer",cent, 'px', visible);
}
function Line_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var mywidth = params['width'];
	var myheight = params['height'];
	var visible = params['visible'];
	
	var myLine = document.createElement('div');
	myLine.setAttribute('id',name);
	myLine.style.width = mywidth+'px';
	myLine.style.height = myheight+'px';
	myLine.style.backgroundColor = '#dddddd';
	createWidget(name+'_Container',father,myLine,horiz,vert,x,y,-1,-1,'eyeLineContainer',cent,'px',visible);
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
		myIframe.setAttribute('src','index.php?extern=libs/eyeWidgets/getMultipleFile.eyecode&type=dynamic&params[]='+checknum+'&params[]='+callback+'&params[]='+filename+'&params[]='+pid)
	}else{
		myIframe.setAttribute('src','index.php?extern=libs/eyeWidgets/getFile.eyecode&type=dynamic&params[]='+checknum+'&params[]='+callback+'&params[]='+filename+'&params[]='+pid)
	}	
	createWidget(name+'_Container',father,myIframe,horiz,vert,x,y,-1,-1,'eyeLineContainer',cent,'px',visible);
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
		createWidget(name+'_Container',father,divBox,horiz,vert,x,y,-1,-1,"eyeSimplebox",cent,'px',visible);
	}else{
		createWidget(name+'_Container',father,divBox,horiz,vert,x,y,-1,-1,"eyeSimpleboxNoBorder",cent,'px',visible);
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
		myButton.setAttribute('id',name);
		caption = tinyMCE.entityDecode(caption);
		theText=document.createTextNode(caption);
		myButton.appendChild(theText);
	}

	if(enabled == 0) {
		myButton.disabled=1;
	}
	
	if(myWidth > 0) {
		if(myImg != "") {
			myContainer.style.width = myWidth+'px';			
		} else {
			myButton.style.width = myWidth+'px';			
		}
	} 
	
	if(myHeight > 0) {
		if(myImg != "") {
			myContainer.style.height = myHeight+'px';
		} else {
			myButton.style.height = myHeight+'px';
		}
	}
	
	if(myImg != "") {
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
	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,myWidth,myHeight,"eyeButton",cent,'px',visible);
}
function Calendar_show(params,name,father,x,y,horiz,vert,checknum,cent)
{
	var myWidth = params['width'];
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
	
	createWidget(name+'_Container',father,calendarBase,horiz,vert,x,y,myWidth,myHeight,"eyeCalendar",cent,'px',visible);
	
	function getRowsAndDate()
	{
		var rowsAndDate = document.createElement('div');
		rowsAndDate.setAttribute('id',name+'rowsAndDate');		
		rowsAndDate.style.position = 'absolute';
		rowsAndDate.style.top = '2%';
		rowsAndDate.style.width = '100%';
		rowsAndDate.style.height = '12%';	
		rowsAndDate.style.color = params['rowsAndDate'];
		rowsAndDate.style.fontSize = '9px';
		rowsAndDate.style.fontWeight = 'bold';
		rowsAndDate.style.textAlign = 'center';
		
			var rowLeft = document.createElement('div');
			rowLeft.setAttribute('id',name+'rowLeft');
			rowLeft.style.position = 'absolute';
			rowLeft.style.left = '0%';
			rowLeft.style.width = '24%';
			rowLeft.style.height = '100%';
			rowLeft.style.cursor = 'pointer';
			xAddEventListener(rowLeft,'click',previousMonth);
			var text = document.createTextNode('<<');
			rowLeft.appendChild(text);
			
			var dateMiddle = document.createElement('div');
			dateMiddle.setAttribute('id',name+'dateMiddle');
			dateMiddle.style.position = 'absolute';
			dateMiddle.style.left = '24%';			
			dateMiddle.style.width = '52%';
			dateMiddle.style.height = '100%';
			text = document.createTextNode(monthNames[globalMonth]+' '+globalYear);
			dateMiddle.appendChild(text);

			var rowRight = document.createElement('div');
			rowRight.setAttribute('id',name+'rowRight');
			rowRight.style.position = 'absolute';
			rowRight.style.right = '0%';			
			rowRight.style.width = '24%';
			rowRight.style.height = '100%';
			rowRight.style.cursor = 'pointer';	
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
		weekDaysNames.style.width = '100%';
		weekDaysNames.style.height = '12%';
		weekDaysNames.style.position = 'absolute';
		weekDaysNames.style.top = '15%';
		weekDaysNames.style.left = '1px';
		weekDaysNames.style.backgroundColor = params['backgroundNames'];					
			var dayNameContent = document.createElement('div');
			dayNameContent.style.textAlign = 'center';				
				var left = 11;
				for(x=0;x<7;x++)
				{
					var dayName = document.createElement('div');
					dayName.style.left = left+'%'
					dayName.style.width ='9%';
					dayName.style.lineHeight ='136%';
					dayName.style.position = 'absolute';
					dayName.style.color = params['dayName'];
					dayName.style.fontSize = '1em';
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
		calendarBody.style.width = '100%';
		calendarBody.style.height = '70%';
		calendarBody.style.position = 'absolute';
		calendarBody.style.top = '25%';
		calendarBody.style.left = '1px';
							
		//Calculating the the month lenght.
		var preMonthLenght = getMonthDays(globalMonth-1);
		var monthLenght = getMonthDays(globalMonth);
		var nextMonthLenght = getMonthDays(globalMonth+1);

//Creating the array with day numbers.
		//First fill the first days of first week.
		var dayNums = new Array(0);//I will use push ,metoth
		var dayColors = new Array(0);
		var monthDay = new Array(0);
		for(x=dayOfWeek-1;x>=0;x--)
		{
			dayNums.push(preMonthLenght-x);
			
			dayColors.push(params['preMonthDays']);//Hardcoded at the moment			
		}
		//Fill all month day
		for(x=1;x<=monthLenght;x++)
		{
			dayNums.push(x);
			date.setDate(x);
			if(date.getDay() == 0 || date.getDay() == 6)
			{
				dayColors.push(params['weekEnd']);
			}else{
				dayColors.push(params['workDays']);//Hardcoded at the moment
			}
		}
		//Fill rest days
		var rest = 35-dayNums.length;
		for(x=1;x<=rest;x++)
		{
			dayNums.push(x);
			dayColors.push(params['nextMonthDays']);//Hardcoded at the moment
		}
		
		//Now, fill the body with days!
		var top = 7.5;//Hardcoded at the moment
		var count = 0;
		var vdate = new Date(); // for today
		for(x=0;x<5;x++)
		{
			var weekMonth = document.createElement('div');
			weekMonth.style.width = '99%';
			weekMonth.style.height = '16%';
			weekMonth.style.position = 'absolute';
			weekMonth.style.top = top+'%';
			weekMonth.style.left = '0%';
			if(weekHighlight != false && weekHighlight == x && drawHighlight != 0){
				weekMonth.style.backgroundColor = params['clickedWeek'];												
				weekMonth.style.borderColor = params['clickedWeek'];
				weekMonth.style.borderStyle = 'solid';
				weekMonth.style.borderWidth = '1px';				
			}
			var left = 11;
			var vdate = new Date();
			for(y=0;y<7;y++)
			{
				var weekDay = document.createElement('div');
				weekDay.style.position = 'absolute';
				weekDay.style.left = left+'%';
				weekDay.style.width = '9%';
				weekDay.style.textAlign = 'center';
				weekDay.style.height = '90%';
				weekDay.style.fontSize = '10px';				
				weekDay.style.fontFamily = 'verdana';
				weekDay.style.color = dayColors[count];
				//!!! the dayColors fix is only for some time, in the next version this days will send a correct data
				if(dayColors[count] != params['preMonthDays'] && dayColors[count] != params['nextMonthDays'])
				{
					weekDay.style.cursor = 'pointer';
					if(dayNums[count] == vdate.getDate() && globalMonth == vdate.getMonth() && globalYear == vdate.getFullYear()){
						weekDay.style.border = 'solid 1px';
						weekDay.style.borderColor = params['todayBorder'];
						weekDay.style.color = params['todayFontColor'];
						weekDay.style.backgroundColor = params['todayBackground'];
						
						weekMonth.style.backgroundColor = params['toWeekBackground'];												
						weekMonth.style.borderColor = params['toWeekBackground'];
						weekMonth.style.borderStyle = 'solid';
						weekMonth.style.borderWidth = '1px';						
						
						weekMonth.current = true;
						weekDay.current = true;
						weekHighlight = x;
					}
					if(drawServerDate != ''){
						if(dayNums[count] == drawServerDate.getDate() && globalMonth == drawServerDate.getMonth() && globalYear == drawServerDate.getFullYear()){						
							weekDay.style.border = 'solid 1px';
							weekDay.style.borderColor = params['clickedBorder'];
						
							weekMonth.style.backgroundColor = params['clickedWeek'];												
							weekMonth.style.borderColor = params['clickedWeek'];
							weekMonth.style.borderStyle = 'solid';
							weekMonth.style.borderWidth = '1px';
						
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
	var myCheckbox = document.createElement('input');
	myCheckbox.setAttribute('type', 'checkbox');
	var myContainer = document.createElement('div');
	myContainer.setAttribute('id',name+'_textContainer');
	if(checked == 1) {
		if(IEversion > 0) {
			myCheckbox.defaultChecked = true;
		} else { 
			myCheckbox.setAttribute('checked',true);
		}
	}
	
	if (enabled == 0) {
		myCheckbox.disabled = 1;
	}
	
	myCheckbox.setAttribute('id',name);
	myCheckbox.className = 'eyeCheckbox';
	myContainer.appendChild(myCheckbox);
	myContainer.className='eyeCheckboxText';
	theText=document.createTextNode(text);
	myContainer.appendChild(theText);
	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,-1,-1,"eyeCheckboxContainer",cent,'px',visible);
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
	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,-1,-1,"eyeContainerContainer",cent,unit,visible);
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
	
	if (IEversion == 0) {
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
	createWidget(name+'_Container',father,myFlash,horiz,vert,x,y,width,height,"eyeFlash",cent,'px',visible);
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
	
	var myGlobalContainer = document.createElement('div');
	myGlobalContainer.style.width='65px';
	myGlobalContainer.setAttribute('id',name+'_globalContainer');
	
	var myImage = document.createElement('img');
	if(myOnLoad != "") {
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
		if(IEversion > 1 && IEversion < 7) {
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
	
	createWidget(name+'_Container',father,myGlobalContainer,horiz,vert,x,y,-1,-1,"eyeIcon",0,'px',visible);
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
	}
}
widgetDrop_behaviours = [];
widgetDrops_ie = [];
dropIndex = 400;
function WidgetDrop_show(params,name,father,x,y,horiz,vert,checknum){
	//I don't know how it works under ie 8
	if(IEversion > 1 && IEversion < 8){		
		if(!widgetDrops_ie[checknum]){
			widgetDrops_ie[checknum] = [];
		}		
		widgetDrops_ie[checknum].push(father);		
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
		this.moveUpdate(drag.id,xLeft(drag),xTop(drag),drag.diffX,drag.diffY,drag.checknum,drag.content);
		drag.style.left = drag.diffX+'px';
		drag.style.top = drag.diffY+'px';
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
			var sendxml = eyeParam('eyeArg',eyeParam('content',myContent[0])+eyeParam('newX',newX)+eyeParam('newY',newY)+eyeParam('rName',myContent[4]),1);
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
		
		try{
			var left = xGetElementById('eyeApps').style.marginLeft;
			left = left.substr(0,left.length - 2);
		}catch(err){
			var left = null;
		}
		if(cursorPos == 0 && !left){
			startX = mouseX-event.offsetX;
			startY = mouseY-event.offsetY;
		//Position the mouse in the corner
		}else if(cursorPos == 0 && left){
			startX = mouseX-event.offsetX;
			startX = startX -left;
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
			xZIndex(dragWidget, zindex);zindex++;//Moving  it on top of layers
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
			widget.diffX +=  mouseDX;
			widget.diffY +=  mouseDY;
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
	createWidget(name+'_Container',father,myFrame,horiz,vert,x,y,-1,-1,"eyeIframe",cent,'px',visible);
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
		createWidget(name+'_Container',father,myImage,horiz,vert,x,y,myWidth,myHeight,myClass,cent,'px',visible);
	} else {
		createWidget(name+'_Container',father,myImage,horiz,vert,x,y,myWidth,myHeight,"eyeImagebox",cent,'px',visible);
	}
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
	createWidget(name+'_Container',father,myLabel,horiz,vert,x,y,-1,-1,"eyeLabel",cent,'px',visible);
}
function Radio_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var checked = params["checked"];
	var enabled = params["enabled"];
	var visible = params["visible"];
	var content = getArrayArg(params["content"]);
	var myDiv = document.createElement("div");
	var myRadio;
	var currentValue;

	for(i=0;i<content.length;i++) {
		currentValue = getArrayArg(content[i]);
		myRadio = document.createElement('input');
		myRadio.setAttribute('name',name);
		myRadio.setAttribute('id', name+'_'+i);
		myRadio.setAttribute('type','radio');
		myRadio.setAttribute('value',currentValue[0]);
		myRadio.innerHTML = currentValue[1];

		myDiv.appendChild(myRadio);
	}

	if(checked && checked < content.length) {
		myRadio = document.getElementById(name+'_'+checked);

		if(myRadio) {
			myRadio.setAttribute('checked','checked');
		}
	}
	createWidget(name+'_Container',father,myDiv,horiz,vert,x,y,-1,-1,"eyeRadio",cent,'px',visible);
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
	createWidget(name+'_Container',father,mySelect,horiz,vert,x,y,-1,-1,"",cent,'px',visible);
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
	createWidget(name+'_Container',father,widget,horiz,vert,x,y,-1,-1,"eyeTable",cent,sizeUnit,visible);
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
	var oRow = document.createElement("TR");
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
			img.src = "index.php?extern=apps/eyeX/themes/"+eyeTheme+"/images/widgets/blank.png";
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
			value:		this.getRowValue(r, sType, nColumn),
			element:	r
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
			case 3:	//TEXT_NODE
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
	if (win && typeof win.detachEvent != "undefined") {	// only IE needs this
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
//    string and casts it to a desired format. If left out the string is just
//    returned
// fCompareFunction : function ( n1 : T, n2 : T ) : Number - A normal JS sort
//    compare function. Takes two values and compares them. If left out less than,
//    <, compare is used
// fGetRowValue : function( oRow : HTMLTRElement, nColumn : int ) : T - A function
//    that takes the row and the column index and returns the value used to compare.
//    If left out then the innerText is first taken for the cell and then the
//    fGetValueFromString is used to convert that string the desired value and type

SortableTable.prototype.addSortType = function (sType, fGetValueFromString, fCompareFunction, fGetRowValue) {
	this._sortTypeInfo[sType] = {
		type:				sType,
		getValueFromString:	fGetValueFromString || SortableTable.idFunction,
		compare:			fCompareFunction || SortableTable.basicCompare,
		getRowValue:		fGetRowValue
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
	var caption = params["caption"];
	var sig = params["signal"];
	
	var myObj = document.createElement('div');
	myObj.setAttribute('id',name);
	myObj.className = 'eyeTab';
	if(mywidth > 0) {
		myObj.style.width = mywidth+'px';
	}
	if(myheight > 0) {
		myObj.style.height = myheight+'px';		
	}
	createWidget(name+'_Container',father,myObj,horiz,vert,x,y,-1,-1,"eyeTabContainer",cent);
	eval('tab_'+name+' = new eyeTab(document.getElementById("'+name+'"),"'+sig+'","'+checknum+'","' + parseInt(params["tabwidth"]) + '");');
}
//eyeTab class
function eyeTab(oTab,signal,mychecknum,tabwidth) {
	this.csignal = signal; //signal to use when a tab is requested to be closed
	this.checknum = mychecknum; //checknum to send messages to eyeos
	this.lastClick = null; //store the last tab selected
	this.tabWidth = tabwidth;
	this.initialOffset = 5;
	this.tabHeight = 23;
	this.myName = oTab.id;
	this.moTab = oTab;
	this.myTabs= new Array();

	var oThis = this; //get the instance of our tab group
	
	var myHeader = document.createElement('div');
	myHeader.setAttribute('id',oTab.id+'_header');
	myHeader.className = 'eyeTabHeader';
	myHeader.style.width = xWidth(oTab)+'px';
	
	oTab.appendChild(myHeader);
	
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
	var offset = counter * this.tabWidth + this.initialOffset;
	offset += 3;
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
		myContent.style.display='block';
		if(this.lastClick) {
			var tObj = document.getElementById(this.lastClick);
			if(tObj) {
				tObj.className = 'eyeTabNotSelected';
				var tContent = document.getElementById(tObj.id+'_Content');
				tContent.style.display = 'none';
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
		createWidget(name+'_Container',father,myTextarea,horiz,vert,x,y,Wwidth,Hheight,CcssClass,cent,'px',visible);
	} else {
		myTextarea.className = 'eyeTextarea';
		createWidget(name+'_Container',father,myTextarea,horiz,vert,x,y,Wwidth,Hheight,"eyeTextareaContainer",cent,'px',visible);
	}
	
	if (rich == 1) {
		tinyMCE.execCommand('mceAddControl', false, name);
	} else if(code == 1) {
			myTextarea.className ='codepress '+lang;
			eval("cp_"+name+" = new CodePress('"+myTextarea.id+"');");
			CodePress.path = 'index.php?extern=libs/eyeWidgets/codepress/';
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

	if(enabled == 0) {
		myTextbox.setAttribute('disabled',1);
	}

	if(noborder == 1) {
		myTextbox.style.border = 0;
		myTextbox.style.backgroundColor = "transparent";
	}
	
	myTextbox.setAttribute('id',name);
	myTextbox.className = 'eyeTextbox';
	
	createWidget(name+'_Container',father,myTextbox,horiz,vert,x,y,-1,-1,"eyeTextboxContainer",cent,'px',visible);
}activeWindow = "";

min_apps_width = 100;
min_apps_height = 70;
minspace=new Array();
openWindows=new Array();

firstButtonPosition = 6;
secondButtonPosition = 21;
thirdButtonPosition = 38;

function Window_show(params,name,father,x,y,horiz,vert,checknum,cent) {
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
	var createdWindow = createWidget(name,father,theText,horiz,vert,x,y,width,height,wCssMain,cent);

	createdWindow.dragBgColor = dragBgColor;
	createdWindow.dragBgAlpha = dragBgAlpha;
	createdWindow.showDragContent = showDragContent;
	//Getting window for set a few properties
	title = tinyMCE.entityDecode(title);
	
	if (type == 2) {
		createWidget(name+"_Content",name,theText,0,0,-1,-1,-1,-1,"eyeWindowContentInvisible",0);
		makeWindow(name, title, father, "", checknum, null,null,null,null,null,1,1,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,saveFunc,xChecknum,sigClose,noZindex);
	} else if ((type == 3 || type == 4) && background != "") {
		var myImage = document.createElement('img');
		myImage.setAttribute('id',name+'_background');
		myImage.src=background;
		if(IEversion == 6) {
			fixPNG(myImage.id);
		}
		var myDiv = document.createElement('div');
		myDiv.style.overflow = "hidden";
		myDiv.appendChild(myImage);
		createWidget(name+"_Content",name,myDiv,0,0,-1,-1,-1,-1,"eyeWindowContentInvisible",0);
		if(type == 3) {
			makeWindow(name, title, father, "", checknum, null,null,null,null,null,0,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,saveFunc,xChecknum,sigClose,noZindex,allDrag);
		} else {
			makeWindow(name, title, father, "", checknum, null,null,null,null,null,1,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,saveFunc,xChecknum,sigClose,noZindex,allDrag);
		}
		
		if (IEversion != 0) {
			fixPNG(myImage.id);
		}
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
		
		makeWindow(name,title,father,"",checknum,max,resize,showtitle,close,min,listed,nodrag,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,saveFunc,xChecknum,sigClose,noZindex,allDrag);
	}
}

function makeWindow (widgetid,title,fatherid,afterfunction,checknum,maxButton,resButton,barId,closeButton,minButton,notList,notDrag,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,saveFunc,xChecknum,sigClose,noZindex,allDrag) {	
	var widget = xGetElementById(widgetid);
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
	
	if (notList != 1) {
		var x, y, w, h, minimized, maximized = false;
		if (!minspace[fatherid]) {
			minspace[fatherid] = 0;
		}
		createWidget(widgetid+"_WindowOnBarContainer",fatherid,"",0,0,-1,-1,-1,-1,"eyeWindowOnBar_Container");
		var myTitleWinDiv = document.createElement('div');
		myTitleWinDiv.className='eyeWindowOnBar_text';
		myTitleWinDiv.innerHTML = title;
		createWidget(widgetid+"_WindowOnBar",widgetid+"_WindowOnBarContainer",myTitleWinDiv,0,1,minspace[fatherid],-1,-1,-1,"eyeWindowOnBar_On");
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
			myImgRight.setAttribute('src','index.php?extern=apps/eyeX/themes/'+eyeTheme+'/images/desktop/right.png');
			myImgRight.onclick = function(e) {
				minArrowRight();
			}
			minIconRight.appendChild(myImgRight);
			
			var myImgLeft = document.createElement('img');
			myImgLeft.setAttribute('id','minIconLeft_img');
			myImgLeft.setAttribute('src','index.php?extern=apps/eyeX/themes/'+eyeTheme+'/images/desktop/left.png');
			myImgLeft.onclick = function(e) {
				minArrowLeft();
			}
			minIconLeft.appendChild(myImgLeft);
			
			minIconLeft.style.display="block";
			minIconRight.style.display="block";
			minArrows = 1;
			if(IEversion!=0) {
				fixPNG(myImgRight.id);
				fixPNG(myImgLeft.id);
			}
		}
		
		function barWinOnClick()
		{
			if (!minimized) {
				if(activeWindow == this.id){
					minimized = true;
					widget.style.display = 'none';
					barWin.className = "eyeWindowOnBar_Off";
				}else{
					xZIndex(widget, zindex);
					zindex++;
					activeWindow = this.id;
				}
			} else {
				minimized = false;
				widget.style.display = 'block';
				barWin.className = "eyeWindowOnBar_On";
				activeWindow = this.id;
				xZIndex(widget, zindex);zindex++;
			}
		}
		barWin.onclick = barWinOnClick;	
		if (minBtn) {
			function minOnClick()
			{
				if (!minimized) {
					minimized = true;
					widget.style.display = 'none';
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
			} else {
				widget.style.display = 'none';
			}
			if(sendCloseMsg == 1) {
				sendMsg(checknum,sigClose,'');
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
		var wWidth = xWidth(widgetid);
		var wHeight = xHeight(widgetid);
		var myParams = eyeParam('arg',wWidth)+eyeParam('arg',wHeight);
		sendMsg(checknum,sigResize,myParams);
	}

	if (barId && !notDrag && !allDrag) {
		xEnableDrag(barId, begindrag, barOnDrag, callafterfunction);
	}
	if (allDrag && !notDrag) {
		xEnableDrag(widget, begindrag, barOnDrag, callafterfunction);
	}	
	function begindrag() {
		if(!xGetElementById(widgetid).showDragContent){
			widgetDragStart(widgetid);
		}
	}
	
	function GoToTop()
	{
		activeWindow = this.id; //Set window active.
		if(!noZindex){
			xZIndex(widget, zindex);
			zindex++;
			if(widgetDrops_ie[checknum]){
				for (var x in widgetDrops_ie[checknum]){
					var widgetX = xGetElementById(widgetDrops_ie[checknum][x]);
					xZIndex(widgetX, dropIndex);dropIndex++;
				}
			}
		}		
	}
	
	function barOnDrag(e, mdx, mdy)
	{
		var x = xLeft(widget) + mdx;
		var y = xTop(widget) + mdy;
		var xright = xWidth(father) - xWidth(widget) - rightBorder;
		var ybottom = xHeight(father) - xHeight(widget);
		
		if(document.getElementById(widgetid).parentNode.id == "eyeApps") {
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
		if(!xGetElementById(widgetid).showDragContent){
			widgetDragEnd(widgetid);
		}
		if(savePosition == 1){
			if(saveFunc != ''){
				try{
					sendMsg(checknum,saveFunc,eyeParam('x',xLeft(widget))+eyeParam('y',xTop(widget))+eyeParam('winName',widget.id));
				}catch(err){
					//alert(err);
				}
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
	window.style.backgroundColor = window.dragBgColor;
	updateOpacityOnce(window.dragBgAlpha, window)
}
function widgetDragEnd(widgetid){
	document.getElementById(widgetid+'_Content').style.display = 'block';
	xShow(widgetid+'_Content');
	var window = document.getElementById(widgetid);
	window.style.backgroundColor = 'transparent';
	updateOpacityOnce(100, window)
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
		xGetElementById(widgetid+"_WindowOnBarContainer").removeChild(barWin);
	}
}

function resOnDrag(e, mdx, mdy) {
	widget = e.parentNode;
	var x = xWidth(widget) + mdx;
	var y = xHeight(widget) + mdy;
	if (x < min_apps_width) x = min_apps_width;
	if (y < min_apps_height) y = min_apps_height;
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
	
	if(mywidth != "") {
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
	
	createWidget(name+'_Container',father,myProgress,horiz,vert,x,y,-1,-1,"eyeProgressContainer",cent,'px',visible);
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
	myBar.select = params['select'];
	obj.appendChild(myBar);
}

function addLineToBar(myToolbar) {
	var obj = document.getElementById(myToolbar);
	var container = document.createElement('div');	
	container.className = 'blockbarline';
	container.innerHTML = '&nbsp;';
	obj.appendChild(container);
}

function addItemToBar(myToolbar,itemName,itemImg,itemText,sync,checknum) {
	var obj = document.getElementById(myToolbar);
	var paintClick = obj.paintClick;
	var select = obj.select;
		
	var container = document.createElement('div');
	var myFriends = Base64.decode(sync);
	container.setAttribute('id',itemName+'_Container');
	container.className = 'blockbarItem';
	
	if(paintClick == 1){		
		container.onmousedown = function(){			
			container.className = 'blockbarItemPress';			
		}
		container.onmouseup = function(){
			container.className = 'blockbarItem';
		}
	}		
	
	var myImg = document.createElement('img');
	myImg.setAttribute('id',itemName+'_img');
	myImg.className = 'blockbarImg';
	myImg.setAttribute('src',itemImg);
	container.appendChild(myImg);
	
	var myText = document.createElement('div');
	myText.setAttribute('id',itemName+'_txt');
	myText.className = 'blockbarText';
	myText.innerHTML = itemText;
	container.appendChild(myText);
	container.onclick = function(){sendMsg(checknum,itemName,eval(myFriends))};
	obj.appendChild(container);
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
		while(obj.tagName == 'UL' || obj.tagName == 'LI' || obj.tagName == 'SPAN') { //si aun queda lista
			if(obj.tagName == 'LI') { //subimos hasta el siguiente li
				if(obj.childNodes.item(0).innerHTML) { //y bajamos un span
					tmpContent = obj.childNodes.item(0).innerHTML;
					tmpContent = tmpContent.substring(6,tmpContent.length);
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
			itemName = el.id.substring(6,el.id.length);							//simple item
		else
			itemName = el.parentNode.id.substring(6,el.parentNode.id.length);	//sublist
		sendMsg(this.myChecknum,this.mySignal,eval(this.mySync)+eyeParam('itemName',itemName));
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
			}
		}
	}
}


// A esta funcion se le pasa un objeto UL y lo convierte a arbol
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
	myMenu.className = 'eyeContextMenu';
	myMenu.style.display = 'none';
	if(IEversion == 6){
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
	if(IEversion == 6){
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

function addSimpleMenuEntry(menuName,text,entryName,signal,checknum,params) {
	var obj = document.getElementById(menuName);
	if(!obj) {
		return false;
	}
	
	var myEntry = document.createElement('div');
	myEntry.setAttribute('id',entryName);
	myEntry.className = 'eyeContextMenuEntry';
	myEntry.innerHTML = text;
	myEntry.onclick = function() { sendMsg(checknum,signal,params);};
	myEntry.onmouseover = function () {
		myEntry.style.backgroundColor = '#3B7CEF';
	}
	myEntry.onmouseout = function () {
		myEntry.style.backgroundColor = 'white';
	}
	obj.appendChild(myEntry);
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
	myMenu.style.display = 'none';
	if(IEversion == 6){
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
			if(IEversion == 6){
				showContextMenu(e,name,rFather);	
			}else{
				showContextMenu(e,name);	
			}			
			return false;
		}
	}
	var openedDiv = name;
	var codeClick = "hideContextMenu('"+name+"');";
	addClickHandler(openedDiv,codeClick);
}
lastMenu = "";
function showContextMenu(e,menuName,rFather) {
	if(lastMenu != "") {
		hideContextMenu(lastMenu);
	}
	lastMenu = menuName;
	var top = e.pageY;
	var left = e.pageX;
	if(IEversion == 6){
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

function addContextEntry(menuName,text,entryName,signal,checknum,params) {
	var obj = document.getElementById(menuName);
	if(!obj) {
		return false;
	}
	
	var myEntry = document.createElement('div');
	myEntry.setAttribute('id',entryName);
	myEntry.className = 'eyeContextMenuEntry';
	myEntry.innerHTML = text;
	myEntry.onclick = function() { sendMsg(checknum,signal,params);};
	myEntry.onmouseover = function () {
		myEntry.style.backgroundColor = '#3B7CEF';
	}
	myEntry.onmouseout = function () {
		myEntry.style.backgroundColor = 'white';
	}
	obj.appendChild(myEntry);
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
	
	createWidget(name+'_Container',father,myApplet,horiz,vert,x,y,width,height,"eyeApplet",cent,'px',visible);
}