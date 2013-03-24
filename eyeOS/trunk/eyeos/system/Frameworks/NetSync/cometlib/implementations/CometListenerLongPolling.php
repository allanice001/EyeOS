<?php

class CometListenerLongPolling implements ICometListener {
    private $lastId = 0;
    public function  __construct() {
        if(!isset($_SESSION['comet']) || !isset($_SESSION['comet']['lastid'])) {
            $_SESSION['comet']['lastid'] = 0;
        }
        $this->lastId = $_SESSION['comet']['lastid'];
    }
        
    public function listen($manager) {
        $username = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
        $subscriptionProvider = new SqlSubscriptionProvider();

		//$myPressence = new Pressence();
		//$myPressence->markOnline($username, $manager);
		session_write_close();
		set_time_limit(0);
		ignore_user_abort(1);
        header('Cache-Control: no-cache, must-revalidate');
        header('Content-type: application/json');
        $Logger = Logger::getLogger('system.Frameworks.EyeosModules.NetSync');

		while(1) {
            echo "\n";
            ob_flush();
            flush();

            if (connection_status() != CONNECTION_NORMAL) {
                exit;
            }
			$mySubscriptionProvider = new SqlSubscriptionProvider();
			$channels = $mySubscriptionProvider->getSubscriptions($username);
			$messageProvider = new CometSqlMessageProvider();
			if(is_array($channels)) {
			    $messages = $messageProvider->read($channels, $username, $this->lastId);
			    if(is_array($messages) && count($messages) > 0) {
				@session_start();
				usort($messages, "customMessageComparation");
				$_SESSION['comet']['lastid'] = $messages[count($messages)-1]['id'];
                //$Logger->debug("last message id: " . $_SESSION['comet']['lastid']);

                //@todo use pseudo-random-related-to-tableid or something as transaction ID, no a id of table
				return $messages;
			    }
			}
			sleep(1);
		}
    }
}

function customMessageComparation($a, $b) {
    if ($a['id'] == $b['id']) {
        return 0;
    }
    return ($a['id'] < $b['id']) ? -1 : 1;
}

?>