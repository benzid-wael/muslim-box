/*
* @flow
*/
import type { PrayerTime, PrayerTimeConfig } from "./types";

import { PrayerTimes, SunnahTimes } from "adhan";
import moment from "moment";

import PRAYER_TIMES from "@constants/prayer";

export const getAdhanEndTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig,
): moment => {
  return startFunc(pt, cfg).add(PRAYER_TIMES.AdhanDurationInMinutes, "minutes")
}

export const getAfterAdhanEndTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig,
): moment => {
  const start = getAdhanEndTime(startFunc, endFunc, pt, cfg)
  return start.add(PRAYER_TIMES.AfterAdhanDurationInMinutes, "minutes")
}

export const getIqamahStartTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig,
): moment => {
  if(cfg?.iqamahTime) {
    return moment({
        hour: cfg?.iqamahTime?.hour,
        minute: cfg?.iqamahTime?.minute,
    })
  }
  const start = startFunc(pt, cfg)
  const iqamahAfterInMinutes = cfg.iqamahAfterInMinutes || PRAYER_TIMES.IqamahAfterInMinutes
  return start.add(iqamahAfterInMinutes, "minutes")
}

export const getIqamahEndTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig,
): moment => {
  const start = getIqamahStartTime(startFunc, endFunc, pt, cfg)
  const duration = cfg.iqamahDurationInMinutes || PRAYER_TIMES.IqamahDurationInMinutes
  return start.add(duration, "minutes")
}

export const getAdhkarStartTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig,
): moment => {
  const start = getIqamahEndTime(startFunc, endFunc, pt, cfg)
  const duartion = cfg.prayerDurationInMinutes || PRAYER_TIMES.PrayerDurationInMinutes
  return start.add(duartion, "minutes")
}

export const getAdhkarEndTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig,
): moment => {
  const start = getAdhkarStartTime(startFunc, endFunc, pt, cfg)
  const duartion = cfg.adhkarDurationInMinutes || PRAYER_TIMES.AdhkarDurationInMinutes
  return start.add(duartion, "minutes")
}

export const getAfterPrayerSunnahEndTime = (
  // $FlowFixMe[value-as-type]
  startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  // $FlowFixMe[value-as-type]
  endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
  pt: PrayerTimes,
  cfg: PrayerTimeConfig,
): moment => {
  const start = getAdhkarEndTime(startFunc, endFunc, pt, cfg)
  const duartion = cfg.afterPrayerSunnahDurationInMinutes || PRAYER_TIMES.AfterPrayerSunnahDurationInMinutes
  return start.add(duartion, "minutes")
}

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
  cfg: PrayerTimeConfig,
): moment => {
  const start = startFunc(pt, cfg)
  const duartion = cfg.adhkarSabahMasaaDurationInMinutes || PRAYER_TIMES.AdhkarSabahMasaaDurationInMinutes
  return start.add(duartion, "minutes")
}

export const getLastNightPrayerInfo = (pt: PrayerTimes): moment => {
  const yesterday = moment(pt.date).add(-1, "day")
  const ydPT = new PrayerTimes(
    pt.coordinates,
    yesterday.toDate(),
    pt.calculationParameters,
  )
  const ydST = new SunnahTimes(ydPT)
  return {
    middleOfTheNight: moment(ydST.middleOfTheNight),
    lastThirdOfTheNight: moment(ydST.lastThirdOfTheNight),
    sahar: moment(pt.fajr).add(-PRAYER_TIMES.SaharTimeDurationInMinutes, "minutes"),
    fajr: moment(pt.fajr),
  }
}

export const getHajirahStartTime = (pt: PrayerTimes): moment => {
  const sunrise = moment(pt.sunrise)
  const duration = moment.duration(moment(pt.dhuhr).diff(sunrise))
  return sunrise.add(duration.asMinutes(), "minutes")
}

export const getHajirahEndTime = (pt: PrayerTimes): moment => {
  const dhuhr = moment(pt.dhuhr)
  return dhuhr.add(-PRAYER_TIMES.ZawalDurationInMinutes, "minutes")
}
