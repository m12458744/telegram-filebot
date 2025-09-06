require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('سلام! لطفاً فایل خود را ارسال کنید تا لینک مستقیم دریافت کنید.');
});

bot.on('message', async (ctx) => {
  try {
    let fileId;

    // اگر پیام مستقیم حاوی document بود
    if (ctx.message.document) {
      fileId = ctx.message.document.file_id;
    }
    // اگر پیام فوروارد شده و حاوی document هست
    else if (
      ctx.message.forward_from_chat && 
      ctx.message.document
    ) {
      fileId = ctx.message.document.file_id;
    }
    // یا فقط پیام فوروارد شده (کانال یا گروه) و فایل داره
    else if (
      ctx.message.forward_from_chat && 
      ctx.message.caption && 
      ctx.message.document
    ) {
      fileId = ctx.message.document.file_id;
    }

    if (fileId) {
      const fileLink = await ctx.telegram.getFileLink(fileId);
      ctx.reply(`✅ فایل شما دریافت شد.\n🔗 لینک مستقیم:\n${fileLink.href}`);
    }
  } catch (error) {
    console.error(error);
    ctx.reply('❌ خطایی رخ داد. لطفاً دوباره تلاش کنید.');
  }
});

module.exports = bot;
