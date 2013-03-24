
function __clickEvent(e) {
	//console.log(e.getCurrentTarget());
	//console.log(e.getCurrentTarget().table);
	
	var params = new Array();
	var ids = new Array();

	ids.push(e.getCurrentTarget().id);
	if (e.getCurrentTarget().getChildren().length) {
		for ( var i = 0; i < e.getCurrentTarget().getChildren().length; ++i) {
			ids.push(e.getCurrentTarget().getChildren()[i].id);
		}
	}

	params.push(ids);
	params.push(1); //pageNumber = 1
	if(e.getCurrentTarget().typeAccount == 'imap') {
		//this is a imap account, so we do not request the mails
		//in the same way, they are not comming from the database
		var path = e.getCurrentTarget().getLabel();
		var parent = e.getCurrentTarget().getParent();
		while(parent) {
			var text = parent.getLabel();
			parent = parent.getParent();
			if(parent) {
				path = text+'/'+path;
			}
		}
		eyeos.callMessage(e.getCurrentTarget().checknum, 'getMailsFromImap', path, function(results) {
			this.getTableModel().removeRows(0, this.getTableModel().getRowCount());
			for (var i = 0; i < results.length; ++i) {
				var isEmpty = new Object().toString();
				var tags = '';
				if (results[i].tags.toString() != isEmpty) {
					// to be modified with names and ids....
					tags =  results[i].tags.toString();
				}
				this.getTableModel().addRows([[false, results[i].star, results[i].date,
					results[i].from.toString(), results[i].subject,
					tags]]);
			}
		}, this);
	} else {
		e.getCurrentTarget().table._readTable(e.getCurrentTarget().checknum, ids, 1);
	}
}

function __createTagItem(result, checknum, table) {
	var item = new eyeos.ui.tree.TreeColorFolder(result.color);
	item.setLabel(result.name);
	item.id = result.id;

	item.getChildControl("iconMenu").addListener('click', function(e) {
		var popup = new qx.ui.popup.Popup();
		popup.setDecorator(
			new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
			);
		popup.setPadding(5);
		popup.setLayout(new qx.ui.layout.VBox());
		popup.placeToWidget(e.getTarget());
		popup.show();

		var editTag = new qx.ui.form.Button('Edit Tag');
		editTag.setFont(new qx.bom.Font('12', ['Helvetica', 'Arial']));
		editTag.setDecorator(
			new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
			);
		editTag.addListener('click', function(e) {
			var popup = new eyeos.ui.popup.Popup();
			popup.setDecorator(
				new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
				);
			popup.setPadding(5);
			popup.setLayout(new qx.ui.layout.VBox());
			popup.getLayout().setSpacing(5);
			popup.placeToWidget(e.getTarget());
			popup.show();

			var nameBox = new qx.ui.container.Composite(new qx.ui.layout.HBox());
			nameBox.getLayout().setSpacing(5);
			nameBox.getLayout().setAlignX('center');
			nameBox.getLayout().setAlignY('middle');
			popup.add(nameBox);

			var nameLabel = new qx.ui.basic.Label('Tag Name:');
			nameLabel.setFont(new qx.bom.Font('12', ['Helvetica', 'Arial']));
			nameBox.add(nameLabel);

			var nameTag = new qx.ui.form.TextField();
			nameTag.setValue(result.name);
			nameTag.setFont(new qx.bom.Font('12', ['Helvetica', 'Arial']));
			nameBox.add(nameTag);

			var colorBox = new qx.ui.container.Composite(new qx.ui.layout.HBox());
			colorBox.getLayout().setSpacing(5);
			colorBox.getLayout().setAlignX('center');
			colorBox.getLayout().setAlignY('middle');
			popup.add(colorBox);

			var colorLabel = new qx.ui.basic.Label('Tag Color:');
			colorLabel.setFont(new qx.bom.Font('12', ['Helvetica', 'Arial']));
			colorBox.add(colorLabel);

			var colorButton = new eyeos.ui.form.ColorButton('');
			colorButton.setColor(result.color);
			colorButton.getMenu().addListener('appear', function() {
				popup.setCanClose(false);
			}, this);
			colorButton.getMenu().addListener('disappear', function() {
				popup.setCanClose(true);
			}, this);
			colorBox.add(colorButton);

			var editTag = new qx.ui.form.Button('Edit Tag');
			editTag.setFont(new qx.bom.Font('12', ['Helvetica', 'Arial']));
			editTag.setDecorator(
				new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
				);

			editTag.addListener('click', function(e) {
				if (nameTag.getValue() && colorButton.getColor()) {
					__editTag(checknum, item.id, nameTag.getValue(), colorButton.getColor());
					item.setLabel(nameTag.getValue());
					item.setColor(colorButton.getColor());
					popup.hide();
				}
			}, this);
			popup.add(editTag);
		}, this);
		popup.add(editTag);

		var removeTag = new qx.ui.form.Button('Remove Tag');
		removeTag.setFont(new qx.bom.Font('12', ['Helvetica', 'Arial']));
		removeTag.setDecorator(
			new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
			);
		removeTag.addListener('click', function() {
			__removeTag(checknum, item.id);
			item.destroy();
			popup.hide();
		});
		popup.add(removeTag);
	}, this);

	item.addListener('click', function() {
		var ids = new Array();
		var params = new Array();

		ids.push(this.id);
		params[0] = ids;
		params[1] = 1;

		eyeos.callMessage(checknum, 'getConversationsInLocalTag', params, function(results) {
			table.getTableModel().removeRows(0, table.getTableModel().getRowCount());
			if (results) {
				for (var i = 0; i < results.length; ++i) {
					var isEmpty = new Object().toString();
					var tags = new Object();
					if (results[i].tags.toString() != isEmpty) {
						tags =  results[i].tagsNames.toString();
					}

					table.getTableModel().addRows([[false, results[i].star, results[i].date,
						results[i].from.toString(), results[i].subject,
						tags]]);

					table.getTableModel().getRowData(table.getTableModel().getRowCount() - 1).id = results[i].id;
					table.getTableModel().getRowData(table.getTableModel().getRowCount() - 1).tagsIds = results[i].tags.toString();
				}
			}
		}, this);
	});

	return item;
}

