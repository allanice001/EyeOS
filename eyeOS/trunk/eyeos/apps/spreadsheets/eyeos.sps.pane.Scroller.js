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

qx.Class.define('eyeos.spreadsheet.pane.Scroller', {

	extend: qx.ui.table.pane.Scroller,

	construct : function(table) {
		this.base(arguments, table);
		var focusIndicator = this.getChildControl("focus-indicator");
		focusIndicator.setLayout(new qx.ui.layout.Canvas());
		var focusIndicatorSquare = new qx.ui.container.Composite(new qx.ui.layout.VBox(0)).set({
			width: 5,
			height: 5,
			backgroundColor: '#FF0000',
			draggable: true
		});

		focusIndicator.add(focusIndicatorSquare, { bottom: 0, right: 0});
		var border = new qx.ui.decoration.Single(2, 'solid', '#A0A0A0').set({ });
		focusIndicator.setDecorator(border);
	},

	members: {

		__lastClickedCell: null,
		__currentCell: null,

		_getClipper: function () {
			return this.__paneClipper;
		},

		_onMousedownHeader: function (e) {
			var pageX = e.getDocumentLeft();
			var col = this._getColumnForPageX(pageX);
			//this.getTable().getTableModel().setClickedHeader(true);

			this.getTable().getTableModel().setFirstSelectedCell({row: 0, col: col});
			this.getTable().getTableModel().setCurrentSelectedCell({row: this.getTable().getTableModel().getRowCount(), col: col});
			var scrollerArr = this.getTable()._getPaneScrollerArr();
			for (var i = 0; i < scrollerArr.length; ++i) {
				scrollerArr[i].getTablePane()._updateAllRows();
			}
			//this.getTable().getTableModel().setClickedHeader(false);
			this.base(arguments, e);
		},
		
		_onMousemoveHeader : function(e) {
			this.base(arguments, e);
		},

		__handleMoveColumn: function (pageX) {
			//return 0;
		},

		_onContextMenu : function(e) {
			var pageX = e.getDocumentLeft();
			var pageY = e.getDocumentTop();
			var row = this._getRowForPagePos(pageX, pageY);
			var col = this._getColumnForPageX(pageX);
			var model = this.getTable().getTableModel();

//			if (
//				this.getChildControl('focus-indicator').isHidden() ||
//				(this.__lastMouseDownCell &&
//					row == this.__lastMouseDownCell.row &&
//					col == this.__lastMouseDownCell.col
//					))
//					{
				this.__lastMouseDownCell = {};
				this.fireEvent("cellContextmenu",
					qx.ui.table.pane.CellEvent,
					[this, e, row, col],
					true);

				// Now that the cellContextmenu handler has had a chance to build
				// the menu for this cell, display it (if there is one).
				var menu = this.getTable().getContextMenu();
				if (menu)
				{
					// A menu with no children means don't display any context menu
					// including the default context menu even if the default context
					// menu is allowed to be displayed normally. There's no need to
					// actually show an empty menu, though.
					if (menu.getChildren().length > 0)
					{
						menu.placeToMouse(e);
						menu.show();
					}
					else
					{
						menu.exclude();
					}

					// Do not show native menu
					e.preventDefault();
				}
//			}
		},

		_onMousedownPane : function(e) {
//			var element = pane.getContentElement().getDomElement();
			var pageX = e.getDocumentLeft();
			var pageY = e.getDocumentTop();
			var row = this._getRowForPagePos(pageX, pageY);
			var col = this._getColumnForPageX(pageX);
			var event = e._native;
//			var renderedRow = row - pane.getFirstVisibleRow();
//			var cell = element.childNodes[0].childNodes[renderedRow].childNodes[col-1];
//			cell.style.backgroundColor = '#E0E0E0';

			var model = this.getTable().getTableModel();

			if (col != 0) {
				if (model.getValue(col, row) != undefined) {
					if (model.getValue(col, row).toString() != 'NaN') {
						this.getTable().getApplication()._windowHeaderFormulaBox.setValue(model.getValue(col, row).toString());
					} else {
						this.getTable().getApplication()._windowHeaderFormulaBox.setValue(null);
					}
				} else {
					this.getTable().getApplication()._windowHeaderFormulaBox.setValue(null);
				}
				//console.log(this.getTable().getApplication());
				model.setMouseSelectingRange(true);
				model._firstPoint = [event.pageX - event.layerX, event.pageY - event.layerY];
				model._lastPoint = [model._firstPoint[0] + parseInt(event.target.style.width.substring(-2)), model._firstPoint[1] + parseInt(event.target.style.height.substring(-2))];
				model.setFirstSelectedCell({row: row, col: col});
				model.setCurrentSelectedCell({row: row, col: col});
				var currentSelection = model.getCurrentSelection();
				var firstLetter = model._letters[currentSelection[2]];
				this.getTable().getApplication()._windowHeaderSelectionBox.setValue(firstLetter+(currentSelection[0]+1));
			}

			this.base(arguments, e);
		},

		_onMousemovePane : function(e) {

			this.hideColumnMoveFeedback();

			var table = this.getTable();
			
			if (!table.getEnabled()) {
				return;
			}

			var pageX = e.getDocumentLeft();
			var pageY = e.getDocumentTop();

			this.__lastMousePageX = pageX;
			this.__lastMousePageY = pageY;

			var model = this.getTable().getTableModel();
			var row = this._getRowForPagePos(pageX, pageY);
			var col = this._getColumnForPageX(pageX);

			if (model.getMouseSelectingRange() && col != 0) {

				//console.log(pageX, pageY);
				var currentCell = model.getCurrentSelectedCell();
				//console.log(currentCell.row);
				//console.log(row);

				//console.log(this.getTable().getTableColumnModel().getColumnWidth(col));
				if (row != currentCell.row || col != currentCell.col) {
					
					model.setCurrentSelectedCell({row: row, col: col});
					var currentSelection = model.getCurrentSelection();
					var firstLetter = model._letters[currentSelection[2]];
					var lastLetter = model._letters[currentSelection[3]];

					this.getTable().getApplication()._windowHeaderSelectionBox.setValue(firstLetter+(currentSelection[0]+1)+" x "+lastLetter+(currentSelection[1]+1));

					var scrollerArr = this.getTable()._getPaneScrollerArr();
					for (var i = 0; i < scrollerArr.length; ++i) {
						scrollerArr[i].getTablePane()._updateAllRows();
					}

					// Scroll Part (content is automatically scrolled vertically when you reach the last visible row
					var visibleRows = this.getTablePane().getVisibleRowCount();
					var firstVisibleRow = this.getTablePane().getFirstVisibleRow();

					var renderedRow = row - firstVisibleRow;
					if (renderedRow == visibleRows - 1) {
						this.setScrollY(this.getScrollY() + 50);
					}

					if (renderedRow == 0) {
						this.setScrollY(this.getScrollY() - 50);
					}
				}
			}
		},

		_onMouseupPane: function (e) {
			var event = e._native;
			var pageX = e.getDocumentLeft();
			var pageY = e.getDocumentTop();
			var focusIndicator = this.getChildControl('focus-indicator');
			var model = this.getTable().getTableModel();
			model._lastPoint = [event.pageX + event.layerX, event.pageY + event.layerY];
			this.base(arguments, e);
//			if (focusIndicator.isVisible()) {
//				var bounds = focusIndicator.getBounds();
//				var tempFirstPoint = [event.pageX - event.layerX, event.pageY - event.layerY];
//				model._lastPoint = [tempFirstPoint[0] + parseInt(event.originalTarget.style.width.substring(-2)) + 15, tempFirstPoint[1] + parseInt(event.originalTarget.style.height.substring(-2)) + 2];
//				var first = model._firstPoint;
//				var last = model._lastPoint;
//				focusIndicator.renderLayout(bounds.left, bounds.top, last[0] - first[0], last[1] - first[1]);
//			}
		},

		_onClickPane : function(e) {
			var model = this.getTable().getTableModel();
			model.setMouseSelectingRange(false);
//			if (e._native.button == 2) {
//				model._context = true;
//			}
//			if (!model._context) {
//				if (!model.getClicked()) {
//					model.resetSelection();
//				}
//			}
			this.base(arguments, e);
		},

		startEditing : function()
		{
			var table = this.getTable();
			var tableModel = table.getTableModel();
			var col = this.getFocusedColumn();

			if (
				!this.isEditing() &&
				(col != null) &&
				tableModel.isColumnEditable(col)
				) {
				var row = this.getFocusedRow();
				var xPos = this.getTablePaneModel().getX(col);
				var value = tableModel.getValue(col, row);

				this.__cellEditorFactory = table.getTableColumnModel().getCellEditorFactory(col);

				var cellInfo =
				{
					col   : col,
					row   : row,
					xPos  : xPos,
					value : value,
					table : table
				};

				// Get a cell editor
				this.__cellEditor = this.__cellEditorFactory.createCellEditor(cellInfo);

				// We handle two types of cell editors: the traditional in-place
				// editor, where the cell editor returned by the factory must fit in
				// the space of the table cell; and a modal window in which the
				// editing takes place.  Additionally, if the cell editor determines
				// that it does not want to edit the particular cell being requested,
				// it may return null to indicate that that cell is not editable.
				if (this.__cellEditor === null)
				{
					// This cell is not editable even though its column is.
					return false;
				}
				else if (this.__cellEditor instanceof qx.ui.window.Window)
				{
					// It's a window.  Ensure that it's modal.
					this.__cellEditor.setModal(true);

					// At least for the time being, we disallow the close button.  It
					// acts differently than a cellEditor.close(), and invokes a bug
					// someplace.  Modal window cell editors should provide their own
					// buttons or means to activate a cellEditor.close() or equivalently
					// cellEditor.hide().
					this.__cellEditor.setShowClose(false);

					// Arrange to be notified when it is closed.
					this.__cellEditor.addListener(
						"close",
						this._onCellEditorModalWindowClose,
						this);

					// If there's a pre-open function defined for the table...
					var f = table.getModalCellEditorPreOpenFunction();
					if (f != null) {
						f(this.__cellEditor, cellInfo);
					}

					// Open it now.
					this.__cellEditor.open();
				}
				else
				{
					// The cell editor is a traditional in-place editor.
					var size = this.getChildControl('focus-indicator').getInnerSize();
					this.__cellEditor.setUserBounds(0, 0, size.width, size.height);
					// prevent click event from bubbling up to the table
					this.getChildControl('focus-indicator').addListener("mousedown", function(e) {
						e.stopPropagation();
					});
					this.getChildControl('focus-indicator').add(this.__cellEditor);
					this.getChildControl('focus-indicator').addState("editing");
					this.getChildControl('focus-indicator').setKeepActive(false);

					this.__cellEditor.focus();
					this.__cellEditor.activate();
				}

				return true;
			}

			return false;
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


		flushEditor : function()
		{
			if (this.isEditing())
			{
				var value = this.__cellEditorFactory.getCellEditorValue(this.__cellEditor);
				var oldValue = this.getTable().getTableModel().getValue(this.getFocusedColumn(), this.getFocusedRow());
				
				this.getTable().getTableModel().setValue(this.getFocusedColumn(), this.getFocusedRow(), value);
				this.getTable().focus();

				// Fire an event containing the value change.
				this.getTable().fireDataEvent("dataEdited",
				{
					row      : this.getFocusedRow(),
					col      : this.getFocusedColumn(),
					oldValue : oldValue,
					value    : value
				});
			}
		},

		isEditing : function() {
			return this.__cellEditor != null;
		},

		stopEditing : function()
		{
			this.flushEditor();
			this.getTable().getTableModel().setMouseSelectingRange(false);
			var model =this.getTable().getTableModel();
			var col = this.getTable().getFocusedColumn();
			var row = this.getTable().getFocusedRow();
			if (model.getValue(col, row) != undefined) {
				if (model.getValue(col, row).toString() != 'NaN') {
					this.getTable().getApplication()._windowHeaderFormulaBox.setValue(model.getValue(col, row).toString());
				} else {
					this.getTable().getApplication()._windowHeaderFormulaBox.setValue(null);
				}
			} else {
				this.getTable().getApplication()._windowHeaderFormulaBox.setValue(null);
			}
			this.cancelEditing();
		},

		cancelEditing : function()
		{
			if (this.isEditing() && ! this.__cellEditor.pendingDispose)
			{
				if (this._cellEditorIsModalWindow)
				{
					this.__cellEditor.destroy();
					this.__cellEditor = null;
					this.__cellEditorFactory = null;
					this.__cellEditor.pendingDispose = true;
				}
				else
				{
					this.getChildControl('focus-indicator').removeState("editing");
					this.getChildControl('focus-indicator').setKeepActive(true);
//					console.log(this.__cellEditor.ed);
//					//var ed = this.__cellEditor.ed;
////					this.__cellEditor.ed.remove();
////					this.__cellEditor.ed.remove();
//					tinymce.EditorManager.remove(this.__cellEditor.ed.id);
////					this.__cellEditor.ed.destroy();
//					console.log(this.__cellEditor.ed);

//					this.__cellEditor.ed.onRemove.add( function (ed) {
//						console.log('me han quitado');
//					});
					this.__cellEditor.destroy();
					this.__cellEditor = null;
					this.__cellEditorFactory = null;
				}
			}
		}
	}
});