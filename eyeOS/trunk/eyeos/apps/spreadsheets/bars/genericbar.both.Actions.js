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

/**
 *	Implementing {@see eyeos.ui.menubar.IActions}.
 */
qx.Class.define("genericbar.both.Actions", {
	extend: qx.core.Object,
	implement : [eyeos.ui.genericbar.IActions],

	construct: function(window, checknum, pid, application) {
		arguments.callee.base.call(this);
		this.setWindow(window);
		this.setChecknum(checknum);
		this.setApplication(application);
		this.setPid(pid);
	},

	properties: {
		mathProcessor: {
			init: null, 
			check: 'Object'
		},
		window: {
			init: null,
			check: 'eyeos.ui.Window'
		},
		checknum: {
			init: null
		},
		pid: {
			init: null
		},
		application: {
			init: null
		}
	},

	members: {

		dynamicsActions: function (e) {
//			console.log(e.getTarget().getLabel());
		},

		fileNew: function (e) {
			this.getApplication().newFile();
//			console.log(e.getTarget().getLabel());
		},

		fileOpen: function (e) {
			this.getApplication().open();
		},

		fileSave: function (e) {
			this.getApplication().save();
		},

		chartDialog: function (e) {
			this.getApplication()._buildChartWindow();
		},

		formula_sum: function (e) {
			var sps = this.getApplication();
			var model = sps.getModels()[this.getApplication().getActiveSheet() - 1];
			var table = sps.getTables()[this.getApplication().getActiveSheet() - 1];
			var selection = model.getCurrentSelection();
			var firstCell = sps.getLetters()[selection[2]] + (selection[0] + 1);
			var lastCell = sps.getLetters()[selection[3]] + (selection[1] + 1);

			this.getApplication().getUndoRedoStack().push([sps.getActiveSheet(), {row: selection[1] + 1, col: selection[3], oldValue: model.getValue(selection[3], selection[1] + 1), value: '=SUM('+firstCell+':'+lastCell+')'}]);
			model.setValue(selection[3], selection[1] + 1, '=SUM('+firstCell+':'+lastCell+')');

			table.setFocusedCell(selection[3], selection[1] + 1);

			this.updateUndoRedoStack(sps);
		},
		
		formula_avg: function (e) {
			var sps = this.getApplication();
			var model = sps.getModels()[this.getApplication().getActiveSheet() - 1];
			var table = sps.getTables()[this.getApplication().getActiveSheet() - 1];
			var selection = model.getCurrentSelection();
			var firstCell = sps.getLetters()[selection[2]] + (selection[0] + 1);
			var lastCell = sps.getLetters()[selection[3]] + (selection[1] + 1);

			this.getApplication().getUndoRedoStack().push([sps.getActiveSheet(), {row: selection[1] + 1, col: selection[3], oldValue: model.getValue(selection[3], selection[1] + 1), value: '=AVG('+firstCell+':'+lastCell+')'}]);
			model.setValue(selection[3], selection[1] + 1, '=AVG('+firstCell+':'+lastCell+')');

			table.setFocusedCell(selection[3], selection[1] + 1);

			this.updateUndoRedoStack(sps);
		},

		formula_prod: function (e) {
			var sps = this.getApplication();
			var model = sps.getModels()[this.getApplication().getActiveSheet() - 1];
			var table = sps.getTables()[this.getApplication().getActiveSheet() - 1];
			var selection = model.getCurrentSelection();
			var firstCell = sps.getLetters()[selection[2]] + (selection[0] + 1);
			var lastCell = sps.getLetters()[selection[3]] + (selection[1] + 1);

			this.getApplication().getUndoRedoStack().push([sps.getActiveSheet(), {row: selection[1] + 1, col: selection[3], oldValue: model.getValue(selection[3], selection[1] + 1), value: '=PROD('+firstCell+':'+lastCell+')'}]);
			model.setValue(selection[3], selection[1] + 1, '=PROD('+firstCell+':'+lastCell+')');

			table.setFocusedCell(selection[3], selection[1] + 1);

			this.updateUndoRedoStack(sps);
		},

		formula_min: function (e) {
			var sps = this.getApplication();
			var model = sps.getModels()[this.getApplication().getActiveSheet() - 1];
			var table = sps.getTables()[this.getApplication().getActiveSheet() - 1];
			var selection = model.getCurrentSelection();
			var firstCell = sps.getLetters()[selection[2]] + (selection[0] + 1);
			var lastCell = sps.getLetters()[selection[3]] + (selection[1] + 1);

			this.getApplication().getUndoRedoStack().push([sps.getActiveSheet(), {row: selection[1] + 1, col: selection[3], oldValue: model.getValue(selection[3], selection[1] + 1), value: '=MIN('+firstCell+':'+lastCell+')'}]);
			model.setValue(selection[3], selection[1] + 1, '=MIN('+firstCell+':'+lastCell+')');

			table.setFocusedCell(selection[3], selection[1] + 1);

			this.updateUndoRedoStack(sps);
		},

		formula_max: function (e) {
			var sps = this.getApplication();
			var model = sps.getModels()[this.getApplication().getActiveSheet() - 1];
			var table = sps.getTables()[this.getApplication().getActiveSheet() - 1];
			var selection = model.getCurrentSelection();
			var firstCell = sps.getLetters()[selection[2]] + (selection[0] + 1);
			var lastCell = sps.getLetters()[selection[3]] + (selection[1] + 1);

			this.getApplication().getUndoRedoStack().push([sps.getActiveSheet(), {row: selection[1] + 1, col: selection[3], oldValue: model.getValue(selection[3], selection[1] + 1), value: '=MAX('+firstCell+':'+lastCell+')'}]);
			model.setValue(selection[3], selection[1] + 1, '=MAX('+firstCell+':'+lastCell+')');

			table.setFocusedCell(selection[3], selection[1] + 1);

			this.updateUndoRedoStack(sps);
		},

		updateUndoRedoStack: function (sps) {
			if (sps.getUndoRedoStackIndex() > 0) {
				sps.getUndoRedoStack().splice(parseInt(sps.getUndoRedoStackIndex() + 1), parseInt(sps.getUndoRedoStack().length - parseInt(sps.getUndoRedoStackIndex() + 1)));
			}
			sps.setUndoRedoStackIndex(sps.getUndoRedoStackIndex() + 1);
		},

		selectAll: function (e) {
			var model = this.getApplication().getModels()[this.getApplication().getActiveSheet() - 1];
			var table = this.getApplication().getTables()[this.getApplication().getActiveSheet() - 1];
			model.setFirstSelectedCell({row: 0, col: 1});
			model.setCurrentSelectedCell({row: model.getRowCount(), col: model.getColumnCount() });
			table.customUpdate();
		},

		clearAll: function (e) {
			var model = this.getApplication().getModels()[this.getApplication().getActiveSheet() - 1];
			var table = this.getApplication().getTables()[this.getApplication().getActiveSheet() - 1];
			var selection = model.getCurrentSelection();
			var firstRow = selection[0];
			var lastRow = selection[1];
			var firstCol = selection[2];
			var lastCol = selection[3];
			for (var i = firstRow; i <= lastRow; ++i) {
				for (var f = firstCol; f <= lastCol; ++f) {
					model.setValue(f, i, undefined);
				}
			}
			table.customUpdate();
		},

		insertRowAbove: function (e) {
			var sps = this.getApplication();
			var tableModel = this.getApplication().getModels()[this.getApplication().getActiveSheet() - 1];
			var table = this.getApplication().getTables()[this.getApplication().getActiveSheet() - 1];
			var focusedRow = table.getFocusedRow();
			if (focusedRow != null) {
				tableModel.addRowsAsMapArray([[]], focusedRow);
			} else {
				tableModel.addRowsAsMapArray([[]], 0);
			}
			this.reDrawRows(tableModel)
		},

		insertRowBelow: function (e) {
			var sps = this.getApplication();
			var tableModel = this.getApplication().getModels()[this.getApplication().getActiveSheet() - 1];
			var table = this.getApplication().getTables()[this.getApplication().getActiveSheet() - 1];
			var focusedRow = table.getFocusedRow();
			if (focusedRow != null) {
				tableModel.addRowsAsMapArray([[]], focusedRow + 1);
			} else {
				tableModel.addRowsAsMapArray([[]], tableModel.getRowCount());
			}
			this.reDrawRows(tableModel)
		},

		reDrawRows: function (model) {
			var rowCount = model.getRowCount();
			for (var i = 0; i < rowCount; ++i) {
				model.setValue(0, i, i + 1);
			}
		},

		editCopy: function (e) {
			var sps = this.getApplication();
			sps.setCopyStack(new Array());
			var tableModel = sps.getModels()[this.getApplication().getActiveSheet() - 1];
			var table = sps.getTables()[this.getApplication().getActiveSheet() - 1];

			var currentSelection = tableModel.getCurrentSelection();
			var stack = new Array();

			var limitRows = currentSelection[1] - currentSelection[0];
			var limitCols = currentSelection[3] - currentSelection[2];

			for (var i = 0; i <= limitRows; ++i) {
				stack[i] = new Array();
				for (var f = 0; f <= limitCols; ++f) {
					stack[i][f] = tableModel.getValue(currentSelection[2]+f, currentSelection[0]+i);
					//tableModel.setValue(currentSelection[2]+f, currentSelection[0]+i, '');
				}
				sps.getCopyStack().push(stack[i]);
			}
		},

		editCut: function (e) {
			var sps = this.getApplication();
			sps.setCopyStack(new Array());
			var tableModel = sps.getModels()[this.getApplication().getActiveSheet() - 1];
			var table = sps.getTables()[this.getApplication().getActiveSheet() - 1];

			var currentSelection = tableModel.getCurrentSelection();
			var stack = new Array();

			var limitRows = currentSelection[1] - currentSelection[0];
			var limitCols = currentSelection[3] - currentSelection[2];

			for (var i = 0; i <= limitRows; ++i) {
				stack[i] = new Array();
				for (var f = 0; f <= limitCols; ++f) {
					stack[i][f] = tableModel.getValue(currentSelection[2]+f, currentSelection[0]+i);
					tableModel.setValue(currentSelection[2]+f, currentSelection[0]+i, undefined);
				}
				sps.getCopyStack().push(stack[i]);
			}
		},

		editPaste: function (e) {
			var sps = this.getApplication();
			var stack = sps.getCopyStack();
			var tableModel = sps.getModels()[this.getApplication().getActiveSheet() - 1];
			var table = sps.getTables()[this.getApplication().getActiveSheet() - 1];
			var row = table.getFocusedRow();
			var col = table.getFocusedColumn();

			for (var i = 0; i < stack.length; ++i) {
				var item = stack[i];
				for (var f = 0; f < item.length; ++f) {
					tableModel.setValue(col+f, row+i, item[f]);
				}
			}

			table.customUpdate();
		},

		editUndo: function (e) {
			var sps = this.getApplication();
			var stack = sps.getUndoRedoStack();
			var ind = sps.getUndoRedoStackIndex();
			if (ind < 0) {
				return;
			} else {
				if (ind != 0) {
					var values = stack[ind - 1];
				} else {
					values = stack[0];
				}
			}
			var model = sps.getModels()[values[0] - 1];
			for (var i = 1; i < values.length; ++i) {
				var item = values[i];
				model.setValue(item.col, item.row, item.oldValue);
			}
			sps.getTables()[values[0] - 1].customUpdate();
			if (ind > 0) {
				sps.setUndoRedoStackIndex(ind - 1);
			} else {
				sps.setUndoRedoStackIndex(0);
			}
		},

		editRedo: function (e) {
			var sps = this.getApplication();
			var stack = sps.getUndoRedoStack();
			var ind = sps.getUndoRedoStackIndex();
			if ((ind + 1) > stack.length) {
				return;
			} else {
				var values = stack[ind];
			}
			var model = sps.getModels()[values[0] - 1];
			for (var i = 1; i < values.length; ++i) {
				var item = values[i];
				model.setValue(item.col, item.row, item.value);
			}
			sps.getTables()[values[0] - 1].customUpdate();
			if (ind < stack.length) {
				sps.setUndoRedoStackIndex(ind + 1);
			} else {
				sps.setUndoRedoStackIndex(stack.length);
			}
		},

		isValueNumeric: function (sText) {
			var validChars = "0123456789.,";
			var isNumber = true;

			for (var i = 0; i < sText.length && isNumber == true; ++i) {
				var character = sText.charAt(i);
				if (validChars.indexOf(character) == -1) {
					isNumber = false;
				}
			}
			return isNumber;
		},
		
		sortPrepareUndoRedoStack: function (sps, valuesUndoRedo) {
			// We prepare the stack for undo/redo values
			var temp = new Array();
			for (var i = 0; i < valuesUndoRedo.length; ++i) {
				if (valuesUndoRedo[i] != undefined) {
					for (var f = 0; f < valuesUndoRedo[i].length; ++f) {
						if (valuesUndoRedo[i][f] != undefined) {
							temp.push(valuesUndoRedo[i][f]);
						}
					}
				}
			}

			// Store the active sheet for undo/redo
			// Add one for the stack
			temp.unshift(sps.getActiveSheet());
			sps.getUndoRedoStack().push(temp);
			if (sps.getUndoRedoStackIndex() > 0) {
				sps.getUndoRedoStack().splice(parseInt(sps.getUndoRedoStackIndex() + 1), parseInt(sps.getUndoRedoStack().length - parseInt(sps.getUndoRedoStackIndex() + 1)));
			}

			sps.setUndoRedoStackIndex(sps.getUndoRedoStackIndex() + 1);
		},

		sortAscendant: function (e) {
			var sps = this.getApplication();
			var model = sps.getModels()[this.getApplication().getActiveSheet() - 1];
			var table = sps.getTables()[this.getApplication().getActiveSheet() - 1];
			var selection = model.getCurrentSelection();
			var firstRow = selection[0];
			var lastRow = selection[1];
			var firstCol = selection[2];
			var lastCol = selection[3];

			var letterFound = this.sortDetectLetter(sps, model, table, firstRow, lastRow, firstCol, lastCol);
			var valuesUndoRedo = new Array();
			
			if (letterFound) {
				valuesUndoRedo = this.sortByLetters('ascendant', model, firstRow, lastRow, firstCol, lastCol);
			} else {
				valuesUndoRedo = this.sortNumeric('ascendant', sps, model, table, firstRow, lastRow, firstCol, lastCol);
			}

			this.sortPrepareUndoRedoStack(sps, valuesUndoRedo);

			table.customUpdate();
		},

		sortDescendant: function (e) {
			var sps = this.getApplication();
			var model = sps.getModels()[this.getApplication().getActiveSheet() - 1];
			var table = sps.getTables()[this.getApplication().getActiveSheet() - 1];
			var selection = model.getCurrentSelection();
			var firstRow = selection[0];
			var lastRow = selection[1];
			var firstCol = selection[2];
			var lastCol = selection[3];

			var letterFound = this.sortDetectLetter(sps, model, table, firstRow, lastRow, firstCol, lastCol);
			var valuesUndoRedo = new Array();

			if (letterFound) {
				valuesUndoRedo = this.sortByLetters('descendant', model, firstRow, lastRow, firstCol, lastCol);
			} else {
				valuesUndoRedo = this.sortNumeric('descendant', sps, model, table, firstRow, lastRow, firstCol, lastCol);
			}

			this.sortPrepareUndoRedoStack(sps, valuesUndoRedo);

			table.customUpdate();
		},

		sortDetectLetter: function (sps, model, table, firstRow, lastRow, firstCol, lastCol) {
			var letterFound = false;

			for (var i = firstCol; i <= lastCol; ++i) {
				for (var f = firstRow; f <= lastRow; ++f) {
					var tempValue = model.getValue(i, f);
					if (typeof(tempValue) == "string") {
						if (tempValue.substr(0,1) != "=" && !this.isValueNumeric(tempValue)) {
							letterFound = true;
						}
					}
				}
			}

			return letterFound;
		},

		sortByLetters: function (flag, model, firstRow, lastRow, firstCol, lastCol) {
			var tempArray = new Array();
			var sortArray = new Array();
			var refArray = new Array();
			var row = 0;
			for (var i = firstRow; i <= lastRow; ++i) {
				refArray[row] = new Array();
				var col = 0;
				for (var f = firstCol; f <= lastCol; ++f) {
					if (f == firstCol) {
						tempArray[row] = model.getValue(f, i);
						sortArray[row] = model.getValue(f, i);
					} else {
						refArray[row][col] = model.getValue(f, i);
						col++;
					}
				}
				row++;
			}

			if (flag == 'ascendant') {
				sortArray.sort();
			} else {
				sortArray.sort().reverse();
			}

			var sortedArray = new Array();
			for (var i = 0; i < sortArray.length; i++) {
				sortedArray[i] = new Array();
				sortedArray[i][0] = sortArray[i];
				for (var k = 1; k < (refArray[0].length + 1); ++k) {
					sortedArray[i][k] = refArray[tempArray.indexOf(sortArray[i])][k - 1];
				}
			}

			var valuesUndoRedo = new Array();
			var x = 0;
			for (var i = firstCol; i <= lastCol; ++i) {
				var z = 0;
				valuesUndoRedo[i] = new Array();
				for (var f = firstRow; f <= lastRow; ++f) {
					valuesUndoRedo[i][f] = {
						oldValue: model.getValue(i, f),
						value: sortedArray[z][x],
						row: f,
						col: i
					};
					model.setValue(i, f, sortedArray[z][x]);
					z++;
				}
				x++;
			}
			
			return valuesUndoRedo;
		},

		sortNumeric: function (flag, sps, model, table, firstRow, lastRow, firstCol, lastCol) {

			if (!(this.getMathProcessor() instanceof MathProcessor)) {
				this.setMathProcessor(new MathProcessor(this.getApplication().getTables()[this.getApplication().getActiveSheet() - 1]));
			}
			
			var numOrdA = function (a, b){ return (a.value-b.value); };
			var numOrdD = function (a, b){ return (a.value+b.value); };
			var order;
			
			if (flag == 'ascendant') {
				order = numOrdA;
			} else {
				order = numOrdD;
			}

			var values = new Array();
			var valuesUndoRedo = new Array();

			/*
			 * We run from the first to the last column (and row) of our selection
			 *
			 * - We parse if there's any formula
			 * - Then we save the values for the undoRedo (it should do it just once)
			 */
			
			for (var i = firstCol; i <= lastCol; ++i) {
				values[i] = new Array();
				valuesUndoRedo[i] = new Array();
				for (var f = firstRow; f <= lastRow; ++f) {
					var tempValue = model.getValue(i, f);
					if (typeof(tempValue) == "string") {
						if (tempValue.substr(0,1) == "=") {
							tempValue = this.getMathProcessor().parse(tempValue.substr(1));
						}
					}
					valuesUndoRedo[i][f] = {oldValue: model.getValue(i, f), col: i, row: f};
					values[i].push({value: tempValue, realValue: model.getValue(i, f), row: f});
				}
			}

			// Then we sort every column
			for (var i = firstCol; i <= lastCol; ++i) {
				values[i].sort(order);
				for (var f = 0; f < values[i].length; ++f) {
					model.setValue(i, firstRow + f, values[i][f].realValue);
					// Due to our array is sorted we add the value to valuesUndoRedo
					valuesUndoRedo[i][firstRow + f].value = values[i][f].realValue;
				}
			}

			return valuesUndoRedo;
		},
		
		basename: function(path, suffix) {
			var b = path.replace(/^.*[\/\\]/g, '');
			if (typeof(suffix) == 'string' && b.substr(b.length-suffix.length) == suffix) {
				b = b.substr(0, b.length-suffix.length);
			}

			return b;
		}
	}
});