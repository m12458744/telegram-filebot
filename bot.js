require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// دکمه شروع و معرفی
bot.start((ctx) => {
  ctx.reply(
    'سلام 👋\nبه ربات تبدیل فایل به لینک خوش اومدی!\nفایل رو برام بفرست یا از کانال/گروه فوروارد کن تا لینک مستقیم بدم.',
    Markup.keyboard([
      ['📤 ارسال فایل'],
      ['ℹ️ راهنما'],
    ]).resize()
  );
});

// جواب به پیام «راهنما»
bot.hears('ℹ️ راهنما', (ctx) => {
  ctx.reply('📌 فایل رو مستقیماً ارسال کن یا از کانال/گروه فوروارد کن تا لینک مستقیم دریافت کنی.');
});

// بررسی همه پیام‌ها
bot.on('message', async (ctx) => {
  const msg = ctx.message;

  // اگر فایل وجود دارد (چه مستقیم چه فوروارد)
  if (msg.document) {
    try {
      const fileId = msg.document.file_id;
      const fileLink = await ctx.telegram.getFileLink(fileId);
      ctx.reply(`✅ فایل شما دریافت شد.\n🔗 لینک مستقیم:\n${fileLink.href}`);
    } catch (err) {
      console.error('❌ خطا در دریافت لینک فایل:', err.message);
      ctx.reply('❌ دریافت لینک فایل با شکست مواجه شد. لطفاً دوباره امتحان کن یا فایل دیگری بفرست.');
    }
  } else if (msg.text && !msg.via_bot) {
    // اگر پیام فقط متن هست ولی فایل نیست
    ctx.reply('⚠️ لطفاً فقط فایل ارسال کنید یا فوروارد نمایید.');
  }
});

module.exports = bot;
