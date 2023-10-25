require('dotenv').config();
const tlgKey = require('node-telegram-bot-api');
const mysql = require('mysql');

const botToken = process.env.API_TOKEN;
const chatID = process.env.CHAT_ID;

const bot = new tlgKey(botToken, {polling: true});

const buttonsTablet = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{text: 'Reg', callback_data: 'subs'}, {text: 'Unreg', callback_data: 'unsubs'}]
    ]
  })
}

const subscribeFunc = async (msg) => {
  console.log(msg);
  const textMsg = msg.data;
  const chatUserID = msg.message.chat.id;
  const nameUser = msg.message.chat.first_name + msg.message.chat.last_name;
  const text = textMsg + 'cribe!';
  await bot.sendMessage(chatUserID, `You are ${text}`);
  await bot.sendMessage(chatID, "User: " + nameUser +  " are " + text);
}

const startBot = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Run'},
    {command: '/info', description: 'Get info'},
    // {command: '/connect', description: 'Connect to DB'},
    {command: '/getbyid', description: 'Get by ID'},
    // {command: '/disconnect', description: 'Close the DB connection'},
    {command: '/registration', description: 'Registration'}
  ])

  console.log(process.env.API_TOKEN);
  
  bot.on('message', async msg => {
    const textMsg = msg.text;
    const chatUserID = msg.chat.id;

    const connection = mysql.createConnection({
      host: "localhost",
      user: "******_res",
      database: "******_res",
      password: "******"
    });
    connection.connect(function(err){
      if (err) {
        return bot.sendMessage(chatUserID, "MySQL. Connecting error: " + err.message); 
      }
      return bot.sendMessage(chatUserID, "MySQL: connection successful");
    });
    
    if(textMsg === '/start') {
      await bot.sendMessage(chatID, "I was turned on by the user: " + msg.from.first_name + msg.from.last_name);
      await bot.sendSticker(chatUserID, 'https://tlgrm.ru/_/stickers/7bd/93c/7bd93cd5-8b8e-3cf7-ab8e-a3a15ebe0e33/9.webp');
      return bot.sendMessage(chatUserID, "Hi, " + msg.from.first_name);
    }
  
    if(textMsg === '/info') {
      
      await bot.sendSticker(chatUserID, 'https://tlgrm.ru/_/stickers/7bd/93c/7bd93cd5-8b8e-3cf7-ab8e-a3a15ebe0e33/4.webp');
      return bot.sendMessage(chatUserID, "So far, I don't know why I was created");
    }

    if(textMsg === '/getbyid') {
      const query = 'SELECT * FROM users WHERE id = 2';

      connection.query(query, (err, results, fields) => {
        if (err) {
          return bot.sendMessage(chatUserID,'Error request: ' + err.stack);
        }
        const user = JSON.parse(JSON.stringify(results));
        bot.sendMessage(chatUserID, user[0].obr + " " + user[0].name +",");
        bot.sendMessage(chatUserID, "Ваш email:" + user[0].email);
        bot.sendMessage(chatUserID, "телефон:" + user[0].tel);
        bot.sendMessage(chatUserID, "логин:" + user[0].login);
        bot.sendMessage(chatUserID, "пароль:" + user[0].passwd);
      });   
    }

    // if(textMsg === '/disconnect') {
    //   connection.end(function(err) {
    //     if (err) {
    //       return bot.sendMessage(chatUserID, "MySQL. Error: " + err.message);
    //     }
    //     return bot.sendMessage(chatUserID, "Connection closed");
    //   });
    // }

    if(textMsg === '/registration') {
      return bot.sendMessage(chatUserID, "Subscribe", buttonsTablet); 
    }
  
    //return bot.sendMessage(chatUserID, 'I don\'t understand you, let\'s try again...')
  })

  bot.on('callback_query', msg => {
    return subscribeFunc(msg);
  })
}

startBot()