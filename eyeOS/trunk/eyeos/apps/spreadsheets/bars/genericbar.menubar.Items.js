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
				name: 'New',
				id: 'New',
				image: 'document-new.png',
				cmd: 'fileNew'
			}, {
				name: 'Open...',
				id: 'Open...',
				image: 'document-open-folder.png',
				cmd: 'fileOpen'
			}, {
				name: 'Open recent',
				id: 'Open recent',
				image: 'document-open-recent.png',
				cmd: 'dynamics'
			}, {
				type: 'Separator'
			}, {
				name: 'Save',
				id: 'Save',
				image: 'document-save.png',
				cmd: 'fileSave'
			}, {
				name: 'Save a copy',
				id: 'Save a copy',
				image: 'document-save-as.png',
				cmd: 'fileSaveAs'
			}, {
				name: 'Export',
				id: 'Export',
				image: 'document-export.png',
				subMenu: [{
					name: 'XLSX',
					id: 'XLSX',
					cmd: 'fileExport'
				}, {
					name: 'XLS',
					id: 'XLS',
					cmd: 'fileExport'
				}, {
					name: 'ODS',
					id: 'ODS',
					cmd: 'fileExport'
				}, {
					name: 'SXC',
					id: 'SXC',
					cmd: 'fileExport'
				}, {
					name: 'GNUMERIC',
					id: 'GNUMERIC',
					cmd: 'fileExport'
				}, {
					name: 'CSV',
					id: 'CSV',
					cmd: 'fileExport'
				}, {
					name: 'TSC',
					id: 'TSC',
					cmd: 'fileExport'
				}, {
					name: 'HTML',
					id: 'HTML',
					cmd: 'fileExport'
				}, {
					name: 'PDF',
					id: 'PDF',
					cmd: 'fileExport'
				}, {
					name: 'TXT',
					id: 'TXT',
					cmd: 'fileExport'
				}]
			}, {
				name: 'Import',
				id: 'Import',
				image: 'document-export.png',
				subMenu: [{
					name: 'XLSX',
					id: 'XLSX',
					cmd: 'fileImport'
				}, {
					name: 'XLS',
					id: 'XLS',
					cmd: 'fileImport'
				}, {
					name: 'SXC',
					id: 'SXC',
					cmd: 'fileImport'
				}, {
					name: 'ODS',
					id: 'ODS',
					cmd: 'fileImport'
				}, {
					name: 'CSV',
					id: 'CSV',
					cmd: 'fileImport'
				}, {
					name: 'TSV',
					id: 'TSV',
					cmd: 'fileImport'
				}]
			}, {
				type: 'Separator'
			}, {
				name: 'Document Infos',
				id: 'Document Infos',
				image: 'document-properties.png',
				cmd: 'fileDocumentInfos'
			}, {
				name: 'Preview',
				id: 'Preview',
				image: 'document-preview.png',
				cmd: 'filePreview'
			}, {
				name: 'Print',
				id: 'Print',
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
				name: 'Cut',
				id: 'Cut',
				image: 'edit-cut.png',
				cmd: 'editCut'
			}, {
				name: 'Copy',
				id: 'Copy',
				image: 'edit-copy.png',
				cmd: 'editCopy'
			}, {
				name: 'Paste',
				id: 'Paste',
				image: 'edit-paste.png',
				cmd: 'editPaste'
			}, {
				type: 'Separator'
			}, {
				name: 'Select all',
				id: 'Select all',
				image: 'edit-select-all.png',
				cmd: 'selectAll'
			}, {
				name: 'Clear',
				id: 'Clear',
				image: 'edit-clear.png',
				subMenu: [{
					name: 'All',
					id: 'All',
					image: 'edit-clear.png',
					cmd: 'clearAll'
				}, {
					name: 'Content',
					id: 'Content',
					image: 'edit-clear.png',
					cmd: 'clearContent'
				}, {
					name: 'Format',
					id: 'Format',
					image: 'edit-clear.png',
					cmd: 'clearFormat'
				}]
			}, {
				type: 'Separator'
			}, {
				name: 'Add',
				id: 'Add',
				image: 'Table-add.png',
				subMenu: [{
					name: 'Row above',
					id: 'Row above',
					image: 'Table-add.png',
					cmd: 'insertRowAbove'
				}, {
					name: 'Row below',
					id: 'Row below',
					image: 'Table-add.png',
					cmd: 'insertRowBelow'
				}]
			},
