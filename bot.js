require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// پیام شروع و دکمه‌ها
bot.start((ctx) => {
  ctx.reply(
    'سلام 👋\nبه ربات تبدیل فایل به لینک خوش آمدید!\nلطفاً فایل، عکس یا ویدیو ارسال کنید یا از کانال/گروه فوروارد کنید.',
    Markup.keyboard([
      ['📤 ارسال فایل'],
      ['ℹ️ راهنما']
    ]).resize()
  );
});

// راهنما
bot.hears('ℹ️ راهنما', (ctx) => {
  ctx.reply('📌 فایل یا عکس یا ویدیو ارسال کن یا از کانال/گروه فوروارد کن تا لینک مستقیم دریافت کنی.');
});

// هندلر فایل‌ها (عکس، ویدیو، داکیومنت)
bot.on(['document', 'photo', 'video'], async (ctx) => {
  try {
    let fileId;
    let isPhotoFile = false;

    if (ctx.message.document) {
      const mimeType = ctx.message.document.mime_type || '';
      if (mimeType.startsWith('image/')) {
        isPhotoFile = true;
      }
      fileId = ctx.message.document.file_id;
    } else if (ctx.message.photo) {
      fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    } else if (ctx.message.video) {
      fileId = ctx.message.video.file_id;
    }

    if (fileId) {
      const fileLink = await ctx.telegram.getFileLink(fileId);
      if (isPhotoFile) {
        ctx.reply(`✅ عکس به صورت فایل دریافت شد.\n🔗 لینک مستقیم:\n${fileLink.href}`);
      } else {
        ctx.reply(`✅ فایل شما دریافت شد.\n🔗 لینک مستقیم:\n${fileLink.href}`);
      }
    } else {
      ctx.reply('⚠️ فایل قابل شناسایی نیست. لطفاً دوباره امتحان کن.');
    }
  } catch (err) {
    console.error('خطا در دریافت لینک فایل:', err);
    ctx.reply('❌ دریافت لینک فایل با شکست مواجه شد. لطفاً دوباره تلاش کن.');
  }
});

// پیام‌های متنی بدون فایل
bot.on('message', (ctx) => {
  if (!ctx.message.document && !ctx.message.photo && !ctx.message.video) {
    ctx.reply('⚠️ لطفاً فقط فایل، عکس یا ویدیو ارسال کن یا فوروارد کن.');
  }
});

module.exports = bot;
