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

package eyetetravex {
	import flash.display.MovieClip;
	import flash.filters.DropShadowFilter;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.filters.BevelFilter;
	import flash.filters.BitmapFilterQuality;
	import flash.filters.BitmapFilterType;	
	
	public class Tile extends MovieClip {
		
		public static const EDGES_COLORS:Array = [0x000000,		// 0
												  0xc17d11,		// 1
												  0xcc0000,		// 2
												  0xf57900,		// 3
												  0xedd400,		// 4
												  0x73d216,		// 5
												  0x3465a4,		// 6
												  0xca30cc,		// 7
												  0xbabdb6,		// 8
												  0x0fd6dd];	// 9
		
		private var eyeTetravex:EyeTetravex;
		private var table:Table;
		private var line:int;
		private var column:int;
		private var isTileLocked:Boolean;
		
		private var northValue:int;
		private var eastValue:int;
		private var southValue:int;
		private var westValue:int;
		
		
		public function Tile() {
			this.northValueTextField.selectable = false;
			this.northValueTextField.mouseEnabled = false;
			this.eastValueTextField.selectable = false;
			this.eastValueTextField.mouseEnabled = false;
			this.southValueTextField.selectable = false;
			this.southValueTextField.mouseEnabled = false;
			this.westValueTextField.selectable = false;
			this.westValueTextField.mouseEnabled = false;
			
			this.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
			this.addEventListener(MouseEvent.MOUSE_UP, onMouseReleased);
			
			this.buttonMode = true;
			this.setupEdges();
			
			this.setIsTileLocked(false);
		}
		
		private function setupEdges():void {
			var bevelFilter:BevelFilter = new BevelFilter();
			bevelFilter.distance = this.scaleX;
			bevelFilter.angle = 75;
			bevelFilter.highlightColor = 0xCCCCCC;
			bevelFilter.highlightAlpha = 0.8;
			bevelFilter.shadowColor = 0x666666;
			bevelFilter.shadowAlpha = 0.8;
			bevelFilter.blurX = 4;
			bevelFilter.blurY = 4;
			bevelFilter.strength = (this.scaleX *2);
			bevelFilter.quality = BitmapFilterQuality.HIGH;
			bevelFilter.type = BitmapFilterType.INNER;
			bevelFilter.knockout = false;
			
			this.northEdge.filters = [ bevelFilter ];
			this.eastEdge.filters = [ bevelFilter ];
			this.southEdge.filters = [ bevelFilter ];
			this.westEdge.filters = [ bevelFilter ];
			
			this.northEdge.buttonMode = true;
			this.eastEdge.buttonMode = true;
			this.southEdge.buttonMode = true;
			this.westEdge.buttonMode = true;
		}
	
		
		
		private function onMouseDown(e:MouseEvent): void {
			if (this.isTileLocked) {
				EyeTetravex.logConsole(this+" LOCKED!");
			}
			else {
				EyeTetravex.logConsole("Tile.mouseDown(): Owner table =\n"+this.table);
				this.parent.setChildIndex(this,this.parent.numChildren-1);
				var ds:DropShadowFilter = new DropShadowFilter(2, 35, 0x000000, 0.8, 5, 5, 1, 3, false, false, false);
				this.filters = [ ds ];
				this.startDrag();
			}
		}
		
		private function onMouseReleased(e:MouseEvent): void {
			if (! this.isTileLocked) {
				var sourceTable:Table = this.table;
				this.stopDrag();
				this.filters = [];
				this.eyeTetravex.autoStickTile(this);
				EyeTetravex.logConsole("Tile.mouseReleased: Source table =\n"+sourceTable);
				EyeTetravex.logConsole("Target table = \n"+this.table);
			}
		}
		
		public override function toString(): String {
			var str:String = "<TILE>";
			str += " N:"+this.northValue;
			str += " E:"+this.eastValue;
			str += " S:"+this.southValue;
			str += " W:"+this.westValue;
			str += " </TILE>";
			return str;
		}
		
		
		//-----------------------------------------------------------------------------------
		//		GETTERS AND SETTERS
		//-----------------------------------------------------------------------------------
		
		public function setEyeTetravex(et:EyeTetravex):void {
			this.eyeTetravex = et;
		}
		
		public function getTable():Table {
			return this.table;
		}
		
		public function setTable(t:Table):void {
			this.table = t;
		}
		
		public function getLine():int {
			return this.line;
		}
		
		public function setLine(line:int):void {
			this.line = line;
		}
		
		public function getColumn():int {
			return this.column;
		}
		
		public function setColumn(column:int):void {
			this.column = column;
		}
		
		public function getIsTileLocked():Boolean {
			return this.isTileLocked;
		}
		
		public function setIsTileLocked(locked:Boolean):void {
			this.useHandCursor = !locked;
			this.northEdge.useHandCursor = !locked;
			this.eastEdge.useHandCursor = !locked;
			this.southEdge.useHandCursor = !locked;
			this.westEdge.useHandCursor = !locked;
			
			this.isTileLocked = locked;
		}
		
		
		
		public function getNorthValue(): int {
			return this.northValue;
		}
		
		public function setNorthValue(val:int):void {
			this.northValue = val;
			this.northValueTextField.htmlText = "<b>"+val.toString()+"</b>";
			
			if (Game.useColoredNumbers) {
				 this.northValueTextField.textColor = Tile.EDGES_COLORS[val % 10];
			}
		}
		
		public function getEastValue(): int {
			return this.eastValue;
		}
		
		public function setEastValue(val:int):void {
			this.eastValue = val;
			this.eastValueTextField.htmlText = "<b>"+val.toString()+"</b>";
			
			if (Game.useColoredNumbers) {
				 this.eastValueTextField.textColor = Tile.EDGES_COLORS[val % 10];
			}
		}
		
		public function getSouthValue(): int {
			return this.southValue;
		}
		
		public function setSouthValue(val:int):void {
			this.southValue = val;
			this.southValueTextField.htmlText = "<b>"+val.toString()+"</b>";
			
			if (Game.useColoredNumbers) {
				 this.southValueTextField.textColor = Tile.EDGES_COLORS[val % 10];
			}
		}
		
		public function getWestValue(): int {
			return this.westValue;
		}
		
		public function setWestValue(val:int):void {
			this.westValue = val;
			this.westValueTextField.htmlText = "<b>"+val.toString()+"</b>";
			
			if (Game.useColoredNumbers) {
				 this.westValueTextField.textColor = Tile.EDGES_COLORS[val % 10];
			}
		}
	}
}