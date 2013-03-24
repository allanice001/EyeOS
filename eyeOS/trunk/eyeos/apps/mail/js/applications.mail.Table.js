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
 * applications.mail.Table
 */
qx.Class.define('applications.mail.Table', {
	extend: qx.core.Object,

	construct: function() {
		arguments.callee.base.call(this);
	},

	statics: {
		TABLE_MODEL: [ "Check", "Starred", "Date", "From", "Subject", "Tags", "Attachments" ]
	},

	properties: {
		table: {
			init: new qx.ui.table.Table(),
			check: 'qx.ui.table.Table'
		},

		tableModel: {
			init: new qx.ui.table.model.Simple(),
			check: 'qx.ui.table.model.Simple'
		},

		actions: {
			init: null
		}
	},

	members: {
		createTable: function(checknum, container, mailContainer, labelId, pageNumber) {
			this.getTableModel().setColumns(this.self(arguments).TABLE_MODEL);
			//			this.getTableModel().setColumnEditable(0, true);
			//			this.getTableModel().setColumnEditable(1, true);
			this.getTable().setTableModel(this.getTableModel());
			this._readTable(checknum, labelId, pageNumber);

			var selectionMode = qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION;
			this.getTable().getSelectionModel().setSelectionMode(selectionMode);

			var tcm = this.getTable().getTableColumnModel();
			tcm.setDataCellRenderer(0, new qx.ui.table.cellrenderer.Boolean());
			tcm.setDataCellRenderer(1, new qx.ui.table.cellrenderer.Boolean());
			tcm.setDataCellRenderer(2, new qx.ui.table.cellrenderer.Date());
			tcm.setDataCellRenderer(3, new qx.ui.table.cellrenderer.Html());
			tcm.setDataCellRenderer(4, new qx.ui.table.cellrenderer.Html());
			tcm.setDataCellRenderer(5, new qx.ui.table.cellrenderer.Html());
			tcm.setDataCellRenderer(6, new qx.ui.table.cellrenderer.Html());

			this.getTable().getSelectionModel().addListener('changeSelection', function(e) {
				if (e.getTarget().getSelectedRanges().length) {
					var id = e.getTarget().getSelectedRanges()[0].minIndex;
					var params = this.getTableModel().getRowData(id).id;
					eyeos.callMessage(checknum, 'getMailToShow', params, function(results) {
						this.setReaded(id, this.getTableModel().getRowData(id).unread);
						var header = new qx.ui.container.Composite(new qx.ui.layout.VBox());
						header.setBackgroundColor('#D9E5F4');
						header.setPadding(5);
						mailContainer.removeAll();

						var fromAddress = results[0].from.toString();
						var toAddress = results[0].to.toString();
						var fromLabel = new qx.ui.basic.Label('<b>From:</b> ' + fromAddress + '&nbsp;&nbsp;&nbsp;<b>To:</b> ' + toAddress);
						fromLabel.setPadding(2);
						fromLabel.setRich(true);
						header.add(fromLabel);

						var subjectTopic = results[0].subject.toString();
						var sendedDate = results[0].date.toString();
						var subjectLabel = new qx.ui.basic.Label('<b>Subject:</b> ' + subjectTopic + '&nbsp;&nbsp;&nbsp;<b>Date:</b> ' + sendedDate);
						subjectLabel.setPadding(2);
						subjectLabel.setRich(true);
						header.add(subjectLabel);

						mailContainer.add(header);

						var menu = new qx.ui.container.Composite(new qx.ui.layout.HBox());
						menu.setBackgroundColor('#D3D3D3');
						menu.setPaddingTop(2);
						menu.setPaddingLeft(2);
						mailContainer.add(menu);

//						var menu = new qx.ui.toolbar.ToolBar();
//						toolbarContainer.add(menu);

						var replyButton = new qx.ui.form.Button('Reply');
						replyButton.setPadding(0);
						replyButton.setPaddingLeft(3);
						replyButton.setPaddingRight(3);
						replyButton.setMargin(0);
						replyButton.addListener('click', function(e) {
							this.getActions().fileNewMail(e, results[0].to.toString().split('<')[1].split('>')[0],
								results[0].from.toString().split('<')[1].split('>')[0],
								'Re: ' + results[0].subject.toString(),
								results[0].bodyHtml.toString());
						}, this);
						menu.add(replyButton);

						var replyAllButton = new qx.ui.form.Button('Reply All');
						replyAllButton.setPadding(0);
						replyAllButton.setPaddingLeft(3);
						replyAllButton.setPaddingRight(3);
						replyAllButton.setMargin(0);
						replyAllButton.addListener('click', function(e) {
							this.getActions().fileNewMail(e, results[0].to.toString().split('<')[1].split('>')[0],
								results[0].from.toString().split('<')[1].split('>')[0],
								'Re: ' + results[0].subject.toString(),
								results[0].bodyHtml.toString());
						}, this);
						menu.add(replyAllButton);

						var forwardButton = new qx.ui.form.Button('Forward');
						forwardButton.setPadding(0);
						forwardButton.setPaddingLeft(3);
						forwardButton.setPaddingRight(3);
						forwardButton.setMargin(0);
						forwardButton.addListener('click', function(e) {
							this.getActions().fileNewMail(e, results[0].to.toString().split('<')[1].split('>')[0],
								null,
								'Fwd: ' + results[0].subject.toString(),
								results[0].bodyHtml.toString());
						}, this);
						menu.add(forwardButton);

						var tagsButton = new qx.ui.form.Button('Tags');
						tagsButton.setPadding(0);
						tagsButton.setPaddingLeft(3);
						tagsButton.setPaddingRight(3);
						tagsButton.setMargin(0);
						tagsButton.addListener('click', function(e) {
							this.getActions().showMenuTags(e);
						}, this);
						menu.add(tagsButton);

						var deleteButton = new qx.ui.form.Button('Delete');
						deleteButton.setPadding(0);
						deleteButton.setPaddingLeft(3);
						deleteButton.setPaddingRight(3);
						deleteButton.setMargin(0);
						deleteButton.addListener('click', function(e) {
							var id = this.getTable().getSelectionModel().getSelectedRanges()[0].minIndex;
							var params = this.getTableModel().getRowData(id).id;
							eyeos.callMessage(checknum, 'sendMailToTrash', params, function() {
							}, this);
						}, this);
						menu.add(deleteButton);

						menu.add(new qx.ui.core.Spacer(), {flex: 1});
						var attachments = new qx.ui.form.Button('Attachments');
						menu.add(attachments);

						var scroll = new qx.ui.container.Scroll().set({
							allowStretchY: true,
							allowStretchX: true
						});
						mailContainer.add(scroll, {
							flex: 1
						});

						var body = new qx.ui.basic.Label(results[0].bodyHtml.toString());
						body.setPaddingLeft(10);
						body.setPaddingRight(10);
						body.setPaddingBottom(10);
						body.setBackgroundColor('white');
						body.setRich(true);

						scroll.add(body, {
							flex: 1
						});
					}, this);
				}
			}, this);

			container.add(this.getTable());
		},
		
		_readTable: function(checknum, labelId, pageNumber) {
			var params = new Array();
			params[0] = labelId;
			params[1] = pageNumber;

			var rows = this.getTableModel().getRowCount();
			this.getTableModel().removeRows(0, rows);

			eyeos.callMessage(checknum, 'getConversationsInFolder', params, function(results) {
				if (results){
					for (var i = 0; i < results.length; ++i) {
						var formatted = this.htmlFormat(results[i]);
						this.getTableModel().addRows([[formatted[0], formatted[1], formatted[2],
							formatted[3], formatted[4], formatted[5], formatted[5]]]);

						this.getTableModel().getRowData(this.getTableModel().getRowCount() - 1).unread = results[i].unread;
						this.getTableModel().getRowData(this.getTableModel().getRowCount() - 1).id = results[i].id;
						this.getTableModel().getRowData(this.getTableModel().getRowCount() - 1).tagsIds = results[i].tags.toString();
					}
				}
			}, this, {timeout: 0});
		},

		htmlFormat: function(result) {
			var formatted = new Array();
			var isEmpty = new Object().toString();
			var tags = new Object();

			if (result.tags.toString() != isEmpty) {
				tags =  result.tagsNames.toString();
			}

			if (!result.unread) {
				formatted.push(false);
				formatted.push(result.star);
				formatted.push(result.date);
				formatted.push(result.from.toString());
				formatted.push(result.subject);
				formatted.push(tags);
				formatted.push(result.attachements);
			}
			else {
				formatted.push(false);
				formatted.push(result.star);
				formatted.push('<strong>' + result.date + '</strong>');
				formatted.push('<strong>' + result.from.toString() + '</strong>');
				formatted.push('<strong>' + result.subject + '</strong>');
				formatted.push('<strong>' +	tags + '</strong>');
				formatted.push('<strong>' + result.attachements + '</strong>');
			}
			return formatted;
		},

		setReaded: function(rowId, unread) {
			if (unread) {
				var model = this.getTable().getTableModel();
				for( var coldId = 2; coldId < 7; ++coldId) {
					var str = model.getValue(coldId, rowId);
					model.setValue(coldId, rowId, str.substr(8, str.length - 17));
				}
			}
		}
	}
});
