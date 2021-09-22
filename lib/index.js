const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const { Spinner } = require("cli-spinner");
const spawn = require("child_process").spawnSync;
const { exit } = require("process");
const reactEslintConfig = require("../eslint/reactConfig.json");
const nodeEslintConfig = require("../eslint/nodeConfig.json");
const commitzenConfig = require("../commitzen/config.json");
const lintStageHuskyConfig = require("../husky/lintStage.config.json");
const {
  COMMITLINT_MODULE,
  HUSKY_MODULE,
  STANDARD_VERSION_MODULE,
  ESLINT_INSTALLATION_CMD,
  PRETTIER_INSTALLATION_CMD,
  ESLINT_PRETTIER__REACT_MODULE,
  ESLINT_PRETTIER__NODE_MODULE,
  COMMITZEN_CMD,
  HUSKY_CMD,
  HUSKY_INSTALL_CMD,
  SET_SCRIPT_ESLINT,
  SET_SCRIPT_ESLINT_FIX,
  SET_SCRIPT_COMMIT,
  SET_SCRIPT_PREPARE,
  SET_SCRIPT_LINTSTAGE,
  HUSKY_CMD_COMMIT_MESSAGE,
  HUSKY_CMD_PRE_COMMIT,
  HUSKY_CMD_PREPARE_COMMIT_MSG,
} = require("../constants");

const spinner = new Spinner("Installing.. %s");
spinner.setSpinnerString("|/-\\");

const runCommand = (command) => {
  spinner.start();
  const out = spawn(command, { shell: true });
  if (out.stdout) process.stdout.write(chalk.green(out.stdout.toString()));
  if (out.stderr) process.stdout.write(chalk.red(out.stderr.toString()));
  spinner.stop();
};

process.on("SIGTERM", () => {
  exit();
});

function moduleSuccessfullyInstalled() {
  process.stdout.write(chalk.cyan("\n----Installation Complete----\n"));
  process.stdout.write(
    chalk.green(
      "Some new config files may have been created. Do not forget to commit in to your repo."
    )
  );
  exit();
}

function appendScriptInPackageJson({ label, command }) {
  const packageJson = fs.readFileSync(path.resolve("./package.json"), "utf8");
  const packageJsonObj = JSON.parse(packageJson);
  packageJsonObj.scripts[label] = command;
  fs.writeFileSync(
    path.resolve("./package.json"),
    JSON.stringify(packageJsonObj, null, 2),
    moduleSuccessfullyInstalled
  );
}

function checkForExistingEslintConfig() {
  if (
    fs.existsSync(".eslintrc") ||
    fs.existsSync(".eslintrc.json") ||
    fs.existsSync(".eslintrc.js")
  ) {
    process.stdout.write(
      chalk.red(
        `\nFound eslint configuration! Did not overwrite that. \nIf you need new configuration of this module. Delete your eslint config file and run the installation again for eslint`
      )
    );
    exit();
  }
}

function installEslintAndPrettierReactConfig() {
  runCommand(ESLINT_INSTALLATION_CMD);
  runCommand(PRETTIER_INSTALLATION_CMD);
  appendScriptInPackageJson(SET_SCRIPT_ESLINT);
  appendScriptInPackageJson(SET_SCRIPT_ESLINT_FIX);
  checkForExistingEslintConfig();

  fs.writeFile(
    ".eslintrc.json",
    JSON.stringify(reactEslintConfig, null, 2),
    moduleSuccessfullyInstalled
  );
}

function installEslintAndPrettierNodeConfig() {
  runCommand(ESLINT_INSTALLATION_CMD);
  runCommand(PRETTIER_INSTALLATION_CMD);
  appendScriptInPackageJson(SET_SCRIPT_ESLINT);
  appendScriptInPackageJson(SET_SCRIPT_ESLINT_FIX);
  checkForExistingEslintConfig();

  fs.writeFile(
    ".eslintrc.json",
    JSON.stringify(nodeEslintConfig, null, 2),
    moduleSuccessfullyInstalled
  );
}

function installCommitlintConfig() {
  runCommand(COMMITZEN_CMD);
  appendScriptInPackageJson(SET_SCRIPT_COMMIT);

  fs.writeFile(
    ".czrc",
    JSON.stringify(commitzenConfig, null, 2),
    moduleSuccessfullyInstalled
  );
  const data = fs.readFileSync(
    path.resolve(__dirname, "../commitlint/config.js"),
    "utf8"
  );
  fs.writeFile("commitlint.config.js", data, moduleSuccessfullyInstalled);
}

function installHuskyConfig() {
  if (!fs.existsSync(path.dirname(".git"))) {
    process.stdout.write(
      chalk.red(
        "Git is not initialized in this repo! Could not able to install husky"
      )
    );
    exit();
  }

  runCommand(HUSKY_CMD);
  appendScriptInPackageJson(SET_SCRIPT_PREPARE);
  runCommand(HUSKY_INSTALL_CMD);
  runCommand(HUSKY_CMD_PRE_COMMIT);
  runCommand(HUSKY_CMD_COMMIT_MESSAGE);
  runCommand(HUSKY_CMD_PREPARE_COMMIT_MSG);
  appendScriptInPackageJson(SET_SCRIPT_LINTSTAGE);

  fs.writeFile(
    ".lintstagedrc.json",
    JSON.stringify(lintStageHuskyConfig, null, 2),
    moduleSuccessfullyInstalled
  );
}

function installIndividualApplication(app) {
  switch (app) {
    case ESLINT_PRETTIER__REACT_MODULE:
      installEslintAndPrettierReactConfig();
      return;
    case ESLINT_PRETTIER__NODE_MODULE:
      installEslintAndPrettierNodeConfig();
      return;
    case COMMITLINT_MODULE:
      installCommitlintConfig();
      return;
    case HUSKY_MODULE:
      installHuskyConfig();
      return;
    default:
      exit();
  }
}

function installSelectedItem(items) {
  const { modules } = items;
  modules.forEach((itm) => {
    installIndividualApplication(itm);
  });
}

function askInitialQuestion() {
  inquirer
    .prompt([
      {
        type: "checkbox",
        message: "Select module(s) you want to install",
        name: "modules",
        choices: [
          ESLINT_PRETTIER__REACT_MODULE,
          ESLINT_PRETTIER__NODE_MODULE,
          COMMITLINT_MODULE,
          HUSKY_MODULE,
          STANDARD_VERSION_MODULE,
        ],
        validate(answer) {
          if (answer.length < 1) {
            return "You must choose at least one module to install.";
          }

          return true;
        },
      },
    ])
    .then((answers) => {
      installSelectedItem(answers);
    });
}

module.exports.init = () => {
  if (!fs.existsSync("./package.json")) {
    process.stdout.write(
      chalk.red.bold(
        "There is no package.json found, hence could be possible this is not a root directory. Please run at the root level \n"
      )
    );
    exit();
  }

  process.stdout.write(chalk.cyan.underline.bold("Workspace Initial Setup \n"));
  askInitialQuestion();
};
