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

qx.Class.define('eyeos.sps.Sheet', {

	extend: qx.core.Object,

	construct: function (application, window, id, args) {
		this.setId(id);
		this.setWindow(window);
		this.setLetters([' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
		this.setApplication(application);
		this._buildTable();
		this._addListeners();
		this.setArgs(args);
		this.init();
	},

	properties: {
		args: {
			check: 'Array'
		},
		application: {
			check: 'Object'
		},
		window: {
			check: 'Object'
		},
		id: {
			check: 'Integer'
		},
		table: {
			check: 'Object'
		},
		model: {
			check: 'Object'
		},
		letters: {
			check: 'Array'
		}
	},

	members: {

		_buildTable: function () {
			var model = new eyeos.spreadsheet.model.Simple();
			this.setModel(model);
			model.setColumns(this.getLetters());
			var window = this.getWindow();

			var table = new eyeos.spreadsheet.table.Table(model, {
				tablePane : function(obj) {
					return new eyeos.spreadsheet.pane.Pane(obj);
				},

				tablePaneScroller : function(obj, window) {
					return new eyeos.spreadsheet.pane.Scroller(obj);
				},

				tablePaneHeader: function(obj) {
					return new eyeos.spreadsheet.pane.Header(obj);
				},

				tableColumnModel: function (obj) {
					return new eyeos.spreadsheet.columnmodel.Basic(obj);
				}
			}).set({
				columnVisibilityButtonVisible: false,
				dataRowRenderer: new eyeos.spreadsheet.rowrenderer.Default()
			});

			table.setApplication(this.getApplication());
			this.setTable(table);
			model.setTable(table);

			var columnCount = model.getColumnCount();
			for (var i = 1; i < columnCount; ++i) {
				model.setColumnEditable(i, true);
				table.getTableColumnModel().setCellEditorFactory(i, new eyeos.sps.celleditor.Default());
				//if (i%3 == 0) {
				//	spsGrid.getTableColumnModel().setColumnVisible(i, false);
				//}
				//spsTableModel.setColumnSortable(i, false);
			}

			table.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
			table.setMetaColumnCounts([1, -1]);

//			var menu = new qx.ui.menu.Menu();
//			this._testMenuItem = new qx.ui.menu.Button('hola');
//			menu.add(this._testMenuItem);
//			table.setContextMenu(menu);
			//this.getApplication().getWindow()._windowTableContainer.add(table, {flex: 1});
			table.setUserData('id','Sheet'+this.getId());
		},

		_addListeners: function () {

			this.getTable().addListener('dataEdited', function (e) {
				this.getUndoRedoStack().push([this.getActiveSheet(), e.getData()]);
				if (this.getUndoRedoStackIndex() > 0) {
					this.getUndoRedoStack().splice(parseInt(this.getUndoRedoStackIndex() + 1), parseInt(this.getUndoRedoStack().length - parseInt(this.getUndoRedoStackIndex() + 1)));
				}
				this.setUndoRedoStackIndex(this.getUndoRedoStackIndex() + 1);
			}, this.getApplication());

			this.getTable().addListener('cellClick', function (e) {
				// If the cell they're clicking is the "number" ones, if not, reset the previous selection
				if (e.getColumn() == 0) {
					this.getModel().setFirstSelectedCell({row: e.getRow(), col: 1});
					this.getModel().setCurrentSelectedCell({row: e.getRow(), col: this.getModel().getColumnCount()});
					// this.getPaneScroller(1).getChildControl("focus-indicator").moveToCell(1, e.getRow());
				} else {
					//console.log(this.getWindow());
					//console.log();
					//this.getApplication()._windowHeaderFormulaBox.setValue(this.getModel().getValue(e.getColumn(), e.getRow()).toString());
					//.setValue(this.getModel().getValue(e.getColumn(), e.getRow()));
					//this.getTableModel().resetSelection();
				}

				this.getTable().customUpdate();
				//getCellElement(this, this.getPaneScroller(1).getTablePane(),e.getRow(),e.getColumn()-1);
			}, this);

			this.getTable().addListener('cellDblClick', function (e) {
				this.startEditing();
			}, this.getTable());

//			this._testMenuItem.addListener('execute', function (e) {
//				var model = this.getApplication().getModels()[this.getApplication().getActiveSheet() - 1]
//				var currentSelection = model.getCurrentSelection();
//				//console.log(currentSelection);
//				var values = new Array();
//				for (var i = currentSelection[0]; i <= currentSelection[1]; ++i) {
//					var tempValue = new Array();
//					for (var f = currentSelection[2]; f <= currentSelection[3]; ++f) {
//						tempValue.push(model.getValue(f, i));
//					}
//					values.push(tempValue);
//				}
//				//console.log(values);
//				eyeos.callMessage(this.getApplication().getChecknum(), 'createGraphic', values, function (results) {
//					//'index.php/msg/' + checknum + '/getImage/' +
//					model.createAndStoreChart(results);
//				}, this);
//			}, this);
		},

		init: function () {

			var numbers = this.self(arguments).ROWS;
			var args = this.getArgs();
			var rowValues = new Array();
			for (var i = 0; i < numbers; ++i) {
				var row = args[i];
				if (row != undefined) {
					rowValues.push(row);
				} else {
					rowValues.push([]);
				}
			}

			for (var i = 0; i < rowValues.length; i++) {
				rowValues[i].unshift(i+1);
			}

			this.getModel().addRows(rowValues);

			var columnNumber = this.getModel().getColumnCount();
			for (var i = 0; i < columnNumber; ++i) {
				this.getModel().setSortMethods(i, function () { return 0; });
			}
		}
	},

	statics: {
		ROWS: 100
	}
});

