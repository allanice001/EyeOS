/**
 *  DashBoard Playground App
 */

function playground_application(checknum, pid, args){
	var app = new eyeos.system.EyeApplication("playground", checknum, pid);
	
	var mainWindow = new eyeos.ui.Window(app, "eyeos Playground");
	mainWindow.setLayout(new qx.ui.layout.Grid(3));
	mainWindow.set({
		minWidth: 300
	});
	
	var container1 = new qx.ui.container.Composite(new qx.ui.layout.VBox(3));
	mainWindow.add(container1, {row: 0, column: 0});
	
	// Columns
	var dashboardColumns = new qx.ui.groupbox.GroupBox("Dashboard Columns");
	dashboardColumns.setLayout(new qx.ui.layout.VBox(3));
	
	var containerNumber = new qx.ui.container.Composite(new qx.ui.layout.HBox(3).set({
		alignY: "middle"
	}));
	var containerNumberLabel = new qx.ui.basic.Label("Number of columns:").set({
		allowGrowX: true
	});
	var containerNumberSpinner = new qx.ui.form.Spinner(1, document.eyeDashBoard.getContainerNumber(), 5).set({
		minWidth: 50
	});
	containerNumber.add(containerNumberLabel, {flex: 1});
	containerNumber.add(containerNumberSpinner, {flex: 1});
	dashboardColumns.add(containerNumber);
	container1.add(dashboardColumns);
	
	var containerButtons = new qx.ui.container.Composite(new qx.ui.layout.HBox(3).set({
		alignY: "middle",
		alignX: "right"})
	);
	var widgetsButtonAdd = new qx.ui.form.Button("Add Test Widget");
	var containerButtonSave = new qx.ui.form.Button("Save & Apply");
	var containerButtonReset = new qx.ui.form.Button("Reset number");
	containerButtons.add(widgetsButtonAdd);
	containerButtons.add(containerButtonSave);
	containerButtons.add(containerButtonReset);
	container1.add(containerButtons);
	
	containerButtonSave.addListener("click", function (e) {
		document.eyeDashBoard.setContainerNumber(containerNumberSpinner.get("value"));
		document.eyeDashBoard.rebuild();
	});
	
	containerButtonReset.addListener("click", function (e) {
		containerNumberSpinner.set({value: document.eyeDashBoard.getContainerNumber()});
	});
	
	widgetsButtonAdd.addListener("click", function (e) {
		document.eyeDashBoard.addTestWidget();
	});
	
	
	
	container1.add(new qx.ui.menu.Separator());
	
	var p = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));
	container1.add(p);
	
	var myButton1 = new qx.ui.form.Button("FileChooser OPEN (Images & All)");
	myButton1.addListener("execute", function(e) {
		var fc = new eyeos.dialogs.FileChooser(checknum);
		fc.setFilters([{desc: 'Images', patterns: ['*.jpg', '*.png']}]);
		fc.showOpenDialog(mainWindow);
	}, this);
	p.add(myButton1);
	var myButton2 = new qx.ui.form.Button("FileChooser SAVE");
	myButton2.addListener("execute", function(e) {
		var fc = new eyeos.dialogs.FileChooser(checknum);
		fc.showSaveDialog(mainWindow);
	}, this);
	p.add(myButton2);
	var myButton3 = new qx.ui.form.Button("FileChooser SELECT FOLDER");
	myButton3.addListener("execute", function(e) {
		var fc = new eyeos.dialogs.FileChooser(checknum);
		fc.showSelectFolderDialog(mainWindow);
	}, this);
	p.add(myButton3);
	var myButton4 = new qx.ui.form.Button("eyeos.dialog.Dialog");
	myButton4.addListener("execute", function(e) {
		var d = new eyeos.dialogs.Dialog("My Title", "index.php?extern=images/16x16/actions/help-hint.png").set({
			parentWindow: mainWindow,
			centerMethod: 'parentWindow'
		});
		d.open();
	}, this);
	p.add(myButton4);
	var myButton5 = new qx.ui.form.Button("eyeos.dialog.Dialog");
	myButton5.addListener("execute", function(e) {
		var op = new eyeos.dialogs.OptionPane(
				"<b>my message</b>",
				eyeos.dialogs.OptionPane.WARNING_MESSAGE);
		var d = op.createDialog(mainWindow, "My Title", function(result) {eyeos.consoleInfo(result);});
		d.open();
	}, this);
	p.add(myButton5);
	var myButton6 = new qx.ui.form.Button("eyeos.dialog.Dialog (Complex)");
	myButton6.addListener("execute", function(e) {
		var op = new eyeos.dialogs.OptionPane(
				"<b>my message</b>",
				eyeos.dialogs.OptionPane.ERROR_MESSAGE,
				null,
				null,
				[null, 'password']);
		var d = op.createDialog(mainWindow, "My Title", function(result, inputValue) {
			eyeos.consoleInfo(result);
			eyeos.consoleInfo(inputValue);
		});
		d.open();
	}, this);
	p.add(myButton6);
	var myButton7 = new qx.ui.form.Button("Import EyeosUsers to PDO!!!");
	myButton7.addListener("execute", function(e) {
		eyeos.callMessage(checknum, "throwError");
	}, this);
	p.add(myButton7);
	var myButton8 = new qx.ui.form.Button("RunAs application");
	myButton8.addListener("execute", function(e) {
		eyeos.execute("runas", checknum, ["usersettings", "", "This is a customized message from the calling context."]);
	}, this);
	p.add(myButton8);
	var myButton9 = new qx.ui.form.Button("RunAs application (force root)");
	myButton9.addListener("execute", function(e) {
		eyeos.execute("runas", checknum, ["usersettings", "", "You must login as root to proceeed.", "root"]);
	}, this);
	p.add(myButton9);
	var myButton10 = new qx.ui.form.Button("Exception catching");
	myButton10.addListener("execute", function(e) {
		eyeos.callMessage(checknum, "throwException");
	}, this);
	p.add(myButton10);

	var myButton11 = new qx.ui.form.Button("Copy with FSI");
	myButton11.addListener("execute", function(e) {
		eyeos.callMessage(checknum, "copyWithFSI");
	}, this);
	p.add(myButton11);
