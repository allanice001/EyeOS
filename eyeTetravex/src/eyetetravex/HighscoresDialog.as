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
	import flash.text.TextField;
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import fl.data.DataProvider;
	import fl.controls.DataGrid;
	import fl.controls.dataGridClasses.DataGridColumn;

	
	public class HighscoresDialog extends Dialog {
		
		private var targetObject:Object;
		private var onCloseFunction:Function;
		
		private var highscoresDataProvider:DataProvider;
		
		public function HighscoresDialog(targetObject:Object = null, onCloseFunction:Function = null) {
			super();
			
			this.closeButton.addEventListener(MouseEvent.CLICK, this.closeButton_onClick);
			this.targetObject = targetObject;
			this.onCloseFunction = onCloseFunction;
		
			this.highscoresDataProvider = new DataProvider();
			this.highscoresGrid.dataProvider = this.highscoresDataProvider;
			
			this.reloadHighscores();
		}
		
		protected override function initComponents(): void {
			var selectedSizeIndex:int;
			var sizes:DataProvider = new DataProvider();
			this.sizesCombo.dataProvider = sizes;
			
			for (var i:int = EyeTetravex.MIN_TABLE_SIZE, j:int = 0 ; i < EyeTetravex.MAX_TABLE_SIZE ; i++, j++) {
				sizes.addItem({label:i+"x"+i, data:i.toString()});
				if (i == Game.getSize())
					selectedSizeIndex = j;
			}
			this.sizesCombo.selectedIndex = selectedSizeIndex;
			this.sizesCombo.addEventListener(Event.CHANGE, this.sizesCombo_onChange);
			
			var rankColumn:DataGridColumn = new DataGridColumn("rank");
			rankColumn.headerText = I18n.getString("dialog_highscores_column_rank");
			this.highscoresGrid.addColumn(rankColumn);
			var userColumn:DataGridColumn = new DataGridColumn("user");
			userColumn.headerText = I18n.getString("dialog_highscores_column_user");
			this.highscoresGrid.addColumn(userColumn);
			var dateColumn:DataGridColumn = new DataGridColumn("date");
			dateColumn.headerText = I18n.getString("dialog_highscores_column_date");
			this.highscoresGrid.addColumn(dateColumn);
			var maxColumn:DataGridColumn = new DataGridColumn("maximum");
			maxColumn.headerText = I18n.getString("dialog_highscores_column_maximum");
			this.highscoresGrid.addColumn(maxColumn);
			var timeColumn:DataGridColumn = new DataGridColumn("time");
			timeColumn.headerText = I18n.getString("dialog_highscores_column_time");
			this.highscoresGrid.addColumn(timeColumn);
			var movesColumn:DataGridColumn = new DataGridColumn("moves");
			movesColumn.headerText = I18n.getString("dialog_highscores_column_moves");			
			this.highscoresGrid.addColumn(movesColumn);
			
			//styles?
			// ...
		}
		
		protected override function translateGUI():void {
			this.titleTextField.htmlText = "<b>"+I18n.getString("dialog_highscores_title")+"</b>";
			this.boardSizeTextField.text = I18n.getString("dialog_highscores_boardsize");
			this.closeButton.label = I18n.getString("global_close");
		}
		
		private function reloadHighscores(): void {
			this.highscoresDataProvider.removeAll();
			
			var params:XML = <eyeTetravex></eyeTetravex>;
			params.appendChild("<useSharedHighscores>"+Game.useSharedHighscores+"</useSharedHighscores>");
			EyeTetravex.getRemoteCaller().sendCall("loadHighscores",
												   this,
												   this.reloadHighscores_callback,
												   params);			
		}
		
		private function reloadHighscores_callback(response:XML): void {
			try {
				var highscoresRegular:XMLList = response.child("highscores_regular");
				var highscoresNode:XMLList;
				
				//search the highscores according to the selected size
				for (var i:int = 0 ; i < highscoresRegular.child("size").length() ; i++) {
					if (highscoresRegular.child("size")[i].child("value") == this.sizesCombo.selectedItem.data)
						highscoresNode = highscoresRegular.child("size")[i].child("highscore");
				}
				
				//fill in the grid with values
				for (i = 0 ; i < highscoresNode.length() ; i++) {
					var currentHighscore:XML = highscoresNode[i];
					this.highscoresDataProvider.addItem({rank:currentHighscore.rank,
														user:currentHighscore.user,
														date:currentHighscore.date,
														maximum:currentHighscore.maxNumber,
														time:currentHighscore.time,
														moves:currentHighscore.moves});
				}
			}
			catch(e:Error) {
				EyeTetravex.logConsole("HighscoresDialog: Error processing returned highscores");
				EyeTetravex.logConsole("HighscoresDialog: Error =\n"+e.toString());
			}
		}
		
		
		
		private function sizesCombo_onChange(e:Event):void {
			this.reloadHighscores();
		}
		
		protected override function onMouseDown(e:MouseEvent):void {
			var isMouseOverGrid:Boolean = 
				((this.mouseX >= this.highscoresGrid.x
						&& this.mouseX < (this.highscoresGrid.x + this.highscoresGrid.width))
				  &&
				  	(this.mouseY >= this.highscoresGrid.y
						&& this.mouseY < (this.highscoresGrid.y + this.highscoresGrid.height))
				);
			var isMouseOverCombo:Boolean = 
				((this.mouseX >= this.sizesCombo.x
						&& this.mouseX < (this.sizesCombo.x + this.sizesCombo.width))
				  &&
				  	(this.mouseY >= this.sizesCombo.y
						&& this.mouseY < (this.sizesCombo.y + this.sizesCombo.height))
				);
			
			
			//the cursor must be out of the grid and the combo to drag the box
			if (! (isMouseOverGrid || isMouseOverCombo)){
				super.onMouseDown(e);
			}
		}
		
		private function closeButton_onClick(e:Event) {
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