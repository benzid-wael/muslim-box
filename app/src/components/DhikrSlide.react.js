/*
* @flow
*/
import type { DhikrSlide } from "@src/types";

import React from "react";
import Slide from "@components/Slide.react";

type ComponentProps = $ReadOnly<{
  slide: DhikrSlide,
}>

const DhikrSlideComponent = (props: ComponentProps): React$Node => {
  return <Slide
    title={props.slide.category}
    titleKey="Remembrance of the day"
    text={props.slide.content}
  />
}

export default DhikrSlideComponent
