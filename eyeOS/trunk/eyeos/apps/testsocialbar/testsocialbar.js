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

function testsocialbar_application(checknum, pid, user) {
	var app = new eyeos.application.TestSocialBar(checknum, pid);
	app.drawGUI();
}

qx.Class.define('eyeos.application.TestSocialBar', {
	extend: eyeos.system.EyeApplication,

	construct: function(checknum, pid) {
		arguments.callee.base.call(this, 'testsocialbar', checknum, pid);
	},

	members: {

		drawGUI: function() {
			var mainWindow = new eyeos.ui.Window(this, 'Test Social Bar');
			mainWindow.setLayout(new qx.ui.layout.HBox(0));

			var testPage = new qx.ui.container.Composite();
			testPage.add(new qx.ui.basic.Label("Real Application"));
			testPage.set({
				layout : new qx.ui.layout.VBox(0)
			});
			mainWindow.add(testPage, {
				flex: 1
			});

			/*
			 * SOCIAL BAR CREATION AND SETTING
			 */
			var socialBar = new eyeos.socialbar.SocialBar('#F3F3F3');
			// Create the Default Tab
			socialBar.createDefaultTabs();
			/*
			 * ---------------------------INFOBOX-------------------------------
			 */

			// CREATE INFO OBJECT
			var name = 'File1';
			var infoList = [['Type', 'Text document'], ['Size', '200 Kb'], ['Modified', '25/05/2009']];
			var imagePath = 'index.php?extern=images/64x64/actions/document-preview.png';
			var ratingEnabled = true;
			var ratingValue = 3;
			var infoItem = new eyeos.socialbar.Info(name, infoList, imagePath, ratingEnabled, ratingValue);
			
			//CREATE INFOBOX
			var infoBox = new eyeos.socialbar.InfoBox(infoItem);
			//ASSOCIATE EVENTS
			infoBox.addListener('changeRating', function (e){
				console.log('infoBox ratingChange: '+ e.getData());
			});
			//ADD TO TAB
			socialBar.getTab('Info').addBox(infoBox);
			/*
			 * -----------------------------------------------------------------
			 */

			/*
			 * -------------------------TagBox----------------------------------
			 */
			var tag = new eyeos.socialbar.Tag([1,2,3,4,5,6], ['pata', 'papuppi', 'questo', 'pesto', 'testa', 'di'], ['red', 'blue', 'orange', 'purple', 'yellow', 'green']);
			var relation = new eyeos.socialbar.Relation([1,2,3,4,1], ['item1', 'item3', 'item4', 'item3', 'item2']);

			var tagBox = new eyeos.socialbar.TagBox(tag, relation);

			tagBox.addListener('selectTag', function (e) {
				console.log('tagBox Selected: '+ e.getData());
			});

			tagBox.addListener('unselectTag', function (e) {
				console.log('tagBox deSelected: '+ e.getData());
			});

			tagBox.addListener('assignTag', function (e) {
				var params = e.getData();
				console.log('tagBox assign ITEM '+ params[0] + ' TAG ' + params[1]);
			});

			tagBox.addListener('unassignTag', function (e) {
				var params = e.getData();
				console.log('tagBox deAssign ITEM '+ params[0] + ' TAG ' + params[1]);
			});
			tagBox.addListener('deleteTag', function (e) {
				console.log('tagBox tagDeleted ID '+ e.getData());
			});

			tagBox.addListener('setTagName', function (e) {
				var params = e.getData();
				console.log('tagBox ChangeName Id ' + params[0] + ' newName ' + params[1]);
			});

			tagBox.addListener('createNewTag', function (e) {
				var params = e.getData();
				console.log('tagBox Create new Tag Id ' + params[0] + ' Name ' + params[1] + ' Color ', params[2]);
			});

			tagBox.addListener('setTagColor', function (e) {
				var params = e.getData();
				console.log('tagBox tagChangeColor Id ' + params[0] + ' newColor ' + params[1]);
			});
			socialBar.getTab('Info').addBox(tagBox);

			/*
			 * -----------------------------------------------------------------
			 */

			
			/*
			 * -------------------------Shared With-----------------------------
			 */

			var shared1 = new eyeos.socialbar.Shared(
				'item1',
				['eyeID_EyeosUser_c', 'eyeID_EyeosUser_d'],
				[]
			);

			var shared2 = new eyeos.socialbar.Shared(
				'item2',
				['eyeID_EyeosUser_john', 'eyeID_EyeosUser_d'],
				['eyeID_EyeosUser_c']
			);

			var sharedWithBox = new eyeos.socialbar.SharedWithBox(this._checknum, [shared1, shared2]);
			socialBar.getTab('Info').addBox(sharedWithBox);

			sharedWithBox.addListener('deleteShare', function (e) {
				console.log('SharedWith share Deleted with UserID : ', e.getData());
			}, this);

			sharedWithBox.addListener('changePrivilege', function (e) {
				var params = e.getData();
				console.log('SharedWith Change privilege to user : ' + params[0] + ' wwith value : ' + params[1]);
			}, this);

			/*
			 * -----------------------------------------------------------------
			 */
			/*
			 * ------------------------Activity---------------------------------
			 */
			var activityBox = new eyeos.socialbar.ActivityBox();
			socialBar.getTab('Activity').addBox(activityBox);
			// CREATED ITEM
			var myDate = new Date();

				
			var activityNew = new eyeos.socialbar.Activity(
				'Created',
				'eyeID_EyeosUser_john',
				myDate,
				this._checknum,
				null,
				null,
				null
				);
			activityBox.addActivity(activityNew);
			var activityStartSharing = new eyeos.socialbar.Activity(
				'StartSharing',
				'eyeID_EyeosUser_john',
				myDate,
				this._checknum,
				null,
				null,
				null
				);
			activityBox.addActivity(activityStartSharing);
			var activityStopSharing = new eyeos.socialbar.Activity(
				'StopSharing',
				'eyeID_EyeosUser_john',
				myDate,
				this._checknum,
				null,
				null,
				null
				);
			activityBox.addActivity(activityStopSharing);

			var activityNote = new eyeos.socialbar.Activity(
				'Note',
				'eyeID_EyeosUser_john',
				myDate,
				this._checknum,
				null,
				null,
				null
				);
			//activityBox.addActivity(activityNote);

			var activityModification = new eyeos.socialbar.Activity(
				'Modification',
				'eyeID_EyeosUser_john',
				myDate,
				this._checknum,
				2,
				null,
				null
				);
			activityBox.addActivity(activityModification);

			activityBox.addListener('changeRevision', function (e) {
				console.log('ActivityBox Change Revision: '+ e.getData());
			});
			activityBox.addListener('previewItem', function (e) {
				console.log('ActivityBox Preview Item: '+ e.getData());
			});


			/*
			 * -----------------------------------------------------------------
			 */

			/*
			 * -------------------------Notes-----------------------------------
			 */
			
			var noteBox = new eyeos.socialbar.NoteBox(this._checknum);
			socialBar.getTab('Notes').addBox(noteBox);
			
			var note1 = new eyeos.socialbar.Note(
				'1',
				'eyeID_EyeosUser_john',
				myDate,
				true,
				'Ciao mamma guarda come mi diverto con Canta tu!'
			);
			
			noteBox.addNote(note1);
			
			var note2 = new eyeos.socialbar.Note(
				'2',
				'eyeID_EyeosUser_john',
				myDate,
				true,
				'A me piace ... di vero!'
			);
			
			noteBox.addNote(note2);
			
			var note3 = new eyeos.socialbar.Note(
				'3',
				'eyeID_EyeosUser_john',
				myDate,
				true,
				'GHIEEEEeeeeee'
			);
			
			noteBox.addNote(note3);
			
			
			
			noteBox.addListener('deleteNote', function (e){
				console.log('NoteBox deleted note with ID : ', e.getData());
			});
			
			noteBox.addListener('toggleFavoriteNote', function (e){
				var params = e.getData();
				console.log('NoteBox change favorite ID : ' + params[0] + ' newValue: ' + params[1]);
			});
			
			noteBox.addListener('createNote', function (e){
				var params = e.getData();
				console.log('NoteBox New Note ID : ' + params[0] + ' text: ' + params[1]);
			});
			
			
			/*
			 * -----------------------------------------------------------------
			 */

			/*
			 * -------------------------Shared----------------------------------
			 */
			var shared1 = new eyeos.socialbar.Shared(
				'item1',
				['eyeID_EyeosUser_john', 'eyeID_EyeosUser_pepe', 'eyeID_EyeosUser_angel'],
				['eyeID_EyeosUser_joca']
			);

			var shared2 = new eyeos.socialbar.Shared(
				'item2',
				['eyeID_EyeosUser_angel', 'eyeID_EyeosUser_anael'],
				['eyeID_EyeosUser_pepe', 'eyeID_EyeosUser_joca']
			);
			var sharedBox = new eyeos.socialbar.SharedBox(this._checknum, [shared1]);
			socialBar.getTab('Share').addBox(sharedBox);

			sharedBox.addListener('selectItem', function (e) {
				console.log('SharedBox: itemSelected ' + e.getData());
			});

			sharedBox.addListener('unselectItem', function (e) {
				console.log('SharedBox: itemDeSelected ' + e.getData());
			});
			
			sharedBox.addListener('deleteShare', function (e) {
				var params = e.getData();
				console.log('SharedBox : shareDeleted userID: ' + params);
			});
			sharedBox.addListener('changePrivilege', function (e) {
				var params = e.getData();
				console.log('SharedBox : Change Privilege ID: ' + params[0] + ' permission: ' + params[1]);
			});

			/*
			 * -----------------------------------------------------------------
			 */

			//Add to Window
			mainWindow.add(socialBar);


			mainWindow.open();
		}
	}
});
