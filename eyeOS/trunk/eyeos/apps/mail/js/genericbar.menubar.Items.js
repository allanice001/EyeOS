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
qx.Class.define('genericbar.menubar.Items', {
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
		items: [{
			name: 'File',
			id: 'File',
			subMenu: [{
				name: 'Get mail',
				id: 'Get mail',
				cmd: 'fileGetMail',
				image: 'getmail.png'
			}, {
				name: 'New mail',
				id: 'New mail',
				cmd: 'fileNewMail',
				image: 'newmail.png'
			}, {
				type: 'Separator'
			}, {
				name: 'Attach file',
				id: 'Attach file',
				image: 'mail-attachment.png',
				cmd: 'fileAttachFile'
			}, {
				name: 'Save attachments',
				id: 'Save attachments',
				cmd: 'fileSaveAttachments'
			}, {
				type: 'Separator'
			}, {
				name: 'Print mail',
				id: 'Print mail',
				image: 'document-print.png',
				cmd: 'filePrint'
			}]
		}, {
			name: 'Edit',
			id: 'Edit',
			subMenu: [{
				name: 'Undo',
				id: 'Undo',
				image: 'edit-undo.png',
				cmd: 'editUndo'
			}, {
				name: 'Redo',
				id: 'Redo',
				image: 'edit-redo.png',
				cmd: 'editRedo'
			}, {
				type: 'Separator'
			}, {
				name: 'Copy',
				id: 'Copy',
				image: 'edit-copy.png',
				cmd: 'editCopy'
			}, {
				name: 'Cut',
				id: 'Cut',
				image: 'edit-cut.png',
				cmd: 'editCut'
			}, {
				name: 'Paste',
				id: 'Paste',
				image: 'edit-paste.png',
				cmd: 'editPaste'
			},{
				type: 'Separator'
			}, {
				name: 'Select',
				id: 'Select',
				image: 'task-complete.png',
				subMenu: [{
					name: 'All',
					id: 'All',
					image: 'task-complete.png',
					type: 'CheckBox',
					cmd: 'editSelect'
				}, {
					name: 'None',
					id: 'None',
					image: 'task-complete.png',
					type: 'CheckBox',
					cmd: 'editSelect'
				}, {
					name: 'Starred',
					id: 'Starred',
					image: 'task-complete.png',
					type: 'CheckBox',
					cmd: 'editSelect'
				}, {
					name: 'Unstarred',
					id: 'Unstarred',
					image: 'task-complete.png',
					type: 'CheckBox',
					cmd: 'editSelect'
				}, {
					name: 'Read',
					id: 'Read',
					image: 'task-complete.png',
					type: 'CheckBox',
					cmd: 'editSelect'
				}, {
					name: 'Unread',
					id: 'Unread',
					image: 'task-complete.png',
					type: 'CheckBox',
					cmd: 'editSelect'
				}]
			}]
		}, {
			name: 'Tools',
			id: 'Tools',
			subMenu: [{
				name: 'Accounts Settings',
				id: 'Accounts Settings',
				image: 'accounts.png',
				cmd: 'accountsSettings'
			}, {
				name: 'Add new Account...',
				id: 'Add new Account...',
				image: 'preferences-other.png',
				cmd: 'addNewAccount'
			}]
		}]
	}
});

