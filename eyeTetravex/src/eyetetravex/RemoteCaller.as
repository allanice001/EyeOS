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
	import flash.net.URLLoader;
	import flash.net.URLLoaderDataFormat;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	import flash.net.URLVariables;
	
	import flash.events.Event;
	import flash.events.ProgressEvent;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.SecurityErrorEvent;
	
	public class RemoteCaller extends URLLoader {
		
		public static var allowRemoteCalls:Boolean = true;
		
		private var callbackObject:Object;
		private var callbackFunction:Function;
		
		
		public function RemoteCaller() {
			this.addEventListener(Event.COMPLETE, this.onComplete);
			this.addEventListener(IOErrorEvent.IO_ERROR, this.onError);
			this.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.onError);
			this.dataFormat = URLLoaderDataFormat.TEXT;
		}
		
		public function sendCall(signalName:String, callbackObject:Object = null,
								 callbackFunction:Function = null, params:XML = null):void {
			if (RemoteCaller.allowRemoteCalls) {
				EyeTetravex.notifyActivity(true);
				this.callbackObject = callbackObject;
				this.callbackFunction = callbackFunction;
				
				var urlRequest:URLRequest = new URLRequest(EyeTetravex.scriptUrl
														 +"?checknum="+EyeTetravex.checknum
														 +"&msg="+signalName);
				if (params != null) {
					var urlVariables:URLVariables = new URLVariables("eyeTetravex_xmlData="+params.toXMLString());
					urlRequest.data = urlVariables;
					urlRequest.method = URLRequestMethod.POST;
				}
				EyeTetravex.logConsole("RemoteCaller.sendCall(): Loading "+urlRequest.url);
				EyeTetravex.logConsole("RemoteCaller.sendCall(): Parameters =\n"+this.data);
				this.load(urlRequest);
			}
		}
		
		private function onComplete(e:Event) {
			EyeTetravex.logConsole("RemoteCaller.onComplete(): Response =\n"+this.data.toString());
			EyeTetravex.notifyActivity(false);
			
			if (this.callbackFunction != null) {
				var response:XML = new XML(this.data);
				this.callbackFunction.call(this.callbackObject, response);
			}
		}
		
		private function onError(e:Event) {
			EyeTetravex.logConsole("RemoteCaller.onError(): "+e.toString());
			EyeTetravex.notifyActivity(false);
			
			//if config is not loaded yet, the error appears after the app launch
			//so we consider the config as loaded (set to default internal values) and raise
			//the onConfigLoaded "event" to start a new game
			if (! EyeTetravex.isConfigLoaded) {
				EyeTetravex.getInstance().onConfigLoaded();
			}
			
			EyeTetravex.getInstance().disableComponents();
			EyeTetravex.showQuestion(I18n.getString("dialog_netprob_title"),
									"<p>"+I18n.getString("dialog_netprob_text1")+"</p>"
									+"<p></p><p>"+I18n.getString("dialog_netprob_text2")+"</p>",
									this,
									this.disableRemoteCallsQuestion_onYes,
									this.disableRemoteCallsQuestion_onNo);
		}
		
		private function disableRemoteCallsQuestion_onYes():void {
			RemoteCaller.disableRemoteCalls();			
			EyeTetravex.getInstance().enableComponents();
		}
		
		private function disableRemoteCallsQuestion_onNo():void {
			EyeTetravex.getInstance().enableComponents();
		}
				
		public static function enableRemoteCalls(): void {
			RemoteCaller.allowRemoteCalls = true;
		}
		
		public static function disableRemoteCalls(): void {
			RemoteCaller.allowRemoteCalls = false;
		}
	}
}