<?php
class MetaDataConverter extends Kernel implements IMetaDataConverter {

	private static $Instance = null;

	private $Logger = null;
	private $Handlers = null;
	
	public static function getInstance() {
		if (self::$Instance === null) {
			self::$Instance = new MetaDataConverter();
		}
		return self::$Instance;
	}

	public function __construct() {
		// Initialize self::$Logger for next steps
		$this->Logger = Logger::getLogger('Meta.MetaDataConverter');
		// walk over /MetaDataConverter/Handlers searching handlers
		$this->listHandlers();
		$this->Logger->debug("MetaData converter up and ready to serve");
		// this service is lazy loaded
	}

	public function convertThis($fromObject, $toObject) {
		// load all handlers and ask him his capabilities
		foreach($this->Handlers as $key => $file) {
			$handler = $this->loadHandler($file);
			// this handler is break! ignore them
			if ( !$handler ) {
				continue;
			}
			$canConvert = $handler->canConvertThis($fromObject, $toObject);
			if ( true == $canConvert ) {
				// yeah, this handler is capable to work with those types. Make the conversion
				$this->Logger->debug("handler " . $file . " says they can convert this metadata from: " .
						get_class($fromObject) . " => " . get_class($toObject));
				$metadata = $handler->convertMetaData($fromObject, $toObject);
				//$this->Logger->debug($metadata);
				return $metadata;
			}
		}
		// any handler is capable to convert this? please send crash!
		throw new EyeMetaDataException('Unable to convert from $objectFrom to $objectTo.', 0, NULL);
	}

	public function loadHandler($handlerToLoad) {
		$this->Logger->debug("Loading handler '".$handlerToLoad."'...");
		require_once SERVICE_META_CONVERTER_HANDLERS_PATH . '/' . $handlerToLoad . ".php";
		if ( class_exists($handlerToLoad) && method_exists($handlerToLoad, "getInstance" ) ) {
			return $handlerToLoad::getInstance();
		}
		else {
			$this->Logger->error("MetaDataHandler named \"".$handlerToLoad."\" is broken!" );
			return false;
		}
	}

	public function listHandlers() {
		// walk directory searching handlers
		$dir = new DirectoryIterator(SERVICE_META_CONVERTER_HANDLERS_PATH);
		$this->Handlers = array();
		foreach($dir as $file) {
			if ($file->isFile()) {
				// ignore failover handler
				if ( SERVICE_META_CONVERTER_FAILOVER_HANDLER !=  basename($file->getFilename(),".php") ) {
					// .php substracted for future call to class contained in file
					$this->Handlers[] = basename($file->getFilename(),".php");
					$this->Logger->debug("Added handler \"".$file->getFilename()."\"" );
				}
			}
		}
		// add failover handler
		if ( is_readable(SERVICE_META_CONVERTER_HANDLERS_PATH."/".SERVICE_META_CONVERTER_FAILOVER_HANDLER.".php") ) {
			$this->Handlers[] = SERVICE_META_CONVERTER_FAILOVER_HANDLER;
			$this->Logger->debug("Added failover handler \"".SERVICE_META_CONVERTER_FAILOVER_HANDLER.".php\"" );
		} else {
			$this->Logger->warn("Unable to locate failover handler! (".SERVICE_META_CONVERTER_HANDLERS_PATH."/".SERVICE_META_CONVERTER_FAILOVER_HANDLER.".php) ");
		}
	}
}
?>
