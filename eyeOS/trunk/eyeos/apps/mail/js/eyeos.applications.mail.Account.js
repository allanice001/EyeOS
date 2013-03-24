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
 * eyeos.application.mail.Account - the eyeOS Mail Account Object.
 */
qx.Class.define('eyeos.applications.mail.Account', {
	extend: qx.core.Object,

	construct: function () {
		arguments.callee.base.call(this);
	},

	properties: {
		/**
		 * accounts: Array[] of account objects.
		 */
		accounts: {
			init: null,
			event: 'changeAccounts'
		},

		/**
		 * accountId: the id of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		accountId: {
			init: null
		},

		/**
		 * accountMail: the mail of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		accountMail: {
			init: null
		},

		/**
		 * accountName: the name of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		accountName: {
			init: null
		},

		/**
		 * accountDescription: the description of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		accountDescription: {
			init: null
		},

		/**
		 * receivingUserName: the pop/imap username of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		receivingUserName: {
			init: null
		},

		/**
		 * receivingPassword: the pop/imap password of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		receivingPassword: {
			init: null
		},

		/**
		 * receivingServerName: the pop/imap server name of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		receivingServerName: {
			init: null
		},

		/**
		 * receivingServerPort: the pop/imap server port of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		receivingServerPort: {
			init: null
		},

		/**
		 * receivingServerSecure: the pop/imap SSL server connection of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		receivingServerSecure: {
			init: null
		},

		/**
		 * receivingServerType: the pop/imap server type of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		receivingServerType: {
			init: null
		},

		/**
		 * sendingUserName: the smtp username of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		sendingUserName: {
			init: null
		},

		/**
		 * sendingPassword: the smtp password of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		sendingPassword: {
			init: null
		},

		/**
		 * sendingServerName: the smtp server name of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		sendingServerName: {
			init: null
		},

		/**
		 * sendingServerPort: the smtp server port of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		sendingServerPort: {
			init: null
		},

		/**
		 * sendingServerSecure: the smtp SSL server connection of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		sendingServerSecure: {
			init: null
		},

		/**
		 * sendingServerType: the smtp SSL server type of a given account.
		 * {@see this#accounts}
		 * {@see this#retrieveAccount}
		 */
		sendingServerType: {
			init: null
		}
	},

	members: {
		/**
		 * createAccount: create a new account, given all the needed params.
		 * @param checknum {Number} the process checknum
		 * @param params {Array} the array of params needed to create a new account
		 */
		createAccount: function (checknum, params) {
			eyeos.callMessage(checknum, 'createAccount', params, function (id) {
				this.setAccountId(id);
				this.fireEvent('accountCreated');
			}, this);
		},

		/**
		 * editAccount: edit an account, given all the needed params to be changed.
		 * @param checknum {Number} the process checknum
		 * @param params {Array} the array of params to be changed
		 */
		editAccount: function (checknum, params) {
			eyeos.callMessage(checknum, 'editAccount', params, function () {
				this.fireEvent('accountEdited');
			}, this);
		},

		/**
		 * removeAccount: remove an account, given the account's id to be removed.
		 * @param checknum {Number} the process checknum
		 * @param params {Array} the account's id to be removed
		 */
		removeAccount: function (checknum, params) {
			eyeos.callMessage(checknum, 'removeAccount', params, function () {
				this.fireEvent('accountRemoved');
			}, this);
		},

		/**
		 * getAllAccounts: retrieve all the accounts from the database, and sets
		 * the {@see this#accounts} with the retrieved array of datas.
		 * @param checknum {Number} the process checknum
		 * @param init {Boolean} true, if we want to update the GUI in the init phase.
		 */
		getAllAccounts: function (checknum, init) {
			eyeos.callMessage(checknum, 'getAllAccounts', null, function (results) {
				this.setAccounts(results);
				if (init) {
					this.fireEvent('AccountSettingsRetrieved');
				}
			}, this);
		},

		/**
		 * retrieveAccount: retrieve an accountfrom {@see this#accounts},
		 * given a valid index.
		 * @param index {Number} a valid index in the range [0..this.getAccounts().length
		 */
		retrieveAccount: function (index) {
			if (this.getAccounts()) {
				this.setAccountId(this.getAccounts()[index].id);
				this.setAccountMail(this.getAccounts()[index].mail);
				this.setAccountName(this.getAccounts()[index].name);
				this.setAccountDescription(this.getAccounts()[index].description);

				this.setReceivingUserName(this.getAccounts()[index].mbusername);
				this.setReceivingPassword(this.getAccounts()[index].mbpassword);
				this.setReceivingServerName(this.getAccounts()[index].mbserver);
				this.setReceivingServerPort(this.getAccounts()[index].mbport);
				this.setReceivingServerSecure(this.getAccounts()[index].mbsecure);
				this.setReceivingServerType(this.getAccounts()[index].typemailbox);

				this.setSendingUserName(this.getAccounts()[index].senderusername);
				this.setSendingPassword(this.getAccounts()[index].senderpassword);
				this.setSendingServerName(this.getAccounts()[index].senderserver);
				this.setSendingServerPort(this.getAccounts()[index].senderport);
				this.setSendingServerSecure(this.getAccounts()[index].sendersecure);
				this.setSendingServerType(this.getAccounts()[index].typesender);
			}
		}
	}
});
