/*
* @flow
*/
import type { Language } from "./types";
import type { Slide } from "@src/types";

import slides from "@resources/slides.json"


export class SlideLoader {
    async load(count: number, language: Language): Promise<Array<Slide>> {
        throw Error(".load() should be overridden")
    }
}

export class StaticSlideLoader extends SlideLoader {
    async load(count: number, language: Language): Promise<Array<Slide>> {
        const chunkSize = 10;
        let result = []
        slides.map((s, i) => {
            if (i % chunkSize === 0) {
                result.push({type: "current-prayer"})
                result.push({type: "next-prayer"})
            }
            result.push(s)
        })
        return result
    }
}


export class LocalBackendSlideLoader extends SlideLoader {
    backendUrl: string

    constructor(backendUrl: string) {
        super()
        this.backendUrl = backendUrl
    }

    async load(count: number, language: Language): Promise<Array<Slide>> {
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
