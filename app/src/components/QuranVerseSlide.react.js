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
  direction: LayoutDirection,
}>

type ComponentProps = $ReadOnly<{
  slide: QuranVerseSlide,
  direction: LayoutDirection,
}>

type Props = StateProps & ComponentProps;

const mapStateToProps = (state): StateProps => ({
    direction: state.config.present.general.direction,
})

const Slide = (props: Props): React$Node => {
  const { i18n } = useTranslation();
  const index = props.slide.reference
    ?
    props.slide.reference.index || props.slide.reference.indexes[0]
    :
    null;
  const { surah, number, sajda } = JSON.parse(props.slide.note)

  return <Main className="Quran" direction={props.direction}>
    <Inner>
      <Title>{i18n.t("Verse of the day")}</Title>
      <Ayah
        verse={props.slide.content}
        surah={surah}
        verseNumber={number}
        isSajda={sajda}
      />
    </Inner>
  </Main>
}

export default (connect(mapStateToProps)(Slide): any)
