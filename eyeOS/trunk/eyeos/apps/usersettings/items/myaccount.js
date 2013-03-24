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

qx.Class.define('eyeos.application.usersettings.myaccount.ConfigurationItem', {
	extend: eyeos.application.usersettings.AbstractItem,
	
	construct: function () {
		arguments.callee.base.call(this);
	},
	
	members: {
		
		_id: 'myaccount.configuration',
		_panel: null,
		_textfields: [],
		_settings: null,
                _langSelect: null,
		
		getId: function () {
			return this._id;
		},
	
		getPanel: function () {
			if (this._panel == null) {
				this._settings = this._application.getSettings();
				this._panel = new qx.ui.container.Scroll();
				var panel = new qx.ui.container.Composite();
				var panelLayout = new qx.ui.layout.VBox(10);
				panel.setLayout(panelLayout);
				panel.setPadding(10);
				
				panel.add(this._getBox(tr('First Name'), tr('Real name'), 'eyeos.user.firstname', tr('Change'), function(e) {
					if (this.isEnabled()) {
						e.getTarget().setLabel(tr('Change'));
					} else {
						e.getTarget().setLabel(tr('Apply'));
					}
					this.toggleEnabled();
				}));
				panel.add(new qx.ui.menu.Separator());
				panel.add(this._getBox(tr('Last name'), '', 'eyeos.user.lastname', tr('Change'), function(e) {
					if (this.isEnabled()) {
						e.getTarget().setLabel(tr('Change'));
					} else {
						e.getTarget().setLabel(tr('Apply'));
					}
					this.toggleEnabled();
				}));
				panel.add(new qx.ui.menu.Separator());
				panel.add(this._getBox(tr('Nickname'), tr('You may use it to login'), 'eyeos.user.nickname'));
				panel.add(new qx.ui.menu.Separator());
				panel.add(this._getBox(tr('E-mail'), tr('Necessary to receive notifications'), 'eyeos.user.email', tr('Change'), function(e) {
					if (this.isEnabled()) {
						e.getTarget().setLabel(tr('Change'));
					} else {
						e.getTarget().setLabel(tr('Apply'));
					}
					this.toggleEnabled();
				}));
				panel.add(new qx.ui.menu.Separator());
				panel.add(this._getBox(tr('Delete Account'), tr('You will lose all your data and will not be able to retrieve them'), 'eyeos.user.id', tr('Delete account now'), function(e) {
					var mainWindow = this._application.getWindow();
					var op = new eyeos.dialogs.OptionPane(
							"<b>Are you sure you want to delete your account? This action cannot be reverted and will delete all your data.</b><br/>If this is what you want, type your password in the following field:",
							eyeos.dialogs.OptionPane.WARNING_MESSAGE,
							eyeos.dialogs.OptionPane.OK_CANCEL_OPTION,
							null,
							[null, 'password']);
					var d = op.createDialog(mainWindow, "Confirm account deletion", function(result, inputValue) {
						if (result == eyeos.dialogs.OptionPane.OK_OPTION) {
							eyeos.callMessage(this._application.getChecknum(), 'deleteAccount', {password: inputValue});
						}
					}, this);
					d.open();
				}, this));

				panel.add(new qx.ui.menu.Separator());

				var langBoxLayout = new qx.ui.layout.Grid();
				langBoxLayout.setSpacing(5);
				var langBox = new qx.ui.container.Composite(langBoxLayout);

				var titleLabel = new qx.ui.basic.Label().set({
					value: '<b>' + tr('Language') + '</b>',
					rich: true
				});

				langBox.add(titleLabel, {column: 0, row: 0});

				var langItems = new Object();

				langItems['ca'] = 'Català';
				langItems['en'] = 'English';
				langItems['ar'] = 'Arab';
				langItems['bg'] = 'Bulgarian';
				langItems['fr'] = 'French';
				langItems['ja'] = 'Japanese';
				langItems['es'] = 'Spanish';
				langItems['sv'] = 'Swedish';
				langItems['thai'] = 'Thai';
				langItems['vn'] = 'Vietnamese';
				langItems['pt-br'] = 'Brazilian portuguese'
				langItems['lt'] = 'Lithuanian';
				langItems['sk'] = 'Slovak';
				langItems['de'] = 'Germany';
				langItems['pt'] = 'Portuguese';
				langItems['cn'] = 'Chinese simplified';
				langItems['pl'] = 'Polish';
				langItems['tc'] = 'Traditional chinese';

				var items = new Array();

				this._langSelect = new qx.ui.form.SelectBox();

				var i = 0;
				for (var f in langItems) {
					items.push( new qx.ui.form.ListItem(langItems[f], null, f));
					this._langSelect.add(items[items.length -1]);

					if (this._settings['eyeos.user.language'] == f) {
						this._langSelect.setSelection([items[items.length -1]]);
					}
					i++;
				}

				langBox.add(this._langSelect, {column: 0, row: 1});

				panel.add(langBox);

				this._panel.add(panel);
			}
			return this._panel;
		},

		_getBox: function (title, legend, value, buttonLabel, buttonCallback, buttonCallbackContext) {			
			var boxPanel = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
			
			var panel1Layout = new qx.ui.layout.Grid(10, 10);
			panel1Layout.setColumnFlex(1, 1);
			panel1Layout.setRowAlign(0, 'left', 'bottom');
			
			var panel1 = new qx.ui.container.Composite(panel1Layout);
			panel1.setPaddingTop(30);
			
			var panel2Layout = new qx.ui.layout.Grid(10, 10);
			panel2Layout.setColumnFlex(0, 1);
			panel2Layout.setRowAlign(0, 'left', 'bottom');
			
			var panel2 = new qx.ui.container.Composite(panel2Layout);
			panel1.setPaddingTop(5);
			
			var titleLabel = new qx.ui.basic.Label().set({
				value: '<b>' + title + '</b>',
				rich: true
			});
			panel1.add(titleLabel, {column: 0, row: 0});
			var legendLabel = new qx.ui.basic.Label(legend);
			panel1.add(legendLabel, {column: 1, row: 0});
			this._textfields[value] = new qx.ui.form.TextField(this._settings[value]).set({enabled: false, maxWidth: 200});
			panel2.add(this._textfields[value], {column: 0, row: 0});
			
			if (buttonLabel != null) {
				var button = new qx.ui.form.Button(buttonLabel);
				
				if (!buttonCallbackContext) {
					buttonCallbackContext = this._textfields[value];
				}
				button.addListener('execute', buttonCallback, buttonCallbackContext);
				panel2.add(button, {column: 1, row: 0});
			}
			
			boxPanel.add(panel1);
			boxPanel.add(panel2);
			
			return boxPanel;
		},
		
		getSettingsValues: function() {
			var newSettings = new Object();
			for(var i in this._textfields) {
				if (this._textfields[i] instanceof qx.ui.form.TextField && !this._textfields[i].isEnabled()) {
					newSettings[i] = this._textfields[i].getValue();
				}
			}
//			console.log(newSettings);
			if(this._langSelect) {
				newSettings['eyeos.user.language'] = this._langSelect.getValue();
			}
//			console.log(newSettings);

			return newSettings;
		}
	}
});

