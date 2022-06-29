/*
* @flow
*/
import type { GeoCoordinates } from "@src/types";

import moment from "moment";
import {
    Coordinates,
    CalculationMethod,
    PrayerTimes,
    Prayer,
    SunnahTimes,
    Shafaq,
    HighLatitudeRule,
    Rounding,
    PolarCircleResolution,
} from "adhan";

import PRAYER_TIMES from "@constants/prayer";
import type { PrayerTime, PrayerTimeConfig } from "./types";

type PTConfig = $ReadOnly<{
    // $FlowFixMe[value-as-type]
    prayer: Prayer,
    // $FlowFixMe[value-as-type]
    start: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
    // $FlowFixMe[value-as-type]
    end: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
    visible: boolean,
    isPrayer?: boolean,
    tag?: string,
}>

const generatePT = (
    prayer: Prayer,
    // $FlowFixMe[value-as-type]
    startFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
    // $FlowFixMe[value-as-type]
    endFunc: (pt: PrayerTimes, cfg: PrayerTimeConfig) => moment,
    isPrayer: boolean,
): Array<PTConfig> => {
    const iqamaTime = (pt, cfg): moment => {
        const start = startFunc(pt, cfg)
        const iqamaAfterInMinutes = cfg.iqamaAfterInMinutes || PRAYER_TIMES.IqamaAfterInMinutes
        return start.add(iqamaAfterInMinutes, "minutes")
    }

    const adhkarSalahTime = (pt, cfg): moment => {
        const start = startFunc(pt, cfg)
        const iqamaAfterInMinutes = cfg.iqamaAfterInMinutes || PRAYER_TIMES.IqamaAfterInMinutes
        const iqamaDuration = cfg.iqamaDurationInMinutes || PRAYER_TIMES.IqamaDurationInMinutes
        const prayerTime = cfg.prayerDurationInMinutes || PRAYER_TIMES.PrayerDurationInMinutes
        const totalDuration = iqamaAfterInMinutes + iqamaDuration + prayerTime
        return start.add(totalDuration, "minutes")
    }

    return [
        {
            prayer: prayer,
            start: (pt, cfg) => startFunc(pt, cfg),
            end: (pt, cfg) => startFunc(pt, cfg).add(3, "minutes"),
            isPrayer: isPrayer,
            visible: false,
            tag: "adhan"
        },
        {
            prayer: prayer,
            start: (pt, cfg) => startFunc(pt, cfg),
            end: (pt, cfg) => iqamaTime(pt, cfg),
            isPrayer: isPrayer,
            visible: false,
            tag: "before_prayer"
        },
        {
            prayer: prayer,
            start: (pt, cfg) => iqamaTime(pt, cfg),
            end: (pt, cfg) => adhkarSalahTime(pt, cfg),
            isPrayer: isPrayer,
            visible: false,
            tag: "during_prayer"
        },
        {
            prayer: prayer,
            start: (pt, cfg) => adhkarSalahTime(pt, cfg),
            end: (pt, cfg) => {
                const adhkarDuration = cfg.adhkarDurationInMinutes || PRAYER_TIMES.AdhkarDurationInMinutes
                return adhkarSalahTime(pt, cfg).add(adhkarDuration, "minutes")
            },
            isPrayer: isPrayer,
            visible: false,
            tag: "after_prayer"
        },
        {
            prayer: prayer,
            start: (pt, cfg) => startFunc(pt, cfg),
            end: (pt, cfg) => endFunc(pt, cfg),
            isPrayer: isPrayer,
            isPrayer: true,
            visible: true,
        },
    ]
}

const PrayerTimeConfigs: Array<PTConfig> = [
    ...generatePT(
        Prayer.Fajr,
        (pt, cfg) => moment(pt.fajr),
        (pt, cfg) => moment(pt.sunrise),
        true,
    ),
    {
        prayer: Prayer.Sunrise,
        start: (pt, cfg) => moment(pt.sunrise),
        end: (pt, cfg) => moment(pt.sunrise).add(20, "minutes"),
        isPrayer: false,
        visible: true,
    },
    ...generatePT(
        Prayer.Dhuhr,
        (pt, cfg) => moment(pt.dhuhr),
        (pt, cfg) => moment(pt.asr),
        true,
    ),
    ...generatePT(
        Prayer.Asr,
        (pt, cfg) => moment(pt.asr),
        (pt, cfg) => moment(pt.maghrib),
        true,
    ),
    ...generatePT(
        Prayer.Maghrib,
        (pt, cfg) => moment(pt.maghrib),
        (pt, cfg) => moment(pt.isha),
        true,
    ),
    ...generatePT(
        Prayer.Isha,
        (pt, cfg) => moment(pt.isha),
        (pt, cfg) => {
            const sunnahTimes = new SunnahTimes(pt);
            return moment(sunnahTimes.middleOfTheNight);
        },
        true,
    ),
];

export const getPrayerTimes = (
    position: GeoCoordinates,
    date: Date,
    cfg?: $ReadOnlyMap<Prayer, PrayerTimeConfig>,
): Array<Prayer> => {
    try {
        // For configuration, see https://github.com/batoulapps/adhan-js/blob/master/METHODS.md
        const {latitude, longitude} = position;
        const coordinates = new Coordinates(latitude, longitude);
        // CalculationMethods: MuslimWorldLeague, MoonsightingCommittee, ...
        const params = CalculationMethod.MoonsightingCommittee();
        // Shafaq: Ahmer, Abyad
        params.shafaq = Shafaq.Ahmer;
        // HighLatitudeRule: MiddleOfTheNight, SeventhOfTheNight, TwilightAngle or .recommended(coordinates)
        params.highLatitudeRule = HighLatitudeRule.recommended(coordinates);
        // Rounding: Nearest, Up, None
        params.rounding = Rounding.Up;
        // PolarCircleResolution: AqrabBalad, AqrabYaum, Unresolved
        params.polarCircleResolution = PolarCircleResolution.AqrabBalad;
        console.log(`Calcuating prayer times on ${date.toLocaleDateString()} for location: [${longitude}, ${latitude}]`)
        const prayerTimes = new PrayerTimes(coordinates, date, params);
        return PrayerTimeConfigs
            .map(config => {
                const ptConfig = cfg?.get(config.prayer) || {}
                try {
                    return {
                        name: config.prayer,
                        start: config.start(prayerTimes, ptConfig)?.unix(),
                        end: config.end(prayerTimes, ptConfig)?.unix(),
                        isPrayer: config.isPrayer,
                        visible: config.visible,
                        tag: config.tag,
                        // isCurrent: prayerTimes.currentPrayer() === config.prayer,
                    }
                } catch(err) {
                    console.error(`cannot compute pt: ${err}`)
                }
            })
            .filter(pt => pt);
    } catch (err) {
        return [];
    }
}

export default getPrayerTimes;