//			{
//				name: 'Move xxx',
//				image: 'edit-cut.png',
//				subMenu: [{
//					name: 'Left',
//					cmd: 'moveLeft'
//				}, {
//					name: 'Right',
//					cmd: 'moveLeft'
//				}, {
//					name: 'Above',
//					cmd: 'moveLeft'
//				}, {
//					name: 'Below',
//					cmd: 'moveLeft'
//				}]
//				//cmd: 'renameSheet',
//			},
//			{
//				type: 'Separator'
//			}, {
//				name: 'Find and replace ...',
//				image: 'find-replace.png'
//			}
		]
		}, {
			name: 'View',
			id: 'View',
			subMenu: [{
				name: 'Previous sheet',
				id: 'Previous sheet',
				image: '',
				cmd: 'previousSheet'
			}, {
				name: 'Previous sheet',
				id: 'Previous sheet',
				image: '',
				cmd: 'previousSheet'
			}, {
				type: 'Separator'
			}, {
				name: 'Toolbar',
				id: 'Toolbar',
				image: 'project-open.png',
				type: 'CheckButton',
				cmd: 'previousSheet'
			}, {
				name: 'Formula bar',
				id: 'Formula bar',
				image: 'formula-icon-16x16.png',
				type: 'CheckButton',
				cmd: 'previousSheet'
			}]
		}, {
			name: 'Format',
			id: 'Format',
			subMenu: [{
				name: 'Document settings...',
				id: 'Document settings...',
				image: '',
				cmd: 'previousSheet'
			}, {
				type: 'Separator'
			}, {
				name: 'Text',
				id: 'Text',
				image: '',
				subMenu: [{
					name: 'Font',
					id: 'Font',
					image: '',
					subMenu: [{
						name: 'Arial',
						id: 'Arial',
						cmd: ''
					}, {
						name: 'Georgia',
						id: 'Georgia',
						cmd: ''
					}, {
						name: 'Lucida Grande',
						id: 'Lucida Grande',
						cmd: ''
					}, {
						name: 'Tahoma',
						id: 'Tahoma',
						cmd: ''
					}, {
						name: 'Trebuchet MS',
						id: 'Trebuchet MS',
						cmd: ''
					}, {
						name: 'Verdana',
						id: 'Verdana',
						cmd: ''
					}]
				}, {
					name: 'Size',
					id: 'Size',
					image: '',
					subMenu: [{
						name: '8',
						id: '8',
						cmd: ''
					}, {
						name: '9',
						id: '9',
						cmd: ''
					}, {
						name: '10',
						id: '10',
						cmd: ''
					}, {
						name: '12',
						id: '12',
						cmd: ''
					}, {
						name: '14',
						id: '14',
						cmd: ''
					}, {
						name: '16',
						id: '16',
						cmd: ''
					}, {
						name: '18',
						id: '18',
						cmd: ''
					}, {
						name: '20',
						id: '20',
						cmd: ''
					}, {
						name: '24',
						id: '24',
						cmd: ''
					}, {
						name: '26',
						id: '26',
						cmd: ''
					}, {
						name: '36',
						id: '36',
						cmd: ''
					}]
				}, {
					name: 'Type',
					id: 'Type',
					image: '',
					subMenu: [{
						name: 'Bold',
						id: 'Bold',
						cmd: ''
					}, {
						name: 'Italic',
						id: 'Italic',
						cmd: ''
					}, {
						name: 'Underline',
						id: 'Underline',
						cmd: ''
					}, {
						name: 'Bold',
						id: 'Bold',
						cmd: ''
					}]
				}, {
					name: 'Case',
					id: 'Case',
					image: '',
					subMenu: [{
						name: 'lowercase',
						id: 'lowercase',
						cmd: ''
					}, {
						name: 'UPPERCASE',
						id: 'UPPERCASE',
						cmd: ''
					}, {
						name: 'Title Case',
						id: 'Title Case',
						cmd: ''
					}, {
						name: 'Versal',
						id: 'Versal',
						cmd: ''
					}]
				}]
			}, {
				name: 'Align',
				id: 'Align',
				image: 'tabla-aligncell-1.png',
				subMenu: [{
					name: 'To be implemented!',
					id: 'To be implemented!',
					cmd: ''
				}]
			}, {
				name: 'Bleed',
				id: 'Bleed',
				image: 'Indentation.png',
				subMenu: [{
					name: 'More',
					id: 'More',
					cmd: 'previousSheet'
				}, {
					name: 'Less',
					id: 'Less',
					cmd: 'previousSheet'
				}]
			}]
		}, {
			name: 'Insert',
			id: 'Insert',
			subMenu: [
//				{
//				name: 'Chart...',
//				image: 'insert-image.png',
//				cmd: ''
//			}, {
//				name: 'Draw...',
//				image: 'insert-image.png',
//				cmd: ''
//			}, {
//				name: 'Image...',
//				image: 'insert-image.png',
//				cmd: ''
//			}, {
//				type: 'Separator'
//			},
			{
				name: 'Functions',
				id: 'Functions',
				image: 'formula-icon-16x16.png',
				cmd: ''
			}, {
				name: 'Hyperlinks',
				id: 'Hyperlinks',
				image: 'insert-link.png',
				cmd: ''
			}]
		}, {
			name: 'Tools',
			id: 'Tools',
			subMenu: [{
				name: 'Calculator',
				id: 'Calculator',
				image: 'accessories-calculator.png',
				cmd: ''
			}, {
				type: 'Separator'
			}, {
				name: 'Sort ascending',
				id: 'Sort ascending',
				image: 'sort-asc-16x16.png',
				cmd: ''
			}, {
				name: 'Sort descending',
				id: 'Sort descending',
				image: 'sort-des-16x16.png',
				cmd: ''
			}, {
				type: 'Separator'
			}, {
				name: 'Search web',
				id: 'Search web',
				image: '',
				subMenu: [{
					name: 'Search the Wiki for xxx',
					id: 'Search the Wiki for xxx',
					image: 'applications-internet.png',
					cmd: ''
				}, {
					name: 'Search the web for xxx',
					id: 'Search the web for xxx',
					image: 'applications-internet.png',
					cmd: ''
				}, {
					name: 'Search the web for xxx images',
					id: 'Search the web for xxx images',
					image: 'applications-internet.png',
					cmd: ''
				}]
			}]
		}, {
			name: 'Help',
			id: 'Help',
			subMenu: [{
				name: 'eyeDoc Help',
				id: 'eyeDoc Help',
				image: 'acrobat.png',
				cmd: ''
			}, {
				name: 'Learn at eyeOS Forum',
				id: 'Learn at eyeOS Forum',
				image: 'acrobat.png',
				cmd: ''
			}, {
				name: 'Watch a video about Colaborative features',
				id: 'Watch a video about Colaborative features',
				image: 'acrobat.png',
				cmd: ''
			}, {
				type: 'Separator'
			}, {
				name: 'Keyboard Shortcuts',
				id: 'Keyboard Shortcuts',
				image: 'acrobat.png'
			}]
		}]
	}
});
