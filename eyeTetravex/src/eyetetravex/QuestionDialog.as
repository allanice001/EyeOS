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
	
	public class QuestionDialog extends Dialog {
		
		private var targetObject:Object;
		private var onYesFunction:Function;
		private var onNoFunction:Function;
		
		
		public function QuestionDialog(title:String, htmlText:String,
									   targetObject:Object = null, onYesFunction:Function = null, onNoFunction:Function = null) {
			super();
			this.yesButton.addEventListener(MouseEvent.CLICK, this.yesButton_onClick);
			this.noButton.addEventListener(MouseEvent.CLICK, this.noButton_onClick);
			
			this.titleTextField.htmlText = "<b>"+title+"</b>";
			this.textField.htmlText = htmlText;
			
			this.targetObject = targetObject;
			this.onYesFunction = onYesFunction;
			this.onNoFunction = onNoFunction;;
		}
		
		protected override function translateGUI():void {
			this.yesButton.label = I18n.getString("global_yes");
			this.noButton.label = I18n.getString("global_no");
		}
		
		public override function close():void {
			if (this.onNoFunction != null) {
				this.onNoFunction.call(this.targetObject);
			}
			super.close();
		}
		
		
		private function yesButton_onClick(e:Event) {
			if (this.onYesFunction != null) {
				this.onYesFunction.call(this.targetObject);
			}
			super.close();
		}
		
		private function noButton_onClick(e:Event) {
			this.close();
		}
	}
}