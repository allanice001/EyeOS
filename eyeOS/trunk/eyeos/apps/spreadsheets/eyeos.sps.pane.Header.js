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

qx.Class.define('eyeos.spreadsheet.pane.Header', {

	extend: qx.ui.table.pane.Header,

	construct: function (paneScroller) {
		this.base(arguments, paneScroller);
	},

	members: {
		setMouseOverColumn : function (col) {
			if (col != this.__lastMouseOverColumn) {
				
				if (this.__lastMouseOverColumn != null) {
					var widget = this.getHeaderWidgetAtColumn(this.__lastMouseOverColumn);
					if (widget != null) {
						widget.removeState('hovered');
					}
				}

				if (col != null) {
					this.getHeaderWidgetAtColumn(col).setCursor('move');
					this.getHeaderWidgetAtColumn(col).addState('hovered');
					this.getTable().getTableColumnModel().getHeaderCellRenderer(col);
				}
				
				this.__lastMouseOverColumn = col;
			}
		},

		showColumnMoveFeedback : function(col, x) {

		},

		_updateContent: function (completeUpdate) {
			  var tableModel = this.getTable().getTableModel();
			var columnModel = this.getTable().getTableColumnModel();
			var paneModel = this.getPaneScroller().getTablePaneModel();

			var children = this._getChildren();
			var colCount = paneModel.getColumnCount();

			var sortedColum = 0;

			if (tableModel != null) {
				sortedColum = tableModel.getSortColumnIndex();
			}

			// Remove all widgets on the complete update
			if (completeUpdate) {
				this._cleanUpCells();
			}

			// Update the header
			var cellInfo = {};
			cellInfo.sortedAscending = false;

			if(tableModel != null) {
				cellInfo.sortedAscending = tableModel.isSortAscending();
			}

			for (var x=0; x<colCount; x++)
			{
				var col = paneModel.getColumnAtX(x);

				var colWidth = columnModel.getColumnWidth(col);

				// TODO: Get real cell renderer
				var cellRenderer = columnModel.getHeaderCellRenderer(col);

				cellInfo.xPos = x;
				cellInfo.col = col;
				cellInfo.name = tableModel.getColumnName(col);
				cellInfo.editable = tableModel.isColumnEditable(col);
				//cellInfo.sorted = (col == sortedColum);

				// Get the cached widget
				var cachedWidget = children[x];

				// Create or update the widget
				if (cachedWidget == null)
				{
					// We have no cached widget -> create it
					cachedWidget = cellRenderer.createHeaderCell(cellInfo);

					cachedWidget.set(
					{
						width  : colWidth
					});

					this._add(cachedWidget);
				}
				else
				{
					// This widget already created before -> recycle it
					cellRenderer.updateHeaderCell(cellInfo, cachedWidget);
				}
			}
		}
	}
});