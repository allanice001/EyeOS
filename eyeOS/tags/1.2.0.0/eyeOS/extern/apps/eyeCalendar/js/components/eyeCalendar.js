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
//Widget show Function
function  weekPlanner_show(params,name,father,x,y,horiz,vert,checknum,cent) {
	
	//Instance a weekPlanner controler object
	weekPlanner1 = new weekPlanner_class(params,name,father,x,y,horiz,vert,checknum,cent);
	//Getting a weekPlanner options (Viewmode,num of days etc).
	weekPlanner1.getUserI18n();
	weekPlanner1.addCalendar();
	
}

/*
*Now Is a class section, this will be in other file, but at the moment is here.
*
*/

//weekPlanner_class is the logic wrapper for gui actions, also send MSG to php world.
function weekPlanner_class(params,name,father,x,y,horiz,vert,checknum,cent)
{
	//Setting the arguments in class properties
	this.checknum = checknum;
	this.dayFrom = parseInt(params['dayFrom']);
	this.dayEven = parseInt(params['dayEven']);		
	this.hourFrom = parseInt(params['hourFrom']);
	this.hourEven = parseInt(params['hourEven']);	
	//Calculing some information
	this.daysCount = this.dayEven+1-this.dayFrom;	
	this.hoursCount = this.hourEven+1 - this.hourFrom;
	
	//Methods
	this.addCalendar = addCalendar;
	this.getUserI18n = getUserI18n;
	this.sendAddNote = sendAddNote;
	this.addCalendarNote = addCalendarNote;
	this.sendDelNote = sendDelNote;	
	this.delCalendarNote = delCalendarNote;
	this.changeCalendarNoteId = changeCalendarNoteId;
//Metoth definition section	

	/* Calendar manager functions:
	* This will be called from js and php for add calendars, every with diferent color (in the future).
	*/
	//Add calendar in weekplanner (At the moment, is only a big container).
	function addCalendar(){
		this.weekPlannerCalendar = new weekPlanner_Calendar(this,father);
		this.weekPlannerCalendar.getStyleVars();//Getting style var
		this.weekPlannerCalendar.drawCalendar(this);//Drawing a new calendar
	}
	
	//Deletting calendar in weekplanner
	function delCalendar(){
		//Remove the argument calendar.
		//TODO
	}
		
	/*Manage gui notes from calendar
	*This will be called from js and php and CRUD notes in some existing calendar. (in the future)
	*/
	
	//Add note in calendar.
	function addCalendarNote(hourFrom,hourEven,minFrom,minEven,day,textContent,id){
		//Add note in argument calendar
		//TODO
		this.weekPlannerCalendar.drawNote(hourFrom,hourEven,minFrom,minEven,day,textContent,id);
	}
	
	function delCalendarNote(id){
		this.weekPlannerCalendar.eraseNote(id);
	}

	function changeCalendarNoteId(oldId,newId){
		this.weekPlannerCalendar.changeNoteId(oldId,newId);
	}
	/*Send events section
	*In this section will be all sendEvent function for any CRUd or action.
	*/
	
	//Send evetns from calendar gui class.
	function sendAddNote(noteInfoContainer){
		var noteInfo = noteInfoContainer.getAllInfo();
		var sendMsgParam = '';
		for(var indice in noteInfo){
			sendMsgParam = sendMsgParam + eyeParam(indice,noteInfo[indice]);
		}
		sendMsg($checknum,'addNote',sendMsgParam);
	}
	
	function sendDelNote(id){
		sendMsgParam = eyeParam('id',id);
		sendMsg($checknum,'delNote',sendMsgParam);
	}
	
	/*Options
	*At the moment there is no I18n yet
	*/
	function getUserI18n()
	{
		//Calendar name, waiting for i18n
		//Names for days.
		//Here will be the i18n.
	}
}
		
