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

qx.Class.define('eyeos.spreadsheet.pane.Pane', {

	extend: qx.ui.table.pane.Pane,

	construct: function (scroller) {
		this.base(arguments, scroller);
	},

	members: {
		_scrollContent: function (rowOffset) {
			this.base(arguments, rowOffset);
		},

		_getRowsHtml: function (firstRow, rowCount) {
			//console.log('getRowsHTML');
			var table = this.getTable();
			
			var currentSelection = table.getTableModel().getCurrentSelection();
			var selectionModel = table.getSelectionModel();
			var tableModel = table.getTableModel();
			var columnModel = table.getTableColumnModel();
			var paneModel = this.getPaneScroller().getTablePaneModel();
			var rowRenderer = table.getDataRowRenderer();

			tableModel.prefetchRows(firstRow, firstRow + rowCount - 1);

			var rowHeight = table.getRowHeight();
			var colCount = paneModel.getColumnCount();
			var left = 0;
			var cols = [];

			// precompute column properties
			for (var x=0; x<colCount; x++) {
				var col = paneModel.getColumnAtX(x);
				var cellWidth = columnModel.getColumnWidth(col);
				cols.push({
					col: col,
					xPos: x,
					editable: tableModel.isColumnEditable(col),
					focusedCol: this.__focusedCol == col,
					styleLeft: left,
					styleWidth: cellWidth
				});

				left += cellWidth;
			}

			var rowsArr = [];
			var paneReloadsData = false;
			for (var row=firstRow; row < firstRow + rowCount; row++) {
				var selected = selectionModel.isSelectedIndex(row);
				var focusedRow = (this.__focusedRow == row);

				var rowHtml = [];

				var cellInfo = {
					table : table
				};
				
				cellInfo.styleHeight = rowHeight;

				cellInfo.row = row;
				cellInfo.selected = selected;
				cellInfo.focusedRow = focusedRow;
				cellInfo.rowData = tableModel.getRowData(row);

				if (!cellInfo.rowData) {
					paneReloadsData = true;
				}

				rowHtml.push('<div ');

				var rowClass = rowRenderer.getRowClass(cellInfo);
				if (rowClass) {
					rowHtml.push('class="', rowClass, '" ');
				}

				var rowStyle = rowRenderer.createRowStyle(cellInfo);
				rowStyle += ";position:relative;" + rowRenderer.getRowHeightStyle(rowHeight)+ "width:100%;";
				if (rowStyle) {
					rowHtml.push('style="', rowStyle, '" ');
				}
				rowHtml.push('>');

				for (var x=0; x<colCount; x++)
				{
					var col_def = cols[x];
					for (var attr in col_def) {
						cellInfo[attr] = col_def[attr];
					}

					if (currentSelection != undefined && currentSelection[0] != undefined
						&& currentSelection[0] <= cellInfo.row && currentSelection[1] >= cellInfo.row
						&& currentSelection[2] <= cellInfo.col && currentSelection[3] >= cellInfo.col) {
						cellInfo.inSelection = true;
					} else {
						cellInfo.inSelection = false;
					}

					var col = cellInfo.col;

//					graphicCharts.forEach(function () {
//						if (this.indexOf(row) != -1 && this.indexOf(col) != -1) {
//							console.log('buh');
//						}
//					});

//					console.log(graphicCharts.length);

					if (cols[x].col == 0) {
						cellInfo.style = 'background-color: #909090';
						cellInfo.attributes = "onmouseover='this.style.backgroundColor = \"#FF0000\";' onmousemove='(function () { if (event.layerY <= 5) { event.originalTarget.style.cursor = \"n-resize\"; } else { event.originalTarget.style.cursor = \"default\"; } })();' onmouseout='this.style.backgroundColor = \"#909090\";'"
					} else {
						cellInfo.style = '';
						cellInfo.attributes = '';
					}

					// AB: use the "getValue" method of the tableModel to get the cell's value
					// working directly on the "rowData" object (-> cellInfo.rowData[col];) is not a solution
					// because you can't work with the columnIndex -> you have to use the columnId of the columnIndex
					// This is exactly what the method "getValue" does
					cellInfo.value = tableModel.getValue(col, row);
					var cellRenderer = columnModel.getDataCellRenderer(col);
					cellRenderer.createDataCellHtml(cellInfo, rowHtml);
				}
				rowHtml.push('</div>');

				var rowString = rowHtml.join("");
				rowsArr.push(rowString);

			}
			
			//if (elem.style.width == "2600px") {
				var graphicCharts = tableModel._getCharts();
				for (var f = 0; f < graphicCharts.length; ++f) {
					rowsArr.unshift("<div style='position: absolute; display: block; left: 10px; top: 10px; background-color: #FFFFFF; z-index: 100' id='imgscrollable'><img src='index.php/msg/" + this.getTable().getApplication().getChecknum() + "/getImage/" + graphicCharts[f].graphic +"style='z-index: 1000' /></div><script>Drag.init(document.getElementById('imgscrollable'), null, 0, 1024, 0, 768);</script>");
					f = graphicCharts.length + 1;
				}
			//}
			//console.log(rowsArr.join(""));
			this.fireDataEvent("paneReloadsData", paneReloadsData);
			return rowsArr.join("");
		},

		_updateRowStyles: function (onlyRow) {
			this.base(arguments, onlyRow);
		},

		_updateAllRows : function() {
			var elem = this.getContentElement().getDomElement();
			var elem2 = this.getContainerElement().getDomElement();
			if (!elem) {
				// pane has not yet been rendered
				this.addListenerOnce("appear", arguments.callee, this);
				return;
			}

			var table = this.getTable();

			var tableModel = table.getTableModel();
			var paneModel = this.getPaneScroller().getTablePaneModel();

			var colCount = paneModel.getColumnCount();
			var rowHeight = table.getRowHeight();
			var firstRow = this.getFirstVisibleRow();

			var rowCount = this.getVisibleRowCount();
			var modelRowCount = 0;

			if (tableModel != null) {
				modelRowCount = tableModel.getRowCount();
			}

			if (firstRow + rowCount > modelRowCount) {
				rowCount = Math.max(0, modelRowCount - firstRow);
			}

			var rowWidth = paneModel.getTotalWidth();
			var htmlArr;

			// If there are any rows...
			if (rowCount > 0)
			{
				// ... then create a div for them and add the rows to it.
				htmlArr =
				[
				"<div style='",
				"width: 100%;",
				(table.getForceLineHeight()
					? "line-height: " + rowHeight + "px;"
					: ""),
				"overflow: hidden;",
				"'>",
				this._getRowsHtml(firstRow, rowCount),
				"</div>"
				];
			}
			else
			{
				// Otherwise, don't create the div, as even an empty div creates a
				// white row in IE.
				htmlArr = [ ];
			}

			var data = htmlArr.join("");
			//this.debug(">>>" + data + "<<<")
			elem.innerHTML = data;
			
			this.setWidth(rowWidth);

			this.__lastColCount = colCount;
			this.__lastRowCount = rowCount;
		}
	}
});


