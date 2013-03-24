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
 * Application to translate eyeos in custom language.
 * Only user allowed by 'adminTranslator' can translate eyeos.
 */
function translator_application(checknum, pid, args) {
	new eyeos.application.Translator(checknum, pid, args);
}

qx.Class.define('eyeos.application.Translator', {
	extend: eyeos.system.EyeApplication,

	construct: function(checknum, pid, args) {
		arguments.callee.base.call(this, 'Translator', checknum, pid);

		eyeos.callMessage(checknum, 'getCredential', null, function(results) {
			if (results == null) {
				this._authorized = false;
			} else {
				this._authorized = true;
				this._languageId = results['id'];
				this._languageName = results['language'];
				this._languageCode = results['code'];
			}
			this.drawGui();
		}, this);
	},

	members: {
		_authorized: false,				// If the user is authenticated or not
		_languageName: '',				// The Language to translate
		_languageId: null,				// The Language Id to translate
		_languageCode: '',				// The code of the language to translate
		_selectedApp: null,				// The selected Application
		_needToSave: false,				// If user need to save actual change

		__window: null,					// Main Window
		_firstRow: null,				//Gui element
		_secondRow: null,				//Gui element
		_applicationList: null,			//Gui element
		_translationContainer: null,	//Gui element
		
		drawGui: function () {	
			this.__window = new eyeos.ui.Window(this, tr('Translator'), 'index.php?extern=images/16x16/apps/office-calendar.png').set({
				contentPadding: 4,
				width: 800,
				height: 350,
				backgroundColor: '#FFFFFF'
			});
			this.__window.setLayout(new qx.ui.layout.VBox());

			if (this._authorized) {
				this._showAuthorizedGui();
			} else {
				this._showNOTAuthorizedGui();
			}
			this.__window.open();
		},

		/**
		 * OVVERIDE Kills the process associated to this application's instance.
		 * In case of changes, we ask to the user to save or discard his work
		 */
		close: function() {
			if (this._needToSave == true) {
				var op = new eyeos.dialogs.OptionPane(
					tr('You should save your changes'),
					eyeos.dialogs.OptionPane.QUESTION_MESSAGE);
				var d = op.createDialog(null, tr('Save your Work'), function(result) {
					if (result == eyeos.dialogs.OptionPane.YES_OPTION) {
						this._saveChangeAndClose();
					}
					if (result == eyeos.dialogs.OptionPane.NO_OPTION) {
						eyeos.consoleInfo('Process is stopping: ' + this._name + ', checknum: ' + this._checknum + ', pid: ' + this._pid);
						eyeos.callMessage(this._checknum, 'close');
					}
				}, this);
				d.open();
			} else {
				eyeos.consoleInfo('Process is stopping: ' + this._name + ', checknum: ' + this._checknum + ', pid: ' + this._pid);
				eyeos.callMessage(this._checknum, 'close');
			}
			
		},

		/**
		 * Show the Gui for an authorized user
		 */
		_showAuthorizedGui: function () {
			// Create hte element of the gui
			this._createFirstRow();
			this._createSecondRow();

			this._updateContent();
		},

		/**
		 * Update the content of the view with actual data
		 */
		_updateContent: function () {
			this._updateApplicationList();
		},

		/**
		 * Create the first part of the layout, the one with the info for the language
		 * and the button to Save
		 */
		_createFirstRow: function () {
			this._firstRow = new qx.ui.container.Composite(new qx.ui.layout.HBox());
			this.__window.add(this._firstRow);

			var boxView = new qx.ui.groupbox.GroupBox(tr('Translate To')).set({
				layout: new qx.ui.layout.HBox()
			});
			this._firstRow.add(boxView);

			// Show extended name of the language
			var languageLabel = new qx.ui.basic.Label(this._languageName).set({
				font: new qx.bom.Font(14, ['Helvetica', 'Arial']),
				decorator: new qx.ui.decoration.Single(1, 'solid', 'gray'),
				padding: 2
			});
			boxView.add(languageLabel);

			// Show code of the language
			var languageCode = new qx.ui.basic.Label(this._languageCode).set({
				font: new qx.bom.Font(14, ['Helvetica', 'Arial']),
				decorator: new qx.ui.decoration.Single(1, 'solid', 'gray').set({
					styleLeft: null
				}),
				padding: 2
			});
			boxView.add(languageCode);

			this._firstRow.add(new qx.ui.core.Spacer(), {
				flex: 1
			});

			// Button to Save the changes
			var button = new qx.ui.form.Button('Save translation for this application');
			button.addListener('execute', function () {
				this._saveChange();
			}, this);
			this._firstRow.add(button);
		},

		/**
		 * Save the change commited by the user
		 */
		_saveChange: function () {
			// Data struct for the callMessage
			var param = {
				appName: this._selectedApp,
				code: this._languageCode,
				traduction: this._getActualTraduction()
			}

			eyeos.callMessage(this._checknum, 'saveTranslation', param, function (results) {
				this._needToSave = false;
				this._updateContent();
			}, this);
		},

		/**
		 * Save the changes to files and close the application
		 */
		_saveChangeAndClose: function () {
			// Data struct for the callMessage
			var param = {
				appName: this._selectedApp,
				code: this._languageCode,
				traduction: this._getActualTraduction()
			}

			eyeos.callMessage(this._checknum, 'saveTranslation', param, function (results) {
				this._needToSave = false;
				this.close();
			}, this);
		},
		
		/**
		 * Get all the field key => value and return it
		 */
		_getActualTraduction: function () {
			var childrens = this._translationContainer.getChildren();

			var param = {};
			if (childrens) {
				for (var i = 0; i < childrens.length; ++i) {
					if (childrens[i] instanceof qx.ui.container.Composite) {
						var grandsons = childrens[i].getChildren();
						if (grandsons[0] && grandsons[0] instanceof qx.ui.basic.Label) {
							var key = grandsons[0].getValue();
						}
						if (grandsons[1] && grandsons[1] instanceof qx.ui.form.TextField) {
							var trad = grandsons[1].getValue();
						}
						if (key && trad) {
							param[key] = trad;
						}	
					}
				}
			}
			return param;
		},

		/**
		 * Create the second part of the layout, the one with the application list
		 * and the form to edit the strings.
		 */
		_createSecondRow: function () {
			this._secondRow = new qx.ui.container.Composite(new qx.ui.layout.HBox());
			this.__window.add(this._secondRow);
			
			this._createApplicationList();
			this._createTranslationList();
		},

		/**
		 * Create the element of the gui for the Application List
		 */
		_createApplicationList: function () {
			var boxView = new qx.ui.groupbox.GroupBox(tr('Applications')).set({
				layout: new qx.ui.layout.HBox()
			});
			this._secondRow.add(boxView);
			this._applicationList = new qx.ui.form.List();
			this._applicationList.set({
				height: 280,
				width: 130,
				selectionMode: 'one'
			});
			boxView.add(this._applicationList);

			// Every time the user click on a application listed, we update the member _selectedApp
			// and we regresh the translationList
			this._applicationList.addListener('changeSelection', function (e) {
				if (e.getData() && e.getData()[0]){
					this._selectedApp = e.getData()[0].getLabel();
					this._updateTranslationList();
				}
			}, this);
		},

		/**
		 * Populate the application list with all the application to translate and the related state
		 * of traduction
		 */
		_updateApplicationList: function () {
			eyeos.callMessage(this._checknum, 'getApplications', this._languageCode, function (results) {
				this._applicationList.removeAll();
				if (results) {
					for(var i = 0; i < results.length; ++i) {
						var result = results[i];
						var imagePath = null;
						//Save the image related the status of the application
						switch (result['status']) {
							case 0:
								imagePath = 'index.php?extern=/images/translator/bulletred.png';
								break;
							case 1:
								imagePath = 'index.php?extern=/images/translator/bulletyellow.png';
								break;
							case 2:
								imagePath = 'index.php?extern=/images/translator/bulletgreen.png';
								break;
						}
						var listItem = new qx.ui.form.ListItem(result['app'], imagePath);

						/*
						 * If the user click on an apps, but need to save the previous changes
						 * we provide to the user the possibility to save it or to cancel
						 */
						listItem.addListener('mousedown', function (e) {
							if (this._needToSave == true) {
								e.stopPropagation();
								var op = new eyeos.dialogs.OptionPane(
									tr('You should save your changes'),
									eyeos.dialogs.OptionPane.QUESTION_MESSAGE);
								var d = op.createDialog(null, tr('Save your Work'), function(result) {
									if (result == eyeos.dialogs.OptionPane.YES_OPTION) {
										this._saveChange();
									}
									if (result == eyeos.dialogs.OptionPane.NO_OPTION) {
										this._needToSave = false;
									}
								}, this);
								d.open();
							}
						}, this);
						this._applicationList.add(listItem);
					}
				}
			}, this);
		},

		/**
		 * Create the Gui part to the translation of the strings
		 */
		_createTranslationList: function () {
			this._secondRow.add(new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({

			}), {width: '2px'});
			var boxView = new qx.ui.groupbox.GroupBox(tr('Translation')).set({
				layout: new qx.ui.layout.HBox()
			});
			this._secondRow.add(boxView, {flex: 1});

			var scroll = new qx.ui.container.Scroll().set({allowGrowY: true});
			boxView.add(scroll, {flex: 1});

			this._translationContainer = new qx.ui.container.Composite().set({
				layout: new qx.ui.layout.VBox(),
				decorator: null,
				allowStretchY: true,
				allowGrowX: true
			});
			scroll.add(this._translationContainer);
			
		},

		/**
		 * Update the list of string to translate concerning the actual selected application
		 */
		_updateTranslationList: function () {
			var param = {
				'appName': this._selectedApp,
				'code': this._languageCode
			};
			
			eyeos.callMessage(this._checknum, 'loadTranslation', param, function (results) {
				this._translationContainer.removeAll();
				for (var key in results){
					var line = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
						decorator: new qx.ui.decoration.Single(1, 'solid', 'gray').set({
							styleTop: null,
							styleLeft: null,
							styleRight: null
						}),
						paddingBottom: 2
					});
					this._translationContainer.add(line);
					
					var label = new qx.ui.basic.Label(key).set({
						rich: true
					});
					line.add(label, {width: '50%'});

					var input = new qx.ui.form.TextField(results[key]);
					
					//When the user change a value, we set the variable _needToSave
					input.addListener('changeValue', function () {
						this._needToSave = true;
					}, this);
					line.add(input, {width: '50%'});
				}
			}, this )
		},

		/**
		 * Show the gui for unauthorized access
		 */
		_showNOTAuthorizedGui: function () {
			var noAuthLabel = new qx.ui.basic.Label('You are not authorized to translate applications');
			this.__window.add(noAuthLabel);
		}
	}
});