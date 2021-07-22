/*eslint-env node */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:json/recommended",
  ],
  plugins: ["@typescript-eslint", "eslint-plugin-tsdoc", "json"],
  env: {
    es2021: true,
    jest: true,
  },
  parserOptions: {
    requireConfigFile: false,
    tsconfigRootDir: path.join(__dirname, ".."),
  },
};
