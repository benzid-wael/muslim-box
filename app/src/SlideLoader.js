/*
* @flow
*/
import type { Language, Slide } from "@src/types";

import _ from "lodash";

import SLIDER from "@constants/slider";
import slides from "@resources/slides.json";

export class SlideLoader {
    async _load(count: number, language: Language): Promise<Array<Slide>> {
        throw Error("._load() should be overridden")
    }

    async load(count: number, language: Language): Promise<Array<Slide>> {
        const loadedSlides = await this._load(count, language)
        let result = []

        console.log(`[SlideLoader] loaded ${loadedSlides.length} slides`)
        // insert prayer reminder slides
        loadedSlides.map((s, i) => {
            if (i % SLIDER.PrayerReminderEveryNSlides === 0) {
                result.push({type: "current-prayer"})
                result.push({type: "next-prayer"})
            }
            result.push(s)
        })

        return _.flatten(_.times(SLIDER.PageRepeatRatioNOutOfOne, _.constant(result)))
    }
}

export class StaticSlideLoader extends SlideLoader {
    async _load(count: number, language: Language): Promise<Array<Slide>> {
        return slides
    }
}


export class LocalBackendSlideLoader extends SlideLoader {
    backendUrl: string

    constructor(backendUrl: string) {
        super()
        this.backendUrl = backendUrl
    }

    async _load(count: number, language: Language): Promise<Array<Slide>> {
        const query = `query GetRandomSlides($count: Int!, $language: String!) {
            getRandomSlides(count: $count, language: $language) {
                id
                type
                content
                note
                meta
            }
        }`
        const response = await fetch(this.backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                query,
                variables: {
                    count: count,
                    language: language
                }
            })
        })
        const result = await response.json()
        return result["data"]["getRandomSlides"]
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
