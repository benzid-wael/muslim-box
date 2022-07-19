/*
* @flow
*/
import { capitalize } from "@src/utils"

export type SettingType =
  | "boolean"
  | "int"
  | "string"
  | "enum";

export type SettingOptions = $ReadOnly<{
  name: string,
  options: Array<string>,
}>;

export type SettingConfig = $ReadOnly<{
  name: string,
  category?: string,
  type: SettingType,
  value: ?string,
  default: ?string,
  options: ?SettingOptions,
}>

const validateEnum = (v: string, f: Setting): any => {
  if(!f.options) throw new Error(`Enum should defines options`);
  const option = f?.options?.options.filter(opt => opt === v);
  if(!option.length) throw new Error(`invalid option '${v} for ${f.toString()} setting`);
  return option[0];
}

const SETTING_OPERATORS = {
  "boolean": {
    serialize: (v: any, f: Setting): string => {
      if (v === true || v === false) {
        return v ? "true" : "false";
      }
      return ["true", "t", "1"].includes(v.toString().toLowerCase()) ? "true" : "false";
    },
    deserialize: (v: any, f: Setting): any => v === "true" ? true : false,
  },
  "int": {
    serialize: (v: any, f: Setting): string => v.toString(),
    deserialize: (v: any, f: Setting): any => parseInt(v),
  },
  "string": {
    serialize: (v: any, f: Setting): string => v,
    deserialize: (v: any, f: Setting): any => v,
  },
  "enum": {
    serialize: validateEnum,
    deserialize: validateEnum,
  }
}

export class Setting {
  #name: string;
  #type: SettingType;
  #value: ?string;
  #default: any;
  #category: ?string;
  #options: ?SettingOptions;

  constructor(
    name: string,
    type: SettingType,
    defaultValue?: any,
    options?: SettingOptions,
  ) {
    this.#name = name;
    this.#type = type;
    this.#default = defaultValue;
    this.#options = options;
    this.#value = null;
    this.#category = null;
  }

  toString(): string {
    return `<${capitalize(this.#type)}Setting default: ${this.#default}>`
  }

  /* Getters & Setters */
  get name(): string {
    return this.#name;
  }

  get options(): ?SettingOptions {
    return this.#options;
  }

  get value(): any {
    const value = this.#value != null ? this.#value : this.#default

    if (this.#type in SETTING_OPERATORS) {
      return SETTING_OPERATORS[this.#type].deserialize(value, this);
    }
    throw new Error(`unsupported type: ${this.#type}`);
  }

  set value(val?: any): void {
    if(val == null) {
      this.#value = val;
    } else if (this.#type in SETTING_OPERATORS) {
      this.#value = SETTING_OPERATORS[this.#type].serialize(val, this);
    } else {
      throw new Error(`unsupported type: ${this.#type}`);
    }
  }

  setValue(val: any): Setting {
    this.value = val
    return this
  }

  get category(): ?string {
    return this.#category
  }

  setCategory(val: any): Setting {
    this.#category = val
    return this
  }

  /* Factory methods */
  static build(name: string, type: SettingType, defaultValue?: any, options?: SettingOptions) {
    return new Setting(name, type, defaultValue, options)
  }

  static fromConfig(config: SettingConfig): Setting {
    // $FlowFixMe[incompatible-call]
    const options: ?SettingOptions = config.options == null ? JSON.parse(config.options) : undefined
    // $FlowFixMe[incompatible-call]
    return Setting.build(config.name, config.type, config.default, options)
      .setValue(config.value)
      .setCategory(config.category)
  }

  static boolean(name: string, defaultValue?: any): Setting {
    return Setting.build(name, "boolean", defaultValue)
  }

  static int(name: string, defaultValue?: any): Setting {
    return Setting.build(name, "int", defaultValue)
  }

  static string(name: string, defaultValue?: any): Setting {
    return Setting.build(name, "string", defaultValue)
  }

  static enum(name: string, options: SettingOptions, defaultValue?: any): Setting {
    return Setting.build(name, "enum", defaultValue, options)
  }
}
