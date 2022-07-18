INSERT INTO `settings` (`name`, `category`, `active`, `type`, `value`, `default`, `options`) VALUES

/* Adhan Settings */
("Autoplay", "adhan", 1, "boolean", null, "false", "{""name"":""AdhanSound"",""options"":[""adhan-fajr"",""adhan-madinah"",""adhan-makkah"",""adhan-makkah-dua"",""adhan-makkah2"",""adhan-makkah2-dua"",""adhan-mishary-rashad"",""adhan-turkish""]}"),
("FajrAdhanSound", "adhan", 1, "enum", null, "adhan-fajr", "{""name"":""AdhanSound"",""options"":[""adhan-fajr"",""adhan-madinah"",""adhan-makkah"",""adhan-makkah-dua"",""adhan-makkah2"",""adhan-makkah2-dua"",""adhan-mishary-rashad"",""adhan-turkish""]}"),
("DhuhrAdhanSound", "adhan", 1, "enum", null, "adhan-madinah", "{""name"":""AdhanSound"",""options"":[""adhan-fajr"",""adhan-madinah"",""adhan-makkah"",""adhan-makkah-dua"",""adhan-makkah2"",""adhan-makkah2-dua"",""adhan-mishary-rashad"",""adhan-turkish""]}"),
("AsrAdhanSound", "adhan", 1, "enum", null, "adhan-madinah", "{""name"":""AdhanSound"",""options"":[""adhan-fajr"",""adhan-madinah"",""adhan-makkah"",""adhan-makkah-dua"",""adhan-makkah2"",""adhan-makkah2-dua"",""adhan-mishary-rashad"",""adhan-turkish""]}"),
("MaghribAdhanSound", "adhan", 1, "enum", null, "adhan-madinah", "{""name"":""AdhanSound"",""options"":[""adhan-fajr"",""adhan-madinah"",""adhan-makkah"",""adhan-makkah-dua"",""adhan-makkah2"",""adhan-makkah2-dua"",""adhan-mishary-rashad"",""adhan-turkish""]}"),
("IshaAdhanSound", "adhan", 1, "enum", null, "adhan-madinah", "{""name"":""AdhanSound"",""options"":[""adhan-fajr"",""adhan-madinah"",""adhan-makkah"",""adhan-makkah-dua"",""adhan-makkah2"",""adhan-makkah2-dua"",""adhan-mishary-rashad"",""adhan-turkish""]}"),
("AutoplayFajrAdhan", "adhan", 1, "boolean", null, "false", null),
("AutoplayDhuhrAdhan", "adhan", 1, "boolean", null, "false", null),
("AutoplayAsrAdhan", "adhan", 1, "boolean", null, "false", null),
("AutoplayMaghribAdhan", "adhan", 1, "boolean", null, "false", null),
("AutoplayIshaAdhan", "adhan", 1, "boolean", null, "false", null),

/* Prayer Settings */
("AdhanDurationInMinutes", "prayer", 1, "int", null, "5", null),
("AfterAdhanDurationInMinutes", "prayer", 1, "int", null, "2", null),
("IqamahAfterInMinutes", "prayer", 1, "int", null, "15", null),
("IqamahDurationInMinutes", "prayer", 1, "int", null, "1", null),
("PrayerDurationInMinutes", "prayer", 1, "int", null, "10", null),
("AdhkarDurationInMinutes", "prayer", 1, "int", null, "10", null),
("AfterPrayerSunnahDurationInMinutes", "prayer", 1, "int", null, "15", null),
("AdhkarSabahMasaaDurationInMinutes", "prayer", 1, "int", null, "20", null),
("EndTimeReminderInMinutes", "prayer", 1, "int", null, "20", null),
("SaharTimeDurationInMinutes", "prayer", 1, "int", null, "20", null),
("ZawalDurationInMinutes", "prayer", 1, "int", null, "20", null),

/* prayer time calculation */
("Method", "prayer", 1, "enum", null, "MoonsightingCommittee", "{""name"":""CalculationMethod"",""options"":[""MuslimWorldLeague"",""Egyptian"",""Karachi"",""UmmAlQura"",""Dubai"",""Qatar"",""Kuwait"",""MoonsightingCommittee"",""Singapore"",""Turkey"",""Tehran"",""NorthAmerica"",""Other""]}"),
("Madhab", "prayer", 1, "enum", null, "Shafi", "{""name"":""Madhab"",""options"":[""Shafi"",""Hanafi""]}"),
("Shafaq", "prayer", 1, "enum", null, "Ahmer", "{""name"":""Shafaq"",""options"":[""General"",""Ahmer"",""Abyad""]}"),
("HighLatitudeRule", "prayer", 1, "enum", null, "Auto", "{""name"":""HighLatitudeRule"",""options"":[""Auto"",""MiddleOfTheNight"",""SeventhOfTheNight"",""TwilightAngle""]}"),
("PolarCircleResolution", "prayer", 1, "enum", null, "AqrabBalad", "{""name"":""PolarCircleResolution"",""options"":[""Unresolved"",""AqrabBalad"",""AqrabYaum""]}"),

/* Slider Settings */
("WordsPerMinute", "slider", 1, "int", null, "60", null),
("PageSize", "slider", 1, "int", null, "10", null),
("PageRepeatRatioNOutOfOne", "slider", 1, "int", null, "10", null),
("PrayerReminderEveryNSlides", "slider", 1, "int", null, "10", null),
("MaxSlidesBeforeReset", "slider", 1, "int", null, "1000", null),
("MinimumSlideDurationInSeconds", "slider", 1, "int", null, "3", null),
("PrayerReminderDurationInSeconds", "slider", 1, "int", null, "10", null),
("DefaultSlidingDurationInSeconds", "slider", 1, "int", null, "3", null),
("OnReachEndStrategy", "slider", 1, "enum", null, "reset", "{""name"":""OnReachEndStrategy"",""options"":[""reset"",""load""]}"),
("EnableVerseOfTheDayAPI", "slider", 1, "boolean", null, "true", null),
("EnableAnimation", "slider", 1, "boolean", null, "true", null);
