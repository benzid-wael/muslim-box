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

export type Time = $ReadOnly<{
  hour: number,
  minute: number,
}>;

export type SlideFilterOrderType =
  | "random"  // random order
  | "id"      // sort by id (default)

export type SlideFilterOnReachEndStrategy =
  | "reset"   // reset slider: go to 1st slide (default)
  | "load"    // load more slides

export type SlideFilterQuery = $ReadOnly<{
  name: string,
  include?: Array<String>,
  exclude?: Array<String>,
  orderBy?: SlideFilterOrderType,
  count?: number,
  // by default result will not be merged with others.
  allowMerge?: boolean,
}>

export type SlideFilter = $ReadOnly<{
  queries: Array<SlideFilterQuery>,
  onReachEnd?: SlideFilterOnReachEndStrategy,
}>

export type PrayerTimeConfig = $ReadOnly<{
  iqamahAfterInMinutes?: number,
  iqamahTime?: Time,
  iqamahDurationInMinutes?: number,
  prayerDurationInMinutes?: number,
  adhkarDurationInMinutes?: number,
  afterPrayerSunnahDurationInMinutes?: number,
  adhkarSabahMasaaDurationInMinutes?: number,
}>

export type PrayerTime = $ReadOnly<{
  name: Prayer,
  // is it a time for a specific prayer
  isPrayer: boolean,
  // used to filter out internal times: those will not get populated to
  // prayer.prayers reducer but will show up under prayer.times
  internal?: boolean,
  start: number,
  end: number,
  // show the time slot in PrayerTimes component
  visible: boolean,
  modifier?: string,
  slide?: SlideFilter,
}>;

export type HijriMonth =
  | "month:muḥarram"
  | "month:safar"
  | "month:rabii_awal"
  | "month:rabii_thani"
  | "month:jumada_ula"
  | "month:jumada_thania"
  | "month:rajab"
  | "month:shaaban"
  | "month:ramadhan"
  | "month:shawwal"
  | "month:dhul_qaadah"
  | "month:dhul_hijjah";

export type Day =
  | "weekday:monday"
  | "weekday:tuesday"
  | "weekday:wednesday"
  | "weekday:thursday"
  | "weekday:friday"
  | "weekday:saturday"
  | "weekday:sunday";

export type Season =
  | "season:summer"
  | "season:autumn"
  | "season:winter"
  | "season:spring";

export type TimePeriod =
  | "adhan:before"
  | "adhan"
  | "adhan:after"
  | "prayer:before"
  | "prayer:before:fajr"
  | "prayer:before:dhuhr"
  | "prayer:before:asr"
  | "prayer:before:maghrib"
  | "prayer:before:isha"
  | "iqamah:before"
  | "iqamah"
  | "iqamah:after"
  | "prayer"
  | "adhkar"
  | "adhkar:fajr"
  | "adhkar:dhuhr"
  | "adhkar:asr"
  | "adhkar:maghrib"
  | "adhkar:isha"
  | "prayer:after"
  | "prayer:after:fajr"
  | "prayer:after:dhuhr"
  | "prayer:after:asr"
  | "prayer:after:maghrib"
  | "prayer:after:isha"
  | "time:sabah"
  | "time:before:sunrise"
  | "time:sunrise"
  | "time:after:sunrise"
  | "time:dhuha"
  | "time:hajirah"
  | "time:before:zawal"
  | "time:masaa"
  | "time:before:sunset"
  | "time:night:midnight"
  | "time:night:last_third"
  | "time:night:sahar"      // last 15m: reading 50 verses

export type GenericEvent =
  | "event:ashura"
  | "event:haram_month"
  | "event:shaaban:mid"
  | "event:ramadhan:last_10"
  | "event:zakat_fitr"
  | "event:eid"
  | "event:eid_fitr"
  | "event:dhul_hijjah:before"
  | "event:dhul_hijjah:first_10"
  | "event:arafa"
  | "event:eid_adha"
  | "event:qarr"
  | "event:tashriq"
  | "event:rain"
  | "event:wind"
  | "event:ayam_bydh";

export type Event =
  | HijriMonth
  | Day
  | Season
  | TimePeriod
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
