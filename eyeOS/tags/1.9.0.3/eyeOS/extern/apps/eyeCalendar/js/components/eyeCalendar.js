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

//Global array where the weekPlanner instances are saved.
weekPlanner_instances = [];

/*
*Function that close a weekPlaner instance
*Removing the instance from weekPlanner_instances array
*and deleting other possible resources like timeouts.
*/
function weekPlanner_close(pid){
	if(weekPlanner_instances[pid]){
		//Deleting timeouts
		clearTimeout(weekPlanner_instances[pid].base.timeOut);
		if(IEversion && IEversion < 8){
			weekPlanner_instances[pid].base.father = null;
			weekPlanner_instances[pid] = null;
		}else{
			delete weekPlanner_instances[pid].base.father;
			delete weekPlanner_instances[pid];
		}
		return true;
	}
	return false;
}

/*
*Standar show function to instance the weekPlanner as normal widget
*/
function weekPlanner_show(params,name,father,x,y,horiz,vert,checknum,cent){
	var pid = params['pid'];
	weekPlanner_instances[pid] = new weekPlanner_class(params,name,father,x,y,horiz,vert,checknum,cent);
}

/*
*Main class that with the most improtant constructor, that initialize all the weekPlanner
*also, this constructor initialize the other 3 important clases
*/
function weekPlanner_class(params,name,father,x,y,horiz,vert,checknum,cent){
	//Global Class propierties
	this.pid = params['pid'];
	this.checknum = checknum;
	this.dayFrom = params['dayFrom'];
	this.dayEven = params['dayEven'];
	this.hourFrom = params['hourFrom'];
	this.hourEven = params['hourEven'];
	this.hourRowWidth = params['hourWidth'];
	this.dayRowWidth = params['width'];
	this.rowHeight = params['rowHeight'];
	this.parts = params['parts'];
	this.weekDays = getArrayArg(params['weekDays']);
	this.startMonday = params['startMonday'];
	this.selectedCalendar = params['selectedCalendar'];
	this.defaultEvenText = params['defaultEvenText'];
	this.calendarsText = params['calendarsText'];
	this.father = xGetElementById(father);		//Father is usualy a simplebox or window
	//The xWidth must be replaced for something, or at least a alternative to evade it
	this.plannerWidth = xWidth(this.father);	//planner always have the same width thahis father
	//Calculating numDays once, save cpu in front of memory
	this.numDays = (this.dayEven-this.dayFrom);

	//Check if the total height is enough to fill all the days father height, if not, increate it
	var fatherHeight = xHeight(this.father);
	var numOfHours = (this.hourEven-this.hourFrom)+1;
	var totalPixels = this.rowHeight*numOfHours;
	if(totalPixels < fatherHeight){
		this.rowHeight = fatherHeight/numOfHours;
	}

	//In theory weekPlanner should be able to work with custom Height for hours
	//so we've to calculate how many pixels big are each part (by default each hour are divided in 4 parts).
	if(IEversion == 7){
		this.pixelPart = (this.rowHeight-1) / this.parts;
	}else{
		this.pixelPart = (this.rowHeight+1) / this.parts;
	}

	//TODO: NAME HARDCODED! this must be unhardcoded in 1.9!!
	this.calendarsFather = xGetElementById(this.pid+'_calendarsContainer_Container');

	//Same as Father xWidth, xWidth is not a performance friendly function...
	this.calendarsFatherWidth = xWidth(this.calendarsFather);

	//Some IE and other browsers tricks...
	if(IEversion == 6){
		this.rowHeight += 2;
	}else if(IEversion == 7){
		this.rowHeight -= 2;
	}

//Until we've a choose color, the colors are defined by marc@eyeos.org (designer)
	//The noteHeader colors are used for the title, where the hour is showed
	this.noteHeaderColors = new Array('#AB3F19','#136DBB','#2E8200','#504A76','#AB3F19','#7F405C');
	//NoteBodyColors used to paint the body of the notes
	this.noteBodyColors = new Array('#E46F46','#37A3FF','#6FBA32','#8074C9','#F19A2A','#E26299');
	//calednarSelectColor defines the color to paint the calendar selector
	this.calendarSelectColors = new Array('#E46F46','#37A3FF','#6FBA32','#8074C9','#F19A2A','#E26299');

	/*
	*This calculate the content height, to do it I do:
	*	Get the number of hours (this include the plus one) ::: (this.hourEven-this.hourFrom)+1
	*	Multiply by rowHeight to get the space required by the content of each hour
	*	Plus 25 1 for each hour, maybe this need a fix, and must be 1pixel for each hour, and not 25 directly.
	*	TODO: check +25, maybe 1*totalHours?
	**/
	this.contentHeight = (this.rowHeight*((this.hourEven-this.hourFrom)+1))+25;
	var rest = this.numDays-1+0.2;//0.2 is because of borders, no problem here
	//Calculatin  the width to evade calculate it again
	this.rowWidth = (this.dayRowWidth-rest)/this.numDays;

	//The calendar class is the top left calendar chooser
	this.calendars = new weekPlanner_calendars(this);
	//Instancing the handling event layer
	this.events = new weekPlanner_events(this);
	//This mainly paint everything
	this.base = new weekPlanner_base(this);
	//Handle and paint notes
	this.notes = new weekPlanner_notes(this);

	//Drawing calendars on top left
	this.calendars.draw();
	//Drw the base, days hours etc
	this.base.draw();

	//php function 
	//TODO: Check if this is deprecated :(
	this.resizeDays = resizeDays;
}

