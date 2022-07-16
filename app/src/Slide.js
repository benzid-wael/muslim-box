/*
* @flow
*/
import type { Slide } from "@src/types";

import store from "@redux/store";

import SLIDER from "@constants/slider";

const getDurationTimeToReadContent = (content: string, wordsPerMinute: number): number => {
    const wordsCount = content?.split(" ")?.length
    const durationInSeconds = ((wordsCount / wordsPerMinute) * 60) + 1
    console.debug(`slide contains ${wordsCount} words, requires ${durationInSeconds}s`)
    return durationInSeconds
}

export const getDurationInSeconds = (slide: Slide, extra?: number): number => {
    let duration = SLIDER.DefaultSlidingDurationInSeconds
    switch(slide.type) {
        case "current-prayer":
        case "next-prayer":
            duration = SLIDER.PrayerReminderDurationInSeconds
    }

    if (slide.content) {
        const durationInSeconds = getDurationTimeToReadContent(slide?.content, SLIDER.WordsPerMinute)
        duration = slide.durationInSeconds || durationInSeconds
    }

    return Math.max(duration, SLIDER.MinimumSlideDurationInSeconds) + (extra || 0)
}
