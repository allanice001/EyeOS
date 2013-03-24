<?php

class SqlChannelProvider implements IPasswordChannelProvider {
    private $db;

    /**
    * Constructor of SqlChannelProvider
    * @access       public
    * @todo         best error handling
    * @todo         pass database link with paramether, don't use global
    */
    public function  __construct() {
	    global $netsync_db;
	    $this->db = $netsync_db;
    }

    /**
    * get channel descriptor
    * @access       public
    * @param        string
    * @return       BasicChannel instance 
    */
    public function getChannel($name) {
	//we don't need anything from the database in this basic implementation
	//so this is a factory of BasicChannels
	return new BasicChannel($name);
    }

    /**
    * get password from channel
    * @access       public
    * @param        IChannel
    * @return       false or string
    * @todo         Return string or void string '', never two different types.
    */
    public function getPassword(IChannel $channel) {
	$channelName = $channel->getName();

	$sql = "SELECT `password` FROM `channels` WHERE `channel` = '".mysql_real_escape_string($channelName)."'";
	$result = mysql_query($sql, $this->db);
	if(mysql_num_rows($result) > 0) {
	    $row = mysql_fetch_assoc($result);
	    return $row['password'];
	}
	return false;
    }
}

?>