function weekPlanner_calendars(weekPlanner){
	this.father = weekPlanner;
	this.calendarInfo = new Array();

	//WTF is this?
	this.cleanCalendars = function cleanCalendars(){
		var container = document.getElementById(this.father.pid+'_calendarsEntryContainer');
		container.parentNode.removeChild(container);
		this.draw();
	}
	//this function is called when the user click in the checkbox above calendar name
	this.hiddenNotes = function hiddenNotes(e){
		if(!e.target.num){
			return false;
		}
		var checkBox = e.target;
		var num = checkBox.num;

		//If calendar is showed
		if(checkBox.checked == true){
			this.calendarInfo[num]['show'] = 1;
			this.father.notes.jsEvent_showCalendarNotes(num);
		}else{
			//If calendar is selected, show it always
			if(this.calendarInfo[num]['selected'] == 1){
				checkBox.checked = true;
				return false;
			}
			//If calendar isn't showed
			this.calendarInfo[num]['show'] = 0;
			//Show it
			this.father.notes.jsEvent_hiddenCalendarNotes(num);
		}

		sendMsgParam = eyeParam('showed',checkBox.checked);
		sendMsgParam = sendMsgParam + eyeParam('calendar',num);
		sendMsg(this.father.checknum,'calendarShow',sendMsgParam);
	}
	this.selectCalendar = function selectCalendar(e){
		//Removing	selected img from old selected calendar
		var len = this.calendarInfo.length;
		if(len > 0){
			var oldCalendar = xGetElementById(this.father.pid+'_selectedImg');
			oldCalendar.parentNode.removeChild(oldCalendar);
		}

		var target = e.target;
		if(target.id == 'textContainer'){
			target = target.parentNode;
		}
		var num = target.num;
		this.genSelectCalendar(true,target,num);
	}
	this.phpSelectCalendar = function phpSelectCalendar(num){
		//Removing	selected img from old selected calendar
		var len = this.calendarInfo.length;
		if(len > 0){
			var oldCalendar = xGetElementById(this.father.pid+'_selectedImg');
			oldCalendar.parentNode.removeChild(oldCalendar);
		}
		var entry = document.getElementById(this.father.pid+'_contentName_'+num);
		this.genSelectCalendar(false,entry,num);
	}
	//Generic select calendar
	this.genSelectCalendar = function genSelectCalendar(local,content,num){
		//Usually always a calendar is selected
		if(this.father.selectedCalendar != 'noCalendar'){
			this.calendarInfo[this.father.selectedCalendar]['selected'] = 0;
		}

		this.calendarInfo[num]['selected'] = 1;
		//If calendar is selected but isn't showed, force it
		if(this.calendarInfo[num]['show'] == 0){
			//Getting checkbox
			var checkBox = document.getElementById(this.father.pid+'_calendarCheck_'+num);
			checkBox.checked = true;
			//Setting it as showed
			this.calendarInfo[num]['show'] = 1;
			//showing the notes
			this.father.notes.jsEvent_showCalendarNotes(num);

			sendMsgParam = eyeParam('showed',checkBox.checked);
			sendMsgParam = sendMsgParam + eyeParam('calendar',num);
			sendMsg(this.father.checknum,'calendarShow',sendMsgParam);
		}
		//Set is as selected
		this.calendarInfo[num]['selected'] = 1;
		//Setting this calendar as selected calendar
		this.father.selectedCalendar = num;
		//selected image
		//TODO: remove duplicate code
		var imageContainer = this.drawSelectRow();
		 content.appendChild(imageContainer);

		if(local==true){
			sendMsgParam = eyeParam('calendar',num);
			sendMsg(this.father.checknum,'selectCalendar',sendMsgParam);
		}
	}
	this.drawSelectRow = function drawSelectRow(){
		var imageContainer = document.createElement('div');
		imageContainer.setAttribute('id',this.father.pid+'_selectedImg');
		imageContainer.style.position = 'absolute';
		imageContainer.style.height = '100%';
		imageContainer.style.right = '5px';
		var image = document.createElement('img');
		image.src = 'index.php?version='+EXTERN_CACHE_VERSION+'&theme=1&extern=images/apps/eyeCalendar/widget/selected.png';
		image.setAttribute('id',this.father.pid + '_selectedImg_img');
		imageContainer.appendChild(image);
// 		fixPNG(image);
		return imageContainer;
	}
	this.drawCalendar = function drawCalendar(name,num,show){
		var fatherContainer = this.father.calendarsFather;

		//Removing addcalendar if it exists
		//this.removeAddCalendar();
		//Adding info in the calendar array at the moment only save the show property
		this.calendarInfo[num]  = new Array();
		this.calendarInfo[num]['show'] = show;
		var contentEntry = document.createElement('div');
		contentEntry.setAttribute('id',num+'_contentEntry');
		contentEntry.style.cssFloat = 'right';
		contentEntry.style.styleFloat = 'right';
		contentEntry.style.width = this.father.calendarsFatherWidth-20+'px';//9 is for margins
		contentEntry.style.height = '15px';
		contentEntry.style.marginTop = '5px';
		contentEntry.style.zIndex = '999';
		contentEntry.style.cursor = 'pointer';
		contentEntry.num = num;
		contentEntry.pid = this.father.pid;
		contentEntry.evenType = 'selectCalendar';
			var checkBox = document.createElement('input');
			checkBox.setAttribute('id',this.father.pid+'_calendarCheck_'+num);
			checkBox.style.position = 'relative';
			checkBox.style.cssFloat = 'left';
			checkBox.style.styleFloat = 'left';
			checkBox.style.marginTop = '1px';
			checkBox.style.marginLeft = '0px';
			checkBox.style.marginRight = '0px';
			checkBox.style.cursor = 'pointer';
			checkBox.type = 'checkBox';
			checkBox.evenType = 'viewCalendar';
			checkBox.noPrevent = true;
			checkBox.num = num;
			checkBox.pid = this.father.pid;
			//if this calendar is showed
			if(show == 1){
				checkBox.checked = true;
				checkBox.defaultChecked = true;
			}
			xAddEventListener(checkBox,'click',mouseClick);

			var contentName = document.createElement('div');
			contentName.setAttribute('id',this.father.pid+'_contentName_'+num);
			contentName.style.position = 'relative';
			contentName.style.cssFloat = 'left';
			contentName.style.styleFloat = 'left';
			contentName.style.marginLeft = '5px';
			contentName.style.width = this.father.calendarsFatherWidth-48+'px';
			if (IEversion && IEversion < 7) {
				contentName.style.height = '16px';
			} else {
				contentName.style.height = '100%';
			}
			contentName.style.color = 'white';
			if (IEversion && IEversion < 7) {
				contentName.style.marginTop = '4px';
			}
			contentName.evenType = 'selectCalendar';
			contentName.pid = this.father.pid;
			contentName.num = num;

			var pixel = document.createElement('div');
			pixel.style.position = 'absolute';
			pixel.style.width = '1px';
			pixel.style.height = '1px';
			pixel.style.backgroundColor = 'white';
			pixel.style.top = '0px';
			pixel.style.left = '0px';
			contentName.appendChild(pixel);

			pixel = pixel.cloneNode(true);
			pixel.style.top = '';
			pixel.style.bottom = '0px';
			contentName.appendChild(pixel);

			pixel = pixel.cloneNode(true);
			pixel.style.left = '';
			pixel.style.right = '0px';
			contentName.appendChild(pixel);

			pixel = pixel.cloneNode(true);
			pixel.style.bottom = '';
			pixel.style.top = '0px';
			contentName.appendChild(pixel);

			if(num > 5){
				calendarNum = num%5;
			}else{
				calendarNum = num;
			}
			contentName.style.backgroundColor = this.father.calendarSelectColors[calendarNum];
				var textContainer = document.createElement('div');
				textContainer.setAttribute('id','textContainer');//Yes hardcoded! but we don't need it
				textContainer.style.cssFloat = 'left';
				textContainer.style.styleFloat = 'left';
				textContainer.style.marginLeft = '4px';
				textContainer.evenType = 'selectCalendar';
				textContainer.pid = this.father.pid;
					var text = document.createTextNode(name);
				textContainer.appendChild(text);
				xAddEventListener(textContainer,'click',mouseClick);
				//If this calendar is the selected calendar
				if(this.father.selectedCalendar == num){
					this.calendarInfo[num]['selected'] = 1;
					//selected image
					var imageContainer = this.drawSelectRow();
					contentName.appendChild(imageContainer);
				}else{
					this.calendarInfo[num]['selected'] = 0;
				}
			contentName.appendChild(textContainer);
		contentEntry.appendChild(checkBox);
		contentEntry.appendChild(contentName);
		xAddEventListener(contentName,'click',mouseClick);
	this.infoContainer.appendChild(contentEntry);
	}
	this.draw = function draw(){
		var fatherContainer = this.father.calendarsFather;
		var container = document.createElement('div');
		container.setAttribute('id',this.father.pid+'_calendarsEntryContainer');
		container.style.position = 'absolute';
		container.style.top = '0px';
		container.style.left = '0px';
		container.style.height = '100%';
		container.style.width = '100%';
		container.style.backgroundColor = 'white';
			var textContainer = document.createElement('div');
			textContainer.style.position = 'absolute';
			textContainer.style.top = '5px'
			textContainer.style.left = '10px'
			textContainer.style.width = 'auto'
			textContainer.style.height = '10px'
			textContainer.style.color = '#6D6D6D';
				var text = document.createTextNode(this.father.calendarsText);
			textContainer.appendChild(text);
		container.appendChild(textContainer);

			this.infoContainer = document.createElement('div');
			this.infoContainer.style.position = 'absolute';
			this.infoContainer.style.left = '3px'
			this.infoContainer.style.top = '26px'
			this.infoContainer.style.width = this.father.calendarsFatherWidth-14+'px';//9 is for margins
			this.infoContainer.style.height = 'auto';
		container.appendChild(this.infoContainer);
		fatherContainer.appendChild(container);
	}
}

