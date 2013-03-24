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
 * eyeos.applications.mail.AccountSettingsWindow - the eyeOS Mail Account Settings Window.
 */
qx.Class.define('eyeos.applications.mail.AccountSettingsWindow', {
	extend: qx.ui.window.Window,

	properties: {
		/**
		 * checknum: the checknum of the calling application.
		 * {@see eyeos.applications.Mail}
		 */
		checknum: {
			init: null
		},

		/**
		 * accountObject: the reference to {@see eyeos.applications.mail.Account}
		 */
		accountObject: {
			deferredInit: true
		},

		// TODO: to be removed, and replaced with a fireEvent.
		actions: {
			init: null
		}
	},

	construct: function (checknum, actions) {
		this.base(arguments);
		this.setChecknum(checknum);
		this.setActions(actions);
		this.set({
			layout: new qx.ui.layout.VBox(),
			decorator: null,
			modal: true,
			resizable: false,
			showStatusbar: false,
			showMaximize: false,
			showMinimize: false,
			movable: false,
			backgroundColor: '#FFFFFF',
			width: 660,
			height: 430
		});

		this.center();
		this.open();

		this.initAccountObject(new eyeos.applications.mail.Account());
		this.getAccountObject().addListener('AccountSettingsRetrieved', function() {
			this.getAccountObject().retrieveAccount(0);
			this._buildGui();
			this._addMyListeners();
		}, this);
		this.getAccountObject().getAllAccounts(this.getChecknum(), true);
	},

	members: {
		_headerFont: new qx.bom.Font(12, ['Helvetica', 'Arial']).set({
			bold: true
		}),

		_textFont: new qx.bom.Font(11, ['Helvetica', 'Arial']).set({
			bold: true
		}),

		_addMyListeners: function() {
			this._cancelButton.addListener('click', function() {
				this.close();
			}, this);

			this._applyButton.addListener('click', function() {
				this._apply();
			}, this);

			this._addNewAccountButton.addListener('click', function() {
				var newAccount = new eyeos.applications.mail.NewAccountWindow(this.getChecknum());
				newAccount.getAccountObject().addListener('accountCreated', function() {
					this.getAccountObject().addListener('changeAccounts', function() {
						var account = this.getAccountObject().getAccounts()[this.getAccountObject().getAccounts().length-1];
						var mailAccount = new qx.ui.tree.TreeFolder(account.mail);
						mailAccount.setIcon('');
						mailAccount.id = account.id;
						this._tree.getRoot().add(mailAccount);
					}, this);

					this.getAccountObject().getAllAccounts(this.getChecknum(), false);		
					this.getActions().updateTree();
				}, this);
			}, this);

			this._removeAccountButton.addListener('click', function(e) {
				var op = new eyeos.dialogs.OptionPane(
					'Are you sure you want to delete the account ' + this.getAccountObject().getAccountMail() + '?',
					eyeos.dialogs.OptionPane.QUESTION_MESSAGE,
					eyeos.dialogs.OptionPane.YES_NO_OPTION
				);

				op.createDialog(
					null,
					'Remove Account...',
					function (answer) {
						if (answer == eyeos.dialogs.OptionPane.YES_OPTION) {
							this.getAccountObject().addListener('accountRemoved', function() {
								this._tree.getRoot().getChildren().forEach(function(account) {
									if (account.id == this.getAccountObject().getAccountId()) {
										account.destroy();
									}
								}, this);
								this.getActions().updateTree();
							}, this);
							this.getAccountObject().removeAccount(this.getChecknum(), this.getAccountObject().getAccountId());
						}
					}, this).open();
			}, this);
		},

		_validate: function() {
			var validated = new Array();

			if (this.getAccountObject().getAccountMail()) {
				validated.push(true);
			}
			else {
				this._accountSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._accountMailLabel.setTextColor('red');
			}

			if (this.getAccountObject().getAccountName()) {
				validated.push(true);
			}
			else {
				this._accountSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._accountNameLabel.setTextColor('red');
			}

			if (this.getAccountObject().getAccountDescription()) {
				validated.push(true);
			}
			else {
				this._accountSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._accountDescriptionLabel.setTextColor('red');
			}


			if (this.getAccountObject().getReceivingUserName()) {
				validated.push(true);
			}
			else {
				this._receivingServerSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._receivingUserNameLabel.setTextColor('red');
			}

			if (this.getAccountObject().getReceivingPassword()) {
				validated.push(true);
			}
			else {
				this._receivingServerSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._receivingPasswordLabel.setTextColor('red');
			}

			if (this.getAccountObject().getReceivingServerName()) {
				validated.push(true);
			}
			else {
				this._receivingServerSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._receivingServerNameLabel.setTextColor('red');
			}

			if (this.getAccountObject().getReceivingServerPort()) {
				validated.push(true);
			}
			else {
				this._receivingServerSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._receivingServerPortLabel.setTextColor('red');
			}

			if (this.getAccountObject().getReceivingServerSecure()) {
				validated.push(true);
			}
			else {
				this._receivingServerSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._receivingServerSecureLabel.setTextColor('red');
			}
			
			if (this.getAccountObject().getReceivingServerType()) {
				validated.push(true);
			}
			else {
				this._receivingServerSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._receivingServerTypeLabel.setTextColor('red');
			}

			if (this.getAccountObject().getSendingUserName()) {
				validated.push(true);
			}
			else {
				this._sendingServerSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._sendingUserNameLabel.setTextColor('red');
			}

			if (this.getAccountObject().getSendingPassword()) {
				validated.push(true);
			}
			else {
				this._sendingServerSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._sendingPasswordLabel.setTextColor('red');
			}

			if (this.getAccountObject().getSendingServerName()) {
				validated.push(true);
			}
			else {
				this._sendingServerSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._sendingServerNameLabel.setTextColor('red');
			}

			if (this.getAccountObject().getSendingServerPort()) {
				validated.push(true);
			}
			else {
				this._sendingServerSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._sendingServerPortLabel.setTextColor('red');
			}

			if (this.getAccountObject().getSendingServerSecure()) {
				validated.push(true);
			}
			else {
				this._sendingServerSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._sendingServerSecureLabel.setTextColor('red');
			}

			if (this.getAccountObject().getSendingServerType()) {
				validated.push(true);
			}
			else {
				this._sendingServerSettings.getChildControl('button').getChildControl('label').setTextColor('red');
				validated.push(false);
				this._sendingServerTypeLabel.setTextColor('red');
			}

			if (validated.indexOf(false) >= 0) {
				return false;
			}
			else {
				return true;
			}
		},

		_apply: function() {
			if (this._validate()) {
				var params = new Array();

				params.push(this.getAccountObject().getAccountId());
				params.push(this.getAccountObject().getAccountMail());
				params.push(this.getAccountObject().getAccountName());
				params.push(this.getAccountObject().getAccountDescription());

				params.push(this.getAccountObject().getReceivingServerType());
				params.push(this.getAccountObject().getReceivingUserName());
				params.push(this.getAccountObject().getReceivingPassword());
				params.push(this.getAccountObject().getReceivingServerName());
				params.push(this.getAccountObject().getReceivingServerPort());
				params.push(this.getAccountObject().getReceivingServerSecure());

				params.push(this.getAccountObject().getSendingServerType());
				params.push(this.getAccountObject().getSendingUserName());
				params.push(this.getAccountObject().getSendingPassword());
				params.push(this.getAccountObject().getSendingServerName());
				params.push(this.getAccountObject().getSendingServerPort());
				params.push(this.getAccountObject().getSendingServerSecure());

				this.close();
				this.getAccountObject().editAccount(this.getChecknum(), params);
			}
		},

		_buildGui: function() {			
			var splitPane = new qx.ui.splitpane.Pane("horizontal").set({
				decorator: null
			});
			this.add(splitPane, {
				flex: 1
			});

			var accounts = new qx.ui.groupbox.GroupBox('Accounts').set({
				padding: 5,
				width: 180,
				minWidth: 150,
				layout: new qx.ui.layout.VBox(),
				alignX: 'center',
				alignY: 'middle'
			});
			splitPane.add(accounts, 0);

			this._tree = new qx.ui.tree.Tree().set({
				width : 140,
				height : 290,
				decorator: new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5),
				font: this._textFont
			});

			this._tree.addListener('appear', function() {
				if (this._tree.getRoot().getChildren().length) {
					this._tree.setSelection([this._tree.getRoot().getChildren()[0]]);
				}
			}, this);

			this._tree.addListener('changeSelection', function(e) {
				var selected = e.getTarget().getSelection()[0];
				var accounts = e.getTarget().getRoot().getChildren();
				var index = accounts.indexOf(selected);
				this.getAccountObject().retrieveAccount(index);
				this._destroyAccountSettings();
				this._buildAccountSettings();

				this._destroyReceivingServerSettings();
				this._buildReceivingServerSettings();

				this._destroySendingServerSettings();
				this._buildSendingServerSettings();
			}, this);

			var root = new qx.ui.tree.TreeFolder();
			this._tree.setRoot(root);
			root.setOpen(true);
			this._tree.setHideRoot(true);
			accounts.add(this._tree);

			var addRemoveAccountBox = new qx.ui.container.Composite().set({
				layout: new qx.ui.layout.HBox()
			});
			accounts.add(addRemoveAccountBox);

			this._addNewAccountButton = new qx.ui.form.Button('+').set({
				font: this._textFont,
				decorator: new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
			}, this);
			addRemoveAccountBox.add(this._addNewAccountButton);

			this._removeAccountButton = new qx.ui.form.Button('-').set({
				font: this._textFont,
				decorator: new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
			}, this);
			addRemoveAccountBox.add(this._removeAccountButton);

			if (this.getAccountObject().getAccounts()) {
				this.getAccountObject().getAccounts().forEach(function(account) {
					var mailAccount = new qx.ui.tree.TreeFolder(account.mail);
					mailAccount.setIcon('');
					mailAccount.id = account.id;
					root.add(mailAccount);
				}, this);
			}

			var settings = new qx.ui.groupbox.GroupBox('Settings').set({
				padding: 5,
				minWidth: 400,
				layout: new qx.ui.layout.VBox(),
				alignX: 'center',
				alignY: 'middle'
			});
			splitPane.add(settings, 1);

			var tabView = new qx.ui.tabview.TabView();
			settings.add(tabView, {
				flex: 1
			});

			this._accountSettings = new qx.ui.tabview.Page('Settings').set({
				layout: new qx.ui.layout.VBox()
			});
			tabView.add(this._accountSettings);

			this._receivingServerSettings = new qx.ui.tabview.Page('POP/IMAP Server').set({
				layout: new qx.ui.layout.VBox()
			});
			tabView.add(this._receivingServerSettings);

			this._sendingServerSettings = new qx.ui.tabview.Page('SMTP Server').set({
				layout: new qx.ui.layout.VBox()
			});
			tabView.add(this._sendingServerSettings);

			var footer = new qx.ui.container.Composite().set({
				backgroundColor: '#E9E9E9',
				width: 630,
				height: 30,
				allowGrowX: false,
				allowGrowY: false,
				alignX: 'center',
				alignY: 'middle',
				layout: new qx.ui.layout.HBox(),
				decorator: new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
			});
			this.add(footer);

			footer.add(new qx.ui.core.Spacer(), {
				flex: 1
			});

			this._cancelButton = new qx.ui.form.Button('Cancel').set({
				font: this._textFont,
				alignX: 'right',
				decorator: new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
			});
			footer.add(this._cancelButton);

			this._applyButton = new qx.ui.form.Button('Apply').set({
				font: this._textFont,
				alignX: 'right',
				decorator: new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
			});
			this._applyButton.setEnabled(false);
			footer.add(this._applyButton);

			if (this.getAccountObject().getAccounts()) {
				this._applyButton.setEnabled(true);
				this._buildAccountSettings();
				this._buildReceivingServerSettings();
				this._buildSendingServerSettings();
			}
		},

		_updateAccountSettings: function() {
			if (this.getAccountObject().getAccountMail()) {
				this._accountMail.setValue(this.getAccountObject().getAccountMail())
			}

			if (this.getAccountObject().getAccountName()) {
				this._accountName.setValue(this.getAccountObject().getAccountName())
			}

			if (this.getAccountObject().getAccountDescription()) {
				this._accountDescription.setValue(this.getAccountObject().getAccountDescription())
			}
		},

		_destroyAccountSettings: function() {
			this._accountSettings.removeAll();
		},

		_buildAccountSettings: function() {
			var accountBox = this._createGroupBox('Your mail address and your account name');
			this._accountSettings.add(accountBox);

			this._accountMailLabel = this._createLabel('Mail address:');
			accountBox.add(this._accountMailLabel);
			this._accountMail = new qx.ui.form.TextField();
			this._accountMail.addListener('changeValue', function() {
				this.getAccountObject().setAccountMail(this._accountMail.getValue());
				if (this._accountMail.getValue()) {
					this._accountSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._accountMailLabel.setTextColor('black');
				}
			}, this);
			accountBox.add(this._accountMail, {
				flex: 1
			});

			this._accountNameLabel = this._createLabel('Account name:');
			accountBox.add(this._accountNameLabel);
			this._accountName = new qx.ui.form.TextField();
			this._accountName.addListener('changeValue', function() {
				this.getAccountObject().setAccountName(this._accountName.getValue());
				if (this._accountName.getValue()) {
					this._accountSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._accountNameLabel.setTextColor('black');
				}
			}, this);
			accountBox.add(this._accountName, {
				flex: 1
			});

			var descriptionBox = this._createGroupBox('A short description of the account');
			this._accountSettings.add(descriptionBox);

			this._accountDescriptionLabel = this._createLabel('Description:');
			descriptionBox.add(this._accountDescriptionLabel);
			this._accountDescription = new qx.ui.form.TextField();
			this._accountDescription.addListener('changeValue', function() {
				this.getAccountObject().setAccountDescription(this._accountDescription.getValue());
				if (this._accountDescription.getValue()) {
					this._accountSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._accountDescriptionLabel.setTextColor('black');
				}
			}, this);
			descriptionBox.add(this._accountDescription, {
				flex: 1
			});

			this._updateAccountSettings();
		},

		_updateReceivingServerSettings: function() {
			if (this.getAccountObject().getReceivingUserName()) {
				this._receivingUserName.setValue(this.getAccountObject().getReceivingUserName())
			}

			if (this.getAccountObject().getReceivingPassword()) {
				this._receivingPassword.setValue(this.getAccountObject().getReceivingPassword())
			}

			if (this.getAccountObject().getReceivingServerName()) {
				this._receivingServerName.setValue(this.getAccountObject().getReceivingServerName())
			}

			if (this.getAccountObject().getReceivingServerPort()) {
				this._receivingServerPort.setValue(this.getAccountObject().getReceivingServerPort())
			}

			if (this.getAccountObject().getReceivingServerSecure()) {
				this._receivingServerSecure.setValue(this.getAccountObject().getReceivingServerSecure())
			}

			if (this.getAccountObject().getReceivingServerType()) {
				this._receivingServerType.setValue(this.getAccountObject().getReceivingServerType())
			}
		},

		_destroyReceivingServerSettings: function() {
			this._receivingServerSettings.removeAll();
		},

		_buildReceivingServerSettings: function() {
			var accountBox = this._createGroupBox('Account');
			this._receivingServerSettings.add(accountBox);

			this._receivingUserNameLabel = this._createLabel('Username:');
			accountBox.add(this._receivingUserNameLabel);
			this._receivingUserName = new qx.ui.form.TextField();
			this._receivingUserName.addListener('changeValue', function() {
				this.getAccountObject().setReceivingUserName(this._receivingUserName.getValue());
				if (this._receivingUserName.getValue()) {
					this._receivingServerSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._receivingUserNameLabel.setTextColor('black');
				}
			}, this);
			this._receivingUserName.setValue(this._accountMail.getValue());
			accountBox.add(this._receivingUserName);

			this._receivingPasswordLabel = this._createLabel('Password:');
			accountBox.add(this._receivingPasswordLabel);
			this._receivingPassword = new qx.ui.form.PasswordField();
			this._receivingPassword.addListener('changeValue', function() {
				this.getAccountObject().setReceivingPassword(this._receivingPassword.getValue());
				if (this._receivingPassword.getValue()) {
					this._receivingServerSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._receivingPasswordLabel.setTextColor('black');
				}
			}, this);
			accountBox.add(this._receivingPassword);

			var mailServerBox = this._createGroupBox('IMAP/POP Server');
			this._receivingServerSettings.add(mailServerBox);

			var upContainer = new qx.ui.container.Composite().set({
				layout: new qx.ui.layout.HBox().set({
					spacing: 5
				}),
				padding: 5
			});
			mailServerBox.add(upContainer);

			this._receivingServerNameLabel = this._createLabel('Server name:');
			upContainer.add(this._receivingServerNameLabel);
			this._receivingServerName = new qx.ui.form.TextField();
			this._receivingServerName.addListener('changeValue', function() {
				this.getAccountObject().setReceivingServerName(this._receivingServerName.getValue());
				if (this._receivingServerName.getValue()) {
					this._receivingServerSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._receivingServerNameLabel.setTextColor('black');
				}
			}, this);
			upContainer.add(this._receivingServerName, {
				flex: 1
			});

			this._receivingServerPortLabel = this._createLabel('Server port:');
			upContainer.add(this._receivingServerPortLabel);
			this._receivingServerPort = new qx.ui.form.TextField().set({
				width: 35,
				allowGrowX: false
			});
			this._receivingServerPort.addListener('changeValue', function() {
				this.getAccountObject().setReceivingServerPort(this._receivingServerPort.getValue());
				if (this._receivingServerPort.getValue()) {
					this._receivingServerSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._receivingServerPortLabel.setTextColor('black');
				}
			}, this);
			upContainer.add(this._receivingServerPort);

			var downContainer = new qx.ui.container.Composite().set({
				layout: new qx.ui.layout.HBox().set({
					spacing: 5
				}),
				padding: 5
			});
			mailServerBox.add(downContainer);

			this._receivingServerSecureLabel = this._createLabel('Secure Connection:');
			downContainer.add(this._receivingServerSecureLabel);
			this._receivingServerSecure = new qx.ui.form.SelectBox().set({
				width: 60,
				allowGrowX: false
			});
			this._receivingServerSecure.add(new qx.ui.form.ListItem('Yes'));
			this._receivingServerSecure.add(new qx.ui.form.ListItem('No'));
			this._receivingServerSecure.addListener('changeValue', function() {
				this.getAccountObject().setReceivingServerSecure(this._receivingServerSecure.getSelection()[0].getLabel());
				if (this._receivingServerSecure.getSelection()[0].getLabel()) {
					this._receivingServerSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._receivingServerSecureLabel.setTextColor('black');
				}
			}, this);
			downContainer.add(this._receivingServerSecure);

			this._receivingServerTypeLabel = this._createLabel('Type:');
			downContainer.add(this._receivingServerTypeLabel);
			this._receivingServerType = new qx.ui.form.SelectBox().set({
				width: 60,
				allowGrowX: false
			});
			this._receivingServerType.add(new qx.ui.form.ListItem('POP'));
			this._receivingServerType.add(new qx.ui.form.ListItem('IMAP'));
			this.getAccountObject().setReceivingServerType('POP');
			this._receivingServerType.addListener('changeValue', function() {
				this.getAccountObject().setReceivingServerType(this._receivingServerType.getSelection()[0].getLabel());
				if (this._receivingServerType.getSelection()[0].getLabel()) {
					this._receivingServerSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._receivingServerTypeLabel.setTextColor('black');
				}
			}, this);
			downContainer.add(this._receivingServerType);

			this._updateReceivingServerSettings();
		},

		_updateSendingServerSettings: function() {
			if (this.getAccountObject().getSendingUserName()) {
				this._sendingUserName.setValue(this.getAccountObject().getSendingUserName())
			}

			if (this.getAccountObject().getSendingPassword()) {
				this._sendingPassword.setValue(this.getAccountObject().getSendingPassword())
			}

			if (this.getAccountObject().getSendingServerName()) {
				this._sendingServerName.setValue(this.getAccountObject().getSendingServerName())
			}

			if (this.getAccountObject().getSendingServerPort()) {
				this._sendingServerPort.setValue(this.getAccountObject().getSendingServerPort())
			}

			if (this.getAccountObject().getSendingServerSecure()) {
				this._sendingServerSecure.setValue(this.getAccountObject().getSendingServerSecure())
			}

			if (this.getAccountObject().getSendingServerType()) {
				this._sendingServerType.setValue(this.getAccountObject().getSendingServerType())
			}
		},

		_destroySendingServerSettings: function() {
			this._sendingServerSettings.removeAll();
		},

		_buildSendingServerSettings: function() {
			var accountBox = this._createGroupBox('Account');
			this._sendingServerSettings.add(accountBox);

			this._sendingUserNameLabel = this._createLabel('Username:');
			accountBox.add(this._sendingUserNameLabel);
			this._sendingUserName = new qx.ui.form.TextField();
			this._sendingUserName.addListener('changeValue', function() {
				this.getAccountObject().setSendingUserName(this._sendingUserName.getValue());
				if (this._sendingUserName.getValue()) {
					this._sendingServerSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._sendingUserNameLabel.setTextColor('black');
				}
			}, this);
			this._sendingUserName.setValue(this._receivingUserName.getValue());
			accountBox.add(this._sendingUserName, {
				flex: 1
			});

			this._sendingPasswordLabel = this._createLabel('Password:');
			accountBox.add(this._sendingPasswordLabel);
			this._sendingPassword = new qx.ui.form.PasswordField();
			this._sendingPassword.addListener('changeValue', function() {
				this.getAccountObject().setSendingPassword(this._sendingPassword.getValue());
				if (this._sendingPassword.getValue()) {
					this._sendingServerSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._sendingPasswordLabel.setTextColor('black');
				}
			}, this);
			this._sendingPassword.setValue(this._receivingPassword.getValue());
			accountBox.add(this._sendingPassword, {
				flex: 1
			});

			var mailServerBox = this._createGroupBox('SMTP Server');
			this._sendingServerSettings.add(mailServerBox);

			var upContainer = new qx.ui.container.Composite().set({
				layout: new qx.ui.layout.HBox().set({
					spacing: 5
				}),
				padding: 5
			});
			mailServerBox.add(upContainer);

			this._sendingServerNameLabel = this._createLabel('Server name:');
			upContainer.add(this._sendingServerNameLabel);
			this._sendingServerName = new qx.ui.form.TextField();
			this._sendingServerName.addListener('changeValue', function() {
				this.getAccountObject().setSendingServerName(this._sendingServerName.getValue());
				if (this._sendingServerName.getValue()) {
					this._sendingServerSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._sendingServerNameLabel.setTextColor('black');
				}
			}, this);
			upContainer.add(this._sendingServerName, {
				flex: 1
			});

			this._sendingServerPortLabel = this._createLabel('Server port:');
			upContainer.add(this._sendingServerPortLabel);
			this._sendingServerPort = new qx.ui.form.TextField().set({
				width: 35,
				allowGrowX: false
			});
			this._sendingServerPort.addListener('changeValue', function() {
				this.getAccountObject().setSendingServerPort(this._sendingServerPort.getValue());
				if (this._sendingServerPort.getValue()) {
					this._sendingServerSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._sendingServerPortLabel.setTextColor('black');
				}
			}, this);
			upContainer.add(this._sendingServerPort);

			var downContainer = new qx.ui.container.Composite().set({
				layout: new qx.ui.layout.HBox().set({
					spacing: 5
				}),
				padding: 5
			});
			mailServerBox.add(downContainer);

			this._sendingServerSecureLabel = this._createLabel('Secure Connection:');
			downContainer.add(this._sendingServerSecureLabel);
			this._sendingServerSecure = new qx.ui.form.SelectBox().set({
				width: 60,
				allowGrowX: false
			});
			this._sendingServerSecure.add(new qx.ui.form.ListItem('Yes'));
			this._sendingServerSecure.add(new qx.ui.form.ListItem('No'));
			this._sendingServerSecure.addListener('changeValue', function() {
				this.getAccountObject().setSendingServerSecure(this._sendingServerSecure.getSelection()[0].getLabel());
				if (this._sendingServerSecure.getSelection()[0].getLabel()) {
					this._sendingServerSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._sendingServerSecureLabel.setTextColor('black');
				}
			}, this);
			downContainer.add(this._sendingServerSecure);

			this._sendingServerTypeLabel = this._createLabel('Type:');
			downContainer.add(this._sendingServerTypeLabel);
			this._sendingServerType = new qx.ui.form.SelectBox().set({
				width: 70,
				allowGrowX: false
			});
			this._sendingServerType.add(new qx.ui.form.ListItem('SMTP'));
			this.getAccountObject().setSendingServerType('SMTP');
			this._sendingServerType.addListener('changeValue', function() {
				this.getAccountObject().setSendingServerType(this._sendingServerType.getSelection()[0].getLabel());
				if (this._sendingServerType.getSelection()[0].getLabel()) {
					this._sendingServerSettings.getChildControl('button').getChildControl('label').setTextColor('black');
					this._sendingServerTypeLabel.setTextColor('black');
				}
			}, this);
			downContainer.add(this._sendingServerType);

			this._updateSendingServerSettings();
		},

		_createGroupBox: function(label) {
			var groupbox = new qx.ui.groupbox.GroupBox(label).set({
				padding: 5,
				layout: new qx.ui.layout.VBox(),
				alignX: 'center',
				alignY: 'middle'
			});
			return groupbox;
		},

		_createLabel: function(value) {
			var label = new qx.ui.basic.Label(value).set({
				alignY: 'middle',
				font: this._textFont
			});
			return label;
		}
	}
});
