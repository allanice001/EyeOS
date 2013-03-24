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
 * GroupTag is an object that show a simple label with the tame of the tag
 * and an icon to delete it from Layout
 */

qx.Class.define('eyeos.ui.tabs.GroupTag', {
	extend: qx.ui.basic.Atom,

	properties: {
		name: {
			check: 'String'
		},
		window: {
			
		}
	},

	construct: function (name, window) {
		this.base(arguments, '<b>' + name + '</b>', 'index.php?extern=/images/clear.png');
		this.setName(name);
		this.setWindow(window);
		this.set({
			backgroundColor: '#516074',
			font: new qx.bom.Font(12, ['Helvetica', 'Arial']),
			textColor: 'white',
			rich: true,
			height: 20,
			allowGrowY: false,
			show: 'label',
			marginRight: 5,
			marginBottom: 5,
			padding: 2,
			paddingLeft: 4,
			iconPosition: 'right'
		});
		this.setUserData('firstAppear', true);
		this._addMyListeners();
	},

	members: {
		_addMyListeners: function () {
			this.addListener('mouseover', function (e) {
				this.setShow('both');
			});
			this.addListener('mouseout', function (e) {
				this.setShow('label');
			});

			this.addListener('appear', function (e) {
				if(this.getUserData('firstAppear')) {
					var myWidth = this.getBounds().width;
					this.set({
						width: myWidth + 14,
						allowGrowX: false
					});
					this.setUserData('firstAppear', false);
				}
			});

			this.addListener('click', function (e) {
				if (e.getOriginalTarget().toString() == '[object HTMLDivElement]') {
					this.getWindow().fireDataEvent('destroyTag', this.getName());
					this.destroy();
				}
			}, this);
		}
	}
});