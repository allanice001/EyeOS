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

qx.Class.define('eyeos.sps.SpreadSheets', {

	extend: qx.core.Object,

	construct: function (checknum, pid, args) {
		this.setChecknum(checknum);
		this.setPid(pid);
		this.setApplication(new eyeos.system.EyeApplication('spreadsheets', checknum, pid));
		this.setWindow(new eyeos.ui.Window(this.getApplication(), 'Spreadsheets', 'index.php?extern=/images/16x16/mimetypes/application-vnd.ms-excel.png', false, false));
		this.setLetters([' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
		this.setWindowLayout(new qx.ui.layout.VBox());
		this.setSheets(1);
		//this.setActiveSheet(1);
		this.setUndoRedoStackIndex(0);
		this.setCopyStack(new Array());
		this._buildLayout();
		this._addListeners();
		if (args != null && args[0] != undefined) {
			this.setInitialFile(args[0]);
			this.getWindow().setCaption('Spreadsheets - '+this.basename(args[0]));
			this.setFileData(args[0]);
		}
		
		this.getWindow().maximize();
		this.getWindow().open();
		
		this.init();
//		this._tinyMCE = tinyMCE.init({
//				strict_loading_mode : true,
//				theme: 'advanced'
//		});
		
	},

	properties: {
		initialFile: {
			check: 'String',
			init: null
		},
		fileData: {
			check: 'String',
			init: null
		},
		application: {
			check: 'Object'
		},
		checknum: {
			check: 'String'
		},
		letters: {
			check: 'Array'
		},
		pid: {
			check: 'String'
		},
		activeSheet: {
			check: 'Integer'
		},
		sheets: {
			check: 'Integer'
		},
		copyStack: {
			check: 'Array'
		},
		tables: {
			check: 'Array',
			init: new Array()
		},
		models: {
			check: 'Array',
			init: new Array()
		},
		undoRedoStack: {
			check: 'Array',
			init: new Array()
		},
		undoRedoStackIndex: {
			check: 'Integer'
		},
		window: {
			check: 'Object'
		},
		windowLayout: {
			check: 'Object',
			apply: '_applyWindowLayout'
		},
		windowMenuBar: {
			check: 'Object'
		},
		windowMainToolBar: {
			check: 'Object'
		},
		windowBottomToolBar: {
			check: 'Object'
		},
		windowContextMenu: {
			check: 'Object'
		}
	},

	members: {
		_letters: null,
		_windowHeader: null,
		_windowHeaderSelectionBox: null,
		_windowHeaderFormulaBox: null,
		
		_applyWindowLayout: function (newValue, oldValue) {
			this.getWindow().setLayout(this.getWindowLayout());
		},

		_addListeners: function () {
			this._windowButtonAddSheet.addListener('execute', function (e) {
				this.addSheet([[['']]]);
			}, this)

			this._windowHeaderFormulaBox.addListener('keydown', function (e) {
//				if (this.getTables()[this.getActiveSheet() - 1].isEditing()) {
//
//				}
				if (e.getKeyIdentifier() == "Enter") {
					var table = this.getTables()[this.getActiveSheet() - 1];
					var model = this.getModels()[this.getActiveSheet() - 1];
					model.setValue(table.getFocusedColumn(), table.getFocusedRow(), this._windowHeaderFormulaBox.getValue());
					this._windowHeaderFormulaBox.blur();
				}
				
			}, this);
		},

		_buildLayout: function () {

			var window = this.getWindow();

			window.set({
				contentPadding: 0,
				width: 640,
				height: 480
			});

			this.setWindowMenuBar(new eyeos.ui.menubar.MenuBar());
			var menuBar = this.getWindowMenuBar();
			menuBar.setIconsPath('index.php?extern=images/spreadsheets/');
                        menuBar.setItems(
                            new genericbar.menubar.Items().getItems()
                        );
                        menuBar.setActions(
                            new genericbar.both.Actions(window, this.getChecknum(), this.getPid, this)
                        );
			menuBar.createMenuBar();
			window.add(menuBar);

			this.setWindowMainToolBar(new eyeos.ui.toolbar.ToolBar());
			var topToolBar = this.getWindowMainToolBar();
			topToolBar.setHeight(50);
			topToolBar.setIconsPath('index.php?extern=images/spreadsheets/');
                        topToolBar.setItems(
                            new genericbar.toptoolbar.Items().getItems()
                        );
                        topToolBar.setActions(
                            new genericbar.both.Actions(window, this.getChecknum(), this.getPid, this)
                        );
			topToolBar.createToolBar();
			window.add(topToolBar);

			this.setWindowBottomToolBar(new eyeos.ui.toolbar.ToolBar());
			var bottomToolBarBasic = this.getWindowBottomToolBar();
			bottomToolBarBasic.setHeight(30);
			bottomToolBarBasic.setIconsPath('index.php?extern=images/spreadsheets/');
                        bottomToolBarBasic.setItems(
                            new genericbar.bottomtoolbar.basic.Items().getItems()
                        );
                        bottomToolBarBasic.setActions(
                            new genericbar.both.Actions(window, this.getChecknum(), this.getPid, this)
                        );
			bottomToolBarBasic.createToolBar();
			window.add(bottomToolBarBasic);

			this._windowHeader = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({padding: 5});
			this._windowHeaderSelectionBox = new qx.ui.form.TextField().set({marginRight: 5});
			this._windowHeaderFormulaBox = new qx.ui.form.TextField();
			this._windowHeader.add(this._windowHeaderSelectionBox);
			this._windowHeader.add(this._windowHeaderFormulaBox, {flex: 1});
			window.add(this._windowHeader);

			this._windowTableContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox());
			window.add(this._windowTableContainer, {flex: 1});

			this._windowFooter = new qx.ui.container.Composite(new qx.ui.layout.HBox());

			this._windowSheetContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox());
			window.add(this._windowFooter);

			this._windowButtonAddSheet = new qx.ui.form.Button("+");
			this._windowFooter.add(this._windowButtonAddSheet);
			this._windowFooter.add(this._windowSheetContainer);


//			this._windowButtonRemSheet = new qx.ui.form.Button("-");
//			this._windowSheetContainer.add(this._windowButtonRemSheet);
		},

		_buildChartWindow: function () {
//			var window = new qx.ui.window.Window('Chart');
//			window.setLayout(new qx.ui.layout.VBox());
//			window.setContentPadding(0);
//			window.setHeight(290);
//			window.setWidth(526);
//			window.setAllowMaximize(false);
//			window.setAllowMinimize(false);
//			var steps = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({
//				height: 30,
//				minHeight: 30,
//				maxHeight: 30,
//				backgroundColor: '#D9E5F4'
//			});
//			var mainLayout = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
//				backgroundColor: '#FFFFFF'
//			});
//			var buttons = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({
//				alignY: 'middle',
//				alignX: 'right'
//			})).set({
//				height: 40,
//				minHeight: 40,
//				maxHeight: 40,
//				backgroundColor: '#D9E5F4'
//			});
//			window.add(steps);
//			window.add(mainLayout, {flex: 1});
//			window.add(buttons);
//
//			// Chart Type
//			var chartTypesLayout = new qx.ui.container.Composite(new qx.ui.layout.HBox()).set({marginLeft: 10});
//			var chartTypesLabel = new qx.ui.basic.Label('Choose type').set({
//				width: 220,
//				marginTop: 15,
//				marginBottom: 5,
//				font: new qx.bom.Font('12', ['Lucida Grande', 'Verdana', 'Arial', 'Helvetica'])
//			});
//			var chartTypes = new qx.ui.container.Composite(new qx.ui.layout.Flow(10,10)).set({
//				width: 230,
//				height: 190
//			});
//
//			var chartTypesArea = new qx.ui.basic.Atom('Area', 'index.php?extern=images/spreadsheets/chart-area-0.png').set({iconPosition: 'top'});
//			var chartTypesBar = new qx.ui.basic.Atom('Bar', 'index.php?extern=images/spreadsheets/chart-bar-0.png').set({iconPosition: 'top'});
//			var chartTypesColumns = new qx.ui.basic.Atom('Columns', 'index.php?extern=images/spreadsheets/chart-col-0.png').set({iconPosition: 'top'});
//			var chartTypesLine = new qx.ui.basic.Atom('Line', 'index.php?extern=images/spreadsheets/chart-line-0.png').set({iconPosition: 'top'});
//			var chartTypesPie = new qx.ui.basic.Atom('Pie', 'index.php?extern=images/spreadsheets/chart-pie-0.png').set({iconPosition: 'top'});
//			var chartTypesScatter = new qx.ui.basic.Atom('Scatter', 'index.php?extern=images/spreadsheets/chart-sca-0.png').set({iconPosition: 'top'});
//
//			chartTypes.add(chartTypesLabel);
//
//			chartTypes.add(chartTypesArea);
//			chartTypes.add(chartTypesBar);
//			chartTypes.add(chartTypesColumns);
//			chartTypes.add(chartTypesPie);
//			chartTypes.add(chartTypesLine);
//			chartTypes.add(chartTypesScatter);
//
//			chartTypesLayout.add(chartTypes);
//
//			var chartSubTypes = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
//				marginTop: 7,
//				marginRight: 5,
//				marginBottom: 7,
//				decorator: new qx.ui.decoration.RoundBorderBeveled('#F3F3F3', '#000000', null, 5, 5, 5, 5),
//				width: 290,
//				height: 190
//			});
//
//			var chartSubTypesLabel = new qx.ui.basic.Label('Choose subtype').set({
//				width: 220,
//				marginBottom: 5,
//				marginLeft: 5,
//				marginTop: 10,
//				font: new qx.bom.Font('12', ['Lucida Grande', 'Verdana', 'Arial', 'Helvetica'])
//			});
//			chartSubTypesLabel.setUserData('id', 'label');
//
//			chartSubTypes.add(chartSubTypesLabel);
//
//			var chartSubTypesBoxArea1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'})).set({padding: 3});
//			var chartSubTypesBoxArea2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'})).set({padding: 3});
//			var chartSubTypesArea1 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-area-1.png').set({marginRight: 6});
//			var chartSubTypesArea2 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-area-2.png');
//			var chartSubTypesArea3 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-area-3.png').set({marginRight: 6});;
//			var chartSubTypesArea4 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-area-4.png');
//			chartSubTypesBoxArea1.add(chartSubTypesArea1);
//			chartSubTypesBoxArea1.add(chartSubTypesArea2);
//			chartSubTypesBoxArea2.add(chartSubTypesArea3);
//			chartSubTypesBoxArea2.add(chartSubTypesArea4);
//			chartSubTypesBoxArea1.setUserData('id', 'area');
//			chartSubTypesBoxArea2.setUserData('id', 'area');
//
//			var chartSubTypesBoxBar1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'})).set({padding: 3});
//			var chartSubTypesBoxBar2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'})).set({padding: 3});
//			var chartSubTypesBar1 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-bar-1.png').set({marginRight: 6});
//			var chartSubTypesBar2 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-bar-2.png');
//			var chartSubTypesBar3 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-bar-3.png').set({marginRight: 6});;
//			var chartSubTypesBar4 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-bar-4.png');
//			chartSubTypesBoxBar1.add(chartSubTypesBar1);
//			chartSubTypesBoxBar1.add(chartSubTypesBar2);
//			chartSubTypesBoxBar2.add(chartSubTypesBar3);
//			chartSubTypesBoxBar2.add(chartSubTypesBar4);
//			chartSubTypesBoxBar1.setUserData('id', 'bars');
//			chartSubTypesBoxBar2.setUserData('id', 'bars');
//
//			var chartSubTypesBoxColumns1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'})).set({padding: 3});
//			var chartSubTypesBoxColumns2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'})).set({padding: 3});
//			var chartSubTypesColumns1 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-col-1.png').set({marginRight: 6});
//			var chartSubTypesColumns2 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-col-2.png');
//			var chartSubTypesColumns3 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-col-3.png').set({marginRight: 6});;
//			var chartSubTypesColumns4 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-col-4.png');
//			chartSubTypesBoxColumns1.add(chartSubTypesColumns1);
//			chartSubTypesBoxColumns1.add(chartSubTypesColumns2);
//			chartSubTypesBoxColumns2.add(chartSubTypesColumns3);
//			chartSubTypesBoxColumns2.add(chartSubTypesColumns4);
//			chartSubTypesBoxColumns1.setUserData('id', 'columns');
//			chartSubTypesBoxColumns2.setUserData('id', 'columns');
//
//			var chartSubTypesBoxPie1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'})).set({padding: 3});
//			var chartSubTypesBoxPie2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'})).set({padding: 3});
//			var chartSubTypesPie1 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-pie-1.png').set({marginRight: 6});
//			var chartSubTypesPie2 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-pie-2.png');
//			var chartSubTypesPie3 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-pie-3.png').set({marginRight: 6});;
//			var chartSubTypesPie4 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-pie-4.png');
//			chartSubTypesBoxPie1.add(chartSubTypesPie1);
//			chartSubTypesBoxPie1.add(chartSubTypesPie2);
//			chartSubTypesBoxPie2.add(chartSubTypesPie3);
//			chartSubTypesBoxPie2.add(chartSubTypesPie4);
//			chartSubTypesBoxPie1.setUserData('id', 'pie');
//			chartSubTypesBoxPie2.setUserData('id', 'pie');
//
//			var chartSubTypesBoxScatter1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'})).set({padding: 3});
//			var chartSubTypesBoxScatter2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'})).set({padding: 3});
//			var chartSubTypesScatter1 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-sca-1.png').set({marginRight: 6});
//			var chartSubTypesScatter2 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-sca-2.png');
//			var chartSubTypesScatter3 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-sca-3.png').set({marginRight: 6});;
//			var chartSubTypesScatter4 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-sca-4.png');
//			chartSubTypesBoxScatter1.add(chartSubTypesScatter1);
//			chartSubTypesBoxScatter1.add(chartSubTypesScatter2);
//			chartSubTypesBoxScatter2.add(chartSubTypesScatter3);
//			chartSubTypesBoxScatter2.add(chartSubTypesScatter4);
//			chartSubTypesBoxScatter1.setUserData('id', 'scatter');
//			chartSubTypesBoxScatter2.setUserData('id', 'scatter');
//
//			var chartSubTypesBoxLine1 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'})).set({padding: 3});
//			var chartSubTypesBoxLine2 = new qx.ui.container.Composite(new qx.ui.layout.HBox().set({alignX: 'center'})).set({padding: 3});
//			var chartSubTypesLine1 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-line-1.png').set({marginRight: 6});
//			var chartSubTypesLine2 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-line-2.png');
//			var chartSubTypesLine3 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-line-3.png').set({marginRight: 6});;
//			var chartSubTypesLine4 = new qx.ui.basic.Image('index.php?extern=images/spreadsheets/chart-line-4.png');
//			chartSubTypesBoxLine1.add(chartSubTypesLine1);
//			chartSubTypesBoxLine1.add(chartSubTypesLine2);
//			chartSubTypesBoxLine2.add(chartSubTypesLine3);
//			chartSubTypesBoxLine2.add(chartSubTypesLine4);
//			chartSubTypesBoxLine1.setUserData('id', 'line');
//			chartSubTypesBoxLine2.setUserData('id', 'line');
//
//			chartSubTypes.add(chartSubTypesBoxArea1);
//			chartSubTypes.add(chartSubTypesBoxArea2);
//			chartSubTypes.add(chartSubTypesBoxBar1);
//			chartSubTypes.add(chartSubTypesBoxBar2);
//			chartSubTypes.add(chartSubTypesBoxColumns1);
//			chartSubTypes.add(chartSubTypesBoxColumns2);
//			chartSubTypes.add(chartSubTypesBoxPie1);
//			chartSubTypes.add(chartSubTypesBoxPie2);
//			chartSubTypes.add(chartSubTypesBoxScatter1);
//			chartSubTypes.add(chartSubTypesBoxScatter2);
//			chartSubTypes.add(chartSubTypesBoxLine1);
//			chartSubTypes.add(chartSubTypesBoxLine2);
//
//			chartTypesLayout.add(chartSubTypes);
//
//			mainLayout.add(chartTypesLayout);
//
//			var self = this;
//
//			chartTypesArea.addListener('click', function (e) {
//				this._displayChartSubType('area');
//			}, this);
//
//			chartTypesColumns.addListener('click', function (e) {
//				this._displayChartSubType('columns');
//			}, this);
//
//			chartTypesBar.addListener('click', function (e) {
//				this._displayChartSubType('bars');
//			}, this);
//
//			chartTypesLine.addListener('click', function (e) {
//				this._displayChartSubType('line');
//			}, this);
//
//			chartTypesScatter.addListener('click', function (e) {
//				this._displayChartSubType('scatter');
//			}, this);
//
//			chartTypesPie.addListener('click', function (e) {
//				this._displayChartSubType('pie');
//			}, this);
//
//			this._chartSubTypes = chartSubTypes;
//			this._displayChartSubType('area');
//
//			// Data Range
//			var dataRangeLayout = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
//			var dataRangeTextFieldLabel = new qx.ui.basic.Label('Data Range: ');
//			var dataRangeTextField = new qx.ui.form.TextField();
//
//			var dataRangeGroupRadio = new qx.ui.form.RadioButtonGroup(new qx.ui.layout.HBox());
//			var dataRangeGroupRadioRows = new qx.ui.form.RadioButton('Rows');
//			var dataRangeGroupRadioCols = new qx.ui.form.RadioButton('Cols');
//			var dataRangeGroupRadioLabel = new qx.ui.basic.Label('Grouping by: ');
//			dataRangeGroupRadio.add(dataRangeGroupRadioRows);
//			dataRangeGroupRadio.add(dataRangeGroupRadioCols);
//			var dataRangeLabelsRows = new qx.ui.form.CheckBox('Use row X for labels values');
//			var dataRangeLabelsCols = new qx.ui.form.CheckBox('Use columns X for labels values');
//
//			dataRangeLayout.add(dataRangeTextFieldLabel, {top: 10, left: 5});
//			dataRangeLayout.add(dataRangeGroupRadioLabel, {top: 30, left: 5});
//			dataRangeLayout.add(dataRangeTextField, {top: 10, left: 70});
//			dataRangeLayout.add(dataRangeGroupRadio, {top: 30, left: 70});
//			dataRangeLayout.add(dataRangeLabelsRows, {top: 50, left: 20});
//			dataRangeLayout.add(dataRangeLabelsCols, {top: 70, left: 20});
//
//			mainLayout.add(dataRangeLayout);
//
//			//
//
////			var left = (this.getWindow().getBounds().width/2) - (window.getWidth()/2) + this.getWindow().getBounds().left;
////			var top = (this.getWindow().getBounds().height/2) - (window.getHeight()/2) + this.getWindow().getBounds().top;
////			window.moveTo(left, top);
//			window.open();
//			//this.getWindow().add(window);
		},

		_displayChartSubType: function (id) {
//			var childrenList = this._chartSubTypes.getChildren();
//			for (var i = 0; i < childrenList.length; ++i) {
//				if (childrenList[i].getUserData('id') == id || childrenList[i].getUserData('id') == 'label') {
//					childrenList[i].setVisibility('visible');
//				} else {
//					childrenList[i].setVisibility('excluded');
//				}
//			}
		},

		init: function () {
			var tinymceId = 'tinymce_editor_sps';
			ed = new tinymce.Editor(tinymceId, {
				strict_loading_mode : true,
				theme: 'advanced',
				theme_advanced_buttons1 : "",
				theme_advanced_buttons2 : "",
				theme_advanced_buttons3 : "",
				setup : function(ed) {
					ed.onPostRender.add(function(ed) {
						var editor = document.getElementById(ed.id + '_tbl').firstChild;
						editor.lastChild.style.dispay = 'none';
					});
				}
			});

			ed.onNodeChange.add(function(ed, e) {
				ed.content = ed.selection.getContent();
			});

			this.ed = ed;

			if (this.getInitialFile() != null) {
				this.openFile(this.getInitialFile());
			} else {
				this.newFile();
			}
		},

		isValueNumeric: function (sText) {
			var validChars = "0123456789.,";
			var isNumber = true;
			var Char;

			for (i = 0; i < sText.length && isNumber == true; i++) {
				var character = sText.charAt(i);
				if (validChars.indexOf(character) == -1) {
					isNumber = false;
				}
			}

			return isNumber;
		},

		initApplication: function (data) {
			var dataBulk = new Array();
			for (var i = 0; i < data.length; i++) {
				var rows = data[i];
				dataBulk[i] = new Array();
				for (var f = 0; f < rows.length; f++) {
					var columns = rows[f];
					dataBulk[i][f] = new Array();
					for (var j = 0; j < columns.length; j++) {
						if (isNaN(columns[j])) {
							dataBulk[i][f][j] = columns[j].toString();
						} else {
							dataBulk[i][f][j] = parseFloat(columns[j]);
						}
					}
				}
				this.addSheet(dataBulk[i]);
			}
			this.setActiveSheet(1);
			this.hideSheets();
		},

		addSheet: function (args) {	
			var sheetNumber = this.getSheets();
			this.setActiveSheet(sheetNumber);
			var sheet = new eyeos.sps.Sheet(this, this.getWindow(), sheetNumber, args);
			sheet.setUserData('id', sheetNumber);
			var item = new qx.ui.form.Button('Sheet '+sheetNumber).set({padding: 10});
			this._windowTableContainer.add(sheet.getTable(), {flex: 1});
			this.getTables().push(sheet.getTable());
			this.getModels().push(sheet.getModel());
			item.setUserData('id',sheetNumber);
			sheet.getTable().setUserData('id', sheetNumber);
			this._windowSheetContainer.add(item);
			var self = this;
			item.addListener('click', function () {
				self.setActiveSheet(this.getUserData('id'));
				self.hideSheets(this);
			});
			this.setSheets(this.getSheets() + 1);
			this.hideSheets(sheet);
		},

		hideSheets: function (item) {
			var children = this._windowTableContainer.getChildren();
			var childrenBar = this._windowSheetContainer.getChildren();
			for (var i = 0; i < children.length; ++i) {
				if (children[i].getUserData('id') == this.getActiveSheet()) {
					children[i].setVisibility('visible');
					childrenBar[i].set({decorator: null, backgroundColor: '#808080', textColor: '#FFFFFF'});
				} else {
					children[i].setVisibility('excluded');
					childrenBar[i].set({decorator: null, backgroundColor: '#C0C0C0', textColor: '#000000'});
				}
			}
		},

		open: function() {
			var fc = new eyeos.dialogs.FileChooser(this.getChecknum());
			fc.showOpenDialog(this.getWindow(), function(choice, path) {
				if (choice == eyeos.dialogs.FileChooser.APPROVE_OPTION) {
					eyeos.callMessage(this.getChecknum(), 'openFile', [path], function (results) {
//						if (this.getInitialFile() == null) {
//							if (this.getUndoRedoStack().length >= 1) {
//								this.removeSheets();
//							} else {
//								this.removeSheets();
//							}
//						}
						this.removeSheets();
						this.setFileData(path);
						this.getWindow().setCaption('Spreadsheets - '+this.basename(path));
						this.initApplication(results);
					}, this);
				}
			}, this);
		},

		removeSheets: function () {
			this._windowSheetContainer._removeAll();
			this._windowTableContainer._removeAll();
			this.getTables().splice(0, this.getTables().length);
			this.getModels().splice(0, this.getModels().length);
			this.setSheets(1);
		},

		openFile: function (file) {
			eyeos.callMessage(this.getChecknum(), 'openFile', [file], function (results) {
				this.initApplication(results);
			}, this);
		},

		newFile: function () {
			this.setFileData(null);
			this.removeSheets();
			this.getWindow().setCaption('Spreadsheets - New File (untitled)');
			this.initApplication([[['']]]);
		},

		save: function () {
			var globalDoc = new Array();
			for (var i = 1; i < this.getSheets(); ++i) {
				globalDoc[i - 1] = new Array();
				var model = this.getModels()[i - 1];
				var rows = model.getRowCount();
				var columns = model.getColumnCount();
				for (var f = 0; f < rows; ++f) {
					globalDoc[i - 1][f] = new Array();
					for (var j = 1; j < columns; ++j) {
						globalDoc[i - 1][f][j - 1] = model.getValue(j, f);
					}
				}
			}


			if (this.getFileData() == null) {
				var fc = new eyeos.dialogs.FileChooser(this.getChecknum());
				fc.showSaveDialog(this.getWindow(), function(choice, path) {
					if (choice == eyeos.dialogs.FileChooser.APPROVE_OPTION) {
						this.setFileData(path);
						eyeos.callMessage(this.getChecknum(), 'saveFile', [this.getFileData(), globalDoc], function () {
							this.getWindow().setCaption('Spreadsheets - '+this.basename(this.getFileData()));
						}, this);
					}
				}, this);
			} else {
				eyeos.callMessage(this.getChecknum(), 'saveFile', [this.getFileData(), globalDoc], function () {
						this.getWindow().setCaption('Spreadsheets - '+this.basename(this.getFileData()));
				}, this);
			}


		},

		basename: function(path, suffix) {
			var b = path.replace(/^.*[\/\\]/g, '');
			if (typeof(suffix) == 'string' && b.substr(b.length-suffix.length) == suffix) {
				b = b.substr(0, b.length-suffix.length);
			}

			return b;
		}

		//	function getCellElement(table, pane, row, column, renderer) {
//		var element = pane.getContentElement().getDomElement();
//		var renderedRow = row - pane.getFirstVisibleRow();
//		var cell = element.childNodes[0].childNodes[renderedRow].childNodes[column];
//		var oldStyle = cell.getAttribute('style');
////		cell.style.backgroundColor = '#E0E0E0';
////		var tableModel = spsGrid.getTableModel();
////		if (!tableModel.getCellStyle(row, column + 1)) {
////			tableModel.setCellStyle(row, column + 1, cell.getAttribute('style').replace(oldStyle,''));
////		}
//	}
	}
});

function spreadsheets_application (checknum, pid, args) {
	new eyeos.sps.SpreadSheets(checknum, pid, args);
}
