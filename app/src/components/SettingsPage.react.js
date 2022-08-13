/*
 * @flow
 */
import type { Setting, SettingConfig } from "@src/Setting";

import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { connect } from "react-redux";

import { patchSetting } from "@redux/slices/configSlice";
import infoIcon from "@resources/images/icons/info-circle-solid.svg";
import { SettingsManager } from "@src/SettingsManager";

const Main = styled.section`
  display: grid;
  grid-template-rows: auto;

  & > h1 {
    font-weight: 800;
    font-size: 1.8rem;
    border-bottom: white solid 2px;
  }
`;

const Section = styled.div`
  padding-bottom: 16px;
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  justify-content: center;
  padding: 0.4rem;
  height: 2rem;

  & > span {
    font-weight: 800;
    padding: 4px 0;
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  top: 4px;
  position: relative;
  padding: 0 8px;
  color: white;

  /* change the color of the icon
  * Filter options generated using this codepen: https://codepen.io/sosuke/pen/Pjoqqp
  * See: https://stackoverflow.com/questions/22252472/how-to-change-the-color-of-an-svg-element
  */
  filter: invert(91%) sepia(100%) saturate(2%) hue-rotate(88deg) brightness(109%) contrast(100%);
`;

export type SettingInput = $ReadOnly<{
  title: string,
  setting: string,
  help?: string,
  widget?: string, // not supported yet
  hidden?: (SettingsManager) => boolean,
  disabled?: (SettingsManager) => boolean,
  renderOption?: (string, string) => string,
}>;

export type SettingForm = $ReadOnly<{
  title: string,
  settings: Array<SettingInput>,
}>;

const CheckBox = (props) => {
  console.log(`[CheckBox] checked: ${props.checked} disabled: ${props.disabled}`);

  const onChange = (checked) => {
    console.log(`[CheckBox] changed: ${checked}`);
    props.onChange(checked);
  };

  return (
    <input
      type="checkbox"
      defaultChecked={props.checked}
      onChange={(event) => onChange(event.target.checked)}
      disabled={props.disabled}
    />
  );
};

const SettingWidget = (props): React$Node => {
  const { i18n } = useTranslation();
  const { name, type, options, value, disabled, renderOption, onChange } = props;

  const save = (value) => {
    // console.debug(`[Setting] setting '${name}' changed to: ${value}`)
    onChange(value);
  };

  const onInputChanged = (e) => {
    e.preventDefault();
    save(e.target.value);
  };

  const key = `setting-widget__${name}`;
  if (options) {
    return (
      <select key={key} name={options.name} onChange={(e) => save(e.target.value)} disabled={disabled}>
        {options.options.map((opt) => {
          return (
            <option key={`option-${opt}`} value={opt} selected={value === opt ? "selected" : ""}>
              {renderOption ? renderOption(opt, props.locale) : i18n.t(opt)}
            </option>
          );
        })}
      </select>
    );
  } else if (type === "boolean") {
    return <CheckBox checked={value} disabled={disabled} onChange={save} />;
  } else if (["int", "float"].includes(type)) {
    const step = type === "float" ? 0.1 : 1;
    return (
      <input type="number" disabled={disabled} value={value} onChange={onInputChanged} step={props.step || step} />
    );
  }

  return <input name={name} key={key} type="text" />;
};

export type ComponentProps = $ReadOnly<{
  title: string,
  forms: Array<SettingForm>,
}>;

export type StateProps = $ReadOnly<{
  backendURL: string,
  settings: Array<SettingConfig>,
}>;

export type Props = ComponentProps & StateProps;

const mapStateToProps = (state) => ({
  backendURL: state.user.backendURL,
  settings: state.config.settings,
  locale: state.config.general.locale,
});

const SettingsPage = (props: Props): React$Node => {
  const forms = props.forms || [];
  if (!props.settings || !props.settings.length) return null;
  const sm = SettingsManager.fromConfigs(props.settings);

  const onSettingChanged = (setting, newValue) => {
    setting.value = newValue;
    props.dispatch(patchSetting(props.backendURL, setting));
  };

  return (
    <Main>
      <h1>{props.title}</h1>

      {forms.map((sf, idx) => {
        // console.log(`>>> ${sf.title}`)
        return (
          <Section key={`setting-formset-${idx}`}>
            <h2>{sf.title}</h2>
            {sf.settings.map((si, i) => {
              const setting = sm.getSettingByName(si.setting);
              // console.log(`  [${sf.title}] > ${si.setting} -> ${setting?.name}`)

              if (!!si.hidden && si.hidden(sm)) {
                return null;
              }

              return (
                <Form key={`setting-${i}`}>
                  <span>
                    <label>{si.title}</label>
                    {si.help ? <Icon src={infoIcon} title={si.help} /> : null}
                  </span>

                  <SettingWidget
                    key={`widget-${i}`}
                    value={setting.value}
                    name={setting.name}
                    type={setting.type}
                    options={setting.options}
                    renderOption={si.renderOption}
                    widget={si.widget}
                    disabled={!!si.disabled ? si.disabled(sm) : false}
                    onChange={(value) => onSettingChanged(setting, value)}
                    locale={props.locale}
                  />
                </Form>
              );
            })}
          </Section>
        );
      })}
    </Main>
  );
};

export default (connect(mapStateToProps)(SettingsPage): any);
