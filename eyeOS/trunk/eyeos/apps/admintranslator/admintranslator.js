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
* */

/**
 *	admintranslator is an application to assign a translation job to an eyeos user.
 *	This application SHOULD NOT BE PUBLISHED, it will be distribuited to the admin
 */
function admintranslator_application(checknum, pid, args) {
	var myApp = new eyeos.application.AdminTranslator(checknum, pid, args);
}

qx.Class.define('eyeos.application.AdminTranslator', {
	extend: eyeos.system.EyeApplication,

	construct: function(checknum, pid, args) {
		arguments.callee.base.call(this, 'AdminTranslator', checknum, pid);

		eyeos.callMessage(checknum, 'getCredential', null, function(results) {
			if (results == 'true') {
				this._drawGui();
			} else {
				this._showNOTAuthorizedGui();
			}
		}, this);
	},

	members: {
		// Gui component
		__window: null,					// Main Window
		__addContainer: null,			// Layout part to add a language assignation
			__comboUserList: null,		// Combo User List
		__viewContainer: null,			// Layout part to view all languages assignations
			_layoutContentBox: null,	//The main content
		
		_drawGui: function () {
			this.__window = new eyeos.ui.Window(this, tr('Admin Translator'), 'index.php?extern=images/16x16/apps/office-calendar.png').set({
				contentPadding: 4,
				width: 550,
				height: 350,
				backgroundColor: '#ffffff'
			});
			this.__window.setLayout(new qx.ui.layout.VBox());
			
			this._createAddLayout();
			this._createViewLayout();
			
			this.__window.open();
		},

		/**
		 * Create the layout part to add a language
		 */
		_createAddLayout: function () {
			this.__addContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
			this.__window.add(this.__addContainer);

			 var boxAdd = new qx.ui.groupbox.GroupBox('Create New Language').set({
				 layout: new qx.ui.layout.Canvas()
			 });
			 this.__addContainer.add(boxAdd);
			 
			// LANGUAGE 
			var languageLabel = new qx.ui.basic.Label('Language');
			boxAdd.add(languageLabel, {top: 8, left: 10});

			var languageInput = new qx.ui.form.TextField('');
			boxAdd.add(languageInput, {top: 5, left: 65});

			// CODE
			var codeLabel = new qx.ui.basic.Label('Code');
			boxAdd.add(codeLabel, {top: 8, left: 160});

			var codeInput = new qx.ui.form.TextField('').set({
				maxLength: 10,
				width: 60
			});
			boxAdd.add(codeInput, {top: 5, left: 190});

			// USER LIST
			eyeos.callMessage(this._checknum, 'getAllUsers', null, function (results) {

				this.__comboUserList = new qx.ui.form.SelectBox().set({
					width: 130,
					maxWidth: 130
				});

				for (var i = 0; i < results.length; ++i) {
					var myContact = results[i];
					var name = myContact['name']

					this.__comboUserList.add(new qx.ui.form.ListItem(name).set({
						model: myContact['id']
					}));
				}

				// Label
				var userLabel = new qx.ui.basic.Label('User');
				boxAdd.add(userLabel, {top: 8, left: 255});

				//Combo
				boxAdd.add(this.__comboUserList, {top: 5, left: 285});
				
			}, this);

			var createButton = new qx.ui.form.Button('Create');
			createButton.addListener('execute', function() {
				var param = {
					language: languageInput.getValue(),
					code: codeInput.getValue(),
					assigned: this.__comboUserList.getSelection()[0].getModel()
				};
				eyeos.callMessage(this._checknum, 'saveLanguage', param, function(results){
					languageInput.setValue('');
					codeInput.setValue('');
					this._updateViewLayout();
				}, this);
			}, this);
			boxAdd.add(createButton, {top: 5, left: 440});


		},
		
		/**
		 * Create the layout part to view all the languages assignation
		 */
		_createViewLayout: function () {
			 var boxView = new qx.ui.groupbox.GroupBox('Existing Assignations').set({
				 layout: new qx.ui.layout.VBox()
			 });
			 this.__addContainer.add(boxView);

			 var layoutContentScroll = new qx.ui.container.Scroll().set({
				allowStretchY: true,
				allowStretchX: true
			});
			boxView.add(layoutContentScroll, {flex: 1});

			this._layoutContentBox = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
				allowStretchY: true
			});
			layoutContentScroll.add(this._layoutContentBox, {
				flex: 1
			});

			this._updateViewLayout();
		},

		
		/**
		 * Update the View Layout
		 */
		_updateViewLayout: function () {
			eyeos.callMessage(this._checknum, 'retrieveLanguages', null, function(results){
				this._layoutContentBox.removeAll();
				for (var i = 0; i < results.length; ++i) {
					this._layoutContentBox.add(new LanguageAssignationView(this._checknum, results[i]));
				}
			}, this);
		},

		/**
		 * Show the gui for unauthorized access
		 */
		_showNOTAuthorizedGui: function () {
			this.__window = new eyeos.ui.Window(this, tr('Admin Translator'), 'index.php?extern=images/16x16/apps/office-calendar.png').set({
				contentPadding: 4,
				width: 300,
				height: 100,
				backgroundColor: '#ffffff'
			});
			this.__window.setLayout(new qx.ui.layout.VBox());
			
			var noAuthLabel = new qx.ui.basic.Label('You are not authorized to access this application');
			this.__window.add(noAuthLabel);
			
			this.__window.open();
		}
	}
});