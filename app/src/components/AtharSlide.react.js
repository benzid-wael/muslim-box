/*
 * @flow
 */
import type { AtharSlide } from "@src/types";

import React from "react";
import Slide from "@components/Slide.react";

type ComponentProps = $ReadOnly<{
  slide: AtharSlide,
}>;

const AtharSlideComponent = (props: ComponentProps): React$Node => {
  return <Slide titleKey="Forefathers' trail" title={props.slide.category} text={props.slide.content} />;
};

export default AtharSlideComponent;
