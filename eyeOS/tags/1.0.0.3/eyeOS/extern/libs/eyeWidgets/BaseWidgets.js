function Box_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var myheight = params["height"];
	var mywidth = params["width"];
	var title = params["title"];
			
	var theText = document.createTextNode(title);
	
	var oTable = document.createElement("TABLE");
	var oTBody = document.createElement("TBODY");
	var myTitle = document.createElement("DIV");
	myTitle.className = 'eyeBoxText';
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
	
	createWidget(name+'_Container',father,oTable,horiz,vert,x,y,-1,-1,"eyeBoxContainer",cent);
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
		myContainer.onclick = function(){sendMsg(checknum,sig,eval(sync))};
	}
	myButton.setAttribute('id',name);
	myContainer.appendChild(myButton);
	if(myContent) {
		myContainer.appendChild(myContent);
	}
	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,myWidth,myHeight,"eyeButton",cent);
}

function Calendar_show(params,name,father,x,y,horiz,vert,checknum,cent)
{
	var myWidth = params['width'];
	var myHeight = params['height'];	
	var selectFunc = params['selectFunc'];
	var globalDate = new Date();
	var globalMonth = globalDate.getMonth();
	var myDay = globalDate.getDate();
	var globalYear = globalDate.getFullYear();
	
	//Waiting for i18n
	var monthNames = new Array('January','February','March','April','May','June','July','August','September','October','November','December');

	var calendarBase = document.createElement('div');
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
	
	createWidget(name+'_Container',father,calendarBase,horiz,vert,x,y,myWidth,myHeight,"eyeCalendar",cent);
	
	function getRowsAndDate()
	{
		var rowsAndDate = document.createElement('div');
		rowsAndDate.setAttribute('id',name+'rowsAndDate');		
		rowsAndDate.style.position = 'absolute';
		rowsAndDate.style.width = '100%';
		rowsAndDate.style.height = '18%';	
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
		weekDaysNames.style.top = '18%';
			
			var leftCorner = document.createElement('div');
			leftCorner.setAttribute('id',name+'leftCorner');
			leftCorner.style.position = 'absolute';
			leftCorner.style.left = '6%';
			leftCorner.style.top = '0%';
			leftCorner.style.height = '100%';
			leftCorner.style.width = '6%';
			leftCorner.style.background = 'no-repeat';			
			if(IEversion == 6){
				leftCorner.style.backgroundImage = '';
				leftCorner.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader (src='index.php?extern=/apps/eyeX/themes/default/images/widgets/calendar_rowLeft.png', sizingMethod='scale');"
			}else{			
				leftCorner.style.backgroundImage ='url(index.php?extern=/apps/eyeX/themes/default/images/widgets/calendar_rowLeft.png)' ;		
			}
	
			var dayNameContent = document.createElement('div');
			dayNameContent.style.width = '78%';
			dayNameContent.style.height = '100%';
			dayNameContent.style.lineHeight = '100%';			
			dayNameContent.style.position = 'absolute';
			dayNameContent.style.left = '12%';
			dayNameContent.style.top = '0%';
			dayNameContent.style.backgroundColor = '#53A0E1';
				var dayNames = new Array('S','M','T','W','T','F','S');
				var left = 0;
				for(x=0;x<7;x++)
				{
					var dayName = document.createElement('div');
					dayName.style.left = left+'%'					
					dayName.style.width ='6.5%';
					dayName.style.height ='100%';
					dayName.style.lineHeight ='100%';
					dayName.style.position = 'absolute';
					dayName.style.color = params['dayName'];
					dayName.style.fontFamily = 'verdana';
					dayName.style.fontSize = '1em';
					var text = document.createTextNode(dayNames[x]);
					dayName.appendChild(text);
					dayNameContent.appendChild(dayName);			
					left = left+15;
				}
			
			var rightCorner = document.createElement('div');
			rightCorner.setAttribute('id',name+'rightCorner');
			rightCorner.style.position = 'absolute';
			rightCorner.style.right = '6%';
			rightCorner.style.top = '0%';
			rightCorner.style.height = '100%';
			rightCorner.style.width = '6%';
			rightCorner.style.background = 'no-repeat';
			if(IEversion == 6){
				rightCorner.style.backgroundImage = '';
				rightCorner.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader (src='index.php?extern=/apps/eyeX/themes/default/images/widgets/calendar_rowRight.png', sizingMethod='scale');"
				dayNameContent.style.backgroundColor = '#53A0E1';	
			}else{			
				rightCorner.style.backgroundImage='url(index.php?extern=/apps/eyeX/themes/default/images/widgets/calendar_rowRight.png)'
			}
		weekDaysNames.appendChild(leftCorner);
		weekDaysNames.appendChild(dayNameContent);
		weekDaysNames.appendChild(rightCorner);
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
		calendarBody.style.top = '30%';
							
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
			weekMonth.style.width = '100%';
			weekMonth.style.height = '16%';
			weekMonth.style.position = 'absolute';
			weekMonth.style.top = top+'%';
			weekMonth.style.left = '0%';
			var left = 11;
			var vdate = new Date();
			for(y=0;y<7;y++)
			{
				var weekDay = document.createElement('div');
				weekDay.style.position = 'absolute';
				weekDay.style.left = left+'%';
				weekDay.style.height = '100%';
				weekDay.style.width = '5%';
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
		var dayClicked = event.target.day;
		myDay = dayClicked;
		var selectDate = new Date();
		selectDate.setMonth(globalMonth);		
		selectDate.setYear(globalYear);
		selectDate.setDate(dayClicked);
		sendMsg(checknum,selectFunc,eyeParam('date',selectDate.getTime()));
	}
}
function Checkbox_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var text = params["text"];
	var checked = params["checked"];
	var enabled = params["enabled"];
	var visible = params["visible"];
	
	var myCheckbox = document.createElement('input');
	myCheckbox.setAttribute('type', 'checkbox');
	var myContainer = document.createElement('div');
	myContainer.setAttribute('id',name+'_textContainer');
	if (checked == 1) {
		myCheckbox.setAttribute('checked','true');
	}
	
	if (enabled == 0) {
		myCheckbox.disabled = 1;
	}
	
	if(visible == 0) {
		myCheckbox.style.visibility = 'hidden';
		myContainer.style.visibility = 'hidden';
	}	
	myCheckbox.setAttribute('id',name);
	myContainer.appendChild(myCheckbox);
	theText=document.createTextNode(text);
	myContainer.appendChild(theText);
	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,-1,-1,"eyeCheckbox",cent);
}
function Container_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var myheight = parseInt(params["height"]);
	var mywidth = parseInt(params["width"]);
	var unit = params["unit"];

	var myContainer = document.createElement("div");
	if(myheight > 0) {
		myContainer.style.height = myheight + unit;
	}
	if(mywidth > 0){
		myContainer.style.width = mywidth + unit;
	}
	myContainer.setAttribute('id',name);
	createWidget(name+'_Container',father,myContainer,horiz,vert,x,y,-1,-1,"eyeContainerContainer",cent,unit);
}
function Flash_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var height = params["height"];
	var width = params["width"];
	var src = params["src"];
	var visible = params["visible"];
	var flashParamsNames = getArrayArg(params["flashParamsNames"]);
	var flashParamsValues = getArrayArg(params["flashParamsValues"]);
	var myFlash = document.createElement("object");
	
	myFlash.setAttribute('width',width);
	myFlash.setAttribute('height',height);
	myFlash.setAttribute('data',src);
	myFlash.setAttribute('type','application/x-shockwave-flash');
	myFlash.setAttribute('id', name);
	
	
