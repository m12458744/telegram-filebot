// server.js
require('dotenv').config();
const express = require('express');
const bot = require('./bot'); // دریافت شیء Telegraf

const app = express();
const PORT = process.env.PORT || 3000;

bot.launch(); // ربات راه‌اندازی میشه

app.get('/', (req, res) => {
  res.send('🤖 ربات فعال است!');
});

app.listen(PORT, () => {
  console.log(`🌐 سرور روی پورت ${PORT} در حال اجراست.`);
});