function __createTree(checknum, container, listMailContainer, table) {
	eyeos.callMessage(checknum, 'getTree', null, function (results) {
		var tree = new qx.ui.tree.Tree();
		tree.setDecorator(null);
		var root = new qx.ui.tree.TreeFolder("/");
		root.setOpen(true);
		tree.setRoot(root);
		tree.setHideRoot(false);
		__readTree(root, results, null, checknum, listMailContainer, table);
		container.add(tree);

		root.getChildren().forEach(function(item) {
			if (item.getLabel() == 'Inbox') {
				tree.setSelection([item]);
			}
		}, this);
	});
}

function __readTree(root, results, baseFolders, checknum, listMailContainer, table) {
	var items = new Object();
	var defaults = new Object();
	for (var i = 0; i < results.length; ++i) {
		var item = new qx.ui.tree.TreeFolder();
		item.table = table;
		item.checknum = checknum;
		item.addListener('click', __clickEvent);

		if(results[i].added == 0) {
			item.setLabel(root.getLabel());
			item.id = results[i].id;
			if(results[i].path == 'Deleted Messages' && baseFolders) {
				item.setIcon('index.php?extern=images/mail/user-trash.png');
				baseFolders['Trash'].add(item);
			} else if(results[i].path == 'Drafts' && baseFolders) {
				item.setIcon('index.php?extern=images/mail/mail-folder-sent.png');
				baseFolders['Drafts'].add(item);
			} else if(results[i].path == 'INBOX' && baseFolders) {
				item.setIcon('index.php?extern=images/mail/mail-folder-inbox.png');
				baseFolders['Inbox'].add(item);
			} else if(results[i].path == 'Sent Messages' && baseFolders) {
				item.setIcon('index.php?extern=images/mail/mail-folder-outbox.png');
				baseFolders['Sent'].add(item);
			} else if(results[i].path == 'Starred' && baseFolders) {
				item.setIcon('index.php?extern=images/mail/bookmarks.png');
				baseFolders['Starred'].add(item);
			} else {
				item.setLabel(results[i].name);
				if (results[i].typeAccount) {
					item.setIcon('index.php?extern=images/mail/internet-mail.png');
					item.typeAccount = results[i].typeAccount;
				}
				else {
					if (root.typeAccount) {
						item.setIcon('index.php?extern=images/mail/folder-grey.png');
						item.typeAccount = root.typeAccount;
					}
					else if (root.getLabel() == 'Local Tags') {
						item.dispose();
						item = __createTagItem(results[i], checknum, table);
					}
					else {
						switch (results[i].path) {
							case 'Trash':
								item.setIcon('index.php?extern=images/mail/user-trash.png');
								break;
							case 'Drafts':
								item.setIcon('index.php?extern=images/mail/mail-folder-sent.png');
								break;
							case 'Inbox':
								item.setIcon('index.php?extern=images/mail/mail-folder-inbox.png');
								break;
							case 'Sent':
								item.setIcon('index.php?extern=images/mail/mail-folder-outbox.png');
								break;
							case 'Starred':
								item.setIcon('index.php?extern=images/mail/bookmarks.png');
								break;
							case 'Local Tags':
								item.dispose();
								item = new eyeos.ui.tree.TreeFolder();
								item.setIcon('index.php?extern=images/mail/folder-bookmark.png');
								item.setLabel(results[i].name);
								item.id = results[i].id;
								item.getChildControl("iconMenu").addListener('click', function(e) {
									var popup = new eyeos.ui.popup.Popup();
									popup.setDecorator(
										new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
										);
									popup.setPadding(5);
									popup.setLayout(new qx.ui.layout.VBox());
									popup.getLayout().setSpacing(5);
									popup.placeToWidget(e.getTarget());
									popup.show();

									var nameBox = new qx.ui.container.Composite(new qx.ui.layout.HBox());
									nameBox.getLayout().setSpacing(5);
									nameBox.getLayout().setAlignX('center');
									nameBox.getLayout().setAlignY('middle');
									popup.add(nameBox);

									var nameLabel = new qx.ui.basic.Label('Tag Name:');
									nameLabel.setFont(new qx.bom.Font('12', ['Helvetica', 'Arial']));
									nameBox.add(nameLabel);

									var nameTag = new qx.ui.form.TextField();
									nameTag.setFont(new qx.bom.Font('12', ['Helvetica', 'Arial']));
									nameBox.add(nameTag);

									var colorBox = new qx.ui.container.Composite(new qx.ui.layout.HBox());
									colorBox.getLayout().setSpacing(5);
									colorBox.getLayout().setAlignX('center');
									colorBox.getLayout().setAlignY('middle');
									popup.add(colorBox);

									var colorLabel = new qx.ui.basic.Label('Tag Color:');
									colorLabel.setFont(new qx.bom.Font('12', ['Helvetica', 'Arial']));
									colorBox.add(colorLabel);

									var colorButton = new eyeos.ui.form.ColorButton('');
									colorButton.getMenu().addListener('appear', function() {
										popup.setCanClose(false);
									}, this);
									colorButton.getMenu().addListener('disappear', function() {
										popup.setCanClose(true);
									}, this);
									colorBox.add(colorButton);

									var newTag = new qx.ui.form.Button('Add New Tag');
									newTag.setFont(new qx.bom.Font('12', ['Helvetica', 'Arial']));
									newTag.setDecorator(
										new qx.ui.decoration.RoundBorderBeveled(null, '#C6C5C4', 0.7, 5, 5, 5, 5)
										);

									newTag.addListener('click', function(e) {
										if (nameTag.getValue() && colorButton.getColor()) {
											var id = __createTag(checknum, nameTag.getValue(), colorButton.getColor());
											var newTagItem = __createTagItem({
												name: nameTag.getValue(),
												id: id,
												color: colorButton.getColor()
												}, checknum, table);
											item.add(newTagItem);
											popup.hide();
										}
									}, this);
									popup.add(newTag);
								}, this);

								item.removeListener('click', __clickEvent);
								item.addListener('click', function() {
									var ids = new Array();
									var items = item.getChildren();
									items.forEach(function(item) {
										ids.push(item.id);
									});

									var params = new Array();
									params[0] = ids;
									params[1] = 1;

									eyeos.callMessage(checknum, 'getConversationsInLocalTag', params, function(results) {
										table.getTableModel().removeRows(0, table.getTableModel().getRowCount());
										if (results) {
											for (var i = 0; i < results.length; ++i) {
												var isEmpty = new Object().toString();
												var tags = new Object();

												if (results[i].tags.toString() != isEmpty) {
													tags =  results[i].tagsNames.toString();
												}

												table.getTableModel().addRows([[false, results[i].star, results[i].date,
													results[i].from.toString(), results[i].subject,
													tags]]);

												table.getTableModel().getRowData(table.getTableModel().getRowCount() - 1).id = results[i].id;
												table.getTableModel().getRowData(table.getTableModel().getRowCount() - 1).tagsIds = results[i].tags.toString();
											}
										}
									}, this);
								}, this);
								break;
						}
					}
				}
				root.add(item);
				if (results[i].typeAccount == 'pop') {
					item.exclude();
				}
			}
			items[results[i].path] = item;
		} else {
			item = items[results[i].path];
			item.id = results[i].id;
		}

		var parent = results[i];
		var j = i;
		while(j+1 < results.length) {
			if(isChildrenOf(parent,results[j+1])) {
				results[j+1].added = 1;
				var itemChild = new qx.ui.tree.TreeFolder(results[j+1].name);
				itemChild.setIcon('index.php?extern=images/mail/folder-grey.png');
				itemChild.id = results[j+1].id;
				items[results[j+1].path] = itemChild;
				item.add(itemChild);
				itemChild.addListener('click', function(e) {
					//console.log(e.getTarget().getChildren());
					});
			}
			j++;
		}

		if(!baseFolders) {
			defaults[results[i].path] = item;
		}

		if (results[i].subfolders) {
			__readTree(item, results[i].subfolders, defaults, checknum, listMailContainer, table);
		}
	}
	
}

