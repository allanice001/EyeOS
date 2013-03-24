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

///**
// * 
// * @package kernel-services
// * @subpackage UM
// */
//class LDAPPrincipalsManager extends Kernel implements IPrincipalsManager {
//	
//	protected function __construct() {
//		
//	}
//
//	/**
//	 * Assigns a principal to a group.
//	 *
//	 * @param IPrincipal $principal
//	 * @param IGroup $group
//	 * @throws EyeUMException User not found or group not found.
//	 */
//	public function addToGroup(IPrincipal $principal, IGroup $group) {}
//	
//	/**
//	 * Creates a group.
//	 *
//	 * @param IGroup $group
//	 * @throws EyeUMException Group already exists.
//	 */
//	public function createGroup(IGroup $group) {}
//	
//	/**
//	 * Creates a user.
//	 *
//	 * @param IUser $user
//	 * @throws EyeUMException User already exists.
//	 */
//	public function createUser(IUser $user) {}
//	
//	/**
//	 * Deletes a principal.
//	 *
//	 * @param IPrincipal $principal
//	 * @throws EyeInvalidArgumentException First argument is not an instance of Group.
//	 * @throws EyeUMException Group not found.
//	 */
//	public function deletePrincipal(IPrincipal $principal) {}
//	
//	/**
//	 * Gets a list of all groups.
//	 *
//	 * @return array(IGroup)
//	 */
//	public function getAllGroups() {}
//	
//	/**
//	 * Gets a list of groups where the principal is included.
//	 *
//	 * @param IPrincipal $principal
//	 * @param int $depth Specify at which maximum depth (in parent groups) groups must be returned.
//	 * @return array(IGroup)
//	 * @throws EyeUMException User not found.
//	 */
//	public function getAllGroupsByPrincipal(IPrincipal $principal, $depth = -1) {}
//	
//	/**
//	 * Gets a list of groups that are included in the group.
//	 *
//	 * @param IGroup $group
//	 * @param int $depth Specify at which maximum depth (in parent groups) groups must be returned.
//	 * @return array(IGroup)
//	 * @throws EyeUMException Group not found.
//	 */
//	public function getAllGroupsFromGroup(IGroup $group, $depth = -1) {}
//	
//	/**
//	 * Gets a list of principals that are included in the group.
//	 *
//	 * @param IGroup $group
//	 * @param int $depth Specify at which maximum depth (in subgroups) groups must be returned.
//	 * @return array(IPrincipal)
//	 * @throws EyeUMException Group not found.
//	 */
//	public function getAllPrincipalsFromGroup(IGroup $group, $depth = -1) {}
//	
//	/**
//	 * Gets a list of all users.
//	 *
//	 * @return array
//	 */
//	public function getAllUsers() {}
//	
//	/**
//	 * Gets a list of users that are included in the group.
//	 *
//	 * @param IGroup $group
//	 * @param int $depth Specify at which maximum depth (in subgroups) groups must be returned.
//	 * @return array(IUser)
//	 * @throws EyeUMException Group not found.
//	 */
//	public function getAllUsersFromGroup(IGroup $group, $depth = -1) {}
//	
//	/**
//	 * Gets the group from its ID.
//	 *
//	 * @param string $id
//	 * @return IGroup
//	 * @throws EyeUMException Group not found.
//	 */
//	public function getGroupById($id) {}
//	
//	/**
//	 * Gets the group from its name.
//	 *
//	 * @param string $name
//	 * @return IGroup
//	 * @throws EyeUMException Group not found.
//	 */
//	public function getGroupByName($name) {}
//	
//	/**
//	 * Creates a new instance of a group.
//	 *
//	 * This is used because each implementation uses its own type of Group.
//	 * 
//	 * @return IGroup
//	 */
//	public function getNewGroupInstance() {}
//	
//	/**
//	 * Creates a new instance of a user.
//	 *
//	 * This is used because each implementation uses its own type of User.
//	 * 
//	 * @return IUser
//	 */
//	public function getNewUserInstance() {}
//	
//	/**
//	 * Gets the principal (user or group) from its ID.
//	 *
//	 * @param string $id
//	 * @return IPrincipal
//	 * @throws EyeUMException Principal not found.
//	 */
//	public function getPrincipalById($id) {}
//	
//	/**
//	 * Gets the user from its ID.
//	 *
//	 * @param string $id
//	 * @return IUser
//	 * @throws EyeUMException User not found.
//	 */
//	public function getUserById($id) {}
//	
//	/**
//	 * Gets the user from its name.
//	 *
//	 * @param string $name
//	 * @return IUser
//	 * @throws EyeUMException User not found.
//	 */
//	public function getUserByName($name) {}
//	
//	/**
//	 * Checks if a principal is member (directly or not) of the specified group.
//	 * 
//	 * @param IPrincipal $principal
//	 * @param IGroup $group
//	 * @param int $depth Specifies at which maximum depth (in parent groups) the principal can be considered as in the group.
//	 * @throws EyeUMException User not found or group not found.
//	 */
//	public function isPrincipalInGroup(IPrincipal $principal, IGroup $group, $depth = -1) {}
//	
//	/**
//	 * Remove a principal from a group.
//	 *
//	 * @param IPrincipal $principal
//	 * @param IGroup $group
//	 * @throws EyeUMException User not found or group not found.
//	 */
//	public function removeFromGroup(IPrincipal $principal, IGroup $group) {}
//	
//	/**
//	 * Updates the information of a principal.
//	 *
//	 * @param IPrincipal $principal
//	 * @throws EyeUMException Principal not found.
//	 */
//	public function updatePrincipal(IPrincipal $principal) {}
//}
?>