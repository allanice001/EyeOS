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

class SQLLabelProvider implements ILabelProvider {

	private $dao;

	public function __construct() {
		$this->dao = StorageManager::getInstance()->getHandler('SQL/EyeosDAO',array('prefix' => 'mail'));
		$this->dao->send('SET NAMES utf8');
	}

// --------- TAGS ------------------------------------------------

	function retrieveAllTags(LocalTag $tag) {
		try {
			$transferObject = new LocalTag();
			$userId = $tag->getUserId();

        	$query = 'SELECT * FROM mail_localtag WHERE userid = ?';
            $dbh = $this->dao->getConnection();
            $stmt = $dbh->prepare($query);
			$stmt->bindParam(1, $userId , PDO::PARAM_STR);

            if (!$stmt->execute()) {
				$errorInfo = $stmt->errorInfo();
				throw new EyeMailException($e->getMessage());
            }

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$toReturn = array();
            foreach ($result as $entry) {
                   $objectClass = get_class($transferObject);
            	   $row = new $objectClass;
				   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
					foreach ($entry as $key => $value) {
                 		$methodName = 'set' . ucfirst($key);
                        $row->$methodName($value);
                    }

                    $toReturn[] = $row;
            }

            return $toReturn;

		} catch (Exception $e) {
			throw new EyeException('Unable to retrieve Local Tags ', 0, $e);
		}
	}

	function deleteTag(LocalTag $tag) {
		try {
			$this->dao->delete($tag);
		} catch (Exception $e) {
			throw new EyeException('Unable to delete tag ' . $tag->getName(), 0, $e);
		}
	}

	function storeTag(LocalTag $tag) {
		try {
			$this->dao->create($tag);
		} catch (Exception $e) {
			throw new EyeException('Unable to store Tag ' . $tag->getName(), 0, $e);
		}
	}

	function updateTag(LocalTag $tag) {
		try {
			$this->dao->update($tag);
		} catch (Exception $e) {
			throw new EyeException('Unable to update tag ' . $tag->getName(), 0, $e);
		}
	}

	public function getTagMaxId(){
		try {
			$maxId = 0;
			$tag = new LocalTag();
			$arrayTags = $this->dao->readAll($tag);

			foreach($arrayTags as $currentArray) {
				if (intval($currentArray->getId()) > $maxId) {
					$maxId = intval($currentArray->getId());
				}
			}

			return intval($maxId);
		} catch (Exception $e) {
			throw new EyeException('Unable to get Tag Max Id', 0, $e);
		}
	}

// --------- FOLDERS ------------------------------------------------

	function retrieveAllFolders(Folder $folder) {
		try {
			$transferObject = new Folder();
			$userId = $folder->getUserId();
			$accountId = $folder->getAccount();

        	$query = 'SELECT * FROM mail_folder WHERE userid = ? AND account = ?';
            $dbh = $this->dao->getConnection();
            $stmt = $dbh->prepare($query);
			$stmt->bindParam(1, $userId, PDO::PARAM_STR);
			$stmt->bindParam(2, $accountId, PDO::PARAM_STR);

            if (!$stmt->execute()) {
				$errorInfo = $stmt->errorInfo();
				throw new EyeException($e->getMessage());
            }

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $toReturn = array();

            foreach ($result as $entry) {
                   $objectClass = get_class($transferObject);
            	   $row = new $objectClass;
				   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
					foreach ($entry as $key => $value) {
                 		$methodName = 'set' . ucfirst($key);
                        $row->$methodName($value);
                    }

                    $toReturn[] = $row;
            }

            return $toReturn;

			return $this->dao->read($folder);
		} catch (Exception $e) {
			throw new EyeException('Unable to retrieve all folders ', 0, $e);
		}
	}

	function retrieveFolderById($folderId) {
		try {
			$transferObject = new Folder();

        	$query = 'SELECT * FROM mail_folder WHERE id = ? LIMIT 1';
            $dbh = $this->dao->getConnection();
            $stmt = $dbh->prepare($query);
			$stmt->bindParam(1, $folderId, PDO::PARAM_STR);


            if (!$stmt->execute()) {
				$errorInfo = $stmt->errorInfo();
				throw new EyeMailException($e->getMessage());
            }

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$toReturn = null;
            foreach ($result as $entry) {
                   $objectClass = get_class($transferObject);
            	   $row = new $objectClass;
				   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
					foreach ($entry as $key => $value) {
                 		$methodName = 'set' . ucfirst($key);
                        $row->$methodName($value);
                    }

                    $toReturn = $row;
            }
            return $toReturn;

		} catch (Exception $e) {
			throw new EyeException('Unable to retrieve folder ', 0, $e);
		}
	}

