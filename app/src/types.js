/*
* @flow
*/
import type { Prayer } from "adhan";

export type Language = "ar" | "en" | "fr";

export type LayoutDirection = "rtl" | "ltr";

export type Localization = $ReadOnly<{
  language: Language;
  dateFormat?: string;
  timeFormat?: string;
  hijriDateFormat?: string;
  direction?: LayoutDirection;
}>;

export type GeoCoordinates = $ReadOnly<{
    longitude: number;
    latitude: number;
}>;

export type PrayerTime = $ReadOnly<{
    name: Prayer,
    start: number,
    end: number,
    isCurrent: boolean,
}>;

export type HijriMonth =
    | 'muḥarram'
    | 'safar'
    | 'rabii_awal'
    | 'rabii_thani'
    | 'jumada_awal'
    | 'jumada_thani'
    | 'rajab'
    | 'shaban'
    | 'ramadhan'
    | 'shawwal'
    | 'dhu_qaada'
    | 'dhu_hijja';

export type Day =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';

export type Season =
    | 'summer'
    | 'autumn'
    | 'winter'
    | 'spring';

export type Time =
    | 'night'
    | 'suhur'
    | 'before_fajr'
    | 'after_fajr'
    | 'before_sunrise'
    | 'after_sunrise'
    | 'dhuha'
    | 'evening'
    | 'bwfore_sunset'
    | 'after_sunset';

export type GenericEvent =
    | 'before_prayer'
    | 'prayer'
    | 'after_prayer'
    | 'arafa'
    | 'tashriq'
    | 'eid_fitr'
    | 'eif_adha'
    | 'rain'
    | 'wind';

export type Event =
    | HijriMonth
    | Day
    | Season
    | Time
    | GenericEvent;

export type MultilingualString = $ReadOnlyMap<Language, string>;

export type BaseReference = $ReadOnly<{
    type: 'quran' | 'hadith' | 'tafsir' | 'other',
    name: MultilingualString,
    page?: number,
    // this will be used mainly for Hadith
    index?: number,
    // this will be used mainly for Quran as we can have more than one verse
    indexes: $ReadOnlyArray<number>,
}>;

export type QuranReference = $ReadOnly<{
    ...$Diff<BaseReference, {page?: number, index?: number}>,
    type: 'quran',
}>;

export type HadithReference = $ReadOnly<{
    ...$Diff<BaseReference, {page?: number, indexes?: number}>,
    type: 'hadith',
}>;

export type Reference =
    | QuranReference
    | HadithReference;


type BaseSlide = $ReadOnly<{
    type: string,
    content: $ReadOnlyArray<MultilingualString>,
    events?: $ReadOnlyArray<Event>,
    durationInSeconds?: number,
}>;

export type QuranVerseSlide = $ReadOnly<{
    ...$Diff<BaseSlide, {type: string}>,
    type: 'quran',
    reference?: QuranReference,
}>;

export type HadithSlide = $ReadOnly<{
    ...$Diff<BaseSlide, {type: string}>,
    type: 'hadith',
    references?: $ReadOnlyArray<HadithReference>,
}>;

export type NextPrayerSlide = $ReadOnly<{
    ...$Diff<BaseSlide, {type: string, content: $ReadOnlyArray<MultilingualString>}>,
    type: 'next-prayer',
    prayer: PrayerTime,
}>;

export type ClockSlide = $ReadOnly<{
    ...$Diff<BaseSlide, {type: string, content: $ReadOnlyArray<MultilingualString>}>,
    type: 'clock',
}>;

export type DhikrSlide = $ReadOnly<{
    ...$Diff<BaseSlide, {type: string}>,
    type: 'dhikr',
    count: number;
}>;

export type Slide =
    | QuranVerseSlide
    | HadithSlide
    | NextPrayerSlide
    | ClockSlide
    | DhikrSlide;
