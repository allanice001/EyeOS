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
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.events.KeyboardEvent;
	import flash.ui.Keyboard;
	import flash.geom.Rectangle;
	
	
	public class Dialog extends MovieClip {
		
		private var _firstRender:Boolean = true;
		
		public function Dialog() {
			this.addEventListener(MouseEvent.MOUSE_DOWN, this.onMouseDown);
			this.addEventListener(MouseEvent.MOUSE_UP, this.onMouseReleased);
			this.addEventListener(Event.RENDER, this.onRender);
			this.addEventListener(KeyboardEvent.KEY_DOWN, this.onKeyDown);
			this.addEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage);
			
			var ds:DropShadowFilter = new DropShadowFilter(2, 35, 0x000000, 0.8, 5, 5, 1, 3, false, false, false);
			this.filters = [ ds ];
		}
		
		protected function initComponents():void {
			//to be overriden by child classes
		}
		
		protected function translateGUI():void {
			//to be overriden by child classes
		}
		
		public function close():void {
			this.removeEventListener(KeyboardEvent.KEY_DOWN, this.onKeyDown);
			this.stage.focus = this.stage;
			this.parent.removeChild(this);
		}
		
		
		
		protected function onMouseDown(e:MouseEvent):void {
			var rect:Rectangle = new Rectangle(0, 0, this.stage.stageWidth - this.width, this.stage.stageHeight - this.height);
			this.startDrag(false, rect);
		}
		
		protected function onMouseReleased(e:MouseEvent):void {
			this.stopDrag();
		}
		
		protected function onKeyDown(e:KeyboardEvent):void {
			if (e.keyCode == Keyboard.ESCAPE) {
				this.close();
			}
		}
		
		protected function onAddedToStage(e:Event):void {
			this.initComponents();
			this.translateGUI();
		}
		
		/**
		 * Called every time the movieclip is rendered; Moves the dialog to the center
		 * if it's the first time the event is raised.
		 * (avoid problems on components due to bad rendering synchro, c.f. Flash bugs)
		 * Then always swaps the dialog object in order to be on top of the other
		 * components (z-index).
		 * @param Event e
		 * @return Boolean TRUE if the event has been raised for the first time, FALSE
		 *                 otherwise (useful for derivated classes).
		 */
		protected function onRender(e:Event):Boolean {
			if (this._firstRender) {
				var scaleX:Number = this.stage.stageWidth / EyeTetravex.originalStageWidth;
				var scaleY:Number = this.stage.stageHeight / EyeTetravex.originalStageHeight;
				var minScale = (scaleX < scaleY)? scaleX : scaleY;
				
				this.x = (this.stage.stageWidth - (this.width * minScale)) / (2 * scaleX);
				this.y = (this.stage.stageHeight - (this.height * minScale)) / (2 * scaleY);
				
				this._firstRender = false;
				return true;
			}
			//ensure the dialog is always on top of the other components
			this.parent.setChildIndex(this,this.parent.numChildren-1);
			return false;
		}
	}
}