qx.Class.define('eyeos.application.usersettings.myaccount.ProfileItem', {
	extend: eyeos.application.usersettings.AbstractItem,
	
	construct: function () {
		arguments.callee.base.call(this);
	},
	
	members: {
		
		_id: 'myaccount.profile',
		_panel: null,
		_settings: null,
		_values: null,
		
		getId: function () {
			return this._id;
		},
	
		getPanel: function () {
			if (this._panel == null) {
				this._settings = this._application.getSettings();
				this._panel = new qx.ui.tabview.TabView();
			    
				this._panel.add(this._getPersonalTab());
				this._panel.add(this._getProfessionalTab());
				this._panel.add(this._getEducationalTab());
				//this._panel.add(this._getContactTab());
			}
			return this._panel;
		},
		
		_getPersonalTab: function() {
			var page = new qx.ui.tabview.Page('Personal');		//TODO: icon
			page.setLayout(new qx.ui.layout.VBox(0));
			var pageContent = new qx.ui.container.Composite(new qx.ui.layout.VBox(10)).set({
				paddingTop: 5,
				paddingBottom: 5
			});
			var scroller = new qx.ui.container.Scroll(pageContent);
			page.add(scroller, {flex: 1});
			

			//
			// 1st box (first name, last name, picture)
			//
			
			var firstBoxLayout = new qx.ui.layout.Grid();
			firstBoxLayout.setColumnFlex(0, 1);
			var firstBox = new qx.ui.container.Composite(firstBoxLayout);
			
			// 1st column: first name / last name
			var firstColumnLayout = new qx.ui.layout.VBox();
			var firstColumn = new qx.ui.container.Composite(firstColumnLayout);
			
			//1st column, 1st row: first name (+ legend)
			var firstNameCellLayout = new qx.ui.layout.Grid();
			firstNameCellLayout.setColumnFlex(1, 1);
			firstNameCellLayout.setRowAlign(0, 'left', 'bottom');
			firstNameCellLayout.setSpacing(5);
			var firstNameCell = new qx.ui.container.Composite(firstNameCellLayout);
			firstNameCell.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('First Name') + '</b>',
				rich: true
			}), {column: 0, row: 0});
			firstNameCell.add(new qx.ui.basic.Label(tr('You can change it in \'Configuration\'')), {column: 1, row: 0});
			firstColumn.add(firstNameCell);
			firstColumn.add(new qx.ui.basic.Label(this._settings['eyeos.user.firstname']).set({padding: 10}));
			
			
			//1st column, 3nd row: last name (+ legend)
			var lastNameCellLayout = new qx.ui.layout.Grid();
			lastNameCellLayout.setColumnFlex(1, 1);
			lastNameCellLayout.setRowAlign(0, 'left', 'bottom');
			lastNameCellLayout.setSpacing(5);
			var lastNameCell = new qx.ui.container.Composite(lastNameCellLayout);
			lastNameCell.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Last name') + '</b>',
				rich: true
			}), {column: 0, row: 0});
			lastNameCell.add(new qx.ui.basic.Label(''), {column: 1, row: 0});
			firstColumn.add(lastNameCell);
			firstColumn.add(new qx.ui.basic.Label(this._settings['eyeos.user.lastname']).set({padding: 10}));
			
			firstBox.add(firstColumn, {column: 0, row: 0});
			
			//2nd column, 1st row (picture)
			var secondColumnLayout = new qx.ui.layout.Grid(5, 5);
			var secondColumn = new qx.ui.container.Composite(secondColumnLayout);
			var avatarImage = new qx.ui.basic.Image('index.php?checknum=' + this._application._checknum + '&message=__UserInfo_getAvatarPicture').set({
				scale: true,
				maxWidth: 95,
				maxHeight: 95,
				allowShrinkX: true,
				allowShrinkY: true
			});
			secondColumn.add(avatarImage, {column: 0, row: 0});
			firstBox.add(secondColumn, {column: 1, row: 0});
			
			//3rd column, 1st row (buttons)
			var thirdColumnLayout = new qx.ui.layout.Grid(5, 5);
			thirdColumnLayout.setRowFlex(0, 1);
			thirdColumnLayout.setColumnAlign(0, 'left', 'middle');
			var thirdColumn = new qx.ui.container.Composite(thirdColumnLayout);
			thirdColumn.setPadding(5);
			var choosePictureButton = new qx.ui.form.Button(tr('Choose from my files'));
			choosePictureButton.addListener('execute', function(e) {
				var fc = new eyeos.dialogs.FileChooser(this._application._checknum);
				fc.setFilters([
					{desc: 'Image Files', 		patterns: ['*.jpg','*.jpeg', '*.gif', '*.png'], defaultExt: 'jpg'}
				]);
				fc.showOpenDialog(this._application.getWindow(), function(option, path) {
					if (option == eyeos.dialogs.FileChooser.APPROVE_OPTION) {
						eyeos.callMessage(this._application._checknum, '__UserInfo_setAvatarPicture', {filePath: path}, function(e) {
							avatarImage.setSource('index.php?checknum=' + this._application._checknum + '&message=__UserInfo_getAvatarPicture&refresh=' + new Date().getTime())
						}, this);
					}
				}, this);
			}, this);
			thirdColumn.add(choosePictureButton, {column: 0, row: 1});
			firstBox.add(thirdColumn, {column: 2, row: 0});
			
			pageContent.add(firstBox);
			pageContent.add(new qx.ui.menu.Separator());
			
			//
			// 2nd box (sex)
			//
			var secondBoxLayout = new qx.ui.layout.Grid();
			secondBoxLayout.setSpacing(5);
			var secondBox = new qx.ui.container.Composite(secondBoxLayout);
			secondBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Sex') + '</b>',
				rich: true
			}), {column: 0, row: 0});
			var sexSelect = new qx.ui.form.SelectBox();
			var items = new Array(
					new qx.ui.form.ListItem(tr('Female'), null, 'F'),
					new qx.ui.form.ListItem(tr('Male'), null, 'M')
			);
			sexSelect.add(items[0]);
			sexSelect.add(items[1]);
			if (this._settings['eyeos.user.sex'] == 'F') {
				sexSelect.setSelection([items[0]]);
			} else {
				sexSelect.setSelection([items[1]]);
			}
			secondBox.add(sexSelect, {column: 0, row: 1});
			
			pageContent.add(secondBox);
			pageContent.add(new qx.ui.menu.Separator());
			
			//
			// 3rd box (birthday)
			//
			var thirdBoxLayout = new qx.ui.layout.Grid();
			thirdBoxLayout.setSpacing(5);
			var thirdBox = new qx.ui.container.Composite(thirdBoxLayout);
			thirdBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Birthday') + '</b>',
				rich: true
			}), {column: 0, row: 0, colSpan: 3});
			
			var savedDate;
			if (typeof this._settings['eyeos.user.birth.date'] == 'string') {
				var formatter = new qx.util.format.DateFormat('yyyy-MM-dd');
				try {
					savedDate = formatter.parse(this._settings['eyeos.user.birth.date']);
				} catch(e) {
					savedDate = null;
				}
				savedDate = {
					year: savedDate.getFullYear(),
					month: savedDate.getMonth(),
					day: savedDate.getDate()
				};
			}
			
			var currentYear = new Date().getFullYear();
			var yearSelectBox = new qx.ui.form.SelectBox().set({
				width: 70
			});
			for(var i = currentYear; i > 1900 ; i--) {
				var item = new qx.ui.form.ListItem(i).set({
					model: i
				});
				yearSelectBox.add(item);
				if (savedDate && savedDate.year == i) {
					yearSelectBox.setSelection([item]);
				}
			}
			thirdBox.add(yearSelectBox, {column: 0, row: 1});
			
			var localizedMonths = qx.locale.Date.getMonthNames('wide');
			var monthSelectBox = new qx.ui.form.SelectBox();
			for(var i = 0; i < 12; i++) {
				var item = new qx.ui.form.ListItem(localizedMonths[i].toString()).set({
					model: i
				});
				monthSelectBox.add(item);
				if (savedDate && savedDate.month == i) {
					monthSelectBox.setSelection([item]);
				}
			}
			thirdBox.add(monthSelectBox, {column: 1, row: 1});
			
			var daySelectBox = new qx.ui.form.SelectBox().set({
				width: 50
			});
			for(var i = 1; i < 32; i++) {
				var item = new qx.ui.form.ListItem(i).set({
					model: i
				});
				daySelectBox.add(item);
				if (savedDate && savedDate.day == i) {
					daySelectBox.setSelection([item]);
				}
			}
			thirdBox.add(daySelectBox, {column: 2, row: 1});			
			
			pageContent.add(thirdBox);
			pageContent.add(new qx.ui.menu.Separator());
			
			
			//
			// 4th box (born & living places)
			//
			var fourthBoxLayout = new qx.ui.layout.Grid();
			fourthBoxLayout.setSpacing(10);
			var fourthBox = new qx.ui.container.Composite(fourthBoxLayout);
			fourthBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Place of birth') + ':</b>',
				rich: true
			}), {column: 0, row: 0});
			var birthCountryTextField = new qx.ui.form.TextField(this._settings['eyeos.user.birth.country']).set({width: 120});
			fourthBox.add(birthCountryTextField, {column: 0, row: 1});
			var birthCityTextField = new qx.ui.form.TextField(this._settings['eyeos.user.birth.city']).set({width: 120});
			fourthBox.add(birthCityTextField, {column: 1, row: 1});
			
			fourthBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Place of residence') + ':</b>',
				rich: true
			}), {column: 0, row: 2});
			var currentLifeCountryTextField = new qx.ui.form.TextField(this._settings['eyeos.user.currentlife.country']).set({width: 120});
			fourthBox.add(currentLifeCountryTextField, {column: 0, row: 3});
			var currentLifeCityTextField = new qx.ui.form.TextField(this._settings['eyeos.user.currentlife.city']).set({width: 120});
			fourthBox.add(currentLifeCityTextField, {column: 1, row: 3});
			
			pageContent.add(fourthBox);
			
			
			//
			// Events
			//
			sexSelect.addListener('changeSelection', function(e) {
				var value = e.getData()[0].getValue();
				this._setValue('eyeos.user.sex', value);
			}, this);
			
			// Birth date
			var checkDateFunction = function(e) {
				var tmpDate = new Date();
				tmpDate.setFullYear(yearSelectBox.getSelection()[0].getModel());
				tmpDate.setMonth(monthSelectBox.getSelection()[0].getModel());
				var userDate = daySelectBox.getSelection()[0].getModel();
				tmpDate.setDate(userDate);
				
				if (tmpDate.getDate() != userDate) {
					eyeos.alert(tr('The entered date is not correct. Please select a correct date.'));
					daySelectBox.resetSelection();
				} else {
					this._setValue('eyeos.user.birth.date', tmpDate.getFullYear() + '-' + (tmpDate.getMonth() + 1) + '-' + tmpDate.getDate());
				}
			}
			yearSelectBox.addListener('changeValue', checkDateFunction, this);
			monthSelectBox.addListener('changeValue', checkDateFunction, this);
			daySelectBox.addListener('changeValue', checkDateFunction, this);
			
			birthCountryTextField.addListener('changeValue', function(e) {
				var value = e.getData();
				this._setValue('eyeos.user.birth.country', value);
			}, this);
			birthCityTextField.addListener('changeValue', function(e) {
				var value = e.getData();
				this._setValue('eyeos.user.birth.city', value);
			}, this);
			currentLifeCountryTextField.addListener('changeValue', function(e) {
				var value = e.getData();
				this._setValue('eyeos.user.currentlife.country', value);
			}, this);
			currentLifeCityTextField.addListener('changeValue', function(e) {
				var value = e.getData();
				this._setValue('eyeos.user.currentlife.city', value);
			}, this);
			
			return page;
		},
		
		_getProfessionalTab: function() {
			var page = new qx.ui.tabview.Page(tr('Professional'));		//TODO: icon
			page.setLayout(new qx.ui.layout.VBox(0));
			var pageContent = new qx.ui.container.Composite(new qx.ui.layout.VBox(10)).set({
				paddingTop: 5,
				paddingBottom: 5
			});
			var scroller = new qx.ui.container.Scroll(pageContent);
			page.add(scroller, {flex: 1});
			
			//
			// 1st box (current company)
			//
			
			var firstBoxLayout = new qx.ui.layout.Grid();
			firstBoxLayout.setSpacing(10);
			var firstBox = new qx.ui.container.Composite(firstBoxLayout);
			firstBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Current Company') + '</b>',
				rich: true
			}), {column: 0, row: 0});
			var currentCompanyTextField = new qx.ui.form.TextField(this._settings['eyeos.user.professional.current.company']).set({width: 160});
			firstBox.add(currentCompanyTextField, {column: 0, row: 1});
			firstBox.add(new qx.ui.basic.Label(tr('in')), {column: 1, row: 1});
			var currentCityTextField = new qx.ui.form.TextField(this._settings['eyeos.user.professional.current.city']).set({width: 200});
			firstBox.add(currentCityTextField, {column: 2, row: 1});
			
			firstBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Position') + '</b>',
				rich: true
			}), {column: 0, row: 3});
			var currentPositionTextField = new qx.ui.form.TextField(this._settings['eyeos.user.professional.current.position']).set({width: 200});
			firstBox.add(currentPositionTextField, {column: 0, row: 4});
			
			firstBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Description') + '</b>',
				rich: true
			}), {column: 0, row: 6});
			var descriptionTextArea = new qx.ui.form.TextArea(tr('Name')).set({
				value: this._settings['eyeos.user.professional.current.description'] ? this._settings['eyeos.user.professional.current.description'] : '',
				width: 200,
				height: 80
			});
			firstBox.add(descriptionTextArea, {column: 0, row: 7, colSpan: 3});
			
			pageContent.add(firstBox);
			pageContent.add(new qx.ui.menu.Separator());
			
			//
			// 2nd box (previous companies)
			//
			
			var secondBoxLayout = new qx.ui.layout.Grid();
			secondBoxLayout.setSpacing(10);
			var secondBox = new qx.ui.container.Composite(secondBoxLayout).set({enabled: false});
			secondBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Other companies in the past') + '</b>',
				rich: true
			}), {column: 0, row: 0});
			secondBox.add(new qx.ui.form.TextField(tr('Name')).set({width: 160}), {column: 0, row: 1});
			secondBox.add(new qx.ui.basic.Label(tr('in')), {column: 1, row: 1});
			secondBox.add(new qx.ui.form.TextField(tr('Place')).set({width: 200}), {column: 2, row: 1});
			secondBox.add(new qx.ui.form.Button(tr('Add another')), {column: 3, row: 1});
			
			pageContent.add(secondBox);
			
			
			//
			// Events
			//
			currentCompanyTextField.addListener('changeValue', function(e) {
				var value = e.getData();
				this._setValue('eyeos.user.professional.current.company', value);
			}, this);
			currentCityTextField.addListener('changeValue', function(e) {
				var value = e.getData();
				this._setValue('eyeos.user.professional.current.city', value);
			}, this);
			currentPositionTextField.addListener('changeValue', function(e) {
				var value = e.getData();
				this._setValue('eyeos.user.professional.current.position', value);
			}, this);
			descriptionTextArea.addListener('changeValue', function(e) {
				var value = e.getData();
				this._setValue('eyeos.user.professional.current.description', value);
			}, this);
			
			return page;
		},
		
		_getEducationalTab: function() {
			var page = new qx.ui.tabview.Page(tr('Educational'));		//TODO: icon
			page.setLayout(new qx.ui.layout.VBox(0));
			var pageContent = new qx.ui.container.Composite(new qx.ui.layout.VBox(10)).set({
				paddingTop: 5,
				paddingBottom: 5
			});
			var scroller = new qx.ui.container.Scroll(pageContent);
			page.add(scroller, {flex: 1});
			
			//
			// 1st box (current school)
			//
			
			var firstBoxLayout = new qx.ui.layout.Grid();
			firstBoxLayout.setSpacing(10);
			var firstBox = new qx.ui.container.Composite(firstBoxLayout);
			firstBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Current School') + '</b>',
				rich: true
			}), {column: 0, row: 0});
			var currentSchoolTextField = new qx.ui.form.TextField(this._settings['eyeos.user.educational.current.school']).set({width: 160});
			firstBox.add(currentSchoolTextField, {column: 0, row: 1});
			firstBox.add(new qx.ui.basic.Label(tr('in')), {column: 1, row: 1});
			var currentCityTextField = new qx.ui.form.TextField(this._settings['eyeos.user.educational.current.city']).set({width: 200});
			firstBox.add(currentCityTextField, {column: 2, row: 1});
			
			firstBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Degree') + '</b>',
				rich: true
			}), {column: 0, row: 3});
			var currentDegreeTextField = new qx.ui.form.TextField(this._settings['eyeos.user.educational.current.degree']).set({width: 200});
			firstBox.add(currentDegreeTextField, {column: 0, row: 4});
			
			firstBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Additional Information') + '</b>',
				rich: true
			}), {column: 0, row: 6});
			var informationTextArea = new qx.ui.form.TextArea('Name').set({
				value: this._settings['eyeos.user.educational.current.information'] ? this._settings['eyeos.user.educational.current.information'] : '',
				width: 200,
				height: 80
			});
			firstBox.add(informationTextArea, {column: 0, row: 7, colSpan: 3});
			
			pageContent.add(firstBox);
			pageContent.add(new qx.ui.menu.Separator());
			
			//
			// 2nd box (previous schools)
			//
			
			var secondBoxLayout = new qx.ui.layout.Grid();
			secondBoxLayout.setSpacing(10);
			var secondBox = new qx.ui.container.Composite(secondBoxLayout).set({enabled: false});
			secondBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Previous Schools') + '</b>',
				rich: true
			}), {column: 0, row: 0});
			secondBox.add(new qx.ui.form.TextField(tr('Name')).set({width: 160}), {column: 0, row: 1});
			secondBox.add(new qx.ui.basic.Label(tr('in')), {column: 1, row: 1});
			secondBox.add(new qx.ui.form.TextField(tr('Place')).set({width: 200}), {column: 2, row: 1});
			secondBox.add(new qx.ui.form.Button(tr('Add another')), {column: 3, row: 1});
			
			pageContent.add(secondBox);
			
			
			//
			// Events
			//
			currentSchoolTextField.addListener('changeValue', function(e) {
				var value = e.getData();
				this._setValue('eyeos.user.educational.current.company', value);
			}, this);
			currentCityTextField.addListener('changeValue', function(e) {
				var value = e.getData();
				this._setValue('eyeos.user.educational.current.city', value);
			}, this);
			currentDegreeTextField.addListener('changeValue', function(e) {
				var value = e.getData();
				this._setValue('eyeos.user.educational.current.degree', value);
			}, this);
			informationTextArea.addListener('changeValue', function(e) {
				var value = e.getData();
				this._setValue('eyeos.user.educational.current.information', value);
			}, this);
			
			return page;
		},
		
		_getContactTab: function() {
			var page = new qx.ui.tabview.Page(tr('Contact'));		//TODO: icon
			page.setLayout(new qx.ui.layout.VBox(10));
			page.setPaddingTop(10);
			
			page.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Not available yet...') + '</b>',
				rich: true
			}));
			
			return page;
		},
		
		_setValue: function(key, value) {
			if (this._values == null) {
				this._values = new Object();
			}
//			console.log('NEW VALUE: [' + key + '] ' + value)
			this._values[key] = value;
		},
		
		getSettingsValues: function() {
			return this._values;
		}
	}
});