function __syncFolders(checknum, treeContainer, listMailContainer) {
	eyeos.callMessage(checknum, 'syncFolders', null, function (results) {
		if (results) {
			__createTree(checknum, treeContainer, listMailContainer);
		}
	}, this);
}

//function __createFolder(newFolderName, newFolderPath, newFolderAccount, newFolderColor) {
//	var params = new Array(newFolderName, newFolderPath, newFolderAccount, newFolderColor);
//	eyeos.callMessage(checknum, 'createFolder', params, function () {
//		});
//}
//
//function __deleteFolder(checknum, FolderId, FolderName, FolderPath, FolderAccount) {
//	var params = new Array(FolderId, FolderName, FolderPath, FolderAccount);
//	eyeos.callMessage(checknum, 'removeFolder', params, function () {
//		});
//}
//
//function __editFolder(checknum, FolderId, FolderName, FolderPath, FolderNewPath, FolderColor, FolderAccount) {
//	var params = new Array(FolderId, FolderName, FolderPath, FolderNewPath, FolderColor, FolderAccount);
//	eyeos.callMessage(checknum, 'editFolder', params, function () {
//		});
//}

function __createTag(checknum, newTagName, newTagColor) {
	var params = new Array(newTagName, newTagColor);
	eyeos.callMessage(checknum, 'createTag', params, function (results) {
		});
}

