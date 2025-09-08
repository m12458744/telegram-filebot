const bot = require('./bot');

bot.launch()
  .then(() => console.log('🤖 ربات با موفقیت راه‌اندازی شد'))
  .catch(console.error);

// مدیریت درست خاموش شدن ربات
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
