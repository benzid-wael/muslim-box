/*
 * @flow
 */
import type { HadithSlide } from "@src/types";

import React from "react";
import Slide from "@components/Slide.react";

type ComponentProps = $ReadOnly<{
  slide: HadithSlide,
}>;

const HadithSlideComponent = (props: ComponentProps): React$Node => {
  return <Slide titleKey="Hadith of the day" text={props.slide.content} />;
};

export default HadithSlideComponent;
