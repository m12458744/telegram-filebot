const bot = require('./bot');

bot.launch()
  .then(() => console.log('ربات راه‌اندازی شد!'))
  .catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
