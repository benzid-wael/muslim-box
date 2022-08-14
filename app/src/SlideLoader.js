/*
 * @flow
 */
import type { Language, Slide, SlideFilter } from "@src/types";
import type { SliderSettings } from "@src/SliderSettings";

import _ from "lodash";

import { createHttpClient } from "@src/http";
import Slides from "@resources/slides.json";
import type { SlideFilterQuery } from "./types";

export type SlideLoaderType = "static" | "database";

export class SlideLoader {
  settings: SliderSettings;

  constructor(settings: SliderSettings) {
    this.settings = settings;
  }

  injectDefaultSlides(slides: Array<Slide>): Array<Slide> {
    const result = [];
    const double = 2 * this.settings.prayerReminderEveryNSlides;

    _.flatten([
      ...slides,
      ..._.times(this.settings.pageRepeatRatioNOutOfOne, _.constant(slides.map((s) => ({ ...s, debug: "repeat" })))),
    ]).map((s, i) => {
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
  fields: Array<string> = ["id", "type", "category", "content", "note", "meta"];

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
    const pageSize = Math.floor(count / 4);
    const quranPageSize = count - 3 * pageSize;

    const randomVersesQuery = this.settings?.verseOftheDayAPI
      ? `versesOfTheDay(count: $verses, language: $language) {
        ${this.fields.join(", ")}
      }`
      : `random(count: $verses, language: $language, type: QURAN) {
        ${this.fields.join(", ")}
      }`;

    const query = `query random($verses: Int!, $count: Int!, $language: String!) {
      quran: ${randomVersesQuery}

      hadith: random(count: $count, language: $language, type: HADITH) {
        ${this.fields.join(", ")}
      }

      athar: random(count: $count, language: $language, type: ATHAR) {
        ${this.fields.join(", ")}
      }

      dhikr: random(count: $count, language: $language, type: DHIKR) {
        ${this.fields.join(", ")}
      }
    }
    `;

    const response = await this.fetch(query, language, { count: pageSize, verses: quranPageSize });
    return _.shuffle([
      ...response.data["data"]["quran"],
      ...response.data["data"]["hadith"],
      ...response.data["data"]["dhikr"],
      ...response.data["data"]["athar"],
    ]).map((s) => ({
      ...s,
      debug: "random",
    }));
  }

  async _search(filter: SlideFilter, language: Language): Promise<Array<Slide>> {
    const innerQueries = filter.queries.map((q) => {
      const include = !!q.include ? q.include.map((t) => `"${t}"`).join(",") : "";
      const exclude = !!q.exclude ? q.exclude.map((t) => `"${t}"`).join(",") : "";
      const operator = !!q.operator ? q.operator.toUpperCase() : "ANY";
      const orderBy = !!q.orderBy ? q.orderBy.toUpperCase() : "RANDOM";
      return `
        ${
          q.name
        }: search(include: [${include}], exclude: [${exclude}], operator: ${operator}, orderBy: ${orderBy}, language: "${language}") {
          ${this.fields.join(", ")}
        }
      `;
    });
    const query = `{
      ${innerQueries.join("\n\n")}
    }`;
    const response = await this.fetch(query, language, {});
    let result = [];
    filter.queries.forEach((q) => {
      let slides = response.data["data"][q.name].map((s) => ({
        ...s,
        debug: q.include.length === 1 ? `${q.name}:${q.include[0]}` : `${q.name}:${q.include[0]}, ${q.include[1]}...`,
      }));
      if (!!q.count) {
        slides = slides.slice(0, q.count);
      }
      result.push(...slides);
    });
    return result;
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
