const { defaults } = require("jest-config");

const config = {
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>setupTests.js"],
  moduleFileExtensions: ["js", "jsx"],
  moduleNameMapper: {
    "react-i18next": "<rootDir>/app/src/__mocks__/react-i18next.js",
  },
};

// module.exports = config;
// Or async function
module.exports = async () => {
  return {
    ...defaults,
    ...config,
  };
};
