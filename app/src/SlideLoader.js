/*
 * @flow
 */
import type { Language, Slide, SlideFilter } from "@src/types";
import type { SliderSettings } from "@src/SliderSettings";

import _ from "lodash";

import { createHttpClient } from "@src/http";
import Slides from "@resources/slides.json";

export type SlideLoaderType = "static" | "database";

export class SlideLoader {
  settings: SliderSettings;

  constructor(settings: SliderSettings) {
    this.settings = settings;
  }

  injectDefaultSlides(slides: Array<Slide>): Array<Slide> {
    const result = [];
    const double = 2 * this.settings.prayerReminderEveryNSlides;

    _.flatten(_.times(this.settings.pageRepeatRatioNOutOfOne, _.constant(slides))).map((s, i) => {
      if (i > 0 && i % double === 0) {
        result.push({ type: "current-prayer" });
      } else if (i > 0 && i % this.settings.prayerReminderEveryNSlides === 0) {
        result.push({ type: "next-prayer" });
      }
      result.push(s);
    });

    return result;
  }

  async _random(count: number, language: Language): Promise<Array<Slide>> {
    throw Error("._random() should be overridden");
  }

  async _search(filter: SlideFilter, language: Language): Promise<Array<Slide>> {
    throw Error("._search() should be overridden");
  }

  async search(filter: SlideFilter, language: Language): Promise<Array<Slide>> {
    const slides = await this._search(filter, language);
    console.log(`[SlideLoader] search query result: ${slides.length} slides`);
    return this.injectDefaultSlides(slides);
  }

  async random(count: number, language: Language): Promise<Array<Slide>> {
    const slides = await this._random(count, language);
    console.log(`[SlideLoader] random: ${slides.length} slides`);
    return this.injectDefaultSlides(slides);
  }
}

export class StaticSlideLoader extends SlideLoader {
  async _search(filter: SlideFilter, language: Language): Promise<Array<Slide>> {
    return [];
  }

  async _random(count: number, language: Language): Promise<Array<Slide>> {
    return Slides;
  }
}

export class LocalBackendSlideLoader extends SlideLoader {
  backendUrl: string;

  constructor(settings: SliderSettings, backendUrl: string) {
    super(settings);
    this.backendUrl = backendUrl;
  }

  async fetch(query: string, language: Language, variables: any): Promise<any> {
    const data = {
      query,
      variables: {
        ...variables,
        language: language,
      },
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    const http = createHttpClient();
    const response = await http.post(this.backendUrl, data, config);
    return response;
  }

  async _random(count: number, language: Language): Promise<Array<Slide>> {
    const fields = ["id", "type", "category", "content", "note", "meta"];
    const pageSize = Math.floor(count / 4);
    const quranPageSize = count - 3 * pageSize;

    const randomVersesQuery = this.settings?.verseOftheDayAPI
      ? `versesOfTheDay(count: $verses, language: $language) {
        ${fields.join(", ")}
      }`
      : `random(count: $verses, language: $language, type: QURAN) {
        ${fields.join(", ")}
      }`;

    const query = `query random($verses: Int!, $count: Int!, $language: String!) {
      quran: ${randomVersesQuery}

      hadith: random(count: $count, language: $language, type: HADITH) {
        ${fields.join(", ")}
      }

      athar: random(count: $count, language: $language, type: ATHAR) {
        ${fields.join(", ")}
      }

      dhikr: random(count: $count, language: $language, type: DHIKR) {
        ${fields.join(", ")}
      }
    }
    `;

    const response = await this.fetch(query, language, { count: pageSize, verses: quranPageSize });
    return _.shuffle([
      ...response.data["data"]["quran"],
      ...response.data["data"]["hadith"],
      ...response.data["data"]["dhikr"],
      ...response.data["data"]["athar"],
    ]);
  }

  async _search(filter: SlideFilter, language: Language): Promise<Array<Slide>> {
    return [];
  }
}

type SlideLoaderFactoryOptions = $ReadOnly<{
  settings: SliderSettings,
  backendURL?: string,
}>;

export class SlideLoaderFactory {
  static getLoader(options: SlideLoaderFactoryOptions): ?SlideLoader {
    const provider = options.settings.defaultProvider;

    switch (provider) {
      case "database":
        if (options.backendURL != null) {
          return new LocalBackendSlideLoader(options.settings, options.backendURL);
        }
      case "static":
        // this is should be used only for testing
        return new StaticSlideLoader(options.settings);
    }
  }
}