/*		var myTempParam = document.createElement('param');
		myTempParam.setAttribute('name','flashvars');
		myTempParam.setAttribute('value','src=http://127.0.0.1/eyeOS/sound.mp33&autostart=no&loop=no&jscontrol=true');
		myFlash.appendChild(myTempParam);*/
	for(key in flashParamsNames){
		var myTempParam = document.createElement('param');
		myTempParam.setAttribute('name',flashParamsNames[key]);
		myTempParam.setAttribute('value',flashParamsValues[key]);
		myFlash.appendChild(myTempParam);
	}
	if( visible == 0) {
	    myFlash.style.visibility = 'hidden';
	}
	createWidget(name+'_Container',father,myFlash,horiz,vert,x,y,width,height,"eyeFlash",cent);
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
	var content = params["content"];
	var myWidth = params["width"];
	var myHeight = params["height"];
	var myOnLoad = params["myonload"];
	var tooltip = params["tooltip"];
	
	var myGlobalContainer = document.createElement('div');
	myGlobalContainer.setAttribute('id',name+'_globalContainer');
	
	var myImage = document.createElement('img');
	myImage.setAttribute('title',tooltip);
	myImage.setAttribute('alt',tooltip);
	if(myOnLoad != "") {
		myImage.onload=function(){eval(myOnLoad);};
	}
	myImage.src = image;
	myImage.setAttribute('id','img_'+name);
		
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
	
	myIconText.innerHTML = text;
	
	myGlobalContainer.appendChild(myImage);
	myGlobalContainer.appendChild(myIconText);
	
	var myContent = document.createElement('input');
	myContent.setAttribute('type', 'hidden');
	myContent.setAttribute('id',name+'_Content');
	myContent.value = content;
	
	myGlobalContainer.appendChild(myContent);
	
	createWidget(name+'_Container',father,myGlobalContainer,horiz,vert,x,y,-1,-1,"eyeIcon",0);

	if (draggable==1) {
		makeDrag(name+'_Container',father,'iconDragUpdate',checknum,content,1);
	}
}
function iconDragUpdate(widgetid,ancientX,ancientY,newX,newY,checknum,content) {
	var movedX = newX - ancientX;
	var movedY = newY - ancientY;
	myContent = getArrayArg(content);

	var result="";
	for (var i in myContent) {
		result += eyeParam('arg'+i,myContent[i]);
	}
	if (movedX < 1 && movedX > (-1) && movedY < 1 && movedY > (-1)) {
		sendMsg(checknum,'Icon_Clicked',result);
	} else {
		var sendxml = eyeParam('eyeArg',eyeParam('content',content)+eyeParam('newX',newX)+eyeParam('newY',newY));
		sendMsg(checknum,'Icon_Moved',sendxml);
	}
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
	
	var myLabel = document.createElement('div');
	myLabel.setAttribute('id',name);
	if (visible == 0) {
		myLabel.style.visibility='hidden';
	} 
	if(dis == 0) {
		myLabel.onclick = function() {sendMsg(checknum,sig,eyeParam(name,text)+eval(sync))};
	}
	text = tinyMCE.entityDecode(text);
	var theText = document.createTextNode(text);
	myLabel.appendChild(theText);
	createWidget(name+'_Container',father,myLabel,horiz,vert,x,y,-1,-1,"eyeLabel",cent);
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
		myRadio.textContent = currentValue[1];
		alert(myRadio.textContent);
		myDiv.appendChild(myRadio);
	}
	//TODO make it run right
	if(checked && checked < content.length) {
		myRadio = document.getElementById(name+'_'+checked);

		if(myRadio) {
			myRadio.setAttribute('checked','checked');
		}
	}
	if(visible == 0) {
		myDiv.style.visibility = 'hidden';
	}	
	
	createWidget(name+'_Container',father,myDiv,horiz,vert,x,y,-1,-1,"eyeRadio",cent);
}
function SDI_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var docType = params["docType"];
	Window_show(params,name,father,x,y,horiz,vert,checknum,cent);
}
function Select_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var visible = params["visible"];
	var mywidth = params["width"];
	var optionlist = getArrayArg(params["optionlist"]);
	var enabled = params["params"];
	var mySelect = document.createElement("select");
	var myOption;
	var currentOption;
	
	for(i=0; i < optionlist.length; i++) {
		myOption = document.createElement("option");
		currentOption = getArrayArg(optionlist[i]);
		myOption.setAttribute('value',currentOption[1]);
		myOption.textContent = currentOption[0];
		mySelect.appendChild(myOption);
	}
	
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

	createWidget(name+'_Container',father,mySelect,horiz,vert,x,y,-1,-1,"eyeSelect",cent);
}
function Slider_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var minValue = params["minValue"];
	var maxValue = params["maxValue"];
	var currentValue = params["currentValue"];

	var sliderInput = document.createElement('div');
	sliderInput.setAttribute('class','slider-input');
	sliderInput.setAttribute('name',name);
	sliderInput.setAttribute('id',name);
	createWidget(name+'_Container',father,sliderInput,horiz,vert,x,y,-1,-1,"slider",cent);
	var s = new Slider(document.getElementById(name+'_Container'),document.getElementById(name));
	s.setMinimum(minValue);
	s.setMaximum(maxValue);
	s.setValue(currentValue);
}
function Range() {
	this._value = 0;
	this._minimum = 0;
	this._maximum = 100;
	this._extent = 0;

	this._isChanging = false;
}

