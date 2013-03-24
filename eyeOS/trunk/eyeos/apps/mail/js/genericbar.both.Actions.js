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
 *	Implementing {@see eyeos.ui.menubar.IActions}.
 */
qx.Class.define("genericbar.both.Actions", {
	extend: qx.core.Object,
	implement : [eyeos.ui.genericbar.IActions],

	construct: function(window, checknum, pid, application) {
		arguments.callee.base.call(this);
		this.setWindow(window);
		this.setChecknum(checknum);
		this.setApplication(application);
		this.setPid(pid);
	},

	properties: {
		window: {
			init: null,
			check: 'eyeos.ui.Window'
		},

		checknum: {
			init: null
		},

		pid: {
			init: null
		},

		application: {
			init: null
		},

		treeContainer: {
			init: null
		},

		listMailContainer: {
			init: null
		},

		table: {
			init: null
		}
	},

	members: {
		// toolbar functions...
		showMenuTags: function(e) {
			var tags = new eyeos.applications.mail.TagsWindow(this.getChecknum(), this.getListMailContainer(), e.getTarget());
			tags.open();
		},

		// File Menu Functions...
		fileGetMail: function() {
			__syncFolders(this.getChecknum(), this.getTreeContainer(), this.getListMailContainer());
			eyeos.callMessage(this.getChecknum(), 'getNewMails', null, function () {
			}, null, {timeout: 0});
		},

		fileNewMail: function(e, from, to, subject, body) {
			var newMail = new eyeos.applications.mail.NewMailWindow(this.getPid(), this.getChecknum(), this.getListMailContainer(), e.getTarget());
			newMail.open(from, to, subject, body);
		},

		fileAttachFile: function(e) {
//					console.log('fileAttachFile: ' + e.getTarget().getLabel());
		},

		fileSaveAttachments: function(e) {
//					console.log('fileSaveAttachments: ' + e.getTarget().getLabel());
		},

		filePrint: function(e) {
//					console.log('filePrint: ' + e.getTarget().getLabel());
		},

		// Edit Menu Functions...
		editUndo: function(e) {
//					console.log('editUndo: ' + e.getTarget().getLabel());
		},

		editRedo: function(e) {
//					console.log('editRedo: ' + e.getTarget().getLabel());
		},

		editCopy: function(e) {
//					console.log('editCopy: ' + e.getTarget().getLabel());
		},

		editCut: function(e) {
//					console.log('editCut: ' + e.getTarget().getLabel());
		},

		editPaste: function(e) {
//					console.log('editPaste: ' + e.getTarget().getLabel());
		},

		editSelect: function(e) {
//					console.log('editSelect: ' + e.getTarget().getLabel());
		},

		// Tools Menu Functions...
		addNewAccount: function(e) {
			var newAccount = new eyeos.applications.mail.NewAccountWindow(this.getChecknum());
			newAccount.getAccountObject().addListener('accountCreated', function() {
				this.updateTree();
			}, this);
		},

		updateTree: function() {
			__createTree(this.getChecknum(), this.getTreeContainer(), this.getListMailContainer(), this.getTable());
		},

		accountsSettings: function() {
			new eyeos.applications.mail.AccountSettingsWindow(this.getChecknum(), this);
		},

		moveToTrash: function() {
			var id = this.getTable().getTable().getSelectionModel().getSelectedRanges()[0].minIndex;
			var params = this.getTable().getTableModel().getRowData(id).id;
			eyeos.callMessage(this.getChecknum(), 'sendConversationToTrash', params, function() {
			}, this);
		}
	}
});
