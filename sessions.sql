--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `sessionID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `notes` text NOT NULL,
  `time` datetime NOT NULL,
  `url` varchar(255) NOT NULL,
  `events` longtext NOT NULL,
  PRIMARY KEY (`sessionID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;