Range.prototype.setValue = function (value) {
	value = Math.round(parseFloat(value));
	if (isNaN(value)) return;
	if (this._value != value) {
		if (value + this._extent > this._maximum)
			this._value = this._maximum - this._extent;
		else if (value < this._minimum)
			this._value = this._minimum;
		else
			this._value = value;
		if (!this._isChanging && typeof this.onchange == "function")
			 this.onchange();
	}
};

Range.prototype.getValue = function () {
	return this._value;
};

Range.prototype.setExtent = function (extent) {
	if (this._extent != extent) {
		if (extent < 0)
			this._extent = 0;
		else if (this._value + extent > this._maximum)
			this._extent = this._maximum - this._value;
		else
			this._extent = extent;
		if (!this._isChanging && typeof this.onchange == "function")
			this.onchange();
	}
};

Range.prototype.getExtent = function () {
	return this._extent;
};

Range.prototype.setMinimum = function (minimum) {
	if (this._minimum != minimum) {
		var oldIsChanging = this._isChanging;
		this._isChanging = true;

		this._minimum = minimum;

		if (minimum > this._value)
			this.setValue(minimum);
		if (minimum > this._maximum) {
			this._extent = 0;
			this.setMaximum(minimum);
			this.setValue(minimum)
		}
		if (minimum + this._extent > this._maximum)
			this._extent = this._maximum - this._minimum;

		this._isChanging = oldIsChanging;
		if (!this._isChanging && typeof this.onchange == "function")
			this.onchange();
	}
};

Range.prototype.getMinimum = function () {
	return this._minimum;
};

Range.prototype.setMaximum = function (maximum) {
	if (this._maximum != maximum) {
		var oldIsChanging = this._isChanging;
		this._isChanging = true;

		this._maximum = maximum;

		if (maximum < this._value)
			this.setValue(maximum - this._extent);
		if (maximum < this._minimum) {
			this._extent = 0;
			this.setMinimum(maximum);
			this.setValue(this._maximum);
		}
		if (maximum < this._minimum + this._extent)
			this._extent = this._maximum - this._minimum;
		if (maximum < this._value + this._extent)
			this._extent = this._maximum - this._value;

		this._isChanging = oldIsChanging;
		if (!this._isChanging && typeof this.onchange == "function")
			this.onchange();
	}
};

Range.prototype.getMaximum = function () {
	return this._maximum;
};

Slider.isSupported = typeof document.createElement != "undefined" &&
	typeof document.documentElement != "undefined" &&
	typeof document.documentElement.offsetWidth == "number";


