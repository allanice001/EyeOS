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
qx.Class.define('genericbar.toptoolbar.Items', {
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
			name: 'File',
			id: 'File',
			Group: [{
				name: 'New',
				id: 'New',
				image: 'document-new.png',
				cmd: 'fileNew'
			}, {
				name: 'Open',
				id: 'Open',
				image: 'document-open-folder.png',
				cmd: 'fileOpen'
			}, {
				name: 'Save',
				id: 'Save',
				image: 'document-save.png',
				cmd: 'fileSave'
			}]
		}, {
			name: 'Print',
			id: 'Print',
			Group: [{
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
			Group: [{
				name: 'Undo',
				id: 'Undo',
				image: 'edit-undo.png',
				cmd: 'editUndo'
			}, {
				name: 'Redo',
				id: 'Redo',
				image: 'edit-redo.png',
				cmd: 'editRedo'
			},
//			{
//				name: 'Cut',
//				image: 'edit-cut.png',
//				cmd: 'editCut'
//			}, {
//				name: 'Copy',
//				image: 'edit-copy.png',
//				cmd: 'editCopy'
//			}, {
//				name: 'Paste',
//				image: 'edit-paste.png',
//				cmd: 'editPaste'
//			}
			]
		}, {
			name: 'Various',
			id: 'Various',
			Group: [{
				name: 'Table',
				id: 'Table',
				image: 'table-22x22.png',
				subMenu: [{
					name: 'Insert row above',
					id: 'Insert row above',
					cmd: 'insertRowAbove'
				}, {
					name: 'Insert row below',
					id: 'Insert row below',
					cmd: 'insertRowBelow'
				}]
			}, {
				name: 'Sort',
				id: 'Sort',
				image: 'sort-des.png',
				subMenu: [{
					name: 'Ascendant',
					id: 'Ascendant',
					image: 'sort-asc.png',
					cmd: 'sortAscendant'
				}, {
					name: 'Descendant',
					id: 'Descendant',
					image: 'sort-des.png',
					cmd: 'sortDescendant'
				}]
			}, {
				name: 'Formula',
				id: 'Formula',
				image: 'formula-icon.png',
				subMenu: [{
					name: 'SUM',
					id: 'SUM',
					cmd: 'formula_sum'
				}, {
					name: 'AVERAGE',
					id: 'AVERAGE',
					cmd: 'formula_avg'
				}, {
					name: 'MAX',
					id: 'MAX',
					cmd: 'formula_max'
				}, {
					name: 'MIN',
					id: 'MIN',
					cmd: 'formula_min'
				}, {
					name: 'PRODUCT',
					id: 'PRODUCT',
					cmd: 'formula_prod'
				}, 
//				{
//					name: 'IF',
//					cmd: 'tableInsert'
//				}, {
//					name: 'COUNT',
//					cmd: 'tableInsert'
//				}, {
//					type: 'Separator'
//				}, {
//					name: 'IM.ANGULO',
//					cmd: ''
//				}
				]
			},
//			{
//				name: 'Chart',
//				image: 'insert-image.png',
//				cmd: 'chartDialog'
//			},
			{
				name: 'Hyperlink',
				id: 'Hyperlink',
				image: 'insert-link.png',
				subMenu: [{
					name: 'Bookmark',
					id: 'Bookmark',
					cmd: 'insertHyperLinks',
					image: 'insert-link.png'
				}, {
					name: 'Document',
					id: 'Document',
					cmd: 'insertHyperLinks',
					image: 'insert-link.png'
				}, {
					name: 'E-mail',
					id: 'E-mail',
					cmd: 'insertHyperLinks',
					image: 'insert-link.png'
				}, {
					name: 'Web page',
					id: 'Web page',
					cmd: 'insertHyperLinks',
					image: 'insert-link.png'
				}]
			}
//			{
//				name: 'Image',
//				image: 'insert-image.png',
//				cmd: 'insertImage'
//			}
			]
		}]
	}
});