<?php
/*
"epkg" filetype library
Copyright (C) 2009 Lars Knickrehm

Note: Folder paths need to end with "/" (or "\")!
*/

class epkg {
	public $decodeCompress = true;
	public $decodeDest = null;
	public $decodeExcept = null;
	public $decodeSource = null;
	
	public $encodeCompress = true;
	public $encodeDest = null;
	public $encodeExcept = null;
	public $encodeSource = null;
	
	private $content = null;
	private $error = null;
	private $escapeChar = "\v";
	private $fileSep = "\n";
	private $nameSep = "\r";
	
	public function decode($params = null) { // TODO: decodeExcept
		isset($params['decodeCompress']) ? $compress = $params['decodeCompress'] : $compress = $this->decodeCompress;
		isset($params['decodeDest']) ? $destination = $params['decodeDest'] : $destination = $this->decodeDest;
		isset($params['decodeExcept']) ? $exceptions = $params['decodeExcept'] : $exceptions = $this->decodeExcept;
		isset($params['decodeSource']) ? $source = $params['decodeSource'] : $source = $this->decodeSource;
		if ($compress && !function_exists('gzuncompress')) {
			$this->error = 'decodeCompress';
			return false;
		} else if (is_null($destination)) {
			$this->error = 'decodeDest';
			return false;
		} else if (is_null($source)) {
			$this->error = 'decodeSource';
			return false;
		}
		if (isset($params['decodeSource']) || is_null($this->content)) {
			$this->content = file_get_contents($source);
			if ($compress) {
				$this->content = gzuncompress($this->content);
			}
		}
		$location = array();
		foreach (explode($this->fileSep, $this->content) as $file) {
			if (strpos($file, $this->nameSep) === false) {
				$path2 = $file;
			} else {
				$path2 = substr($file, 0, strpos($file, $this->nameSep));
			}
			$path = ltrim($path2, "\t");
			$position = strlen($path2) - strlen($path);
			$path = $destination . implode('/', array_slice($location, 0, $position)) . '/' . basename($path);
			if (strpos($file, $this->nameSep) === false) {
				@mkdir($path); // TODO: onError?
				$location = array_slice($location, 0, $position);
				$location[] = basename($path);
			} else {
				file_put_contents($path, str_replace($this->escapeChar . 'e', $this->escapeChar, str_replace($this->escapeChar . 'f', $this->fileSep, substr($file, strpos($file, $this->nameSep) + 1))));
			}
		}
		return true;
	}
	
	public function encode($params = null) {
		isset($params['encodeCompress']) ? $compress = $params['encodeCompress'] : $compress = $this->encodeCompress;
		isset($params['encodeDest']) ? $destination = $params['encodeDest'] : $destination = $this->encodeDest;
		isset($params['encodeExcept']) ? $exceptions = $params['encodeExcept'] : $exceptions = $this->encodeExcept;
		isset($params['encodeSource']) ? $source = $params['encodeSource'] : $source = $this->encodeSource;
		if ($compress && !function_exists('gzcompress')) {
			$this->error = 'encodeCompress';
			return false;
		} else if (is_null($destination)) {
			$this->error = 'encodeDest';
			return false;
		} else if (is_null($source)) {
			$this->error = 'encodeSource';
			return false;
		}
		$this->encodeContent($params);
		if (substr($destination, -1) == '/' || substr($destination, -1) == '\\') {
			if (is_array($source)) {
				$destination .= basename($source[0]) . '.ey';
			} else {
				$destination .= basename($source) . '.ey';
			}
		}
		if (!$compress) {
			return file_put_contents($destination, $this->content) !== false;
		}
		return file_put_contents($destination, gzcompress($this->content, 9)) !== false;
	}
	
	public function encodeContent($params = null) {
		isset($params['encodeExcept']) ? $exceptions = $params['encodeExcept'] : $exceptions = $this->encodeExcept;
		isset($params['encodeSource']) ? $source = $params['encodeSource'] : $source = $this->encodeSource;
		if (is_null($source)) {
			$this->error = 'encodeSource';
			return false;
		}
		if (is_array($source)) {
			$this->content = '';
			foreach ($source as $part) {
				$this->content .= $this->encodeDo($part, $exceptions);
			}
		} else {
			$this->content = $this->encodeDo($source, $exceptions);
		}
		return true;
	}
	
	private function encodeDo($realpath, $exceptions, $path = 0) {
		if (substr($realpath, -1) == '/' || substr($realpath, -1) == '\\') {
			$content = '';
			$files = scandir($realpath);
			foreach ($files as $element) {
				if (!in_array($element,array('.','..')) && (!is_array($exceptions) || !in_array($realpath . $element, $exceptions))) {
					$content .= str_pad('', $path, "\t") . $element;
					if (is_dir($realpath . $element)) {
						$content .= $this->fileSep . $this->encodeDo($realpath . $element . '/', $exceptions, $path + 1);
					} else {
						$content .= $this->nameSep . str_replace($this->fileSep, $this->escapeChar . 'f', str_replace($this->escapeChar, $this->escapeChar . 'e', file_get_contents($realpath . $element))) . $this->fileSep;
					}
				}
			}
			return $content;
		}
		return str_pad('', $path, "\t") . basename($realpath) . $this->nameSep . str_replace($this->fileSep, $this->escapeChar . 'f', str_replace($this->escapeChar, $this->escapeChar . 'e', file_get_contents($realpath))) . $this->fileSep;
	}
	
	public function epkg($params = null) {
		if (isset($params['decodeCompress'])) {
			$this->decodeCompress = $params['decodeCompress'];
		}
		if (isset($params['decodeDest'])) {
			$this->decodeDest = $params['decodeDest'];
		}
		if (isset($params['decodeExcept'])) {
			$this->decodeExcept = $params['decodeExcept'];
		}
		if (isset($params['decodeSource'])) {
			$this->decodeSource = $params['decodeSource'];
		}
		if (isset($params['encodeCompress'])) {
			$this->encodeCompress = $params['encodeCompress'];
		}
		if (isset($params['encodeDest'])) {
			$this->encodeDest = $params['encodeDest'];
		}
		if (isset($params['encodeExcept'])) {
			$this->encodeExcept = $params['encodeExcept'];
		}
		if (isset($params['encodeSource'])) {
			$this->encodeSource = $params['encodeSource'];
		}
		return;
	}
	
	public function getContent() {
		return $this->content;
	}
	
	public function getError() {
		return $this->error;
	}
	
	public function listAll($params = null) { // TODO
		isset($params['decodeCompress']) ? $compress = $params['decodeCompress'] : $compress = $this->decodeCompress;
		isset($params['decodeExcept']) ? $exceptions = $params['decodeExcept'] : $exceptions = $this->decodeExcept;
		isset($params['decodeSource']) ? $source = $params['decodeSource'] : $source = $this->decodeSource;
		if ($compress && !function_exists('gzcompress')) {
			$this->error = 'decodeCompress';
			return false;
		} else if (is_null($source)) {
			$this->error = 'decodeSource';
			return false;
		}
		if (isset($params['decodeSource']) || is_null($this->content)) {
			$this->content = file_get_contents($source);
			if ($compress) {
				$this->content = gzuncompress($this->content);
			}
		}
		/*foreach (explode("\n", $this->content) as $line) {
			if ($line) {
				if (strpos($line, ':') === false) {
					$path = base64_decode($line);
					$list[] = $path;
				} else {
					$path = base64_decode(substr($line, 0, strpos($line, ':')));
					$list[] = $path;
				}
			}
		}
		return $list;*/
	}
}
?>