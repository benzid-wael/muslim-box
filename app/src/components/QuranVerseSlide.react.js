/*
 * @flow
 */
import type { QuranVerseSlide } from "@src/types";

import React from "react";
import Slide from "@components/Slide.react";
import Ayah from "@components/Ayah.react";

type ComponentProps = $ReadOnly<{
  slide: QuranVerseSlide,
}>;

const QuranSlideComponent = (props: ComponentProps): React$Node => {
  const index = props.slide.reference ? props.slide.reference.index || props.slide.reference.indexes[0] : null;
  const { surah, number, sajda } = JSON.parse(props.slide.note);

  if (!props.slide.content) return null;

  return (
    <Slide
      titleKey="Verse of the day"
      content={<Ayah verse={props.slide.content} surah={surah} verseNumber={number} isSajda={sajda} />}
    />
  );
};

export default QuranSlideComponent;
