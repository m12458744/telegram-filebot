const bot = require('./bot');

bot.launch()
  .then(() => console.log('🤖 ربات با موفقیت راه‌اندازی شد!'))
  .catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
