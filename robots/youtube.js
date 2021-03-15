const state = require("./state.js");
const google = require("googleapis").google;
const youtube = google.youtube({ version: "v3" });
const fs = require("fs");
const OAuth2 = google.auth.OAuth2;

const express = require("express");

async function robot() {
  console.log("+ Starting Youtube's robot");
  const content = state.load();

  await authenticateWithOAuth();
  const videoInformation = await uploadVideo(content);

  async function authenticateWithOAuth() {
    const webServer = await startWebServer();
    const OAuthClient = await createOAuthClient();
    requestUserContent(OAuthClient);
    const authorizationToken = await waitForGoogleCallback(webServer);
    await requestAccessTokens(OAuthClient, authorizationToken);
    setGlobalGoogleAuthentication(OAuthClient);
    await stopWebServer(webServer);

    async function startWebServer() {
      return new Promise((resolve, reject) => {
        const port = 5000;
        const app = express();
        const server = app.listen(port, () => {
          console.log(`+ Listening on http://localhost:${port}`);

          resolve({
            app,
            server,
          });
        });
      });
    }

    async function createOAuthClient() {
      const credentials = require("./credentials/google-youtube.json"); //Arquivo com as credenciais do GoogleAPI
      const OAuthClient = new OAuth2(
        credentials.web.client_id,
        credentials.web.client_secret,
        credentials.web.redirect_uris[0]
      );

      return OAuthClient;
    }

    function requestUserContent(OAuthClient) {
      const consentUrl = OAuthClient.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/youtube"],
      });
      console.log(`+ Please give your consent at: ${consentUrl}`);
    }

    async function waitForGoogleCallback(webServer) {
      return new Promise((resolve, reject) => {
        console.log(`+ Waiting for user consent...`);
        webServer.app.get("/oauth2callback", (req, res) => {
          const authCode = req.query.code;
          console.log(`+ Consent given: ${authCode}`);

          res.send("<h1>Thank you!</h1> <p>Now close this tab. </p>");
          resolve(authCode);
        });
      });
    }

    async function requestAccessTokens(OAuthClient, authorizationToken) {
      return new Promise((resolve, reject) => {
        OAuthClient.getToken(authorizationToken, (error, tokens) => {
          if (error) {
            return reject(error);
          }
          console.log(`+ Access Token Received`);

          OAuthClient.setCredentials(tokens);
          resolve();
        });
      });
    }

    function setGlobalGoogleAuthentication(OAuthClient) {
      google.options({
        auth: OAuthClient,
      });
    }

    async function stopWebServer(webServer) {
      return new Promise((resolve, reject) => {
        webServer.server.close(() => {
          resolve();
        });
      });
    }
  }

  async function uploadVideo(content) {
    videoFilePath = "robots/videos/output.mp4";
    const videoFileSize = fs.statSync(videoFilePath).size;
    const videoTitle = (
      content.titles[0].toString() +
      " E " +
      content.titles[5].toString() +
      " - Badaras Clipes"
    ).toUpperCase();
    const videoTags = [
      content.category,
      ...(await removeRepeatedNames(content)),
    ];
    console.log(videoTags);
    const videoDescription = "Clipes de CSGO";
    const requestParameters = {
      part: "snippet, status",
      requestBody: {
        snippet: {
          title: videoTitle,
          description: videoDescription,
          tags: videoTags,
        },
        status: {
          privacyStatus: "unlisted",
        },
      },
      media: {
        body: fs.createReadStream(videoFilePath),
      },
    };

    const youtubeResponse = await youtube.videos.insert(requestParameters, {
      onUploadProgress: onUploadProgress,
    });

    console.log(
      `+ Video available at: https://youtu.be/${youtubeResponse.data.id}`
    );
    function onUploadProgress(event) {
      const progress = Math.round((event.bytesRead / videoFileSize) * 100);
      console.log(`+ ${progress}% completed`);
    }

    async function removeRepeatedNames(content) {
      let tag = [];
      let i = 0;
      let j = 0;
      for (i = 0; i < content.names.length; i++) {
        if (!tag.includes(content.names[i])) {
          tag[j] = content.names[i];
          j++;
        }
      }
      return tag;
    }
  }
}

module.exports = robot;
