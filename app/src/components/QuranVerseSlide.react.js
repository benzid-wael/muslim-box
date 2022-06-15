/*
* @flow
*/
import type { Language, LayoutDirection, QuranVerseSlide } from "@src/types";

import React from "react"
import { connect } from "react-redux"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import Ayah from "@components/Ayah.react"

const Main = styled.div`
  display: table;
  position: relative;
  width: calc(100% - 80px);
  height: 100%;
  margin: 0 40px;
  direction: ${props => props.direction}
`

const Title = styled.h1`
  font-weight: 800;
  font-size: 12px;
  font-size: 3vw;
`

const Inner = styled.div`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  font-size: 3vw;
`

type StateProps = $ReadOnly<{
  language: Language,
  direction: LayoutDirection,
}>

type ComponentProps = $ReadOnly<{
  slide: QuranVerseSlide,
  direction: LayoutDirection,
}>

type Props = StateProps & ComponentProps;

const mapStateToProps = (state): StateProps => ({
    language: state.config.present.general.language,
    direction: state.config.present.general.direction,
})

const Slide = (props: Props): React$Node => {
  const { i18n } = useTranslation();
  const index = props.slide.reference
    ?
    props.slide.reference.index || props.slide.reference.indexes[0]
    :
    null;
  return <Main className="Quran" direction={props.direction}>
    <Inner>
      <Title>{i18n.t("Verse of the day")}</Title>
      {props.slide.content.map((verse, i) => {
          return <Ayah
              language={props.language}
              verse={verse}
              verseId={index ? index + i : undefined}
          />
      })}
    </Inner>
  </Main>
}

export default (connect(mapStateToProps)(Slide): any)
