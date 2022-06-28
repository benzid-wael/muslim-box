/*
* @flow
*/
import type { Prayer } from "adhan";

export type Language = "ar" | "en" | "fr";

export type LayoutDirection = "rtl" | "ltr";

export type Localization = $ReadOnly<{
  language: Language;
  locale: string;
  dateFormat?: string;
  timeFormat?: string;
  hijriDateFormat?: string;
  direction?: LayoutDirection;
}>;

export type GeoCoordinates = $ReadOnly<{
    longitude: number;
    latitude: number;
}>;

export type PrayerTimeConfig = $ReadOnly<{
    iqamaAfterInMinutes?: number,
    iqamaDurationInMinutes?: number,
    prayerDurationInMinutes?: number,
    adhkarDurationInMinutes?: number,
}>

export type PrayerTime = $ReadOnly<{
    name: Prayer,
    isPrayer: boolean,
    start: number,
    end: number,
    visible: boolean,
    tag?: string,
}>;

export type HijriMonth =
    | "muḥarram"
    | "safar"
    | "rabii_awal"
    | "rabii_thani"
    | "jumada_awal"
    | "jumada_thani"
    | "rajab"
    | "shaban"
    | "ramadhan"
    | "shawwal"
    | "dhu_qaada"
    | "dhu_hijja";

export type Day =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

export type Season =
    | "summer"
    | "autumn"
    | "winter"
    | "spring";

export type Time =
    | "fajr"
    | "after_fajr"      // after fajr prayer
    | "sabeh"           // used to track adhkar sabeh
    | "sunrise"         // last for 20 minutes: no prayer during this time
    | "dhuha"
    | "hajerah"
    | "before_dhuhr"    // 20 minutes before zawal shames
    | "dhuhr"
    | "after_dhuhr"     // after dhuhr prayer
    | "asr"
    | "after_asr"       // after asr prayer
    | "masaa"
    | "before_maghreb"   // 20 minutes before sunset
    | "maghreb"
    | "after_maghreb"   // after maghreb prayer
    | "isha"
    | "after_isha"      // after isha prayer
    | "midnight"
    | "last_third_night"
    | "sahar"           // last 15m: reading 50 verses

export type GenericEvent =
    | "ashura"
    | "haram_month"
    | "last_10d_ramadhan"
    | "eid_fitr"
    | "first_10d_dhu_qaada"
    | "arafa"
    | "eid_adha"
    | "tashriq"
    | "rain"
    | "wind";

export type Event =
    | HijriMonth
    | Day
    | Season
    | Time
    | GenericEvent;

export type MultilingualString = $ReadOnlyMap<Language, string>;

export type BaseReference = $ReadOnly<{
    type: "quran" | "hadith" | "tafsir" | "other",
    name: string,
    page?: number,
    // this will be used mainly for Hadith
    index?: number,
    // this will be used mainly for Quran as we can have more than one verse
    indexes: $ReadOnlyArray<number>,
}>;

export type QuranReference = $ReadOnly<{
    ...$Diff<BaseReference, {page?: number, index?: number}>,
    type: "quran",
}>;

export type HadithReference = $ReadOnly<{
    ...$Diff<BaseReference, {page?: number, indexes?: number}>,
    type: "hadith",
}>;

export type Reference =
    | QuranReference
    | HadithReference;


type BaseSlide = $ReadOnly<{
    type: string,
    content: $ReadOnlyArray<string>,
    events?: $ReadOnlyArray<Event>,
    durationInSeconds?: number,
}>;

export type CurrentPrayerSlide = $ReadOnly<{
    ...$Diff<BaseSlide, {type: string, content: $ReadOnlyArray<string>}>,
    type: "current-prayer"
}>;

export type NextPrayerSlide = $ReadOnly<{
    ...$Diff<CurrentPrayerSlide, {type: string}>,
    type: "next-prayer",
}>;

export type ClockSlide = $ReadOnly<{
    ...$Diff<BaseSlide, {type: string, content: $ReadOnlyArray<string>}>,
    type: "clock",
}>;

export type QuranVerseSlide = $ReadOnly<{
    ...$Diff<BaseSlide, {type: string}>,
    type: "quran",
    reference?: QuranReference,
}>;

export type HadithSlide = $ReadOnly<{
    ...$Diff<BaseSlide, {type: string}>,
    type: "hadith",
    references?: $ReadOnlyArray<HadithReference>,
}>;

export type DhikrSlide = $ReadOnly<{
    ...$Diff<BaseSlide, {type: string}>,
    type: "dhikr",
    count: number;
}>;

export type Slide =
    | CurrentPrayerSlide
    | NextPrayerSlide
    | ClockSlide
    | QuranVerseSlide
    | HadithSlide
    | DhikrSlide;
