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

qx.Class.define('eyeos.spreadsheet.model.Simple', {

	extend: qx.ui.table.model.Simple,

	construct: function () {
		this.base(arguments);
		this._charts = new Array();
		this._letters = [' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	},

	properties: {
		firstSelectedCell: {
			check: 'Object',
			init: null
//			apply: '_applyFirstSelectedCell'
		},

		currentSelectedCell: {
			check: 'Object',
			init: null,
			apply: '_applyCurrentSelectedCell'
		},

		currentSelection: {
			check: 'Array',
			init: null
			//apply: '_applyCurrentSelection'
		},

		mouseSelectingRange: {
			check: 'Boolean',
			init: false
//			apply: '_applyMouseSelectingRange'
		},

		mouseContextMenu: {
			check: 'Boolean',
			init: false
//			apply: '_appplyMouseContextMenu'
		},

		table: {
			check: 'Object'
		}
	},

	members: {

		_charts: null,

		_setCharts: function (charts) {
			//console.log(charts);
			this._charts = charts;
		},

		_getCharts: function () {
			return this._charts;
		},

		_applyCurrentSelectedCell: function (newValue, oldValue) {

			var selected = new Array();
			var firstSelectedCell = this.getFirstSelectedCell();
			var currentSelectedCell = newValue;

			if (firstSelectedCell.row < currentSelectedCell.row) {
				selected.push(firstSelectedCell.row, currentSelectedCell.row);
			} else {
				selected.push(currentSelectedCell.row, firstSelectedCell.row);
			}

			if (firstSelectedCell.col < currentSelectedCell.col) {
				selected.push(firstSelectedCell.col, currentSelectedCell.col);
			} else {
				selected.push(currentSelectedCell.col, firstSelectedCell.col);
			}

			this.setCurrentSelection(selected);
		},

		createAndStoreChart: function (graphic) {
			var charts = this._getCharts();
			var range = this.getCurrentSelection();
			var lastRow = this.getCurrentSelectedCell().row;
			var lastCol = this.getCurrentSelectedCell().col;
			var newChart = {
				'range': range,
				'lastRow': lastRow,
				'lastCol': lastCol,
				'graphic': graphic
			};
			charts.push(newChart);
			this._setCharts(charts);
			this.getTable().customUpdate();
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

		setValue: function (columnIndex, rowIndex, value) {

			var defValue = null;

			if (!isNaN(value)) {
				defValue = parseFloat(value);
			} else {
				if (value != undefined && value.toString() != 'undefined') {
					defValue = value.toString();
				}
			}

			this.base(arguments, columnIndex, rowIndex, defValue);
			
		},

		getAlphaValue: function (value) {
			var letterEndFlag = false;
			var defValue = value.split("");
			var letters = new String();
			var numbers = new String();
			for (var f = 0; f < defValue.length; ++f) {
				if ((defValue[f] >= "a" && defValue[f] <= "z") || (defValue[f] >= "A" && defValue[f] <= "Z")) {
					if (!letterEndFlag) {
						letters += defValue[f];
					}
				}
				else if (defValue[f] >= "0" && defValue[f] <= "9") {
					if (!letterEndFlag) {
						letterEndFlag = true;
					}
					numbers += defValue[f];
				}
			}

			defValue = this.getValue(parseInt(this._letters.indexOf(letters.toUpperCase())), parseInt(numbers) - 1);
			
			if (isNaN(defValue)) {
				var p = new MathProcessor(this.getTable());
				var result = p.parse(defValue.substr(1));
				return result;
			}

			return defValue;
		},

		setCellStyle: function (row, column, style) {
			if (this._cellStyles[row] == undefined) {
				this._cellStyles[row] = new Array();
			}
			this._cellStyles[row][column] = style;

		},

		getCellStyle: function (row, column) {
			if (this._cellStyles[row] != undefined) {
				if (this._cellStyles[row][column] != undefined) {
					return this._cellStyles[row][column];
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	}
});


