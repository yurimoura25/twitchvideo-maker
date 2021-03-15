const robots = {
  input: require("./robots/input.js"),
  links: require("./robots/links.js"),
  download: require("./robots/download.js"),
  video: require("./robots/video.js"),
  youtube: require("./robots/youtube.js")
};

async function start() {
  robots.input();
  await robots.links();

  await robots.download();


  await robots.youtube();
}

start();