function  weekPlanner_base(weekPlanner,dayFrom,dayEven) {
	this.father = weekPlanner;
	this.timeOut = null;
	this.totalParts = 0;
	this.changeDate = function changeDate(weekDays,dayFrom,dayEven){
			for(var h=0;h<=this.dayNames.childNodes.length;h++){
				var daysIndex = dayFrom + h;
				var text = this.dayNames.childNodes[h].firstChild;
				text.data = weekDays[daysIndex];
			}
	}
	this.draw_dayNames = function draw_dayNames(){
		//Creating row for each day with his name
		for(h=this.father.dayFrom;h<=this.father.dayEven-1;h++)
		{
			var dayName = document.createElement('div');
			dayName.setAttribute('id',this.father.pid+'_dayName_'+h);
			//css
			dayName.style.position = 'relative';
			dayName.style.cssFloat = 'left';
			dayName.style.styleFloat = 'left';
			if(IEversion == 6){
				dayName.style.width = this.father.rowWidth+1+'px';
			}else{
				dayName.style.width = this.father.rowWidth+'px';
			}

			dayName.style.height = '100%';
			dayName.style.textAlign = 'center';
			dayName.style.color = '#145689';
			dayName.style.lineHeight = '200%';
			//This is painted because this row need have the same width as dayTodo
			if(h!=this.father.dayFrom && (!IEversion || IEversion > 6)){
				dayName.style.borderLeft = '1px transparent solid';
			}else if(h!=this.father.dayFrom){
				dayName.style.borderLeft = '1px transparent';
			}
			var text = document.createTextNode(this.father.weekDays[h]);
			dayName.appendChild(text);
			//Adding it to dayNames container
			this.dayNames.appendChild(dayName);
		}
	}
	this.draw_todos = function draw_todos(){
		//Creating row for each day with his name 
		for(h=this.father.dayFrom;h<=this.father.dayEven-1;h++)
		{
			var dayTodo = document.createElement('div');
			dayTodo.setAttribute('id',this.father.pid+'_dayTodo_'+h);
			//css
			dayTodo.style.position = 'relative';
			dayTodo.style.cssFloat = 'left';
			dayTodo.style.styleFloat = 'left';
			dayTodo.style.width = this.father.rowWidth+'px';
			dayTodo.style.height = '100%';
			dayTodo.style.textAlign = 'center';
			dayTodo.style.color = '#145689';

			//don't print the left border on the first row
			if(h!=this.father.dayFrom){
					dayTodo.style.borderLeft = '1px #C1C1C1 solid';
			}
			//Adding it to dayTodo container
			this.dayTodo.appendChild(dayTodo);
		}
	}
	this.draw_bodyDays = function draw_bodyDays(){
		var orderNotes = function orderNotes(){
//  			//console.log("Ordening notes "+this.id);
// 			//console.log("\t"+this.notes.length);
// 			//console.log(this.notes);
			//console.log(this.notes);
			for(var x=0;x < this.notes.length;x++){
				//Special case
				var numOfLevels = this.notes[x].startPartObj.numOfLevels();
				// this.notes[x]
				if(this.notes[x].level == 0 || numOfLevels == 1){
					//0 is a special case to be showed correctly
					this.notes[x].style.width = 50+'%';
					this.notes[x].style.left = 0+'px';
					this.notes[x].level = 0;
				}else{
					var divi = 90/numOfLevels;
					var left = divi*this.notes[x].level
					var width = 90-left;
					this.notes[x].style.width = width+'%';
					this.notes[x].style.left = left+'%';
					this.notes[x].style.zIndex = 10+this.notes[x].level;
 					//console.log("Number: "+x+' cid'+this.notes[x].cid+' level: '+this.notes[x].level);
				}
			}
		}
		var addDayNote = function addDayNote(note){
			//console.log('Add Day Note: '+note.cid);
			//Adding the note to the start element
			//This is where the tittle is located, so is who matter
			var cid = note.cid;
			this.notes[cid] = note;
			var level = note.startPartObj.addNote(note);
			note.level = level;
			//console.log("Level: ["+note.cid+"]: "+level);
			//Now, we've to foreach all the parts, to see if there are some
			//conflict, and if there are, we've to move the conflicted note
			var fromParts = note.startPart;
			fromParts += note.parts;
			fromParts--;
			var toPart = note.fromParts;
			var secondPart = note.startPart +1;
;
			//console.log("Foreach from: "+secondPart+" to "+toPart);
			for(var y=secondPart;y < toPart;y++){
				//comprobar que en ese lugar, no hay notas, si es así la pusheo
 				xGetElementById(note.day+'_part_'+y).addNoteToLevel(note,level);
			}
		}
		var delDayNote = function delDayNote(note){
			//console.log('Del Day Note: '+note.cid);
			//Adding the note to the start element
			//This is where the tittle is located, so is who matter
			var cid = note.cid;
			delete this.notes[cid];
			this.notes.sort();//Place the demoved note at final
			this.notes.pop();//Remove it
			note.startPartObj.delNote(note);
			//Now, we've to foreach all the parts, to see if there are some
			//conflict, and if there are, we've to move the conflicted note
			var fromParts = note.startPart;
			fromParts += note.parts;
			fromParts--;
			var toPart = note.fromParts;
			var secondPart = note.startPart +1;
;
			//console.log("Foreach from: "+secondPart+" to "+toPart);
			for(var y=secondPart;y < toPart;y++){
				//comprobar que en ese lugar, no hay notas, si es así la pusheo
 				xGetElementById(note.day+'_part_'+y).delNoteToLevel(note,note.level);
			}
		}
		var addPartToLevel = function addPartToLevel(note,level){
			//If the note is not in that level, add it.
			//console.log("AddPartToLevel: "+note.cid+'--'+level);
			if(!this.notesLevel[level]){
				//console.log("El nivel está vacio, añadiendo nota");
				this.notesLevel[level] = note;
			}else{//If there are something in this level, we've to move it because title role...
				//Moving the note....
				//console.log("El nivel No está vacio, moviendo nota");
				this.notesLevel[level].moveLevel(level);
				//Setting the new note as owner of this level
				this.notesLevel[level] = note;
			}
		}
		var delPartToLevel = function delPartToLevel(note,level){
			//If the note is not in that level, add it.
			//console.log("DelPartToLevel: "+note.cid+'--'+level);
			if(this.notesLevel[level]){
				delete this.notesLevel[level];
			}
		}
		var addPartNote = function addPartNote(note){
			//If the part has neved had a note
			//console.log("Add Part Note: "+note.cid);
// 			if(this.notesLevel.length > 0){
				for(var x=0; x <= this.notesLevel.length;x++){
					if(typeof(this.notesLevel[x]) == "undefined"){
						this.notesLevel[x] = note;
						//console.log("El valor "+x+" está vacio, añadiendo nota");
						return x;
					}else{
// 						//console.log('FAIL  '+x);
// 						//console.log(this.notesLevel[x]);
// 						//console.log(this.notesLevel);
// 						return false;
					}
				}
				//If there are no empty spaces
 				var key = this.notesLevel.push(note);
				key--;//Keys start from 0
				//console.log("Added new key: "+key);
				return key;
// 			}
		}
		var delPartNote = function delPartNote(note){
			//If the part has neved had a note
			//console.log("Del Part Note: "+note.cid);
			for(var x=0; x <= this.notesLevel.length;x++){
				if(this.notesLevel[x].cid == note.cid){
					delete this.notesLevel[x];
					this.notesLevel.sort();
					this.notesLevel.pop();
				}
			}
			//console.log(this.notesLevel);
		}
		var numOfLevels = function numOfLevels(){
			var num = 0;
			for(var x=0; x <= this.notesLevel.length;x++){
					if(this.notesLevel[x]){
						num++;
					}
			}
			return num;
		}
		//Foreach days...
		var weekDay = document.createElement('div');
		var d = this.father.dayFrom;
		weekDay.setAttribute('id',this.father.pid+'_day_'+d);
		//css
		weekDay.className = 'eyeCalendar_day';
		weekDay.style.width = this.father.rowWidth+'px';
		weekDay.notes = new Array();
		weekDay.orderNotes = orderNotes;
		weekDay.addNote = addDayNote;
		weekDay.delNote = delDayNote;
		//Creating the hours fields.
		var paintHour = 0; //This hour is only for the painter
		for(h=this.father.hourFrom;h<=this.father.hourEven;h++)
		{
			var hour = document.createElement('div');
			hour.setAttribute('id',this.father.pid+'_hour_'+d+'_'+h);
			//css
			hour.className = 'eyeCalendar_hour';
			hour.style.height = this.father.rowHeight+'px';
			hour.pid = this.father.pid;

			var l = paintHour*4;
			var endNum = l+4;
			for(;l<endNum;l++){
				var part = document.createElement('div');
				//css
				part.setAttribute('id',d+'_part_'+l);
				part.className = 'eyeCalendar_part';
				part.pid = this.father.pid;
				part.evenType = 'default';
				part.day = d;
				part.hour = h;
				part.num = l;
				part.addNote = addPartNote;
				part.addNoteToLevel = addPartToLevel;
				part.delNote = delPartNote;
				part.delNoteToLevel = delPartToLevel;
				part.notesLevel = new Array();
				part.numOfLevels = numOfLevels;
				hour.appendChild(part);
			}
			//The top border is painted by the container
			if(h != this.father.hourFrom){
				hour.style.borderTop = '1px #C1C1C1 solid';
			}
				//half hour div
				var halfHour = document.createElement('div');
				halfHour.setAttribute('id','halfHour');
				halfHour.style.top = (this.father.rowHeight/2)+'px';
				halfHour.className = 'eyeCalendar_halfHour';
			hour.appendChild(halfHour);
			//Filling the week day
			weekDay.appendChild(hour);
			paintHour++;
		}
		this.daysContainer.appendChild(weekDay);
		for(d=this.father.dayFrom+1;d<=this.father.dayEven-1;d++)
		{
			weekDay = weekDay.cloneNode(true);
			weekDay.setAttribute('id',this.father.pid+'_day_'+d);
			weekDay.style.borderLeft = '1px #C1C1C1 solid';
			weekDay.notes = new Array();
			weekDay.orderNotes = orderNotes;
			weekDay.addNote = addDayNote;
			weekDay.delNote = delDayNote;
			//Setting the right hour/parts info and id's
			var hours = weekDay.childNodes;
			var paintHour = 0;
			for(h=0;h<hours.length;h++){
				hours[h].setAttribute('id',this.father.pid+'_hour_'+d+'_'+h);
				var l = paintHour*4;
				var endNum = l+4;
				var parts = hours[h].childNodes;
				for(x=0;x<parts.length;x++){
					if(parts[x].id == 'halfHour'){
						continue;
					}
					parts[x].setAttribute('id',d+'_part_'+l);;
					parts[x].num = l;
					parts[x].day = d;
					parts[x].hour = h;
					parts[x].evenType ='default';
					parts[x].pid =this.father.pid;
					parts[x].addNote = addPartNote;
					parts[x].notesLevel = new Array();
					parts[x].addNoteToLevel = addPartToLevel;
					parts[x].delNote = delPartNote;
					parts[x].delNoteToLevel = delPartToLevel;
					parts[x].numOfLevels = numOfLevels;
					l++;
				}
				paintHour++;
			}
			this.totalParts = l;
			this.daysContainer.appendChild(weekDay);
		}
	}
	this.draw_bodyDaysIE = function draw_bodyDays(){
		//Foreach days...
		for(d=this.father.dayFrom;d<=this.father.dayEven-1;d++)
		{
			var weekDay = document.createElement('div');
			weekDay.setAttribute('id',this.father.pid+'_day_'+d);
			//css
			weekDay.style.position = 'relative';
			weekDay.style.cssFloat = 'left';
			weekDay.style.styleFloat = 'left';
			weekDay.style.width = this.father.rowWidth+'px';
			weekDay.style.height = '100%';
			weekDay.pid = this.father.pid;
			weekDay.onselectstart = function(){
				return false;
			}
			//If don't is the first row
			if(d!=this.father.dayFrom){
				weekDay.style.borderLeft = '1px #C1C1C1 solid';
			}

			//Creating the hours fields.
			var paintHour = 0;
			for(h=this.father.hourFrom;h<=this.father.hourEven;h++)
			{
				var l = paintHour*4;
				var endNum = l+4;
				for(;l<endNum;l++){
					var part = document.createElement('div');
					//css
					part.setAttribute('id',d+'_part_'+l);
					part.style.position = 'relative';
					part.style.cssFloat = 'left';
					part.style.styleFloat = 'left';
					part.style.width = '100%';
					part.style.height = this.father.rowHeight/4+'px';
					part.pid = this.father.pid;
					part.day = d;
					part.hour = h;
					part.num = l;
					part.style.zIndex = '1';
					part.notesInPart = new Array();
					if(l == endNum -1){
						part.style.borderBottom = '1px #C1C1C1 solid';
					}
					part.evenType = 'default';
					weekDay.appendChild(part);
				}
				//Filling the week day
				weekDay.appendChild(part);
				paintHour++;
			}
			this.totalParts = l;
			this.daysContainer.appendChild(weekDay);
		}
	}

	this.draw_dayHours = function draw_dayHours()
	{
		//Painting hours
		for(h=this.father.hourFrom;h<=this.father.hourEven;h++)
		{
			var hour = document.createElement('div');
			hour.setAttribute('id','hour');
			//css
			hour.style.position = 'relative';
			hour.style.cssFloat = 'left';
			hour.style.styleFloat = 'left';
			hour.style.width = '100%';
			if (IEversion && IEversion < 7) {
				hour.style.height = String(this.father.rowHeight + 1) + 'px';
			} else {
				hour.style.height = this.father.rowHeight + 'px';
			}
			hour.style.borderTop = '1px #E6E6E6 solid';
			hour.style.textAlign = 'center';
			hour.style.color = '#585858';
			if(IEversion){
				hour.onselectstart = function(){
					return false;
				}
			}
			//text
			//TODO: 12hours format
			var text = document.createTextNode(h+':00');
			hour.appendChild(text);
			this.hoursBase.appendChild(hour);
		}
	}
	this.goToFirstNote = function goToFirstNote(){
		if(!this.father.firstTop){
			this.father.firstTop = xTop(this.hourLine);
		}
		this.fatherDays.scrollTop = this.father.firstTop;
	}
	this.drawCurrentHour = function drawCurrentHour(){
		//Calculate hour and mins
		var dateObj = new Date();
		var currentHour = dateObj.getHours();
		var currentMins = dateObj.getMinutes();
		var currentSeconds = dateObj.getSeconds();
		//If the calendar ends before the current hour
		if(currentHour > this.father.hourEven){
			return false;
		}
		var hourTop = currentHour*51;
		hourTop = hourTop + currentMins*0.83;
		hourTop = parseInt(hourTop);
		this.hourLine = document.createElement('div');
			this.hourLine.setAttribute('id',this.father.pid+'_currentHour');
			this.hourLine.style.position = 'absolute';
			this.hourLine.style.top = hourTop+'px';
			this.hourLine.style.left = '0px';
			this.hourLine.style.width = '100%';
			this.hourLine.style.height = '1px';
			if(IEversion == 6){
				this.hourLine.style.visibility = 'hidden';
				this.hourLine.style.display = 'none';
			}

			this.hourLine.style.backgroundColor = '#ea614f';

			var textContainer = document.createElement('div');
			textContainer.setAttribute('id',this.father.pid+'_textContainer');
			textContainer.style.position = 'absolute';
			textContainer.style.marginTop = '-2.4%';
			textContainer.style.left = '5px';
			textContainer.style.color = '#ea614f';
			textContainer.style.fontSize = '10px';
			textContainer.style.zIndex = 1;
				if(currentMins < 10){
					currentMins = '0'+currentMins;
				}
				if(currentSeconds < 10){
					currentSeconds = '0'+currentSeconds;
				}
				var text = document.createTextNode(currentHour+':'+currentMins+':'+currentSeconds);
				textContainer.appendChild(text);
			this.hourLine.appendChild(textContainer);
		this.daysContainer.appendChild(this.hourLine);
		this.timeOut = setTimeout('calendar_updateCurrentHour('+this.father.pid+');',1000);
	}
	this.updateCurrentHour = function updateCurrentHour(pid){
		var dateObj = new Date();
		var currentHour = dateObj.getHours();
		var currentMins = dateObj.getMinutes();
		var currentSeconds = dateObj.getSeconds();
		var hourTop = (currentHour- this.father.hourFrom)*51;
		hourTop = hourTop + currentMins*0.83;
		hourTop = parseInt(hourTop);
		this.hourLine.style.top = hourTop+'px';
		if(IEversion == 6){
			this.hourLine.style.visibility = 'visible';
			this.hourLine.style.display = 'block';
		}
		if(currentMins < 10){
			currentMins = '0'+currentMins;
		}
		if(currentSeconds < 10){
			currentSeconds = '0'+currentSeconds;
		}
		this.hourLine.firstChild.firstChild.data = currentHour+':'+currentMins+':'+currentSeconds;
		this.timeOut = setTimeout('calendar_updateCurrentHour('+pid+');',1000);
	}
	this.draw = function draw(){
		//Container for left hours
		this.hoursBase = document.createElement('div');
			this.hoursBase.setAttribute('id',this.father.pid+'_hoursBase');
			this.hoursBase.style.position = 'absolute';
			this.hoursBase.style.left = '0px';
			this.hoursBase.onselectstart = function(){
				return false;
			}
			if (IEversion && IEversion < 7) {
				this.hoursBase.style.top = '6px';
			} else {
				this.hoursBase.style.top = '5px';
			}
			this.hoursBase.style.width = this.father.hourRowWidth+'px';
			this.hoursBase.style.height = '100%';

		//container for names/todos
		this.fatherNames = document.createElement('dif');
			this.fatherNames.setAttribute('id',this.father.pid+'_fatherNames');
			this.fatherNames.style.position = 'absolute';
			this.fatherNames.style.left = this.father.hourRowWidth+'px';
			this.fatherNames.style.top = '0px';
			this.fatherNames.style.width = 'auto';
			this.fatherNames.style.height = 'auto';

		//container for names/todos
		this.fatherDays = document.createElement('dif');
			this.fatherDays.setAttribute('id',this.father.pid+'_fatherDays');
			this.fatherDays.style.position = 'absolute';
			this.fatherDays.style.left = '0px';
			this.fatherDays.style.top = '40px';
// 			this.fatherDays.style.width = (this.father.hourRowWidth+this.father.dayRowWidth+20)+'px';//PLus 20 because of scroll
			this.fatherDays.style.width = '100%';
			this.fatherDays.style.height = xHeight(this.father.father)+'px';
			this.fatherDays.style.overflowX = 'hidden';
			this.fatherDays.style.overflowY = 'auto';

		//Container for all objects related with week days
		this.daysBase = document.createElement('div');
			this.daysBase.setAttribute('id',this.father.pid+'_daysBase');
			this.daysBase.style.position = 'absolute';
			this.daysBase.style.left = this.father.hourRowWidth+'px';
			this.daysBase.style.top = '0px';
			this.daysBase.style.width = this.father.dayRowWidth+'px';
			this.daysBase.style.height = this.father.contentHeight+'px';
			if(IEversion){
				this.daysBase.onselectstart = function(){
					return false;
				}
			}
		//Container for day names
		this.dayNames = document.createElement('div');
			this.dayNames.setAttribute('id',this.father.pid+'_dayNames');
			this.dayNames.style.position = 'relative';
			this.dayNames.style.cssFloat = 'left';
			this.dayNames.style.styleFloat = 'left';
			this.dayNames.style.width = 'auto';
			this.dayNames.style.height = '20px';
			if(IEversion){
				this.dayNames.onselectstart = function(){
					return false;
				}
			}
		//Container for each todo (unused now)
		this.dayTodo = document.createElement('div');
			this.dayTodo.setAttribute('id',this.father.pid+'_dayTodo');
			this.dayTodo.style.position = 'relative';
			this.dayTodo.style.cssFloat = 'left';
			this.dayTodo.style.styleFloat = 'left';
			this.dayTodo.style.width = 'auto';
			this.dayTodo.style.height = '15px';
			this.dayTodo.style.border = '1px #999 solid';
			if(IEversion){
				this.dayTodo.onselectstart = function(){
					return false;
				}
			}
		//Container for each week day with his hours
		this.daysContainer = document.createElement('div');
			this.daysContainer.setAttribute('id',this.father.pid+'_daysContent');
			this.daysContainer.style.position = 'relative';
			this.daysContainer.style.cssFloat = 'left';
			this.daysContainer.style.styleFloat = 'left';
			this.daysContainer.style.marginTop = '5px';
			this.daysContainer.style.width = '100%';
			this.daysContainer.style.height = 'auto';
			this.daysContainer.style.borderLeft = '1px #999 solid';
			this.daysContainer.style.borderRight = '1px #999 solid';
			this.daysContainer.style.borderTop = '1px #999 solid';
			this.daysContainer.style.borderBottom = '1px #999 solid';
			if(IEversion){
				this.daysContainer.onselectstart = function(){
					return false;
				}
			}
			//Setting default event type
			this.father.evenType = 'default';
			//Adding events with cross-browser of course
			xAddEventListener(this.daysContainer,'mousedown',mouseDown);
			xAddEventListener(this.daysContainer,'mouseup',mouseUp);
		this.father.father.appendChild(this.fatherNames);
		this.father.father.appendChild(this.fatherDays);
		this.fatherNames.appendChild(this.dayNames);
				this.draw_dayNames();
			this.fatherNames.appendChild(this.dayTodo);
				this.draw_todos();
		this.fatherDays.appendChild(this.daysBase);
		this.fatherDays.appendChild(this.hoursBase);
			this.draw_dayHours();
			this.daysBase.appendChild(this.daysContainer);
			this.drawCurrentHour();
				if(IEversion && IEversion < 8){
					this.draw_bodyDaysIE();
				}else{
					this.draw_bodyDays();
				}
	}
}

