// https://t.me/emma_ht_bot

const request = require("request");

const TelegramBot = require("node-telegram-bot-api");

const { Configuration, OpenAIApi } = require("openai");

const fs = require("fs");
resolve = require("path").resolve;
const ffmpeg = require("./ffmpeg");

const _ = require("lodash");

const express = require("express");
const { json } = require("express");

const app = express();
app.use(express.static("public"));
app.use(json());

require("dotenv").config();

const PORT = process.env.PORT || 3001;

//Setup Telegram Bot
const { TELEGRAM_TOKEN, OPENAI_API_KEY } = process.env;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

//Setup openAI API
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const model = "gpt-3.5-turbo-16k"; // Can be: gpt-3.5-turbo , gpt-4

//////////////////////////////////////////////////////////////////////////////////////////////
//////     Used local variable to make it easier to start                         ////////////
/////     (Recommend a standard database like MongoDB, Postgress for production) /////////////
//////////////////////////////////////////////////////////////////////////////////////////////

//Where we save all chat context
let messages = [
  {
    role: "system",
    content: ``,
  },
];

//Where we save all users id
let users = [];

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Get Started Action
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  users.push({ _id: msg.from.id });

  bot.sendMessage(chatId, `Welcome. ${msg.from.id} `);
});

//Generate images with DALLE using:  /imagine + prompt
bot.onText(/\/imagine/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Please wait...");
  const content = msg.text.split("/imagine")[1];

  const response = await openai.createImage({
    prompt: content,
    n: 1,
    size: "256x256", //"1024x1024",
  });

  if (
    response &&
    response.data &&
    response.data.data.length > 0 &&
    response.data.data[0].url
  ) {
    var pic_stream = request
      .get(response.data.data[0].url)
      .on("error", function (err) {
        console.log(err);
      });

    bot.sendPhoto(chatId, pic_stream, {
      caption: content.substring(0, 10) + "...",
    });
  }
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  let userData = users.filter((f) => f._id === msg.from.id);
  userData = userData[0];

  if (!userData) {
    users.push({ _id: msg.from.id });
    userData = { _id: msg.from.id };
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  //////     Discuss with ChatGPT by using  gpt-3.5-turbo-16k                         //////////
  /////     (Recommend for more context and fast response)                            //////////
  //////////////////////////////////////////////////////////////////////////////////////////////

  if (msg && msg.chat && msg.text && !msg.voice && userData && userData._id) {
    if (msg && msg.text && msg.text.includes("imagine")) {
      return;
    }

    messages.push({
      role: "user",
      content: msg.text,
      user: msg.from.id,
    });

    const myMessages = messages
      .filter((f) => (f.user = msg.from.id))
      .map((m) => {
        return {
          role: m.role,
          content: m.content,
        };
      });

    const completion = await openai.createChatCompletion({
      model,
      max_tokens: 200,
      messages: _.takeRight(myMessages, 3),
    });

    messages.push({
      role: "assistant",
      content: completion.data.choices[0].message.content,
      user: msg.from.id,
    });

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, completion.data.choices[0].message.content);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  //////     Discuss with ChatGPT by using  Whisper an open source T2S from openAI    //////////
  /////     (Recommend for more context and fast response)                            //////////
  //////////////////////////////////////////////////////////////////////////////////////////////

  if (msg && msg.voice) {
    bot.sendMessage(chatId, "Please wait...");
    const voiceId = msg.voice.file_id;

    const audio = await bot.getFileLink(voiceId);

    ffmpeg(audio)
      .toFormat("wav")
      .on("progress", async (progress) => {
        console.log("Processing: " + progress.targetSize + " KB converted");

        const resp = await openai.createTranscription(
          fs.createReadStream("./current.wav"),
          "whisper-1"
        );

        const { status, statusText, data } = resp;
        console.log(status, statusText, data);

        messages.push({
          role: "user",
          content: data.text,
          user: msg.from.id,
        });

        const myMessages = messages
          .filter((f) => (f.user = msg.from.id))
          .map((m) => {
            return {
              role: m.role,
              content: m.content,
            };
          });

        const completion = await openai.createChatCompletion({
          model,
          max_tokens: 200,
          messages: _.takeRight(myMessages, 3),
        });

        messages.push({
          role: "assistant",
          content: completion.data.choices[0].message.content,
          user: msg.from.id,
        });

        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, completion.data.choices[0].message.content);
      })
      .on("error", (err) => {
        console.log("An error occurred: " + err.message);
      })
      .on("end", () => {
        console.log("Processing finished !");
      })
      .save("./current.wav"); //path where you want to save your file
  }
});

app.get("/", (req, res) => {
  return res.json({ test: "Ok" });
});

app.listen(PORT, () => console.log(`Server is up and running on ${PORT}`));
