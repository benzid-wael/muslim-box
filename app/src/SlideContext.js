/*
 * @flow
 */
import type { Day, Event, HijriMonth, PrayerTime, Season, Time, TimePeriod } from "@src/types";
import type { Prayer } from "adhan";

import uq from "@umalqura/core";
import moment from "moment";

const getEvents = (current: ?PrayerTime, next: ?PrayerTime, now: Date, hijriDate: uq): Array<Event> => {
  const isRamadhan = hijriDate.hm === 8;
  const isDhulHijjah = hijriDate.hm === 12;
  const isDhulQaadah = hijriDate.hm === 11;
  const midShaaban = isRamadhan && [14, 15].includes(hijriDate.hd);
  const isEidFitr = hijriDate.hm == 9 && hijriDate.hd == 1;
  const isEidAdha = isDhulHijjah && [10, 11, 12, 13].includes(hijriDate.hd);
  const isSacredMonth = [11, 12, 1, 7].includes(hijriDate.hm);
  return [
    hijriDate.hm == 1 && hijriDate.hd == 10 ? "event:ashura" : null,
    midShaaban ? "event:shaaban:mid" : null,
    // last 10d of ramadhan
    isRamadhan && hijriDate.hd > 20 ? "event:ramadhan:last_10" : null,
    // zakat fitr reminder
    isRamadhan && hijriDate.hd > 27 ? "event:zakat_fitr" : null,
    [13, 14, 15].includes(hijriDate.hd) ? "event:ayam_bydh" : null,
    isEidFitr ? "event:eid_fitr" : null,
    // Dhul Hajjah reminder
    isDhulQaadah && hijriDate.day > 23 ? "event:dhul_hijjah:before" : null,
    isDhulHijjah && hijriDate.day < 10 ? "event:dhul_hijjah:first_10" : null,
    isDhulHijjah && hijriDate.day == 9 ? "event:arafa" : null,
    isDhulHijjah && [10, 11, 12, 13].includes(hijriDate.day) ? "event:tashriq" : null,
    isDhulHijjah && hijriDate.day == 11 ? "event:qarr" : null,
    isEidAdha ? "event:eid_adha" : null,
    isEidFitr || isEidAdha ? "event:eid" : null,
    isSacredMonth ? "event:sacred_month" : null,
  ].filter((e) => e);
};

const getWeekday = (today: Date): Day => {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = weekdays[today.getDay()].toLowerCase();
  return `weekday:${day}`;
};

const getSeason = (today: Date): Season => {
  const seasons = ["winter", "spring", "summer", "autumn"];
  const seasonIndex = (today.getMonth() - 1) / 3;
  return `season:${seasons[seasonIndex]}`;
};

const getHijriMonth = (today: uq): HijriMonth => {
  const months = [
    "",
    "muḥarram",
    "safar",
    "rabii_awal",
    "rabii_thani",
    "jumada_ula",
    "jumada_thania",
    "rajab",
    "shaaban",
    "ramadhan",
    "shawwal",
    "dhul_qaadah",
    "dhul_hijjah",
  ];
  return `month:${months[today.hm]}`;
};

export const getContext = (currentPrayer: ?PrayerTime, nextPrayer: ?PrayerTime): Array<string> => {
  const hijriDate = uq();
  const today = new Date(Date.now());
  return [
    getSeason(today),
    getHijriMonth(hijriDate),
    getWeekday(today),
    ...getEvents(currentPrayer, nextPrayer, today, hijriDate),
  ];
};
