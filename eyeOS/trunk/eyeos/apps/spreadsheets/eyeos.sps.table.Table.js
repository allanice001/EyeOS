qx.Class.define('eyeos.spreadsheet.table.Table', {

	extend: qx.ui.table.Table,

	construct: function (model, custom) {
		this.base(arguments, model, custom);
	},

	properties: {
		application: {
			check: 'Object'
		}
	},

	members: {
		updateContent: function() {
			this.base(arguments);
		},

		customUpdate: function () {
			// Update all scroller panes
			var scrollerArr = this._getPaneScrollerArr();
			for (var i = 0; i < scrollerArr.length; ++i) {
				scrollerArr[i].getTablePane()._updateAllRows();
			}
		},

		setFocusedCell : function(col, row, scrollVisible) {
			this.base(arguments, col, row, scrollVisible);
			this.getTableModel().setFirstSelectedCell({row: row, col: col});
			this.getTableModel().setCurrentSelectedCell({row: row, col: col});
			var currentSelection = this.getTableModel().getCurrentSelection();
			var firstLetter = this.getTableModel()._letters[currentSelection[2]];
			this.getApplication()._windowHeaderSelectionBox.setValue(firstLetter+(currentSelection[0]+1));
			if (this.getTableModel().getValue(currentSelection[2], currentSelection[0]) != undefined) {
				if (this.getTableModel().getValue(currentSelection[2], currentSelection[0]).toString() != 'NaN') {
					this.getApplication()._windowHeaderFormulaBox.setValue(this.getTableModel().getValue(currentSelection[2], currentSelection[0]).toString());
				} else {
					this.getApplication()._windowHeaderFormulaBox.setValue(null);
				}
			}
			this.customUpdate();
		},

		_onKeyPress : function(evt)
		{
			if (!this.getEnabled()) {
				return;
			}

			// No editing mode
			var oldFocusedRow = this.__focusedRow;
			var consumed = true;

			// Handle keys that are independent from the modifiers
			var identifier = evt.getKeyIdentifier();

			if (this.isEditing())
			{
				// Editing mode
				if (evt.getModifiers() == 0)
				{
					switch(identifier)
					{
						case "Enter":
							this.stopEditing();
							var oldFocusedRow = this.__focusedRow;
							//this.moveFocusedCell(0, 1);

							if (this.__focusedRow != oldFocusedRow) {
								consumed = this.startEditing();
							}

							break;

						case "Escape":
							this.cancelEditing();
							this.focus();
							break;

						default:
							consumed = false;
							break;
					}
				}
				return
			}
			else
			{
				// No editing mode
				if (evt.isCtrlPressed())
				{
					// Handle keys that depend on modifiers
					consumed = true;

					switch(identifier)
					{
						case "A": // Ctrl + A
							var rowCount = this.getTableModel().getRowCount();

							if (rowCount > 0) {
								this.getSelectionModel().setSelectionInterval(0, rowCount - 1);
							}

							break;

						default:
							consumed = false;
							break;
					}
				}
				else
				{
					// Handle keys that are independent from the modifiers
					switch(identifier)
					{
						case "Space":
							this.__selectionManager.handleSelectKeyDown(this.__focusedRow, evt);
							break;

						case "F2":
						case "Enter":
							consumed = this.startEditing();
							break;

						case "Home":
							this.setFocusedCell(this.__focusedCol, 0, true);
							break;

						case "End":
							var rowCount = this.getTableModel().getRowCount();
							this.setFocusedCell(this.__focusedCol, rowCount - 1, true);
							break;

						case "Left":
							this.stopEditing();
							this.moveFocusedCell(-1, 0);
							break;

						case "Right":
							this.stopEditing();
							this.moveFocusedCell(1, 0);
							break;

						case "Up":
							this.stopEditing();
							this.moveFocusedCell(0, -1);
							break;

						case "Down":
							this.stopEditing();
							this.moveFocusedCell(0, 1);
							break;

						case "PageUp":
						case "PageDown":
							var scroller = this.getPaneScroller(0);
							var pane = scroller.getTablePane();
							var rowCount = pane.getVisibleRowCount() - 1;
							var rowHeight = this.getRowHeight();
							var direction = (identifier == "PageUp") ? -1 : 1;
							scroller.setScrollY(scroller.getScrollY() + direction * rowCount * rowHeight);
							this.moveFocusedCell(0, direction * rowCount);
							break;

						default:
							consumed = this.startEditing();
							break;
					}
				}
			}

			if (oldFocusedRow != this.__focusedRow &&
				this.getRowFocusChangeModifiesSelection())
				{
				// The focus moved -> Let the selection manager handle this event
				this.__selectionManager.handleMoveKeyDown(this.__focusedRow, evt);
			}

			if (consumed)
			{
				evt.preventDefault();
				evt.stopPropagation();
			}
		}
	}
});