function Slider(oElement, oInput, sOrientation) {
	if (!oElement) return;
	this._orientation = sOrientation || "horizontal";
	this._range = new Range();
	this._range.setExtent(0);
	this._blockIncrement = 10;
	this._unitIncrement = 1;
	this._timer = new Timer(100);


	if (Slider.isSupported && oElement) {

		this.document = oElement.ownerDocument || oElement.document;

		this.element = oElement;
		this.element.slider = this;
		this.element.unselectable = "on";

		// add class name tag to class name
		this.element.className = this._orientation + " " + this.classNameTag + " " + this.element.className;

		// create line
		this.line = this.document.createElement("DIV");
		this.line.className = "line";
		this.line.unselectable = "on";
		this.line.appendChild(this.document.createElement("DIV"));
		this.element.appendChild(this.line);

		// create handle
		this.handle = this.document.createElement("DIV");
		this.handle.className = "handle";
		this.handle.unselectable = "on";
		this.handle.appendChild(this.document.createElement("DIV"));
		this.handle.firstChild.appendChild(
			this.document.createTextNode(String.fromCharCode(160)));
		this.element.appendChild(this.handle);
	}

	this.input = oInput;

	// events
	var oThis = this;
	this._range.onchange = function () {
		oThis.recalculate();
		if (typeof oThis.onchange == "function")
			oThis.onchange();
	};

	if (Slider.isSupported && oElement) {
		this.element.onfocus		= Slider.eventHandlers.onfocus;
		this.element.onblur			= Slider.eventHandlers.onblur;
		this.element.onmousedown	= Slider.eventHandlers.onmousedown;
		this.element.onmouseover	= Slider.eventHandlers.onmouseover;
		this.element.onmouseout		= Slider.eventHandlers.onmouseout;
		this.element.onkeydown		= Slider.eventHandlers.onkeydown;
		this.element.onkeypress		= Slider.eventHandlers.onkeypress;
		this.element.onmousewheel	= Slider.eventHandlers.onmousewheel;
		this.handle.onselectstart	=
		this.element.onselectstart	= function () { return false; };

		this._timer.ontimer = function () {
			oThis.ontimer();
		};

		// extra recalculate for ie
		window.setTimeout(function() {
			oThis.recalculate();
		}, 1);
	}
	else {
		this.input.onchange = function (e) {
			oThis.setValue(oThis.input.value);
		};
	}
}

Slider.eventHandlers = {

	// helpers to make events a bit easier
	getEvent:	function (e, el) {
		if (!e) {
			if (el)
				e = el.document.parentWindow.event;
			else
				e = window.event;
		}
		if (!e.srcElement) {
			var el = e.target;
			while (el != null && el.nodeType != 1)
				el = el.parentNode;
			e.srcElement = el;
		}
		if (typeof e.offsetX == "undefined") {
			e.offsetX = e.layerX;
			e.offsetY = e.layerY;
		}

		return e;
	},

	getDocument:	function (e) {
		if (e.target)
			return e.target.ownerDocument;
		return e.srcElement.document;
	},

	getSlider:	function (e) {
		var el = e.target || e.srcElement;
		while (el != null && el.slider == null)	{
			el = el.parentNode;
		}
		if (el)
			return el.slider;
		return null;
	},

	getLine:	function (e) {
		var el = e.target || e.srcElement;
		while (el != null && el.className != "line")	{
			el = el.parentNode;
		}
		return el;
	},

	getHandle:	function (e) {
		var el = e.target || e.srcElement;
		var re = /handle/;
		while (el != null && !re.test(el.className))	{
			el = el.parentNode;
		}
		return el;
	},
	// end helpers

	onfocus:	function (e) {
		var s = this.slider;
		s._focused = true;
		s.handle.className = "handle hover";
	},

	onblur:	function (e) {
		var s = this.slider
		s._focused = false;
		s.handle.className = "handle";
	},

	onmouseover:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);
		var s = this.slider;
		if (e.srcElement == s.handle)
			s.handle.className = "handle hover";
	},

	onmouseout:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);
		var s = this.slider;
		if (e.srcElement == s.handle && !s._focused)
			s.handle.className = "handle";
	},

	onmousedown:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);
		var s = this.slider;
		if (s.element.focus)
			s.element.focus();

		Slider._currentInstance = s;
		var doc = s.document;

		if (doc.addEventListener) {
			doc.addEventListener("mousemove", Slider.eventHandlers.onmousemove, true);
			doc.addEventListener("mouseup", Slider.eventHandlers.onmouseup, true);
		}
		else if (doc.attachEvent) {
			doc.attachEvent("onmousemove", Slider.eventHandlers.onmousemove);
			doc.attachEvent("onmouseup", Slider.eventHandlers.onmouseup);
			doc.attachEvent("onlosecapture", Slider.eventHandlers.onmouseup);
			s.element.setCapture();
		}

		if (Slider.eventHandlers.getHandle(e)) {	// start drag
			Slider._sliderDragData = {
				screenX:	e.screenX,
				screenY:	e.screenY,
				dx:			e.screenX - s.handle.offsetLeft,
				dy:			e.screenY - s.handle.offsetTop,
				startValue:	s.getValue(),
				slider:		s
			};
		}
		else {
			var lineEl = Slider.eventHandlers.getLine(e);
			s._mouseX = e.offsetX + (lineEl ? s.line.offsetLeft : 0);
			s._mouseY = e.offsetY + (lineEl ? s.line.offsetTop : 0);
			s._increasing = null;
			s.ontimer();
		}
	},

	onmousemove:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);

		if (Slider._sliderDragData) {	// drag
			var s = Slider._sliderDragData.slider;

			var boundSize = s.getMaximum() - s.getMinimum();
			var size, pos, reset;

			if (s._orientation == "horizontal") {
				size = s.element.offsetWidth - s.handle.offsetWidth;
				pos = e.screenX - Slider._sliderDragData.dx;
				reset = Math.abs(e.screenY - Slider._sliderDragData.screenY) > 100;
			}
			else {
				size = s.element.offsetHeight - s.handle.offsetHeight;
				pos = s.element.offsetHeight - s.handle.offsetHeight -
					(e.screenY - Slider._sliderDragData.dy);
				reset = Math.abs(e.screenX - Slider._sliderDragData.screenX) > 100;
			}
			s.setValue(reset ? Slider._sliderDragData.startValue :
						s.getMinimum() + boundSize * pos / size);
			return false;
		}
		else {
			var s = Slider._currentInstance;
			if (s != null) {
				var lineEl = Slider.eventHandlers.getLine(e);
				s._mouseX = e.offsetX + (lineEl ? s.line.offsetLeft : 0);
				s._mouseY = e.offsetY + (lineEl ? s.line.offsetTop : 0);
			}
		}

	},

	onmouseup:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);
		var s = Slider._currentInstance;
		var doc = s.document;
		if (doc.removeEventListener) {
			doc.removeEventListener("mousemove", Slider.eventHandlers.onmousemove, true);
			doc.removeEventListener("mouseup", Slider.eventHandlers.onmouseup, true);
		}
		else if (doc.detachEvent) {
			doc.detachEvent("onmousemove", Slider.eventHandlers.onmousemove);
			doc.detachEvent("onmouseup", Slider.eventHandlers.onmouseup);
			doc.detachEvent("onlosecapture", Slider.eventHandlers.onmouseup);
			s.element.releaseCapture();
		}

		if (Slider._sliderDragData) {	// end drag
			Slider._sliderDragData = null;
		}
		else {
			s._timer.stop();
			s._increasing = null;
		}
		Slider._currentInstance = null;
	},

	onkeydown:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);
		//var s = Slider.eventHandlers.getSlider(e);
		var s = this.slider;
		var kc = e.keyCode;
		switch (kc) {
			case 33:	// page up
				s.setValue(s.getValue() + s.getBlockIncrement());
				break;
			case 34:	// page down
				s.setValue(s.getValue() - s.getBlockIncrement());
				break;
			case 35:	// end
				s.setValue(s.getOrientation() == "horizontal" ?
					s.getMaximum() :
					s.getMinimum());
				break;
			case 36:	// home
				s.setValue(s.getOrientation() == "horizontal" ?
					s.getMinimum() :
					s.getMaximum());
				break;
			case 38:	// up
			case 39:	// right
				s.setValue(s.getValue() + s.getUnitIncrement());
				break;

			case 37:	// left
			case 40:	// down
				s.setValue(s.getValue() - s.getUnitIncrement());
				break;
		}

		if (kc >= 33 && kc <= 40) {
			return false;
		}
	},

	onkeypress:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);
		var kc = e.keyCode;
		if (kc >= 33 && kc <= 40) {
			return false;
		}
	},

	onmousewheel:	function (e) {
		e = Slider.eventHandlers.getEvent(e, this);
		var s = this.slider;
		if (s._focused) {
			s.setValue(s.getValue() + e.wheelDelta / 120 * s.getUnitIncrement());
			// windows inverts this on horizontal sliders. That does not
			// make sense to me
			return false;
		}
	}
};



