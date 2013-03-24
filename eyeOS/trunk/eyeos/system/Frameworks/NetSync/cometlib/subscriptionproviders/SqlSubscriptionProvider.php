<?php
global $netsync_db;

$netsync_db = mysql_connect(SQL_HOST, SQL_USERNAME, SQL_PASSWORD);
mysql_select_db(SQL_NETSYNC_DBNAME, $netsync_db);

class SqlSubscriptionProvider implements ISubscriptionProvider {
	private $db;

	public function  __construct() {
	    global $netsync_db;
	    $this->db = $netsync_db;
	}
    
    public function getHooks() {
        $sql = "SELECT * FROM `netsyncHooks` WHERE 1";
        $result = mysql_query($sql, $this->db);
        $hooks = Array();
        if (mysql_num_rows($result) == 0) {
            return $hooks;
        }
        while ($row = mysql_fetch_assoc($result)) {
            array_push($hooks, $row);
        }
        mysql_free_result($result);
        return $hooks;
    }

		/**
        * Get All Channels
        * @access       public
        * @param        Optional String for the like query
        * @return       Array()
        * @todo         Best error handling in mysql_query
        */
	public function getAllChannels($pattern = null) {
		$sql = "SELECT DISTINCT `channel` FROM `subscriptions`";
		if ($pattern) {
			$sql .= "WHERE `channel` LIKE '%".mysql_real_escape_string($pattern)."%'";
		}
		$result = mysql_query($sql, $this->db);
	    $channels = array();
		if (mysql_num_rows($result) == 0) {
			return $channels;
	    }
	    while ($row = mysql_fetch_assoc($result)) {
			//$channels[] = new BasicChannel($row['channel']);
			$channels[] = $row['channel'];
	    }
	    return $channels;
	}
        
        /**
        * Remove all subscriptions from user
        * @access       public
        * @param        string
        * @return       void
        * @todo         Best error handling in mysql_query
        */
	public function removeAllSubscriptions($from) {
	    $sql = "DELETE FROM `subscriptions` WHERE `who` = '".mysql_real_escape_string($from)."'";
	    mysql_query($sql, $this->db);
	}

        /**
        * get subscriptions from user
        * @access       public
        * @param        string
        * @return       Boolean/Array()
        * @todo         return Array or void Array, never two types
        */
	public function getSubscriptions($from) {
	    $sql = "SELECT * FROM `subscriptions` WHERE `who` = '".mysql_real_escape_string($from)."'";
	    $result = mysql_query($sql, $this->db);
	    if (mysql_num_rows($result) == 0) {
			return false;
	    }
	    $channels = array();
	    while ($row = mysql_fetch_assoc($result)) {
			$channels[] = new BasicChannel($row['channel']);
	    }
	    return $channels;
	}

        /**
        * get subscribers from channel
        * @access       public
        * @param        string
        * @return       Boolean/Array()
        * @todo         return Array or void Array, never two types
        */
	public function getSubscribers($channel) {
	    $sql = "SELECT * FROM `subscriptions` WHERE `channel` = '".mysql_real_escape_string($channel)."'";
	    $result = mysql_query($sql, $this->db);
	    if (mysql_num_rows($result) == 0) {
			return false;
	    }
	    $channels = array();
	    while ($row = mysql_fetch_assoc($result)) {
			$channels[] = new BasicChannel($row['channel']);
	    }
	    return $channels;
	}

        /**
        * unsuscribe user from channel
        * @access       public
        * @param        string
        * @param        IChannel
        * @return       void
        */
	public function unsubscribe($from, $channel) {
        $Logger = Logger::getLogger('system.Framework.NetSync.unsubscribe');
	    $sql = "DELETE FROM `subscriptions` WHERE `channel` = '".mysql_real_escape_string($channel)."' AND `who` = '".mysql_real_escape_string($from)."'";
	    return mysql_query($sql, $this->db);
	}

        /**
        * subscribe user to channel
        * @access       public
        * @param        string
        * @param        IChannel
        * @return       void
        * @todo         return true or false
        */
	public function subscribe($from, $channel) {
            $Logger = Logger::getLogger('system.Framework.NetSync.subscribe');
            $sql = "INSERT INTO `subscriptions` (`who` , `channel`, `since`) VALUES ('".mysql_real_escape_string($from)."', '".mysql_real_escape_string($channel)."','".time()."')";
            mysql_query($sql, $this->db);
	}
    
    public function registerCallback($userFunction, $filename) {
            $dao = StorageManager::getInstance()->getHandler('SQL/EyeosDAO');
            $dbh = $dao->getConnection();
            
            $Logger = Logger::getLogger('system.Frameworks.EyeosModules.NetSync');
            $Logger->debug('SQLSubscriptionProvider registerCallback called with ' . $userFunction . " in filename: " . $filename);
            $sql = "INSERT INTO `netsyncHooks` (`callback` , `file`) VALUES (?, ?)";
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam(1, $userFunction, PDO::PARAM_STR);
            $stmt->bindParam(2, $filename, PDO::PARAM_STR);
            try {
                $stmt->execute();
            }
            catch(Exception $e) {
            }
    }
}

?>
