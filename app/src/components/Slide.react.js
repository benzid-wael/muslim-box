/*
 * @flow
 */
import type { LayoutDirection } from "@src/types";

import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Main = styled.div`
  display: table;
  position: relative;
  width: calc(100% - 80px);
  height: 100%;
  margin: 0 40px;
`;

const Title = styled.h1`
  font-weight: 800;
  font-size: 16px;
  font-size: 3vw;
`;

const Inner = styled.div`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  font-size: 3vw;
`;

type Props = $ReadOnly<{
  title?: string,
  titleKey?: string,
  text?: string,
  content?: React$Node,
  className?: string,
  onClick?: () => void,
}>;

const Slide = (props: Props): React$Node => {
  const { i18n } = useTranslation();

  const content = props.text ? <span>{props.text}</span> : props.content;

  return (
    <Main className={props.className ? props.className : ""} onClick={props.onClick}>
      <Inner>
        <Title>{props.title || i18n.t(props.titleKey)}</Title>
        {content}
      </Inner>
    </Main>
  );
};

export default Slide;