//	var mySelectBox11 = new eyeos.ui.widgets.LocationSelectBox(checknum);
//	p.add(mySelectBox11);
//	var mySelectBox12 = new eyeos.ui.widgets.LocationSelectBox(checknum, "home:///MyCustomizedpath");
//	p.add(mySelectBox12);
	
	var myTestWidget = new eyeos.playground.TestWidget();
	p.add(myTestWidget);
	
	
	// ########################################################################
	
	var container2 = new qx.ui.container.Composite(new qx.ui.layout.VBox(3)).set({
		marginTop: 100
	});
	mainWindow.add(container2, {row: 0, column: 1});
	var sendNetworkMessage = new qx.ui.form.Button('Send Network Message');
	sendNetworkMessage.addListener('execute', function () {
		var netSync = eyeos.netSync.NetSync.getInstance();
		var message = new eyeos.netSync.Message({
			type: 'Playground',
			name: 'test',
			data: {
				test1: 'test',
				test2: 'test2'
			},
			to: 'eyeID_EyeosUser_root'
		});
		netSync.send(message);
	}, this);
	container2.add(sendNetworkMessage);
	var myButton13 = new qx.ui.form.Button('Upload panel (fixed path)');
	myButton13.addListener('execute', function(e) {
		eyeos.execute('upload', checknum, ['sys:///extern', {allowChangePath: 'false', maxFiles: 2}]);
	}, this);
	container2.add(myButton13);
	
	var myButton14 = new qx.ui.form.Button('Open with (home:///Images/Desert.jpg)');
	myButton14.addListener('execute', function(e) {
		eyeos.execute('openwith', checknum, ['home:///Images/Desert.jpg']);
	}, this);
	container2.add(myButton14);
	
	var myButton15 = new qx.ui.form.Button('Open with (home:///Documents)');
	myButton15.addListener('execute', function(e) {
		eyeos.execute('openwith', checknum, ['home:///Documents']);
	}, this);
	container2.add(myButton15);
	
	var myButton16 = new qx.ui.form.Button('Open with (<unknown type>)');
	myButton16.addListener('execute', function(e) {
		eyeos.execute('openwith', checknum, ['home:///test.xyz']);
	}, this);
	container2.add(myButton16);
	
	//	var myComboBox17 = new eyeos.ui.widgets.LocationComboBox(checknum).set({
	//		width: mySelectBox11.getWidth()
	//	});
	//	container2.add(myComboBox17);
	//
	//	var myComboBox18 = new eyeos.ui.widgets.TreeLocationComboBox(checknum).set({
	//		width: mySelectBox11.getWidth()
	//	});
	//	container2.add(myComboBox18);
	
	var myComboBox19 = new eyeos.ui.widgets.TreeLocationComboBox(checknum, 'home:///~john/Images').set({
		//width: mySelectBox11.getWidth()
		});
	container2.add(myComboBox19);


    var myButton20aa = new qx.ui.form.Button('TEST MESSAGE');
		myButton20aa.addListener('execute', function(e) {
		eyeos.callMessage(checknum, 'createNetSyncMessage', null, function() {
			console.log('CREATED');
		});
	}, this);
	container2.add(myButton20aa);

	
	var myButton20a = new qx.ui.form.Button('PING');
		myButton20a.addListener('execute', function(e) {
		eyeos.callMessage(checknum, '__Presence_ping', null, function() {
			console.log('PING');
		});
	}, this);
	container2.add(myButton20a);
	
	var myButton20 = new qx.ui.form.Button('CLOSE');
		myButton20.addListener('execute', function(e) {
		eyeos.callMessage(checknum, '__Presence_close', null, function() {
			console.log('CLOSE');
		});
	}, this);
	container2.add(myButton20);

	var myButton20b = new qx.ui.form.Button('CHECK ONLINE');
	myButton20b.addListener('execute', function(e) {
		var params = {
			usersId: ['eyeID_EyeosUser_root', 'eyeID_EyeosUser_79', 'eyeID_EyeosUser_91']
		};
		eyeos.callMessage(checknum, '__Presence_checkPresencesByUsersId', params, function() {
			console.log('CheckUser');
		});
	}, this);
	container2.add(myButton20b);


	var myButton21 = new qx.ui.form.Button('Create System Tag');
	myButton21.addListener('execute', function(e) {
		var myTag = new eyeos.tag.BasicTag('senzacolore', 'yellow');
		eyeos.callMessage(checknum, '__UserInfo_createTag', eyeos.tag.BasicTag.toJSon(myTag), function() {
			console.log('Tag Created');	
		}, this, {
			onException:
			function () {
				console.log('Tag NOT Created');
			},
			hideException: true
		});
	}, this);
	
	container2.add(myButton21);

	var myButton22 = new qx.ui.form.Button('Delete System Tag');
	myButton22.addListener('execute', function(e) {
		var myTag = new eyeos.tag.BasicTag('popo', '#CCCCCC');
		eyeos.callMessage(checknum, '__UserInfo_deleteTag', eyeos.tag.BasicTag.toJSon(myTag), function() {
			console.log('Tag Deleted');
		}, this, {
			onException:
			function () {
				console.log('Tag NOT Deleted');
			},
			hideException: true
		});
	}, this);

	container2.add(myButton22);

	var myButton24 = new qx.ui.form.Button('get SystemTag');
	myButton24.addListener('execute', function(e) {
		eyeos.callMessage(checknum, '__FileSystem_getAllTags',
			null, function(results) {
				console.log('Tags received', results);
				for (var i=0; i<results.length; ++i) {
					console.log(results[i]);
				}
			}, this, {
				onException:
				function () {
					console.log('Tag NOT received');
				},
				hideException: false
			});
	}, this);

	container2.add(myButton24);

	var myButton23 = new qx.ui.form.Button('Update System Tag');
	myButton23.addListener('execute', function(e) {
		var oldTag = new eyeos.tag.BasicTag('popo', '#CCCCCC');
		var newTag = new eyeos.tag.BasicTag('popoaaa', '#AAAAAA');
		eyeos.callMessage(checknum, '__UserInfo_updateTag',
			{oldTag: eyeos.tag.BasicTag.toJSon(oldTag),
			  newTag: eyeos.tag.BasicTag.toJSon(newTag)
			}, function() {
			console.log('Tag Updated');
		}, this, {
			onException:
			function () {
				console.log('Tag NOT Updated');
			},
			hideException: false
		});
	}, this);

	container2.add(myButton23);
	
	var filesTree = new eyeos.ui.widgets.FilesTree(checknum).set({
		height: 100,
		fetchDepth: 0
	});
	container2.add(filesTree, {
		flex: 1
	});
	
	/*var myImage22 = new eyeos.ui.widgets.Image('index.php?checknum=' + checknum + '&message=__FileSystem_readFile&params[path]=home:///sample800x600.jpg').set({
		width: 180,
		scale: true,
		forceRatio: 'height'
	});
	container2.add(myImage22);*/
	
	
	// ########################################################################
	
	var container3 = new qx.ui.container.Composite(new qx.ui.layout.VBox(3));
	mainWindow.add(container3, {row: 0, column: 2});
	mainWindow.getLayout().setColumnFlex(2, 1);
	
	var myGroup3 = new qx.ui.groupbox.GroupBox('Play with images...');
	myGroup3.setLayout(new qx.ui.layout.Grid(4, 4));
	myGroup3.getLayout().setColumnFlex(0, 1);
	myGroup3.getLayout().setColumnAlign(0, 'right', 'middle');
	myGroup3.getLayout().setColumnAlign(2, 'right', 'middle');
	container3.add(myGroup3);
	
	myGroup3.add(new qx.ui.basic.Label('Force ratio:'), {row: 0, column: 0});
	
	var ratioDisabled = new qx.ui.form.RadioButton('Disabled');
	myGroup3.add(ratioDisabled, {row: 0, column: 1});
	var ratioHeight = new qx.ui.form.RadioButton('Height to ratio');
	myGroup3.add(ratioHeight, {row: 1, column: 1});
	var ratioWidth = new qx.ui.form.RadioButton('Width to ratio');
	myGroup3.add(ratioWidth, {row: 2, column: 1});
	var ratioAuto = new qx.ui.form.RadioButton('Auto ratio');
	myGroup3.add(ratioAuto, {row: 3, column: 1});
	var manager = new qx.ui.form.RadioGroup(ratioDisabled, ratioHeight, ratioWidth, ratioAuto);
	
	myGroup3.add(new qx.ui.basic.Label('Width:'), {row: 0, column: 2});
	var myTextField31 = new qx.ui.form.TextField('120');
	myGroup3.add(myTextField31, {row: 0, column: 3});
	myGroup3.add(new qx.ui.basic.Label('Height:'), {row: 1, column: 2});
	var myTextField32 = new qx.ui.form.TextField('120');
	myGroup3.add(myTextField32, {row: 1, column: 3});
	myGroup3.add(new qx.ui.basic.Label('Scale:'), {row: 2, column: 2});
	var scaleCheckBox = new qx.ui.form.CheckBox().set({
		value: true,
		enabled: false
	});
	myGroup3.add(scaleCheckBox, {row: 2, column: 3});
	
	var myButton33 = new qx.ui.form.Button('Apply');
	myGroup3.add(myButton33, {row: 3, column: 3});
	
	var myImage34 = new eyeos.ui.widgets.Image('index.php?checknum=' + checknum + '&message=__FileSystem_readFile&params[path]=home:///sample800x600.jpg').set({
		scale: true
	});
	myGroup3.add(new qx.ui.container.Scroll(myImage34), {row: 4, column: 0, colSpan: 4});
	
	var myButton34 = new qx.ui.form.Button('Choose image');
	myGroup3.add(myButton34, {row: 5, column: 2});
	
	myButton33.addListener('execute', function(e) {
		eyeos.consoleLog('Applying new dimension...');
		
		// SCALE
		console.log('SCALE? ' + (scaleCheckBox.getValue() ? 'true' : 'false'));
		myImage34.setScale(scaleCheckBox.getValue());
		
		// RATIO
		if (ratioDisabled.getValue()) {
			myImage34.setForceRatio('disabled');
		} else if (ratioHeight.getValue()) {
			myImage34.setForceRatio('height');
		} else if (ratioWidth.getValue()) {
			myImage34.setForceRatio('width');
		} else if (ratioAuto.getValue()) {
			myImage34.setForceRatio('auto');
		}
		
		// WIDTH / HEIGHT
		if (parseInt(myTextField31.getValue())) {
			myImage34.setWidth(parseInt(myTextField31.getValue()));
		} else {
			myImage34.resetWidth();
		}
		if (parseInt(myTextField32.getValue())) {
			myImage34.setHeight(parseInt(myTextField32.getValue()));
		} else {
			myImage34.resetHeight();
		}
	}, this);
	
	myButton34.addListener('execute', function(e) {
		var fc = new eyeos.dialogs.FileChooser(checknum);
		fc.showOpenDialog(mainWindow, function(option, path) {
			if (option == eyeos.dialogs.FileChooser.APPROVE_OPTION) {
				myImage34.setSource('index.php?checknum=' + checknum + '&message=__FileSystem_readFile&params[path]=' + path);
			}
		}, this);
	}, this);
	
	mainWindow.open();
}

qx.Class.define('eyeos.playground.TestWidget', {
	extend: qx.ui.core.Widget,
	
	construct: function () {
		arguments.callee.base.call(this);
		
		this._setLayout(new qx.ui.layout.VBox());
		this.getChildControl('test-selectbox');
	},
	
	members: {
		
		// overridden
		_createChildControlImpl : function(id) {
			var control;
		
			switch(id) {
				case 'test-selectbox':
					control = new qx.ui.form.SelectBox();
					control.add(new qx.ui.form.ListItem('item1'));
					control.add(new qx.ui.form.ListItem('item2'));
					this._add(control);
					break;
			}
			
			return control || this.base(arguments, id);
		}
	}
});