Slider.prototype.classNameTag = "dynamic-slider-control",

Slider.prototype.setValue = function (v) {
	this._range.setValue(v);
	this.input.value = this.getValue();
};

Slider.prototype.getValue = function () {
	return this._range.getValue();
};

Slider.prototype.setMinimum = function (v) {
	this._range.setMinimum(v);
	this.input.value = this.getValue();
};

Slider.prototype.getMinimum = function () {
	return this._range.getMinimum();
};

Slider.prototype.setMaximum = function (v) {
	this._range.setMaximum(v);
	this.input.value = this.getValue();
};

Slider.prototype.getMaximum = function () {
	return this._range.getMaximum();
};

Slider.prototype.setUnitIncrement = function (v) {
	this._unitIncrement = v;
};

Slider.prototype.getUnitIncrement = function () {
	return this._unitIncrement;
};

Slider.prototype.setBlockIncrement = function (v) {
	this._blockIncrement = v;
};

Slider.prototype.getBlockIncrement = function () {
	return this._blockIncrement;
};

Slider.prototype.getOrientation = function () {
	return this._orientation;
};

Slider.prototype.setOrientation = function (sOrientation) {
	if (sOrientation != this._orientation) {
		if (Slider.isSupported && this.element) {
			// add class name tag to class name
			this.element.className = this.element.className.replace(this._orientation,
									sOrientation);
		}
		this._orientation = sOrientation;
		this.recalculate();

	}
};

Slider.prototype.recalculate = function() {
	if (!Slider.isSupported || !this.element) return;

	var w = this.element.offsetWidth;
	var h = this.element.offsetHeight;
	var hw = this.handle.offsetWidth;
	var hh = this.handle.offsetHeight;
	var lw = this.line.offsetWidth;
	var lh = this.line.offsetHeight;

	// this assumes a border-box layout

	if (this._orientation == "horizontal") {
		this.handle.style.left = (w - hw) * (this.getValue() - this.getMinimum()) /
			(this.getMaximum() - this.getMinimum()) + "px";
		this.handle.style.top = (h - hh) / 2 + "px";

		this.line.style.top = (h - lh) / 2 + "px";
		this.line.style.left = hw / 2 + "px";
		//this.line.style.right = hw / 2 + "px";
		this.line.style.width = Math.max(0, w - hw - 2)+ "px";
		this.line.firstChild.style.width = Math.max(0, w - hw - 4)+ "px";
	}
	else {
		this.handle.style.left = (w - hw) / 2 + "px";
		this.handle.style.top = h - hh - (h - hh) * (this.getValue() - this.getMinimum()) /
			(this.getMaximum() - this.getMinimum()) + "px";

		this.line.style.left = (w - lw) / 2 + "px";
		this.line.style.top = hh / 2 + "px";
		this.line.style.height = Math.max(0, h - hh - 2) + "px";	//hard coded border width
		//this.line.style.bottom = hh / 2 + "px";
		this.line.firstChild.style.height = Math.max(0, h - hh - 4) + "px";	//hard coded border width
	}
};

