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

// ----- ESTO ES LA FUNCION APPLICATION NORMAL Y CORRIENTE
function desktop_application(checknum, pid, args) {

    //CREAMOS LA CLASE QUE REPRESENTA A LA APLICACION
    var application = new eyeos.application.Desktop(checknum, pid);
    application.document = document;
    application.initApplication(checknum, args);

    //INICIAMOS TINYMCE, LO HACEMOS AQUI A MODO DE LAZY LOADING
    //QUIZAS HABRIA QUE CREAR UN SISTEMA DE LAZY LOADING Y QUITAR TODO ESTO DE AQUI
    tinyMCE_GZ.init({
        theme: 'advanced',
        plugins: 'table, safari, spellchecker, searchreplace, noneditable',
        languages : 'en',
        disk_cache : true,
        debug : false
    }, function () {
        tinyMCE.init({
            strict_loading_mode : true,
            theme: 'advanced',
            plugins: 'table, safari, spellchecker, searchreplace, noneditable',
            spellchecker_languages : '+English=en',
            theme_advanced_buttons1 : "",
            theme_advanced_buttons2 : "",
            theme_advanced_buttons3 : "",
            theme_advanced_buttons3_add : 'tablecontrols',
            preformatted : true,
            fix_table_elements: 0
        });
    });
}
// ----- ESTO ES LA FUNCION APPLICATION NORMAL Y CORRIENTE