function weekPlanner_Calendar(weekPlanner,father)
{

//Gettings vars
	this.father = xGetElementById(father)	
	if(this.father == null){
		//FTODO: put the error handler system?
		alert('Father has not properties');
	}
	this.weekPlanner = weekPlanner;//this is for comunicate gui with php world in event functions.
	this.checknum = weekPlanner.checknum;
	//Hours vars
	this.hourFrom = weekPlanner.hourFrom;
	this.hourEven = weekPlanner.hourEven;
	this.minFrom = weekPlanner.minFrom;
	this.minEven = weekPlanner.minEven;
	this.hoursCount = weekPlanner.hoursCount;
	//Days vars
	this.dayFrom = weekPlanner.dayFrom;
	this.dayEven = weekPlanner.dayEven;
	this.daysCount = weekPlanner.daysCount;	
	
//Methods
	this.getStyleVars = getStyleVars;
	this.drawCalendar = drawCalendar;
	this.drawCalendarDayName = drawCalendarDayName;
	this.drawCalendarDayTodo = drawCalendarDayTodo;
	this.drawCalendarHour = drawCalendarHour;
	this.drawCalendarDay = drawCalendarDay;
	
	this.drawNote = drawNote;
	this.eraseNote = eraseNote;	
	this.makeNoteDrag = makeNoteDrag;
	this.updateFromNameNote = updateFromNameNote;
	this.updateEvenNameNote = updateEvenNameNote;
	this.makeNoteResize = makeNoteResize;
	this.resizeHeightNote = resizeHeightNote;
	this.changeNoteId = changeNoteId;
	this.sendDragData = sendDragData;
	/*this.createNewNote = createNewNote;
	this.addGuiNote = addGuiNote;*/

	//Events vars because in xGetElementById this functions don't have a object properties.
	cThis = this;
	
//	this.notes = new Object();

	function drawCalendar(){
		//calendarBase.
		//Is the base for all calendar divs.
		this.calendarBase = document.createElement('div');
		this.calendarBase.setAttribute('id',this.checknum+'_calendarBase');

		//Style for calendarBase
		this.calendarBase.className = 'calendarBase';
		this.calendarBase.style.width = this.calendarBaseWidth+'px';
	
		//calendarDayName
	//Is the base div for first row (spacer + days name).
		this.calendarDayName = document.createElement('div');
		this.calendarDayName.setAttribute('id',this.checknum+'_calendarDayName');	
		//Style for calendarDayName
		this.calendarDayName.className = 'calendarDayName';
		this.calendarDayName.style.width = this.calendarBaseWidth+'px';
	
	//calendarDayTodo
	//Is the base for second row (spacer + todo num).
		this.calendarDayTodo = document.createElement('div');
		this.calendarDayTodo.setAttribute('id',this.checknum+'_calendarDayTodo');	
		//Style for calendarDayName
		this.calendarDayTodo.className = 'calendarDayTodo';
		this.calendarDayTodo.style.width = this.calendarBaseWidth+'px';
		this.calendarDayTodo.style.width = '200px';
		
	//Left spacer for top	
	//It is a generic spacer 
		this.dayNameSpacer = document.createElement('div');
		this.dayNameSpacer.setAttribute('id',this.checknum+'_dayNameSpacer');	
		//the css
		this.dayNameSpacer.className = 'dayNameSpacer';
		
	//Right spacer 
		this.dayNameSpacer2 = document.createElement('div');
		this.dayNameSpacer2.setAttribute('id',this.checknum+'_dayNameSpacer2');
		this.dayNameSpacer2.className = 'dayNameSpacer2';
	
	//calendarBody
	//It is the base for hours and days.
		this.calendarBody = document.createElement('div');
		this.calendarBody.setAttribute('id',this.checknum+'calendarBody');
		//the css
		this.calendarBody.className = 'calendarBody';
		this.calendarBody.style.height = 33*this.calendarHoursDisplay+'px';
		this.calendarBody.style.width = this.calendarBaseWidth+'px';
		this.calendarBody.style.position = 'absolute';
		this.calendarBody.style.top = '42px';//TODO: Deshardcode this.
		this.calendarBody.style.overflow = 'auto';
		
		
	//hours container
	//Is the base for hours.
		this.calendarBodyHour = document.createElement('div');
		this.calendarBodyHour.setAttribute('id',this.checknum+'_calendarBodyHour');	
		//the css
		this.calendarBodyHour.className = 'calendarBodyHour';
		
	//days container
	//Container for days and his notes.	
		this.calendarBodyDay = document.createElement('div');
		this.calendarBodyDay.setAttribute('id',this.checknum+'_calendarBodyDay');
		
		//the css
		this.calendarBodyDay.style.left = '46px';		//TODO: deshardcode this.
		this.calendarBodyDay.style.position = 'absolute';
		this.calendarBodyDay.style.width = this.calendarDayWidth*this.daysCount+'px';
		this.calendarBodyDay.style.height = this.calendarHourHeight*this.hoursCount+'px';
			
	//Making the dom tree.			
		this.father.appendChild(this.calendarBase);			
			this.calendarBase.appendChild(this.calendarDayName);
				this.calendarDayName.appendChild(this.dayNameSpacer);
				this.drawCalendarDayName();
			this.calendarBase.appendChild(this.calendarDayTodo);
				this.calendarDayTodo.appendChild(this.dayNameSpacer);
				this.drawCalendarDayTodo();
			this.calendarBase.appendChild(this.calendarBody);
				this.calendarBody.appendChild(this.calendarBodyHour);
					this.drawCalendarHour();
				this.calendarBody.appendChild(this.calendarBodyDay);
					this.drawCalendarDay();
	}
	
	function drawCalendarDayName(){	
		var dayNameLeft = this.calendarHourRowWidth;		
		for(h=this.dayFrom;h<=this.dayEven;h++)
		{
			var dayName = document.createElement('div');
			dayName.setAttribute('id',this.checknum+'_dayName_'+h);			
			//css
			dayName.style.left = dayNameLeft+'px';
			dayName.style.width = this.calendarDayWidth+'px';
			dayName.style.height = '20px';
			dayName.style.position = 'absolute';
			dayName.style.textAlign = 'center';
			dayName.style.color = '#145689';
			
			//text name
			var text = document.createTextNode(this.daysNames[h]);
			dayName.appendChild(text);//Printing the name of the day.
			this.calendarDayName.appendChild(dayName);//daysTop is a global element.		
			dayNameLeft = dayNameLeft + this.calendarDayWidth;
		}	
	}
	
	
	function drawCalendarDayTodo()
	{	
		var dayNameLeft = this.calendarHourRowWidth;
		for(h=this.dayFrom;h<=this.dayEven;h++)
		{
			var dayName = document.createElement('div');
			dayName.setAttribute('id',this.checknum+'_dayTodo_'+h);
			//css		
			dayName.style.left = dayNameLeft+'px';
			dayName.style.width = this.calendarDayWidth+'px';
			dayName.className = 'dayName';
			if(h == this.dayEven)
			{
				dayName.style.borderRight = 'none';
			}
			if(h == this.dayFrom)
			{
				dayName.style.borderLeft = '1px solid gray';
			}
			this.calendarDayTodo.appendChild(dayName);
			dayNameLeft = dayNameLeft + this.calendarDayWidth;
		}	
	
		//try spacer right
		var spacer = document.createElement('div');
		spacer.style.width = '17px';
		spacer.style.position = 'absolute';
		spacer.style.left = dayNameLeft+'px';
		spacer.style.height = '16px';
		spacer.style.borderLeft = 'solid gray 1px';
		spacer.style.borderTop = 'solid gray 1px';
		spacer.style.borderBottom = 'solid gray 1px';
		this.calendarDayTodo.appendChild(spacer);
	}

	
	function drawCalendarHour()
	{
		for(h=this.hourFrom;h<=this.hourEven;h++)
		{
			var hour = document.createElement('div');
			hour.setAttribute('id','hour'+h);			
			//css
			hour.className = 'hour';
			//text
			var text = document.createTextNode(h+':00');//TODO: put hour format, pm/am 24hours more?
			hour.appendChild(text);
			this.calendarBodyHour.appendChild(hour);//calendarBodyHour is a global element.
		}
	}
	

	function drawCalendarDay(weekPlanner)
	{
		var dayNameLeft = 0;
		for(d=this.dayFrom;d<=this.dayEven;d++)
		{
			var weekDay = document.createElement('div');
			weekDay.setAttribute('id',this.checknum+'_day_'+d);
			//css		
			weekDay.style.left = dayNameLeft+'px';
			weekDay.style.width = this.calendarDayWidth+'px';//this is a global var
			weekDay.style.position = 'absolute';	
			var topPos = 0;
			//Creating the hours fields.
			for(h=this.hourFrom;h<=this.hourEven;h++)
			{
				var hour = document.createElement('div');
				hour.setAttribute('id','hour_'+d+'_'+h);
				//css
				hour.style.width = this.calendarDayWidth+'px';
				hour.style.top = topPos+'px';
				hour.className = 'hourDay';
				hour.day = d;//evade substr
				hour.hour = h;//evade substr
				if(d == this.dayFrom)
				{
					hour.style.borderLeft = '1px solid #999999';
				}
				if(d == this.dayEven)
				{
					hour.style.borderRight = 'none';
				}
	
				if(h == this.hourFrom)
				{
					hour.style.borderTop = '1px solid #999999';
				}
				
				var halfHourTop = document.createElement('div');
				halfHourTop.setAttribute('id','halfHour_'+d+'_'+h+'_1');
				halfHourTop.style.width = this.calendarDayWidth+'px';
				halfHourTop.className = 'halfHourTop';
				halfHourTop.hour = h;
				halfHourTop.day = d;
				halfHourTop.half = 0;
				var halfHourBottom = document.createElement('div');
				halfHourBottom.setAttribute('id','halfHour_'+d+'_'+h+'_2');
				halfHourBottom.style.width = this.calendarDayWidth+'px';
				halfHourBottom.className = 'halfHourBottom';
				halfHourBottom.hour = h;
				halfHourBottom.day = d;
				halfHourBottom.half = 1;
 				xAddEventListener(hour,'mousedown',addClickNote);;
				
				//If this is today
				if(d == this.calendarToday)
				{
					hour.style.backgroundColor = '#EDF7FE';
				}
		
				hour.appendChild(halfHourTop); 
				hour.appendChild(halfHourBottom); 
			
				weekDay.appendChild(hour);
				topPos = topPos + this.calendarHourHeight;
			}
			this.calendarBodyDay.appendChild(weekDay);
			dayNameLeft = dayNameLeft + this.calendarDayWidth;
		}	
	}

	
	/*Draw notes functions
	*Crud gui notes
	*/
	
	function drawNote(hourFrom,hourEven,minFrom,minEven,day,textContent,id)
	{
	//Arguments Parses 
		//Parseints
			hourFrom = parseInt(hourFrom);
			hourEven = parseInt(hourEven);
			minFrom = parseInt(minFrom);
			minEven = parseInt(minEven);
			day = parseInt(day);
			id = parseInt(id);			
			dateMinFrom = minFrom;
			dateMinEven = minEven;
		//Parse base64
			if(textContent != cThis.defaultName){
				textContent = Base64.decode(textContent);
			}
		//Getting real minuts
			minFrom = Math.floor(minFrom * cThis.fraccion);
			minEven = Math.floor(minEven * cThis.fraccion);
		
	//Getting hourFrom and hourEven Elements
		var evenHour = document.getElementById('hour_'+day+'_'+hourEven);
		var fromHour = document.getElementById('hour_'+day+'_'+hourFrom);

	//Calculating some sizes
		//Notes base sizes:	
			//Calculating the pixel diferen between evenHour and from Hour.
			var diference = xTop(evenHour) - xTop(fromHour);//Diference between tops.
			
			//Calculating the top position. fraccion is global var calculed in eyeCalendar.js
			var top = minFrom + xTop(fromHour); 

			//Setting the left position.
			var left = 0;
			//Special settings for first  day notes, this is because the first day don't have a pre-day with right border.			
			if(day > 0)
			{
				left = (day*cThis.calendarDayWidth)+1;
			}else if(day == 0)
			{
				left = 1;
			}
			//Setting the noteHeight
			if(diference == 0)
			{
				var noteHeight = cThis.calendarNoteMinWidth;
			}else{
				var noteHeight = diference+minEven - minFrom;
			}			
			//Setting the noteWidth
			noteWidth = cThis.calendarDayWidth-1;	//-1 is  for border-Right, this will be disappear in next revision		
	//Creating div
		//Creating noteBase.
			var note = document.createElement('div');
			note.setAttribute('id',cThis.checknum+'_note_'+id);
			//Attributes			
			note.hourFrom = hourFrom;
			note.hourEven = hourEven;
			note.minFrom = minFrom;
			note.minEven = minEven;
			note.day = day;
			note.ID = id;
			note.title = textContent;
			note.state = 'none';
			//Adding note dymamic style
			note.style.height = noteHeight+'px';
			note.style.top = top+'px'
			note.style.left = left+'px';
			note.style.width = noteWidth+'px';
			note.style.position = 'absolute';
			//Creating name base
				var noteName = document.createElement('div');
				noteName.setAttribute('id',cThis.checknum+'_noteName_'+id);
				noteName.className = 'noteName';
				noteName.style.width = note.style.width;//Same as father	
				//This function update the div opacity, see eyeGraphics(2);
				updateOpacityOnce(cThis.calendarNoteOpacity,noteName);
				//Left corner of note and left part of note.
					var nameLeft = document.createElement('div');
					nameLeft.setAttribute('id',cThis.checknum+'_noteNameLeft_'+id);
					nameLeft.className = 'noteNameLeft';
				//Midle part of name
					var nameMidle = document.createElement('div');
					nameMidle.setAttribute('id',cThis.checknum+'_noteNameMiddle_'+id);
					nameMidle.className = 'noteNameMidle';
					nameMidle.style.width = noteWidth - (cThis.calendarNoteLeftCorn+cThis.calendarNoteRightCorn+cThis.calendarNoteRemoveButtonWidth)+'px';//Note with without corners			
					//text Container 
						var nameContainer = document.createElement('div');
						nameContainer.setAttribute('id',cThis.checknum+'_noteNameContainer_'+id);
						nameContainer.className = 'noteNameContainer';
						nameContainer.style.width = nameMidle.style.width;//Note with without corners
						//Txt object with hour range
							var text1 = document.createTextNode(hourFrom+':'+dateMinFrom);
							var text2 = document.createTextNode(' - ');
							var text3 = document.createTextNode(hourEven+':'+dateMinEven);
						nameContainer.appendChild(text1);
						nameContainer.appendChild(text2);
						nameContainer.appendChild(text3);
					nameMidle.nameContainer = nameContainer;
					nameMidle.appendChild(nameContainer);
				//Remove button
					var removeButton = document.createElement('div');
					removeButton.className = 'noteRemoveButton';
					removeButton.note = note;
				//Right corner of note and right part of note.
					var nameRight = document.createElement('div');
					nameRight.setAttribute('id',cThis.checknum+'_noteNameRight_'+id);
					nameRight.className = 'noteNameRight';
				//Adding events
					makeNoteDrag(nameRight,note,cThis.calendarBodyDay,saveData);/**Move note**/
					makeNoteDrag(nameMidle,note,cThis.calendarBodyDay,saveData);
					makeNoteDrag(nameLeft,note,cThis.calendarBodyDay,saveData);
					xAddEventListener(removeButton,'click',removeClickNote,0);	//Delete note
				//Adding parts and vars references for future use		
				noteName.nameLeft = nameLeft;
				noteName.nameMidle = nameMidle;
				noteName.nameRight = nameRight;
				noteName.appendChild(nameMidle);
				noteName.appendChild(nameLeft);
				noteName.appendChild(removeButton);
				noteName.appendChild(nameRight);
			//Creating body base
				//For no recalculate it
				var noteBodyHeight = noteHeight - (cThis.calendarNoteBottomHeight + cThis.calendarNoteNameHeight);
				
				var noteBody = document.createElement('div');
				noteBody.setAttribute('id',cThis.checknum+'_noteBody_'+id);
				noteBody.className = 'noteBody';
				if(IEversion == 6){
					noteBody.style.width = noteWidth -3+'px'; //-2 is for borders.
				}else{
					noteBody.style.width = noteWidth -2+'px'; //-2 is for borders.
				}
				noteBody.style.height = noteBodyHeight+'px';
				if(IEversion ==6){
					if(noteBodyHeight > 1){
						noteBody.style.height = noteBodyHeight-1+'px';
					}
				}
				//This function update the div opacity, see eyeGraphics(2);
				updateOpacityOnce(cThis.calendarNoteOpacity,noteBody);
				//bodyTop div this exists because textArea have a diferent event than rest of body.
					var bodyTop = document.createElement('div');
					bodyTop.setAttribute('id',cThis.checknum+'_noteBodyTop_'+id);
					bodyTop.className = 'noteBodyTop';
					bodyTop.style.width = noteBody.style.width;
				//bodyLeft
					var bodyLeft = document.createElement('div');
					bodyLeft.setAttribute('id',cThis.checknum+'_noteBodyLeft_'+id);
					bodyLeft.className = 'noteBodyLeft';
					if(noteBodyHeight >= cThis.calendarNoteBodyTop)
					{
						bodyLeft.style.height = noteBodyHeight-cThis.calendarNoteBodyTop+'px';
					}else{
						bodyLeft.style.height = '0px';
					}
				//bodyRight
					var bodyRight = document.createElement('div');
					bodyRight.setAttribute('id',cThis.checknum+'_noteBodyRight_'+id);
					bodyRight.className = 'noteBodyRight';
					if(noteBodyHeight >= cThis.calendarNoteBodyTop)
					{
						bodyRight.style.height = noteBodyHeight-cThis.calendarNoteBodyTop+'px';
					}else{
						bodyRight.style.height = '0px';
					}
					
				//bodyBottom
					var bodyContentWidth = (noteWidth-2) - cThis.calendarNoteTextAreaMargin*2;
					var bodyBottom = document.createElement('div');
					bodyBottom.setAttribute('id',cThis.checknum+'_noteBodyBottom_'+id);
					bodyBottom.className = 'noteBodyBottom';
					bodyBottom.style.height = noteBodyHeight/2+'px';
					bodyBottom.style.width = bodyContentWidth+'px';
				//Creating the text area...
					var textArea = document.createElement('textarea');
					textArea.style.position = 'absolute';
					textArea.className = 'noteTextArea';
					textArea.style.top = cThis.calendarNoteBodyTop+'px';
					textArea.style.left = cThis.calendarNoteTextAreaMargin+'px';
					textArea.style.width = bodyContentWidth+'px';
					if(noteBodyHeight >= 10)
					{
						textArea.style.height = noteBodyHeight-10+'px';//-10 is for botton with
					}else{
						textArea.style.height = '0px';
					}
					textArea.style.border = 'none';
					textArea.style.backgroundColor = '#2199ff';
					updateOpacityOnce(cThis.calendarNoteOpacity,textArea);					
					textArea.style.color = 'white';
					textArea.style.fontFamily = 'verdana';
					textArea.style.fontSize = '9px';
					textArea.value = textContent;
					textArea.note = note;
					if(noteBodyHeight == 0){
						textArea.style.display = 'none'
					}
					//TODO: put text in textarea
					note.Title = textContent;
				//Adding events
				cThis.makeNoteDrag(bodyTop,note,cThis.calendarBodyDay,saveData);
				cThis.makeNoteDrag(bodyLeft,note,cThis.calendarBodyDay,saveData);
				cThis.makeNoteDrag(bodyBottom,note,cThis.calendarBodyDay,saveData);
				cThis.makeNoteDrag(bodyRight,note,cThis.calendarBodyDay,saveData);
				xAddEventListener(textArea,'click',updateTitle,0);	//Edit note
	
				//Adding parts and vars references for future use		
				noteBody.bodyTop = bodyTop;
				noteBody.bodyLeft = bodyLeft;
				noteBody.bodyRight = bodyRight;
				noteBody.bodyBottom = bodyBottom;
				noteBody.textArea = textArea;
				noteBody.appendChild(bodyTop);
				noteBody.appendChild(bodyLeft);
				noteBody.appendChild(bodyRight);
				noteBody.appendChild(bodyBottom);
				noteBody.appendChild(textArea);
			//noteBottom
				var noteBottom = document.createElement('div');
				noteBottom.setAttribute('id',cThis.checknum+'_noteBottom_'+id);
				noteBottom.className = 'noteBottom';
				noteBottom.style.width = note.style.width;//Same as father	
				noteBottom.style.height = '10px';
				noteBottom.style.lineHeight = '10px';
				noteBottom.style.fontSize = '0';
				//Left corner of note and left part of note.
					var bottomLeft = document.createElement('div');
					bottomLeft.setAttribute('id',cThis.checknum+'_noteBottomLeft_'+id);
					bottomLeft.className = 'noteBottomLeft';
					bottomLeft.style.height = '10px';
					bottomLeft.style.lineHeight = '10px';
					bottomLeft.style.fontSize = '0';
				//Midle part of name
					var bottomMidle = document.createElement('div');
					bottomMidle.setAttribute('id',cThis.checknum+'_bottomMiddle_'+id);
					bottomMidle.className = 'noteBottomMidle';
					bottomMidle.style.width = noteWidth - (cThis.calendarNoteLeftCorn+cThis.calendarNoteRightCorn)+'px';//Note with without corner
					//This function update the div opacity, see eyeGraphics(2);
					updateOpacityOnce(cThis.calendarNoteOpacity,bottomMidle);
					bottomMidle.style.height = '9px';
					bottomMidle.style.lineHeight = '9px';
					bottomMidle.style.fontSize = '0';
				//Right corner of note and right part of note.
					var bottomRight = document.createElement('div');
					bottomRight.setAttribute('id',cThis.checknum+'_noteBottomRight_'+id);
					bottomRight.className = 'noteBottomRight';
					bottomRight.style.height = '10px';
					bottomRight.style.lineHeight = '10px';
					bottomRight.style.fontSize = '0';
				//Adding evetns
				cThis.makeNoteResize(noteBottom,note,saveData);
				//Adding parts and vars references for future use		
				noteBottom.bottomLeft = bottomLeft;
				noteBottom.bottomMidle = bottomMidle;
				noteBottom.bottomRight = bottomRight;
				noteBottom.appendChild(bottomMidle);
				noteBottom.appendChild(bottomLeft);
				noteBottom.appendChild(bottomRight);
			//Adding parts and vars references for future use
			note.noteName = noteName;
			note.noteBody = noteBody;
			note.noteBottom = noteBottom;			
			note.appendChild(noteName);	
			note.appendChild(noteBody);
			note.appendChild(noteBottom);
	cThis.calendarBodyDay.appendChild(note);
	return note;
	}

	function eraseNote(id){
		var note = document.getElementById(this.checknum+'_note_'+id);
		//TODO: in the future, this will can remove note from id or note element.
		this.calendarBodyDay.removeChild(note);
	}
	function changeNoteId(oldId,newId){
		var note = document.getElementById(this.checknum+'_note_'+oldId);
		note.setAttribute('id',this.checknum+'_note_'+newId);
		note.ID = newId;
	}
	function removeClickNote(e){
		var event = new xEvent(e);
		if(event.target.note.state == 'none'){
			cThis.eraseNote(event.target.note.ID);
			cThis.weekPlanner.sendDelNote(event.target.note.ID);		
		}		
	}
	
	function addClickNote(e)
	{				
		//Calculating the mins
		var event = new xEvent(e);
		var min = event.offsetY; 
		var y = 0;
		if(event.target.half == 1)
		{
			min = min + cThis.calendarHourHeight/2;
			min = Math.floor(min);//Delete the decimals
		}
		var event = new xEvent(e);
		y = event.pageY;
		mins = min /cThis.fraccion;
		mins = Math.floor(mins);		
	    	var date = new Date();
		var tmpId = date.getTime();		
		var hour = event.target.hour;
		var day = event.target.day;
		var note = cThis.drawNote(hour,hour,mins,mins+30,day,cThis.defaultName,tmpId);
		//Add day, month and year
		
		//Add to weekplanner hours array
		
		xAddEventListener(cThis.calendarBodyDay,'mouseup',stop,0);	
		xAddEventListener(cThis.calendarBodyDay,'mousemove',resizeNote,0);
		function resizeNote(e)
		{
			var event = new xEvent(e);		
			var diference = event.pageY - y;
			var newHeight = diference + xHeight(note);
			cThis.updateEvenNameNote(note,newHeight);
			cThis.resizeHeightNote(note,newHeight);
			y = event.pageY;			
		}
	
		function stop(e)
		{
			xRemoveEventListener(cThis.calendarBodyDay,'mousemove',resizeNote,0);	
			xRemoveEventListener(cThis.calendarBodyDay,'mouseup',stop,0);	
			var noteInfo = new Object();
			noteInfo['hourFrom'] = note.hourFrom;
			noteInfo['hourEven'] = note.hourEven;
			noteInfo['minFrom'] = note.minFrom;
			noteInfo['minEven'] = note.minEven;
			noteInfo['title'] = note.Title;
			noteInfo['wday'] = note.day;
			noteInfo['id'] = note.ID;
			//Make a note object
			var noteInfoContainer = new noteContainer(noteInfo);
			cThis.weekPlanner.sendAddNote(noteInfoContainer);
		}	
	}

    function makeNoteDrag (widgetid,note,father,afterfunction,checknum,content) {	
		var widget = xGetElementById(widgetid);
		var father = xGetElementById(father);
		var noteLeft = 0;
		var noteTop = 0;
		if (!widget) {
			return;
		}
		xEnableDrag(widget,savePositions,barOnDrag,upFunction);
	
		widget.onmousedown = downFunction;
		xShow(note);
		
		function upFunction(el,leftX,topY,e)
		{
			if(note.state == 'slide1'){			
				var eventX = leftX - xPageX(cThis.calendarBodyDay);
				var day = Math.floor(eventX / cThis.calendarDayWidth);
				var noteWidth = cThis.calendarDayWidth;
				var left = 0;
				if(day > 0)
				{
					left = (day*cThis.calendarDayWidth)+1;
					noteWidth = noteWidth -1;
				}else if(day == 0)
				{
					left = 1;
				}
				
				cThis.updateEvenNameNote(note,xHeight(note));
				cThis.updateFromNameNote(note);
				
				xSlideTo(note,left,xTop(note),cThis.slideTimeNoteEffect);
				note.state = 'slide2';
				var callback = 'cThis.sendDragData("'+day+'","'+note.id+'");';		

				xDisableDrag(note.noteName.nameRight.id,false);
				xDisableDrag(note.noteName.nameMidle,false);
				xDisableDrag(note.noteName.nameLeft,false);
				xDisableDrag(note.noteBody.bodyTop,false);
				xDisableDrag(note.noteBody.bodyLeft,false);
				xDisableDrag(note.noteBody.bodyBottom,false);
				xDisableDrag(note.noteBody.bodyRight,false);
				setTimeout("updateOpacity('"+note.id+"', 50, 100, 1000, '"+callback+"');",cThis.slideTimeNoteEffect);							
			}
		}
		
		function downFunction()
		{
			if(note.state == 'none'){			
				xZIndex(note, zindex);
				note.state = 'slide1';
				zindex++;
				updateOpacity(note.id, 100, 50, 350, '');				
			}
		}	
	
		function barOnDrag(e, mdx, mdy)
		{
			var x = xLeft(note) + mdx;
			var y = xTop(note) + mdy;
			var xright = xWidth(father) - xWidth(note);
			var ybottom = xHeight(father) - xHeight(note);
			if (x < 0) x = 0;
			if (y < 0) y = 0;
			if (x > xright) x = xright;
			if (y > ybottom) y = ybottom;
			xMoveTo(note, x, y);
		cThis.updateEvenNameNote(note,xHeight(note));
		cThis.updateFromNameNote(note);
		}
		function savePositions()
		{
			firstX = xLeft(note);
			firstY = xTop(note);
		}					
	}
		
	function makeNoteResize (widgetid,father,afterfunction) {	
		
		var widget = xGetElementById(widgetid);	
		var father = xGetElementById(father);
		if (!widget) {
			return;
		}
		xEnableDrag(widget,savePositions,barOnDrag,callafterfunction);	
		xShow(widget);
		widget.onmousedown = downFunction;
		widget.onmouseup = upFunction;
		function upFunction()
		{
			//updateOpacity(father.id, 50, 100, 1000, '');Waiting for designers
		}
	
		function downFunction()
		{
			xZIndex(father, zindex);
			zindex++;
			//updateOpacity(note.id, 100, 50, 350, '');Waiting to designers
		}
		function barOnDrag(e, mdx,mdy)
		{
			var noteHeight = xHeight(father) + mdy;
			if(xTop(father) + noteHeight > xHeight(cThis.calendarBodyDay))
			{
				return;
			}
			updateEvenNameNote(father,noteHeight);
			cThis.resizeHeightNote(father,noteHeight);
		}
		function savePositions(e)
		{
			firstX = xWidth(father);
			firstY = xHeight(father);
		}
		function callafterfunction()
		{
			var lastHour = xTop(father)+xHeight(father);
			var newHour =Math.floor(lastHour / cThis.calendarHourHeight);
			var newMin = lastHour - (newHour*cThis.calendarHourHeight);
			newMin = Math.floor(newMin / cThis.fraccion);
			
			sendMsgParam = eyeParam('hourEven',newHour);
			sendMsgParam = sendMsgParam + eyeParam('minEven',newMin);
			sendMsgParam = sendMsgParam + eyeParam('id',father.ID);
			sendMsg($checknum,'resizeNote',sendMsgParam);
		}
	}
	
	
	function updateFromNameNote(note)
	{	

		var lastHour = xTop(note);
		var newHour =Math.floor(lastHour / cThis.calendarHourHeight);
		var newMin = lastHour - (newHour*cThis.calendarHourHeight);
		newMin = Math.floor(newMin / cThis.fraccion);	
				
		textNode = note.noteName.nameMidle.nameContainer.firstChild;
		textNode.replaceData(0,textNode.length,newHour+':'+newMin);	
	}
	function updateEvenNameNote(father,noteHeight)
	{
		var lastHour = xTop(father) +noteHeight;
		var newHour = Math.floor(lastHour / cThis.calendarHourHeight);
		var newMin = lastHour - (newHour*cThis.calendarHourHeight);
		
		newMin = Math.floor(newMin / cThis.fraccion);	
		
		textNode = father.noteName.nameMidle.nameContainer.lastChild;
	
		textNode.deleteData(0,textNode.length);
		textNode.insertData(0,newHour+':'+newMin);
	
	}

	function resizeHeightNote(note,noteHeight)
	{	
		var margins = cThis.calendarNoteBottomHeight +cThis.calendarNoteNameHeight;
		if(noteHeight < margins)
		{
			return;
		}
		note.style.height = noteHeight+'px';	
		var bodyHeight = noteHeight -margins;
		var diference = bodyHeight - cThis.calendarNoteBodyTop;
		if(diference >= 0){
			note.noteBody.style.height = bodyHeight+'px';
			note.noteBody.bodyLeft.style.height = diference+'px';
			note.noteBody.bodyRight.style.height = diference+'px';
			note.noteBody.bodyBottom.style.height = bodyHeight/2+'px';
		}
		
		var textArea = note.noteBody.textArea;
	
		if(noteHeight / cThis.calendarHourHeight >= 1)
		{
			if(textArea.style.display == 'none')
			{	
				textArea.style.display = 'block';
			}
			if(bodyHeight >= 10){
				textArea.style.height = bodyHeight - 10+'px';//10 is for bottom
			}
		}else{
			if(textArea.style.display == 'block' || textArea.style.display == '')
			{
				textArea.style.display = 'none'				
			}
		}
		
		var lastHour = xTop(note) +noteHeight;
		var newHour =Math.floor(lastHour / cThis.calendarHourHeight);
		var newMin = lastHour - (newHour*cThis.calendarHourHeight);	
		newMin = Math.floor(newMin / cThis.fraccion);	
		note.minEven = newMin;
		note.hourEven = newHour;
	}
	
	function updateTitle(e){
		var event = new xEvent(e);
		event.target.readOnly = false;
		event.target.select();
		xAddEventListener(event.target,'blur',sendUpdateTitle,0);		
		if(event.target.value == cThis.defaultName){
				event.target.value = '';
		}
	}	
	
	function sendUpdateTitle(e){		
		var event = new xEvent(e);
		event.target.readOnly = true;
		var oldValue = event.target.value;
		event.target.value = event.target.value+' ';
		event.target.value = oldValue;
		event.target.style.border = 'none';
		xRemoveEventListener(event.target,'blur',sendUpdateTitle,0);
		
		sendMsgParam = eyeParam('title',event.target.value);
		sendMsgParam = sendMsgParam + eyeParam('id',event.target.note.ID);
		sendMsg(cThis.checknum,'updateTitle',sendMsgParam);
	}	
	
	function saveData(){
	}


	/*Options
	*At the moment only Style function
	*/
	
	//Very importan note for readers, in the future this will be in style system, calculed from php etc
	//but at the moment, this is with low preference
	function getStyleVars()
	{
		//TODO make a style system, at the moment, hardcoded is nice.
		this.rowHeight = 50;
		this.dayWidth = 0;
		this.calendarHourHeight = 60;//number of pixels have one hour in calendar.
		//This will be in style.
		this.calendarBoxWidth = 642;
		this.calendarBoxHeight = 405;
		this.fraccion = 60 / 60;		
		this.calendarBoxTop = 50;
		this.calendarBoxLeft = 200;
		this.slideTimeNoteEffect = 250;
		this.calendarMenuWidth = 168;
		this.calendarSpaceWidth = 15;
		this.numberOfSpaces = 3;
		this.calendarHourRowWidth = 46;
		this.calendarScrollBarWidth = 16;
		this.calendarHoursDisplay = 11;
		this.calendarNoteMinWidth = 20;
		this.calendarNoteLeftCorn = 10;
		this.calendarNoteRightCorn = 10;
		this.calendarNoteNameHeight = 10;
		this.calendarNoteBottomHeight = 10;
		this.calendarNoteRemoveButtonWidth = 10;
		this.calendarNoteOpacity = 90;
		this.calendarNoteBodyTop = 5;
		this.calendarNoteTextAreaMargin = 5;	
		this.calendarWidgetRowsAndDateHeight = 28;
		this.defaultName = 'Click Me';
		this.calendarBaseWidth = xWidth(this.father) - this.calendarMenuWidth - this.calendarSpaceWidth*this.numberOfSpaces;
		this.calendarDayWidth = (this.calendarHourRowWidth+this.calendarScrollBarWidth);
		this.calendarDayWidth = (this.calendarBaseWidth-this.calendarDayWidth);//Day with, dis si a hight used var for all app.	
		this.calendarDayWidth = this.calendarDayWidth / this.daysCount;
		this.calendarDayWidth = Math.floor(this.calendarDayWidth);
		
		this.daysNames = new Array(7);
		this.daysNames[0] = 'Sun';
		this.daysNames[1] = 'Mon';
		this.daysNames[2] = 'Tue';
		this.daysNames[3] = 'Wed';
		this.daysNames[4] = 'Thu';
		this.daysNames[5] = 'Fri';
		this.daysNames[6] = 'Sat';
	}
	function sendDragData(newDay,noteId)
	{		
		var note = document.getElementById(noteId);		
		var lastHour = xTop(note);
		note.state = 'none';
		var hourFrom =Math.floor(lastHour / cThis.calendarHourHeight);
		var minFrom = lastHour - (hourFrom*cThis.calendarHourHeight);
		minFrom = Math.floor(minFrom / cThis.fraccion);
		
		//Turning on the makedrag
		cThis.makeNoteDrag(note.noteName.nameRight,note,cThis.calendarBodyDay,saveData);
		cThis.makeNoteDrag(note.noteName.nameMidle,note,cThis.calendarBodyDay,saveData);
		cThis.makeNoteDrag(note.noteName.nameLeft,note,cThis.calendarBodyDay,saveData);
		
		cThis.makeNoteDrag(note.noteBody.bodyTop,note,cThis.calendarBodyDay,saveData);
		cThis.makeNoteDrag(note.noteBody.bodyLeft,note,cThis.calendarBodyDay,saveData);
		cThis.makeNoteDrag(note.noteBody.bodyRight,note,cThis.calendarBodyDay,saveData);
		cThis.makeNoteDrag(note.noteBody.bodyBottom,note,cThis.calendarBodyDay,saveData);
	
		lastHour = xTop(note)+xHeight(note);
		var hourEven =Math.floor(lastHour / cThis.calendarHourHeight);
		var minEven = lastHour - (hourEven*cThis.calendarHourHeight);
		
		minEven = Math.floor(minEven / cThis.fraccion);
		
		sendMsgParam = eyeParam('hourFrom',hourFrom);
		sendMsgParam = sendMsgParam + eyeParam('minFrom',minFrom);
	    sendMsgParam = sendMsgParam + eyeParam('hourEven',hourEven);
	    sendMsgParam = sendMsgParam + eyeParam('minEven',minEven);
		sendMsgParam = sendMsgParam + eyeParam('wday',newDay);		    
		sendMsgParam = sendMsgParam + eyeParam('title',note.title);			
		sendMsgParam = sendMsgParam + eyeParam('id',note.ID);
		sendMsg($checknum,'dragNote',sendMsgParam);
	}
}



function noteContainer(params)
{
	this.noteInfo = params;
	
	//Get and Set functions
	this.getAllInfo = getAllInfo;
	function getAllInfo(){
		return this.noteInfo;
	}
	function setAllInfo(params){
		this.noteInfo = params;
	}
}

function init_calendar(checknum) {
	sendMsg(checknum,'Launch','');
}

init_calendar($checknum);