qx.Class.define('eyeos.application.usersettings.myaccount.PasswordItem', {
	extend: eyeos.application.usersettings.AbstractItem,
	
	construct: function () {
		arguments.callee.base.call(this);
	},
	
	members: {
		
		_id: 'myaccount.password',
		_panel: null,
		_values: null,
		_errorLabel: null,
		
		getId: function () {
			return this._id;
		},
	
		getPanel: function () {
			this._panel = new qx.ui.container.Composite();
			var panelLayout = new qx.ui.layout.VBox(10);
			this._panel.setLayout(panelLayout);
			this._panel.setPadding(10);
			
			var firstBoxLayout = new qx.ui.layout.Grid(10,10);
			var firstBox = new qx.ui.container.Composite(firstBoxLayout);
			firstBox.add(new qx.ui.basic.Label().set({
				value: '<b>' + tr('Change Password') + '</b>',
				rich: true
			}), {column: 0, row: 0});
			firstBox.add(new qx.ui.basic.Label(tr('Current password:')), {column: 0, row: 1});
			var currentPasswordTextField = new qx.ui.form.PasswordField().set({width: 150});
			firstBox.add(currentPasswordTextField, {column: 1, row: 1});
			firstBox.add(new qx.ui.basic.Label(tr('New password:')), {column: 0, row: 2});
			var newPasswordTextField1 = new qx.ui.form.PasswordField().set({width: 150});
			firstBox.add(newPasswordTextField1, {column: 1, row: 2});
			firstBox.add(new qx.ui.basic.Label(tr('New password (verify):')), {column: 0, row: 3});
			var newPasswordTextField2 = new qx.ui.form.PasswordField().set({width: 150});
			firstBox.add(newPasswordTextField2, {column: 1, row: 3});
			var applyButton = new qx.ui.form.Button(tr('Apply now')).set({width: 150});
			firstBox.add(applyButton, {column: 1, row: 5});
			
			firstBoxLayout.setRowAlign(5, 'center', 'middle');
			this._errorLabel = new qx.ui.basic.Label().set({
				rich: true
			});
			this._errorLabel.setVisibility('hidden');
			this._errorLabel.setMessage = function(msg, color) {
				if (!color) {
					color = 'red';
				}
				this.setValue('<font color=' + color + '>' + msg + '</font>');
			}
			firstBox.add(this._errorLabel, {column: 2, row: 5});			
			
			this._panel.add(firstBox);
			
			
			//
			// Events
			//
			applyButton.addListener('execute', function(e) {
				this._errorLabel.setVisibility('hidden');
				if (newPasswordTextField1.getValue() != newPasswordTextField2.getValue()) {
					this._errorLabel.setMessage(tr('Error: New passwords do not match!'));
					this._errorLabel.setVisibility('visible');
				} else {
					eyeos.callMessage(
						this._application._checknum,
						'changePassword',
						new Array(currentPasswordTextField.getValue(), newPasswordTextField1.getValue()),
						this._passwordChanged,
						this
					);
				}
			}, this);
			
			return this._panel;
		},
		
		_passwordChanged: function(result) {
			if (result) {
				this._errorLabel.setMessage(tr('Password changed successfully!'), 'blue');
				this._errorLabel.setVisibility('visible');
			} else {
				this._errorLabel.setMessage(tr('Error: Unable to change password') + '<br/>' + tr('(is current password correct?)'));
				this._errorLabel.setVisibility('visible');
			}
		},
		
		getSettingsValues: function() {
			return new Object();
		}
	}
});
