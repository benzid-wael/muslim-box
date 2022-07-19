INSERT INTO `settings` (`name`, `category`, `active`, `type`, `value`, `default`, `options`) VALUES

/* Adhan Settings */
("AutoplayAdhan", "adhan", 1, "boolean", null, "false", null),
("FajrAutoplayAdhan", "adhan", 1, "boolean", null, "false", null),
("DhuhrAutoplayAdhan", "adhan", 1, "boolean", null, "false", null),
("AsrAutoplayAdhan", "adhan", 1, "boolean", null, "false", null),
("MaghribAutoplayAdhan", "adhan", 1, "boolean", null, "false", null),
("IshaAutoplayAdhan", "adhan", 1, "boolean", null, "false", null),

("FajrAdhanSound", "adhan", 1, "enum", null, "adhan-fajr", "{""name"":""AdhanSound"",""options"":[""adhan-fajr"",""adhan-madinah"",""adhan-makkah"",""adhan-makkah-dua"",""adhan-makkah2"",""adhan-makkah2-dua"",""adhan-mishary-rashad"",""adhan-turkish""]}"),
("DhuhrAdhanSound", "adhan", 1, "enum", null, "adhan-madinah", "{""name"":""AdhanSound"",""options"":[""adhan-fajr"",""adhan-madinah"",""adhan-makkah"",""adhan-makkah-dua"",""adhan-makkah2"",""adhan-makkah2-dua"",""adhan-mishary-rashad"",""adhan-turkish""]}"),
("AsrAdhanSound", "adhan", 1, "enum", null, "adhan-madinah", "{""name"":""AdhanSound"",""options"":[""adhan-fajr"",""adhan-madinah"",""adhan-makkah"",""adhan-makkah-dua"",""adhan-makkah2"",""adhan-makkah2-dua"",""adhan-mishary-rashad"",""adhan-turkish""]}"),
("MaghribAdhanSound", "adhan", 1, "enum", null, "adhan-madinah", "{""name"":""AdhanSound"",""options"":[""adhan-fajr"",""adhan-madinah"",""adhan-makkah"",""adhan-makkah-dua"",""adhan-makkah2"",""adhan-makkah2-dua"",""adhan-mishary-rashad"",""adhan-turkish""]}"),
("IshaAdhanSound", "adhan", 1, "enum", null, "adhan-madinah", "{""name"":""AdhanSound"",""options"":[""adhan-fajr"",""adhan-madinah"",""adhan-makkah"",""adhan-makkah-dua"",""adhan-makkah2"",""adhan-makkah2-dua"",""adhan-mishary-rashad"",""adhan-turkish""]}"),

/* Prayer Settings */
("AdhanDurationInMinutes", "prayer", 1, "int", null, "5", null),
("FajrAdhanDurationInMinutes", "prayer", 1, "int", null, "5", null),

("AfterAdhanDurationInMinutes", "prayer", 1, "int", null, "2", null),
("FajrAfterAdhanDurationInMinutes", "prayer", 1, "int", null, "2", null),
("MaghribAfterAdhanDurationInMinutes", "prayer", 1, "int", null, "2", null),

("IqamahAfterInMinutes", "prayer", 1, "int", null, "15", null),
("FajrIqamahAfterInMinutes", "prayer", 1, "int", null, null, null),
("DhuhrIqamahAfterInMinutes", "prayer", 1, "int", null, null, null),
("AsrIqamahAfterInMinutes", "prayer", 1, "int", null, null, null),
("MaghribIqamahAfterInMinutes", "prayer", 1, "int", null, null, null),
("IshaIqamahAfterInMinutes", "prayer", 1, "int", null, null, null),

("IqamahDurationInMinutes", "prayer", 1, "int", null, "1", null),

("PrayerDurationInMinutes", "prayer", 1, "int", null, "10", null),
("FajrPrayerDurationInMinutes", "prayer", 1, "int", null, null, null),("DhuhrPrayerDurationInMinutes", "prayer", 1, "int", null, null, null),
("AsrPrayerDurationInMinutes", "prayer", 1, "int", null, null, null),
("MaghribPrayerDurationInMinutes", "prayer", 1, "int", null, null, null),
("IshaPrayerDurationInMinutes", "prayer", 1, "int", null, null, null),

("AdhkarDurationInMinutes", "prayer", 1, "int", null, "10", null),

("AfterPrayerSunnahDurationInMinutes", "prayer", 1, "int", null, "15", null),
("FajrAfterPrayerSunnahDurationInMinutes", "prayer", 1, "int", null, null, null),
("DhuhrAfterPrayerSunnahDurationInMinutes", "prayer", 1, "int", null, null, null),
("AsrAfterPrayerSunnahDurationInMinutes", "prayer", 1, "int", null, null, null),
("MaghribAfterPrayerSunnahDurationInMinutes", "prayer", 1, "int", null, null, null),
("IshaAfterPrayerSunnahDurationInMinutes", "prayer", 1, "int", null, null, null),

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
