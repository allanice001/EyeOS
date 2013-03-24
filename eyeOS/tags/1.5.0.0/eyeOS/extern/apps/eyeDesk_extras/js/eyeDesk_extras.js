/*
                                  ____   _____ 
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___  
                 / _ \ | | |/ _ \ |  | |\___ \ 
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/ 
                       __/ |                   
                      |___/              1.5

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - eyeOS.org/whoarewe

     eyeOS is released under the GNU General Public License Version 3 (GPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/gpl.txt

        Copyright 2005-2008 eyeOS Team (team@eyeos.org)         
*/
init_eyeDesk_extras($myPid,$checknum);
eyeCalendar_active = 0;
function init_eyeDesk_extras(myPid,checknum) {
	var eyeApps = document.getElementById('eyeApps');
	var eyeClockId = document.createElement('div');
	var eyeClockText = document.createElement('div');
	
	eyeClockId.setAttribute('id',myPid+'_eyeClockDiv');
	xAddEventListener(eyeClockId,'click',showMiniCalendar);
	eyeClockText.setAttribute('id',myPid+'_eyeClockText');
	
	eyeClockId.className = "eyeClock";
	eyeClockText.className = "eyeClockText";
	
	eyeApps.appendChild(eyeClockId);
	eyeClockId.appendChild(eyeClockText);

	eyeClock(myPid);

	var params = new Object();
	params.width = '168';
	params.height = '148';	
		
	var calendarContent = document.createElement('div');
	calendarContent.setAttribute('id',myPid+'_calendar_Content');
	calendarContent.className="eyeDesk_miniCalendar";
		
	eyeApps.appendChild(calendarContent);
	//Preparing params arguments for calendar widget.
	var params = new Object();
	params.width = '168';
	params.height = '148';	
	//Calendar widget colors
	params.rowsAndDate = '#519eda';
	params.workDays = 'white';
	params.preMonthDays = '#bbbbbb';
	params.nextMonthDays = '#bbbbbb';
	params.weekEnd = '#519eda';
	params.todayBorder = '#132B4D';
	params.monthNames = '$months';
	params.weekDays = '$weekDays';	
	params.backgroundNames = '#53A0E1';
	params.todayBackground = '#90A6C2';
	params.todayFontColor = '#000';
	params.toWeekBackground = '#2A4774';
	params.drawServerDate = '';
	params.forceDate = '';
	params.drawHighlight = 0;
	params.drawOnClick = 0;
	Calendar_show(params,'calendarWidget_'+myPid,myPid+'_calendar_Content',100,100,1,0,checknum,1);
		
	function showMiniCalendar(){
		if (eyeCalendar_active == 0) {
			document.getElementById(myPid+'_calendar_Content').style.display="block";
			eyeCalendar_active = 1;
		} else {
			document.getElementById(myPid+'_calendar_Content').style.display="none";
			eyeCalendar_active = 0;
		}
	}
	function hideMiniCalendar() {
		
	}
}

function eyeClock(myPid) {
	var myTime = new Date();
	var hours = myTime.getHours();
	var minutes = myTime.getMinutes();
	var day = myTime.getDate();
	var month = myTime.getMonth() + 1;
	
	if (minutes <= 9) minutes = "0" + minutes;
	if (hours <= 9) hours = "0" + hours;
	if (day <= 9) day = "0" + day;
	if (month <= 9) month = "0" + month;
	
	var display = day + "/" + month + " &nbsp; " + hours + ":" + minutes;
	var eyeClockText = document.getElementById(myPid+"_eyeClockText");
	eyeClockText.innerHTML = display;
	setTimeout("eyeClock("+myPid+");", 5000);
}


