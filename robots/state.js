const fs = require("fs");
const contentFilePath = "./content.json";
const scriptFilePath = "robots/after-effects/after-effects.js";

function save(content) {
  const contentString = JSON.stringify(content, null, 2);
  return fs.writeFileSync(contentFilePath, contentString);
}

function saveScript(content) {
  const script = JSON.stringify(content, null, 2);
  const scriptString = `var c = ${script}`;
  return fs.writeFileSync(scriptFilePath, scriptString);
}

function load() {
  const fileBuffer = fs.readFileSync(contentFilePath, "utf-8");
  const contentJson = JSON.parse(fileBuffer);
  return contentJson;
}

module.exports = {
  save,
  saveScript,
  load,
};
