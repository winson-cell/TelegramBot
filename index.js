// Import necessary modules
const addresses = ["rMkHVoVFk3vLGJgJCUjcGnjiq2jRsk4vsx", "rHLLfANXaJgM44zZTSHBpjK3nfj8v1zqg", "rJw2tbTmYaGTpQFHYNY2ZVQVkiJ6m6hgPd", "rh61B9Fc9B1fGLhux4DFDejrXh9vYjxqrw", "rEF4TADNwLy4wg73mc72Fu9w8j8NwKG1xD", "rDjCaAWNJNSzBAqVU3xmuLTUmA6uQBzDhU","rnmFKEUUSV7f3tesgKE3ETWMs83Bm9Vw9K","rG9jC9zH4gaSYAxtstEiMmc6UKEKGAyfM","rhp2TbZzHUK2TvFh2D5GhqJLM9S6NSHzsJ","rsQKVUDihMp2HHV9ZeRh1rTMd8jNwPKjEm","rfGPGXDi4KqwiDNUwqieK3pZH9DNeD21zG","rNRMPZkawUTCBjhVcDwftGGMp2f67GjaZF","rJUncLkASRPU11KarYxWn43vJWVv1MBC7a","rGLDRDBVDEUbQYrZGosDShfmcjs2hChd8j","rf9Jzd3zHs6sKr7gQSsHiro7PfmwRnrz94","rHPStZVvY8vfHnmSAz42YS2nCokFT6Lx64","rKs52FV88bi4aPKTNCE8J8mkfCEKA1FjNC","rMPXb5ACRmZjHxsyJoSRSDtwqk794gZ5i7","rxNGVH7UmFaDny9JAi2V5NAPJNrkDRMFA","rEkX9U8hsmNh49bps5LS29PuuC9J3Tu1TV","rscubpHLuqhKSyPJW1en8L6wU3uV4hY6PV","rJrXD3SvMR4tSrjk7w1C5HirEcdsjUUrbp","rBwFA5hFFDcKntehMxu4PzT48zvjwMqQos","rf1oYmmAYNv6L1T6hP32SNg9y7Dvdj7rsn","rnC9wViUaGxuSimhjgs3muHGihdjazwsh3","rfDC19ArUcmJko1bQBxfKkZ6ft53yqw6yk"]
const evernode = require("evernode-js-client");
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
dotenv.config();
// Replace 'YOUR_BOT_TOKEN' with the token you received from BotFather
const TOKEN = process.env.TOKEN
const bot = new TelegramBot(TOKEN, { polling: true });
// Command: /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to your Telegram Bot! Type /menu to see the menu.');
});

// Command: /menu
bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;
    const menuOptions = {
        reply_markup: {
            keyboard: [['/hello', '/goodbye']],
            resize_keyboard: true,
            one_time_keyboard: true,
        },
    };

    bot.sendMessage(chatId, 'Choose an option:', menuOptions);
});

// Command: /hello
bot.onText(/\/hello/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello! 👋');
});

// Command: /goodbye
bot.onText(/\/goodbye/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Goodbye! 👋');
});

// Command: /check_status
bot.onText(/\/check_status/, (msg) => {
    const chatId = msg.chat.id;
    main(chatId);
    bot.sendMessage(chatId, 'Awaiting for connection');
});

async function main(chatId) {
  let active = 0
  let not_active = 0
  try {
    // Use a singleton xrplApi for all tests.
    await evernode.Defaults.useNetwork('mainnet');
    const xrplApi = new evernode.XrplApi(null, { autoReconnect: false });
    evernode.Defaults.set({
      xrplApi: xrplApi,
      useCentralizedRegistry: true // Conent to use centralized registry functions.
    });
    await xrplApi.connect();
    const governorClient = await evernode.HookClientFactory.create(evernode.HookTypes.governor);
    await governorClient.connect();
    bot.sendMessage(chatId,"Connected checking host");
    var total = 0
    var i = 0
    for (const address of addresses) {
      await governorClient.getHostInfo(address).then((result) => {
        i = i + 1
        if (result["active"] == false){
          bot.sendMessage(chatId,"something went wrong pls check" + address)
          not_active = not_active + 1
        }
        else{
          active = active + 1
        }
      })
        .catch((error) => {
          console.error(error); // This will be called if the promise is rejected
        });
    }
    } catch (e) {
      console.log(e)
    }
    bot.sendMessage(chatId,"active host : " + active.toString())
    bot.sendMessage(chatId,"not active host : " + not_active.toString())
  }