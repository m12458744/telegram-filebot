// server.js
require('dotenv').config();
const express = require('express');
const bot = require('./bot');

const app = express();
const PORT = process.env.PORT || 3000;

bot.launch(); // اینجا باید bot خروجی واقعی Telegraf باشه

app.get('/', (req, res) => {
  res.send('🤖 ربات فعال است!');
});

app.listen(PORT, () => {
  console.log(`🌐 سرور روی پورت ${PORT} در حال اجراست.`);
});
