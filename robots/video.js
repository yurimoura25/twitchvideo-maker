const state = require("./state.js");
const spawn = require("child_process").spawn;
const path = require("path");
const rootPath = path.resolve(__dirname, "..");

async function robot() {
  const content = state.load();

  const d = await takeVideoDuration(content);
  const compSettings = {
    height: 1920,
    width: 1080,
    aspect_ratio: 1,
    duration: d,
    framerate: 60,
  };
  state.saveScript(compSettings);

  await createVideoTemplate();
  await renderVideoWithAfterEffects();

  async function takeVideoDuration(content) {
    let i;
    let duracao = 0;
    for (i = 0; i < content.duration.length; i++) {
      duracao =
        duracao +
        parseInt(content.duration[i].split(":")[1]) +
        parseInt(content.duration[i].split(":")[0]) * 60;
    }
    return duracao;
  }
  async function createVideoTemplate() {
    return new Promise((resolve, reject) => {
      const afterFilePath =
        "C:/Program Files/Adobe/Adobe After Effects 2020/Support Files/AfterFX";
      const scriptFilePath =
        "C:/Users/y2mou/OneDrive/Documentos/twitch-videomaker/robots/after-effects/importAndCreateVideo.js";
      console.log("+ Creating template for video.");

      const after = spawn(afterFilePath, ["-noui", "-r", scriptFilePath]);

      after.on("close", () => {
        console.log("+ Template made");
        resolve();
      });
    });
  }
  async function renderVideoWithAfterEffects() {
    return new Promise((resolve, reject) => {
      const aerenderFilePath =
        "C:/Program Files/Adobe/Adobe After Effects 2020/Support Files/aerender";
      const templateFilePath =
        "C:/Users/y2mou/OneDrive/Documentos/twitch-videomaker/robots/after-effects/template.aep";
      const destinationFilePath = `${rootPath}/robots/videos/output.mov`;

      console.log(`+ Starting After Effects`);

      const aerender = spawn(aerenderFilePath, [
        "-comp",
        "Main",
        "-project",
        templateFilePath,
        "-output",
        destinationFilePath
      ])
      aerender.stdout.on("data", (data) => {
        process.stdout.write(data);
      });
      aerender.on("close", () => {
        console.log("+ After Effects closed.")
        resolve()
      })
    })
  }
}

module.exports = robot;
