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

init_eyeDesk_extras($myPid,$checknum);

function eyeClock(myPid) {
	var myTime = new Date();
	var hours = myTime.getHours();
	var minutes = myTime.getMinutes();
	var day = myTime.getDate();
	var month = myTime.getMonth() + 1;
	
	if (minutes <= 9) minutes = '0' + minutes;
	if (hours <= 9) hours = '0' + hours;
	if (day <= 9) day = '0' + day;
	if (month <= 9) month = '0' + month;
	
	xGetElementById(myPid + '_eyeClockText').innerHTML = day + '/' + month + ' &nbsp; ' + hours + ':' + minutes;
	setTimeout('eyeClock(' + myPid + ');',5000);
}

function init_eyeDesk_extras(myPid,checknum) {
	// Clock
	var eyeClockId = document.createElement('div');
	eyeClockId.setAttribute('id',myPid + '_eyeClockDiv');
	eyeClockId.className = 'eyeClock';
	
	var eyeClockText = document.createElement('div');
	eyeClockText.setAttribute('id',myPid + '_eyeClockText');
	eyeClockText.className = 'eyeClockText';
	
	xAddEventListener(eyeClockId,'click',showMiniCalendar);
	xGetElementById('eyeApps').appendChild(eyeClockId);
	eyeClockId.appendChild(eyeClockText);
	
	eyeClock(myPid);
	
	// Calendar
	var calendarContent = document.createElement('div');
	calendarContent.setAttribute('id',myPid + '_calendar_Content');
	calendarContent.className = 'eyeDesk_miniCalendar';
	xGetElementById('eyeApps').appendChild(calendarContent);
	
	var params = new Array();
	params.backgroundNames = '#53a0e1';
	params.drawHighlight = 0;
	params.drawOnClick = 0;
	params.drawServerDate = '';
	params.forceDate = '';
	params.height = '148';
	params.monthNames = '$months';
	params.nextMonthDays = '#bbbbbb';
	params.preMonthDays = '#bbbbbb';
	params.rowsAndDate = '#519eda';
	params.todayBackground = '#90a6c2';
	params.todayBorder = '#132b4d';
	params.todayFontColor = '#000000';
	params.toWeekBackground = '#2a4774';
	params.weekDays = '$weekDays';
	params.weekEnd = '#519eda';
	params.width = '168';
	params.workDays = 'white';
	
	Calendar_show(params,'calendarWidget_' + myPid,myPid + '_calendar_Content',100,100,1,0,checknum,1);
	
	function hideMiniCalendar() {}
	
	function showMiniCalendar() {
		if (xGetElementById(myPid + '_calendar_Content').style.display == 'block') {
			xGetElementById(myPid + '_calendar_Content').style.display = 'none';
		} else {
			xGetElementById(myPid + '_calendar_Content').style.display = 'block';
		}
	}
}