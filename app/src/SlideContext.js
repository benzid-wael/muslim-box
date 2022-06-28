/*
* @flow
*/
import type {Day, Event, HijriMonth, PrayerTime, Season, Time} from "@src/types";
import type { Prayer } from "adhan";

import uq from '@umalqura/core';
import moment from "moment";

type timeGeneratorOptions = $ReadOnly<{
    currentPrayer: ?PrayerTime,
    nextPrayer: ?PrayerTime,
    now: moment,
}>

const timeGenerator = [
    (options: timeGeneratorOptions) => {
        const {currentPrayer} = options;
        if(currentPrayer && currentPrayer.isPrayer) {
            return `time:${currentPrayer.name}`
        }
    }
]

const getTime = (
    currentPrayer: ?PrayerTime,
    nextPrayer: ?PrayerTime,
    now: Date,
): Time => {

}

const getEvents = (
    currentPrayer: ?PrayerTime,
    nextPrayer: ?PrayerTime,
    now: Date,
    hijriDate: uq,
): Array<Event> => {
    return []
}

const getWeekday = (today: Date): Day => {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[today.getDay()].toLowerCase()
}

const getSeason = (today: Date): Season => {
    const seasons = ["winter", "spring", "summer", "autumn"];
    const seasonIndex = (today.getMonth() -1) / 3
    return seasons[seasonIndex]
}

const getHijriMonth = (today: uq): HijriMonth => {
    const months = ["muḥarram", "safar", "rabii_awal", "rabii_thani", "jumada_awal", "jumada_thani", "rajab", "shaban", "ramadhan", "shawwal", "dhu_qaada", "dhu_hijja"];
    return months[today.hm]
}


export const getContext = (
    currentPrayer: ?PrayerTime,
    nextPrayer: ?PrayerTime,
): Array<string> => {
    const hijriDate = uq();
    const today = new Date(Date.now())
    return [
        `weekday:${getWeekday(today)}`,
        `month:${getHijriMonth(hijriDate)}`,
        `season:${getSeason(today)}`,
        `time:${getTime(currentPrayer, nextPrayer, today)}`,
        ...getEvents(currentPrayer, nextPrayer, today, hijriDate)
    ]
}
