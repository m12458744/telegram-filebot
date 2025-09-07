require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('سلام! لطفاً فایل خود را ارسال کنید تا لینک مستقیم دریافت کنید.');
});

bot.on('document', async (ctx) => {
  try {
    const fileId = ctx.message.document.file_id;
    const fileLink = await ctx.telegram.getFileLink(fileId);
    ctx.reply(`✅ فایل شما دریافت شد.\n🔗 لینک مستقیم:\n${fileLink.href}`);
  } catch (error) {
    console.error(error);
    ctx.reply('❌ خطایی رخ داد. لطفاً دوباره تلاش کنید.');
  }
});

module.exports = bot;
