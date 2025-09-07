require('dotenv').config();
const bot = require('./bot');

bot.launch()
  .then(() => console.log('ربات با موفقیت راه‌اندازی شد!'))
  .catch(err => console.error('خطا در راه‌اندازی ربات:', err));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
