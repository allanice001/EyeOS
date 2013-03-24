/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function testpresence_application(checknum, pid, user) {
	var app = new eyeos.application.TestPresence(checknum, pid);
	app.drawGUI();
}

qx.Class.define('eyeos.application.TestPresence', {
    extend: eyeos.system.EyeApplication,

	construct: function(checknum, pid) {
		arguments.callee.base.call(this, 'testpresence', checknum, pid);
        this._checknum = checknum;
	},

    members: {
        _checknum: null,
        _content: null,
        
		drawGUI: function() {
            var mainWindow = new eyeos.ui.Window(this, 'Test Contact Manager');
			mainWindow.setLayout(new qx.ui.layout.HBox(0));

            this._content = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                decorator: null
            });
            mainWindow.add(this._content);
            this._update();
            var timer = qx.util.TimerManager.getInstance();
            this._timerId = timer.start(function(){
                this._update();
            }, 5000, this, null);

            mainWindow.open();
        },

        _update: function () {
            this._content.removeAll();
            var contactManager = eyeos.contacts.ContactManager.getInstance();
			contactManager.getAllContacts('accepted', function(results){
                for (var i = 0; i < results.length; ++i) {
                    var box = new qx.ui.container.Composite(new qx.ui.layout.HBox());
                    var myContact = results[i];
					var metadata = myContact.getMetadataInstance();
					var name = metadata.getMeta(['eyeos.user.firstname']) + ' ' + metadata.getMeta(['eyeos.user.lastname']);
                    var nameLabel = new qx.ui.basic.Label(name);
                    box.add(nameLabel);
                    box.add(new qx.ui.core.Spacer(30));
                    var statusText = myContact.getConnected() ? 'CONNECTED' : 'OFFLINE';
                    var statusLabel = new qx.ui.basic.Label(statusText);
                    box.add(statusLabel);

                    this._content.add(box);

                    
                }
            }, this);
        }


    }
});