Slider.prototype.ontimer = function () {
	var hw = this.handle.offsetWidth;
	var hh = this.handle.offsetHeight;
	var hl = this.handle.offsetLeft;
	var ht = this.handle.offsetTop;

	if (this._orientation == "horizontal") {
		if (this._mouseX > hl + hw &&
			(this._increasing == null || this._increasing)) {
			this.setValue(this.getValue() + this.getBlockIncrement());
			this._increasing = true;
		}
		else if (this._mouseX < hl &&
			(this._increasing == null || !this._increasing)) {
			this.setValue(this.getValue() - this.getBlockIncrement());
			this._increasing = false;
		}
	}
	else {
		if (this._mouseY > ht + hh &&
			(this._increasing == null || !this._increasing)) {
			this.setValue(this.getValue() - this.getBlockIncrement());
			this._increasing = false;
		}
		else if (this._mouseY < ht &&
			(this._increasing == null || this._increasing)) {
			this.setValue(this.getValue() + this.getBlockIncrement());
			this._increasing = true;
		}
	}

	this._timer.start();
};

function Timer(nPauseTime) {
	this._pauseTime = typeof nPauseTime == "undefined" ? 1000 : nPauseTime;
	this._timer = null;
	this._isStarted = false;
}

Timer.prototype.start = function () {
	if (this.isStarted())
		this.stop();
	var oThis = this;
	this._timer = window.setTimeout(function () {
		if (typeof oThis.ontimer == "function")
			oThis.ontimer();
	}, this._pauseTime);
	this._isStarted = false;
};

Timer.prototype.stop = function () {
	if (this._timer != null)
		window.clearTimeout(this._timer);
	this._isStarted = false;
};

Timer.prototype.isStarted = function () {
	return this._isStarted;
};

Timer.prototype.getPauseTime = function () {
	return this._pauseTime;
};

Timer.prototype.setPauseTime = function (nPauseTime) {
	this._pauseTime = nPauseTime;
};

