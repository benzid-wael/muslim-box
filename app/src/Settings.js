/*
* @flow
*/


type SettingType =
  | "boolean"
  | "int"
  | "string"
  | "enum";


type SettingOption = $ReadOnly<{
  label: string,
  value: string,
}>;

type SettingOptions = $ReadOnly<{
  name: string,
  options: Array<SettingOption>,
}>;

const capitalize = ([first, ...rest], lowerRest = false) =>
  first.toUpperCase() + (lowerRest ? rest.join('').toLowerCase() : rest.join(''));

const validateEnum = (v: string, f: Setting): any => {
  if(!f.options) throw new Error(`Enum should defines options`);
  const option = f?.options?.options.filter(opt => opt.value === v);
  if(!option.length) throw new Error(`invalid option '${v} for ${f.toString()} setting`);
  return option[0].value;
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
  #options: ?SettingOptions;

  constructor(
    name: string,
    type: SettingType,
    value?: any,
    defaultValue?: any,
    options?: SettingOptions,
  ) {
    this.#name = name;
    this.#type = type;
    this.#value = value;
    this.#default = defaultValue;
    this.#options = options;
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

  /* Factory methods */
  static boolean(name: string, defaultValue?: any): Setting {
    return new Setting(name, "boolean", undefined, defaultValue, undefined);
  }

  static int(name: string, defaultValue?: any): Setting {
    return new Setting(name, "int", undefined, defaultValue, undefined);
  }

  static string(name: string, defaultValue?: any): Setting {
    return new Setting(name, "string", undefined, defaultValue, undefined);
  }

  static enum(name: string, options: SettingOptions, defaultValue?: any): Setting {
    return new Setting(name, "string", undefined, defaultValue, options);
  }
}
