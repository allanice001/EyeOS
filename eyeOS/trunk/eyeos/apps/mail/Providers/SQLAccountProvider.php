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

class SQLAccountProvider implements IAccountProvider {

	private $dao;

	public function __construct() {
		$this->dao = StorageManager::getInstance()->getHandler('SQL/EyeosDAO', array('prefix' => 'mail'));
		$this->dao->send('SET NAMES utf8');
	}

	public function retrieveAccountsTO(AccountTO $accountTO) {
		$transferObject = new AccountTO();
		$userId = $accountTO->getUserId();

		$query = 'SELECT * FROM mail_accountto WHERE userid = ?';
		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $userId, PDO::PARAM_STR);

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
	}

	/**
	 *
	 * @param AccountTO
	 */
	public function storeAccountTO(AccountTO $accountTO) {
		try {
			$this->dao->create($accountTO);
		} catch (Exception $e) {
			throw new EyeMailException('Unable to store account ' . $accountTO->getDescription(), 0, $e);
		}
	}

	/**
	 *
	 * @param Account
	 */
	public function removeAccountTO(AccountTO $accountTO) {
		try {
			$this->dao->delete($accountTO);
		} catch (Exception $e) {
			throw new EyeMailException('Unable to delete account ' . $accountTO->getDescription(), 0, $e);
		}
	}

	/**
	 *
	 * @param Account
	 */
	public function updateAccountTO(AccountTO $accountTO) {
		try {
			$this->dao->update($accountTO);
		} catch (Exception $e) {
			throw new EyeMailException('Unable to update account ' . $accountTO->getDescription(), 0, $e);
		}
	}

	public function retrieveAccountTOById($id) {
		$transferObject = new AccountTO();

		$query = 'SELECT * FROM mail_accountto WHERE id = ? LIMIT 1';
		$dbh = $this->dao->getConnection();
		$stmt = $dbh->prepare($query);
		$stmt->bindParam(1, $id, PDO::PARAM_STR);

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
	}

	public function isSetAccounts($userId) {
		try {
			$transferObject = new AccountTO();

        	$query = 'SELECT * FROM mail_accountto WHERE userid = ?';
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

	public function getMaxId(){
		try {
			$maxId = 0;
			$accountTO = new AccountTO();
			$arrayAccounts = $this->dao->readAll($accountTO);

			foreach($arrayAccounts as $currentArray) {
				if (intval($currentArray->getId()) > $maxId) {
					$maxId = intval($currentArray->getId());
				}
			}

			return intval($maxId);
		} catch (Exception $e) {
			throw new EyeMailException('Unable to get Account Max Id', 0, $e);
		}
	}


}
?>
