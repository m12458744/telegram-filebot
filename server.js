require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('سلام! ربات در حال اجراست.');
});

bot.on('message', async (ctx) => {
  if (ctx.message.document) {
    try {
      const fileId = ctx.message.document.file_id;
      const link = await ctx.telegram.getFileLink(fileId);
      await ctx.reply(`لینک مستقیم فایل:\n${link.href}`);
    } catch (error) {
      await ctx.reply('مشکل در دریافت لینک فایل.');
    }
  } else {
    await ctx.reply('لطفا فقط فایل ارسال کنید.');
  }
});

const PORT = process.env.PORT || 10000;
const URL = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}/bot${process.env.BOT_TOKEN}`;

bot.telegram.setWebhook(URL);

bot.startWebhook(`/bot${process.env.BOT_TOKEN}`, null, PORT);

console.log(`🌐 سرور روی پورت ${PORT} در حال اجراست.`);
