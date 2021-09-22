// Messages
module.exports.ESLINT_PRETTIER_SUCCESS_MSG =
  "eslint and prettier with airbnb style guide has successfully been integrated";
module.exports.PRETTIER_SUCCESS_MSG = "prettier has been insatlled";
module.exports.ESLINT_SUCCESS_MSG = "eslint has been successfully installed";
module.exports.COMMITZEN_SUCCESS_MSG =
  "commitzena and commit lint have been successfully integrated";
module.exports.ESLINT_PRETTIER__REACT_MODULE =
  "React: Eslint and Prettier with Airbnb style guide";
module.exports.ESLINT_PRETTIER__NODE_MODULE =
  "Node: Eslint and Prettier with Airbnb style guide";
module.exports.COMMITLINT_MODULE = "Commitzen & Commitlint";
module.exports.HUSKY_MODULE = "Husky";
module.exports.STANDARD_VERSION_MODULE = "Standard Version";

// Shell Commands
module.exports.ESLINT_INSTALLATION_CMD =
  "npm i eslint eslint-config-airbnb  --save-dev";
module.exports.PRETTIER_INSTALLATION_CMD =
  "npm i eslint eslint-config-airbnb  --save-dev";
module.exports.HUSKY_INSTALL_CMD = "npm run prepare";
module.exports.COMMITZEN_CMD =
  "npm install --save-dev commitizen cz-conventional-changelog @commitlint/config-conventional @commitlint/cli";
module.exports.HUSKY_CMD = "npm install husky lint-staged --save-dev";
module.exports.HUSKY_CMD_PRE_COMMIT =
  'npx husky add .husky/pre-commit "npm run pre-commit"';
module.exports.HUSKY_CMD_COMMIT_MESSAGE =
  'npx husky add .husky/commit-msg "./node_modules/.bin/commitlint -e"';
module.exports.HUSKY_CMD_PREPARE_COMMIT_MSG =
  'npx husky add .husky/prepare-commit-msg "exec < /dev/tty && git cz --hook || true"';
module.exports.SET_SCRIPT_PREPARE = {
  label: "prepare",
  command: "husky install",
};
module.exports.SET_SCRIPT_ESLINT_FIX = {
  label: "lint:fix",
  command: "eslint --fix src/**/*.js",
};
module.exports.SET_SCRIPT_ESLINT = {
  label: "lint",
  command: "eslint src/**/*.js",
};
module.exports.SET_SCRIPT_COMMIT = { label: "commit", command: "cz" };
module.exports.SET_SCRIPT_LINTSTAGE = {
  label: "pre-commit",
  command: "lint-staged",
};
