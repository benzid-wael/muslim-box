/*
 * @flow
 */
import type { Language, LayoutDirection } from "@src/types";

import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const Main = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  background-size: 100% 100%;
  background-image: url("${(props) => props.backgroundImageUrl}");
  background-repeat: no-repeat;
`;

type StateProps = $ReadOnly<{
  mediaURL: string,
}>;

type ComponentProps = $ReadOnly<{}>;

type Props = StateProps & ComponentProps;

const mapStateToProps = (state): StateProps => ({
  mediaURL: state.user.mediaURL,
});

const Slide = (props: Props): React$Node => {
  if (!props.mediaURL) {
    return null;
  }
  console.log(`mediaURL: ${props.mediaURL}`);
  const backgroundImageUrl = new URL("public/001.jpg", props.mediaURL);
  console.log(`bg: ${backgroundImageUrl.toString()}`);
  return <Main backgroundImageUrl={backgroundImageUrl.toString()}></Main>;
};

export default (connect(mapStateToProps)(Slide): any);