function weekPlanner_notes(weekPlanner){
	this.father = weekPlanner;
	this.notes = new Array();

//Start event functions
	this.jsEvent_newNote = function jsEvent_newNote(e){
		if(isNaN(e.target.num)){
			return false;
		}
		this.father.evenType = 'default';
		var calendar = this.father.selectedCalendar;
		//The note creation is only allowed in part object
		var target = e.target;
		var part = 0;
		//In what part I clicked?
		part = Math.floor((target.num)/this.father.parts);
		if(target.num > 3){
			part = target.num -part*this.father.parts;
		}else{
			part = target.num;
		}

		var num = target.num;
		//Now I can draw the note in his parent (hour).
		var cid = this.notes.length;
		var note = this.draw_newNote(num,2,calendar,cid,1,1);//Creating the note object

		this.father.base.daysContainer.style.cursor = 's-resize';

		var newFather = document.getElementById(this.father.pid+'_day_'+target.day); 
		newFather.appendChild(note);

		//Adding event properties
		note.parts = 2;
		note.fromParts = target.num;
		note.startPart = target.num;
		note.day = target.day;
		note.startPartObj = xGetElementById(target.day+'_part_'+target.num);
		//Drawing title
		this.draw_title(note);
		this.draw_event(note,this.father.defaultEvenText);

		//Resize hack
		if(IEversion && IEversion < 8){
			note.style.zIndex = 0;
			note.noteBody.style.zIndex = 0;
		}else{
			note.noteBody.style.zIndex = 1;
		}
		//Saving note in the main class
		this.father.tmpNote = note;
		//Adding it to ntoes array
		this.notes.push(note);
		note.cid = cid;
		note.calendar = calendar;
		note.newFather = newFather;
		//Changing event type
		this.father.evenType = 'resizeNote2';
		//Changing the events
		xAddEventListener(this.father.base.daysContainer,'mouseover',mouseOver);
		xRemoveEventListener(this.father.base.daysContainer,'mousedown',mouseDown);
	}
	this.draw_contextualMenu = function draw_contextualMenu(note){
		var params = Array();
		params['sFather'] = 1;
		if(IEversion && IEversion < 8){
			params['mFather'] = this.father.base.daysContainer.id;
			params['rFather'] = this.father.base.daysContainer.id;
		}
		ContextMenu_show(params,note.cid+'_noteMenu',note.id,20,20,0,0,this.father.checknum,0);
		addContextEntry(note.cid+'_noteMenu','<img id="' + note.cid + '_noteMenu_delete" style="height: 16px; width: 16px;" src="index.php?version='+EXTERN_CACHE_VERSION+'&theme=1&extern=icons/16x16/delete.png"/> &nbsp;&nbsp;$lang:Delete',note.cid+'_delete','delNote',this.father.checknum,'<id>'+note.cid+'</id><calendar>'+note.calendar+'</calendar>',note.cid + '_noteMenu_delete');
	}
	this.jsEvent_deleteNote = function jsEvent_deleteNote(e){
		var note = e.target.parentNode;
		note.newFather.delNote(note);
// 		note.newFather.orderNotes();
		 sendMsgParam = eyeParam('id',note.cid);
		 sendMsgParam = sendMsgParam + eyeParam('calendar',note.calendar);
		sendMsg(this.father.checknum,'delNote',sendMsgParam);
	}
	this.jsEvent_resizeNote = function jsEvent_resizeNote(e){
		this.father.tmpNote = e.target.parentNode;
		this.father.evenType = 'resizeNote';
		if(IEversion && IEversion < 8){
			this.father.tmpNote.style.zIndex = 0;
			this.father.tmpNote.noteBody.style.zIndex = 0;
		}else{
			this.father.tmpNote.noteBody.style.zIndex = 1;
		}
		//Changing pointer in all object
		this.father.base.daysContainer.style.cursor = 's-resize';
		xAddEventListener(this.father.base.daysContainer,'mouseover',mouseOver);
	}
	this.jsEvent_moveNote = function jsEvent_moveNote(e){
		this.father.tmpNote = e.target.parentNode;
		if(e.target.id == 'noteTitle'){
			this.father.evenType = 'moveNote';
		}else{
			this.father.evenType = 'moveNoteBody';
		}

		if(IEversion && IEversion < 8){
			this.father.tmpNote.style.zIndex = 0;
			this.father.tmpNote.noteBody.style.zIndex = 0;
		}else{
			this.father.tmpNote.noteBody.style.zIndex = 1;
		}
		this.father.base.daysContainer.style.cursor = 'move';
		xAddEventListener(this.father.base.daysContainer,'mouseover',mouseOver);
	}
	this.jsEvent_editEvent = function jsEvent_editEvent(e){
		//Removing the events
		var note = e.target.parentNode;
		note = note.parentNode;
		this.father.tmpNote = note;
		var text = e.target.firstChild.data;
		xRemoveEventListener(this.father.base.daysContainer,'mouseover',mouseOver);
		xRemoveEventListener(this.father.base.daysContainer,'mouseup',mouseUp);
		var popupDiv = this.draw_editPopup(note.cid,text);
		this.father.father.parentNode.appendChild(popupDiv);
		popupDiv.inputText.focus();
		popupDiv.inputText.select();
	}
	this.jsEvent_addNoteToPart = function jsEvent_addNoteToPart(note){
		var from = note.startPart;
		var plus = note.parts;
		var to = from+plus;
		var day = note.day;
// 		//console.log(from+'--'+plus+'--'+to+'--'+day);
		var tempElement;
		var finalWidth = 0;//In fact, this is 1 but if the part already have 1, it means 2, bit hard to explain
		for(var x=from;x < to;x++){
			tempElement = xGetElementById(day+'_part_'+x);
			//console.log(tempElement.notesInPart.length);
 			tempElement.notesInPart.push(note);
			//console.log(tempElement.notesInPart.length);
 			if(tempElement.notesInPart.length > finalWidth){
 				finalWidth = tempElement.notesInPart.length;
 			}
		}
		//console.log('Final '+finalWidth);
		//console.log(note);
		note.style.width = 90/finalWidth+'%';

// 		note.style.left = 100/finalWidth+'%';
	}
	this.jsEvent_noteCreated = function jsEvent_noteCreated(e){
		//Getting note info.
		var note = this.father.tmpNote;
		//Adding contextual menu
		this.draw_contextualMenu(note);
// 		note.style.width = "90%";
		note.newFather.addNote(note);
// 		note.newFather.orderNotes();
// 		this.jsEvent_addNoteToPart(note);
		sendMsgParam = eyeParam('hourFrom',note.hourFrom);
		sendMsgParam = sendMsgParam + eyeParam('minFrom',note.minFrom);
		sendMsgParam = sendMsgParam + eyeParam('hourEven',note.hourEven);
		sendMsgParam = sendMsgParam + eyeParam('minEven',note.minEven);
		sendMsgParam = sendMsgParam + eyeParam('day',note.day);
		sendMsgParam = sendMsgParam + eyeParam('id',note.cid);
		sendMsgParam = sendMsgParam + eyeParam('calendar',note.calendar);
		sendMsg(this.father.checknum,'addNote',sendMsgParam);

		//Removing the events
		xRemoveEventListener(this.father.base.daysContainer,'mouseover',mouseOver);
		//xRemoveEventListener(this.father.base.daysContainer,'mousedown',mouseDown);
		xRemoveEventListener(this.father.base.daysContainer,'mouseup',mouseUp);

		var popupDiv = this.draw_editPopup(note.cid);
		this.father.father.parentNode.appendChild(popupDiv);
		popupDiv.inputText.focus();
		popupDiv.inputText.select();
	}
	this.draw_editBox = function draw_editBox(text){
		var textContainer = document.createElement('div');
		textContainer.setAttribute('id','eventCotnainer');
		textContainer.className = 'eyeCalendar_hover';
		textContainer.style.position = 'relative';
		textContainer.style.paddingLeft = '1px';
		textContainer.style.paddingRight = '1px';
		textContainer.style.width = 'auto';
		textContainer.style.height = 'auto';
		textContainer.style.color = 'white';
		textContainer.style.cursor = 'pointer';
		textContainer.evenType = 'editEvent'
		textContainer.style.zIndex = '999';
		textContainer.pid = this.father.pid;
			var text = document.createTextNode(text);
		textContainer.appendChild(text);
		xAddEventListener(textContainer,'click',mouseClick);
		return textContainer;
	}
	this.jsEvent_setEvent = function jsEvent_setEvent(e){
		var noteId = this.father.tmpNote.cid;
		var inputText = document.getElementById(noteId+'_inputEvent');
		if(!inputText){
			return false;
		}

		var textContainer = this.draw_editBox(inputText.value);

		xAddEventListener(textContainer,'click',mouseClick);
		if(this.father.tmpNote.noteBody.firstChild){
			var first = this.father.tmpNote.noteBody.firstChild;
			this.father.tmpNote.noteBody.removeChild(first);
			if(IEversion && IEversion < 8){
				first = null;
			}else{
				delete first;
			}
		}

		this.father.tmpNote.noteBody.appendChild(textContainer);
		var parent = e.target.parentNode;
		parent.parentNode.removeChild(parent);

		var note = this.father.tmpNote;
		 sendMsgParam = eyeParam('title',inputText.value);
		 sendMsgParam = sendMsgParam + eyeParam('id',note.cid);
		 sendMsgParam = sendMsgParam + eyeParam('calendar',note.calendar);
		sendMsg(this.father.checknum,'updateTitle',sendMsgParam);

		//Removing the events
		this.father.evenType = 'default';
		xAddEventListener(this.father.base.daysContainer,'mousedown',mouseDown);
		xAddEventListener(this.father.base.daysContainer,'mouseup',mouseUp);
	}
	this.jsEvent_noteResized = function jsEvent_noteResized(e){
		//Getting note info.
		xRemoveEventListener(this.father.base.daysContainer,'mouseover',mouseOver);
		var note = this.father.tmpNote;
		sendMsgParam = eyeParam('hourFrom', note.hourFrom);
		sendMsgParam = sendMsgParam + eyeParam('minFrom', note.minFrom);
		sendMsgParam = sendMsgParam + eyeParam('hourEven', note.hourEven);
		sendMsgParam = sendMsgParam + eyeParam('minEven', note.minEven);
		sendMsgParam = sendMsgParam + eyeParam('day', note.day);
		sendMsgParam = sendMsgParam + eyeParam('id', note.cid);
		sendMsgParam = sendMsgParam + eyeParam('calendar',note.calendar);
		sendMsg(this.father.checknum, 'resizeNote', sendMsgParam);
		this.father.evenType = 'default';
	}
	this.jsEvent_noteMoved = function jsEvent_noteMoved(e){
		//Getting note info.
		xRemoveEventListener(this.father.base.daysContainer,'mouseover',mouseOver);
		var note = this.father.tmpNote;
		sendMsgParam = eyeParam('hourFrom', note.hourFrom);
		sendMsgParam = sendMsgParam + eyeParam('minFrom', note.minFrom);
		sendMsgParam = sendMsgParam + eyeParam('hourEven', note.hourEven);
		sendMsgParam = sendMsgParam + eyeParam('minEven', note.minEven);
		sendMsgParam = sendMsgParam + eyeParam('day', note.day);
		sendMsgParam = sendMsgParam + eyeParam('id', note.cid);
		sendMsgParam = sendMsgParam + eyeParam('calendar',note.calendar);
		sendMsg(this.father.checknum, 'moveNote', sendMsgParam);
		this.father.evenType = 'default';
	}
	this.jsEvent_cancelEvent = function jsEvent_cancelEvent(e){
		var popup = document.getElementById(this.father.tmpNote.cid+'_popupDiv');
		var parent = popup.parentNode;
		parent.removeChild(popup);

		this.father.evenType = 'default';
		xAddEventListener(this.father.base.daysContainer,'mousedown',mouseDown);
		xAddEventListener(this.father.base.daysContainer,'mouseup',mouseUp);
	}

	this.jsEvent_hiddenCalendarNotes = function jsEvent_hiddenCalendarNotes(num){
		for(var h=0;h<this.notes.length;h++){
			var note = this.notes[h];
			if(note.calendar == num){
				note.style.visibility = 'hidden';
				note.style.display = 'none';
			}
		}
	}
	this.jsEvent_showCalendarNotes = function jsEvent_hiddenCalendarNotes(num){
		for(var h=0;h<this.notes.length;h++){
			var note = this.notes[h];
			if(note.calendar == num){
				note.style.visibility = 'visible';
				note.style.display = 'block';
			}
		}
	}
//Recall functions
	this.reCall_resizingNote = function reCall_resizingNote(e){
		if(!e.target.num){
			return false;
		}

		var partTarget = e.target;
		var note = this.father.tmpNote;
		if (note.parts != (partTarget.num+1) && partTarget.num >= note.startPart ) {
			note.parts = note.parts + partTarget.num - note.fromParts;
			note.fromParts = partTarget.num;
			this.draw_resizeNote(note);
			this.draw_title(note);
		}
	}
	this.reCall_movingNote = function reCall_movingNote(e){
		if(isNaN(e.target.num)){
			return false;
		}

		var target = e.target;
		var day = target.day;
		this.father.tmpNote.day = day;
		var partParent = document.getElementById(this.father.pid+'_day_'+day);
		var part = 0;
		part = Math.floor((target.num)/this.father.parts);
		if(target.num > 3){
			part = target.num -part*this.father.parts;
		}else{
			part = target.num;
		}
		var isTotal = target.num+this.father.tmpNote.parts;
		isTotal--;//WE can't count the part 0!!
		if(isTotal < this.father.base.totalParts){
			this.father.tmpNote.startPart = target.num;
			this.father.tmpNote.fromParts = target.num+this.father.tmpNote.parts;

			this.draw_movedNote(partParent,this.father.tmpNote.startPart);
			this.draw_title(this.father.tmpNote);
		}else{
			return false;
		}
	}
	this.reCall_movingNoteBody = function reCall_movingNoteBody(e){
		if(isNaN(e.target.num)){
			return false;
		}
		if(!this.father.tmpNote.lastPart){
			this.father.tmpNote.lastPart = e.target;
			return false;
		}
		var diff = e.target.num-this.father.tmpNote.lastPart.num;
		var day = e.target.day;

		this.father.tmpNote.lastPart = e.target;
		this.father.tmpNote.startPart += diff; 
		var target = document.getElementById(day+'_part_'+this.father.tmpNote.startPart);
		if(!target || isNaN(target.day)){
			return false;
		}
		var day = target.day;
		this.father.tmpNote.day = day;
		var partParent = document.getElementById(this.father.pid+'_day_'+day);
		var part = 0;
		part = Math.floor((target.num)/this.father.parts);
		if(target.num > 3){
			part = target.num -part*this.father.parts;
		}else{
			part = target.num;
		}
		this.father.tmpNote.startPart = target.num;
		this.father.tmpNote.fromParts = target.num+this.father.tmpNote.parts;
		this.draw_movedNote(partParent,this.father.tmpNote.startPart);
		this.draw_title(this.father.tmpNote);
	}
//php event functions
	this.phpEvent_newNote = function phpEvent_newNote(day,hourFrom,hourEven,minFrom,minEven,cid,event,calendar,resizable,movible,title){
		hourFrom = parseInt(hourFrom);
//Getting needed data for draw a new note
		//Date data
		var numHours = hourEven - hourFrom;
		var numMins = minEven - minFrom;
		var totalMins = (numHours*60)+numMins;

		//Part data
		var minPartStart = Math.floor(minFrom/15);
		var totalPartStart =(hourFrom-this.father.hourFrom)*4;
		totalPartStart += minPartStart;

		var parts = Math.floor(totalMins / 15);
		var note = this.draw_newNote(totalPartStart,parts,calendar,cid,resizable,movible);

		//Adding propierties
		var fromPart = totalPartStart+parts;
		note.parts = parts;
		note.fromParts = fromPart;
		note.startPart = totalPartStart;
		note.startPartObj = xGetElementById(day+'_part_'+totalPartStart);
		note.day = day;
		note.cid = cid;
		note.calendar = calendar;
		if(title == 1){
			this.draw_title(note);
		}

		if(event == ' '){
			event = this.father.defaultEvenText;
		}
		this.draw_event(note,event);
		var newFather = document.getElementById(this.father.pid+'_day_'+day);
		newFather.appendChild(note);
		note.newFather = newFather;
		//Adding contextual menu
		this.draw_contextualMenu(note);
		this.notes.push(note);
// 		note.style.width = "90%";
		newFather.addNote(note);
// 		newFather.orderNotes();
	}
	this.phpEvent_cleanNotes = function phpEvent_cleanNotes(){
		//Cleaning all notes
		for(var h=0;h<this.notes.length;h++){
			var note = this.notes[h];
			var parent = note.parentNode;
			parent.removeChild(note);
		}
		//Needed for opera
		this.notes = new Array();
	}
	this.phpEvent_deleteNote = function phpEvent_deleteNote(id){
		for(var h=0;h<this.notes.length;h++){
			var note = this.notes[h];
			if(note.cid == id){
				note.parentNode.removeChild(note);
			}
		}
	}

	this.phpEvent_deleteCalendarNotes = function phpEvent_deleteCalendarNotes(num){
		for(var h=0;h<this.notes.length;h++){
			var note = this.notes[h];
			if(note.calendar == num){
				note.parentNode.removeChild(note);
				delete this.notes[h];
			}
		}
	}
//Draw functions
	this.draw_title = function draw_title(note){
		var noteTitle = note.firstChild;
		var parts = note.parts;
		var startPart = note.startPart;
		var hourFromFloat = startPart/4;
		var hourFrom = parseInt(hourFromFloat);
		//If the hourFrom doesn't is 0
		if(this.father.hourFrom != 0){
			hourFrom = parseInt(this.father.hourFrom) + hourFrom;
			hourFromFloat = hourFromFloat + parseFloat(this.father.hourFrom);
		}
		var minFromFloat = hourFromFloat - hourFrom;
		var minFrom = minFromFloat*60;

		var hourEvenFloat = parts/4;
			hourEvenFloat +=hourFromFloat;
		var hourEven = parseInt(hourEvenFloat);

		var minEvenFloat = hourEvenFloat - hourEven;

		var minEven = minEvenFloat*60;

		if(IEversion && IEversion < 8){
			hourEvenFloat = null;
			minEvenFloat = null;
			minFromFloat = null;
			hourFromFloat = null;
		}else{
			delete hourEvenFloat;
			delete minEvenFloat;
			delete minFromFloat;
			delete hourFromFloat;
		}

		if(hourFrom < 10){
			hourFrom = '0'+hourFrom;
		}
		if(hourEven < 10){
			hourEven = '0'+hourEven;
		}
		if(minFrom < 10){
			minFrom = '0'+minFrom;
		}
		if(minEven < 10){
			minEven = '0'+minEven;
		}

		if(noteTitle.firstChild){
			var titleText = noteTitle.firstChild;
			titleText.data  = hourFrom+':'+minFrom+'-'+hourEven+':'+minEven;
		}else{
			var titleText = document.createTextNode(hourFrom+':'+minFrom+'-'+hourEven+':'+minEven);
			noteTitle.appendChild(titleText);
		}
		//TODO: make a function for get hours and mins
		note.hourFrom = hourFrom;
		note.hourEven = hourEven;
		note.minFrom = minFrom;
		note.minEven = minEven;
	}
	this.draw_movedNote = function draw_movedNote(hour,part){
		var note = this.father.tmpNote;
		var hTop = this.father.pixelPart;
		if(IEversion == 6){
			hTop += 0.50;
		}
		var top = part*hTop;
		top = Math.floor(top);
		note.style.top = top+'px';
		hour.appendChild(note);
	}
	this.draw_newNote = function draw_newNote(part,partsNum,calendar,cid,resizable,movible){
		if(!calendar){
			var calendar = 1;
		}
		var height = this.father.pixelPart;
		height = height*partsNum;
		var hTop = this.father.pixelPart;
		if(IEversion == 6){
			hTop += 0.50;
			if(partsNum > 2){
				var fix = (partsNum+3);
			}else{
				var fix = partsNum+2;
			}
			height += fix;
		}
		var top = part*hTop;
		var bodyHeight = height -this.father.pixelPart-2;//TODO: define bottom height
		var note  = document.createElement('div');
		if(calendar > 5){
			calendarNum = calendar%5;
		}else{
			calendarNum = calendar;
		}
		var bodyColor = this.father.noteBodyColors[calendarNum];
		var headColor = this.father.noteHeaderColors[calendarNum];

		//Check if this note is the first in the table
		if(!this.father.firstTop || this.father.firstTop > top){
			var toRestNow = 0;
// 			if(part > 7){
			//TODO: check if negative scrollTop breaks something in IE and other crapsBrowsers
				toRestNow = this.father.pixelPart*7;
// 			}
			this.father.firstTop = top-toRestNow;
		}
		note.setAttribute('id',this.father.pid+'_note_'+cid);
		note.style.position = 'absolute';
		note.style.top = top+'px';
		note.style.left = '-1px';
		note.style.width = '100%';
		note.pid = this.father.pid;
		note.style.height = height+'px';
		if(IEversion && IEversion < 8){
			note.style.zIndex = '2';
		}
		note.pid = this.father.pid;
			var noteHeader  = document.createElement('div');
			noteHeader.setAttribute('id','noteTitle');
			noteHeader.style.cursor = 'move';
			if(resizable != 1){
				noteHeader.evenType = 'nothingToDo';
				noteHeader.style.cursor = 'default';
			}
			noteHeader.setAttribute('id','noteTitle');
			noteHeader.style.backgroundColor = headColor;
			noteHeader.style.position = 'absolute';
			noteHeader.style.top = '0px';
			noteHeader.style.height = this.father.pixelPart+'px';
			noteHeader.style.width = '100%';
			noteHeader.style.borderRight ='1px '+headColor+' solid';
			noteHeader.style.borderLeft = '1px '+headColor+' solid';
			noteHeader.style.zIndex = '4';
			noteHeader.style.color = 'white';
			noteHeader.style.fontSize = '80%';
			noteHeader.style.textIndent = '4px';
			noteHeader.style.fontWeight = 'bold';
			noteHeader.style.lineHeight = '1.4em';
			if(IEversion){
				noteHeader.onselectstart = function(){
					return false;
				}
			}
		note.noteHeader = noteHeader;
		note.appendChild(noteHeader);
			var noteRemove  = document.createElement('div');
			noteRemove.setAttribute('id','noteRemove');
			noteRemove.style.position = 'absolute';
			noteRemove.style.backgroundRepeat = 'no-repeat';
			noteRemove.style.backgroundImage ='url(index.php?version=' + EXTERN_CACHE_VERSION + '&theme=1&extern=images/apps/eyeCalendar/deleteNote.png)';
			noteRemove.style.top = '0px';
			noteRemove.style.right = '0px';
			noteRemove.style.height = this.father.pixelPart+'px';
			noteRemove.style.width = '10px';
			noteRemove.style.zIndex = '4';
			noteRemove.style.cursor = 'pointer';
			noteRemove.style.color = 'white';
			noteRemove.evenType = 'deleteNote';
			xAddEventListener(noteRemove,'click',mouseClick);
		note.appendChild(noteRemove);
			var noteBodyHeight = height-this.father.pixelPart;
			var noteBody = document.createElement('div');
			noteBody.setAttribute('id','noteBody');
			noteBody.style.position = 'absolute';
			noteBody.style.top = this.father.pixelPart+'px';
			noteBody.style.backgroundColor = bodyColor;
			noteBody.style.height = noteBodyHeight+'px';//TODO: same as top
			noteBody.style.width = '100%';
			noteBody.style.borderRight = '1px '+headColor+' solid';
			noteBody.style.zIndex = '3';
			noteBody.style.borderLeft = '1px '+headColor+' solid';
			noteBody.style.borderRight = '1px '+headColor+' solid';
			if(movible == 1){
				noteBody.style.cursor = 'move';
				noteBody.evenType = 'moveNote';
			}else{
				noteBody.evenType = 'nothingToDo';
				noteBody.style.cursor = 'default';
			}
		note.noteBody = noteBody;
		note.appendChild(noteBody);
			var noteBottom = document.createElement('div');
			noteBottom.setAttribute('id','noteBottom');
			noteBottom.style.cursor = 's-resize';
			if(resizable != 1){
				noteBottom.evenType = 'nothingToDo';
				noteBottom.style.cursor = 'default';
			}
			//noteBottom.style.backgroundColor = 'headColor';
			noteBottom.style.position = 'absolute';
			noteBottom.style.bottom = '0px';
			noteBottom.style.height = '2px';
			noteBottom.style.width = '100%';
			noteBottom.style.zIndex = '4';
			noteBottom.style.left = '1px';
			noteBottom.style.borderBottom = '1px '+headColor+' solid';
		note.noteBottom = noteBottom;
		note.appendChild(noteBottom);
		if(this.father.calendars.calendarInfo[calendar]['show'] == 0){
			note.style.visibility = 'hidden';
			note.style.display = 'none';
		}
		return note;
	}
	this.draw_resizeNote = function resizeNote(note){
		var hTop = this.father.pixelPart;
		if(IEversion == 6){
			hTop += 0.50;
		}
		var height = note.parts*hTop;
  		note.style.height = height+'px';
		note.noteBody.style.height = height-this.father.pixelPart+'px';
	}
	this.draw_event = function draw_event(note,event){
		var textContainer = this.draw_editBox(event);
		note.noteBody.appendChild(textContainer);
	}
	this.draw_editPopup = function draw_editPopup(id,text){
		//Calculing the popup position
		var parentWidth = xWidth(this.father.father);
		var parentHeight = xHeight(this.father.father);
		var top = ((parentHeight/2) -50);
		var left = ((parentWidth/2)-100);
		var left = left+168;
		var popupDiv = document.createElement('div');
		popupDiv.setAttribute('id',id+'_popupDiv');
		popupDiv.style.position = 'absolute';
		popupDiv.style.top = top+'px';
		popupDiv.style.left = left+'px';
		popupDiv.style.height = '110px';
		popupDiv.style.width = '250px';
		popupDiv.style.backgroundColor = 'white';
		popupDiv.style.border = '1px solid gray';
		popupDiv.style.zIndex = '999';
		var inputText1 = document.createElement('div');
			inputText1.setAttribute('id','inputText');
			inputText1.style.marginLeft = '15px';
			inputText1.style.marginTop = '10px';
			inputText1.innerHTML = "$lang:Text for this event:";

		var inputEvent = document.createElement('input');
			inputEvent.setAttribute('id',id+'_inputEvent');
			inputEvent.type = 'text';
			if(text){
				inputEvent.value = text;
			}
			inputEvent.className = "eyeTextbox";
			inputEvent.style.width = '220px';
			inputEvent.style.marginLeft = '15px';
			inputEvent.style.marginTop = '10px';
			inputEvent.evenType = 'changeEvent';
			inputEvent.noPrevent = true;
			inputEvent.pid = this.father.pid;
			xAddEventListener(inputEvent,'keypress',keyPress);
		popupDiv.appendChild(inputText1);
		popupDiv.appendChild(inputEvent);
		popupDiv.inputText = inputEvent;
		var buttonEvent = document.createElement('button');
			buttonEvent.setAttribute('id','buttonEvent');
			buttonEvent.className = 'eyeButtonClass';
			buttonEvent.style.position = 'absolute';
			buttonEvent.style.width = '70px';
			buttonEvent.style.bottom = '15px';
			buttonEvent.style.right = '15px';
			buttonEvent.innerHTML = '$lang:Accept';
			buttonEvent.pid = this.father.pid;
			buttonEvent.evenType = 'changeEvent';
			xAddEventListener(buttonEvent,'click',mouseClick);
		popupDiv.appendChild(buttonEvent);

		var buttonEvent = document.createElement('button');
			buttonEvent.setAttribute('id','buttonEvent');
			buttonEvent.className = 'eyeButtonClass';
			buttonEvent.style.position = 'absolute';
			buttonEvent.style.width = '70px';
			buttonEvent.style.bottom = '15px';
			buttonEvent.style.right = '100px';
			buttonEvent.innerHTML = '$lang:Cancel';
			buttonEvent.pid = this.father.pid;
			buttonEvent.evenType = 'cancelEvent';
			xAddEventListener(buttonEvent,'click',mouseClick);
		popupDiv.appendChild(buttonEvent);
		this.father.evenType = 'editingEvent';
		return popupDiv;
	}
}

