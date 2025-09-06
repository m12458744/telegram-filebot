require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

bot.start((ctx) => ctx.reply('سلام! ربات آماده است.'));
bot.help((ctx) => ctx.reply('برای استفاده از ربات، فایل بفرستید تا لینک دریافت کنید.'));

bot.on('message', async (ctx) => {
  try {
    if (ctx.message.document) {
      const fileId = ctx.message.document.file_id;
      const link = await ctx.telegram.getFileLink(fileId);
      ctx.reply(`لینک فایل شما:\n${link.href}`);
    } else {
      ctx.reply('لطفا فایل ارسال کنید.');
    }
  } catch (err) {
    console.error(err);
    ctx.reply('خطا پیش آمده، لطفا دوباره تلاش کنید.');
  }
});

const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('ربات فعال است');
});

app.listen(PORT, () => {
  console.log(`سرور روی پورت ${PORT} در حال اجراست.`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
