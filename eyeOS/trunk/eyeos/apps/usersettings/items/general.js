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

qx.Class.define('eyeos.application.usersettings.general.DesktopDashboardItem', {
	extend: eyeos.application.usersettings.AbstractItem,

	construct: function () {
		arguments.callee.base.call(this);
	},

	members: {

		_id: 'general.desktopdashboard',
		_panel: null,
		_settings: null,
		_desktopModeRadioGroup: null,
		_dashboardLayoutRadioGroup: null,

		getId: function () {
			return this._id;
		},

		getPanel: function () {
			if (this._panel == null) {
				this._settings = this._application.getSettings();
				this._panel = new qx.ui.container.Composite();
				this._panel.setLayout(new qx.ui.layout.VBox(10));
				this._panel.setPadding(10);

				//
				// 1st box (desktop / dashboard radio)
				//

				var firstBoxLayout = new qx.ui.layout.Grid(10,10);
				firstBoxLayout.setColumnFlex(1, 1);
				var firstBox = new qx.ui.container.Composite(firstBoxLayout);
				firstBox.add(new qx.ui.basic.Label().set({
					value: '<b>' + tr('Desktop Mode') + '</b>',
					rich: true
				}), {column: 0, row: 0});
				firstBox.add(new qx.ui.basic.Label(tr('You can choose between the classic desktop or the new dashboard desktop')), {column: 1, row: 0});

				this._desktopModeRadioGroup = new qx.ui.form.RadioGroup();
				var desktopRadio = new qx.ui.form.RadioButton(tr('Classic desktop')).set({model: 'classic'});
				var dashboardRadio = new qx.ui.form.RadioButton(tr('Dashboard desktop')).set({model: 'dashboard'});
				this._desktopModeRadioGroup.add(desktopRadio, dashboardRadio);
				firstBox.add(desktopRadio, {column: 0, row: 1, colSpan: 2});
				firstBox.add(dashboardRadio, {column: 0, row: 2, colSpan: 2});

				this._panel.add(firstBox);
				this._panel.add(new qx.ui.menu.Separator());

				//
				// 2nd box (dashboard layout)
				//

				var secondBoxLayout = new qx.ui.layout.Grid(10,10);
				secondBoxLayout.setColumnFlex(1, 1);
				var secondBox = new qx.ui.container.Composite(secondBoxLayout);
				secondBox.add(new qx.ui.basic.Label().set({
					value: '<b>' + tr('Dashboard Layout') + '</b>',
					rich: true
				}), {column: 0, row: 0});
				secondBox.add(new qx.ui.basic.Label(tr('Only if you selected the "Dashboard desktop"')), {column: 1, row: 0});
				var layoutChooser = this._createLayoutChooser();
				secondBox.add(layoutChooser, {column: 0, row: 2, colSpan: 2});

				this._panel.add(secondBox);
				this._panel.add(new qx.ui.menu.Separator());

				//fill first radio group and disable 2nd box if needed
				if (this._settings['eyeos.desktop.mode'] == 'classic') {
					this._desktopModeRadioGroup.setSelection([desktopRadio]);
					secondBox.setEnabled(false);
				} else {
					this._desktopModeRadioGroup.setSelection([dashboardRadio]);
					secondBox.setEnabled(true);
				}

				//add event listeners on radiobuttons
				this._desktopModeRadioGroup.addListener('changeSelection', function(e) {
					if (e.getData()[0].getModel() == 'dashboard') {
						this.setEnabled(true);
					} else {
						this.setEnabled(false);
					}
				}, secondBox);

				//
				// 3rd box (widgets...)
				//

				var thirdBox = new qx.ui.container.Composite(new qx.ui.layout.VBox());
				this._panel.add(thirdBox);

				thirdBox.add(new qx.ui.basic.Label().set({value: '<b>' + tr('Widgets') + '</b>&nbsp;&nbsp;&nbsp;&nbsp;' + tr('choose which widget you want to activate on your desktop'), rich: true}));
				var widgetBox = new qx.ui.groupbox.GroupBox().set({
					paddingTop: 10,
					width: 200,
					maxWidth: 200,
					allowGrowX: false,
					layout: new qx.ui.layout.VBox()
				});
				thirdBox.add(widgetBox);

				var item = null;
				document.widgets.forEach(function(obj) {
					item = new qx.ui.form.CheckBox(obj.title);
					if((obj.widget) && (!obj.widget.isDisposed())) {
						item.setValue(true);
					}
					item.obj = obj;
					widgetBox.add(item);

					item.addListener('changeValue', function(e) {
						var index = document.widgets.indexOf(e.getTarget().obj);

						if (e.getTarget().getValue()) {
							e.getTarget().obj.widget = e.getTarget().obj.create(e.getTarget().obj.checknum, index);
							eyeos.callMessage(e.getTarget().obj.checknum, 'ShowHideWidget', [e.getTarget().obj.value, 'true'], function() {});
						}
						else {
							eyeos.callMessage(e.getTarget().obj.checknum, 'ShowHideWidget', [e.getTarget().obj.value, 'false'], function() {});
							e.getTarget().obj.widget.close();
						}
					}, this);
				}, this);
			}

			return this._panel;
		},

		_createLayoutChooser: function() {
			var panelLayout = new qx.ui.layout.HBox(10);
			var panel = new qx.ui.container.Composite(panelLayout);
			panel.setPadding(10);
			panel.setDecorator(new qx.ui.decoration.Single(1, 'solid', '#aaaaaa'));
			this._dashboardLayoutRadioGroup = new qx.ui.form.RadioGroup();

			var columnsSettings = parseInt(this._settings['eyeos.desktop.dashboard.nbcolumns']);
			if (!columnsSettings) {
				columnsSettings = 3;
			}

			//create layout previews
			for(var i = 1; i < 6; i++) {
				var subPanelLayout = new qx.ui.layout.VBox();
				var subPanel = new qx.ui.container.Composite(subPanelLayout);
				subPanelLayout.setAlignX('center');

				var previewLayout = new qx.ui.layout.HBox(2);
				var previewContainer = new qx.ui.container.Composite(previewLayout);
				previewContainer.setPadding(3);
				previewContainer.setMaxWidth(80);
				previewContainer.setDecorator(new qx.ui.decoration.Single(2, 'solid', '#aaaaaa'));


				//create current layout preview
				for(var j = 0; j < i; j++) {
					var col = new qx.ui.core.Widget().set({
						backgroundColor: '#888888'
					});
					previewContainer.add(col, {flex: 1});
				}
				subPanel.add(previewContainer);

				var chkbox = new qx.ui.form.RadioButton(i + ((i < 2)? ' ' +  tr('column') : ' ' + tr('columns'))).set({model: i});
				this._dashboardLayoutRadioGroup.add(chkbox);

				//TODO
				if (i == columnsSettings) {
					this._dashboardLayoutRadioGroup.setSelection([chkbox]);
				}
				subPanel.add(chkbox);

				panel.add(subPanel, {flex: 1});
			}

			return panel;
		},

		getSettingsValues: function() {
			var values = new Object();
			if (this._panel != null) {
				values['eyeos.desktop.mode'] = this._desktopModeRadioGroup.getSelection()[0].getModel();
				values['eyeos.desktop.dashboard.nbcolumns'] = this._dashboardLayoutRadioGroup.getSelection()[0].getModel();
			}
			return values;
		}
	}
});


