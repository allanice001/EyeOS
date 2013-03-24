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
	
	public class I18n {
		
		private static var stringMap:Object = new Object();
		private static var defaultStringMap:Object = {
			//GLOBAL
			global_unknownString:"[Unknown string]",
			global_yes:"Yes",
			global_no:"No",
			global_save:"Save",
			global_cancel:"Cancel",
			global_close:"Close",
			
			//DEBUG
			global_test:"(TEST) {}",
			
			//MAIN BUTTONS
			main_button_newgame:"New game",
			main_button_configuration:"Configuration",
			main_button_highscores:"Highscores",
			main_button_fullscreen:"Fullscreen",
			
			//CONFIGURATION DIALOG
			dialog_configuration_title:"Configuration",
			dialog_configuration_level:"Level / board size ({}-{}):",
			dialog_configuration_maxValue:"Maximum value on edges:",
			dialog_configuration_usecolorednumbers:"Use colored numbers on tiles",
			dialog_configuration_notice1:"These options won't be applied until you start a new game.",
			dialog_configuration_saveconfigtofile:"Always remember my last configuration",
			dialog_configuration_usesharedhighscores:"Use shared highscores on server (all users)",
			dialog_configuration_notice2:"These features can only be used when running from an eyeOS server.",
			
			//HIGHSCORES DIALOG
			dialog_highscores_title:"Highscores",
			dialog_highscores_boardsize:"Board size :",
			dialog_highscores_column_rank:"Rank",
			dialog_highscores_column_user:"User",
			dialog_highscores_column_date:"Date",
			dialog_highscores_column_maximum:"Maximum",
			dialog_highscores_column_time:"Time",
			dialog_highscores_column_moves:"Moves",
			
			//NEW GAME DIALOG
			dialog_newgame_title:"New game",
			dialog_newgame_text:"Do you want to start a new game?",
			
			//GAME OVER DIALOG
			dialog_gameover_finished:"Finished!",
			dialog_gameover_yourrank:"Your rank:",
			dialog_gameover_tipused:"Tip used! Ranking disabled...",
			dialog_gameover_advisehigherlevel:"Maybe you should try a higher level...",
			dialog_gameover_yourtime:"Your time:",
			dialog_gameover_nummoves:"Number of moves:",
			
			//NETWORK PROBLEM DIALOG
			dialog_netprob_title:"Network problem",
			dialog_netprob_text1:"Unable to connect to the host server.",
			dialog_netprob_text2:"Would you like to disable eyeOS related features?"
		};
		
		public static function setStringMap(map:Object): void {
			I18n.stringMap = map;
		}
		
		public static function setString(key:String, string:String): void {
			if (key == undefined || key == "") {
				EyeTetravex.logConsole("I18n.setString(): Error setting string, the key can't be empty!");
			}
			EyeTetravex.logConsole("I18n.setString(): Setting string \""+string+"\" for key \""+key+"\"");
			I18n.stringMap[key] = string;
		}
		
		public static function getString(key:String, tokens:Array = null): String {
			var string:String;
			var returnString:String = "";
			
			if (I18n.stringMap[key] == undefined || I18n.stringMap[key] == "") {
				EyeTetravex.logConsole("I18n.getString(): String not found for key \""+key+"\", checking default");
				
				if (I18n.defaultStringMap[key] == undefined || I18n.defaultStringMap[key] == "") {
					EyeTetravex.logConsole("I18n.getString(): Default string not found for key \""+key+"\"!");
					return key;
				}
				else {
					string = I18n.defaultStringMap[key];
					EyeTetravex.logConsole("I18n.getString(): Default string found for key \""+key+"\": "+string);
				}
			}
			else {
				string = I18n.stringMap[key];
				EyeTetravex.logConsole("I18n.getString(): String found for key \""+key+"\": "+string);
			}
			
			if (tokens != null && tokens.length > 0) {
				var tmpArray:Array = string.split("{}");
				
				for(var i:int = 0; i < tmpArray.length; i++) {
					returnString = returnString.concat(tmpArray[i]);
					if (tokens[i] != undefined) {
						returnString = returnString.concat(tokens[i]);
					}
				}
			}
			else {
				returnString = string;
			}
			return returnString;
		}
	}
}