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

abstract class CalendarApplication extends EyeosApplicationExecutable {
	public static function __run(AppExecutionContext $context, MMapResponse $response) {
		//if ($context->getIncludeBody()) {
			$buffer = '';
			
			// Internal components
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/interfaces.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/constants.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/model.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/Controller.js');
			
			// Menu & Toolbar
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/Actions.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/menu/Items.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/toolbar/Items.js');
			
			// Dialogs
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/dialogs/EditEvent.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/dialogs/Settings.js');
			
			// GUI components
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/view/MiniGridCalendar.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/view/BlockCalendar.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/view/CalendarsList.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/view/ViewModeSelector.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/view/SimplePeriodDisplay.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/view/RibbonCalendar.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/view/Event.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/view/EventPopup.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/view/GridCalendar.js');
			$buffer .= file_get_contents(EYE_ROOT . '/' . APPS_DIR . '/calendar/classes/view/GridCalendar.EventsContainer.js');
			
			$response->appendToBody($buffer);
		//}
	}
	
	/**
	 * @param array $params(
	 * 		'name' => name,
	 * 		['...attribute...' => __value__,]
	 * 		['...' => ...]
	 * )
	 * @return Calendar The calendar with all missing field filed in.
	 */
	public static function createCalendar($params) {
		if (!isset($params['name']) || !is_string($params['name'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'name\'].');
		}
		
		$owner = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
				
		$newCalendar = CalendarManager::getInstance()->getNewCalendar();
		foreach($params as $attributeName => $attributeValue) {
			if ($attributeName != 'id') {
				$setMethod = 'set' . ucfirst($attributeName);
				$newCalendar->$setMethod($attributeValue);
			}
		}
		$newCalendar->setOwnerId($owner->getId());
		CalendarManager::getInstance()->saveCalendar($newCalendar);
		
		// Use self::getCalendar() to retrieve the preferences at the same time
		return self::getCalendar(array('id' => $newCalendar->getId()));
	}
	
	/**
	 * @param array $params(
	 * 		'subject' => subject,
	 * 		'timeStart' => timeStart,
	 * 		'timeEnd' => timeEnd,
	 * 		'calendarId' => calendarId
	 * )
	 * @return Event The event with all missing field filed in.
	 */
	public static function createEvent($params) {
		if (!isset($params['subject']) || !is_string($params['subject'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'subject\'].');
		}
		if (!isset($params['timeStart']) || !is_numeric($params['timeStart'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'timeStart\'].');
		}
		if (!isset($params['timeEnd']) || !is_numeric($params['timeEnd'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'timeEnd\'].');
		}
		if (!isset($params['calendarId']) || !is_string($params['calendarId'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'calendarId\'].');
		}
		
		$creator = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
				
		$newEvent = CalendarManager::getInstance()->getNewEvent();
		$newEvent->setSubject($params['subject']);
		$newEvent->setTimeStart($params['timeStart']);
		$newEvent->setTimeEnd($params['timeEnd']);
		$newEvent->setCalendarId($params['calendarId']);
		$newEvent->setCreatorId($creator->getId());
		CalendarManager::getInstance()->saveEvent($newEvent);
		
		return self::toArray($newEvent);
	}
	
	/**
	 * @param array $params(
	 * 		'calendarId' => calendarId
	 * )
	 */
	public static function deleteCalendar($params) {
		if (!isset($params['calendarId']) || !is_string($params['calendarId'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'calendarId\'].');
		}
		
		$cal = CalendarManager::getInstance()->getCalendarById($params['calendarId']);
		CalendarManager::getInstance()->deleteCalendar($cal);
	}
	
	/**
	 * @param array $params(
	 * 		'eventId' => eventId
	 * )
	 */
	public static function deleteEvent($params) {
		if (!isset($params['eventId']) || !is_string($params['eventId'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'eventId\'].');
		}
		
		$event = CalendarManager::getInstance()->getEventById($params['eventId']);
		CalendarManager::getInstance()->deleteEvent($event);
	}
	
	/**
	 * @param array $params(
	 * 		'calendarId' => calendarId,
	 * 		'periodFrom' => periodFrom = null,
	 * 		'periodTo' => periodTo = null
	 * )
	 * @return array(Event)
	 */
	public static function getAllEventsFromPeriod($params) {
		if (!isset($params['calendarId']) || !is_string($params['calendarId'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'calendarId\'].');
		}
		$from = null;
		if (is_numeric($params['periodFrom'])) {
			$from = (int) $params['periodFrom'];
		}
		$to = null;
		if (is_numeric($params['periodTo'])) {
			$to = (int) $params['periodTo'];
		}
		
		$cal = CalendarManager::getInstance()->getCalendarById($params['calendarId']);
		$result = CalendarManager::getInstance()->getAllEventsByPeriod($cal, $from, $to);		
		
		return self::toArray($result);
	}
	
	/**
	 * @param null
	 * @return array(Calendar)
	 */
	public static function getAllSharedCalendars($params) {
		$collaborator = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
		$shareType = CalendarManager::getInstance()->getNewCalendar();
		$result = SharingManager::getInstance()->getAllShareInfoFromCollaborator($collaborator, null, $shareType);
		
		return self::toArray($result);
	}
	
	/**
	 * @param null
	 * @return array(Calendar)
	 */
	public static function getAllUserCalendars($params) {
		$owner = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser();
		$results = CalendarManager::getInstance()->getAllCalendarsFromOwner($owner);
		
		$userId = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser()->getid();
		
		$results = self::toArray($results);
		foreach($results as &$result) {
			$preferences = CalendarManager::getInstance()->getCalendarPreferences($userId, $result['id']);
			$result['preferences'] = self::toArray($preferences);
		}
		
		return $results;
	}
	
	/**
	 * @param array $params(
	 * 		'id' => calendarId
	 * )
	 * @return Calendar
	 */
	public static function getCalendar($params) {
		if (!isset($params['id']) || !is_string($params['id'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'id\'].');
		}
		
		$userId = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser()->getid();
		
		$calendar = self::toArray(CalendarManager::getInstance()->getCalendarById($params['id']));
		$calendar['preferences'] = self::toArray(CalendarManager::getInstance()->getCalendarPreferences($userId, $params['id']));
		
		return $calendar;
	}
	
	/**
	 * @param array $params(
	 * 		'eventId' => eventId
	 * )
	 */
	public static function getEvent($params) {
		if (!isset($params['eventId']) || !is_string($params['eventId'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'eventId\'].');
		}
		
		return self::toArray(CalendarManager::getInstance()->getEventById($params['eventId']));
	}
	
	/**
	 * @see AbstractCalendarPermission for a complete list of available actions
	 * 
	 * @param array $params(
	 * 		'calendarId' => calendarId,
	 * 		'collaboratorId' => collaboratorId,
	 * 		'permissionActions' => 'share, edit, see, see_details'
	 * )
	 */
	public static function shareCalendar($params) {
		if (!isset($params['calendarId']) || !is_string($params['calendarId'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'calendarId\'].');
		}
		if (!isset($params['collaboratorId']) || !is_string($params['collaboratorId'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'collaboratorId\'].');
		}
		if (!isset($params['permissionActions']) || !is_string($params['permissionActions'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'permissionActions\'].');
		}
		
		$cal = CalendarManager::getInstance()->getCalendarById($params['calendarId']);
		$collaborator = UMManager::getPrincipalById($params['collaboratorId']);
		$perms = new AbstractCalendarPermission($params['permissionActions']);
		
		$cal->addCollaborator($collaborator, $perms);
	}
	
	/**
	 * Performs a PHP variable => JSON-compatible array conversion with ICalendars, ICalendarEvents,
	 * ICalendarPreferences and arrays of the previous types.
	 * 
	 * @param mixed $value
	 * @return array
	 */
	private static function toArray($value) {
		if ($value instanceof ICalendar || $value instanceof ICalendarEvent || $value instanceof ICalendarPrefs) {
			return $value->getAttributesMap();
		}
		if (!is_array($value)) {
			throw new EyeInvalidArgumentException('$value must be an ICalendar, ICalendarEvent, ICalendarPrefs, or an array of one of the previous classes (' . gettype($value) . ' given).');
		}
		
		foreach($value as &$v) {
			$v = self::toArray($v);
		}
		return $value;
	}
	
	/**
	 * @see ICalendar for the complete list of attributes
	 * 
	 * @param array $params(
	 * 		'id' => id,
	 * 		'...attributeToUpdate...' => __newValue__,
	 * 		'...' => ...
	 * )
	 */
	public static function updateCalendar($params) {
		if (!isset($params['id']) || !is_string($params['id'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'id\'].');
		}
		
		$userId = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		$cal = CalendarManager::getInstance()->getCalendarById($params['id']);
		
		foreach($params as $attributeName => $attributeValue) {
			if ($attributeName != 'id') {
				$setMethod = 'set' . ucfirst($attributeName);
				$cal->$setMethod($attributeValue);
			}
		}
		
		CalendarManager::getInstance()->saveCalendar($cal);
	}
	
	/**
	 * @see ICalendarPrefs for the complete list of attributes
	 * 
	 * @param array $params(
	 * 		'id' => calendarId,
	 * 		'color' => color,
	 * 		'visible' => visible,
	 * 		'...preferenceToUpdate...' => __newValue__,
	 * 		'...' => ...
	 * )
	 */
	public static function updateCalendarPreferences($params) {
		if (!isset($params['id']) || !is_string($params['id'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'id\'].');
		}
		
		$userId = ProcManager::getInstance()->getCurrentProcess()->getLoginContext()->getEyeosUser()->getId();
		// check validity of the calendar ID
		$cal = CalendarManager::getInstance()->getCalendarById($params['id']);
		
		$prefs = CalendarManager::getInstance()->getCalendarPreferences($userId, $params['id']);
		
		foreach($params as $attributeName => $attributeValue) {
			if ($attributeName != 'id') {
				$setMethod = 'set' . ucfirst($attributeName);
				$prefs->$setMethod($attributeValue);
			}
		}
		CalendarManager::getInstance()->saveCalendarPreferences($prefs);
	}
	
	/**
	 * @see ICalendarEvent for the complete list of attributes
	 * 
	 * @param array $params(
	 * 		'id' => id,
	 * 		'...attributeToUpdate...' => newValue,
	 * 		'...' => ...
	 */
	public static function updateEvent($params) {
		if (!isset($params['id']) || !is_string($params['id'])) {
			throw new EyeMissingArgumentException('Missing or invalid $params[\'id\'].');
		}
		
		$event = CalendarManager::getInstance()->getEventById($params['id']);
		
		foreach($params as $attributeName => $attributeValue) {
			if ($attributeName != 'id') {
				$setMethod = 'set' . ucfirst($attributeName);
				$event->$setMethod($attributeValue);
			}
		}
		CalendarManager::getInstance()->saveEvent($event);
	}
}
?>