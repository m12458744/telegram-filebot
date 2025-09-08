require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const recentFiles = []; // برای نمونه لینک‌های ذخیره شده

// منوی اصلی
const mainMenu = Markup.inlineKeyboard([
  [Markup.button.callback('📤 ارسال فایل', 'send_file')],
  [Markup.button.callback('📂 فایل‌های اخیر', 'recent_files')],
  [Markup.button.callback('ℹ️ راهنما', 'help')],
  [Markup.button.callback('🛠 تنظیمات', 'settings')],
  [Markup.button.callback('📢 اخبار و اطلاعیه‌ها', 'news')],
  [Markup.button.callback('💬 ارتباط با پشتیبانی', 'support')],
  [Markup.button.callback('❌ خروج', 'exit')]
]);

// پیام شروع
bot.start((ctx) => {
  ctx.reply(
    'سلام 👋\nبه ربات تبدیل فایل به لینک خوش آمدید! لطفاً یکی از گزینه‌های زیر را انتخاب کنید.',
    mainMenu
  );
});

// پاسخ به کلیک روی منوها
bot.action('send_file', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('لطفاً فایل، عکس یا ویدیو خود را ارسال کنید.');
});

bot.action('recent_files', (ctx) => {
  ctx.answerCbQuery();
  if (recentFiles.length === 0) {
    ctx.reply('📂 هنوز فایل ارسالی ندارید.');
  } else {
    const list = recentFiles.map((item, i) => `${i + 1}. [لینک فایل](${item})`).join('\n');
    ctx.replyWithMarkdown(`📂 فایل‌های اخیر شما:\n${list}`);
  }
});

bot.action('help', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('📌 فایل یا عکس یا ویدیو ارسال کن یا از کانال/گروه فوروارد کن تا لینک مستقیم دریافت کنی.');
});

bot.action('settings', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('⚙️ تنظیمات در این نسخه محدود است. به زودی قابلیت‌های بیشتری اضافه خواهد شد.');
});

bot.action('news', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('📢 اینجا می‌توانید آخرین اخبار و اطلاعیه‌های ربات را مشاهده کنید. فعلاً خبری نیست!');
});

bot.action('support', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('💬 برای ارتباط با پشتیبانی لطفاً به @YourSupportUsername پیام دهید.');
});

bot.action('exit', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('👋 خداحافظ! هر زمان خواستی دوباره از /start استفاده کن.');
});

// هندلر دریافت فایل‌ها
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

      // ذخیره لینک در آرایه recentFiles
      recentFiles.unshift(fileLink.href);
      if (recentFiles.length > 10) recentFiles.pop();

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

// **فقط صادر کردن شی bot، بدون اجرای launch**
module.exports = bot;