function weekPlanner_events(weekPlanner){
	this.father = weekPlanner;
	this.mouseDown = function mouseDown(e){
		//Getting type
		var evenType = '';
		if(this.father && this.father.evenType){
			if(this.father.evenType == 'default'){
				if(e.target.evenType != 'default' && e.target.evenType != ''){
					evenType = e.target.evenType;
				}else{
					evenType = 'default';
				}
			}else{
				evenType = this.father.evenType;
			}
			if(evenType == 'editingEvent'){
				if(e.target.evenType == 'editEvent' || e.target.evenType == 'changeEvent' || e.target.evenType == 'cancelEvent'){
					this.father.evenType = 'default'
					return true;
				}else{
					this.father.notes.jsEvent_cancelEvent(e);
				}
			}else if(evenType == 'nothingToDo'){
				this.father.evenType = 'default'
				return true;
			}
		}

		if(e && e.target && e.target.id && e.target.id != ''){
			if(e.target.id == 'noteTitle'){
				this.father.notes.jsEvent_moveNote(e);
				return true;
			}
			if(e.target.id == 'noteBottom'){
				this.father.notes.jsEvent_resizeNote(e);
				return true;
			}
		}

		if(evenType == 'moveNote'){
			this.father.notes.jsEvent_moveNote(e);
			return true;
		}

		if(evenType == 'default'){
			this.father.notes.jsEvent_newNote(e);
			return true;
		}
	}
	this.mouseUp = function mouseUp(e){
		if(!this.father.tmpNote){
			return false;
		}
		this.father.base.daysContainer.style.cursor = 'pointer';
		this.father.tmpNote.noteBody.style.zIndex = 3;
		if(IEversion && IEversion < 8){
			this.father.tmpNote.style.zIndex = 2;
		}
		if(this.father.tmpNote.lastPart){
			if(IEversion && IEversion < 8){
				this.father.tmpNote.lastPart = null;
			}else{
				delete this.father.tmpNote.lastPart;
			}
		}
		xRemoveEventListener(this.father.base.daysContainer,'mouseover',mouseOver);
		xAddEventListener(this.father.base.daysContainer,'mousedown',mouseDown);

		//Calling to popup functions
		if(this.father.evenType == 'resizeNote2'){
			this.father.evenType = 'default';
			this.father.notes.jsEvent_noteCreated(e);
		}else if(this.father.evenType == 'resizeNote'){
			this.father.evenType = 'default';
			this.father.notes.jsEvent_noteResized(e);
		}else if(this.father.evenType == 'moveNote' || this.father.evenType == 'moveNoteBody' ){
			this.father.evenType = 'default';
			this.father.notes.jsEvent_noteMoved(e);
		}else if(this.father.evenType == 'nothingToDo'){
			this.father.evenType = 'default';
			return false;
		}else{
			this.father.evenType = 'default';
			return false;
		}
	}
	this.mouseOver = function mouseOver(e){
		//Getting type
		var evenType = '';
		if(this.father && this.father.evenType && this.father.evenType == 'default'){
			if(e.target.evenType != 'default' && e.target.evenType != ''){
				evenType = e.target.evenType;
			}else{
				evenType = 'default';
			}
		}else{
			evenType = this.father.evenType;
		}
		if(evenType == 'resizeNote' || evenType == 'resizeNote2'){
			this.father.notes.reCall_resizingNote(e);
		}else if(evenType == 'moveNote'){
			this.father.notes.reCall_movingNote(e);
		}else if(evenType == 'moveNoteBody'){
			this.father.notes.reCall_movingNoteBody(e);
		}
	}
	this.mouseClick = function mouseClick(e){
		//Getting type
		var evenType = '';

		if(this.father && this.father.evenType && this.father.evenType == 'default' || this.father.evenType == 'editingEvent'){
			if(e.target.evenType != 'default' && e.target.evenType != ''){
				evenType = e.target.evenType;
			}else{
				evenType = 'default';
			}
		}else{
			evenType = this.father.evenType;
		}

		if(evenType == 'changeEvent'){
			this.father.notes.jsEvent_setEvent(e);
		}else if(evenType == 'editEvent'){
			this.father.notes.jsEvent_editEvent(e);
		}else if(evenType == 'cancelEvent'){
			this.father.notes.jsEvent_cancelEvent(e);
		}else if(evenType == 'selectCalendar'){
			this.father.calendars.selectCalendar(e);
		}else if(evenType == 'viewCalendar'){
			this.father.calendars.hiddenNotes(e);
		}else if(evenType == 'deleteNote'){
			this.father.notes.jsEvent_deleteNote(e);
		}else if(evenType == 'nothingToDo'){
			return false;
		}
	}
	this.keyPress = function keyPress(e){
		//Getting type
		var evenType = '';
		if(this.father && this.father.evenType && this.father.evenType == 'default' || this.father.evenType == 'editingEvent'){
			if(e.target.evenType != 'default' && e.target.evenType != ''){
				evenType = e.target.evenType;
			}else{
				evenType = 'default';
			}
		}else{
			evenType = this.father.evenType;
		}
		if(evenType == 'changeEvent' && e.keyCode == 13){
			this.father.notes.jsEvent_setEvent(e);
		}
	}
}

