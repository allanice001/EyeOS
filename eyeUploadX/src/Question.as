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

/**
 * @author Nanawel (nanawel@eyeos.org)
 * @version 2.1.0
 * @updated 25-Apr-2009
 */

package {	
	import flash.display.MovieClip;
	import flash.filters.DropShadowFilter;
	import fl.controls.Button;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	
	public class Question extends MovieClip {
		
		public function Question() {
			this.yesButton.addEventListener(MouseEvent.CLICK, this.yesButton_onClick);
			this.noButton.addEventListener(MouseEvent.CLICK, this.noButton_onClick);
			var ds:DropShadowFilter = new DropShadowFilter(2, 35, 0x000000, 0.8, 5, 5, 1, 3, false, false, false);
			this.filters = [ ds ];
		}
		
		private function yesButton_onClick(e:Event) {
			this.parent.removeChild(this);
		}
		
		private function noButton_onClick(e:Event) {
			this.parent.removeChild(this);
		}
	}
}