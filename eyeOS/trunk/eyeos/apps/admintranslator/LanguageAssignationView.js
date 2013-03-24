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
* */
qx.Class.define('LanguageAssignationView', {
	extend: qx.ui.container.Composite,

	properties: {
		id: {
			check: 'Integer'
		},
		language: {
			check: 'String'
		},
		code: {
			check: 'String'
		},
		assigned: {
			check: 'String'
		}
	},
	
	construct: function (checknum, params) {
		this.base(arguments);

		this._checknum = checknum;
		this.setId(params['id']);
		this.setLanguage(params['language']);
		this.setCode(params['code']);
		this.setAssigned(params['assigned']);

		this._buildGui();
	},
	
	members: {
		_checknum: null,
		
		_buildGui: function () {
			this.set({
				layout: new qx.ui.layout.HBox(),
				alignX: 'center',
				decorator: new qx.ui.decoration.Single(1, 'solid', 'gray').set({
					styleTop: null,
					styleLeft: null,
					styleRight: null
				})
			});

			//ID
			var idLabel = new qx.ui.basic.Label(this.getId());
			this.add(idLabel, {width: '10%'});

			//Language
			var languageLabel = new qx.ui.basic.Label(this.getLanguage());
			this.add(languageLabel, {width: '30%'});

			//Code
			var codeLabel = new qx.ui.basic.Label(this.getCode());
			this.add(codeLabel, {width: '10%'});

			//Assigned

			eyeos.callMessage(this._checknum, 'getUserNameById', this.getAssigned(), function (name) {
				var assignedLabel = new qx.ui.basic.Label(name);
				this.add(assignedLabel, {
					width: '45%'
				});
			}, this)

			//Delete
			 var deleteImage = new qx.ui.basic.Image('index.php?extern=images/delete.png').set({
				 cursor: 'pointer'
			 });

			 deleteImage.addListener('click', function () {
				 eyeos.callMessage(this._checknum, 'deleteLanguage', this.getId(), function() {
					 this.destroy();
				 }, this);
			 }, this);
			 
			 this.add(deleteImage, {width: '5%'});
		}
	}
});