qx.Class.define('eyeos.application.Desktop', {
    extend: eyeos.system.EyeApplication,

    construct: function (checknum, pid) {
        arguments.callee.base.call(this, 'desktop', checknum, pid);
        this.initWidgets(new Array());

    },

    properties: {
        searchBoxFocus : {
            init: false,
            check: 'Boolean',
            event: 'toggleSearchBoxFocus'
        },

        widgets: {
            deferredInit: true
        }
    },

    members: {
        _timerId: null,
        
        initApplication: function(checknum, args) {

            this.document.DesktopApplication = this;
            var user = args[0];

            // modify the title for the user
            this.document.title = 'eyeOS ' + eyeos.version + ' - ' +tr('user') + ' ' + user;

            // Screen
            var screen = new qx.ui.container.Composite(new qx.ui.layout.VBox(0));
            this.document.eyeScreen = screen;

            // Desktop
            this.document.eyeDesktop = new qx.ui.EyeDesktop(new qx.ui.window.Manager());
            this.document.eyeDesktop.setBackgroundColor('#f5f5f5');
            screen.add(this.document.eyeDesktop, {
                flex: 1
            });

            //	Container TabView
            var containtTabs = new qx.ui.container.Composite(new qx.ui.layout.Grow());
            containtTabs.set ({
                'zIndex' : 500002
            });
            this.document.eyeDesktop.add(containtTabs, {
                width:"100%",
                height: "50%"
            });


            //	Tabs
            var tabView = new qx.ui.EyeTabDesktop();
            this.document.eyeDesktopTabs = tabView;

            //	Tab 1
            var applicationsActions = [
            {
                name: tr("Added")

            },
            {
                name: tr("Add Applications")
            }
            ];

            var tagsApplications = [
            {
                id : 0,
                name : tr('All')
            },
            {
                id : -2,
                name : tr('Recent Installed')
            }
            ];

            var pgApplications = new eyeos.ui.tabs.Page(tr('Applications'), checknum, false);
            tabView.add(pgApplications);
            pgApplications.setTags(tagsApplications);
            pgApplications.setActions(applicationsActions);
            pgApplications.populate();
            pgApplications.populateActionToolbar();
            pgApplications.getChildControl("button").blur();

            var bus = eyeos.messageBus.getInstance();
            bus.addListener('eyeos_application_toggleFavorite', function(e) {
                var appName = e.getData()[0];
                var realName = e.getData()[1];
                var isFavorite = e.getData()[2];
                var imagePath = e.getData()[3];
                imagePath = imagePath.replace('48x48', '16x16');
                imagePath = imagePath  + '&nocache=' + eyeos.utils.getRandomValue();
                if (isFavorite) {
                    this.document.eyeFavorites.push(realName);
                    var button = new qx.ui.EyeTaskButtonFavorite(appName, realName, checknum).set({
                        icon: imagePath
                    });
                    this.document.eyeTaskBar.addTaskButton(button);
                } else {
                    this.document.eyeTaskBar.getChildren().forEach(function(child) {
                        if (child.getRealAppName() == realName) {
                            this.document.eyeTaskBar.removeTaskButton(child);
                        }
                    }, this);
                }
            }, this);

            //	Tab 2
            //	var pgWidgets = new qx.ui.tabview.Page(tr('Widgets'));
            //	tabView.add(pgWidgets);

            //	Tab 3 PEOPLE
            var peopleActions = [
            {
                name: tr('Added')

            },
            {
                name: tr('Add Contacts')
            },
            {
                name: tr('Add to List'),
                command: ''
            },
            {
                name: tr('Delete contacts'),
                icon: 'index.php?extern=/images/16x16/actions/list-remove.png',
                command: 'this.deleteContacts()'
            }
            ];

            var pgPeople = new eyeos.ui.tabs.Page(tr("People"), checknum, true);
            tabView.add(pgPeople);
            //modified to stackable
            eyeos.callMessage(checknum, 'getAllTags', null, function (results) {
                var tagAll = {
                    'id': 0,
                    'name': tr('All')
                };
                var pending = {
                    'id' : -1,
                    'name' : tr('Pending')
                }
                results.unshift(tagAll);
                results.unshift(pending);

                pgPeople.setTags(results);
                pgPeople.setActions(peopleActions);
                pgPeople.populate();
                pgPeople.populateActionToolbar();
            }, this);





            //	Tab 4
            var pgGroups = new eyeos.ui.tabs.Page(tr('Groups'), checknum, false);
            tabView.add(pgGroups);
            var tagGroups = new Array();
            tagGroups.push({
                id: -1,
                name: tr('All Groups')
            });
            tagGroups.push({
                id: 0,
                name: tr('Owner')
            });
            tagGroups.push({
                id: 1,
                name: tr('Admin')
            });
            tagGroups.push({
                id: 2,
                name: tr('Editor')
            });
            tagGroups.push({
                id: 3,
                name: tr('Member')
            });

            var actionsGroup = [
            {
                name: tr('Added')

            },
            {
                name: tr('Add Groups')
            },
            {
                name: tr('Create New Group'),
                command: 'this.createNewGroup()'
            }
            ];
            //	pgGroups.setActions(actionsGroup);
            pgGroups.setTags(tagGroups);
            pgGroups.setActions(actionsGroup);
            pgGroups.populate();
            pgGroups.populateActionToolbar();

            // EVENTS tab

            var pgEvents = new eyeos.ui.tabs.Events.Page(checknum);
            tabView.add(pgEvents);

            // --------------------------------------


            //	process the tabs
            tabView.processTabs();

            //	Add tabView to container
            containtTabs.add(tabView);

            //UNTIL HERE ------


            //	The Dashboard & Widget Tests
            var dashboard = new eyeos.dashboard.Board();
            this.document.eyeDesktop.add(dashboard, {
                edge: 0
            });
            this.document.eyeDashBoard = dashboard;
            var containerNumber;
            var self = this;
            if (eyeos.getCurrentUserData().metadata['eyeos.desktop.mode'] != undefined) {
                if (eyeos.getCurrentUserData().metadata['eyeos.desktop.mode'] == 'classic') {
                    dashboard.setContainerNumber(1);
                    dashboard.rebuild();
                    dashboard.removeAllWidgets();
                    this.createDesktopWidgetAlone(this.getChecknum(), 1);
                } else {
                    dashboard.setContainerNumber(eyeos.getCurrentUserData().metadata['eyeos.desktop.dashboard.nbcolumns']);
                    dashboard.rebuild();
                }
            }

            var dbus = eyeos.messageBus.getInstance();
            dbus.addListener('eyeos_desktop_changesDashboard', function (e) {
                if (e.getData()[0] == 'classic') {
                    this.setContainerNumber(1);
                    this.rebuild();
                    this.removeAllWidgets();
                    self.createDesktopWidgetAlone(self.getChecknum(), 1);
                } else {
                    this.setContainerNumber(e.getData()[2]);
                    this.rebuild();
                    if (e.getData()[1] != e.getData()[0]) {
                        this.removeAllWidgets();
                        self.loadWidgets(self.getChecknum());
                    }
                }
            }, dashboard);

            //	decorator rounded top borders
            var border = new qx.ui.decoration.RoundBorderBeveled().set({
                leftTopR: 5,
                rightTopR: 5
            });
            //	decorator rounded all borders
            var borderAll = new qx.ui.decoration.RoundBorderBeveled().set({
                leftTopR: 3,
                rightTopR: 3,
                leftBottomR: 3,
                rightBottomR: 3
            });

            //	infoUser
            var cmpInfoUser= new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
            cmpInfoUser.set({
                decorator: borderAll
            })
            cmpInfoUser.setHeight(18);
            cmpInfoUser.setMaxHeight(18);
            cmpInfoUser.setMarginBottom(3);
            var infoUser = new qx.ui.basic.Label("<b>"+user+"</b>");
            infoUser.setTextColor("#FFFFFF");
            infoUser.setPadding(2);
            infoUser.setFont(new qx.bom.Font(11, ["Lucida Grande", "Verdana"]));
            cmpInfoUser.add(infoUser);
            infoUser.set({
                rich:true
            });

            // administration
            var cmpAdministration= new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
            cmpAdministration.set({
                decorator: borderAll,
                visibility: 'excluded'
            });
            cmpAdministration.setHeight(18);
            cmpAdministration.setMaxHeight(18);
            cmpAdministration.setMarginBottom(3);
            var infoAdministration = new qx.ui.basic.Label('Administration');
            infoAdministration.setTextColor("#FFFFFF");
            infoAdministration.setPadding(2);
            infoAdministration.setFont(new qx.bom.Font().set({
                'family': ["Lucida Grande"],
                'size': 11
            }));
            cmpAdministration.add(infoAdministration);

            cmpAdministration.addListener("mouseover", function () {
                cmpAdministration.setBackgroundColor("#61676d");
            }, this);

            cmpAdministration.addListener("mouseout", function (e) {
                if (!qx.ui.core.Widget.contains(cmpAdministration, e.getRelatedTarget())) {
                    cmpAdministration.setBackgroundColor("#4F565C");
                }
            }, this);

            cmpAdministration.addListener("click", function () {
                eyeos.execute('usermanagement', checknum);
                document.eyeDesktopTabs.hideContent();
            }, this);

            //modified to stackable
            eyeos.callMessage(checknum, 'isAdministrator', null, function(results) {
                if(results) {
                    cmpAdministration.setVisibility('visible');
                }
            }, this);

            //	Settings
            var cmpSettings= new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
            cmpSettings.set({
                decorator: borderAll
            })
            cmpSettings.setHeight(18);
            cmpSettings.setMaxHeight(18);
            cmpSettings.setMarginBottom(3);
            var Settings = new qx.ui.basic.Label(tr("Settings"));
            Settings.setTextColor("#FFFFFF");
            Settings.setPadding(2);
            Settings.setFont(new qx.bom.Font(11, ["Lucida Grande", "Verdana"]));
            cmpSettings.add(Settings);
            cmpSettings.addListener("mouseover", function () {
                cmpSettings.setBackgroundColor("#61676d");
            });
            cmpSettings.addListener("mouseout", function (e) {
                if (!qx.ui.core.Widget.contains(cmpSettings, e.getRelatedTarget())) {
                    cmpSettings.setBackgroundColor("#4F565C");
                }
            });

            cmpSettings.addListener("click", function () {
                eyeos.execute('newusersettings',checknum);
                document.eyeDesktopTabs.hideContent();
            }, this);

            //until here -----------

            //			var cmpHelp= new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
            //			cmpHelp.setBackgroundColor("#61676d");
            //			cmpHelp.set({
            //				decorator: borderAll
            //			})
            //			cmpHelp.setHeight(18);
            //			cmpHelp.setMaxHeight(18);
            //			cmpHelp.setMarginBottom(3);
            //			var Help = new qx.ui.basic.Label("Help");
            //			Help.setTextColor("#FFFFFF");
            //			Help.setPadding(2);
            //			Help.setFont(new qx.bom.Font(11, ["Lucida Grande", "Verdana"]));
            //			cmpHelp.add(Help);
            //			cmpHelp.addListener("mouseover", function () {
            //				cmpHelp.setBackgroundColor("#61676d");
            //			});
            //			cmpHelp.addListener("mouseout", function () {
            //				cmpHelp.setBackgroundColor("#4F565C");
            //			});

            //Sign Out
            var cmpSignOut= new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
            //cmpHelp.setBackgroundColor("#61676d");
            cmpSignOut.set({
                decorator: borderAll
            })
            cmpSignOut.setHeight(18);
            cmpSignOut.setMaxHeight(18);
            cmpSignOut.setMarginBottom(3);
            var signOut = new qx.ui.basic.Label(tr("Sign out"));
            signOut.setTextColor("#FFFFFF");
            signOut.setPadding(2);
            signOut.setFont(new qx.bom.Font(11, ["Lucida Grande", "Verdana"]));
            cmpSignOut.add(signOut);
            cmpSignOut.addListener("mouseover", function () {
                cmpSignOut.setBackgroundColor("#61676d");
            });
            cmpSignOut.addListener("mouseout", function (e) {
                if (!qx.ui.core.Widget.contains(cmpSignOut, e.getRelatedTarget())) {
                    cmpSignOut.setBackgroundColor("#4F565C");
                }
            });

            cmpSignOut.addListener("click", function () {
                var op = new eyeos.dialogs.OptionPane(tr("Are you sure you want to close your session?"), eyeos.dialogs.OptionPane.QUESTION_MESSAGE);
                op.createDialog(null, tr("Close Session"), function(result) {
                    if(result == eyeos.dialogs.OptionPane.YES_OPTION) {
                        var timer = qx.util.TimerManager.getInstance();
                        //                        timer.stop(this._timerId);
                        var userId = eyeos.getCurrentUserData().id;
                        eyeos.execute('logout', -1, userId);
                    }
                }, this).open();
            }, this);

            // building the search textField, with the 'x' icon
            var searchComposite = new qx.ui.container.Composite(new qx.ui.layout.Canvas()).set({
                'backgroundColor' : '#61676d',
                'height' : 26,
                'maxHeight' : 26,
                'allowGrowX' : false,
                'allowGrowY' : false,
                'decorator' : border
            });

            var searchClearIcon = new qx.ui.basic.Image('index.php?extern=images/Close.png').set({
                alignY : 'middle',
                alignX : 'center',
                paddingLeft : 3,
                paddingRight : 3,
                paddingTop : -4
            });
            searchClearIcon.hide();

            searchClearIcon.addListener('click', function (e) {
                searchTextField.resetValue();
                e.getTarget().hide();
                resultComposite.hide();
                resultComposite.removeAll();
                searchTextField.setTextColor('#878787');
                searchTextField.setValue(tr('Search'));
            });

            var searchTextField = new qx.ui.form.TextField(tr('Search'));
            searchTextField.setMarginBottom(0);
            searchTextField.setMaxWidth(120);
            searchTextField.setWidth(120);
            searchTextField.setMargin(0,5,0,5);
            searchTextField.setPadding(1);
            searchTextField.setFont(new qx.bom.Font(11, ['Lucida Grande', 'Verdana']));
            searchTextField.setTextColor('#878787');
            searchTextField.addListener('focus', function () {
                if (searchTextField.getValue() == tr('Search')) {
                    searchTextField.setValue('');
                    searchTextField.setTextColor('#000000');
                }
            });

            searchTextField.addListener('input', function (e) {
                if (e.getTarget().getValue()) {
                    searchClearIcon.show();
                }
                else {
                    searchClearIcon.hide();
                }
            });

            searchComposite.add(searchTextField);
            searchComposite.add(searchClearIcon, {
                right: '5%',
                top : '30%'
            });

            // declaring constants for element and viewall sizes.
            var searchElementSize = 23;
            var searchViewAllSize = 25;

            // creating the decorator object, used for the results layout
            var resultDecorator = new qx.ui.decoration.RoundBorderBeveled().set({
                'outerColor': 'transparent',
                'innerColor': 'black',
                'innerOpacity' : 0.7,
                'leftTopR' : 10,
                'rightTopR' : 10,
                'rightBottomR' : 10,
                'leftBottomR' : 10
            });

            // creating the composite obj, and setting his layout
            // it's supposed to take at most the 70% of the dashboard
            var resultComposite = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                'alignX' : 'left',
                'alignY' : 'middle',
                'allowGrowX' : true,
                'allowGrowY' : true,
                'decorator' : resultDecorator,
                'backgroundColor' : '#FFFFFF',
                'maxHeight' : parseInt(0.7 * qx.bom.Viewport.getHeight())
            });

            resultComposite.addListener('mouseover', function() {
                this.toggleSearchBoxFocus();
            }, this);

            resultComposite.addListener('mouseout', function(e) {
                if (!qx.ui.core.Widget.contains(resultComposite, e.getRelatedTarget())) {
                    this.toggleSearchBoxFocus();
                }
            }, this);

            //this function hides the resultComposite if needed
            document.resultComposite = resultComposite;
            document.getSearchBoxFocus = this.getSearchBoxFocus();

            if(document.addEventListener) {
                document.addEventListener('click', function() {
                    if(!(document.getSearchBoxFocus)) {
                        document.resultComposite.hide();
                    }
                }, false);
            } else {
                document.attachEvent("click", function () {
                    if(!(document.getSearchBoxFocus)) {
                        document.resultComposite.hide();
                    }
                }, false);
            }


            // creating a Listener on keypress event, so we can manage
            // to set or reset the typing interval
            // (after one second it's supposed to start searching)
            var interval = new qx.event.Timer(1000);
            searchTextField.addListener('keypress', function (e) {

                if (!interval.getEnabled()) {
                    interval.start();
                }
                else {
                    interval.restart();
                }
            });

            // creating another Listener on the interval, so it will start the
            // searching process when the interval is elapsed.
            interval.addListener('interval', function (e) {
                // hiding and cleaning the resultComposite before starting a new search
                resultComposite.hide();
                resultComposite.removeAll();

                if (searchTextField.getValue()){
                    // calling the search.php module
                    eyeos.callMessage(checknum, 'search', searchTextField.getValue(), function (results) {
                        // taking the number of plugins
                        var pluginsNumber = 0;
                        for (var plugin in results) {
                            pluginsNumber++;
                        }

                        // calculating the size each plugin can have
                        var pluginsSize = ( resultComposite.getMaxHeight() - searchViewAllSize ) / pluginsNumber;

                        // calculating the number of atoms which can be inserted in each plugin composite
                        var maxAtomAllowed = parseInt (pluginsSize / searchElementSize) - 1;

                        for (plugin in results) {
                            // taking the maxAtomAllowed in each iteration
                            var atomAllowed = maxAtomAllowed;

                            // creating a composite for the category
                            var categoryComposite = new qx.ui.container.Composite(new qx.ui.layout.VBox());

                            // and an HBox Atom for  "Category(n)     View all"
                            var categoryName = new qx.ui.container.Composite(new qx.ui.layout.HBox());

                            // setting a font style and size for the category
                            var categoryFont = new qx.bom.Font().set({
                                'size' : 14,
                                'family' : ["Helvetica"],
                                'bold' : true
                            });

                            // setting the label value with the category's name
                            var resultNumber = results[plugin]['amount'][0];
                            if (!resultNumber) {
                                resultNumber = 0;
                            }

                            var categoryLabel = new qx.ui.basic.Label(plugin+' ('+ resultNumber +')').set({
                                'width' : 250,
                                'padding' : 3,
                                'paddingLeft' : 8,
                                'font' : categoryFont,
                                'textColor' : '#969696'
                            });
                            categoryName.add(categoryLabel);

                            // setting a font style and size for the results
                            var resultsFont = new qx.bom.Font().set({
                                'size' : 12,
                                'family' : ["Helvetica"]
                            });

                            // setting the ViewAll button for the category we are looking at.
                            //							var categoryViewAll = new qx.ui.basic.Label(" ").set({
                            //								'alignX' : 'left',
                            //								'padding' : 3,
                            //								'paddingRight' : 8,
                            //								'cursor' : 'pointer',
                            //								'font' : resultsFont,
                            //								'textColor' : '#969696'
                            //							});
                            //							categoryName.add(categoryViewAll);
                            categoryComposite.add(categoryName);

                            // setting a Listener to capture the pressing button event.
                            //							categoryViewAll.addListener('click', function (e) {
                            //								alert(tr('view all results from') + ' ' + plugin);
                            //							});

                            // iterating on the results struct, to create the output.
                            for (var result in results[plugin]['results']) {
                                if (--atomAllowed >= 0){
                                    var item = new qx.ui.basic.Atom(results[plugin]['results'][result].name).set({
                                        'padding' : 3,
                                        'paddingLeft' : 18,
                                        'width' : 196,
                                        'allowGrowY' : false,
                                        'maxHeight' : searchElementSize,
                                        'font' : resultsFont
                                    });

                                    // saving the attributes on the item object, in order
                                    // to open the paths without rescanning the struct
                                    item.fileAttr = results[plugin]['results'][result];

                                    // Listeners to color the focused result,
                                    // and catch the path of a item file.
                                    item.addListener('mouseout', function (e) {
                                        //										if (!qx.ui.core.Widget.contains(item, e.getRelatedTarget())) {
                                        e.getTarget().setBackgroundColor('#FFFFFF');
                                    //										}
                                    });
                                    item.addListener('mouseover', function (e) {
                                        e.getTarget().setBackgroundColor('#045FB4');
                                    });
                                    item.addListener('click', function (e) {
                                        eyeos.openFile(e.getTarget().fileAttr.path,checknum);
                                    })

                                    // adding the item to the results.
                                    categoryComposite.add(item);
                                }
                            }

                            // inserting the category's composite in the results one.
                            resultComposite.add(categoryComposite);
                        }

                        //						 adding a separator, before inserting the "View all results" button.
                        //						var separator = new qx.ui.menu.Separator().set({
                        //							'height' : 0,
                        //							'width' : 270,
                        //							'backgroundColor' : 'transparent'
                        //						});
                        //						resultComposite.add(separator);

                        //						// adding the "View all results" label.
                        //						var viewAllResults = new qx.ui.basic.Atom(tr('View all results'), 'index.php?extern=images/showall.png').set({
                        //							'alignX' : 'left',
                        //							'paddingLeft' : 8,
                        //							'paddingBottom' : 3,
                        //							'paddingTop' : 3,
                        //							'cursor' : 'pointer',
                        //							'font' : categoryFont,
                        //							'height' : searchViewAllSize,
                        //							'maxHeight' : searchViewAllSize,
                        //							'textColor' : '#045FB4'
                        //						});
                        //						resultComposite.add(viewAllResults);
                        //
                        //						// setting a Listener to capture the clicking label event.
                        //						viewAllResults.addListener('click', function (e) {
                        //							alert(tr("view all results from all categories"));
                        //						});

                        // adding the results to the composite
                        resultComposite.show();
                        qx.core.Init.getApplication().getRoot().add(resultComposite);
                        resultComposite.addListener('appear', function (e) {
                            var documentWidth = qx.bom.Viewport.getWidth();
                            var bounds = this.getBounds();
                            this.setUserBounds(parseInt(documentWidth - bounds.width), 32, bounds.width, bounds.height);
                        });
                    });

                    // stopping the interval timing.
                    interval.stop();
                }
            });

            //Composite that contain search, infoUser, etc...
            var layoutCmp = new qx.ui.layout.HBox(5);
            var cmpTabs = new qx.ui.container.Composite(layoutCmp);
            layoutCmp.setAlignX("right");
            layoutCmp.setAlignY("bottom");
            cmpTabs.setHeight(32);
            cmpTabs.setMaxHeight(32);
            tabView.getSlide().add(cmpTabs, {
                flex: 1
            });
            tabView.getSlide().setBackgroundColor("#4F565C");
            cmpTabs.add(cmpInfoUser);
            cmpTabs.add(cmpAdministration);
            cmpTabs.add(cmpSettings);
            cmpTabs.add(cmpSignOut);
            cmpTabs.add(searchComposite);

            //UNTIL HERE FINAL -------
            // Panel
            var panel = new desktop.Panel();
            screen.add(panel);

            // Global Elements
            this.document.eyeTabs = tabView;
            this.document.eyeScreen = screen;
            this.document.eyePanel = panel;
            this.document.eyeTaskBar = this.document.eyePanel._taskBar;
            var meta = eyeos.getCurrentUserData().metadata;

            this.document.eyeDesktop.addListener("appear",function(){

                // BACKGROUND & WALLPAPER

                this._imageContainer = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
                this._dashImage = new qx.ui.basic.Image().set({
                    scale: true
                });
                if (meta['eyeos.user.desktop.wallpaperMode'] == undefined) {
                    this._dashImage.setBackgroundColor('#F4F4F4');
                } else {
                    if (meta['eyeos.user.desktop.wallpaperMode'] == 'color') {
                        var colors = meta['eyeos.user.desktop.backgroundColors'];
                        for (var i in colors) {
                            if (colors[i] == 'true') {
                                this._dashImage.setBackgroundColor(i);
                            }
                        }
                    } else {
                        this._dashImage.setBackgroundColor('transparent');
                        var splitted = meta['eyeos.user.desktop.wallpaper'].split('/');
                        if(meta['eyeos.user.desktop.wallpaper']) {
                            if (splitted[0] == 'sys:') {
                                this._dashImage.setSource('index.php?extern=images/wallpapers/' + splitted[splitted.length - 2] + '/' + splitted[splitted.length - 1]);
                            } else {
                                this._dashImage.setSource('index.php?checknum=' + this.getChecknum() + '&message=__FileSystem_readFile&params[path]=' + meta['eyeos.user.desktop.wallpaper']);
                            }
                        } else {
                            this._dashImage.setSource('index.php?extern=images/wallpapers/nature/default.jpg');
                        }

                    }
                }

                var bounds = this.document.eyeDesktop.getBounds();
                //
                this._imageContainer.set({
                    width: bounds.width,
                    height: bounds.height,
                    allowGrowX: true,
                    allowStretchX: true,
                    allowStretchY: true,
                    allowGrowY: true
                });
                //
                this._dashImage.set({
                    width: bounds.width,
                    height: bounds.height,
                    allowGrowX: true,
                    allowStretchX: true,
                    allowStretchY: true,
                    allowGrowY: true
                });
                this._imageContainer.add(this._dashImage);
                this.document.eyeDesktop.add(this._imageContainer);
                this._dashImage.set({
                    zIndex: 10
                });

                // LOGIN APPLICATIONS

                if (meta['eyeos.user.applications.onLogin'] != undefined) {
                    var onLoginApps = meta['eyeos.user.applications.onLogin'];
                    for (var i in onLoginApps) {
                        if (onLoginApps[i] == 'true') {
                            eyeos.execute(i, this.getChecknum());
                        }
                    }
                }
            },this);

            this.document.eyeDesktop.addListener('resize', function() {
                var bounds = this.document.eyeDesktop.getBounds();

                if (this._imageContainer != undefined && this._dashImage != undefined) {
                    this._imageContainer.set({
                        width: bounds.width,
                        height: bounds.height
                    });
                    //
                    this._dashImage.set({
                        width: bounds.width,
                        height: bounds.height
                    });
                }
            }, this);

            var dbus = eyeos.messageBus.getInstance();
            dbus.addListener('eyeos_desktop_changeWallpaper', function (e) {

                var mode = e.getData()[0];
                var item = e.getData()[1];

                if (mode != undefined && item != undefined) {
                    if (mode == 'color') {
                        this._dashImage.setSource(null);
                        this._dashImage.setBackgroundColor(item);
                    } else {
                        this._dashImage.setBackgroundColor('transparent');
                        var splitted = item.split('/');
                        if (splitted[0] == 'sys:') {
                            this._dashImage.setSource('index.php?extern=images/wallpapers/' + splitted[splitted.length - 2] + '/' + splitted[splitted.length - 1]);
                        } else {
                            this._dashImage.setSource('index.php?checknum=' + this.getChecknum() + '&message=__FileSystem_readFile&params[path]=' + item);
                        }
                    }
                }
            }, this);

            /*
			 * 
			 *  
			 *   
			 *     adding widgets....
			 */
            if (meta['eyeos.desktop.mode'] == 'dashboard') {
                // TODO: HARDCODED PART, WE NEED A MANAGER HERE !!!
                this.loadWidgets(this.getChecknum());
            }

            eyeos.callMessage(checknum, 'getFavoriteApplications', '', function (results) {
                this.document.eyeFavorites = new Array();
                for (var i=0; i < results.length; ++i) {
                    this.document.eyeFavorites[i] = results[i]['name'];
                    var imagePath = results[i]['smallImagePath'] +'&nocache=' + eyeos.utils.getRandomValue();

                    var appName = results[i]['displayName'];

                    var button = new qx.ui.EyeTaskButtonFavorite(appName, results[i]['name'], checknum).set({
                        icon: imagePath
                    });
                    this.document.eyeTaskBar.addTaskButton(button);
                }
            }, this);

            qx.core.Init.getApplication().getRoot().add(screen , {
                edge: 0
            });
        },

        loadWidgets: function (checknum) {

            this.setWidgets([]);

            //modified to stackable
            eyeos.callMessage(checknum, 'loadWidgets', null, function(widgets) {
                var favoritesWidget = null;
                if (widgets && widgets.favorites && widgets.favorites.installed == 'true') {
                    favoritesWidget = this.createFavoriteAppsWidget(checknum, 'favorites',  widgets.favorites);
                }
                document.DesktopApplication.getWidgets().push({
                    widget: favoritesWidget ,
                    create: document.DesktopApplication.createFavoriteAppsWidget,
                    checknum: checknum,
                    title: favoritesWidget ? favoritesWidget.getTitle() : tr('Favorites Applications'),
                    value: 'favorites'
                });

                var groupsWidget = null;
                if (widgets && widgets.groups && widgets.groups.installed == 'true') {
                    groupsWidget = this.createMyGroupsWidget(checknum, 'groups', widgets.groups);
                }
                document.DesktopApplication.getWidgets().push({
                    widget: groupsWidget ,
                    create: document.DesktopApplication.createMyGroupsWidget,
                    checknum: checknum,
                    title: groupsWidget ? groupsWidget.getTitle() : tr('My Groups'),
                    value: 'groups'
                });

                var filesWidget = null;
                if (widgets && widgets.files && widgets.files.installed == 'true') {
                    filesWidget = this.createFilesWidget(checknum, 'files', 'Home', widgets.files);
                }
                document.DesktopApplication.getWidgets().push({
                    widget: filesWidget ,
                    create: document.DesktopApplication.createFilesWidget,
                    checknum: checknum,
                    title: filesWidget ? filesWidget.getTitle() : tr('Files'),
                    value: 'files'
                });

                var notesWidget = null;
                if (widgets && widgets.notes && widgets.notes.installed == 'true') {
                    notesWidget = this.createNotesWidget(checknum, 'notes', widgets.notes);
                }
                document.DesktopApplication.getWidgets().push({
                    widget: notesWidget ,
                    create: document.DesktopApplication.createNotesWidget,
                    checknum: checknum,
                    title: notesWidget ? notesWidget.getTitle() : tr('Notes'),
                    value: 'notes'
                });


                var eventsWidget = null;
                if (widgets && widgets.events && widgets.events.installed == 'true') {
                    //console.log(widgets.events); //FIXME: to pass it to each createWidget function...
                    eventsWidget = this.createEventsWidget(checknum, 'events', widgets.events);
                }
                document.DesktopApplication.getWidgets().push({
                    widget: eventsWidget ,
                    create: document.DesktopApplication.createEventsWidget,
                    checknum: checknum,
                    title: eventsWidget ? eventsWidget.getTitle() : tr('Events'),
                    value: 'events'
                });
					
                var desktopWidget = null;
                if (widgets && widgets.desktop && widgets.desktop.installed == 'true') {
                    desktopWidget = this.createDesktopWidget(checknum, 'desktop', widgets.desktop);
                }
                document.DesktopApplication.getWidgets().push({
                    widget: desktopWidget ,
                    create: document.DesktopApplication.createDesktopWidget,
                    checknum: checknum,
                    title: desktopWidget ? desktopWidget.getTitle() : tr('Desktop'),
                    value: 'desktop'
                });

                //					var mailWidget = null;
                //					if (widgets && widgets.mail && widgets.mail.installed == 'true') {
                //						var mailWidget = this.createMailWidget(checknum, 'mail', widgets.mail);
                //					}
                //					document.DesktopApplication.getWidgets().push({
                //						widget: mailWidget ,
                //						create: document.DesktopApplication.createMyGroupsWidget,
                //						checknum: checknum,
                //						title: mailWidget ? mailWidget.getTitle() : 'Mail',
                //						value: 'mail'
                //					});
                this.document.widgets = document.DesktopApplication.getWidgets();
                eyeos.messageBus.getInstance().send('desktop', 'widgetsLoaded');
            }, this);
        },

        createDesktopWidgetAlone: function (checknum, id, settings) {
            var widget = new eyeos.dashboard.Widget(tr('Desktop'), id, 'files', true, checknum).set({
                icon: 'index.php?extern=/images/16x16/apps/system-file-manager.png'
            });
            var self = this;
			
            var widgetContainer = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
                'allowShrinkY': false,
                padding: 5
            });
            widget.setUserData('container', widgetContainer);
            widget.addContent(widgetContainer);
            createContent(checknum, 'home://~' + eyeos.getCurrentUserName() + '/Desktop');

            function createContent(checknum, path) {
                widgetContainer.setUserData('path', path);
                eyeos.callMessage(
                    checknum,
                    "__FileSystem_browsePath",
                    new Array(path, null, this._browseOptions),
                    function (results) {
                        widgetContainer.removeAll();
                        var files = results.files;
                        for (var i = 0; i < files.length; ++i) {
                            self.createInnerContent(widgetContainer, files[i], true);
                        }
                    });
            }

            widget.openAndPlace(this.document.eyeDashBoard.getFirstContainer(),0);
            widget.toggleBackground();

            var dbus = eyeos.messageBus.getInstance();
            var self = this;

            dbus.addListener('eyeos_files_new', function (e) {
                var sourcePath = e.getData()[0];
                var newFiles = e.getData()[1];
                if (this.getUserData('path') == sourcePath) {
                    self.createInnerContent(this, newFiles, true);
                }
            }, widgetContainer);

            dbus.addListener('eyeos_files_delete', function (e) {
                var sourcePath = e.getData()[0];
                var newFiles = e.getData()[1];
                var widgetChildrens = this.getChildren();
                var widgetPaths = new Array();

                for (var i = 0; i < widgetChildrens.length; ++i) {
                    widgetPaths.push(widgetChildrens[i].getUserData('path'));
                }

                for (var i = 0; i < newFiles.length; ++i) {
                    var index = widgetPaths.indexOf(newFiles[i]);
                    if (index != -1 && widgetChildrens[index] != undefined) {
                        widgetChildrens[index].destroy();
                    }
                }
            }, widgetContainer);
        },

        createDesktopWidget: function (checknum, id, settings) {
            var widget = new eyeos.dashboard.Widget(tr('Desktop'), id, 'files', false, checknum).set({
                icon: 'index.php?extern=/images/16x16/apps/system-file-manager.png'
            });
			
            var self = this;
            widget.setExecuteFullAppParameters(new Array("home://~root/Desktop"));

            var widgetContainer = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
                'allowShrinkY': false,
                padding: 5
            });
            widget.setUserData('container', widgetContainer);
            widget.addContent(widgetContainer);
            createContent(checknum, 'home://~' + eyeos.getCurrentUserName() + '/Desktop');

            function createContent(checknum, path) {
                widgetContainer.setUserData('path', path);
                eyeos.callMessage(
                    checknum,
                    "__FileSystem_browsePath",
                    new Array(path, null, this._browseOptions),
                    function (results) {
                        widgetContainer.removeAll();
                        var files = results.files;
                        for (var i = 0; i < files.length; ++i) {
                            this.createInnerContent(widgetContainer, files[i], false);
                        }
                    }, document.DesktopApplication);
            }

            var dbus = eyeos.messageBus.getInstance();
            var self = this;
			
            dbus.addListener('eyeos_files_new', function (e) {
                var sourcePath = e.getData()[0];
                var newFiles = e.getData()[1];
                if (this.getUserData('path') == sourcePath) {
                    self.createInnerContent(this, newFiles, false);
                }
            }, widgetContainer);

            dbus.addListener('eyeos_files_delete', function (e) {
                var sourcePath = e.getData()[0];
                var newFiles = e.getData()[1];
                var widgetChildrens = this.getChildren();
                var widgetPaths = new Array();

                for (var i = 0; i < widgetChildrens.length; ++i) {
                    widgetPaths.push(widgetChildrens[i].getUserData('path'));
                }

                for (var i = 0; i < newFiles.length; ++i) {
                    var index = widgetPaths.indexOf(newFiles[i]);
                    if (index != -1 && widgetChildrens[index] != undefined) {
                        widgetChildrens[index].destroy();
                    }
                }
            }, widgetContainer);

            widget.openAndPlace(document.eyeDashBoard.getFirstContainer(), 0);
            return widget;
        },

        createFilesWidget: function(checknum, id, selected, settings) {
			
            if (settings == null) {
                settings = '';
            }

            var self = this;

            var widget = new eyeos.dashboard.Widget(tr('Files'), id, 'files', false, checknum).set({
                icon: 'index.php?extern=/images/16x16/apps/system-file-manager.png'
            });

            if(settings.minimized) {
                widget.toggleMinimize();
            }

            var buttonsLayout = new qx.ui.container.Composite().set({
                layout: new qx.ui.layout.HBox(),
                backgroundColor: '#eeeeee',
                marginLeft: 10,
                marginRight: 10,
                marginTop: 10,
                padding: 3
            });
            widget.addContent(buttonsLayout);
            createButtons(checknum);
            var widgetContainer = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
                'allowShrinkY': false,
                padding: 5
            });
            widget.setUserData('container', widgetContainer);

            function createButtons (checknum) {
                buttonsLayout.removeAll();
                //	decorator rounded all borders
                var borderAll = new qx.ui.decoration.RoundBorderBeveled().set({
                    leftTopR: 3,
                    rightTopR: 3,
                    leftBottomR: 3,
                    rightBottomR: 3
                });

                createButton(tr('Home'), 'home:///');
                createButton(tr('Documents'), 'home:///Documents');
                createButton(tr('Music'), 'home:///Music');
                createButton(tr('Images'), 'home:///Images');
                //createButton(tr('Shared'), 'path');

                function createButton (name, path) {
                    var button = new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
                    button.set({
                        decorator: new qx.ui.decoration.RoundBorderBeveled(null, null, 1, 5, 5, 5, 5)
                    })
                    button.setHeight(18);
                    button.setMaxHeight(18);
                    var buttonLabel = new qx.ui.basic.Label(tr(name));
                    buttonLabel.setPadding(2);
                    buttonLabel.setFont(new qx.bom.Font(11, ["Lucida Grande", "Verdana"]));
                    button.setUserData('path', path);
                    button.add(buttonLabel);
                    if (selected == name) {
                        button.setBackgroundColor("#61676d");
                        buttonLabel.setTextColor('#ffffff');

                    } else {
                        buttonLabel.setTextColor("#000000");
                        button.addListener("mouseout", function (e) {
                            if (!qx.ui.core.Widget.contains(button, e.getRelatedTarget())) {
                                button.setBackgroundColor("#eeeeee");
                                buttonLabel.setTextColor('#000000');
                            }
                        });
                    }

                    button.addListener("mouseover", function () {
                        button.setBackgroundColor("#61676d");
                        buttonLabel.setTextColor('#ffffff');
                    });

                    button.addListener("click", function () {
                        selected = name;
                        createButtons(checknum);
                        createContent(checknum, this.getUserData('path'));
                    });

                    buttonsLayout.add(button);
                }

                //create UPLOAD button
                buttonsLayout.add(new qx.ui.core.Spacer(), {
                    flex: 1
                });

                var uploadButton = new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
                uploadButton.set({
                    decorator: borderAll,
                    alignX: 'right'
                })
                uploadButton.setHeight(18);
                uploadButton.setMaxHeight(18);
                var uploadLabel = new qx.ui.basic.Label(tr("Upload"));
                uploadLabel.setTextColor("#000000");
                uploadLabel.setPadding(2);
                uploadLabel.setFont(new qx.bom.Font(11, ["Lucida Grande", "Verdana"]));
                uploadButton.add(uploadLabel);
                uploadButton.addListener("mouseover", function () {
                    uploadButton.setBackgroundColor("#61676d");
                    uploadLabel.setTextColor('#ffffff');
                });
                uploadButton.addListener("mouseout", function (e) {
                    if (!qx.ui.core.Widget.contains(uploadButton, e.getRelatedTarget())) {
                        uploadButton.setBackgroundColor("#eeeeee");
                        uploadLabel.setTextColor('#000000');
                    }

                });
                uploadButton.addListener("click", function () {
                    eyeos.execute('uploadpanel',checknum);
                }, this);
				
                buttonsLayout.add(uploadButton);
            }


            widget.addContent(widgetContainer);
            createContent(checknum);

            var dbus = eyeos.messageBus.getInstance();
			
            dbus.addListener('eyeos_files_new', function (e) {
                var sourcePath = e.getData()[0];
                var newFiles = e.getData()[1];
                if (this.getUserData('path') == sourcePath) {
                    self.createInnerContent(this, newFiles, false);
                }
            }, widgetContainer);

            dbus.addListener('eyeos_files_delete', function (e) {
                var sourcePath = e.getData()[0];
                var newFiles = e.getData()[1];
                var widgetChildrens = this.getChildren();
                var widgetPaths = new Array();

                for (var i = 0; i < widgetChildrens.length; ++i) {
                    widgetPaths.push(widgetChildrens[i].getUserData('path'));
                }

                for (var i = 0; i < newFiles.length; ++i) {
                    var index = widgetPaths.indexOf(newFiles[i]);
                    if (index != -1 && widgetChildrens[index] != undefined) {
                        widgetChildrens[index].destroy();
                    }
                }
            }, widgetContainer);

            dbus.addListener('eyeos_files_rename', function (e) {
                var sourcePath = e.getData()[0].replace(/\\/g,'/').replace(/\/[^\/]*\/?$/, '')+'/';
                if (this.getUserData('path') == sourcePath) {
                    eyeos.callMessage(
                        checknum,
                        "__FileSystem_browsePath",
                        new Array(sourcePath, null, this._browseOptions),
                        function (results) {
                            widgetContainer.removeAll();
                            var files = results.files;
                            for (var i = 0; i < files.length; ++i) {
                                this.createInnerContent(widgetContainer, files[i]);
                            }
                        },
                        document.DesktopApplication
                        );
                }
            }, widgetContainer);

            function createContent(checknum, path) {
                if (path == null) {
                    path = 'home://~' + eyeos.getCurrentUserName() + '/';
                }
                widgetContainer.setUserData('path', path);
                eyeos.callMessage(
                    checknum,
                    "__FileSystem_browsePath",
                    new Array(path, null, this._browseOptions),
                    function (results) {
                        widgetContainer.removeAll();
                        var files = results.files;
                        for (var i = 0; i < files.length; ++i) {
                            this.createInnerContent(widgetContainer, files[i]);
                        }
                    },
                    document.DesktopApplication
                    );
            }

            var container = settings.column ? document.eyeDashBoard.getContainer(settings.column) : document.eyeDashBoard.getContainer(1);
            var position = settings.position? parseInt(settings.position) : 0;
            widget.openAndPlace(container, position);
            return widget;
        },

        createInnerContent: function (widgetContainer, file, alone) {
            var checknum = this.getChecknum();
            var imageExtensions = ['JPG', 'JPEG', 'PNG', 'GIF'];
            var videoExtensions = ['FLV'];
            var musicExtensions = ['MP3', 'M4A'];
            var docExtensions = ['EDOC', 'DOC', 'TXT', 'XLS', 'ODS'];
            var zipExtensions = ['ZIP'];
            var image = null;
            if (file.type == 'folder') {
                image = 'index.php?extern=images/48x48/places/folder.png';
            } else if (docExtensions.indexOf(file.extension) != -1) {
                image = 'index.php?extern=images/48x48/mimetypes/application-msword.png';
            } else if (imageExtensions.indexOf(file.extension) != -1) {
                image = 'index.php?extern=images/48x48/mimetypes/image-x-generic.png';
            } else if (musicExtensions.indexOf(file.extension) != -1) {
                image = 'index.php?extern=images/48x48/mimetypes/audio-x-generic.png';
            } else if (videoExtensions.indexOf(file.extension) != -1) {
                image = 'index.php?extern=images/48x48/mimetypes/audio-vnd.rn-realvideo.png';
            }else if (zipExtensions.indexOf(file.extension) != -1) {
                image = 'index.php?extern=images/48x48/mimetypes/application-x-gzip.png';
            } else if(file.extension == 'LNK') {
                var info = qx.util.Json.parse(file.content);
                image = info.icon;
            }else {
                image = 'index.php?extern=images/48x48/mimetypes/application-x-zerosize.png';
            }
            var name = file.name;
            if(file.extension == 'LNK') {
                name = name.substr(0, name.length-4);
            }
            var atom = new qx.ui.basic.Atom(name, image).set({
                rich: true,
                'iconPosition': 'top',
                //'font': new qx.bom.Font(12, ['Helvetica', 'Arial', 'Sans-serif']),
                //'textColor': '#FFFFFF',
                'width': 76,
                'padding': 5,
                decorator: new qx.ui.decoration.RoundBorderBeveled(null, null, 1, 5, 5, 5, 5)
            });

            if (alone) {
                atom.addListener('appear', function (e) {
                    var domele = this.getChildControl('label').getContainerElement().getDomElement();
                    domele.childNodes[0].style.fontFamily = 'Helvetica';
                    domele.childNodes[0].style.fontSize = '12px';
                    domele.childNodes[0].style.textShadow =  '#000000 0px 0px 1px';
                    domele.childNodes[0].style.color = '#FFFFFF';
                    domele.childNodes[0].style.fontWeight = 'bold';
                });
            }

            //			atom.getChildControl('label').set({
            //				'shadow': new qx.ui.decoration.Single(1, 'solid', '#404040')
            //			});
			
            atom.setUserData('path', file.absolutepath);
            if (file.type == 'folder') {
                atom.addListener('dblclick', function () {
                    eyeos.execute('files', checknum, [this.getUserData('path')]);
                });
            } else {
                var listenerFunction =  function () {
                    eyeos.openFile(this.getUserData('path'), checknum);
                };
                atom.addListener('dblclick', listenerFunction);
            }
            atom.addListener('mouseover', function () {
                this.setDecorator(new qx.ui.decoration.RoundBorderBeveled(null, '#CCCCCC', 1, 5, 5, 5, 5));
            });

            atom.addListener('mouseout', function (e) {
                if (!qx.ui.core.Widget.contains(atom, e.getRelatedTarget())) {
                    this.setDecorator(new qx.ui.decoration.RoundBorderBeveled(null, null, 1, 5, 5, 5, 5));
                }
            });
            widgetContainer.add(atom);
        },

        createFavoriteAppsWidget: function(checknum, id, settings) {
            if (settings == null) {
                settings = '';
            }
			
            var widget = new eyeos.dashboard.Widget(tr('Favorite Applications'), id, '', false, checknum).set({
                icon: 'index.php?extern=/images/16x16/apps/preferences-desktop-default-applications.png'
            });

            if(settings.minimized) {
                widget.toggleMinimize();
            }

            //this.value = value;
            widget.container = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
                allowShrinkY: false,
                padding: 5
            });
            widget.addContent(widget.container);

            // in order to avoid qooxdoo bug...
            widget.container.add(new qx.ui.container.Composite().set({
                height: 50,
                allowGrowY: false,
                width: 1,
                allowGrowX: false
            }));

            function createFavoriteItem(appName, displayName, imagePath, father) {
                //				if (item instanceof qx.ui.EyeTaskButtonFavorite) {
                // var appName = item.getLabel();
                var app = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                    alignX : 'center',
                    alignY : 'middle',
                    width : 76,
                    height: 76,
                    padding: 5,
                    decorator: new qx.ui.decoration.RoundBorderBeveled(null, null, 1, 5, 5, 5, 5)
                });
                // app.setUserData('realName', item.getRealAppName());
                app.setUserData('realName', displayName);
                // var url = item.getIcon();
                //url = url +'&nocache=' + eyeos.utils.getRandomValue();
                var image = new qx.ui.basic.Image(imagePath).set({
                    width: 48,
                    alignX : 'center',
                    height: 48,
                    allowGrowX: false,
                    allowGrowY: false,
                    margin: 3
                //scale: true
                });
                app.add(image);
                var label = new qx.ui.basic.Label().set({
                    rich: true,
                    value: appName,
                    alignX : 'center',
                    paddingTop: 3,
                    marginRight: 0,
                    textAlign: 'center',
                    font: new qx.bom.Font(11, ['Lucida Grande', 'Verdana'])
                });
                app.add(label);

                app.addListener('dblclick', function() {
                    eyeos.execute(this.getUserData('realName'), checknum);
                });

                app.addListener('mouseover', function () {
                    this.setDecorator(new qx.ui.decoration.RoundBorderBeveled(null, '#CCCCCC', 1, 5, 5, 5, 5));
                });

                app.addListener('mouseout', function (e) {
                    if (!qx.ui.core.Widget.contains(app, e.getRelatedTarget())) {
                        this.setDecorator(new qx.ui.decoration.RoundBorderBeveled(null, null, 1, 5, 5, 5, 5));
                    }
                });

                father.container.add(app);
            //				}
            }

            if ((this instanceof Object) && (widget instanceof eyeos.dashboard.Widget)) {
                eyeos.callMessage(checknum, 'getFavoriteApplications', '', function (results) {
                    for (var i=0; i < results.length; ++i) {
                        var name = results[i]['name'];
                        var imagePath = results[i]['imagePath'] +'&nocache=' + eyeos.utils.getRandomValue();

                        var appName = results[i]['displayName'];

                        createFavoriteItem(appName, name, imagePath, this);
                    }

                //					for (var i=0; i < results.length; ++i) {
                //						var name = results[i]['name'];
                //						var displayName = results[i]['displayName'];
                //						var imagePath = results[i]['imagePath'] +'&nocache=' + eyeos.utils.getRandomValue();
                //						createFavoriteItem(displayName, name, imagePath, this);
                //					}
                }, widget);
            }

            //			document.eyeTaskBar.addListener('favoriteAdded', function(e) {
            //				var imagePath = e.getData().getIcon();
            //				if(imagePath) {
            //					imagePath = imagePath.replace('16x16', '48x48');
            //				}
            //
            //				createFavoriteItem(e.getData().getLabel(), e.getData().getRealAppName(), imagePath, this);
            //			}, widget);

            //			document.eyeTaskBar.addListener('favoriteRemoved', function(e) {
            //				var items = this.container.getChildren();
            //				for (var i = 0; i < items.length; ++i) {
            //					if ((items[i] instanceof qx.ui.container.Composite)) {
            //						var childrens = items[i].getChildren();
            //						for (var j = 0; j < childrens.length; ++j) {
            //							if ((childrens[j] instanceof qx.ui.basic.Label)) {
            //								if (childrens[j].getValue() == e.getData().getLabel()) {
            //									this.container.remove(items[i]);
            //								}
            //							}
            //						}
            //					}
            //				}
            //			}, widget);

            var dbus = eyeos.messageBus.getInstance();
            dbus.addListener('eyeos_application_toggleFavorite', function (e) {
                var name = e.getData()[0];
                var appRealName = e.getData()[1];
                var isFavorite = e.getData()[2];
                var imagePath = e.getData()[3];

                var items = this.container.getChildren();

                if (!isFavorite) {
                    for (var i = 0; i < items.length; ++i) {
                        if ((items[i] instanceof qx.ui.container.Composite)) {
                            if (items[i].getUserData('realName') == appRealName) {
                                this.container.remove(items[i]);
                            }
                        }
                    }
                } else {
                    createFavoriteItem(name, appRealName, imagePath, this);
                }
            }, widget);

            var container = settings.column? document.eyeDashBoard.getContainer(settings.column) : document.eyeDashBoard.getContainer(1);
            var position = settings.position? parseInt(settings.position) : 0;
            widget.openAndPlace(container, position);
            return widget;
        },

        createNotesWidget: function(checknum, id,  settings) {
            if (settings == null) {
                settings = '';
            }

            var widget = new eyeos.dashboard.Widget(tr('Notes'), id, 'notepad', false, checknum).set({
                icon: 'index.php?extern=/images/16x16/apps/basket.png'
            });

            if(settings.minimized) {
                widget.toggleMinimize();
            }

            var widgetContainer = new qx.ui.container.Composite(new qx.ui.layout.Grow()).set({
                height: 150
            });

            widget.setUserData('container', widgetContainer);
            widget.addContent(widgetContainer);

            var content = '';
            var richWidget = new qx.ui.form.TextArea(content);
            eyeos.callMessage(checknum, 'readNotesWidget', '', function (results) {
                content = results;
                richWidget.setValue(results);
            });

            richWidget.set({
                decorator: new qx.ui.decoration.Single(1, 'solid', '#A4A4A4').set({
                    styleTop: null,
                    styleRight: null,
                    styleLeft: null,
                    styleBottom: null
                }),
                backgroundColor: 'white',
                padding: 10
            });
            var notesTimer = new qx.event.Timer(3000);
            notesTimer.addListener('interval', function(e) {
                notesTimer.stop();
                eyeos.callMessage(checknum, 'writeNotesWidget', richWidget.getValue(), function (results) {
                    });
            });
            richWidget.addListener('input', function(e) {
                notesTimer.restart();
            });
            widgetContainer.add(richWidget);

            var container = settings.column? document.eyeDashBoard.getContainer(settings.column) : document.eyeDashBoard.getContainer(1);
            var position = settings.position? parseInt(settings.position) : 0;
            widget.openAndPlace(container, position);
            return widget;
        },

        createMailWidget: function(checknum, id, settings) {
            if (settings == null) {
                settings = '';
            }

            var widget = new eyeos.dashboard.Widget(tr('Mail'), id, 'mail', false, checknum).set({
                icon: 'index.php?extern=/images/16x16/apps/internet-mail.png'
            });

            var widgetContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                //'allowShrinkY': false
                });

            widget.setUserData('container', widgetContainer);
            widget.addContent(widgetContainer);

            function createButtonsMail (checknum) {
                //create buttons (inbox and Composite)
                var buttonsLayout = new qx.ui.container.Composite().set({
                    layout: new qx.ui.layout.HBox().set({
                        alignX: 'right'
                    }),
                    backgroundColor: '#eeeeee',
                    marginLeft: 10,
                    marginRight: 10,
                    padding: 3
                });
                widgetContainer.add(buttonsLayout);

                //	decorator rounded all borders
                var borderAll = new qx.ui.decoration.RoundBorderBeveled().set({
                    leftTopR: 3,
                    rightTopR: 3,
                    leftBottomR: 3,
                    rightBottomR: 3
                });

                //	Inbox Button
                var inboxButton = new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
                inboxButton.set({
                    decorator: borderAll
                })
                inboxButton.setHeight(18);
                inboxButton.setMaxHeight(18);
                var inboxLabel = new qx.ui.basic.Label(tr("Inbox"));
                inboxLabel.setTextColor("#000000");
                inboxLabel.setPadding(2);
                inboxLabel.setFont(new qx.bom.Font(11, ["Lucida Grande", "Verdana"]));
                inboxButton.add(inboxLabel);
                inboxButton.addListener("mouseover", function () {
                    inboxButton.setBackgroundColor("#61676d");
                    inboxLabel.setTextColor('#ffffff');
                });
                inboxButton.addListener("mouseout", function (e) {
                    if (!qx.ui.core.Widget.contains(inboxButton, e.getRelatedTarget())) {
                        inboxButton.setBackgroundColor("#eeeeee");
                        inboxLabel.setTextColor('#000000');
                    }
					
                });

                inboxButton.addListener("click", function () {
                    // open mail app
                    eyeos.execute('mail',checknum);
                }, this);

                buttonsLayout.add(inboxButton);

                //	Composite Button
                var composeButton = new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
                composeButton.set({
                    decorator: borderAll
                })
                composeButton.setHeight(18);
                composeButton.setMaxHeight(18);
                var composeLabel = new qx.ui.basic.Label("Compose");
                composeLabel.setTextColor("#000000");
                composeLabel.setPadding(2);
                composeLabel.setFont(new qx.bom.Font(11, ["Lucida Grande", "Verdana"]));
                composeButton.add(composeLabel);
                composeButton.addListener("mouseover", function () {
                    composeButton.setBackgroundColor("#61676d");
                    composeLabel.setTextColor('#ffffff');
                });
                composeButton.addListener("mouseout", function (e) {
                    if (!qx.ui.core.Widget.contains(composeButton, e.getRelatedTarget())) {
                        composeButton.setBackgroundColor("#eeeeee");
                        composeLabel.setTextColor('#000000');
                    }
					
                });

                composeButton.addListener("click", function () {
                    // open new mail
                    eyeos.execute('mail', checknum, ['newMail']);
                }, this);
                buttonsLayout.add(composeButton);
            }

            eyeos.callMessage(checknum,	"getConversationsInInbox",	null, function (results) {
                // if No results, print message
                if (results == 'no mails') {
                    createButtonsMail(checknum);
                    var item = new qx.ui.container.Composite().set({
                        layout: new qx.ui.layout.HBox(),
                        decorator: new qx.ui.decoration.Single(1, 'solid', '#A4A4A4').set({
                            styleTop: null,
                            styleRight: null,
                            styleLeft: null,
                            styleBottom: null
                        }),
                        paddingRight: 10,
                        marginLeft: 10,
                        marginRight: 10,
                        paddingBottom: 5,
                        alignY: 'middle'
                    });
                    var labelNoMail = new qx.ui.basic.Label().set({
                        value: tr('No mail in Inbox'),
                        rich: false,
                        paddingTop: 10,
                        paddingBottom: 10,
                        marginRight: 8,
                        textAlign: 'center',
                        font: new qx.bom.Font(11, ["Lucida Grande", "Verdana"])
                    });
                    item.add(labelNoMail, {
                        width: '100%'
                    });

                    widgetContainer.add(item);
                } else if (results == null) {
                    var item = new qx.ui.container.Composite().set({
                        layout: new qx.ui.layout.HBox(),
                        decorator: new qx.ui.decoration.Single(1, 'solid', '#A4A4A4').set({
                            styleTop: null,
                            styleRight: null,
                            styleLeft: null,
                            styleBottom: null
                        }),
                        paddingRight: 10,
                        marginLeft: 10,
                        marginRight: 10,
                        paddingBottom: 5,
                        alignY: 'middle'
                    });
                    var labelNoConf = new qx.ui.basic.Label().set({
                        value: tr('EyeMail is not configured'),
                        rich: false,
                        paddingRight: 10,
                        marginLeft: 10,
                        marginRight: 10,
                        paddingBottom: 5,
                        textAlign: 'center',
                        font: new qx.bom.Font(11, ["Lucida Grande", "Verdana"])
                    });
                    item.add(labelNoConf, {
                        width: '100%'
                    });
                    labelNoConf.addListener("mouseover", function () {
                        labelNoConf.setTextColor('#4F8EC6');
                    });
                    labelNoConf.addListener("mouseout", function (e) {
                        if (!qx.ui.core.Widget.contains(labelNoConf, e.getRelatedTarget())) {
                            labelNoConf.setTextColor('black');
                        }
                    });
                    labelNoConf.addListener("click", function () {
                        // open mail
                        eyeos.execute('mail', checknum);
                    }, this);
                    widgetContainer.add(item);
                } else {
                    //print all mails
                    createButtonsMail(checknum);
                    for (var i = 0; i < results.length; ++i) {
                        var item = new qx.ui.container.Composite().set({
                            layout: new qx.ui.layout.HBox(),
                            decorator: new qx.ui.decoration.Single(1, 'solid', '#A4A4A4').set({
                                styleTop: null,
                                styleRight: null,
                                styleLeft: null,
                                styleBottom: 'solid'
                            }),
                            paddingRight: 10,
                            marginLeft: 10,
                            marginRight: 10,
                            paddingBottom: 5,
                            alignY: 'middle'
                        });
                        var labelFrom = new qx.ui.basic.Label().set({
                            value: results[i].from,
                            rich: false,
                            paddingTop: 3,
                            marginRight: 8,
                            font: new qx.bom.Font(11, ["Lucida Grande", "Verdana"])

                        });

                        var labelSubject = new qx.ui.basic.Label().set({
                            value: results[i].subject,
                            rich: false,
                            paddingTop: 3,
                            marginRight: 8,
                            font: new qx.bom.Font(11, ["Lucida Grande", "Verdana"])
                        });

                        labelSubject.unread = results[i].unread;
                        labelSubject.addListener('appear', function(){
                            if (this.unread > 0) {
                                this.setFont(new qx.bom.Font(11, ["Lucida Grande", "Verdana"]).set({
                                    bold: true
                                }));
                            }
                        });

                        var labelDate = new qx.ui.basic.Label().set({
                            value: results[i].date,
                            rich: false,
                            paddingTop: 3,
                            marginRight: 0,
                            textAlign: 'right',
                            font: new qx.bom.Font(11, ["Lucida Grande", "Verdana"])
                        });

                        item.add(labelFrom, {
                            width: '30%'
                        });
                        item.add(labelSubject, {
                            width: '50%'
                        });
                        item.add(labelDate, {
                            width: '20%'
                        });
                        widgetContainer.add(item);
                    } //end for
                } //end else
            });

            var container = settings.column? document.eyeDashBoard.getContainer(settings.column) : document.eyeDashBoard.getContainer(1);
            var position = settings.position? parseInt(settings.position) : 0;
            widget.openAndPlace(container, position);
            return widget;
        },

        /*
		 * EVENTS WIDGET
		 *
		 */
        createEventsWidget: function(checknum, id, settings) {
            if (settings == null) {
                settings = '';
            }

            var widget = new eyeos.dashboard.Widget(tr('Events'), id, '', false, checknum).set({
                icon: 'index.php?extern=/images/events/activity_16x16.png'
            });

            if(settings.minimized) {
                widget.toggleMinimize();
            }

            var buttonsLayout = new qx.ui.container.Composite().set({
                layout: new qx.ui.layout.HBox(),
                backgroundColor: '#eeeeee',
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
                padding: 3
            });
            widget.addContent(buttonsLayout);

            var widgetScroll = new qx.ui.container.Scroll().set({
                height: 160,
                allowGrowY: false
            });
            widget.addContent(widgetScroll, {
                flex: 1
            });
			
            var widgetContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                padding: 5
            });

            if (settings && settings.items) {
                var numberOfItems = parseInt(settings.items);
            } else {
                var numberOfItems = 5;
            }

            widget.setUserData('container', widgetContainer);
            widgetScroll.add(widgetContainer);
			
            var actualButtonSelected = 'All';
			
            createButtons(checknum);
            createSettingsForm();
            createContent(widgetContainer, actualButtonSelected, numberOfItems);
            addListeners();

            function addListeners() {
                var bus = eyeos.messageBus.getInstance();

                bus.addListener('eyeos_events_newEvent', function() {
                    createContent(widgetContainer, actualButtonSelected, numberOfItems);
                }, this);

                bus.addListener('eyeos_events_updateEvent', function() {
                    createContent(widgetContainer, actualButtonSelected, numberOfItems);
                }, this);
            }

            function createSettingsForm() {
                var form = widget._widgetSettingsPanelForm;
                var itemsLabel = new qx.ui.basic.Label(tr('number of items'));
                form.add(itemsLabel, {
                    row: 0,
                    column: 0
                });

                var itemsSpinner = new qx.ui.form.Spinner(1, numberOfItems, 20);
                form.add(itemsSpinner, {
                    row: 0,
                    column: 1
                });

                form.setUserData('settings_items', itemsSpinner);

                widget._widgetSettingsPanelButtonSave.addListener('execute', function() {
                    var params = new Array();
                    var settings = new Array();

                    settings = {
                        items: widget._widgetSettingsPanelForm.getUserData('settings_items').getValue()
                    };

                    params = {
                        widget: 'events',
                        settings: settings
                    };

                    eyeos.callMessage(checknum, 'saveSettingsWidget', params, function() {
                        numberOfItems = settings['items'];
                        createContent(widgetContainer, null, numberOfItems);
                    });
                });
                widget._widgetSettingsPanelButtonCancel.addListener('execute', function() {
                    itemsSpinner.setValue(numberOfItems);
                });

            }
			
            function createButtons (checknum) {
                buttonsLayout.removeAll();
                //	decorator rounded all borders
                var borderAll = new qx.ui.decoration.RoundBorderBeveled().set({
                    leftTopR: 3,
                    rightTopR: 3,
                    leftBottomR: 3,
                    rightBottomR: 3
                });

                createButton('All');
                createButton('Pending');
                createButton('Files');
                createButton('People');
                createButton('Groups');

                function createButton (name) {

                    var button = new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
                    button.set({
                        decorator: new qx.ui.decoration.RoundBorderBeveled(null, null, 1, 5, 5, 5, 5)
                    })
                    button.setHeight(18);
                    button.setMaxHeight(18);
                    var buttonLabel = new qx.ui.basic.Label(tr(name));
                    buttonLabel.setPadding(2);
                    buttonLabel.setFont(new qx.bom.Font(11, ["Lucida Grande", "Verdana"]));
                    button.add(buttonLabel);
                    if (actualButtonSelected == name) {
                        button.setBackgroundColor("#61676d");
                        buttonLabel.setTextColor('#ffffff');

                    } else {
                        buttonLabel.setTextColor("#000000");
                        button.addListener("mouseout", function (e) {
                            if (!qx.ui.core.Widget.contains(button, e.getRelatedTarget())) {
                                button.setBackgroundColor("#eeeeee");
                                buttonLabel.setTextColor('#000000');
                            }
                        });
                    }

                    button.addListener("mouseover", function () {
                        button.setBackgroundColor("#61676d");
                        buttonLabel.setTextColor('#ffffff');
                    });

                    button.addListener("click", function () {
                        actualButtonSelected = name;
                        createButtons(checknum);
                        createContent(widgetContainer, actualButtonSelected, numberOfItems);
                    });

                    buttonsLayout.add(button);
                }

                //create clear All button
                buttonsLayout.add(new qx.ui.core.Spacer(), {
                    flex: 1
                });

                var clearAllButton = new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
                clearAllButton.set({
                    decorator: borderAll,
                    alignX: 'right'
                })
                clearAllButton.setHeight(18);
                clearAllButton.setMaxHeight(18);
                var clearAllLabel = new qx.ui.basic.Label(tr("clear"));
                clearAllLabel.setTextColor("#000000");
                clearAllLabel.setPadding(2);
                clearAllLabel.setFont(new qx.bom.Font(11, ["Lucida Grande", "Verdana"]));
                clearAllButton.add(clearAllLabel);
                clearAllButton.addListener("mouseover", function () {
                    clearAllButton.setBackgroundColor("#61676d");
                    clearAllLabel.setTextColor('#ffffff');
                });
                clearAllButton.addListener("mouseout", function (e) {
                    if (!qx.ui.core.Widget.contains(clearAllButton, e.getRelatedTarget())) {
                        clearAllButton.setBackgroundColor("#eeeeee");
                        clearAllLabel.setTextColor('#000000');
                    }
                });
				
                clearAllButton.addListener("click", function () {
                    var childrens = widgetContainer.getChildren();
                    var arrayItems = new Array();
                    for (var i = 0; i < childrens.length; ++i) {
                        if (childrens[i].getUserData('isQuestion') == 0 || childrens[i].getUserData('hasEnded') == 1) {
                            arrayItems.push(parseInt(childrens[i].getUserData('id')));
                        }
                    }
                    var params = {
                        'id': arrayItems
                    };
                    eyeos.callMessage(checknum,	"__Events_deleteEvents", params, function (results) {
                        createContent(widgetContainer, actualButtonSelected, numberOfItems);
                    });
                }, this);

                buttonsLayout.add(clearAllButton);
            }
		
            function createContent(widgetContainer, action, numberItems) {
                if (numberItems == null) {
                    numberItems = parseInt(settings.items);
                }
                //delete all items
                widgetContainer.removeAll();

                if (action == null || action == 'All') {
                    var params = {
                        from: 0,
                        to: parseInt(numberItems)
                    };
                    eyeos.callMessage(checknum,	"__Events_retrieveAllEventNotifications", params, function (results) {
                        for (var i = 0; i < results.length; ++i) {
                            createItem(results[i], i);
                        }
                    });
                } else {
                    var params = {
                        from: 0,
                        to: parseInt(numberItems),
                        type: action
                    }
                    eyeos.callMessage(checknum,	"__Events_retrieveAllEventsByType", params, function (results) {
                        for (var i = 0; i < results.length; ++i) {
                            createItem(results[i], i);
                        }
                    });
                }
            }

            function createItem(result, num) {
                var backColor = num%2 == 0 ? '#FFFFFF' : '#F0F0F0';
                var type = result.type;

                type = type.substring(0, type.indexOf('_'));
                var item = new qx.ui.container.Composite().set({
                    layout: new qx.ui.layout.VBox(),
                    marginRight: 5,
                    paddingRight: 5,
                    marginLeft: 5,
                    paddingLeft: 5,
                    paddingBottom: 5,
                    backgroundColor: backColor,
                    alignY: 'middle'
                });
                item.setUserData('id', result.id);
                item.setUserData('availableAnswers', result.availableAnswers);
                item.setUserData('isQuestion', result.isQuestion);
                item.setUserData('hasEnded', result.hasEnded);

                var cmpDate = new qx.ui.container.Composite().set({
                    layout: new qx.ui.layout.HBox()
                });
                var path = 'index.php?extern=images/events/activ_base-12x12.png';
                if (type == 'Files') {
                    path = 'index.php?extern=images/events/activ_files-12x12.png'
                }
                else if (type == 'Dashboard') {
                    path = 'index.php?extern=images/events/activ_dashboard-12x12.png'
                }
                else if (type == 'Applications') {
                    path = 'index.php?extern=images/events/activ_appli-12x12.png'
                }
                else if (type == 'People') {
                    path = 'index.php?extern=images/events/activ_people-12x12.png'
                }
                else if (type == 'Groups') {
                    path = 'index.php?extern=images/events/activ_groups-12x12.png'
                }

                var eventIcon = new qx.ui.basic.Image(path).set({
                    alignY : 'middle',
                    alignX : 'left',
                    paddingLeft : 3,
                    paddingRight : 3,
                    paddingTop : 0
                });
                var dt = new Date(result.creationDate * 1000);
                function checkTime(i)
                {
                    if (i<10)
                    {
                        i="0" + i;
                    }
                    return i;
                }
				
                var labelDate = new qx.ui.basic.Label().set({
                    value: dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear() + " " + dt.getHours() + ":" + checkTime(dt.getMinutes()),
                    rich: false,
                    paddingTop: 3,
                    marginRight: 0,
                    textAlign: 'right',
                    font: new qx.bom.Font(11, ["Lucida Grande", "Verdana"])
                });
                var buttons = new qx.ui.container.Composite(new qx.ui.layout.HBox(10)).set({
                    marginLeft: 20
                });
                if (result.isQuestion && !result.hasEnded) {
                    var actionsButtons = result.availableAnswers.split('#');
                    if (actionsButtons.length > 0) {
                        for (var i = 0; i < actionsButtons.length; ++i) {
                            var text = actionsButtons[i];
                            var button = new qx.ui.form.Button(text).set({
                                paddingTop: 0,
                                paddingBottom: 0,
                                paddingLeft: 2,
                                paddingRight: 2
                            });

                            button.addListener("click", function () {
                                var params = {
                                    id: parseInt(result.id),
                                    answer: this.getLabel()
                                };
                                eyeos.callMessage(checknum,	"__Events_handleAnswer", params, function (results) {
                                    createContent(widgetContainer, name);
                                });
                            });

                            buttons.add(button);
                        }
                    }
                }

                var deleteIcon = new qx.ui.basic.Image('index.php?extern=images/clear.png').set({
                    alignY : 'middle',
                    alignX : 'right',
                    paddingLeft : 3,
                    paddingRight : 0,
                    paddingTop : 0
                });
                deleteIcon.hide();
                deleteIcon.addListener("click", function () {
                    if (result.isQuestion == 0 || result.hasEnded == 1) {
                        var params = {
                            'id' : parseInt(result.id)
                        };
                        eyeos.callMessage(checknum,	"__Events_deleteEvents", params, function (results) {
                            createContent(widgetContainer, actualButtonSelected, numberOfItems);
                        });
                    } else {
                        alert(tr('Can\'t delete the event'));
                    }
                }, this);

                cmpDate.add(eventIcon);
                cmpDate.add(labelDate);
                cmpDate.add(buttons);
                cmpDate.add(new qx.ui.core.Spacer(), {
                    flex: 1
                });
                cmpDate.add(deleteIcon);
                var infoData = qx.util.Json.parse(result.messageInformation);
                var translatedInformation = tr(infoData[0], infoData[1]);
                var labelSubject = new qx.ui.basic.Label().set({
                    value: translatedInformation,
                    rich: false,
                    paddingTop: 3,
                    paddingLeft: 17,
                    //marginRight: 8,
                    font: new qx.bom.Font(11, ["Lucida Grande", "Verdana"])
                });
                item.addListener('mouseover', function () {
                    deleteIcon.show();
                });
                item.addListener('mouseout', function () {
                    deleteIcon.hide();
                });
                item.add(cmpDate);
                item.add(labelSubject);
                widgetContainer.add(item);
            }

            var container = settings.column? document.eyeDashBoard.getContainer(settings.column) : document.eyeDashBoard.getContainer(1);
            var position = settings.position? parseInt(settings.position) : 0;
            widget.openAndPlace(container, position);
            return widget;
        },

        createMyGroupsWidget: function(checknum, id, settings) {
            if (settings == null) {
                settings = '';
            }

            function createMyGroupItem (name, id) {
                // events are quiet out of control right now, we need a totally
                // revision about the events framework, how the components use it,
                // how we manage the Adapters and so on. Right now, it's a quick
                // fix to avoid duplicated events....
                var children = widgetContainer.getChildren();
                for(var foo = 0; foo < children.length; ++foo) {
                    if(children[foo].getUserData('id') == id) {
                        return;
                    }
                }

                var groupName = name;
                var group = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                    alignX : 'center',
                    alignY : 'middle',
                    width : 76,
                    height: 76,
                    padding: 5,
                    decorator: new qx.ui.decoration.RoundBorderBeveled(null, null, 1, 5, 5, 5, 5)
                });
                group.setUserData('id', id);
                var image = new qx.ui.basic.Image('index.php?checknum=' + checknum + '&message=__Workgroups_getWorkgroupPicture&params[workgroupId]=' + id + '&refresh=' + new Date().getTime()).set({
                    width: 48,
                    alignX : 'center',
                    height: 48,
                    allowGrowX: false,
                    allowGrowY: false,
                    margin: 3,
                    scale: true
                });
                group.add(image);
                var label = new qx.ui.basic.Label().set({
                    value: groupName,
                    alignX : 'center',
                    rich: false,
                    paddingTop: 3,
                    marginRight: 0,
                    textAlign: 'center',
                    font: new qx.bom.Font(11, ["Lucida Grande", "Verdana"])
                });
                group.add(label);

                group.addListener('mouseover', function () {
                    this.setDecorator(new qx.ui.decoration.RoundBorderBeveled(null, '#CCCCCC', 1, 5, 5, 5, 5));
                });

                group.addListener("mouseout", function(e) {
                    if (!qx.ui.core.Widget.contains(group, e.getRelatedTarget())) {
                        group.setDecorator(new qx.ui.decoration.RoundBorderBeveled(null, null, 1, 5, 5, 5, 5));
                    }
                }, this);
				
                group.addListener("dblclick", function () {
                    eyeos.execute('files', checknum, ['workgroup://~' + groupName], null);
                }, this);

                widgetContainer.add(group);
            }


            var widget = new eyeos.dashboard.Widget(tr('My Groups'), id, '', false, checknum).set({
                icon: 'index.php?extern=/images/16x16/apps/system-users.png'
            });

            if(settings.minimized) {
                widget.toggleMinimize();
            }

            var widgetContainer = new qx.ui.container.Composite(new qx.ui.layout.Flow()).set({
                'allowShrinkY': false,
                padding: 5
            });

            widget.setUserData('container', widgetContainer);
            widget.addContent(widgetContainer);

            /*
				 * Populate Groups
				 */
                        
            eyeos.callMessage(checknum, '__Workgroups_getAllWorkgroupsByUser', {
                includeMeta: 'true'
            }, function (groups) {
                for (var i = 0; i < groups.length; ++i) {
                    if (groups[i].status == eyeos.ui.tabs.GroupAll.STATUS_MEMBER) {
                        createMyGroupItem(groups[i]['workgroup'].name, groups[i]['workgroup'].id);
                    }
                }
            }, this);

            /*
				 * LISTENERS
				 */

            //Adding A Group, eyeos_workgroup_Group
            var bus = eyeos.messageBus.getInstance();

            bus.addListener('eyeos_workgroup_updateGroup', function (e) {
                // removing old widget's element...
                widgetContainer.getChildren().forEach(function(child) {
                    if(child.getUserData('id') == e.getData().id) {
                        widgetContainer.remove(child);
                    }
                }, this);

                // and creating a new one with the updated parameters...
                createMyGroupItem(e.getData().title, e.getData().id);
            }, this);

            bus.addListener('eyeos_workgroup_createGroup', function (e) {
                var name = e.getData()[0];
                var id = e.getData()[1];
                createMyGroupItem(name, id);
            }, this);

            bus.addListener('eyeos_workgroup_joinGroup', function (e) {
                var name = e.getData()[0];
                var id = e.getData()[1];
                createMyGroupItem(name, id);
            }, this);

            bus.addListener('eyeos_workgroup_deleteGroup', function (e) {
                widgetContainer.getChildren().forEach(function(child) {
                    if(child.getUserData('id') == e.getData()) {
                        widgetContainer.remove(child);
                    }
                }, this);
            }, this);

            bus.addListener('eyeos_workgroup_leaveGroup', function (e) {
                widgetContainer.getChildren().forEach(function(child) {
                    if(child.getUserData('id') == e.getData()) {
                        widgetContainer.remove(child);
                    }
                }, this);
            }, this);

            var container = settings.column? document.eyeDashBoard.getContainer(settings.column) : document.eyeDashBoard.getContainer(1);
            var position = settings.position? parseInt(settings.position) : 0;
            widget.openAndPlace(container, position);
            return widget;
        }

    }
});
