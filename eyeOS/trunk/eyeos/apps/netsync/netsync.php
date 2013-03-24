<?php

abstract class netsyncApplication extends EyeosApplicationExecutable {
    /*
     * ######################################################  PRIVATE INTERFACE
     */
    
    // nothing implemented
    
    /*
     * #######################################################  PUBLIC INTERFACE
     */

    /**
     * program entrypoint
     * 
     * @access public
     * @param AppExecutionContext $context
     * @param MMapResponse $response 
     */
    public static function __run(AppExecutionContext $context, MMapResponse $response) {
		$buffer = '';
		$basePath = EYE_ROOT . '/' . APPS_DIR . '/netsync/';
		$buffer .= file_get_contents($basePath . 'netsync.js');
		$response->appendToBody($buffer);
    }
    
}
?>