	function retrieveFolderByName($name, $accountId) {
		try {
			$transferObject = new Folder();

        	$query = 'SELECT * FROM mail_folder WHERE account = ? AND name = ? LIMIT 1';
            $dbh = $this->dao->getConnection();
            $stmt = $dbh->prepare($query);
			$stmt->bindParam(1, $accountId, PDO::PARAM_STR);
			$stmt->bindParam(2, $name, PDO::PARAM_STR);

            if (!$stmt->execute()) {
				$errorInfo = $stmt->errorInfo();
				throw new EyeException($e->getMessage());
            }

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$toReturn = null;
            foreach ($result as $entry) {
                   $objectClass = get_class($transferObject);
            	   $row = new $objectClass;
				   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
					foreach ($entry as $key => $value) {
                 		$methodName = 'set' . ucfirst($key);
                        $row->$methodName($value);
                    }

                    $toReturn = $row;
            }

            return $toReturn;

		} catch (Exception $e) {
			throw new EyeException('Unable to retrieve folder ', 0, $e);
		}
	}

	function retrieveFoldersByName($name, $user) {
		try {
			$transferObject = new Folder();

        	$query = 'SELECT * FROM mail_folder WHERE name = ? AND userid = ?';
            $dbh = $this->dao->getConnection();
            $stmt = $dbh->prepare($query);
			$stmt->bindParam(1, $name, PDO::PARAM_STR);
			$stmt->bindParam(2, $user, PDO::PARAM_STR);

            if (!$stmt->execute()) {
				$errorInfo = $stmt->errorInfo();
				throw new EyeException($e->getMessage());
            }

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$toReturn = null;
            foreach ($result as $entry) {
                   $objectClass = get_class($transferObject);
            	   $row = new $objectClass;
				   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
					foreach ($entry as $key => $value) {
                 		$methodName = 'set' . ucfirst($key);
                        $row->$methodName($value);
                    }

                    $toReturn[] = $row;
            }

            return $toReturn;

		} catch (Exception $e) {
			throw new EyeException('Unable to retrieve folder ', 0, $e);
		}
	}


	function deleteFolder(Folder $folder) {
		try {
			$this->dao->delete($folder);
		} catch (Exception $e) {
			throw new EyeException('Unable to delete folder ' . $folder->getName(), 0, $e);
		}
	}

	function storeFolder(Folder $folder) {
		try {
			$this->dao->create($folder);
		} catch (Exception $e) {
			throw new EyeException('Unable to store Folder ' . $folder->getName(), 0, $e);
		}
	}

	function updateFolder(Folder $folder) {
		try {
			$this->dao->update($folder);
		} catch (Exception $e) {
			throw new EyeException('Unable to update folder ' . $folder->getName(), 0, $e);
		}
	}

	function deleteAllFolders($accountId) {
		$query = 'DELETE FROM mail_folder WHERE account ?';
		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $accountId, PDO::PARAM_STR);

		if (!$stmt->execute()) {
			$errorInfo = $stmt->errorInfo();
			throw new EyeException($e->getMessage());
		}
	}

	function retrieveUser($userId) {
		try {
			$transferObject = new Folder();

        	$query = 'SELECT * FROM mail_folder WHERE userid = ? LIMIT 1';
            $dbh = $this->dao->getConnection();
            $stmt = $dbh->prepare($query);
			$stmt->bindParam(1, $userId, PDO::PARAM_STR);

            if (!$stmt->execute()) {
				$errorInfo = $stmt->errorInfo();
				throw new EyeException($e->getMessage());
            }

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$toReturn = null;
            foreach ($result as $entry) {
                   $objectClass = get_class($transferObject);
            	   $row = new $objectClass;
				   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
					foreach ($entry as $key => $value) {
                 		$methodName = 'set' . ucfirst($key);
                        $row->$methodName($value);
                    }

                    $toReturn = $row;
            }

            return $toReturn;

		} catch (Exception $e) {
			throw new EyeException('Unable to retrieve folder ', 0, $e);
		}
	}

	function retrieveLocalTagById($localTagId) {
		try {
			$transferObject = new LocalTag();

        	$query = 'SELECT * FROM mail_localtag WHERE id = ? LIMIT 1';
            $dbh = $this->dao->getConnection();
            $stmt = $dbh->prepare($query);
			$stmt->bindParam(1, $localTagId, PDO::PARAM_STR);

            if (!$stmt->execute()) {
				$errorInfo = $stmt->errorInfo();
				throw new EyeMailException($e->getMessage());
            }

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$toReturn = null;
            foreach ($result as $entry) {
                   $objectClass = get_class($transferObject);
            	   $row = new $objectClass;
				   //$row = $transferObject->factory();		// TODO: maybe new $objectClass crash on some PHP versions
					foreach ($entry as $key => $value) {
                 		$methodName = 'set' . ucfirst($key);
                        $row->$methodName($value);
                    }

                    $toReturn = $row;
            }

            return $toReturn;

		} catch (Exception $e) {
			throw new EyeException('Unable to retrieve Local Tag ', 0, $e);
		}
	}


	public function getFolderMaxId(){
		try {
			$maxId = 0;
			$folder = new Folder();
			$arrayFolders = $this->dao->readAll($folder);

			foreach($arrayFolders as $currentArray) {
				if (intval($currentArray->getId()) > $maxId) {
					$maxId = intval($currentArray->getId());
				}
			}

			return intval($maxId);
		} catch (Exception $e) {
			throw new EyeException('Unable to get Folder Max Id', 0, $e);
		}
	}

}
?>