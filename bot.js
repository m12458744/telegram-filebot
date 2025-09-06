require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    'سلام 👋\nبه ربات تبدیل فایل به لینک خوش اومدی!\nفایل رو برام بفرست یا از کانال/گروه فوروارد کن تا لینک مستقیم بدم.',
    Markup.keyboard([
      ['📤 ارسال فایل'],
      ['ℹ️ راهنما'],
    ]).resize()
  );
});

bot.hears('ℹ️ راهنما', (ctx) => {
  ctx.reply('📌 فایل رو مستقیماً ارسال کن یا از کانال/گروه فوروارد کن تا لینک مستقیم دریافت کنی.');
});

bot.on('message', async (ctx) => {
  const msg = ctx.message;
  console.log('پیام دریافت شد:', JSON.stringify(msg, null, 2)); // برای دیباگ

  if (msg.document) {
    try {
      const fileId = msg.document.file_id;
      console.log('fileId:', fileId);
      const fileLink = await ctx.telegram.getFileLink(fileId);
      console.log('لینک فایل:', fileLink.href);
      await ctx.reply(`✅ فایل شما دریافت شد.\n🔗 لینک مستقیم:\n${fileLink.href}`);
    } catch (err) {
      console.error('❌ خطا در دریافت لینک فایل:', err);
      ctx.reply('❌ دریافت لینک فایل با شکست مواجه شد. لطفاً دوباره امتحان کن یا فایل دیگری بفرست.');
    }
  } else if (msg.text && !msg.via_bot) {
    ctx.reply('⚠️ لطفاً فقط فایل ارسال کنید یا فوروارد نمایید.');
  } else {
    ctx.reply('⚠️ فایلی دریافت نشد. لطفاً فایل ارسال کن.');
  }
});

bot.launch();
console.log('ربات در حال اجراست...');