qx.Class.define('eyeos.application.usersettings.general.AppearanceItem', {
	extend: eyeos.application.usersettings.AbstractItem,

	construct: function () {
		arguments.callee.base.call(this);
	},

	members: {

		_id: 'general.appearance',
		_panel: null,
		_settings: null,
		_values: null,

		getId: function () {
			return this._id;
		},

		getPanel: function () {
			if (this._panel == null) {
				this._settings = this._application.getSettings();
				this._panel = new qx.ui.container.Composite();
				this._panel.setLayout(new qx.ui.layout.VBox(10));
				this._panel.setPadding(10);

				//
				// 1st box (background image)
				//
				var firstBoxLayout = new qx.ui.layout.Grid(10,10);
				firstBoxLayout.setColumnFlex(0, 1);
				var firstBox = new qx.ui.container.Composite(firstBoxLayout);
				firstBox.add(new qx.ui.basic.Label().set({
					value: '<b>' + tr('Background Image') + '</b>',
					rich: true
				}), {column: 0, row: 0});
				firstBox.add(new qx.ui.form.Button(tr('Upload new')), {column: 1, row: 0});
				firstBoxLayout.setColumnAlign(1, 'right', 'bottom');

				//tabview
				var tabView = new qx.ui.tabview.TabView();
				tabView.add(this._getBackgroundsTab());
				tabView.add(this._getChooseImageTab());
				firstBox.add(tabView, {column: 0, row: 1, colSpan: 2});

				this._panel.add(firstBox);


				//
				// 2nd box (background color)
				//
				var secondBoxLayout = new qx.ui.layout.Grid(10,10);
				secondBoxLayout.setColumnFlex(2, 1);
				var secondBox = new qx.ui.container.Composite(secondBoxLayout);
				secondBox.add(new qx.ui.basic.Label().set({
					value: '<b>' + tr('Background Color') + '</b>',
					rich: true
				}), {column: 0, row: 0, colSpan: 3});
				var colorPreview = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({width: 40, height: 20});
				colorPreview.setDecorator(new qx.ui.decoration.Single(1, 'solid', '#333333'));
				if (this._settings['eyeos.appearance.desktop.background.color']) {
					colorPreview.setBackgroundColor(this._settings['eyeos.appearance.desktop.background.color']);
				} else {
					colorPreview.setBackgroundColor('#FFFFFF');
				}
				secondBox.add(colorPreview, {column: 0, row: 1});

				var changeColorButton = new qx.ui.form.Button(tr('Change'));
				secondBox.add(changeColorButton, {column: 1, row: 1});

				var colorPopup = new qx.ui.control.ColorPopup();
				colorPopup.exclude();
				colorPopup.setValue(colorPreview.getDecorator().getBackgroundColor());

				changeColorButton.addListener('execute', function(e) {
					colorPopup.placeToWidget(changeColorButton);
					colorPopup.show();
				}, this);

				colorPopup.addListener('changeValue', function(e) {
					colorPreview.setBackgroundColor(e.getData());
					this._changeBackgroundColor(e.getData());
				}, this);

				this._panel.add(secondBox);
				this._panel.add(new qx.ui.menu.Separator());


				//
				// 3rd box (font colors)
				//
				var secondBoxLayout = new qx.ui.layout.Grid(10,10);
				secondBoxLayout.setColumnFlex(3, 1);
				var secondBox = new qx.ui.container.Composite(secondBoxLayout);
				secondBox.add(new qx.ui.basic.Label().set({
					value: '<b>' + tr('Font Colors') + '</b>',
					rich: true
				}), {column: 0, row: 0});
				secondBox.add(new qx.ui.basic.Label(tr('Choose colors for the text of the icons (in the classic desktop) and for the widgets without BG (dashboard)')), {column: 1, row: 0});

				//classic desktop icons
				var iconsClassicDesktopContainerLayout = new qx.ui.layout.Grid(10,10);
				iconsClassicDesktopContainerLayout.setRowAlign(0, 'left', 'bottom');
				iconsClassicDesktopContainerLayout.setColumnMinWidth(0, 400);
				iconsClassicDesktopContainerLayout.setColumnFlex(3, 1);
				var iconsClassicDesktopContainer = new qx.ui.container.Composite(iconsClassicDesktopContainerLayout);

				var iconsClassicDesktopLabel = new qx.ui.basic.Label('Icons (Classic Desktop):');
				iconsClassicDesktopContainer.add(iconsClassicDesktopLabel, {column: 0, row: 0});

				var iconsClassicDesktopColorPreview = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({width: 40, height: 20});
				iconsClassicDesktopColorPreview.setDecorator(new qx.ui.decoration.Single(1, 'solid', '#333333'));
				if (this._settings['eyeos.appearance.desktop.fonts.icons.color']) {
					iconsClassicDesktopColorPreview.setBackgroundColor(this._settings['eyeos.appearance.desktop.fonts.icons.color']);
				} else {
					iconsClassicDesktopColorPreview.setBackgroundColor('#333333');
				}
				iconsClassicDesktopContainer.add(iconsClassicDesktopColorPreview, {column: 1, row: 0});

				var iconsClassicDesktopChangeColorButton = new qx.ui.form.Button(tr('Change'));
				iconsClassicDesktopContainer.add(iconsClassicDesktopChangeColorButton, {column: 2, row: 0});

				var colorPopup1 = new qx.ui.control.ColorPopup();
				colorPopup1.exclude();
				colorPopup1.setValue(iconsClassicDesktopColorPreview.getDecorator().getBackgroundColor());

				iconsClassicDesktopChangeColorButton.addListener('execute', function(e) {
					colorPopup1.placeToWidget(iconsClassicDesktopChangeColorButton);
					colorPopup1.show();
				}, this);

				colorPopup1.addListener('changeValue', function(e) {
					iconsClassicDesktopColorPreview.setBackgroundColor(e.getData());
					this._changeIconsClassicDestopFontColor(e.getData());
				}, this);

				secondBox.add(iconsClassicDesktopContainer, {column: 0, row: 1, colSpan: 3});

				//dashboard widgets
				var dashboardWidgetsContainerLayout = new qx.ui.layout.Grid(10,10);
				dashboardWidgetsContainerLayout.setRowAlign(0, 'left', 'bottom');
				dashboardWidgetsContainerLayout.setColumnMinWidth(0, 400);
				dashboardWidgetsContainerLayout.setColumnFlex(3, 1);
				var dashboardWidgetsContainer = new qx.ui.container.Composite(dashboardWidgetsContainerLayout);

				var dashboardWidgetsLabel = new qx.ui.basic.Label(tr('Widgets without background (Dashboard Desktop):'));
				dashboardWidgetsContainer.add(dashboardWidgetsLabel, {column: 0, row: 0});

				var dashboardWidgetsColorPreview = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({width: 40, height: 20});
				dashboardWidgetsColorPreview.setDecorator(new qx.ui.decoration.Single(1, 'solid', '#333333'));
				if (this._settings['eyeos.appearance.desktop.fonts.widgets.color']) {
					dashboardWidgetsColorPreview.setBackgroundColor(this._settings['eyeos.appearance.desktop.fonts.widgets.color']);
				} else {
					dashboardWidgetsColorPreview.setBackgroundColor('#333333');
				}
				dashboardWidgetsContainer.add(dashboardWidgetsColorPreview, {column: 1, row: 0});

				var dashboardWidgetsChangeColorButton = new qx.ui.form.Button(tr('Change'));
				dashboardWidgetsContainer.add(dashboardWidgetsChangeColorButton, {column: 2, row: 0});

				var colorPopup2 = new qx.ui.control.ColorPopup();
				colorPopup2.exclude();
				colorPopup2.setValue(dashboardWidgetsColorPreview.getDecorator().getBackgroundColor());

				dashboardWidgetsChangeColorButton.addListener('execute', function(e) {
					colorPopup2.placeToWidget(dashboardWidgetsChangeColorButton);
					colorPopup2.show();
				}, this);

				colorPopup2.addListener('changeValue', function(e) {
					dashboardWidgetsColorPreview.setBackgroundColor(e.getData());
					this._changeDashboardWidgetsFontColor(e.getData());
				}, this);

				secondBox.add(dashboardWidgetsContainer, {column: 0, row: 2, colSpan: 3});

				this._panel.add(secondBox);
			}

			return this._panel;
		},

		_getBackgroundsTab: function() {
			var page = new qx.ui.tabview.Page(tr('Backgrounds'));		//TODO: icon
			page.setLayout(new qx.ui.layout.VBox(10));
			var scrollPane = new qx.ui.container.Scroll();

			var bgGridLayout = new qx.ui.layout.Grid(0);
			var bgGrid = new qx.ui.container.Composite(bgGridLayout);
			var gridRadioGroup = new qx.ui.form.RadioGroup();

			//TODO here is just an example with 20 fake backgrounds
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 5; j++) {
					var container = new qx.ui.container.Composite(new qx.ui.layout.VBox(5).set({alignX: 'center'}));
					container.setMargin(5);
					var radioButton = null;

					if (i == 0 && j == 0) {
						container.add(new qx.ui.basic.Image('index.php?extern=images/no_bg.png'));
						radioButton = new qx.ui.form.RadioButton().set({label: tr('(No image)')});
						container.add(radioButton);
					} else {
						container.add(new qx.ui.basic.Image('index.php?extern=images/empty_bg.png'));
						//'Name_' + i + '-' + j
						radioButton = new qx.ui.form.RadioButton().set({label: 'Name_' + i + '-' + j});
						container.add(radioButton);
					}
					gridRadioGroup.add(radioButton);
					bgGrid.add(container, {column: i, row: j});
				}
			}

			gridRadioGroup.addListener('changeSelection', function(e) {
				this._changeBackgroundImage(e.getData()[0].getLabel());
			}, this);

			scrollPane.add(bgGrid);
			page.add(scrollPane);

			return page;
		},

		_getChooseImageTab: function() {
			var page = new qx.ui.tabview.Page(tr('Choose from your account'));		//TODO: icon
			page.setLayout(new qx.ui.layout.VBox(10));
			page.setPaddingTop(10);

			page.add(new qx.ui.basic.Label().set({
				value: '<h1>' + tr('TODO') + '</h1>',
				rich: true
			}));

			return page;
		},

		_changeBackgroundImage: function(name) {
			eyeos.consoleLog('new bg image: ' + name);
		},

		_changeBackgroundColor: function(color) {
			eyeos.consoleLog('new bg color: ' + color);
			this._setValue('eyeos.appearance.desktop.background.color', color);
		},

		_changeIconsClassicDestopFontColor: function(color) {
			eyeos.consoleLog('new classic desktop icons font color: ' + color);
			this._setValue('eyeos.appearance.desktop.fonts.icons.color', color);
		},

		_changeDashboardWidgetsFontColor: function(color) {
			eyeos.consoleLog('new dashboard widgets font color: ' + color);
			this._setValue('eyeos.appearance.desktop.fonts.widgets.color', color);
		},

		_setValue: function(key, value) {
			if (this._values == null) {
				this._values = new Object();
			}
			eyeos.consoleLog('NEW VALUE: [' + key + '] ' + value)
			this._values[key] = value;
		},

		getSettingsValues: function() {
			return this._values;
		}
	}
});


