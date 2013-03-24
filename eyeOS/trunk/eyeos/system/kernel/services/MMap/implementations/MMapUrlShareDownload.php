<?php
/*
*                 eyeos - The Open Source Cloud's Web Desktop
*                               Version 2.0
*                   Copyright (C) 2007 - 2010 eyeos Team 
* 
* This program is free software; you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License version 3 as published by the
* Free Software Foundation.
* 
* This program is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
* details.
* 
* You should have received a copy of the GNU Affero General Public License
* version 3 along with this program in the file "LICENSE".  If not, see 
* <http://www.gnu.org/licenses/agpl-3.0.txt>.
* 
* See www.eyeos.org for more details. All requests should be sent to licensing@eyeos.org
* 
* The interactive user interfaces in modified source and object code versions
* of this program must display Appropriate Legal Notices, as required under
* Section 5 of the GNU Affero General Public License version 3.
* 
* In accordance with Section 7(b) of the GNU Affero General Public License version 3,
* these Appropriate Legal Notices must retain the display of the "Powered by
* eyeos" logo and retain the original copyright notice. If the display of the 
* logo is not reasonably feasible for technical reasons, the Appropriate Legal Notices
* must display the words "Powered by eyeos" and retain the original copyright notice. 
*/

/**
 * 
 * @package kernel-services
 * @subpackage MMap
 */
class MMapUrlShareDownload extends Kernel implements IMMap {
	private static $Logger = null;
	
	public static function getInstance() {
		self::$Logger = Logger::getLogger('system.services.MMap.MMapUrlShareDownload');
		return parent::getInstance(__CLASS__);
	}
	 
	public function checkRequest(MMapRequest $request) {
		if ($request->issetGET('download')) {
			return true;
		}
		
		return false;
	}
	
	public function processRequest(MMapRequest $request, MMapResponse $response) {
		$urlName = $request->getGET('download');
		$urlShare = new UrlShare();
		$urlShare->setName($urlName);
		$urlShareController = UrlShareController::getInstance();
		$urlShare = current($urlShareController->searchUrl($urlShare));
		
		if($urlShare){
		    if($urlShare->getEnabled()){
			if($urlShare->getExpirationDate() < time()){
				self::renderErrorMessage($response, 'Url Expired');
				return;
			}
			$file = new UrlFile();
			$file->setId($urlShare->getFileId());
			$urlShareController->readFile($file);

			if($file){
				$fileName = basename($file->getPath());
				$currentFile = FSI::getFile($file->getPath());
				$size = $currentFile->getSize();
				$unim = array('B', 'KB', 'MB', 'GB', 'TB', 'PB');
				$c = 0;
				while ($size>= 1024) {
					$c++;
					$size = $size / 1024;
				}
				$size = number_format($size, ($c ? 2 : 0), ',', '.') . ' ' . $unim[$c];
				if($request->issetGET('wrongPassword')){
					$wrongPassword=$request->getGET('wrongPassword');
				}
				else {
					$wrongPassword=0;
				}

				Kernel::exitSystemMode();
				self::renderFoundFile($fileName,$size,$urlName,$response,$urlShare->getPassword(),$wrongPassword);
			}
			else {
				self::renderErrorMessage($response,'File not available');
			}

		    }
		    else{
			self::renderErrorMessage($response,'File not available');
		    }


		}
		else {
			self::renderErrorMessage($response,"File not available");
		}
	}

	private function renderFoundFile($fileName,$fileSize,$urlName,$response,$hasPassword,$wrongPassword){
		$response->getHeaders()->append('Content-type: text/html');
		$htmlString = '<body style="margin:0px; font-size: 24px; font-family: Arial, Helvetica, sans-serif;">
						<form id="form1" name="form1" method="post" action="index.php?downloadFile='.$urlName.'">

						 <table width="712" style="margin-right: 30px;margin-left: 30px;padding-top:15px;padding-bottom:15px;width:50%;">
							<tr>
							  <td width="50%" height="26" valign="middle">
										<div style="color:gray;font-size:14px;vertical-align:middle;float:left">Filename:&nbsp;</div>
										<div style="color:black;font-size:14px;vertical-align:middle;float:left">'.$fileName.'</div>

							  </td>
							  <td width="50%" valign="middle">';
										if($hasPassword){
											$htmlString.='<div style="color:gray;font-size:14px;vertical-align:middle;float:left">Insert URL password:&nbsp;</div>
														  <div style="color:black;font-size:14px;vertical-align:middle;float:left"><input type="password"  id="password" name="password" size="15"></div>';
										}
										
							  $htmlString.='</td>
							</tr>
							<tr>
							  <td width="50%" height="26">
										  <div style="color:gray;font-size:14px;vertical-align:middle;float:left">Filesize:&nbsp;</div>
										  <div style="color:black;font-size:14px;vertical-align:middle;float:left">'.$fileSize.'</div>
							  </td>
							  <td width="50%">';
							  if($wrongPassword){
								$htmlString.='<div style="color:red;font-size:14px;">Password is incorrect&nbsp;</div>';
							  }
							  $htmlString.='
							  </td>
							</tr>';
						  $htmlString.='
						  </table>




						<div style="margin-left: 30px;margin-top:10px;width:50%">
							 <input type="submit" name="button" id="button" value="Download" style="float:right"/>
						</div>

						</form>

					</form>
					<p>&nbsp;</p>
					</body>';
		$response->appendToBody($htmlString);
	}

	private function renderErrorMessage($response,$message){
		$response->getHeaders()->append('Content-type: text/html');
		$htmlString = '<body style="margin:0px; font-size: 24px; font-family: Arial, Helvetica, sans-serif;">
							<div style="margin-right: 30px;margin-left: 30px;border-top-width: 1px; border-top-style: solid ; border-top-color:gray;border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: gray;padding-top:20px;padding-bottom:20px;width:50%;color:gray;font-size:16px">
								'.$message.'
							</div>
						</body>';
		$response->appendToBody($htmlString);
	}
}
?>