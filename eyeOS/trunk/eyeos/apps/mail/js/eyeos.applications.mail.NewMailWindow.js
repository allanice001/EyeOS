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
 * eyeos.applications.mail.NewMailWindow - the eyeOS Mail New Mail Window.
 */
qx.Class.define("eyeos.applications.mail.NewMailWindow", {
	extend: qx.core.Object,

	construct: function(pid, checknum, listMailContainer, event,
						from, to, subject, body) {
		this.base(arguments);
		this.setChecknum(checknum);
		this.setPid(pid);
		this.setListMailContainer(listMailContainer);
		this.setEvent(event);
	},

	properties: {
		/**
		 * pid: the pid of the calling application.
		 * {@see eyeos.applications.Mail}
		 */
		pid: {
			init: null
		},

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
		 * event: the container where all the mails are listed.
		 * {@see generic.both.Actions}
		 */
		event: {
			init: null
		}
	},

	members: {
		open: function(from, to, subject, body) {
			var editor;
			var window = new qx.ui.window.Window('New Mail');
			window.setContentPadding(0);
			window.setWidth(800);
			window.setHeight(400);
			window.setAllowMaximize(false);
			window.setAllowMinimize(false);
			window.setLayout(new qx.ui.layout.VBox());

			window.tinyIsReady = false;
			window.addListener('appear', function() {
				var menuBar = new eyeos.ui.menubar.MenuBar();
				menuBar.setIconsPath('index.php?extern=images/mail/');
				menuBar.setItems(
					new newmail.menubar.Items().getItems()
					);
				menuBar.setActions(
					new newmail.toolbar.Actions(window, this.getChecknum(), this.getPid(), this)
					);
				menuBar.createMenuBar();
				window.add(menuBar);

				var topToolBar = new eyeos.ui.toolbar.ToolBar();
				topToolBar.setHeight(50);
				topToolBar.setIconsPath('index.php?extern=images/mail/');
				topToolBar.setItems(
					new newmail.toolbar.top.Items().getItems()
					);
				topToolBar.setActions(
					new newmail.toolbar.Actions(window, this.getChecknum(), this.getPid(), this)
					);
				topToolBar.createToolBar();
				window.add(topToolBar);

				var mailBox = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
				mailBox.setBackgroundColor('#D9E5F4');
				mailBox.setHeight(80);
				mailBox.setAllowGrowY(false);
				window.add(mailBox);

				var fromLabel = new qx.ui.basic.Label('From:');
				fromLabel.setMarginLeft(5);
				fromLabel.setAlignX('center');
				fromLabel.setAlignY('middle');
				mailBox.add(fromLabel, {
					top: 10,
					left: 10
				});

				eyeos.callMessage(this.getChecknum(), 'getAllAccounts', null, function(results) {
					if (results) {
						var items = new Array();

						results.forEach(function (result) {
							items.push({
								name: result.name + ': ' + result.mail
							});
							items[items.length-1].id = result.id;
							items[items.length-1].from = result.mail;
						});

						var fromSelectBox = new eyeos.ui.form.SelectBox(items);
						fromSelectBox.addListener('appear', function() {
							if (!from) {
								menuBar.getActions().mailTO.id = fromSelectBox.getSelection()[0].id;
								menuBar.getActions().mailTO.from = fromSelectBox.getSelection()[0].from;
							}
							else {
								var children = fromSelectBox.getChildren();
								children.forEach(function(child) {
									if (child.from == from) {
										fromSelectBox.setSelection([child]);
										menuBar.getActions().mailTO.id = fromSelectBox.getSelection()[0].id;
										menuBar.getActions().mailTO.from = fromSelectBox.getSelection()[0].from;
									}
								}, this);
							}
						}, this);

						fromSelectBox.setMarginLeft(5);
						fromSelectBox.setAllowGrowX(false);
						fromSelectBox.setAllowGrowY(false);
						fromSelectBox.setWidth(250);
						fromSelectBox.setHeight(25);
						fromSelectBox.setAlignX('center');
						fromSelectBox.setAlignY('middle');
						mailBox.add(fromSelectBox, {
							top: 3,
							left: 55
						});
						fromSelectBox.addListener('changeValue', function(e) {
							menuBar.getActions().mailTO.id = this.getEvent().getSelection()[0].id;
							menuBar.getActions().mailTO.from = this.getEvent().getSelection()[0].from;
						}, this);
					}
				}, this);

				var toLabel = new qx.ui.basic.Label('To:');
				toLabel.setMarginLeft(5);
				toLabel.setAlignX('center');
				toLabel.setAlignY('middle');
				mailBox.add(toLabel, {
					top: 10,
					left: 320
				});

				var toTextField = new qx.ui.form.TextField();
				toTextField.setDecorator(
					new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
					);
				toTextField.addListener('appear', function() {
					if (to) {
						this.setValue(to);
					}
				});

				toTextField.setMarginLeft(5);
				toTextField.setAllowGrowX(false);
				toTextField.setAllowGrowY(false);
				toTextField.setWidth(250);
				toTextField.setHeight(25);
				toTextField.setAlignX('center');
				toTextField.setAlignY('middle');
				mailBox.add(toTextField, {
					top: 5,
					left: 350
				});
				toTextField.addListener('changeValue', function(e) {
					menuBar.getActions().mailTO.to = this.getEvent().getValue();
				}, this);

				var subjectLabel = new qx.ui.basic.Label('Subject:');
				subjectLabel.setMarginLeft(5);
				subjectLabel.setAlignX('center');
				subjectLabel.setAlignY('middle');
				mailBox.add(subjectLabel, {
					top: 38,
					left: 10
				});

				var subjectTextField = new qx.ui.form.TextField();
				subjectTextField.setDecorator(
					new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
					);
				subjectTextField.addListener('appear', function() {
					if (subject) {
						this.setValue(subject);
					}
				});
				subjectTextField.setMarginLeft(5);
				subjectTextField.setAllowGrowX(false);
				subjectTextField.setAllowGrowY(false);
				subjectTextField.setWidth(250);
				subjectTextField.setHeight(25);
				subjectTextField.setAlignX('center');
				subjectTextField.setAlignY('middle');
				mailBox.add(subjectTextField, {
					top: 35,
					left: 55
				});
				subjectTextField.addListener('changeValue', function(e) {
					menuBar.getActions().mailTO.subject = this.getEvent().getValue();
				}, this);

				var addCc = new qx.ui.form.ToggleButton('Add Cc');
				mailBox.add(addCc, {
					top: 5,
					right: 100
				});

				var ccBccBox = new qx.ui.container.Composite(new qx.ui.layout.HBox());
				ccBccBox.setHeight(30);
				ccBccBox.setWidth(530);
				mailBox.add(ccBccBox, {
					top: 33,
					left: 320
				});

				var ccLabel, ccTextField = null;
				addCc.addListener('changeValue', function(e) {
					if (e.getTarget().getValue()) {
						ccLabel = new qx.ui.basic.Label('cc:');
						ccLabel.setMarginLeft(5);
						ccLabel.setAlignX('center');
						ccLabel.setAlignY('middle');
						ccBccBox.add(ccLabel);

						ccTextField = new qx.ui.form.TextField();
						ccTextField.setDecorator(
							new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
							);
						ccTextField.setMarginLeft(5);
						ccTextField.setAllowGrowX(false);
						ccTextField.setAllowGrowY(false);
						ccTextField.setWidth(200);
						ccTextField.setHeight(25);
						ccTextField.setAlignX('center');
						ccTextField.setAlignY('middle');
						ccTextField.addListener('changeValue', function(e) {
							menuBar.getActions().mailTO.cc = e.getTarget().getValue();
						}, this);
						ccBccBox.add(ccTextField);
					}
					else {
						ccBccBox.remove(ccLabel);
						ccBccBox.remove(ccTextField);
					}
				}, this);

				var addBcc = new qx.ui.form.ToggleButton('Add Bcc');
				mailBox.add(addBcc, {
					top: 5,
					right: 20
				});

				var bccLabel, bccTextField = null;
				addBcc.addListener('changeValue', function(e) {
					if (e.getTarget().getValue()) {
						bccLabel = new qx.ui.basic.Label('Bcc:');
						bccLabel.setMarginLeft(5);
						bccLabel.setAlignX('center');
						bccLabel.setAlignY('middle');
						ccBccBox.add(bccLabel);

						bccTextField = new qx.ui.form.TextField();
						bccTextField.setDecorator(
							new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
							);
						bccTextField.setMarginLeft(5);
						bccTextField.setAllowGrowX(false);
						bccTextField.setAllowGrowY(false);
						bccTextField.setWidth(200);
						bccTextField.setHeight(25);
						bccTextField.setAlignX('center');
						bccTextField.setAlignY('middle');
						bccTextField.addListener('changeValue', function(e) {
							menuBar.getActions().mailTO.bcc = e.getTarget().getValue();
						}, this);
						ccBccBox.add(bccTextField);
					}
					else {
						ccBccBox.remove(bccLabel);
						ccBccBox.remove(bccTextField);
					}
				}, this);

				var bottomToolBar = new eyeos.ui.toolbar.ToolBar();
				bottomToolBar.setIconsPath('index.php?extern=images/mail/');
				bottomToolBar.setHeight(33);
				bottomToolBar.setItems(
					new newmail.toolbar.bottom.Items().getItems()
					);
				bottomToolBar.setActions(
					new newmail.toolbar.Actions(window, this.getChecknum(), this.getPid(), this)
					);
				bottomToolBar.createToolBar();
				window.add(bottomToolBar);

				editor = new qx.ui.container.Composite(new qx.ui.layout.HBox());
				menuBar.getActions().setEditorElement(editor);
				window.add(editor, {
					flex: 1
				});

				editor.addListener('appear', function(e) {
					var setBody = true;
					var tinymceId = 'tinymce_editor' + Math.round(Math.random() * 100 + 1);
					e.getCurrentTarget().getContentElement().getDomElement().setAttribute('id', tinymceId);

					ed = new tinymce.Editor(tinymceId, {
						strict_loading_mode : true,
						theme: 'advanced',
						theme_advanced_buttons1 : "",
						theme_advanced_buttons2 : "",
						theme_advanced_buttons3 : "",
						setup : function(ed) {
							ed.onPostRender.add(function(ed) {
								window.tinyIsReady = true;
								var editor = document.getElementById(ed.id + '_tbl').firstChild;
								editor.lastChild.style.dispay = 'none';
								menuBar.getActions().setEditorId(tinymceId);
							});
						}
					});

					ed.onNodeChange.add(function(ed, cm, e) {
						if (setBody && body) {
							setBody = false;
							ed.setContent(body);
						}
						bottomToolBar.getActions().updateStatus(
							e, bottomToolBar.getNeedAManager(),
							bottomToolBar.getNeedAManager(),
							bottomToolBar.getNeedUpdates(),
							bottomToolBar.getNeedUpdates()
							);
					}, this);

					ed.render();
				}, this);
			}, this);

			window.open();

			window.addListener('beforeClose', function(e) {
//				console.log('beforeClose: ' + window.tinyIsReady);
				if(!(window.tinyIsReady)) {
					e.preventDefault();
					var op = new eyeos.dialogs.OptionPane(
						'Some element is still loading, please wait and try to close the window in a few seconds... ',
						eyeos.dialogs.OptionPane.INFORMATION_MESSAGE,
						eyeos.dialogs.OptionPane.DEFAULT_OPTION
						);
					op.createDialog(null, 'Cannot close the window now', null, null).open();
				}
				else {
					window.tinyIsReady = false;
				}
			}, this);

			window.addListener('disappear', function() {
				ed.destroy();
			}, this);
		}
	}
});
