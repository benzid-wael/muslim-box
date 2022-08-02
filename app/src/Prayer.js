/*
 * @flow
 */
import type { PrayerTime, PrayerTimeConfig } from "@src/types";

import { PrayerTimes, SunnahTimes } from "adhan";
import moment from "moment";

export const getAdhanEndTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig
): moment => {
  return startFunc(pt, cfg).add(cfg.adhanDurationInMinutes, "minutes");
};

export const getAfterAdhanEndTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig
): moment => {
  const start = getAdhanEndTime(startFunc, endFunc, pt, cfg);
  return start.add(cfg.afterAdhanDurationInMinutes, "minutes");
};

export const getIqamahStartTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig
): moment => {
  if (cfg?.iqamahTime) {
    return moment({
      hour: cfg?.iqamahTime?.hour,
      minute: cfg?.iqamahTime?.minute,
    });
  }
  const start = startFunc(pt, cfg);
  return start.add(cfg.iqamahAfterInMinutes, "minutes");
};

export const getIqamahEndTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig
): moment => {
  const start = getIqamahStartTime(startFunc, endFunc, pt, cfg);
  return start.add(cfg.iqamahDurationInMinutes, "minutes");
};

export const getAdhkarStartTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig
): moment => {
  const start = getIqamahEndTime(startFunc, endFunc, pt, cfg);
  return start.add(cfg.prayerDurationInMinutes, "minutes");
};

export const getAdhkarEndTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig
): moment => {
  const start = getAdhkarStartTime(startFunc, endFunc, pt, cfg);
  return start.add(cfg.adhkarDurationInMinutes, "minutes");
};

export const getAfterPrayerSunnahEndTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig
): moment => {
  const start = getAdhkarEndTime(startFunc, endFunc, pt, cfg);
  return start.add(cfg.afterPrayerSunnahDurationInMinutes, "minutes");
};

/*
 * Returns end time of Adhkar Sabah/Masaa
 * FYI: Given that the time should start after "after prayer's sunnah"
 *   which is not defined for all prayers, the startFunc should indicates
 *   the start of adkar sabah/masaa and not not the related prayer
 */
export const getAdhkarSabahMasaaEndTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig
): moment => {
  const start = startFunc(pt, cfg);
  return start.add(cfg.adhkarSabahMasaaDurationInMinutes, "minutes");
};

export const getLastNightPrayerInfo = (pt: PrayerTimes, cfg: PrayerTimeConfig): moment => {
  const yesterday = moment(pt.date).add(-1, "day");
  const ydPT = new PrayerTimes(pt.coordinates, yesterday.toDate(), pt.calculationParameters);
  const ydST = new SunnahTimes(ydPT);
  return {
    middleOfTheNight: moment(ydST.middleOfTheNight),
    lastThirdOfTheNight: moment(ydST.lastThirdOfTheNight),
    sahar: moment(pt.fajr).add(-cfg.saharTimeDurationInMinutes, "minutes"),
    fajr: moment(pt.fajr),
  };
};

export const getHajirahStartTime = (pt: PrayerTimes, cfg: PrayerTimeConfig): moment => {
  const sunrise = moment(pt.sunrise);
  const duration = moment.duration(moment(pt.dhuhr).diff(sunrise));
  const durationToLastSeventh = (duration.asMinutes() / 7) * 6;
  return sunrise.add(durationToLastSeventh, "minutes");
};

export const getHajirahEndTime = (pt: PrayerTimes, cfg: PrayerTimeConfig): moment => {
  const dhuhr = moment(pt.dhuhr);
  return dhuhr.add(-cfg.zawalDurationInMinutes, "minutes");
};
