/*
 * @flow
 */

import type { SettingConfig } from "@src/Setting";

import { Setting } from "./Setting";
import { createHttpClient } from "@src/http";

const runQuery = async <T>(
  backendUrl: string,
  query: string,
  variables?: any
): Promise<$ReadOnly<{ [key: string]: T }>> => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  const http = createHttpClient();
  const data = { query, variables: variables };
  const response = await http.post(backendUrl, data, config);
  return response.data["data"];
};

const parse = (cfg): SettingConfig => {
  let options = null;
  try {
    options = JSON.parse(cfg.options);
  } catch (err) {
    console.error(`[Setting] cannot parse options: ${cfg.options}`);
    return null;
  }

  return {
    ...cfg,
    options: options,
  };
};

export const updateSettingValue = async (backendUrl: string, setting: Setting): Promise<SettingConfig> => {
  const query = `
    mutation UpdateSetting($name: String!, $value: String!) {
      updateSetting(name: $name, value: $value) {
        name
        category
        type
        value
        default
        options
      }
    }
  `;
  const variables = {
    name: setting.name,
    value: setting.serializedValue,
  };
  const response = await runQuery<any>(backendUrl, query, variables);

  return parse(response["updateSetting"]);
};

export const loadConfigs = async (backendUrl: string): Promise<Array<SettingConfig>> => {
  const query = `
    {
      settings {
        name,
        category,
        type,
        value,
        default,
        options,
      }
    }
  `;
  const response = await runQuery<Array<any>>(backendUrl, query);

  return response["settings"].map((cfg) => parse(cfg));
};
