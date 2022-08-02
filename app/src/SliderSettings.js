/*
 * @flow
 */
import type { Slide, SlideFilterOnReachEndStrategy } from "@src/types";
import type { SlideLoaderType } from "@src/SlideLoader";

import store from "@redux/store";

import SLIDER from "@constants/slider";
import { SettingsManager } from "@src/SettingsManager";

export class SliderSettings extends SettingsManager {
  get defaultProvider(): SlideLoaderType {
    return SLIDER.DefaultProvider;
  }

  get prayerReminderEveryNSlides(): number {
    return this.getValue("PrayerReminderEveryNSlides", "", SLIDER.PrayerReminderEveryNSlides);
  }

  get pageRepeatRatioNOutOfOne(): number {
    return this.getValue("PageRepeatRatioNOutOfOne", "", SLIDER.PageRepeatRatioNOutOfOne);
  }

  get animation(): boolean {
    return this.getValue("EnableAnimation", "", SLIDER.EnableAnimation);
  }

  get verseOftheDayAPI(): boolean {
    return this.getValue("EnableVerseOfTheDayAPI", "", SLIDER.EnableVerseOfTheDayAPI);
  }

  get onReachEndStrategy(): SlideFilterOnReachEndStrategy {
    return this.getValue("OnReachEndStrategy", "", SLIDER.OnReachEndStrategy);
  }

  get maxSlidesBeforeReset(): number {
    return this.getValue("MaxSlidesBeforeReset", "", SLIDER.MaxSlidesBeforeReset);
  }

  get pageSize(): number {
    return this.getValue("PageSize", "", SLIDER.PageSize);
  }

  get wordsPerMinute(): number {
    return this.getValue("WordsPerMinute", "", SLIDER.WordsPerMinute);
  }

  durationToReadInSeconds(content: string): number {
    const wordsCount = content.split(" ")?.length;
    const durationInSeconds = (wordsCount / this.wordsPerMinute) * 60 + 1;
    console.debug(`slide contains ${wordsCount} words, requires ${durationInSeconds}s`);
    return durationInSeconds;
  }

  slideDurationInSeconds(slide: Slide, extraSeconds?: number): number {
    let duration = this.getValue("DefaultSlidingDurationInSeconds", "", SLIDER.DefaultSlidingDurationInSeconds);
    switch (slide.type) {
      case "current-prayer":
      case "next-prayer":
        duration = this.getValue("PrayerReminderDurationInSeconds", "", SLIDER.PrayerReminderDurationInSeconds);
    }

    if (slide.content) {
      const durationInSeconds = this.durationToReadInSeconds(slide?.content);
      duration = slide.durationInSeconds || durationInSeconds;
    }

    const total = Math.max(
      duration,
      this.getValue("MinimumSlideDurationInSeconds", "", SLIDER.MinimumSlideDurationInSeconds)
    );
    return extraSeconds ? total + extraSeconds : total;
  }
}

const getDurationTimeToReadContent = (content: string, wordsPerMinute: number): number => {
  const wordsCount = content?.split(" ")?.length;
  const durationInSeconds = (wordsCount / wordsPerMinute) * 60 + 1;
  console.debug(`slide contains ${wordsCount} words, requires ${durationInSeconds}s`);
  return durationInSeconds;
};

export const getDurationInSeconds = (slide: Slide, extra?: number): number => {
  let duration = SLIDER.DefaultSlidingDurationInSeconds;
  switch (slide.type) {
    case "current-prayer":
    case "next-prayer":
      duration = SLIDER.PrayerReminderDurationInSeconds;
  }

  if (slide.content) {
    const durationInSeconds = getDurationTimeToReadContent(slide?.content, SLIDER.WordsPerMinute);
    duration = slide.durationInSeconds || durationInSeconds;
  }

  return Math.max(duration, SLIDER.MinimumSlideDurationInSeconds) + (extra || 0);
};
