/*
* @flow
*/
import type { Language, LayoutDirection, DhikrSlide } from "@src/types";

import React from "react"
import { connect } from "react-redux"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

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
  font-size: 16px;
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
  slide: DhikrSlide,
}>

type Props = StateProps & ComponentProps;

const mapStateToProps = (state): StateProps => ({
    direction: state.config.present.general.direction,
})

const Slide = (props: Props): React$Node => {
  const { i18n } = useTranslation();
  return <Main direction={props.direction}>
    <Inner>
      <Title>{props.slide.category || i18n.t("Remembrance of the day")}</Title>
      <span>{props.slide.content}</span>
    </Inner>
  </Main>
}

export default (connect(mapStateToProps)(Slide): any)
