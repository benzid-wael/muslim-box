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

const PrayerTimeConfigs: Array<$ReadOnly<{
    // $FlowFixMe[value-as-type]
    prayer: Prayer,
    // $FlowFixMe[value-as-type]
    start: (pt: PrayerTimes) => moment,
    // $FlowFixMe[value-as-type]
    end: (pt: PrayerTimes) => moment,
}>> = [
    {
        prayer: Prayer.Fajr,
        start: (pt) => moment(pt.fajr),
        end: (pt) => moment(pt.sunrise),
    },
    {
        prayer: Prayer.Sunrise,
        start: (pt) => moment(pt.sunrise),
        end: (pt) => moment(pt.sunrise).add(20, 'minutes'),
    },
    {
        prayer: Prayer.Dhuhr,
        start: (pt) => moment(pt.dhuhr),
        end: (pt) => moment(pt.asr),
    },
    {
        prayer: Prayer.Asr,
        start: (pt) => moment(pt.asr),
        end: (pt) => moment(pt.maghrib),
    },
    {
        prayer: Prayer.Maghrib,
        start: (pt) => moment(pt.maghrib),
        end: (pt) => moment(pt.isha),
    },
    {
        prayer: Prayer.Isha,
        start: (pt) => moment(pt.isha),
        end: (pt) => {
            const sunnahTimes = new SunnahTimes(pt);
            return moment(sunnahTimes.middleOfTheNight);
        },
    },
];

export const getPrayerTimes = (position: GeoCoordinates, date: Date): Array<Prayer> => {
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
        console.log(`Calcuating prayer times for ${date.toLocaleDateString()}`)
        const prayerTimes = new PrayerTimes(coordinates, date, params);
        return PrayerTimeConfigs.map(config => ({
            name: config.prayer,
            start: config.start(prayerTimes).unix(),
            end: config.end(prayerTimes).unix(),
            isCurrent: prayerTimes.currentPrayer() === config.prayer,
        }));
    } catch (err) {
        return [];
    }
}

export default getPrayerTimes;
