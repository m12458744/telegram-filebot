require('dotenv').config();
const { Telegraf } = require('telegraf');

// توکن ربات از فایل .env گرفته میشه
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('سلام! ربات آماده است.'));
bot.help((ctx) => ctx.reply('برای استفاده از ربات، لینک فایل را ارسال کنید.'));

bot.on('message', async (ctx) => {
  try {
    if (ctx.message.document) {
      // اگه فایل فرستاده شده، لینک فایل رو ارسال کن
      const fileId = ctx.message.document.file_id;
      const link = await ctx.telegram.getFileLink(fileId);
      ctx.reply(`لینک فایل شما:\n${link.href}`);
    } else if (ctx.message.text) {
      // اگه متن فرستاده شده، بررسی کن آیا لینک هست یا فایل
      ctx.reply('لطفا فایل ارسال کنید تا لینک دریافت کنید.');
    }
  } catch (error) {
    console.error(error);
    ctx.reply('مشکلی پیش آمده، دوباره تلاش کنید.');
  }
});

bot.launch()
  .then(() => console.log('ربات با موفقیت راه‌اندازی شد.'))
  .catch(console.error);

// برای جلوگیری از خاموش شدن سرور روی Render
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

