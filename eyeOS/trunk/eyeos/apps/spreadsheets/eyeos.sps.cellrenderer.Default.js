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

qx.Class.define('eyeos.spreadsheet.cellrenderer.Default', {

	extend: qx.ui.table.cellrenderer.Html,

	construct: function (model, table) {
		this.base(arguments);
		this._model = model;
		this._mathprocessor = new MathProcessor(table);
	},


	members: {

		_model: null,

		_getCellAttributes : function(cellInfo) {
			return cellInfo.attributes || "";
		},

		_getCellStyle : function(cellInfo) {

			if (cellInfo.style) {
				return cellInfo.style;
			}
			
			var style = {
				"text-align": 'left',
				"color": '#606060',
				"font-style": 'Lucida Grande, Verdana, Arial',
				"font-weight": 'normal'
			};

			var value = cellInfo.value;
			
			if (value == null) {
				return "";
			}

			if (typeof value == "string") {
				if (value.substr(0,1) == "=") {
					style['text-align'] = 'right';
				}
			} else if (typeof value == "number") {
				style['text-align'] = 'right';
			}

//			var styleString = [];
//			for(var key in style) {
//				if (style[key]) {
//					console.log(key);
//					styleString.push(key, ":", style[key], ";");
//				}
//			}
//			return styleString.join("");
		},
		
		createDataCellHtml: function(cellInfo, htmlArr) {
			var extra = '';
			var extra2 = '';
				
			if (cellInfo.inSelection) {
				extra += 'background-color: #E0E0E0';
			}

			if (cellInfo.col == 0) {
				cellInfo.style = 'background-color: #909090';
				cellInfo.attributes = "onmouseover='this.style.backgroundColor = \"#FF0000\";' onmousemove='(function () { if (event.layerY <= 5) { event.originalTarget.style.cursor = \"n-resize\"; } else { event.originalTarget.style.cursor = \"default\"; } })();' onmouseout='this.style.backgroundColor = \"#909090\";' onclick=''"
			} else {
				cellInfo.style = '';
				cellInfo.attributes = '';
			}

//			if (cellInfo.graphic != null) {
//				var styleLeft = cellInfo.styleLeft;
//				htmlArr.push('<div style=\'position: absolute; display: block; width: 500px: height: 300px; background-color: #FF00FF; left: 50px; top: 50px\'>HOLLAAAAAA</div>');
//			}

//			if (this._model.getCellStyle(cellInfo.row, cellInfo.col)) {
//				extra = this._model.getCellStyle(cellInfo.row, cellInfo.col);
//			}
			var value = cellInfo.value;
			if ((!isNaN(value) && value != '') || (typeof(value) == 'string' && value.substr(0,1) == "=")) {
				extra2 = ' qooxdoo-table-cell-right';
			}

			htmlArr.push(
				'<div class="',
				this._getCellClass(cellInfo),
				extra2,
				'" style="',
				'left:', cellInfo.styleLeft, 'px;',
				this._getCellSizeStyle(cellInfo.styleWidth, cellInfo.styleHeight, this._insetX, this._insetY),
				extra,
				this._getCellStyle(cellInfo), '" ',
				this._getCellAttributes(cellInfo),
				'>' +
				this._formatValue(cellInfo),
				'</div>'
			);

		},

		_formatValue : function(cellInfo)
		{
			
			var value = cellInfo.value;
			
			if (value == null || value == undefined || value.toString() == 'NaN') {
				return "";
			}

			if (typeof value == "string") {
				
				if (value.substr(0,1) == "=") {
					//console.log(value);
					var tmp = {};
					try {
						tmp.value = this._mathprocessor.parse(value.substr(1));
					} catch (e) {
						tmp.value = 'Formula Error:' + e;
					}
					return this._formatValue(tmp);
				} else {
					return value;
				}
			}
			else if (typeof value == "number")
			{
				if (!qx.ui.table.cellrenderer.Default._numberFormat) {
					qx.ui.table.cellrenderer.Default._numberFormat = new qx.util.format.NumberFormat();
					qx.ui.table.cellrenderer.Default._numberFormat.setMaximumFractionDigits(10);
				}
				var res = qx.ui.table.cellrenderer.Default._numberFormat.format(value);
			}
			else if (value instanceof Date)
			{
				res = qx.util.format.DateFormat.getDateInstance().format(value);
			}
			else
			{
				res = value;
			}

			return res;
		},

		getModel: function () {
			return this._model;
		},

		setModel: function (model) {
			this._model = model;
		}
	}
});


