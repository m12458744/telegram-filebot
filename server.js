const express = require('express');
const bot = require('./bot');

const app = express();
const PORT = process.env.PORT || 3000;

bot.launch();
console.log('🤖 ربات راه‌اندازی شد');

app.get('/', (req, res) => {
  res.send('ربات فعال است.');
});

app.listen(PORT, () => {
  console.log(`🌐 سرور روی پورت ${PORT} در حال اجراست.`);
});
