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

function usersettings_application(checknum, pid, args) {
	var myApp = new eyeos.application.UserSettings(checknum, pid, args);
	myApp.getWindow().open();
}

qx.Class.define('eyeos.application.UserSettings', {
	extend: eyeos.system.EyeApplication,

	construct: function (checknum, pid, args) {
		arguments.callee.base.call(this, 'usersettings', checknum, pid);
	},

	members: {

		_leftPane: null,
		_rightPane: null,
		_sectionsTree: null,
		_settings: null,
		_window: null,


		_drawSectionsTree: function () {
			this._leftPane.removeAll();
			this._sectionsTree = new qx.ui.tree.Tree();

			var root = new qx.ui.tree.TreeFolder('Settings');
			root.setOpen(true);
			this._sectionsTree.setRoot(root);
			this._sectionsTree.setHideRoot(true);

			//
			// MY ACCOUNT
			//
			var sectionMyAccount = new qx.ui.tree.TreeFolder(tr('My Account'));
			sectionMyAccount.setOpen(true);

			var subSectionConfiguration = new qx.ui.tree.TreeFile(tr('Configuration'));
			subSectionConfiguration.setModel(new eyeos.application.usersettings.myaccount.ConfigurationItem());
			subSectionConfiguration.getModel().setApplication(this);
			sectionMyAccount.add(subSectionConfiguration);

			var subSectionProfile = new qx.ui.tree.TreeFile(tr('Profile'));
			subSectionProfile.setModel(new eyeos.application.usersettings.myaccount.ProfileItem());
			subSectionProfile.getModel().setApplication(this);
			sectionMyAccount.add(subSectionProfile);

			var subSectionPassword = new qx.ui.tree.TreeFile(tr('Password'));
			subSectionPassword.setModel(new eyeos.application.usersettings.myaccount.PasswordItem());
			subSectionPassword.getModel().setApplication(this);
			sectionMyAccount.add(subSectionPassword);

			//var subSectionLanguage = new qx.ui.tree.TreeFile('Language');
			//subSectionLanguage.setModel(new eyeos.application.usersettings.AbstractItem());	//TODO
			//sectionMyAccount.add(subSectionLanguage);

			root.add(sectionMyAccount);

			//
			// GENERAL
			//
			var sectionGeneral = new qx.ui.tree.TreeFolder(tr('General'));
			sectionGeneral.setOpen(true);

			var subSectionDesktop = new qx.ui.tree.TreeFile(tr('Desktop / Dashboard'));
			subSectionDesktop.setModel(new eyeos.application.usersettings.general.DesktopDashboardItem());
			subSectionDesktop.getModel().setApplication(this);
			sectionGeneral.add(subSectionDesktop);

			//var subSectionAppearance = new qx.ui.tree.TreeFile(tr('Appearance'));
			//subSectionAppearance.setModel(new eyeos.application.usersettings.general.AppearanceItem());
			//subSectionAppearance.getModel().setApplication(this);
			//sectionGeneral.add(subSectionAppearance);

			//var subSectionNotification = new qx.ui.tree.TreeFile(tr('Notifications'));
			//subSectionNotification.setModel(new eyeos.application.usersettings.general.NotificationsItem());
			//subSectionNotification.getModel().setApplication(this);
			//sectionGeneral.add(subSectionNotification);

			//var subSectionSearch = new qx.ui.tree.TreeFile(tr('Search'));
			//subSectionSearch.setModel(new eyeos.application.usersettings.general.SearchItem());
			//subSectionSearch.getModel().setApplication(this);
			//sectionGeneral.add(subSectionSearch);

			//var subSectionPrivacy = new qx.ui.tree.TreeFile(tr('Privacy'));
			//subSectionPrivacy.setModel(new eyeos.application.usersettings.AbstractItem());	//TODO
			//sectionGeneral.add(subSectionPrivacy);

			//var subSectionAutorun = new qx.ui.tree.TreeFile(tr('Autorun'));
			//subSectionAutorun.setModel(new eyeos.application.usersettings.AbstractItem());	//TODO
			//sectionGeneral.add(subSectionAutorun);

			root.add(sectionGeneral);

			this._sectionsTree.addListener('changeSelection', function (e) {
				var data = e.getData();
				if (data[0] instanceof qx.ui.tree.TreeFile) {
					this._showPage(data[0].getModel());
				}
			}, this);

			this._leftPane.add(this._sectionsTree, {flex: 1});
		},

		getWindow: function () {
			if (this._window == null) {
				this._window = new eyeos.ui.Window(this, tr('User Settings'), 'index.php?extern=images/16x16/apps/preferences-desktop-user.png');
				this._window.setAllowMinimize(false);
				this._window.setWidth(800);
				this._window.setHeight(450);
				this._window.setContentPadding(0);

				var winLayout = new qx.ui.layout.VBox();
				this._window.setLayout(winLayout);

				//
				// Top panel (content)
				//

				this._leftPane = new qx.ui.container.Composite();
				this._leftPane.setWidth(180);
				var leftLayout = new qx.ui.layout.VBox();
				this._leftPane.setLayout(leftLayout);

				this._rightPane = new qx.ui.container.Scroll();

				var splitPane = new qx.ui.splitpane.Pane('horizontal');
				splitPane.add(this._leftPane, 0);
				splitPane.add(this._rightPane, 1);
				this._window.add(splitPane, {flex: 1});

				/*var myLabel = new qx.ui.basic.Label().set({
					value: '<h1>User Settings</h1>',
					rich: true,
					width: 400,
					textAlign: 'center'
				});
				this._rightPane.add(myLabel);*/

				//
				// Bottom panel (cancel/ok buttons)
				//

				var bottomPane = new qx.ui.container.Composite();
				bottomPane.setHeight(30);
				bottomPane.setMargin(5);

				var bottomPaneLayout = new qx.ui.layout.HBox();
				bottomPaneLayout.setAlignX('right');
				bottomPane.setLayout(bottomPaneLayout);

				var cancelButton = new qx.ui.form.Button(tr('Cancel'));
				bottomPane.add(cancelButton);
				cancelButton.addListener('execute', this.__close, this);

				var okButton = new qx.ui.form.Button(tr('Save & Close'));
				okButton.setMarginLeft(10);
				okButton.addListener('execute', this.__saveAndClose, this);
				bottomPane.add(okButton);

				this._window.add(bottomPane);

				//
				// Left panel (sections tree)
				//
				this._drawSectionsTree();
				this._leftPane.setEnabled(false);
				eyeos.callMessage(this._checknum, 'loadSettings', null, this._onSettingsLoaded, this);
			}
			return this._window;
		},

		_onSettingsLoaded: function(settings) {
			this._settings = settings;
			this._leftPane.setEnabled(true);
		},

		getSettings: function() {
			return this._settings;
		},

		_showPage: function(item) {
			panel = item.getPanel();
			this._rightPane.remove(this._rightPane.getChildren()[0]);
			this._rightPane.add(panel, {flex: 1});
		},

		_retrieveSettingsFromItems: function() {
			var settings = new Object();
			var nodes = this._sectionsTree.getRoot().getItems(true, true, true);
			for(var i = 0; i < nodes.length; i++) {
				if (nodes[i].getModel() !== null) {
					var currentItemSettings = nodes[i].getModel().getSettingsValues();
					for(var j in currentItemSettings) {
						if (typeof j != 'function') {
							settings[j] = currentItemSettings[j];
						}
					}
				}
			}
			return settings;
		},

		__saveAndClose: function() {
			var settings = this._retrieveSettingsFromItems();
			//eyeos.consoleLog(settings);
			eyeos.callMessage(this._checknum, 'saveSettings', settings, this.__savedNowClose, this);
		},

		__savedNowClose: function(params) {
			//eyeos.consoleLog('-------- SAVE FINISHED ----------');
			//eyeos.consoleLog(params);

			//Send event to the user itself
			var event = new eyeos.events.Event({
				type: 'People_UpdateProfile'
			});
			var eventJson = eyeos.events.Event.toJson(event);
			eyeos.callMessage(this._checknum, '__Events_sendEventByType', eventJson, function () {
				this.__close();
			}, this);
			
			
		},

		__close: function () {
			if (this._window) {
				this._window.close();
			}
		}
	}
});