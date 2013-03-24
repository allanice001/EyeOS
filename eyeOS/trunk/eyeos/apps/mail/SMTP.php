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

class MailSMTP implements ISenderProtocol {

	function sendMail(MailObject $mailObject, AccountTO $accountTO) {
		$mailTO = $mailObject->getMailTO();

		$to = $mailTO->getToName();
		$cc = $mailTO->getCc();
		$cco = $mailTO->getBcc();
		$sbj = $mailTO->getSubject();
		$bodyHtml = $mailTO->getBodyHtml();
		$bodyText = $mailTO->getBodyText();
		$from = $accountTO->getMail();
		$fromName = $accountTO->getNameOfUser();
		$host = $accountTO->getSenderServer();
		$port = $accountTO->getSenderPort();
		$ssl = true;//$accountTO->getSenderSecure();
		$user = $accountTO->getSenderUserName();
		$password = $accountTO->getSenderPassword();


		//HARDCODED !!!!!!!!!!
		$port = 587;

		require_once('phpmailer/class.phpmailer.php');
//include("class.smtp.php"); // optional, gets called from within class.phpmailer.php if not already loaded

		$mail             = new PHPMailer();
		$mail->CharSet = 'utf-8';

//$body             = eregi_replace("[\]",'',$body);

		$mail->IsSMTP(); // telling the class to use SMTP
//$mail->Host       = "mail.yourdomain.com"; // SMTP server
		$mail->SMTPDebug  = 0;                     // enables SMTP debug information (for testing)
		// 1 = errors and messages
		// 2 = messages only
		$mail->SMTPAuth   = true;                  // enable SMTP authentication

		if (strpos($host, 'gmail') !== false) {
			$mail->SMTPSecure = "tls";                 // sets the prefix to the servier
		}
		$mail->Host       = $host;      // sets GMAIL as the SMTP server
		$mail->Port       = $port;                   // set the SMTP port for the GMAIL server
		$mail->Username   = $user;  // GMAIL username
		$mail->Password   = $password;            // GMAIL password

		$mail->SetFrom($from, $fromName);

		$mail->AddReplyTo($from, $fromName);

		$mail->Subject    = $sbj;

		$mail->AltBody    = $bodyText; // optional, comment out and test
		$body             = $bodyHtml;
		$mail->MsgHTML($body);

		$to = explode(',',$to);
		foreach($to as $value) {
			$mail->AddAddress($value);
		}

		if($cc) {
			$cc = explode(',',$cc);
			foreach($cc as $value) {
				$mail->AddCC($value);
			}
		}

		if($cco) {
			$cco = explode(',',$cco);
			foreach($cco as $value) {
				$mail->AddBCC($value);
			}
		}

		$mail->Timeout = 20;

//		if(count($mail->getAttachments()) > 0) {
//			foreach($mail->getAttachments() as $currentAttachment) {
//				$mailToSend->AddAttachment($currentAttachment->getPath());
//			}
//		}
		$send = $mail->Send();
//		if(!$send) {
//			echo "Mailer Error: " . $mail->ErrorInfo;
//		} else {
//			echo "Message sent!";
//		}
		
		return $send;
	}
}
?>