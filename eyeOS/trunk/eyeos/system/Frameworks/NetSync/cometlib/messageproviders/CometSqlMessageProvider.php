<?php

class CometSqlMessageProvider implements ICometMessageProvider {
    private $db;

    public function  __construct() {
	global $netsync_db;
	$this->db = $netsync_db;
    }

    /**
    * write user message to channel
    * @access       public
    * @param        string
    * @param        IChannel
    * @param        string
    * @return       void
    * @todo         return must return true or false
    */
    public function write($from, IChannel $channel, $data) {
    $Logger = Logger::getLogger('system.Frameworks.EyeosModules.NetSync');

    $sql = "INSERT INTO `netsync_messages` (`id`, `from`, `to`, `data`, `timestamp`) VALUES (NULL, '".mysql_real_escape_string($from)."',";
	$sql .= "'".mysql_real_escape_string($channel->getName())."', '".mysql_real_escape_string($data)."', '".time()."');";

    //$Logger->debug($sql);

	mysql_query($sql, $this->db);
    }

    /**
    * read from channel
    * @access       public
    * @param        IChannel Array()
    * @param        string
    * @param        int
    * @return       false or Array()
    * @todo         return must return Array with data or void Array
    */
    public function read($channels, $from, $lastId = 0) {
        $Logger = Logger::getLogger('system.Frameworks.EyeosModules.NetSync');
        //$sql = 'SELECT `messages`.* FROM `messages` INNER JOIN subscriptions ON messages.timestamp >= subscriptions.since AND messages.to = subscriptions.channel AND subscriptions.who = \''.  mysql_real_escape_string($from).'\' WHERE `to` IN (';
        $sql = 'SELECT `netsync_messages`.* FROM `netsync_messages` INNER JOIN subscriptions ON netsync_messages.timestamp >= subscriptions.since AND netsync_messages.to = subscriptions.channel AND subscriptions.who = \''.  mysql_real_escape_string($from).'\' WHERE `to` IN (';
        foreach($channels as $channel) {
            $sql .= "'".mysql_real_escape_string($channel->getName()). "',";
        }
        $sql = substr($sql, 0, -1);
        $sql .= ')';
            //@todo this is a test!
        $sql .= ' AND netsync_messages.id > '.$lastId;
            //$sql .= ' AND messages.id > 0';

        //$Logger->debug($sql);
        $result = mysql_query($sql, $this->db);
        if (mysql_num_rows($result) == 0) {
            //$Logger->debug("No results");
            return false;
        }
        $return = array();
        while ($row = mysql_fetch_assoc($result)) {
            $return[] = $row;
        }
        return $return;
    }
    
    public function clearOldMessages() {
        $sql ="DELETE FROM `eyeos`.`netsync_messages` WHERE `netsync_messages`.`timestamp` < " . (time() - 300);
        mysql_query($sql, $this->db);
        //$Logger = Logger::getLogger('system.Frameworks.EyeosModules.NetSync');
        //$Logger->debug("Number of old messages deleted: " . mysql_affected_rows($this->db));
    }
}

?>