const readline = require("readline-sync");
const state = require("./state.js");

function robot() {
  const content = {};

  content.category = askAndReturnCategory();
  if (content.category === "CSGO") {
    content.categoryLink =
      "https://www.twitch.tv/directory/game/Counter-Strike%3A%20Global%20Offensive/clips?range=24hr";
  } else if (content.category === "Just Chatting") {
    content.categoryLink =
      "https://www.twitch.tv/directory/game/Just%20Chatting/clips?range=24hr";
  } else if (content.category === "LOL") {
    content.categoryLink =
      "https://www.twitch.tv/directory/game/League%20of%20Legends/clips?range=24hr";
  }
  state.save(content);
  function askAndReturnCategory() {
    const category = ["CSGO", "LOL", "Just Chatting", "PodCasts"];
    const selectCategoryIndex = readline.keyInSelect(
      category,
      "Choose one option:"
    );
    const selectCategoryText = category[selectCategoryIndex];
    return selectCategoryText;
  }
}

module.exports = robot;