function mouseDown(event){
	var e = new xEvent(event);
	if(!e.target.noPrevent){
		xPreventDefault(event);
	}

	if(!e || !e.target || !e.target.id){
		return false;
	}
	var pid;
	if(!e.target.pid){
		var pid = calendar_GetPid(e.target);
		if(!pid){
			return false;
		}
	}else{
		pid = e.target.pid;
	}

	var obj = weekPlanner_instances[pid];
	obj.events.mouseDown(e);
}
function mouseOver(event){
	xPreventDefault(event);
	var e = new xEvent(event);
	if(!e || !e.target || !e.target.id){
		return false;
	}
	var pid;
	if(!e.target.pid){
		var pid = calendar_GetPid(e.target);
		if(!pid){
			return false;
		}
	}else{
		pid = e.target.pid;
	}

	var obj = weekPlanner_instances[pid];
	obj.events.mouseOver(e);
}
function mouseUp(event){
	xPreventDefault(event);
	var e = new xEvent(event);
	if(!e || !e.target || !e.target.id){
		return false;
	}
	var pid;
	if(e.target.id != 'eyeApps'){
		if(!e.target.pid){
			pid = calendar_GetPid(e.target);
			if(!pid){
				return false;
			}
		}else{
			pid = e.target.pid;
		}
		var obj = weekPlanner_instances[pid];
		obj.events.mouseUp(e);
	}else{

	}
}
function mouseClick(event){
	var e = new xEvent(event);

	if(!e || !e.target || !e.target.id){
		return false;
	}

	if(!e.target.noPrevent){
		xPreventDefault(event);
	}
	var pid;

	if(!e.target.pid){
		var pid = calendar_GetPid(e.target);
		if(!pid){
			return false;
		}
	}else{
		pid = e.target.pid;
	}

	var obj = weekPlanner_instances[pid];
	obj.events.mouseClick(e);
}
function keyPress(event){
	var e = new xEvent(event);

	var pid;
	if(!e.target.pid){
		var pid = calendar_GetPid(e.target);
		if(!pid){
			return false;
		}
	}else{
		pid = e.target.pid;
	}

	var obj = weekPlanner_instances[pid];
	obj.events.keyPress(e);
}
/************
*Other creating notes function
*************/
function calculePart(pixels,total){
	var percent = Math.floor(pixels*100/total);
	if(percent <=25){
		return 1;
	}
	if(percent <=50){
		return 2;
	}
	if(percent <=75){
		return 3;
	}
	if(percent <=100){
		return 4;
	}
}