qx.Class.define('eyeos.application.usersettings.general.NotificationsItem', {
	extend: eyeos.application.usersettings.AbstractItem,

	construct: function () {
		arguments.callee.base.call(this);
	},

	members: {

		_id: 'general.notifications',
		_panel: null,

		getId: function () {
			return this._id;
		},

		getPanel: function () {
			if (this._panel == null) {
				var panelLayout = new qx.ui.layout.Grid(10, 10);
				panelLayout.setColumnFlex(2, 1);
				panelLayout.setRowFlex(1, 1);
				this._panel = new qx.ui.container.Composite(panelLayout);
				this._panel.setPadding(10);

				this._panel.add(new qx.ui.basic.Label().set({
					value: '<b>' + tr('Category') + '</b>',
					rich: true
				}), {column: 0, row: 0});

				//
				// Category select box (top)
				//

				//TODO example here with fake categories
				var categorySelect = new qx.ui.form.SelectBox();
				for(var i = 0; i < 8; i++) {
					categorySelect.add(new qx.ui.form.ListItem('Category_' + i));
				}
				this._panel.add(categorySelect, {column: 1, row: 0});

				//
				// Subcategories + details table (bottom)
				//

				//TODO example here with fake subcategories
				var tabView = new qx.ui.tabview.TabView('left');
				for(var i = 0; i < 8; i++) {
					tabView.add(this._getTab('Subcategory_' + i));
				}
				this._panel.add(tabView, {column: 0, row: 1, colSpan: 3});
			}

			return this._panel;
		},

		_getTab: function(name) {
			var page = new qx.ui.tabview.Page(name);		//TODO: icon
			page.setLayout(new qx.ui.layout.VBox(10));
			page.setPaddingTop(10);

			//model
			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(['', tr('Internal'), tr('E-mail')]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, true);
			tableModel.setColumnEditable(2, true);

			//(fake) data
			var data = [];
			data[0] = [tr('Changes in a profile'), true, true];
			data[1] = [tr('Changes in my local files'), true, false];
			data[2] = [tr('Changes in shared files'), true, true];
			tableModel.setData(data);

			var custom = {
				tableColumnModel: function(obj) {
					return new qx.ui.table.columnmodel.Resize(obj);
				}
			};
			var table = new qx.ui.table.Table(tableModel, custom).set({
				columnVisibilityButtonVisible: false,
				statusBarVisible: false
			});

			var tcm = table.getTableColumnModel();
			tcm.setDataCellRenderer(1, new qx.ui.table.cellrenderer.Boolean());
			tcm.setCellEditorFactory(1, new qx.ui.table.celleditor.CheckBox());
			tcm.setDataCellRenderer(2, new qx.ui.table.cellrenderer.Boolean());
			tcm.setCellEditorFactory(2, new qx.ui.table.celleditor.CheckBox());

			page.add(table);

			return page;
		},

		getSettingsValues: function() {
			return [];
		}
	}
});


