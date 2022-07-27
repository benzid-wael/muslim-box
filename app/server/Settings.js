const validateEnum = (v, f) => {
  if(!f.options) throw new Error(`Enum ${f.name} doesn't define options`);
  const option = f?.options?.options.filter(opt => opt === v);
  if(!option.length) throw new Error(`invalid option '${v} for ${f.toString()} setting`);
  return option[0];
}

const isString = (v, f) => typeof v === 'string' || v instanceof String

const VALIDATORS = {
  "boolean": [
    (v, f) => {
      return ["true", "false"].includes(v.toLowerCase());
    }
  ],
  "int": [
    (v, f) => /^\d+$/.test(v),
  ],
  "string": [
    (v, f) => true
  ],
  "enum": [
    validateEnum,
  ]
}

const validate = (setting, value) => {
  if (setting.type in VALIDATORS) {
    if(!isString(value)) {
      throw new Error(`[ValidationError] invalid string: ${value}`)
    }

    VALIDATORS[setting.type].forEach((predicate, idx) => {
      if(!predicate(value, setting)) {
        throw new Error(`ValidationError: invalid value: ${value} (code: ${setting.type}:P${idx})`)
      }
    })

    return true;
  }

  throw new Error(`ValidationError: uknown type: ${setting?.type}`)
}

module.exports = {
  validate,
}