/**************
*PHP: php called by php
***************/
function resizeDays(){
	var rest = parseInt(this.numDays)+0.1;
	this.rowWidth = (xWidth(this.base.daysBase)-rest)/this.numDays;
	var day = '';
	for(h=this.dayFrom;h<=this.numDays-1;h++)
	{
		day = xGetElementById(this.pid+'_dayTodo_'+h);
		day.style.width = this.rowWidth+'px';
 		day = xGetElementById(this.pid+'_dayName_'+h);
 		day.style.width = this.rowWidth+'px';
 		day = xGetElementById(this.pid+'_day_'+h);
 		day.style.width = this.rowWidth+'px';
	}
	var fatherDays = xGetElementById(this.pid+'_fatherDays');
	var fatherDaysHeight = fatherDays.parentNode.style.height;
	fatherDays.style.height = fatherDaysHeight;
}
function onResizeEyeCalendar(pid){
		weekPlanner_instances[pid].resizeDays();
}
function onChangeDateCalendar(pid,weekDays,dayFrom,dayEven){
	weekPlanner_instances[pid].base.changeDate(weekDays,dayFrom,dayEven);
}
function onAddNoteCalendar(pid,day,hourFrom,hourEven,minFrom,minEven,id,event,calendar,resizable,movible,title){
	weekPlanner_instances[pid].notes.phpEvent_newNote(day,hourFrom,hourEven,minFrom,minEven,id,event,calendar,resizable,movible,title);
}
function onCleanNotesCalendar(pid){
	weekPlanner_instances[pid].notes.phpEvent_cleanNotes();
}
function onCleanCalendars(pid){
	weekPlanner_instances[pid].calendars.cleanCalendars();
}
function onAddCalendar(pid,name,num,show){
	weekPlanner_instances[pid].calendars.drawCalendar(name,num,show);
}
function onShowNotesCalendar(pid,num){
	weekPlanner_instances[pid].notes.jsEvent_showCalendarNotes(num);
}
function onHiddenNotesCalendar(pid,num){
	weekPlanner_instances[pid].notes.jsEvent_hiddenCalendarNotes(num);
}
function onDeleteCalendarNotes(pid,num){
	weekPlanner_instances[pid].notes.phpEvent_deleteCalendarNotes(num);
}
function onDeleteNote(pid,id){
	weekPlanner_instances[pid].notes.phpEvent_deleteNote(id);
}
function onSelectCalendar(pid,num){
	weekPlanner_instances[pid].calendars.phpSelectCalendar(num);
}
function onGoToFirstNote(pid){
	weekPlanner_instances[pid].base.goToFirstNote();
}
function calendar_updateCurrentHour(pid){
	if(weekPlanner_instances[pid]){
		weekPlanner_instances[pid].base.updateCurrentHour(pid);
	}
}
function calendar_GetPid(node){
	//Five loops would be sufficient
	var pid;
	node = node.parentNode;
	for(var x=0;x<5;x++){
		if(node.pid){
			return node.pid;
		}
		node = node.parentNode;
	}
}
function init_calendar() {
// 	var div = document.createElement('div');
// 	div.setAttribute('id','debugDiv');
// 	div.style.height = "400px";
// 	div.style.width = "200px";
// 	div.style.position = "absolute";
// 	div.style.top = "30px";
// 	div.style.right = "0px";
// 	div.style.zIndex = "500";
// 	div.style.backgroundColor = 'white';
// 	div.style.overFlow = 'scroll';
// 	xGetElementById('eyeApps').appendChild(div);
	sendMsg(eyeCalendarChecknum,'Launch','');
}
// function debug(string){
// 	var dDiv = xGetElementById('debugDiv');
// 	var html = dDiv.innerHTML;
// 	html = html+"<br/>"+string+"<br/>";
// 	dDiv.innerHTML = html;
// }
init_calendar();
