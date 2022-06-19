/*
* @flow
*/
import type { Slide } from "@src/types";

import slides from "@resources/slides.json"

export class SlideLoader {
    async load(): Promise<Array<Slide>> {
        throw Error(".load() should be overridden")
    }
}

export class StaticSlideLoader extends SlideLoader {
    async load(): Promise<Array<Slide>> {
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

export class SlideLoaderFactory {
    static getLoader(): SlideLoader {
        return new StaticSlideLoader();
    }
}
