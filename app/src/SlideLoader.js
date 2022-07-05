/*
* @flow
*/
import type { Language, Slide, SlideFilter } from "@src/types";

import _ from "lodash";
import axios from "axios";
import axiosRetry from "axios-retry";

import SLIDER from "@constants/slider";
import Slides from "@resources/slides.json";


axiosRetry(axios, { retries: 5 });


export class SlideLoader {

  injectDefaultSlides(slides: Array<Slide>): Array<Slide> {
    let result = []
    // insert prayer reminder slides
    const double = 2 * SLIDER.PrayerReminderEveryNSlides
    slides.map((s, i) => {
      if (i % double === 0) {
        result.push({type: "current-prayer"})
      } else if (i % SLIDER.PrayerReminderEveryNSlides === 0) {
        result.push({type: "next-prayer"})
      }
      result.push(s)
    })

    return _.flatten(
      _.times(SLIDER.PageRepeatRatioNOutOfOne, _.constant(result))
    )

  }

  async _random(count: number, language: Language): Promise<Array<Slide>> {
    throw Error("._random() should be overridden")
  }

  async _search(filter: SlideFilter, language: Language): Promise<Array<Slide>> {
    throw Error("._search() should be overridden")
  }

  async search(filter: SlideFilter, language: Language): Promise<Array<Slide>> {
    const slides = await this._search(filter, language)
    console.log(`[SlideLoader] search query result: ${slides.length} slides`)
    return this.injectDefaultSlides(slides)
  }

  async random(count: number, language: Language): Promise<Array<Slide>> {
    const slides = await this._random(count, language)
    console.log(`[SlideLoader] random: ${slides.length} slides`)
    return this.injectDefaultSlides(slides)
  }
}

export class StaticSlideLoader extends SlideLoader {
  async _search(filter: SlideFilter, language: Language): Promise<Array<Slide>> {
    return []
  }

  async _random(count: number, language: Language): Promise<Array<Slide>> {
    return Slides
  }
}


export class LocalBackendSlideLoader extends SlideLoader {
  backendUrl: string

  constructor(backendUrl: string) {
    super()
    this.backendUrl = backendUrl
  }

  async fetch(query: string, language: Language, variables: any): Promise<any> {
    const data = {
      query,
      variables: {
        ...variables,
        language: language
      }
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    }
    const response = await axios.post(this.backendUrl, data, config)
    return response
  }

  async _random(count: number, language: Language): Promise<Array<Slide>> {
    const fields = ["id", "type", "category", "content", "note", "meta"]
    const pageSize = Math.floor(count / 4)
    const quranPageSize = count - (3 * pageSize)
    const query = `query random($verses: Int!, $count: Int!, $language: String!) {
      quran: versesOfTheDay(count: $verses, language: $language) {
        ${fields.join(', ')}
      }

      hadith: random(count: $count, language: $language, type: HADITH) {
        ${fields.join(', ')}
      }

      athar: random(count: $count, language: $language, type: ATHAR) {
        ${fields.join(', ')}
      }

      dhikr: random(count: $count, language: $language, type: DHIKR) {
        ${fields.join(', ')}
      }
    }
    `

    const response = await this.fetch(
      query,
      language,
      {count: pageSize, verses: quranPageSize},
    )
    return _.shuffle([
      ...response.data["data"]["quran"],
      ...response.data["data"]["hadith"],
      ...response.data["data"]["dhikr"],
      ...response.data["data"]["athar"],
    ])
  }

  async _search(filter: SlideFilter, language: Language): Promise<Array<Slide>> {
    return []
  }
}

type SlideLoaderFactoryOptions = $ReadOnly<{
  provider: "static" | "database",
  backendURL?: string
}>;

export class SlideLoaderFactory {
  static getLoader(options: SlideLoaderFactoryOptions): ?SlideLoader {
    switch(options.provider) {
      case "static":
        return new StaticSlideLoader()
      case "database":
        if (options.backendURL != null) {
          return new LocalBackendSlideLoader(options.backendURL)
        }
    }
  }
}
