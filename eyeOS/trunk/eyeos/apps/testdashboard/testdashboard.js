/**
 *  DashBoard Playground App
 */

function testdashboard_application(checknum, pid, args){
	var app = new eyeos.system.EyeApplication("testdashboard", checknum, pid);
	
	var mainWindow = new eyeos.ui.Window(app, "test dashboard");
	mainWindow.setLayout(new qx.ui.layout.VBox(3));
	mainWindow.set({
		minWidth: 800,
		minHeight: 600,
	});
	var buttonsContainer = new qx.ui.container.Composite(new qx.ui.layout.HBox(3));
	mainWindow.add(buttonsContainer);
	var workContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox(3));
	mainWindow.add(workContainer, {flex: 1});
	//-----
	
	var board = new eyeos.ui.dashboard.Board().set({
		columns: 3
	});
	workContainer.add(board, {flex: 1});
	
	
	
	
	//-----BUTTONS
	
	var button1 = new qx.ui.form.Button('Add widget');
	button1.addListener('execute', function() {
		var widget = new eyeos.ui.dashboard.WidgetView().set({height: 60});
		board.addWidget(widget);
	}, this);
	buttonsContainer.add(button1);
	
	mainWindow.open();
}