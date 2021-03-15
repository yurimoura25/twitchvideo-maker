const state = require("./state.js");
const takeDownloadLink = require("./takedownloadlink.js");
const video = require('./video.js');
const https = require("https");
const fs = require("fs");

async function robot() {
  console.log("+ Downloading videos: ");
  const content = state.load();
  let i;
  console.log(`+ Fetching links for downloading`);
  for (i = 0; i < content.links.length; i++) {
    content.links[i] = await takeDownloadLink(content.links[i]);
    console.log(`+    >Fetched ${i + 1}°`);
  }
  await download(content, 0);
  async function download(content, i) {
    return new Promise((resolve, reject) => {
    if (content.links[i] == null) {
      video();
    } else {
      https.get(content.links[i], function (res) {
        const fileStream = fs.createWriteStream(
          "robots/videos/" + "00" + (i + 1) + ".mp4"
        );
        res.pipe(fileStream);
        fileStream.on("finish", async () => {
          fileStream.close();
          console.log(
            "+      > Realizado o download do vídeo de número " + (i + 1) + "!"
          );
          await download(content, i + 1);
        });
      });
    }
    resolve()
    })
  }

  i = 0;
  while (content.names[i] != null) {
    content.names[i] = content.names[i].split("/")[3];
    i++;
  }
  console.log("+ Downloads finished.");
  state.save(content);
}

module.exports = robot;