function Sortabletable_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var visible = params["visible"];
	var myTheader = getArrayArg(params["theader"]);
	var width = params["width"];
	var height = params["height"];
	var sizeUnit = params["sizeUnit"];
	var signal = params["signal"];
	var sortypes = getArrayArg(params["sortypes"]);
	var master = params["master"];
	var realName = params["realName"];
	var oTable = document.createElement("TABLE");
	var oTHead = document.createElement("THEAD");
	var oTBody = document.createElement("TBODY");
	var widget = document.createElement('div');
	widget.style.width=width+sizeUnit;
	widget.style.height=height+sizeUnit;
	widget.className='sort-table-container';
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
	
	/**
	for(i=0;i<myTbody.length;i++) {
		myRows = getArrayArg(myTbody[i]);
		oRow = document.createElement("TR");
		for(j=0;j<myRows.length;j++) {
			oCell = document.createElement("TD");
			oCell.innerHTML = myRows[j];
			if(myHiddens[j] == 1) {
				oCell.style.display = 'none';
			}
			oRow.appendChild(oCell);
		}
		oTBody.appendChild(oRow);
	}**/
	oTBody.setAttribute('id',name+'_Body');
	oTable.appendChild(oTBody);
	oTable.style.width=width+sizeUnit;
	oTable.setAttribute('id',name);
	oTable.className="sort-table";
	widget.appendChild(oTable);
	createWidget(name+'_Container',father,widget,horiz,vert,x,y,-1,-1,"eyeTable",cent);
	eval('table_'+name+' = new SortableTable(document.getElementById("'+name+'"),'+strSortypes+',"'+signal+'","'+master+'","'+realName+'","'+checknum+'","'+name+'");');
}
function SortableTable(oTable, oSortTypes, signal, master,rName,checknum,entireName) {

	this.sortTypes = oSortTypes || [];
	this.normalSort = oSortTypes;

	this.sortColumn = null;
	this.descending = null;
	this.lastClick = null;
	this.mySignal = signal;
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
	for(keyVar in sortypes) {
		if(sortypes[keyVar] == 'Hidden') {
			myHiddens[keyVar] = 1;
		} else {
			myHiddens[keyVar] = 0;
		}
	}
	for(i=0;i<myEntry.length;i++) {
		oCell = document.createElement("TD");
		oCell.innerHTML = myEntry[i];
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
	if (typeof c.addEventListener != "undefined")
		c.addEventListener("click", this._bodyOnclick, false);
	else if (typeof c.attachEvent != "undefined")
		c.attachEvent("onclick", this._bodyOnclick);
	else
		c.onclick = this._bodyOnclick;
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
		if (this.sortTypes[i] != null && this.sortTypes[i] != "None") {
			img = doc.createElement("IMG");
			img.src = "index.php?extern=apps/eyeX/themes/default/images/widgets/blank.png";
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
			c._sortType = "None";
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
		if (c._sortType != null && c._sortType != "None") {
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
		if (cells[i]._sortType != null && cells[i]._sortType != "None") {
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
	} 
};

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
		sendMsg(this.mychecknum,'ClickTable',eyeParam(this.realName,this.getSelectValue(this.myMaster)));
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

	// exit if None
	if (sSortType == "None")
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
	eval('tab_'+name+' = new eyeTab(document.getElementById("'+name+'"),"'+sig+'","'+checknum+'");');
}
//eyeTab class
function eyeTab(oTab,signal,mychecknum) {
	this.csignal = signal; //sigal to use when a tab is requested to be closed
	this.checknum = mychecknum; //checknum to send messages to eyeos
	this.lastClick = null; //store the last tab selected
	this.tabWidth = 80;
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
	var rows = params["rows"];
	var cols = params["cols"];
	var enabled = params["enabled"];
	var CcssClass = params["cssClass"];

	var myTextarea = document.createElement('textarea');
	myTextarea.setAttribute('id',name);
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
		createWidget(name+'_Container',father,myTextarea,horiz,vert,x,y,Wwidth,Hheight,CcssClass,cent);
	} else {
		myTextarea.className = 'eyeTextarea';
		createWidget(name+'_Container',father,myTextarea,horiz,vert,x,y,Wwidth,Hheight,"eyeTextareaContainer",cent);
	}
	
	if (rich == 1) {
		tinyMCE.execCommand('mceAddControl', false, name);
	}
}function Textbox_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	var text = params["text"];
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
}activeWindow = "";
zwindows = 10;
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
	var width = params["width"];
	var height = params["height"];
	var sendCloseMsg = params["sendCloseMsg"];
	var sendResizeMsg = params["sendResizeMsg"];
	var background = params["background"];
	var sigResize = params["sigResize"];
	var removeWin = parseInt(params["removeWin"]);
	var savePosition = params["savePosition"];
	var xChecknum = params["xChecknum"];
	
	var theText = document.createTextNode('');
	createWidget(name,father,theText,horiz,vert,x,y,width,height,"eyeWindowMain",cent);

	//createWidget (widgetid,father,content,horiz,vert,wx,wy,wwidth,wheight,wclass)
	//TYPES:
	/*
	NORMAL_WINDOW 1
	NOCLOSE_WINDOW 2
	NORESIZE_WINDOW 3
	FIXED_WINDOW 4
	NOLIST_WINDOW 5
	NOLIST_CLOSE_WINDOW 6
	LIST_CLOSE_WINDOW 7
	NOBORDER_WINDOW 100
	WIN_IMAGE_DRAGGABLE 101
	*/
	if (type < 100) {
		/* CreateWidgets for Title Bar */
		createWidget(name+"_WindowTitle",name,theText,0,0,-1,-1,-1,-1,"eyeWindowTitle",0);
		createWidget(name+"_WindowTitle_border_right",name+"_WindowTitle",theText,0,0,-1,-1,-1,-1,"eyeWindowTitle_border_right",0);
		createWidget(name+"_WindowTitle_border_left",name+"_WindowTitle",theText,0,0,-1,-1,-1,-1,"eyeWindowTitle_border_left",0);	
		createWidget(name+"_WindowTitle_center",name+"_WindowTitle",theText,0,0,-1,-1,-1,-1,"eyeWindowTitle_center",0);	
		createWidget(name+"_WindowTitle_text",name+"_WindowTitle",document.createTextNode(title),0,0,-1,-1,-1,-1,"eyeWindowTitle_text",0);	
	
		/* CreateWidgets for Window Bottom */
		createWidget(name+"_WindowBottom_center",name,theText,0,0,-1,-1,-1,-1,"eyeWindowBottom_center",0);	
		createWidget(name+"_WindowBottom_right",name,theText,0,0,-1,-1,-1,-1,"eyeWindowBottom_right",0);	
		createWidget(name+"_WindowBottom_left",name,theText,0,0,-1,-1,-1,-1,"eyeWindowBottom_left",0);	
		
		/* Left */
		createWidget(name+"_WindowLeft",name,theText,0,0,-1,-1,-1,-1,"eyeWindowLeft",0);	
	
		/* Right */
		createWidget(name+"_WindowRight",name,theText,0,0,-1,-1,-1,-1,"eyeWindowRight",0);	
			
		/* CreateWidgets for Window Content */
		createWidget(name+"_Content",name,theText,0,0,-1,-1,-1,-1,"eyeWindowContent",0);
	}
	
	if (type == 1) {
		createWidget(name+"_WindowMinimizeButton",name,theText,1,0,thirdButtonPosition,-1,-1,-1,"eyeWindowMinimizeButton",0);
		createWidget(name+"_WindowMaxButton",name,theText,1,0,secondButtonPosition,-1,-1,-1,"eyeWindowMaxButton",0);
		createWidget(name+"_WindowCloseButton",name,theText,1,0,firstButtonPosition,-1,-1,-1,"eyeWindowCloseButton",0);
		createWidget(name+"_WindowResizeButton",name,theText,0,0,-1,-1,-1,-1,"eyeWindowResizeButton",0);		
		makeWindow(name, title, father, "", checknum, name+"_WindowMaxButton",name+"_WindowResizeButton",name+"_WindowTitle",name+"_WindowCloseButton",name+"_WindowMinimizeButton",0,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,xChecknum);
	}
	
	else if (type == 2) {
		createWidget(name+"_WindowMinimizeButton",name,theText,1,0,secondButtonPosition,-1,-1,-1,"eyeWindowMinimizeButton",0);
		createWidget(name+"_WindowMaxButton",name,theText,1,0,firstButtonPosition,-1,-1,-1,"eyeWindowMaxButton",0);
		createWidget(name+"_WindowResizeButton",name,theText,0,0,-1,-1,-1,-1,"eyeWindowResizeButton",0);		
		makeWindow(name, title, father, "", checknum, name+"_WindowMaxButton",name+"_WindowResizeButton",name+"_WindowTitle",null,name+"_WindowMinimizeButton",0,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,xChecknum);
	}
	
	else if (type == 3) {
		createWidget(name+"_WindowMinimizeButton",name,theText,1,0,secondButtonPosition,-1,-1,-1,"eyeWindowMinimizeButton",0);
		createWidget(name+"_WindowCloseButton",name,theText,1,0,firstButtonPosition,-1,-1,-1,"eyeWindowCloseButton",0);		
		makeWindow(name, title, father, "", checknum, null,null,name+"_WindowTitle",name+"_WindowCloseButton",name+"_WindowMinimizeButton",0,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,xChecknum);
	}
	
	else if (type == 4) {
		makeWindow(name, title, father, "", checknum, null,null,null,null,0,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,xChecknum);
	}
	
	else if (type == 5) {
		makeWindow(name, title, father, "", checknum, null,null,name+"_WindowTitle",null,null,1,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,xChecknum);
	}
	else if (type == 6) {
		createWidget(name+"_WindowCloseButton",name,theText,1,0,firstButtonPosition,-1,-1,-1,"eyeWindowCloseButton",0);	
		makeWindow(name, title, father, "", checknum, null,null,name+"_WindowTitle",name+"_WindowCloseButton",null,1,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,xChecknum);
	}
	else if (type == 7) {
		createWidget(name+"_WindowCloseButton",name,theText,1,0,firstButtonPosition,-1,-1,-1,"eyeWindowCloseButton",0);	
		makeWindow(name, title, father, "", checknum, null,null,name+"_WindowTitle",name+"_WindowCloseButton",null,0,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,xChecknum);
	}
	else if (type == 100) {	
		createWidget(name+"_Content",name,theText,0,0,-1,-1,-1,-1,"eyeWindowContentInvisible",0);
		makeWindow(name, title, father, "", checknum, null,null,null,null,null,1,1,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,xChecknum);
	}
	else if (type == 101 && background != "") {	
		var myImage = document.createElement('img');
		myImage.setAttribute('id',name+'_background');
		myImage.src=background;
		var myDiv = document.createElement('div');
		myDiv.style.overflow = "hidden";
		myDiv.appendChild(myImage);
		createWidget(name+"_Content",name,myDiv,0,0,-1,-1,-1,-1,"eyeWindowContentInvisible",0);
		makeWindow(name, title, father, "", checknum, null,null,null,null,null,0,0,0,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,xChecknum);
		if(IEversion!=0) {
			fixPNG(myImage.id);
		}
	}

}

