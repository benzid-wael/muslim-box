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
        return slides
    }
}

export class SlideLoaderFactory {
    static getLoader(): SlideLoader {
        return new StaticSlideLoader();
    }
}
