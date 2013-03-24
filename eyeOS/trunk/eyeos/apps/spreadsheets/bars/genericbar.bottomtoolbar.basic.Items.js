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
 *	Implementing {@see eyeos.ui.genericbar.IItems}.
 */
qx.Class.define('genericbar.bottomtoolbar.basic.Items', {
	extend : qx.core.Object,
	implement : [eyeos.ui.genericbar.IItems],

	construct: function() {
		arguments.callee.base.call(this);
		this.setItems(this.items);
	},

	properties: {
		items: {
			init: null
		}
	},

	members: {
		items:[{
			name: 'Format',
			id: 'Format',
			Group: [{
				name: 'Font',
				id: 'Font',
				type: 'SelectBox',
				subMenu: [{
					name: 'Arial',
					id: 'Arial',
					cmd: 'formatFont'
				}, {
					name: 'Arial Black',
					id: 'Arial Black',
					cmd: 'formatFont'
				}, {
					name: 'Book Antiqua',
					id: 'Book Antiqua',
					cmd: 'formatFont'
				}, {
					name: 'Comic Sans MS',
					id: 'Comic Sans MS',
					cmd: 'formatFont'
				}, {
					name: 'Courier',
					id: 'Courier',
					cmd: 'formatFont'
				}, {
					name: 'Courier New',
					id: 'Courier New',
					cmd: 'formatFont'
				}, {
					name: 'Geneva',
					id: 'Geneva',
					cmd: 'formatFont'
				}, {
					name: 'Georgia',
					id: 'Georgia',
					cmd: 'formatFont'
				}, {
					name: 'Helvetica',
					id: 'Helvetica',
					cmd: 'formatFont'
				}, {
					name: 'Lucida Console',
					id: 'Lucida Console',
					cmd: 'formatFont'
				}, {
					name: 'Lucida Grande',
					id: 'Lucida Grande',
					cmd: 'formatFont'
				}, {
					name: 'Lucida Sans Unicode',
					id: 'Lucida Sans Unicode',
					cmd: 'formatFont'
				}, {
					name: 'Monaco',
					id: 'Monaco',
					cmd: 'formatFont'
				}, {
					name: 'MS Serif',
					id: 'MS Serif',
					cmd: 'formatFont'
				}, {
					name: 'Palatino',
					id: 'Palatino',
					cmd: 'formatFont'
				}, {
					name: 'Tahoma',
					id: 'Tahoma',
					cmd: 'formatFont'
				}, {
					name: 'Times',
					id: 'Times',
					cmd: 'formatFont'
				}, {
					name: 'Times New Roman',
					id: 'Times New Roman',
					cmd: 'formatFont'
				}, {
					name: 'Trebuchet MS',
					id: 'Trebuchet MS',
					cmd: 'formatFont'
				}, {
					name: 'Verdana',
					id: 'Verdana',
					cmd: 'formatFont'
				}]
			}, {
				name: 'Size',
				id: 'Size',
				type: 'SelectBox',
				subMenu: [{
					name: '8',
					id: '8',
					cmd: 'formatSize'
				}, {
					name: '10',
					id: '10',
					cmd: 'formatSize'
				}, {
					name: '12',
					id: '12',
					cmd: 'formatSize'
				}, {
					name: '14',
					id: '14',
					cmd: 'formatSize'
				}, {
					name: '18',
					id: '18',
					cmd: 'formatSize'
				}, {
					name: '24',
					id: '24',
					cmd: 'formatSize'
				}, {
					name: '36',
					id: '36',
					cmd: 'formatSize'
				}]
			}, {
				name: 'ColorFormat',
				id: 'ColorFormat',
				image: 'txt-color_icon.png',
				type: 'ColorButton'
			}, {
				name: 'Type',
				id: 'Type',
				Group: [{
					name: 'Bold',
					id: 'Bold',
					image: 'format-text-bold.png',
					cmd: 'formatType',
					type: 'ToggleButton'
				}, {
					name: 'Italic',
					id: 'Italic',
					image: 'format-text-italic.png',
					cmd: 'formatType',
					type: 'ToggleButton'
				}, {
					name: 'Underline',
					id: 'Underline',
					image: 'format-text-underline.png',
					cmd: 'formatType',
					type: 'ToggleButton'
				}, {
					name: 'Strikethrough',
					id: 'Strikethrough',
					image: 'format-text-strikethrough.png',
					cmd: 'formatType',
					type: 'ToggleButton'
				}]
			}]
		}]
	}
});
