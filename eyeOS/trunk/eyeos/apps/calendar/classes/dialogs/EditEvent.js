/*
*                 eyeos - The Open Source Cloud's Web Desktop
*                               Version 2.0
*                   Copyright (C) 2007 - 2010 eyeos Team 
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License
* version 3 along with this program in the file "LICENSE".  If not, see 
* <http://www.gnu.org/licenses/agpl-3.0.txt>.
* 
* See www.eyeos.org for more details. All requests should be sent to licensing@eyeos.org
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* eyeos" logo and retain the original copyright notice. If the display of the 
* logo is not reasonably feasible for technical reasons, the Appropriate Legal Notices
* must display the words "Powered by eyeos" and retain the original copyright notice. 
*/

qx.Class.define('eyeos.calendar.dialogs.EditEvent', {
	extend: eyeos.dialogs.Dialog,
	
	/**
	 * TODO
	 * 
	 * @param eventModel {eyeos.calendar.model.Event}
	 */
	construct: function (controller, eventModel) {
		this.__eventModel = eventModel;
		this.__controller = controller;
		if (!this.__controller) {
			throw '[eyeos.calendar.dialogs.EditEvent] construct() Missing controller argument.';
		}
	
		arguments.callee.base.call(this, tr('Event Details'), 'index.php?extern=images/16x16/actions/appointment-new.png');
		
		this.addListener('keypress', function(e) {
			if (e.getKeyIdentifier().toLowerCase() == 'escape') {
				this.cancel();
			}
		}, this);
	},
	
	members: {
		
		__controller: null,
		__eventModel: null,
		
		__subjectTextField: null,
		__locationTextField: null,
		__startDateField: null,
		__startTimeSelectBox: null,
		__endDateField: null,
		__endTimeSelectBox: null,
		__allDayCheckBox: null,
		__repeatsSelectBox: null,
		__calendarSelectBox: null,
		__descriptionTextArea: null,
		
		__calendarsSelectBox: null,
		
		
		__saveChanges: function() {
			var startTime = this.__startDateField.getValue();
			startTime.setHours(0);
			startTime.setMinutes(0);
			startTime.setSeconds(0);
			startTime.setMilliseconds(0);
			startTime.setMinutes(30 * this.__startTimeSelectBox.getSelection()[0].getModel());
			
			var endTime = this.__startDateField.getValue();
			endTime.setHours(0);
			endTime.setMinutes(0);
			endTime.setSeconds(0);
			endTime.setMilliseconds(0);
			endTime.setMinutes(30 * this.__endTimeSelectBox.getSelection()[0].getModel());
			
			if (endTime.getTime() <= startTime.getTime()) {
				eyeos.alert(tr('Please specify a correct time range.'));
				return;
			}
			
			this.__eventModel.setSubject(this.__subjectTextField.getValue());
			this.__eventModel.setLocation(this.__locationTextField.getValue());
			this.__eventModel.setTimeStart(startTime);
			this.__eventModel.setTimeEnd(endTime);
			
			// TODO: All-Day
			
			// TODO: Repeats
			
			this.__eventModel.setCalendar(this.__calendarSelectBox.getSelection()[0].getModel());
			this.__eventModel.setDescription(this.__descriptionTextArea.getValue());
			
			this.__controller.saveEvent(this.__eventModel, function() {
				// If the event belongs to a currently non-visible calendar, show it
				if (!this.__eventModel.getCalendar().isVisible()) {
					this.__eventModel.getCalendar().setVisible(true);
				}
			}, this);
		},
		
		// overridden
		_init: function() {
			this.set({
				//height: 420,
				width: 340,
				contentPadding: 10,
				resizable: false,
				showStatusbar: false,
				showMaximize: false,
				showMinimize: false,
				showClose: false,
				destroyOnClose: true,
				centerMethod: 'parentWindow'
			});
			var myLayout = new qx.ui.layout.Grid(5, 5);
			myLayout.setColumnFlex(1, 1);
			this.setLayout(myLayout);
			
			
			var eventTimeStart = this.__eventModel.getTimeStart();
			var eventTimeEnd = this.__eventModel.getTimeEnd();
			
			
			var rowIdx = 0;
			
			// Title
			var titleLabel = new qx.ui.basic.Label(this.__eventModel.getSubject()).set({
				font: new qx.bom.Font(18, ['Arial', 'sans-serif'])
			});
			this.add(titleLabel, {row: rowIdx++, column: 1});
			
			this.add(new qx.ui.menu.Separator(), {row: rowIdx++, column: 0, colSpan: 2});
			
			// Subject
			this.add(new qx.ui.basic.Label(tr('Subject:')), {row: rowIdx, column: 0});
			this.__subjectTextField = new qx.ui.form.TextField(this.__eventModel.getSubject());
			this.__subjectTextField.addListener('input', function(e) {
				titleLabel.setValue(e.getData());
			}, this);
			this.__subjectTextField.focus();
			this.add(this.__subjectTextField, {row: rowIdx++, column: 1});
			
			// Location
			this.add(new qx.ui.basic.Label(tr('Location:')), {row: rowIdx, column: 0});
			this.__locationTextField = new qx.ui.form.TextField(this.__eventModel.getLocation());
			this.add(this.__locationTextField, {row: rowIdx++, column: 1});
			
			// When
			this.add(new qx.ui.basic.Label('When:'), {row: rowIdx, column: 0});
			var whenFieldsContainer = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
			this.add(whenFieldsContainer, {row: rowIdx++, column: 1});
			this.__startDateField = new qx.ui.form.DateField();
			this.__startDateField.setValue(eventTimeStart);
			whenFieldsContainer.add(this.__startDateField, {row: 0, column: 0});
			this.__startTimeSelectBox = new qx.ui.form.SelectBox().set({
				width: 90
			});
			for(var i = 0; i < 48; i++) {		// Display hh:mm
				var hours = Math.floor(i / 2) > 9 ? Math.floor(i / 2) : '0' + Math.floor(i / 2);
				var minutes = ((i % 2) * 30 > 9 ? (i % 2) * 30 : '0' + (i % 2) * 30);
				var time = hours + ':' + minutes;
				
				var item = new qx.ui.form.ListItem(time).set({
					model: i
				});
				this.__startTimeSelectBox.add(item);
				
				if (eventTimeStart.getHours() == hours && eventTimeStart.getMinutes() == minutes) {
					this.__startTimeSelectBox.setSelection([item]);
				}
			}
			whenFieldsContainer.add(this.__startTimeSelectBox, {row: 0, column: 1});
			
			// --- TEMPORARY IMPLEMENTATION
			this.__endDateField = new qx.ui.form.DateField().set({
				enabled: false
			});
			this.__endDateField.setValue(eventTimeEnd);
			this.__startDateField.addListener('changeValue', function(e) {
				this.__endDateField.setValue(e.getData());
			}, this);
			// --- TEMPORARY IMPLEMENTATION
			
			whenFieldsContainer.add(this.__endDateField, {row: 1, column: 0});
			this.__endTimeSelectBox = new qx.ui.form.SelectBox().set({
				width: 90
			});
			for(var i = 0; i < 48; i++) {		// Display hh:mm
				var hours = Math.floor(i / 2) > 9 ? Math.floor(i / 2) : '0' + Math.floor(i / 2);
				var minutes = ((i % 2) * 30 > 9 ? (i % 2) * 30 : '0' + (i % 2) * 30);
				var time = hours + ':' + minutes;
				
				var item = new qx.ui.form.ListItem(time).set({
					model: i
				});
				this.__endTimeSelectBox.add(item);
				
				if (eventTimeEnd.getHours() == hours && eventTimeEnd.getMinutes() == minutes) {
					this.__endTimeSelectBox.setSelection([item]);
				}
			}
			whenFieldsContainer.add(this.__endTimeSelectBox, {row: 1, column: 1});
			this.__allDayCheckBox = new qx.ui.form.CheckBox(tr('All Day')).set({
				enabled: false
			});
			whenFieldsContainer.add(this.__allDayCheckBox, {row: 0, column: 2});
			
			//Repeats
			this.add(new qx.ui.basic.Label(tr('Repeats:')), {row: rowIdx, column: 0});
			this.__repeatsSelectBox = new qx.ui.form.SelectBox().set({
				enabled: false,
				allowGrowX: false
			});
			this.add(this.__repeatsSelectBox, {row: rowIdx++, column: 1});
			
			this.add(new qx.ui.menu.Separator(), {row: rowIdx++, column: 0, colSpan: 2});
			
			// Calendar
			this.add(new qx.ui.basic.Label(tr('Calendar')+':'), {row: rowIdx, column: 0});
			this.__calendarSelectBox = new qx.ui.form.SelectBox().set({
				allowGrowX: false
			});
			var calendars = this.__controller.getCalendars();
			for(var id in calendars) {
				var item = new qx.ui.form.ListItem(calendars[id].getName()).set({
					model: calendars[id]
				});
				this.__calendarSelectBox.add(item);
				if (id == this.__eventModel.getCalendar().getId()) {
					this.__calendarSelectBox.setSelection([item]);
				}
			}
			this.add(this.__calendarSelectBox, {row: rowIdx++, column: 1});
			
			// Description
			this.add(new qx.ui.basic.Label(tr('Description')+':'), {row: rowIdx, column: 0});
			this.__descriptionTextArea = new qx.ui.form.TextArea(this.__eventModel.getDescription()).set({
				wrap: true
			});
			this.add(this.__descriptionTextArea, {row: rowIdx++, column: 1});
			
			
			this.add(new qx.ui.menu.Separator(), {row: rowIdx++, column: 0, colSpan: 2});
			
			// Buttons
			myLayout.setRowAlign(rowIdx, 'right', 'bottom');
			var buttonsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(5).set({
				alignX: 'right'
			}));
			this.add(buttonsContainer, {row: rowIdx, column: 0, colSpan: 2});
			
			var applyButton = new qx.ui.form.Button(tr('Apply'));
			applyButton.addListener('execute', function(e) {
				this.__saveChanges();
			}, this);
			buttonsContainer.add(applyButton);
			var cancelButton = new qx.ui.form.Button(tr('Cancel'));
			cancelButton.addListener('execute', function(e) {
				this.cancel();
			}, this);
			buttonsContainer.add(cancelButton);
			var saveButton = new qx.ui.form.Button(tr('Save'));
			saveButton.addListener('execute', function(e) {
				this.saveAndClose();
			}, this);
			buttonsContainer.add(saveButton);
		},
		
		cancel: function() {
			if (this.__eventModel.getId() == null) {
				this.__controller.cancelNewEvent(this.__eventModel);
			}
			this.close();
		},
		
		close: function() {
			this.destroy();
			var displayedDialogs = this.__controller.getProcVar('eyeos.calendar.dialogs.EditEvent.instances');
			delete displayedDialogs[this.toHashCode()];
			this.__controller.setProcVar('eyeos.calendar.dialogs.EditEvent.instances', displayedDialogs);
		},
		
		saveAndClose: function() {
			this.__saveChanges();
			this.close();
		},
		
		open: function() {
			var displayedDialogs = this.__controller.getProcVar('eyeos.calendar.dialogs.EditEvent.instances');
			if (!displayedDialogs) {
				displayedDialogs = {};
			}
			displayedDialogs[this.toHashCode()] = this;
			this.__controller.setProcVar('eyeos.calendar.dialogs.EditEvent.instances', displayedDialogs);
			this.base(arguments);
		},
		
		
		destruct : function() {
			//TODO
		}
	}
});