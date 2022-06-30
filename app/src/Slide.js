/*
* @flow
*/
import type { Slide } from "@src/types";

import store from "@redux/store";

import SLIDER from "@constants/slider";

const getDurationTimeToReadContent = (content: string, wordsPerMinute: number): number => {
    const wordsCount = content?.split(" ")?.length
    const durationInSeconds = ((wordsCount / wordsPerMinute) * 60) + 2
    console.log(`slide contains ${wordsCount} words, requires ${durationInSeconds}s`)
    return durationInSeconds
}

export const getDurationInSeconds = (slide: Slide): number => {
    switch(slide.type) {
        case "current-prayer":
        case "next-prayer":
            return SLIDER.PrayerReminderDurationInSeconds
    }

    if (slide.content) {
        const durationInSeconds = getDurationTimeToReadContent(slide?.content, SLIDER.WordsPerMinute)
        return Math.max(slide.durationInSeconds || durationInSeconds, SLIDER.MinimumSlideDurationInSeconds)
    }

    return SLIDER.DefaultSlidingDurationInSeconds
}
