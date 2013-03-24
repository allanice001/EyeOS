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
//TODO -> no account: crash deleting a tag...
//TODO -> delete last account: refresh right GUI...
//TODO -> accountSettings: dispose AccontObject when finished...
//TODO -> move the generic.actions function to external classes...

/**
 * eyeos.application.Mail - the eyeOS Mail Client.
 * @param checknum {Number} the process checknum
 * @param pid {Number} the process id
 * @param args {Array} the input arguments
 */
function mail_application(checknum, pid, args) {
	eyeos.callMessage(checknum, 'initDatabaseScheme', null, function(result) {
		var application = new eyeos.applications.Mail(checknum, pid, args, result);
		application.initApplication(args);
	}, this);
}

qx.Class.define('eyeos.applications.Mail', {
	extend: eyeos.system.EyeApplication,

	construct: function (checknum, pid, args, initDatabase) {
		arguments.callee.base.call(this, 'mail', checknum, pid);
		this.__iconsPath = 'index.php?extern=images/mail/';
		this.setInitDatabase(initDatabase);
	},

	properties: {
		initDatabase: {
			init: null
		},

		ids: {
			init: new Array()
		}
	},

	members: {
		__window: null,
		__menuBar: null,

		initApplication: function(args) {
			this.__window = new eyeos.ui.Window(this, 'EyeMail', 'index.php?exter=/images/16x16/apps/internet-mail.png', true);
			this.__window.setContentPadding(0);
			this.__window.setLayout(new qx.ui.layout.VBox());

			this.__window.addListener('appear', function() {
				this.__menuBar = new eyeos.ui.menubar.MenuBar();
				this.__menuBar.setIconsPath(this.__iconsPath);
                                this.__menuBar.setItems(
                                    new genericbar.menubar.Items().getItems()
                                );
                                this.__menuBar.setActions(
                                    new genericbar.both.Actions(this.__window, this.getChecknum(), this.getPid(), this)
                                );
				this.__menuBar.createMenuBar();
				this.__window.add(this.__menuBar);

				this.__topToolBar = new eyeos.ui.toolbar.ToolBar();
				this.__topToolBar.setHeight(50);
				this.__topToolBar.setIconsPath(this.__iconsPath);
                                this.__topToolBar.setItems(
                                    new genericbar.toptoolbar.Items().getItems()
                                );
                                this.__topToolBar.setActions(
                                    new genericbar.both.Actions(this.__window, this.getChecknum(), this.getPid(), this)
                                );

				this.__topToolBar.createToolBar();
				this.__window.add(this.__topToolBar);

				// creating the horizontal pane...
				var horizontalSplitPane = new qx.ui.splitpane.Pane("horizontal");
				horizontalSplitPane.setDecorator(new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5));

				// ...which containts the treeContainer...
				var treeContainer = new qx.ui.container.Composite(new qx.ui.layout.Grow()).set({
					width: 180,
					minWidth: 160
				});
				this.__topToolBar.getActions().setTreeContainer(treeContainer);
				this.__menuBar.getActions().setTreeContainer(treeContainer);
				horizontalSplitPane.add(treeContainer, 0);

				// ...and the vertical pane...
				var verticalSplitPane = new qx.ui.splitpane.Pane("vertical");
				verticalSplitPane.setDecorator(new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5));
				horizontalSplitPane.add(verticalSplitPane, 1);

				// ...which contains the listMailContainer...
				var listMailContainer = new qx.ui.container.Composite(new qx.ui.layout.Grow()).set({
					height: 150,
					MinHeight: 150
				});
				this.__topToolBar.getActions().setListMailContainer(listMailContainer);
				this.__menuBar.getActions().setListMailContainer(listMailContainer);
				verticalSplitPane.add(listMailContainer, 0);

				// ...and the singleMailContainer...
				var singleMailContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
					height: 150,
					MinHeight: 150
				});
				singleMailContainer.setBackgroundColor('white');
				verticalSplitPane.add(singleMailContainer, 1);

				var table = new applications.mail.Table();
				table.setActions(this.__topToolBar.getActions());
				this.__topToolBar.getActions().setTable(table);
				this.__menuBar.getActions().setTable(table);

				treeContainer.addListener('addChildWidget', function(e) {
					var root = e.getTarget().getChildren()[0].getChildren()[0];
					root.getChildren().forEach(function(item) {
						if (item.getLabel() == 'Inbox') {
							item.getChildren().forEach(function(account) {
								this.getIds().push(account.id);
							}, this);
						}
					}, this);
					
					table.createTable(this.getChecknum(), listMailContainer, singleMailContainer, this.getIds(), 1);
				}, this);
				
				this.__window.add(horizontalSplitPane, {flex: 1});

				__createTree(this.getChecknum(), treeContainer, listMailContainer, table);
				if (this.getInitDatabase()) {
					this.__menuBar.getActions().addNewAccount();
				}
				else {
					this.__menuBar.getActions().fileGetMail();
					if (args[0] == 'newMail') {
						this.__topToolBar.getActions().fileNewMail();
					}
				}
			}, this);

			this.__window.maximize();
			this.__window.open();
			
		}
	}
});

