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
 * The desktop panel
 */

qx.Class.define('desktop.Panel', {
	extend: qx.ui.EyePanel,

	construct: function () {
		arguments.callee.base.call(this);

		this._applyPanelStyle();
		this._createShowDesktopButton();
		this._createCascadeWindowsButton();
		this._createSeparator();
		this._createTaskBar();
		this._parseCurrentWindows();

		var self = this;

		document.eyeDesktop.addListener('windowAdded', function (data) {
			self._assignWindowEvents(data.getData());
		});
	},

	members: {
		_tags: null,
		_activeShowDesktop: false,
		_activeCascadeWindows: false,
		_cascadeWindowsButton: null,
		_acceptWindowEvents: true,
		_showDesktopButton: null,
		_taskBar: null,
		_decoratorSystemButton: null,
		_decoratorSystemButtonMouseOver: null,

		_assignWindowEvents: function (window) {
			var enableAcceptWindowEvents = function () {
				this._acceptWindowEvents = true;
			}

			document.eyeDesktop.addListener('cascadeWindowsComplete', enableAcceptWindowEvents, this);
			document.eyeDesktop.addListener('showDesktopComplete', enableAcceptWindowEvents, this);
			window.addListener('move', this._restoreButtonsState, this);
			window.addListener('resize', this._restoreButtonsState, this);
			//	window.addListener('minimize', this._restoreButtonsState, this);
			// 	window.addListener('restore', this._restoreButtonsState, this);
			//	TODO: it does not manages when a window changes his state from minimized to normal or maximized.
		},

		_applyPanelStyle: function () {
		 	// Decorators
			this._decoratorSystemButton = new qx.ui.decoration.RoundBorderBeveled(null, null, 1, 3, 3, 3, 3);

			this._decoratorSystemButtonMouseOver = new qx.ui.decoration.RoundBorderBeveled(null, null, 1, 3, 3, 3);
			this._decoratorSystemButtonMouseOver.setBackgroundColor('#accff0');

			var decoratorTaskBar = new qx.ui.decoration.Background().set({
				backgroundImage: 'index.php?extern=images/bgTaskBar.png'
				//backgroundRepeat: 'scale'
			});

			// Main style
			this.set({
				backgroundColor: '#202020',
				padding: 0,
				height: 38,
				maxHeight: 38,
				paddingLeft: 8,
				decorator: decoratorTaskBar
			});
		},

		_createSeparator: function () {
			var separator = new qx.ui.menu.Separator();

			separator.set({
				backgroundColor: '#6583BC',
				width: 2,
				maxWidth: 2,
				height: 29,
				maxHeight: 29,
				marginLeft: 8,
				marginRight: 8
			});

			this.add(separator);
		},

		_createCascadeWindowsButton: function () {
			this._cascadeWindowsButton = new qx.ui.form.ToggleButton('', 'index.php?extern=images/CascadeWindows.png');

			this._cascadeWindowsButton.set({
				focusable: false,
				keepFocus: true,
				padding: 0,
				height: 21,
				maxHeight: 21,
				width: 21,
				maxWidth: 21,
				decorator: this._decoratorSystemButton
			});

			var self = this;

			this._cascadeWindowsButton.addListener('click', function () {
				if (this.get('value')) {
					self._acceptWindowEvents = false;
					document.eyeDesktop.cascadeWindows();
					self._activeCascadeWindows = true;
				} else {
					document.eyeDesktop.restoreWindows();
					self._activeCascadeWindows = false;
				}
			});

			this._cascadeWindowsButton.addListener('mouseover', function () {
				this.set({
					decorator: self._decoratorSystemButtonMouseOver
				});
			});

			this._cascadeWindowsButton.addListener('mouseout', function () {
				this.set({
					decorator: self._decoratorSystemButton
				});
			});

			this.add(this._cascadeWindowsButton);
		},

		_createShowDesktopButton: function () {
			this._showDesktopButton = new qx.ui.form.ToggleButton('', 'index.php?extern=images/ShowDesktop.png');

			this._showDesktopButton.set({
				focusable: false,
				keepFocus: true,
				padding: 0,
				height: 21,
				maxHeight: 21,
				width: 21,
				maxWidth: 21,
				decorator: this._decoratorSystemButton,
				marginRight: 6
			});

			var self = this;

			this._showDesktopButton.addListener('click', function () {
				if (this.get('value')) {
					self._acceptWindowEvents = false;
					document.eyeDesktop.showDesktop();
					self._activeShowDesktop = true;
				} else {
					self._activeShowDesktop = false;
					document.eyeDesktop.restoreWindows();
				}
			});

			this._showDesktopButton.addListener('mouseover', function () {
				this.set({
					decorator: self._decoratorSystemButtonMouseOver
				});
			});

			this._showDesktopButton.addListener('mouseout', function () {
				this.set({
					decorator: self._decoratorSystemButton
				});
			});

			this.add(this._showDesktopButton);
		},

		_createTaskBar: function () {
			this._taskBar = new qx.ui.EyeTaskBar();
			this.add(this._taskBar);
		},

		_parseCurrentWindows: function () {
			var windowList = document.eyeDesktop.getWindows();

			for (var i = windowList.length - 1; i >= 0; --i) {
				this._assignWindowEvents(windowList[i]);
			}
		},

		_restoreButtonsState: function () {
			if (this._acceptWindowEvents) {
				this._cascadeWindowsButton.set('value', false);
				this._showDesktopButton.set('value', false);
			}
		}
	}
});