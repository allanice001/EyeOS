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
	import flash.display.DisplayObject;
	import flash.events.MouseEvent;	
	
	public class Table extends MovieClip {
		
		public static const COMPONENT_WIDTH:int = 300;
		
		protected var _name:String;
		protected var size: int;
		protected var tiles:Array;
		
		public function Table(size:int) {
			this.size = size;
			this.tiles = new Array(size);
			
			for (var i:int = 0 ; i < size ; i++) {
				this.tiles[i] = new Array(size);
				
				for (var j:int = 0 ; j < size ; j++) {
					var fakeTile:DisplayObject = this.addChild(new FakeTile());
					fakeTile.x = j * fakeTile.width;
					fakeTile.y = i * fakeTile.height;
				}
			}
		}
		
		/**
		 * Sticks the specified tile to the square located at the specified line and column
		 * @param Tile tile
		 * @param int line
		 * @param int column
		 * @return TRUE if the tile was successfully placed at the given location, FALSE otherwise
		 */
		public function putTileAt(tile:Tile, line:int, column:int):Boolean {			
			//square must be free or tiles objects must be equals
			if (this.isSquareFree(line, column)
				|| this.tiles[line][column] == tile) {
				
				if (tile.getTable() != null) {
					tile.getTable().removeTileAt(tile.getLine(), tile.getColumn());
				}
				this.tiles[line][column] = tile;
				
				EyeTetravex.logConsole("Table.putTileAt("+tile+","+line+","+column+")");
				
				tile.setTable(this);
				tile.setLine(line);
				tile.setColumn(column);
				tile.scaleX = this.scaleX;
				tile.scaleY = this.scaleY;
				
				tile.x = this.x + (tile.width * column);
				tile.y = this.y + (tile.height * line);
				
				return true;
			}
			EyeTetravex.logConsole("Table.putTileAt(): Square "+this._name+"("+line+","+column+") is not free");
			return false;
		}
		
		/**
		 * Checks whether the square located at the specified line and column is free or not
		 * @param int line
		 * @param int column
		 */
		public function isSquareFree(line:int, column:int): Boolean {
			return (this.tiles[line][column] == undefined);
		}
		
		/**
		 * Finds the corresponding square to stick the specified tile according to its current location
		 * @param Tile tile
		 */
		public function autoStickTile(tile:Tile):void {
			var column:int = this.getColumnFromX(tile.x + (tile.width / 2));
			var line:int = this.getLineFromY(tile.y + (tile.height / 2));
			
			//the tile must be put down on a different square from the one it was on
			//to be counted as a "real" move
			var realMove:Boolean = (this.tiles[line][column] != tile);
			
			if (this.putTileAt(tile, line, column)) {
				if (realMove)
					Game.numMoves++;
			}
			else {
				//put the tile back to its original location
				tile.getTable().putTileAt(tile, tile.getLine(), tile.getColumn());
			}
		}
		
		/**
		 * Searches a free square into the table and puts the tile on the first one it finds
		 * @param Tile tile
		 */
		public function putTile(tile:Tile):void {
			for (var i:int = 0 ; i < this.size ; i++) {
					for (var j:int = 0 ; j < this.size ; j++) {
						if (this.tiles[i][j] == undefined) {
							this.putTileAt(tile, i, j);
						}
					}
				}
		}
		
		protected function getLineFromY(y:int):int {
			var line:int = Math.floor((y - this.y) / (this.height / this.size));
			return line;
		}
		
		protected function getColumnFromX(x:int):int {
			var column:int = Math.floor((x - this.x) / (this.width / this.size));
			return column;
		}
		
		public function removeTile(tile:Tile):void {
			for (var i:int = 0 ; i < this.size ; i++) {
				for (var j:int = 0 ; j < this.size ; j++) {
					if (this.tiles[i][j] == tile) {
						this.removeTileAt(i, j);
					}
				}
			}
		}
		
		public function removeTileAt(line:int, column:int): void {
			this.tiles[line][column] = undefined;
		}
		
		public function empty():void {
			for (var i:int = 0 ; i < this.size ; i++) {
				for (var j:int = 0 ; j < this.size ; j++) {
					this.tiles[i][j] = undefined;
				}
			}
		}
		
		public function lockTiles(lock:Boolean):void {
			for (var i:int = 0 ; i < this.size ; i++) {
				for (var j:int = 0 ; j < this.size ; j++) {
					if (this.tiles[i][j] != null && this.tiles[i][j] != undefined) {
						this.tiles[i][j].setIsTileLocked(lock);
					}
				}
			}
		}
		
		public function isFull():Boolean {
			var full:Boolean = true;
			for (var i:int = 0 ; i < this.size ; i++) {
				for (var j:int = 0 ; j < this.size ; j++) {
					if (this.tiles[i][j] == undefined) {
						full = false;
					}
				}
			}
			return full;
		}
		
		
		
		
		public override function toString():String {
			var str:String = "<Table name=\""+this._name+"\">\n";
			for(var i:int = 0 ; i < this.tiles.length ; i++) {
				str += "\t #"+i+"# ";
				for(var j:int = 0 ; j < this.tiles[i].length ; j++) {
					str += " ["+j+"]"+this.tiles[i][j];
				}
				str += "\n";
			}
			str += "</Table>";
			return str;
		}
		
		//-----------------------------------------------------------------------------------
		//		GETTERS AND SETTERS
		//-----------------------------------------------------------------------------------
		
		public function getName():String {
			return this._name;
		}
		
		public function setName(name:String):void {
			this._name = name;
		}
		
		public function getSize(): int {
			return this.size;
		}
		
		public function setSize(size:int):void {
			this.size = size;
		}
		
		public function getTiles():Array {
			return this.tiles;
		}
	}
}