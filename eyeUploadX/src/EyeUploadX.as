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
 *
 * == Animation parameters: ==
 * - checknum: eyeX checknum of the eyeUploadX instance
 * - scriptUrl: URL of the page to call to make an AJAX request
 * - sid: PHP current session ID
 * - signal: "event" to raise at the end of a transfer, to complete operation through PHP
 * - flashFix: eyeOS special parameter to pass into the GET request when sending a file to get the PHP session back
 */

package {	
	import fl.controls.Button;
	import fl.controls.Label;
	import fl.controls.DataGrid;
	import fl.controls.ProgressBar;
	import fl.controls.ProgressBarMode;
	
	import fl.data.DataProvider;
	
	import flash.display.MovieClip;
	
	import flash.events.MouseEvent;
	import flash.events.Event;
	import flash.events.ProgressEvent;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	import flash.events.DataEvent;
	
	import flash.external.ExternalInterface;
	
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	import flash.net.URLVariables;
	import flash.net.FileReferenceList;
	import flash.net.URLLoader;
	
	import flash.system.Capabilities;
	import flash.system.Security;
	
	import flash.text.TextFieldAutoSize;
	import flash.text.TextField;
	
	public class EyeUploadX extends MovieClip {
		
		//components
		private var fileReferenceList: FileReferenceList;
		private var fileListDataProvider: DataProvider;
		private var uploadingLabel: Label;
		
		//labels
		private var progressFileLabel:String = "Transfering: ";
		private var filesTooBigWarning:String = "<b>Some files are too big!</b>\n"
										 +"Some of the selected files are too big and may be rejected by the server at the end of the transfer.\n"
										 +"Do you want to remove them now?";
		private var messageClose:String = "Close";
		private var questionYes:String = "Yes: ";
		private var questionNo:String = "No: ";
		
		//other components
		private var xmlLoader: URLLoader;
		
		//var
		private var maxFilesizeAllowed: Number = 4 * 1024 * 1024 * 1024;		//default is set to 4GB
		private var nbFilesToUpload: Number;
		private var totalBytesToUpload: Number;
		private var currentUploadedBytes: Number;
		private var currentFileNumber: Number;
		
		//==================================================================================================
		//				INITIALIZATION
		//==================================================================================================
		//Constructor
		public function EyeUploadX() {
			this.addFilesButton.addEventListener(MouseEvent.CLICK, this.addFilesButton_onClick);
			this.removeFileButton.addEventListener(MouseEvent.CLICK, this.removeFileButton_onClick);
			this.uploadButton.addEventListener(MouseEvent.CLICK, this.uploadButton_onClick);
			
			this.fileReferenceList = new FileReferenceList();
			this.fileReferenceList.addEventListener(Event.SELECT, this.fileReferenceList_onSelect);
			
			this.fileListDataProvider = new DataProvider();
			this.filesGrid.dataProvider = this.fileListDataProvider;
			this.filesGrid.columns = ["filename", "size", "data"];
			this.filesGrid.getColumnAt(1).width = 80;
			this.filesGrid.getColumnAt(2).visible = false;
			this.filesGrid.getColumnAt(0).headerText = "Filename";
			this.filesGrid.getColumnAt(1).headerText = "Size (KB)";
			
			this.nbFilesToUpload = 0;
			this.warningTextField.visible = false;
			this.maxFilesizeValueLabel.text = "Unknown";
			this.percentProgressTextField.htmlText = "";
			
			this.addEventListener("addedToStage", this.onLoad);
		}
		
		//Executed after main MovieClip has been loaded,
		//sets states of some elements
		public function onLoad(e:Event):void {
			//DEBUG
			/*this.displayMessage("<b>-DEBUG-</b>"
								+"\n<b>scriptUrl:</b> "+root.loaderInfo.parameters.scriptUrl
								+"\n<b>checknum:</b> "+root.loaderInfo.parameters.checknum
								+"\n<b>SID:</b> "+root.loaderInfo.parameters.sid
								+"\n<b>signal:</b> "+root.loaderInfo.parameters.signal
								+"\n<b>flashFix:</b> "+root.loaderInfo.parameters.flashFix);*/
			
			this.uploadButton.enabled = false;
			this.filesGrid.allowMultipleSelection = true;
			initVar();
		}
		
		
		//==================================================================================================
		//				XML PROCESSING
		//==================================================================================================
		//Makes an XML call to get the captions back
		//(see PHP function eyeUploadX_on_initFlash())
		private	function initVar():void {
			var myXMLURL:URLRequest = new URLRequest(root.loaderInfo.parameters.scriptUrl
													 +"?checknum="+root.loaderInfo.parameters.checknum
													 +"&msg=initFlash");
													 //+"&debug=1");	// ## DEBUG ##
			this.xmlLoader = new URLLoader();
			
			//error handler
			this.xmlLoader.addEventListener(IOErrorEvent.IO_ERROR, this.errorHandler);
			this.xmlLoader.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.errorHandler);
			this.xmlLoader.addEventListener(HTTPStatusEvent.HTTP_STATUS, this.errorHandler);
			
			this.xmlLoader.addEventListener(Event.COMPLETE, this.initVar_xmlLoaded);
			this.xmlLoader.load(myXMLURL);
		}
		
		//Reads and processes the XML returned by the PHP script,
		//updates the caption strings of the components
		public function initVar_xmlLoaded(event:Event):void {
			var	myXML:XML = XML(this.xmlLoader.data);
			
			this.maxFilesizeAllowed = myXML.child("config").child("upload_max_filesize");			
			
			//ADD BUTTON
			var addFilesLabel:String = myXML.child("labels").child("addFiles").attribute("caption");
			if (addFilesLabel != null && addFilesLabel != "")
				this.addFilesButton.label = addFilesLabel;
			//REMOVE BUTTON
			var removeLabel:String = myXML.child("labels").child("removeFile").attribute("caption");
			if (removeLabel != null && removeLabel != "")
				this.removeFileButton.label = removeLabel;
			//UPLOAD BUTTON
			var uploadLabel:String = myXML.child("labels").child("upload").attribute("caption");
			if (uploadLabel != null && uploadLabel != "")
				this.uploadButton.label = uploadLabel;
			//PROGRESS LABEL: Init
			var progressInitLabel:String = myXML.child("labels").child("progressInit").attribute("caption");
			if (progressInitLabel != null && progressInitLabel != "")
				this.progressTextField.text = progressInitLabel;
			//PROGRESS BUTTON: Transfering
			var progressFileText:String = myXML.child("labels").child("progressFile").attribute("caption");
			if (progressFileText != null && progressFileText != "")
				this.progressFileLabel = progressFileText;
			
			//MAX FILESIZE ALLOWED LABEL
			var maxUploadFilesizeText:String = myXML.child("labels").child("maxUploadFilesize").attribute("caption");
			if (maxUploadFilesizeText != null && maxUploadFilesizeText != "")
				this.maxFilesizeLabel.text = maxUploadFilesizeText;
			else
				this.maxFilesizeLabel.text = "";
			//MAX FILESIZE ALLOWED VALUE LABEL
			var maxUploadFilesizeValueText:String = myXML.child("labels").child("maxUploadFilesizeValue").attribute("caption");
			if (maxUploadFilesizeValueText != null && maxUploadFilesizeValueText != "")
				this.maxFilesizeValueLabel.text = maxUploadFilesizeValueText;
			else
				this.maxFilesizeValueLabel.text = "";
			
			//FILES GRID: Filename column
			var filenameColumnHeader:String = myXML.child("labels").child("filenameColumnHeader").attribute("caption");
			if (filenameColumnHeader != null && filenameColumnHeader != "")
				this.filesGrid.getColumnAt(0).headerText = filenameColumnHeader;
			else
				this.filesGrid.getColumnAt(0).headerText = "Filename";
			//FILES GRID: Filesize column
			var filesizeColumnHeader:String = myXML.child("labels").child("filesizeColumnHeader").attribute("caption");
			if (filesizeColumnHeader != null && filesizeColumnHeader != "")
				this.filesGrid.getColumnAt(1).headerText = filesizeColumnHeader;
			else
				this.filesGrid.getColumnAt(1).headerText = "Size (KB)";
			
			//FILES TOO BIG WARNING
			var filesTooBigWarning:String = myXML.child("labels").child("filesTooBigWarning").attribute("caption");
			if (filesTooBigWarning != null && filesTooBigWarning != "")
				this.filesTooBigWarning = filesTooBigWarning;
			
			//MESSAGE: Ok
			var messageClose:String = myXML.child("labels").child("messageClose").attribute("caption");
			if (messageClose != null && messageClose != "")
				this.messageClose = messageClose;
			
			//QUESTION: Yes
			var questionYes:String = myXML.child("labels").child("questionYes").attribute("caption");
			if (questionYes != null && questionYes != "")
				this.questionYes = questionYes;
				
			//QUESTION: No
			var questionNo:String = myXML.child("labels").child("questionNo").attribute("caption");
			if (questionNo != null && questionNo != "")
				this.questionNo = questionNo;
			
			
			//---- FLASH VERSION CHECK & WARNING ----
			//(Versions older than 9.0.124.0 may not work well under Linux)
			if (Capabilities.os.search("Linux") != -1) {
				var versionNumber:Array = Capabilities.version.split(',');
				var majorNumber:Array = versionNumber[0].split(' ');
				versionNumber[0] = majorNumber[1];
				for(var i = 1 ; i < 4 ; i++) {
					versionNumber[i] = new Number(versionNumber[i]);
				}
				if (versionNumber[0] < 9
					|| (versionNumber[0] == 9 && versionNumber[1] == 0 && versionNumber[2] < 124)) {
					this.warningTextField.wordWrap = true;
					this.warningTextField.htmlText = "-- Warning --\n\n"
										+"Your Flash player is deprecated and you may experience errors during transfers.\n"
										+"Please update your Flash player to the lastest version to fully enjoy this tool.";
					this.warningTextField.visible = true;
				}
			}
		}
		
		
		//==================================================================================================
		//				EVENTS
		//==================================================================================================
		public function addFilesButton_onClick(e:MouseEvent):void {
			this.fileReferenceList.browse();
		}
		
		public function removeFileButton_onClick(e:MouseEvent):void {
			for (var i:Number = 0 ; i < this.filesGrid.selectedIndices.length ; i++) {
				this.filesGrid.removeItemAt(this.filesGrid.selectedIndices[i]);
			}
			this.checkFileList();
		}
		
		public function uploadButton_onClick(e:MouseEvent):void {
			var error:Boolean = false;
			for(var i:int = 0; i < this.fileListDataProvider.length; i++) {
				if (this.fileListDataProvider.getItemAt(i).size > this.maxFilesizeAllowed / 1024) {
					this.displayQuestion(filesTooBigWarning,
										 this.filesTooBigWarning_yesButton,
										 this.filesTooBigWarning_noButton);
					error = true;
					break;
				}
			}
			if (!error) {
				this.startTransfers();
			}
		}
		
		public function filesTooBigWarning_yesButton(e:Event):void {
			for(var i:int = 0; i < this.fileListDataProvider.length; i++) {
				if (this.fileListDataProvider.getItemAt(i).size > this.maxFilesizeAllowed / 1024) {
					this.fileListDataProvider.removeItemAt(i);
				}
			}
			if (this.fileListDataProvider.length > 0) {
				this.startTransfers();
			}
		}
		
		public function filesTooBigWarning_noButton(e:Event):void {
			this.startTransfers();
		}
		
		public function fileReferenceList_onSelect(e:Event):void {
			this.warningTextField.visible = false;
			for(var i:Number = 0 ; i < this.fileReferenceList.fileList.length ; i++) {
				this.fileListDataProvider.addItem(
					{
						filename:this.fileReferenceList.fileList[i].name,
						size:Math.round(this.fileReferenceList.fileList[i].size / 1024),
						data:this.fileReferenceList.fileList[i]
					}
				);
			}
			this.checkFileList();
		}
		
		public function fileReference_onOpen(e:Event):void {
			this.progressTextField.htmlText = this.progressFileLabel
												+this.fileListDataProvider.getItemAt(0).data.name;
												//+ "("+this.fileListDataProvider.getItemAt(0).data.size+" KB)";
			this.progressBar.setProgress(0,1);
		}
		
		public function fileReference_onProgress(e:ProgressEvent):void {
			var ratio:Number = e.bytesLoaded / e.bytesTotal;
			this.progressBar.setProgress(ratio, 1);
		}
		
		public function fileReference_onComplete(e:Event):void {
			this.currentUploadedBytes += this.fileListDataProvider.getItemAt(0).size;
			this.updateOverallProgress();
			this.fileListDataProvider.removeItemAt(0);
			this.progressBar.setProgress(0,1);
			this.currentFileNumber++;
			this.startNextUpload();
		}
		
		public function fileReference_onUploadCompleteData(e:DataEvent) {
			var response:XML = new XML(e.data);
			ExternalInterface.call("eyeMessageBoxShow", response.child("message").toString());
		}
		
		
		//==================================================================================================
		//				ERRORS MANAGEMENT
		//==================================================================================================
		public function errorHandler(e:Event):void {
			if (e is HTTPStatusEvent) {
				if (HTTPStatusEvent(e).status == 0
					|| (HTTPStatusEvent(e).status >= 200 || HTTPStatusEvent(e).status < 300))		//HTTP code OK
					return;
			}
			this.displayMessage("<b>An error occured!</b>\nType: "+e.type+"\n"+e.toString());
		}
		
		private function displayMessage(text:String):void {			
			var message:Message = new Message();
			message.closeButton.label = this.messageClose;
			message.textField.htmlText = text;
			this.addChild(message);
			message.x = (this.width - message.width) / 2;
			message.y = (this.height - message.height) / 2;
		}
		
		private function displayQuestion(text:String, yesCallback:Function, noCallback:Function):void {			
			var question:Question = new Question();
			question.yesButton.label = this.questionYes;
			question.noButton.label = this.questionNo;
			question.textField.htmlText = text;
			question.yesButton.addEventListener(MouseEvent.CLICK, yesCallback);
			question.noButton.addEventListener(MouseEvent.CLICK, noCallback);
			this.addChild(question);
			question.x = (this.width - question.width) / 2;
			question.y = (this.height - question.height) / 2;
		}
		
		//==================================================================================================
		//				TRANSFERS PROCESSING
		//==================================================================================================
		
		private function startTransfers():void {
			this.nbFilesToUpload = this.fileListDataProvider.length;
			this.currentFileNumber = 1;
			this.totalBytesToUpload = 0;
			this.currentUploadedBytes = 0;
			for(var i:int = 0; i < this.fileListDataProvider.length; i++) {
				this.totalBytesToUpload += this.fileListDataProvider.getItemAt(i).size;
			}
			this.percentProgressTextField.htmlText = "0%";
			this.startNextUpload();
		}
		
		//Starts next available upload if there's some
		//otherwise reactivates the components of the application
		private function startNextUpload():void {
			if (this.fileListDataProvider.length > 0) {
				this.disableComponents(true);
				var nextUpload:Object = this.fileListDataProvider.getItemAt(0);
				nextUpload.data.addEventListener(Event.OPEN, this.fileReference_onOpen);
				nextUpload.data.addEventListener(ProgressEvent.PROGRESS, this.fileReference_onProgress);
				nextUpload.data.addEventListener(Event.COMPLETE, this.fileReference_onComplete);
				nextUpload.data.addEventListener(DataEvent.UPLOAD_COMPLETE_DATA, this.fileReference_onUploadCompleteData);
				nextUpload.data.addEventListener(IOErrorEvent.IO_ERROR, this.errorHandler);
				nextUpload.data.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.errorHandler);
				
				var uploadUrl:String = root.loaderInfo.parameters.scriptUrl
										+"?PHPSESSID="+root.loaderInfo.parameters.sid
										+"&checknum="+root.loaderInfo.parameters.checknum
									 	+"&msg="+root.loaderInfo.parameters.signal
										+"&"+root.loaderInfo.parameters.flashFix+"=1";
										//+"&debug=1";	// ## DEBUG ##
				
				//this.displayMessage("<b>Upload URL</b>\n"+uploadUrl);	// ## DEBUG ##
				
				var uploadUrlRequest:URLRequest = new URLRequest(uploadUrl);
				/*var uploadUrlVar:URLVariables = new URLVariables();
				uploadUrlVar.PHPSESSID = root.loaderInfo.parameters.sid;
				uploadUrlRequest.method = URLRequestMethod.POST;
    			uploadUrlRequest.data = uploadUrlVar;*/
				nextUpload.data.upload(uploadUrlRequest);
			}
			else {
				this.progressTextField.htmlText = "";
				this.percentProgressTextField.htmlText = "";
				this.fileListDataProvider.removeAll();
				this.checkFileList();
				this.disableComponents(false);
			}
		}
		
		private function checkFileList():void {
			if (this.fileListDataProvider.length > 0)
				this.uploadButton.enabled = true;
			else
				this.uploadButton.enabled = false;
		}
		
		private function updateOverallProgress():void {
			this.percentProgressTextField.htmlText = Math.round(this.currentUploadedBytes / this.totalBytesToUpload * 100).toString()+"%";
		}
		
		private function disableComponents(disable:Boolean):void {
			if (disable) {
				this.addFilesButton.enabled = false;
				this.removeFileButton.enabled = false;
				this.uploadButton.enabled = false;
				this.filesGrid.enabled = false;
			}
			else {
				this.addFilesButton.enabled = true;
				this.removeFileButton.enabled = true;
				this.uploadButton.enabled = true;
				this.filesGrid.enabled = true;
			}
		}
	}
}
