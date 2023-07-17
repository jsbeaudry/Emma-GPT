# Telegram OpenAI Integration

Welcome to the Telegram OpenAI Integration project! In this project, we leverage the power of OpenAI's technologies to enable anyone to use these advanced capabilities within the popular messaging platform, Telegram. With this integration, users can enjoy the benefits of OpenAI's cutting-edge technologies right from their Telegram conversations.

## Features

Once you have set up the integration and started the bot, you can begin using the OpenAI-powered features in your Telegram conversations. Here are a few examples:

- To chat with ChatGPT, simply send a text message to the bot, and it will respond with an AI-generated reply.
- To send voice messages and have them transcribed using OpenAI's Whisper model, send an audio message to the bot, and it will provide a textual representation of the audio.
- To generate images using OpenAI's DALL·E model, send a description or prompt for the desired image to the bot, and it will reply with the generated image.

Feel free to explore, experiment the available features and add new ones!

## Technology Stack

- Nodejs : https://nodejs.org/en
- chatGPT : https://platform.openai.com/docs/guides/gpt/completions-api
- whisper : https://platform.openai.com/docs/guides/speech-to-text
- telegram api : https://core.telegram.org/api#bot-api
- Express : https://expressjs.com/
- ffmpeg : https://www.npmjs.com/package/ffmpeg

## Prerequisites

Before getting started with the Telegram OpenAI Integration, make sure you have completed the following steps:

1. Create an OpenAI Developer Account: Sign up for an account on the OpenAI Developer https://openai.com/ to obtain your API key.
2. Create a Telegram Bot: Create a Telegram bot by following the instructions provided by https://core.telegram.org/bots#botfather. Obtain the API token for your bot.

---

## Installation

To use the Telegram OpenAI Integration, follow these steps:

1. Clone the repository:

```shell
git clone https://github.com/your_username/telegram-openai-integration.git
```

2. Install the required dependencies:

```shell
cd telegram-openai-integration
yarn install
```

3. Set up environment variables:
   Create a new .env file in the project root directory.
   Add the following environment variables to the .env file:

```shell
TELEGRAM_API_TOKEN=XXXXXXXX
OPENAI_API_KEY=YYYYYYYYY
```

Replace XXXXXXXX with the API token obtained from BotFather and YYYYYYYY with your OpenAI API key.

4. Start a conversation with your Telegram bot and explore the various OpenAI-powered features.
   yarn start

---

Contributions to this project are welcome. If you have any ideas, suggestions, or bug reports, please open an issue on the GitHub repository. If you would like to contribute code, you can create a pull request.

## License

This project is licensed under the [MIT license](LICENSE).

## Acknowledgements

We would like to acknowledge the contributions of the open-source community and the developers at OpenAI for their incredible work and support.

## Contact

If you have any questions or need assistance, you can reach us at jeansauvenel.beaudry@gmail.com.

Thank you for using the Telegram OpenAI Integration! We hope you find it useful and enjoy the power of OpenAI's technologies within Telegram.
