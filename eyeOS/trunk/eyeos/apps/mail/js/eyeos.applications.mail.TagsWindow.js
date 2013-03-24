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
 * eyeos.applications.mail.TagsWindow - the eyeOS Mail Account Tags Window.
 */
qx.Class.define("eyeos.applications.mail.TagsWindow", {
	extend: qx.core.Object,

	construct: function(checknum, listMailContainer, event) {
		this.base(arguments);
		this.setChecknum(checknum);
		this.setListMailContainer(listMailContainer);
		this.setEvent(event);
	},

	properties: {
		/**
		 * checknum: the checknum of the calling application.
		 * {@see eyeos.applications.Mail}
		 */
		checknum: {
			init: null
		},

		/**
		 * listMailContainer: the container where all the mails are listed.
		 * {@see eyeos.applications.Mail}
		 */
		listMailContainer: {
			init: null
		},

		/**
		 * listMailContainer: the container where all the mails are listed.
		 * {@see generic.both.Actions}
		 */
		event: {
			init: null
		}
	},

	members: {
		open: function() {
			var popup = new qx.ui.popup.Popup();
			popup.setDecorator(
				new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
				);
			popup.setPadding(5);
			popup.setLayout(new qx.ui.layout.VBox());
			popup.placeToWidget(this.getEvent());
			popup.show();

			eyeos.callMessage(this.getChecknum(), 'getAllLocalTags', null, function(results) {
				var tableModel = this.getListMailContainer().getChildren()[0].getTableModel();
				var selectionModel = this.getListMailContainer().getChildren()[0].getSelectionModel();
				var selectedTags = new Array();
				selectionModel.iterateSelection(function(id) {
					var tags = tableModel.getRowData(id).tagsIds.split(',');
					tags.forEach(function(tag) {
						selectedTags.push(tag);
					}, this);
				});

				var tags = new Array();
				selectedTags.forEach(function(tag) {
					if (!tags[tag]) {
						tags[tag] = 0;
					}
					tags[tag] += 1;
				}, this);

				for ( var i = 0; i < results.length; ++i) {
					var button = new qx.ui.form.CheckBox(results[i].name);
					button.setFont(new qx.bom.Font('12', ['Helvetica', 'Arial']));
					button.setTextColor(results[i].color);
					button.id = results[i].id;
					button.checknum = this.getChecknum();
					button.tableModel = tableModel;
					button.selectionModel = selectionModel;
					button.tags = tags;
					button.setMarginTop(5);
					button.setMarginBottom(5);

					button.addListener('appear', function() {
						var selected = this.selectionModel.getSelectedCount();
						if (this.tags[this.id] >= selected) {
							this.toggleValue();
						}
					});

					button.event = this.getEvent();
					button.addListener('click', function() {
						this.selectionModel.iterateSelection(function(id) {
							var params = new Array();
							params.push(this.tableModel.getRowData(id).id.toString());
							params.push(this.id);
							if (this.getValue()) {
								if (this.event instanceof eyeos.ui.toolbar.Button) {
									eyeos.callMessage(this.checknum, 'addTagToConversation', params, function () {
										}, this);
								}
								else {
									eyeos.callMessage(this.checknum, 'addTagToMail', params, function () {
										}, this);
								}
							}
							else {
								if (this.event instanceof eyeos.ui.toolbar.Button) {
									eyeos.callMessage(this.checknum, 'removeTagToConversation', params, function () {
										}, this);
								}
								else {
									eyeos.callMessage(this.checknum, 'removeTagToMail', params, function () {
										}, this);
								}
							}
						}, this);
					});
					popup.add(button);
				}
			}, this);
		}
	}
});
