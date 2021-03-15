const puppeteer = require("puppeteer-core");
const state = require("./state.js");

async function robot() {
  const content = state.load();

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/Chrome",
  });
  const page = await browser.newPage();
  await page.goto(content.categoryLink, { waitUntil: "networkidle2" });

  await page.waitForSelector(
    "#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div > div > div > div.directory-game-clips-page__filters.tw-flex > div.tw-flex.tw-justify-content-between > div.tw-align-items-end.tw-flex.tw-flex-row > div:nth-child(1) > div > div > div:nth-child(1) > button > div > div.tw-flex-grow-1 > div"
  );
  await page.evaluate(() => {
    document
      .querySelector(
        "#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div > div > div > div.directory-game-clips-page__filters.tw-flex > div.tw-flex.tw-justify-content-between > div.tw-align-items-end.tw-flex.tw-flex-row > div:nth-child(1) > div > div > div:nth-child(1) > button > div > div.tw-flex-grow-1 > div"
      )
      .click();
  });

  await page.waitForSelector(
    "#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div > div > div > div.directory-game-clips-page__filters.tw-flex > div.tw-flex.tw-justify-content-between > div.tw-align-items-end.tw-flex.tw-flex-row > div:nth-child(1) > div > div > div:nth-child(2) > div > div > div > div.language-select-menu__balloon > div > div.simplebar-scroll-content > div > div > div:nth-child(13) > div > label > div"
  );
  await page.evaluate(() => {
    document
      .querySelector(
        "#root > div > div.tw-flex.tw-flex-column.tw-flex-nowrap.tw-full-height > div > main > div.root-scrollable.scrollable-area.scrollable-area--suppress-scroll-x > div.simplebar-scroll-content > div > div > div > div > div > div.directory-game-clips-page__filters.tw-flex > div.tw-flex.tw-justify-content-between > div.tw-align-items-end.tw-flex.tw-flex-row > div:nth-child(1) > div > div > div:nth-child(2) > div > div > div > div.language-select-menu__balloon > div > div.simplebar-scroll-content > div > div > div:nth-child(13) > div > label > div"
      )
      .click();
  });
  await page.reload();
  await page.waitForSelector(
    "a.tw-full-width.tw-link.tw-link--hover-underline-none.tw-link--inherit"
  );

  const elementHandles = await page.$$(
    "a.tw-full-width.tw-link.tw-link--hover-underline-none.tw-link--inherit"
  );
  const propertyJsHandles = await Promise.all(
    elementHandles.map((handle) => handle.getProperty("href"))
  );
  const links = await Promise.all(
    propertyJsHandles.map((handle) => handle.jsonValue())
  );
  const elementHandles2 = await page.$$(
    "div.tw-absolute.tw-left-0.tw-mg-1.tw-top-0 > div > p"
  );
  const propertyJsHandles2 = await Promise.all(
    elementHandles2.map((handle) => handle.getProperty("innerText"))
  );
  const duration = await Promise.all(
    propertyJsHandles2.map((handle) => handle.jsonValue())
  );
  const elementHandles1 = await page.$$(".tw-media-card-meta__title");
  const propertyJsHandles1 = await Promise.all(
    elementHandles1.map((handle) => handle.getProperty("innerText"))
  );
  const titles = await Promise.all(
    propertyJsHandles1.map((handle) => handle.jsonValue())
  );
  await browser.close();
  content.names = links;
  content.duration = duration;
  content.links = links;
  titles.forEach(async (element) => {
    element = element.replace('"', " ");
  });
  content.titles = titles;

  state.save(content);
}
module.exports = robot;
