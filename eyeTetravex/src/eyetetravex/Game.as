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
	
	import eyetetravex.EyeTetravex;
	import eyetetravex.Tile;
	
	
	public class Game {
		
		//USER CONFIGURATION							| default values
		private static var size:int 					= 3;					//level
		private static var maxNumber:int 				= 9;					//maximum value on edges
		public static var useColoredNumbers:Boolean 	= true;
		public static var saveConfiguration:Boolean 	= true;
		public static var useSharedHighscores:Boolean 	= true;
		
		public static var tipUsed:Boolean = false;
		public static var numMoves:int = 0;
		
		/**
		 * @return Array The sorted array of pieces
		 */
		public static function generateNewGame(): Array {
			var gameBoard:Array = new Array(Game.size);
			
			for (var i:int = 0 ; i < Game.size ; i++) {
				gameBoard[i] = new Array(Game.size);
				
				for (var j:int = 0 ; j < Game.size ; j++) {
					var tile:Tile = new Tile();
					
					if (i == 0) {
						//first line
						tile.setNorthValue(Game.getRandomNumber());
					}
					else {
						tile.setNorthValue(gameBoard[i-1][j].getSouthValue());
					}
					
					if (j == 0) {
						//first column
						tile.setWestValue(Game.getRandomNumber());
					}
					else {
						tile.setWestValue(gameBoard[i][j-1].getEastValue());
					}
					
					tile.setEastValue(Game.getRandomNumber());
					tile.setSouthValue(Game.getRandomNumber());
					
					gameBoard[i][j] = tile;
				}
			}
			return gameBoard;
		}
		
		private static function getRandomNumber(): int {
			return Math.round(Math.random() * Game.maxNumber);
		}
		
		
		
		//-----------------------------------------------------------------------------------
		//		GETTERS AND SETTERS
		//-----------------------------------------------------------------------------------
		
		public static function getSize():int {
			return Game.size;
		}
		
		public static function setSize(size:int):void {
			if (size < EyeTetravex.MIN_TABLE_SIZE || size > EyeTetravex.MAX_TABLE_SIZE) {
				size = 3;
			}
			Game.size = size;
		}
		
		public static function getMaxNumber():int {
			return Game.maxNumber;
		}
		
		public static function setMaxNumber(maxNumber:int):void {
			if (maxNumber < EyeTetravex.MIN_MAXNUMBER_VALUE || maxNumber > EyeTetravex.MAX_MAXNUMBER_VALUE) {
				maxNumber = 9;
			}
			Game.maxNumber = maxNumber;
		}
	}
}