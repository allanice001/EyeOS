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
	
	public class OrderedTable extends Table {
		
		public function OrderedTable(size:int) {
			super(size);
		}
		
		
		/**
		 * Sticks the specified tile to the square located at the specified line and column.
		 * @param Tile tile
		 * @param int line
		 * @param int column
		 * @return boolean TRUE if the tile was successfully placed at the given location, FALSE otherwise
		 */
		public override function putTileAt(tile:Tile, line:int, column: int):Boolean {
			//do tiles numbers match?
			if (this.isTileMatching(tile, line, column)) {
				return super.putTileAt(tile, line, column);
			}
			else {
				EyeTetravex.logConsole("OrderedTable.putTileAt(): Square "+this._name+"("+line+","+column+") has no matching tiles around");
				return false;
			}
		}
		
		/**
		 * Checks if the numbers on the tile's edges are matching with the ones on the
		 * tiles already placed around.
		 * @param Tile tile
		 * @param int line
		 * @param int column
		 * @return boolean TRUE if numbers on the tile are matching, FALSE otherwise
		 */
		public function isTileMatching(tile:Tile, line:int, column:int):Boolean {
			var isMatching:Boolean = true;
			
			//check tile's NORTH value
			if (line > 0) {
				if (this.tiles[line-1][column] != undefined && this.tiles[line-1][column] != tile) {
					if (this.tiles[line-1][column].getSouthValue() != tile.getNorthValue())
						isMatching = false;
				}
			}
			
			//check tile's SOUTH value
			if (line < this.size-1) {
				if (this.tiles[line+1][column] != undefined && this.tiles[line+1][column] != tile) {
					if (this.tiles[line+1][column].getNorthValue() != tile.getSouthValue())
						isMatching = false;
				}
			}
			
			//check tile's WEST value
			if (column > 0) {
				if (this.tiles[line][column-1] != undefined && this.tiles[line][column-1] != tile) {
					if (this.tiles[line][column-1].getEastValue() != tile.getWestValue())
						isMatching = false;
				}
			}
			
			//check tile's EAST value
			if (column < this.size-1) {
				if (this.tiles[line][column+1] != undefined && this.tiles[line][column+1] != tile) {
					if (this.tiles[line][column+1].getWestValue() != tile.getEastValue())
						isMatching = false;
				}
			}
			
			return isMatching;
		}
	}
}