const bot = require('./bot');

bot.launch()
  .then(() => {
    console.log('ربات در حال اجراست...');
  })
  .catch((err) => {
    console.error('خطا در راه‌اندازی ربات:', err);
  });

// Optional: این خط برای مدیریت سیگنال‌های توقف و بسته شدن ربات هست
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