function makeWindow (widgetid,title,fatherid,afterfunction,checknum,maxButton,resButton,barId,closeButton,minButton,notList,notDrag,sendCloseMsg,sendResizeMsg,sigResize,removeWin,savePosition,xChecknum) {
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
	} else {
		var rightBorder = 0;
		var leftBorder = 0;
    	var barX_height = 0;
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
			myImgRight.setAttribute('src','index.php?extern=apps/eyeX/themes/default/images/desktop/right.png');
			myImgRight.onclick = function(e) {
				minArrowRight();
			}
			minIconRight.appendChild(myImgRight);
			
			var myImgLeft = document.createElement('img');
			myImgLeft.setAttribute('id','minIconLeft_img');
			myImgLeft.setAttribute('src','index.php?extern=apps/eyeX/themes/default/images/desktop/left.png');
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
					xZIndex(widget, zwindows);
					zwindows++;
					activeWindow = this.id;
				}
			} else {
				minimized = false;
				widget.style.display = 'block';
				barWin.className = "eyeWindowOnBar_On";
				activeWindow = this.id;
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
				xResizeTo(widget, xWidth(father)-leftBorder-rightBorder, xHeight(father)-barX_height-barX_height);
				xMoveTo(widget, leftBorder, barX_height);
				xMoveTo(widget,null,barX_height);
			}
			if(sendResizeMsg==1) {
				wndresize();
			}
		}
		mBtn.onclick = maxOnClick;
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
				sendMsg(checknum,'Close','');
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
		document.getElementById(widgetid+'_Content').style.display = 'none';
	}
	
	function wndresize() {
		document.getElementById(widgetid+'_Content').style.display = 'block';
		var wWidth = xWidth(widgetid);
		var wHeight = xHeight(widgetid);
		var myParams = eyeParam('arg',wWidth)+eyeParam('arg',wHeight);
		sendMsg(checknum,sigResize,myParams);
	}

	if (barId) {
		xEnableDrag(barId, begindrag, barOnDrag, callafterfunction);
	} else if(!notDrag) {
		xEnableDrag(widget,null,barOnDrag, callafterfunction);
	}
	
	function begindrag() {
		//document.getElementById(widgetid+'_Content').style.display = 'none';
	}
	
	function GoToTop()
	{
		activeWindow = this.id; //Set window active.
		xZIndex(widget, zwindows);
		zwindows++;
	}
	
	function barOnDrag(e, mdx, mdy)
	{
		var x = xLeft(widget) + mdx;
		var y = xTop(widget) + mdy;
		var xright = xWidth(father) - xWidth(widget) - rightBorder;
		var ybottom = xHeight(father) - xHeight(widget);
		if (x < leftBorder) x = leftBorder;
		if (y < barX_height) y = barX_height;
		if (x > xright) x = xright;
		if (y > ybottom - barWin_height) y = ybottom - barWin_height;
		xMoveTo(widget, x, y);
	}
	
	function callafterfunction()
	{
		//document.getElementById(widgetid+'_Content').style.display = 'block';
		/*if (afterfunction) {
			eval (afterfunction+'(\''+widgetid+'\','+xLeft(widget)+','+xTop(widget)+',\''+checknum+'\');');
		}*/	
		
		//If window have a savePosition set, send a sendMsg to eyeX savePosition event.		
		if(savePosition == 1){
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
	widget.onmousedown = GoToTop; 
	xShow(widget);
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
				xMoveTo(actWin,xLeft(actWin),-xHeight(actWin));
				xSlideTo(actWin,xLeft(actWin)-reduceWidth,-xHeight(actWin),1000);
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
