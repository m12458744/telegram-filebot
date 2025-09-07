require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// پیام شروع ربات و دکمه‌ها
bot.start((ctx) => {
  ctx.reply(
    'سلام 👋\nبه ربات تبدیل فایل به لینک خوش آمدید!\nلطفاً فایل یا عکس یا ویدیو ارسال کنید یا از کانال/گروه فوروارد کنید.',
    Markup.keyboard([
      ['📤 ارسال فایل'],
      ['ℹ️ راهنما']
    ]).resize()
  );
});

// راهنما
bot.hears('ℹ️ راهنما', (ctx) => {
  ctx.reply('📌 فایل یا عکس یا ویدیو را ارسال کنید یا از کانال/گروه فوروارد کنید تا لینک مستقیم دریافت کنید.');
});

// هندلر دریافت فایل‌ها
bot.on(['document', 'photo', 'video'], async (ctx) => {
  try {
    let fileId;

    if (ctx.message.document) {
      fileId = ctx.message.document.file_id;
    } else if (ctx.message.photo) {
      // عکس‌ها آرایه‌اند، بزرگترین سایز آخرین هست
      fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    } else if (ctx.message.video) {
      fileId = ctx.message.video.file_id;
    }

    if (fileId) {
      const fileLink = await ctx.telegram.getFileLink(fileId);
      ctx.reply(`✅ فایل شما دریافت شد.\n🔗 لینک مستقیم:\n${fileLink.href}`);
    } else {
      ctx.reply('⚠️ فایل قابل شناسایی نیست. لطفاً دوباره امتحان کنید.');
    }
  } catch (err) {
    console.error('خطا در دریافت لینک فایل:', err);
    ctx.reply('❌ دریافت لینک فایل با شکست مواجه شد. لطفاً دوباره تلاش کنید.');
  }
});

// اگر پیام متن بدون فایل بود
bot.on('message', (ctx) => {
  if (!ctx.message.document && !ctx.message.photo && !ctx.message.video) {
    ctx.reply('⚠️ لطفاً فقط فایل، عکس یا ویدیو ارسال کنید یا فوروارد نمایید.');
  }
});

module.exports = bot;
