/*
* @flow
*/
import type { Setting, SettingConfig } from "@src/Setting";

import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { connect } from "react-redux";

import { patchSetting } from "@redux/slices/configSlice"
import infoIcon from "@resources/icons/info.svg";


const Main = styled.section`
  display: grid;
  grid-template-rows: auto;

  & > h1 {
    font-weight: 800;
    font-size: 1.8rem;
    border-bottom: white solid 2px;
  }
`

const Section = styled.div`
  padding-bottom: 16px;
`

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  justify-content: center;
  padding: .4rem;
  height: 2rem;

  & > span {
    font-weight: 800;
    padding: 4px 0;
  }
`

const Icon = styled.img`
  width: 16px;
  height: 16px;
  padding: 8px;
  color: white;

  /* change the color of the icon
  * Filter options generated using this codepen: https://codepen.io/sosuke/pen/Pjoqqp
  * See: https://stackoverflow.com/questions/22252472/how-to-change-the-color-of-an-svg-element
  */
  filter: invert(88%) sepia(4%) saturate(22%) hue-rotate(353deg) brightness(94%) contrast(92%);
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


const SettingWidget = (props): React$Node => {
  const { i18n } = useTranslation();
  const { setting, widget, onChange } = props;

  const save = (value) => {
    console.debug(`[Setting] setting '${setting.name}' changed to: ${value}`)
    onChange(value)
  }

  const key = `setting-widget__${setting?.title}`
  if (setting?.options) {
    return <select key={key} name={setting.options.name}
      onChange={(e) => save(e.target.value)}
    >
      {setting.options.options.map(opt => {
        return <option key={`option-${opt}`}
          value={opt}
          selected={setting.value === opt ? "selected" : ""}
        >
          { i18n.t(opt) }
        </option>
      })}
    </select>
  }

  return <input key={key} type="text" />
}

export type ComponentProps = $ReadOnly<{
  title: string,
  forms: Array<SettingForm>,
}>

export type StateProps = $ReadOnly<{
  backendURL: string,
  settings: Array<SettingConfig>,
}>

export type Props = ComponentProps & StateProps;

const mapStateToProps = state => ({
  backendURL: state.user.backendURL,
  settings: state.config.settings,
})

const SettingsPage = (props: Props): React$Node => {
  const forms = props.forms || [];

  const onSettingChanged = (setting, newValue) => {
    setting.value = newValue
    props.dispatch(patchSetting(props.backendURL, setting))
  }

  return <Main>
    <h1>{props.title}</h1>

    {forms.map((sf, idx) => {
      return <Section key={`setting-formset-${idx}`}>
        <h2>{ sf.title }</h2>
        {sf.settings.map((si, i) => {
          return <Form key={`setting-${i}`}>
            <span>
              <label>{si.title}</label>
              {si.help ? <Icon src={infoIcon} title={si.help} /> : null}
            </span>
            <SettingWidget
              key={`widget-${i}`}
              title={si.title}
              setting={si.setting}
              widget={si.widget}
              onChange={(value) => onSettingChanged(si.setting, value)}
            />
          </Form>
        })}
      </Section>
    })}
  </Main>
}

export default (connect(mapStateToProps)(SettingsPage): any)
