/*
                                  ____   _____ 
                                 / __ \ / ____|
                  ___ _   _  ___| |  | | (___  
                 / _ \ | | |/ _ \ |  | |\___ \ 
                |  __/ |_| |  __/ |__| |____) |
                 \___|\__, |\___|\____/|_____/ 
                       __/ |                   
                      |___/

                     Web Operating System
                           eyeOS.org

             eyeOS Engineering Team - eyeOS.org/whoarewe

     eyeOS is released under the GNU Affero General Public License Version 3 (AGPL3)
            provided with this release in license.txt
             or via web at gnu.org/licenses/agpl-3.0.txt

        Copyright 2005-2008 eyeOS Team (team@eyeos.org)         
*/

//-----------------------------------------------------------------------------------
//		eyeTetravex
// Version:				1.1-2
// Author:				Anaël Ollier ( nanawel@eyeos.org / anael.ollier@eyeos.org )
// Last modification: 	2009-01-15
//-----------------------------------------------------------------------------------


package eyetetravex {
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.display.StageDisplayState;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;
	import flash.events.TimerEvent;
	import flash.text.TextField;
	import flash.utils.Timer;	
	
	public class EyeTetravex extends MovieClip {
		
		//CONSTANTS
		public static const _version:String = "1.1";
		public static const _showDebugConsole:Boolean = false;	//DEBUG in browser when true
		
		public static const MIN_TABLE_SIZE: int = 2;
		public static const MAX_TABLE_SIZE: int = 7;
		public static const MIN_MAXNUMBER_VALUE: int = 5;
		public static const MAX_MAXNUMBER_VALUE: int = 99;
		
		public static const ADVISEHIGHERLEVEL_TIME_LIMIT:int = 180;
		
		//INTERNAL PROPERTIES
		private static var _this:EyeTetravex;
		private var buttonsDisableCounter:Number = 0;
		public static var originalStageWidth:Number = 700;			//overwritten at the initialization of the stage
		public static var originalStageHeight:Number = 400;			//overwritten at the initialization of the stage
		public static var isConfigLoaded:Boolean = false;
		public static var areButtonsEnabled:Boolean = true;
		public static var areComponentsEnabled:Boolean = true;
		public static var scriptUrl:String;
		public static var checknum:String;
			
		//GAME PROPERTIES
		private var timer:Timer = new Timer(1000,0);
		private var leftTable:OrderedTable;
		private var rightTable:Table;
		private var tiles:Array = new Array();
		
		private var currentLevel:int;
		private var currentGame:Array;
		private var gameOver:Boolean = false;
		
		
		/**
		 * Initializes the app
		 */
		public function EyeTetravex() {
			EyeTetravex._this = this;
			
			EyeTetravex.logConsole("EyeTetravex v."+EyeTetravex._version+" started");
			this.versionTextField.text = EyeTetravex._version;
			
			this.addEventListener(Event.RENDER, this.onRender);
			
			EyeTetravex.scriptUrl = this.root.loaderInfo.parameters.scriptUrl;
			EyeTetravex.checknum = this.root.loaderInfo.parameters.checknum;
			
			this.fullScreenButton.addEventListener(MouseEvent.CLICK, this.fullScreenButton_onClick);
			this.newGameButton.addEventListener(MouseEvent.CLICK, this.newGameButton_onClick);
			this.configurationButton.addEventListener(MouseEvent.CLICK, this.configurationButton_onClick);
			this.highscoresButton.addEventListener(MouseEvent.CLICK, this.highscoresButton_onClick);
			this.aboutButton.addEventListener(MouseEvent.CLICK, this.aboutButton_onClick);
			
			this.tipImage.buttonMode = true;
			this.tipImage.useHandCursor = true;
			this.tipImage.addEventListener(MouseEvent.CLICK, this.tipImage_onClick);
			
			this.timer.addEventListener(TimerEvent.TIMER, this.onTimer);
			
			//A new game is automatically started when configuration loading has been performed
			//see EyeTetravex.initComplete()     and       EyeTetravex.loadConfiguration_callback()
		}
		
		public static function getInstance(): EyeTetravex {
			return _this;
		}
		
		
		/**
		 * Launches a whole new game
		 */
		public function startNewGame():void {
			this.initTables();
			
			this.clearGame();
			this.enableComponents();
			this.currentGame = Game.generateNewGame();
			
			for(var i:int = 0 ; i < this.currentGame.length ; i++) {
				for(var j:int = 0 ; j < this.currentGame[i].length ; j++) {
					this.currentGame[i][j].setEyeTetravex(this);
					this.tiles.push(this.currentGame[i][j]);
					this.addChild(this.currentGame[i][j]);
				}
			}
			this.fillRightTableRandomly();
			this.currentLevel = Game.getSize();
			this.startResumeTimer();
		}
		
		/**
		 * Creates and sets up both tables
		 */
		private function initTables():void {
			if (this.leftTable != null)
				this.removeChild(this.leftTable);
			if (this.rightTable != null)
				this.removeChild(this.rightTable);
			
			this.leftTable = new OrderedTable(Game.getSize());
			this.leftTable.setName("left");
			this.rightTable = new Table(Game.getSize());
			this.rightTable.setName("right");
			
			var scale:Number = Table.COMPONENT_WIDTH / this.leftTable.width;
			
			this.addChild(this.leftTable);
			this.leftTable.x = 20;
			this.leftTable.y = 80;
			this.leftTable.scaleX = scale;
			this.leftTable.scaleY = scale;
			
			this.addChild(this.rightTable);
			this.rightTable.x = 380;
			this.rightTable.y = 80;
			this.rightTable.scaleX = scale;
			this.rightTable.scaleY = scale;
		}
		
		private function clearGame(): void {
			this.destroyTiles();
			this.tiles = new Array();
			this.gameOver = false;
			Game.tipUsed = false;
			Game.numMoves = 0;
			this.stopTimer();
			this.resetTimer();
		}
		
		/**
		 * Called on success, prints message, saves highscore and proposes a new game
		 * (see also EyeTetravex.success_callback())
		 */
		public function success():void {
			this.timer.stop();
			this.gameOver = true;
			this.disableComponents();
			
			//DEBUG
			//Game.tipUsed = false;
			
			if (! Game.tipUsed && RemoteCaller.allowRemoteCalls) {
				var highscore:XML = <highscore></highscore>;
				highscore.appendChild("<useSharedHighscores>"+Game.useSharedHighscores+"</useSharedHighscores>");
				highscore.appendChild("<level>"+Game.getSize()+"</level>");
				highscore.appendChild("<maxNumber>"+Game.getMaxNumber()+"</maxNumber>");
				highscore.appendChild("<time>"+this.timerTextField.text+"</time>");
				highscore.appendChild("<moves>"+Game.numMoves+"</moves>");
				
				EyeTetravex.getRemoteCaller().sendCall("saveHighscore",
													   this,
													   this.success_callback,
													   highscore);
			}
			else {
				this.success_callback();
			}
		}
		
		private function success_callback(response:XML = null) {
			var rank:String = "";
			if (response != null) {
				if (! Game.tipUsed) {
					rank = "<p align=\"center\">"+I18n.getString("dialog_gameover_yourrank")+"</p>"
						+"<p align=\"center\"><b>"+response.child("rank")+"</b></p>";
				}
				else {
					rank = "<p align=\"center\">"+I18n.getString("dialog_gameover_yourrank")+"</p>"
							+"<p align=\"center\"><b>"+I18n.getString("dialog_gameover_tipused")+"</b></p>";
				}
			}
			
			var comment:String = "";
			if (this.timer.currentCount < EyeTetravex.ADVISEHIGHERLEVEL_TIME_LIMIT
				&& this.currentLevel < EyeTetravex.MAX_TABLE_SIZE) {
				comment = I18n.getString("dialog_gameover_advisehigherlevel");
			}
			EyeTetravex.showMessage("<p align=\"center\"><b><font size=\"14\">"+I18n.getString("dialog_gameover_finished")+"</font></b></p>"
							 	+"<p align=\"center\"><font color=\"#aaaaaa\">"+comment+"</font></p>"
								+"<p></p><p align=\"center\">"+I18n.getString("dialog_gameover_yourtime")+"</p>"
							 	+"<p align=\"center\"><b>"+this.timerTextField.text+"</b></p>"
								+"<p align=\"center\">"+I18n.getString("dialog_gameover_nummoves")+"</p>"
							 	+"<p align=\"center\"><b>"+Game.numMoves+"</b></p>"
								+rank,
							 this,
							 function () {this.enableComponents(); this.confirmNewGame();});
		}
		
		/**
		 * Displays a confirmation message to start a new game
		 */
		public function confirmNewGame():void {
			this.disableComponents();
			EyeTetravex.showQuestion(I18n.getString("dialog_newgame_title"),
								"<span align=\"center\">"+I18n.getString("dialog_newgame_text")+"</span>",
								this,
								this.startNewGame, 
								this.enableComponents);
		}
		
		/**
		 * Performs a move to help the user
		 * (removes a misplaced tile or places a tile on its right square)
		 */
		public function performTip():void {
			if (! this.gameOver) {
				var leftTiles:Array = this.leftTable.getTiles();
				var correctionDone:Boolean = false;
				
				var tmpIndexes:Array = new Array();
				for(var i:int = 0 ; i < this.tiles.length ; i++) {
					tmpIndexes.push(i);
				}
				for (i = 0 ; i < this.tiles.length && ! correctionDone ; i++) {
					//draw a random tile
					var rand:int  = Math.floor(Math.random() * tmpIndexes.length);
					var tmpTile:Tile = this.tiles[tmpIndexes[rand]];
					
					//if the tile that came up is on the LEFT table
					if (tmpTile.getTable() == this.leftTable) {
						//if its current location on the table is not the good one
						if (this.currentGame[tmpTile.getLine()][tmpTile.getColumn()] != tmpTile) {
							//put it back to the right table
							this.rightTable.putTile(tmpTile);
							correctionDone = true;
						}
					}
					//the tile that came up is on the RIGHT table
					else {
						//try to put it on the good square
						var goodSquareFound:Boolean = false;
						var tile_i:int;
						var tile_j:int;
						for (var _i:int = 0 ; _i < this.currentGame.length && ! goodSquareFound ; _i++) {
							for (var _j:int = 0 ; _j < this.currentGame[_i].length && ! goodSquareFound ; _j++) {
								if (this.currentGame[_i][_j] == tmpTile) {
									tile_i = _i;
									tile_j = _j;
									goodSquareFound = true;
								}
							}
						}
						if (this.leftTable.putTileAt(tmpTile, tile_i, tile_j)) {
							correctionDone = true;
						}
					}
					//remove the checked tile for next loop
					tmpIndexes.splice(rand,1);
				}
				Game.numMoves++;
				
				//check game over
				if (this.leftTable.isFull()) {
					this.success();
				}
			}
		}
		
		
		
		
		//-----------------------------------------------------------------------------------
		//		SYSTEM
		//-----------------------------------------------------------------------------------
		
		private function initComplete():void {
			//set up internal debug console
			if (EyeTetravex._showDebugConsole) {
				var console_onRender:Function = function(e:Event) {
					//ensure the console is always on top of the other components
					e.target.parent.setChildIndex(e.target,e.target.parent.numChildren-1);
				}
				this.console.addEventListener(Event.RENDER, console_onRender);
			}
			this.console.visible = EyeTetravex._showDebugConsole;
			
			EyeTetravex.originalStageWidth = _this.stage.stageWidth;
			EyeTetravex.originalStageHeight = _this.stage.stageHeight;
			this.progressBar.visible = false;
			this.stage.addEventListener(KeyboardEvent.KEY_DOWN, this.onKeyDown);
			
			//the callback function automatically starts a new game
			this.loadConfiguration();
		}
		
		public static function getRemoteCaller():RemoteCaller {
			var remoteCaller:RemoteCaller = new RemoteCaller();
			return remoteCaller;
		}
		
		private function loadConfiguration():void {
			EyeTetravex.getRemoteCaller().sendCall("loadConfiguration",
												   this,
												   this.loadConfiguration_callback);
		}
		
		private function loadConfiguration_callback(response:XML):void {
			EyeTetravex.logConsole("EyeTetravex.loadConfiguration_callback(): Parsing XML response...");
			
			if (response.child("saveConfiguration") != undefined)
				Game.saveConfiguration = (response.child("saveConfiguration") == "true");
			if (response.child("useSharedHighscores") != undefined)
				Game.useSharedHighscores = (response.child("useSharedHighscores") == "true");
			
			if (Game.saveConfiguration) {
				if (response.child("level") != undefined)
					Game.setSize(response.child("level"));
				if (response.child("maxNumber") != undefined)
					Game.setMaxNumber(response.child("maxNumber"));
				if (response.child("useColoredNumbers") != undefined)
					Game.useColoredNumbers = (response.child("useColoredNumbers") == "true");
			}
			
			//set strings for i18n
			var i18nNodes:XMLList = response.child("i18n").children();
			for each(var childNode:XML in i18nNodes) {
				I18n.setString(childNode.name(), childNode);
			}
			EyeTetravex.logConsole("EyeTetravex.loadConfiguration_callback(): Loading complete");
			
			this.onConfigLoaded();
		}
		
		private function translateGUI():void {
			this.newGameButton.label = I18n.getString("main_button_newgame");
			this.configurationButton.label = I18n.getString("main_button_configuration");
			this.highscoresButton.label = I18n.getString("main_button_highscores");
			this.fullScreenButton.label = I18n.getString("main_button_fullscreen");
		}
		
		
		//-----------------------------------------------------------------------------------
		//		TILES MANAGEMENT
		//-----------------------------------------------------------------------------------
		
		/**
		 * Fills the right table randomly with the tiles on the board
		 */
		private function fillRightTableRandomly():void {
			var tmpIndexes:Array = new Array();
			for(var i:int = 0 ; i < this.tiles.length ; i++) {
				tmpIndexes.push(i);
			}
			for (i = 0 ; i < this.tiles.length ; i++) {
				var rand:int  = Math.floor(Math.random() * tmpIndexes.length);
				
				//DEBUG
				//this.rightTable.putTileAt(this.tiles[i], Math.floor(i / this.rightTable.getSize()), Math.floor(i % this.rightTable.getSize()));
				
				this.rightTable.putTileAt(this.tiles[tmpIndexes[rand]], Math.floor(i / this.rightTable.getSize()), Math.floor(i % this.rightTable.getSize()));
				tmpIndexes.splice(rand,1);
			}
			EyeTetravex.logConsole("EyeTetravex.fillRightTableRandomly(): Filling complete\n"+this.rightTable);
		}
		
		/**
		 * Tries to stick the specified tile to one of both tables if it is over,
		 * otherwise puts the tile back to its original place
		 * @param Tile till The tile to stick
		 */
		public function autoStickTile(tile:Tile): void {
			if (this.isTileOverTable(tile, this.leftTable)) {
				this.leftTable.autoStickTile(tile);
				if (this.leftTable.isFull()) {
					this.success();
				}
			}
			else {
				if (this.isTileOverTable(tile, this.rightTable)) {
					this.rightTable.autoStickTile(tile);
				}
				else {
					tile.getTable().putTileAt(tile, tile.getLine(), tile.getColumn());
				}
			}
		}
		
		/**
		 * Checks whether the specified tile is currently over the specified table
		 * @param Tile tile
		 * @param Table table
		 * @return Boolean TRUE if the stick is over the table, FALSE otherwise
		 */
		private function isTileOverTable(tile:Tile, table:Table):Boolean {
			var xTile:int = tile.x + (tile.width / 2);
			var yTile:int = tile.y + (tile.height / 2);
			
			if (xTile >= table.x
				&& xTile <= (table.x + this.leftTable.width)) {
				if (yTile >= table.y
					&& yTile <= (table.y + this.leftTable.height)) {
					return true;
				}
			}
			return false;
		}
		
		/**
		 * Puts the given tile on the right table, on the first free place found
		 */
		public function putTileOnRightTable(tile:Tile):void {
			this.rightTable.putTile(tile);
		}
		
		/**
		 * Destroys all the tiles currently in game
		 */
		private function destroyTiles():void {
			this.leftTable.empty();
			this.rightTable.empty();
			
			for (var i:int = 0 ; i < this.tiles.length ; i++) {
				this.removeChild(this.tiles[i]);
				delete this.tiles[i];
			}
		}
		
		
		//-----------------------------------------------------------------------------------
		//		INTERFACE MAMAGEMENT
		//-----------------------------------------------------------------------------------
		
		private function onRender(e:Event): void {
			this.initComplete();
			this.removeEventListener(Event.RENDER, this.onRender);
		}
		
		private function onKeyDown(e:KeyboardEvent):void {
			if (e.ctrlKey) {
				if (String.fromCharCode(e.charCode) == "n") {
					this.newGameButton_onClick(null);
				}
				if (String.fromCharCode(e.charCode) == "z") {
					this.configurationButton_onClick(null);
				}
				if (String.fromCharCode(e.charCode) == "s") {
					this.highscoresButton_onClick(null);
				}
			}
		}
		
		public function onConfigLoaded():void {
			if (! EyeTetravex.isConfigLoaded) {
				logConsole("EyeTetravex.onConfigLoaded(): Starting a new game");
				this.startNewGame();
			}
			this.translateGUI();
			EyeTetravex.isConfigLoaded = true;
		}
		
		private function fullScreenButton_onClick(e:Event):void {
			//if normal size, go to fullscreen, else go to normal size
			if(this.stage.displayState == StageDisplayState.NORMAL) {
				this.stage.displayState = StageDisplayState.FULL_SCREEN;
			}
			else {
				this.stage.displayState = StageDisplayState.NORMAL;
			}
		}
		
		private function newGameButton_onClick(e:Event):void {
			if (this.newGameButton.enabled) {
				this.confirmNewGame();
			}
		}
		
		private function configurationButton_onClick(e:Event):void {
			if (this.configurationButton.enabled) {
				this.disableComponents();
				this.addChild(new ConfigurationDialog(this, this.enableComponents));
			}
		}
		
		private function highscoresButton_onClick(e:Event):void {
			if (this.highscoresButton.enabled) {
				this.disableComponents();
				this.addChild(new HighscoresDialog(this, this.enableComponents));
			}
		}
		
		private function aboutButton_onClick(e:Event):void {
			if (this.aboutButton.enabled) {
				this.disableComponents();
				
				EyeTetravex.showMessage("<p align=\"center\"><font size=\"14\">About </font>"
										+"<b><font size=\"20\" face=\"Verdana\" color=\"#184890\">eyeTetravex</font></b>"
										+"<font size=\"14\"> v"+_version+"</font></p>"
								+"<p></p>"
								+"<p align=\"center\"><font color=\"#aaaaaa\">Author</font></p>"
								+"<p align=\"center\">Anaël Ollier (<a href=\"mailto:nanawel@eyeos.org\">nanawel@eyeos.org</a>)</p>"
								+"<p align=\"center\"><font color=\"#aaaaaa\">Help, hints</font></p>"
								+"<p align=\"center\"><a href=\"http://wiki.eyeos.org/EyeTetravex\">wiki.eyeos.org/EyeTetravex</a></p>"
								+"<p align=\"center\"><font color=\"#aaaaaa\">Source code (GPL3)</font></p>"
							 	+"<p align=\"center\"><a href=\"http://eyeos.svn.sourceforge.net/viewvc/eyeos/eyeTetravex\">eyeos.svn.sourceforge.net</a></p>",
								this,
								this.enableComponents);
			}
		}
		
		private function tipImage_onClick(e:Event):void {
			Game.tipUsed = true;
			this.performTip();
		}
		
		/**
		 * Manage the state of the buttons. Works like a stack, add 1 to a counter when
		 * a request makes the buttons go to the disabled state, removes one when a request
		 * trys to enable the buttons. Enables the buttons only if the counter is at zero
		 * when an "enable" request is processed.
		 */
		public function enableButtons(enable:Boolean = true):void {
			if (enable) {
				this.buttonsDisableCounter--;
				this.buttonsDisableCounter = (this.buttonsDisableCounter < 0)? 0 : this.buttonsDisableCounter;
				if (this.buttonsDisableCounter == 0) {
					this.newGameButton.enabled = true;
					this.configurationButton.enabled = true;
					this.highscoresButton.enabled = true;
					this.aboutButton.enabled = true;
				}
			}
			else {
				this.buttonsDisableCounter++;
				this.newGameButton.enabled = false;
				this.configurationButton.enabled = false;
				this.highscoresButton.enabled = false;
				this.aboutButton.enabled = false;
			}
			EyeTetravex.areButtonsEnabled = enable;
		}
		
		public function disableButtons():void {
			this.enableButtons(false);
		}
		
		public function enableComponents(enable:Boolean = true):void {
			this.enableButtons(enable);
			
			//tiles can only be unlocked if the game is not over
			if (! this.gameOver || ! enable) {
				if (this.leftTable != null)
					this.leftTable.lockTiles(! enable);
				if (this.rightTable != null)
					this.rightTable.lockTiles(! enable);
			}
			
			EyeTetravex.areComponentsEnabled = enable;
		}
		
		public function disableComponents():void {
			this.enableComponents(false);
		}
		
		public static function showQuestion(title:String, htmlText:String,
									 targetObject:Object = null, onYesFunction:Function = null, onNoFunction:Function = null):void {
			EyeTetravex._this.addChild(new QuestionDialog(title,
											 htmlText,
											 targetObject,
											 onYesFunction,
											 onNoFunction));
		}
		
		public static function showMessage(htmlText:String, targetObject:Object = null, onCloseFunction:Function = null): void {
			EyeTetravex._this.addChild(new Message(htmlText, targetObject, onCloseFunction));
		}
		
		//-----------------------------------------------------------------------------------
		//		TIMER
		//-----------------------------------------------------------------------------------
		/**
		 * Called at every event thrown by the timer (basically every second)
		 */
		private function onTimer(e:TimerEvent):void {
			var min:int = Math.floor(this.timer.currentCount / 60);
			var minStr:String = (min < 10)? "0"+min.toString() : min.toString();
			var sec:int = Math.floor(this.timer.currentCount % 60);
			var secStr:String = (sec < 10)? "0"+sec.toString() : sec.toString();
			
			this.timerTextField.text = minStr+":"+secStr;
		}
		
		public function getElapsedTime():int {
			return this.timer.currentCount;
		}
		
		public function stopTimer():void {
			this.timer.stop();
		}
		
		public function startResumeTimer(): void {
			this.timer.start();
		}
		
		public function resetTimer(): void {
			this.timerTextField.text = "00:00";
			this.timer.reset();
		}
		
		//-----------------------------------------------------------------------------------
		//		PROGRESS BAR
		//-----------------------------------------------------------------------------------
		
		public static function notifyActivity(enable:Boolean): void {
			EyeTetravex._this.progressBar.visible = enable;
			EyeTetravex._this.progressBar.enabled = enable;
		}
		
		//-----------------------------------------------------------------------------------
		//		CONSOLE
		//-----------------------------------------------------------------------------------
		
		public static function logConsole(text:String): void {
			trace(text);
			if (EyeTetravex._this.console != null) {
				EyeTetravex._this.console.text += text+"\n";
			}
		}
	}
}
