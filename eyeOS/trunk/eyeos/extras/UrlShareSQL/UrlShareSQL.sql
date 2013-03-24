-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `urlfile`
--

CREATE TABLE IF NOT EXISTS `urlfile` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `path` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `path` (`path`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `urlshare`
--

CREATE TABLE IF NOT EXISTS `urlshare` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `password` varchar(8) NOT NULL,
  `publicationDate` int(12) NOT NULL,
  `expirationDate` int(12) DEFAULT NULL,
  `lastdownloaddate` int(12) DEFAULT NULL,
  `mailText` text NOT NULL,
  `sendFrom` varchar(50) NOT NULL,
  `fileId` int(10) unsigned NOT NULL,
  `enabled` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fileId` (`fileId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

--
-- Estructura de tabla para la tabla `urlmail`
--

CREATE TABLE IF NOT EXISTS `urlmail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `address` varchar(50) NOT NULL,
  `userId` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `urlmailsent`
--

CREATE TABLE IF NOT EXISTS `urlmailsent` (
  `urlId` int(10) unsigned NOT NULL,
  `mailAddressId` int(10) unsigned NOT NULL,
  `userId` varchar(128) NOT NULL,
  PRIMARY KEY (`urlId`,`mailAddressId`,`userId`),
  KEY `mailAddressId` (`mailAddressId`),
  KEY `userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
--
-- Filtros para la tabla `urlshare`
--
ALTER TABLE `urlshare`
  ADD CONSTRAINT `urlshare_ibfk_1` FOREIGN KEY (`fileId`) REFERENCES `urlfile` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `urlmailsent`
--
ALTER TABLE `urlmailsent`
  ADD CONSTRAINT `urlmailsent_ibfk_1` FOREIGN KEY (`urlId`) REFERENCES `urlshare` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `urlmailsent_ibfk_2` FOREIGN KEY (`mailAddressId`) REFERENCES `urlmail` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `urlmailsent_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `eyeosuser` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;