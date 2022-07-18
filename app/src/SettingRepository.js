/*
* @flow
*/

import type { SettingConfig } from "@src/Setting"

import http from "@src/http";


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
  `
  const data = { query }
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }
  }
  const response = await http.post(backendUrl, data, config)
  return response.data["data"]["settings"].map(
    cfg => {
      let options = null
      try {
        options = JSON.parse(cfg.options)
      } catch (err) {
        console.error(`[Setting] cannot parse options: ${cfg.options}`)
      }

      return {
        ...cfg,
        options: options,
      }
    }
  )
}
