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
	import fl.controls.CheckBox;
	import fl.controls.NumericStepper;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	
	public class ConfigurationDialog extends Dialog {
		
		private var hasGameConfigChanged:Boolean = false;
		private var targetObject:Object;
		private var onCloseFunction:Function;
		
		
		public function ConfigurationDialog(targetObject:Object, onCloseFunction:Function) {
			super();
			this.levelStepper.addEventListener(Event.CHANGE, this.onGameConfigChanged);
			this.maxNumberStepper.addEventListener(Event.CHANGE, this.onGameConfigChanged);
			this.useColoredNumbersCheckbox.addEventListener(Event.CHANGE, this.onGameConfigChanged);
			
			this.targetObject = targetObject;
			this.onCloseFunction = onCloseFunction;
		}
		
		protected override function initComponents(): void {
			this.levelStepper.minimum = EyeTetravex.MIN_TABLE_SIZE;
			this.levelStepper.maximum = EyeTetravex.MAX_TABLE_SIZE;
			this.levelStepper.value = Game.getSize();
			
			this.maxNumberStepper.minimum = EyeTetravex.MIN_MAXNUMBER_VALUE;
			this.maxNumberStepper.maximum = EyeTetravex.MAX_MAXNUMBER_VALUE;
			this.maxNumberStepper.value = Game.getMaxNumber();
			
			this.useColoredNumbersCheckbox.selected = Game.useColoredNumbers;
			this.saveConfigToFileCheckbox.selected = Game.saveConfiguration;
			this.useSharedHighscoresCheckbox.selected = Game.useSharedHighscores;
			
			this.saveButton.addEventListener(MouseEvent.CLICK, this.saveButton_onClick);
			this.cancelButton.addEventListener(MouseEvent.CLICK, this.cancelButton_onClick);
		}
		
		private function saveConfiguration():void {
			Game.setSize(this.levelStepper.value);
			Game.setMaxNumber(this.maxNumberStepper.value);
			Game.useColoredNumbers = this.useColoredNumbersCheckbox.selected;
			Game.saveConfiguration = this.saveConfigToFileCheckbox.selected;
			Game.useSharedHighscores = this.useSharedHighscoresCheckbox.selected;
			
			var config:XML = <configuration></configuration>;
			config.appendChild("<level>"+this.levelStepper.value+"</level>");
			config.appendChild("<maxNumber>"+this.maxNumberStepper.value+"</maxNumber>");
			config.appendChild("<useColoredNumbers>"+this.useColoredNumbersCheckbox.selected+"</useColoredNumbers>");
			config.appendChild("<saveConfiguration>"+this.saveConfigToFileCheckbox.selected+"</saveConfiguration>");
			config.appendChild("<useSharedHighscores>"+this.useSharedHighscoresCheckbox.selected+"</useSharedHighscores>");
			
			EyeTetravex.logConsole("ConfigurationDialog: Sending configuration for saving process");
			EyeTetravex.logConsole(config.toXMLString());
			
			EyeTetravex.getRemoteCaller().sendCall("saveConfiguration",
												   this,
												   this.saveConfiguration_callback,
												   config);
		}
		
		private function saveConfiguration_callback():void {
			EyeTetravex.logConsole("Configuration saved successfully");
		}
		
		protected override function translateGUI():void {
			this.titleTextField.htmlText = "<b>"+I18n.getString("dialog_configuration_title")+"</b>";
			
			this.levelLabel.text = I18n.getString("dialog_configuration_level", new Array(EyeTetravex.MIN_TABLE_SIZE, EyeTetravex.MAX_TABLE_SIZE));
			this.maxValueLabel.text = I18n.getString("dialog_configuration_maxValue");
			this.useColoredNumbersCheckbox.label = I18n.getString("dialog_configuration_usecolorednumbers");
			this.notice1Label.htmlText = "<i>"+I18n.getString("dialog_configuration_notice1")+"</i>";
			
			this.saveConfigToFileCheckbox.label = I18n.getString("dialog_configuration_saveconfigtofile");
			this.useSharedHighscoresCheckbox.label = I18n.getString("dialog_configuration_usesharedhighscores");
			this.notice2Label.htmlText = "<i>"+I18n.getString("dialog_configuration_notice2")+"</i>";
			
			this.saveButton.label = I18n.getString("global_save");
			this.cancelButton.label = I18n.getString("global_cancel");
		}
		
		private function onGameConfigChanged(e:Event) {
			this.hasGameConfigChanged = true;
		}
		
		public override function close():void {
			this.onCloseFunction.call(this.targetObject);
			if (this.hasGameConfigChanged) {
				EyeTetravex.getInstance().confirmNewGame();
			}
			super.close();
		}
		
		
		
		private function saveButton_onClick(e:Event) {
			this.saveConfiguration();
			this.close();
		}
		
		private function cancelButton_onClick(e:Event) {
			this.close();
		}
		
		protected override function onRender(e:Event):Boolean {
			if (super.onRender(e)) {
				return true;
			}
			return false;
		}
	}
}