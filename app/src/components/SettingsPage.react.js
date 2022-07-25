/*
* @flow
*/
import type { Setting } from "../Setting";

import React, { useEffect, useState } from "react";

import styled from "styled-components";

const Main = styled.section`
  display: grid;
  grid-template-rows: auto;

  & > h1 {
    font-weight: 800;
    font-size: 1.8rem;
    border-bottom: white solid 2px;
  }
`

export type SettingInput = $ReadOnly<{
  title: string,
  setting: Setting,
  widget?: string,
}>

export type SettingForm = $ReadOnly<{
  title: string,
  settings: Array<SettingInput>,
}>

export type Props = $ReadOnly<{
  title: string,
  forms: Array<SettingForm>,
}>

const SettingsPage = (props: Props): React$Node => {
  const forms = props.forms || [];

  return <Main>
    <h1>{props.title}</h1>

    {forms.map(sf => {
      return <div>
        <h2>{ sf.title }</h2>
      </div>
    })}
  </Main>
}

export default SettingsPage;
