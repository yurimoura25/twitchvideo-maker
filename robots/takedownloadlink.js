const puppeteer = require("puppeteer-core");

async function robot(link) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/Chrome",
  });
  const page = await browser.newPage();

  await page.goto(link, { waitUntil: "networkidle2" });

  const video =
    "#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.persistent-player.tw-elevation-0 > div > div.video-player > div > video";
  await page.waitForSelector(video);

  link = await page.evaluate(() => {
    return document.querySelector(
      "#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div.persistent-player.tw-elevation-0 > div > div.video-player > div > video"
    ).src;
  });
  await browser.close();
  return link;
}

module.exports = robot;