function __removeTag(checknum, TagId) {
	var params = new Array(TagId);
	eyeos.callMessage(checknum, 'removeTag', params, function () {
		});
}
function __editTag(checknum, tagId, tagNameNew, tagColorNew) {
	var params = new Array(tagId, tagNameNew, tagColorNew);
	eyeos.callMessage(checknum, 'editTag', params, function () {
		});
}

function isChildrenOf(father, children) {
	var slashPosition = children.path.lastIndexOf('/');
	if (slashPosition == -1) {
		return false;
	}
	var childrenPath = children.path.substring(0, slashPosition);
	if (childrenPath == father.path) {
		return true;
	}
	return false;
	
}


/**
 *	eyeos.ui.popup.Popup - Styling...
 *	Extending a qx.ui.popup.Popup, to implement the
 *	eyeos look and feel behaviour.
 */
qx.Class.define('eyeos.ui.popup.Popup', {
	extend : qx.ui.popup.Popup,

	construct : function() {
		arguments.callee.base.call(this);
	},

	properties: {
		canClose: {
			init: true,
			check: 'Boolean',
			event: 'changeCanClose'
		}
	},

	members: {
		// overriding...
		exclude : function() {
			if (this.getCanClose()) {
				this.setVisibility("excluded");
			}
		}
	}
});

