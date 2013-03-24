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
	import fl.controls.Button;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	
	public class Message extends Dialog {
		
		private var targetObject:Object;
		private var onCloseFunction:Function;
		
		
		public function Message(htmlText:String, targetObject:Object = null, onCloseFunction:Function = null) {
			super();
			this.closeButton.addEventListener(MouseEvent.CLICK, this.closeButton_onClick);
			
			this.textField.htmlText = htmlText;
			this.targetObject = targetObject;
			this.onCloseFunction = onCloseFunction;
		}
		
		private function closeButton_onClick(e:Event):void {
			this.close();
		}
		
		public override function close():void {
			if (this.onCloseFunction != null) {
				this.onCloseFunction.call(this.targetObject);
			}
			super.close();
		}
	}
}