qx.Class.define('eyeos.application.usersettings.general.SearchItem', {
	extend: eyeos.application.usersettings.AbstractItem,

	construct: function () {
		arguments.callee.base.call(this);
	},

	members: {

		_id: 'general.search',
		_panel: null,

		getId: function () {
			return this._id;
		},

		getPanel: function () {
			if (this._panel == null) {
				this._panel = new qx.ui.container.Composite();
				var panelLayout = new qx.ui.layout.VBox(10);
				this._panel.setLayout(panelLayout);
				this._panel.setPadding(10);

				var firstBoxLayout = new qx.ui.layout.Grid(10,10);
				firstBoxLayout.setColumnFlex(1, 1);
				var firstBox = new qx.ui.container.Composite(firstBoxLayout);
				firstBox.add(new qx.ui.basic.Label().set({
					value: '<b>' + tr('Search In The Following Categories') + '</b>',
					rich: true
				}), {column: 0, row: 0});
				firstBox.add(new qx.ui.basic.Label(tr('Drag the categories to change the order of appearance in the results')), {column: 1, row: 0});
				firstBox.add(this._getCategoriesTable(), {column: 0, row: 1, colSpan: 2});

				this._panel.add(firstBox);
			}

			return this._panel;
		},

		_getCategoriesTable: function() {
			//model
			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(['', '', '']);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, true);
			tableModel.setColumnEditable(2, false);

			//(fake) data
			var data = [
			            ['1', true, tr('Applications')],
			            ['2', true, tr('Documents')],
			            ['3', true, tr('Folders')],
			            ['4', true, tr('Images')],
			            ['5', true, tr('Mails')],
			            ['6', true, tr('People')],
			            ['7', true, tr('Groups')]
			         ];
			tableModel.setData(data);

			var custom = {
				tableColumnModel: function(obj) {
					return new qx.ui.table.columnmodel.Resize(obj);
				}
			};
			var table = new qx.ui.table.Table(tableModel, custom).set({
				columnVisibilityButtonVisible: false,
				statusBarVisible: false
			});

			var tcm = table.getTableColumnModel();
			tcm.setDataCellRenderer(1, new qx.ui.table.cellrenderer.Boolean());
			tcm.setCellEditorFactory(1, new qx.ui.table.celleditor.CheckBox());

			var resizeBehavior = tcm.getBehavior();
			resizeBehavior.set(0, { width:'40', minWidth: 40, maxWidth: 80});
			resizeBehavior.set(1, { width:'40', minWidth: 40, maxWidth: 80});
			resizeBehavior.set(2, { width:'1*'});

			return table;
		},

		getSettingsValues: function() {
			return [];
		}
	}
});