require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const recentFiles = [];

(async () => {
  // ست کردن دستورات منو (برای نمایش توی دکمه کنار پیوست)
  await bot.telegram.setMyCommands([
    { command: 'start', description: 'شروع کار با ربات' },
    { command: 'help', description: 'راهنما' },
    { command: 'recent', description: 'فایل‌های اخیر' },
    { command: 'settings', description: 'تنظیمات' }
  ]);
})();

// منوی اصلی
const mainMenu = Markup.inlineKeyboard([
  [Markup.button.callback('📤 ارسال فایل', 'send_file')],
  [Markup.button.callback('📂 فایل‌های اخیر', 'recent_files')],
  [Markup.button.callback('ℹ️ راهنما', 'help')],
  [Markup.button.callback('⚙️ تنظیمات', 'settings')],
]);

bot.start((ctx) => {
  ctx.reply(
    'سلام 👋\nبه ربات تبدیل فایل به لینک خوش آمدید! یکی از گزینه‌های زیر را انتخاب کنید:',
    mainMenu
  );
});

bot.help((ctx) => {
  ctx.reply('📌 فایل یا عکس یا ویدیو ارسال کن تا لینک مستقیم دریافت کنی.');
});

bot.command('recent', (ctx) => {
  if (recentFiles.length === 0) {
    ctx.reply('📂 هنوز فایل ارسالی ندارید.');
  } else {
    const list = recentFiles.map((item, i) => `${i + 1}. [لینک فایل](${item})`).join('\n');
    ctx.replyWithMarkdown(`📂 فایل‌های اخیر شما:\n${list}`);
  }
});

bot.command('settings', (ctx) => {
  ctx.reply('⚙️ تنظیمات فعلا محدود است. به زودی امکانات بیشتر اضافه خواهد شد.');
});

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
  ctx.reply('📌 فایل یا عکس یا ویدیو ارسال کن تا لینک مستقیم دریافت کنی.');
});

bot.action('settings', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('⚙️ تنظیمات فعلا محدود است. به زودی امکانات بیشتر اضافه خواهد شد.');
});

// دریافت فایل
bot.on(['document', 'photo', 'video'], async (ctx) => {
  try {
    let fileId;

    if (ctx.message.document) {
      fileId = ctx.message.document.file_id;
    } else if (ctx.message.photo) {
      fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    } else if (ctx.message.video) {
      fileId = ctx.message.video.file_id;
    }

    if (!fileId) {
      return ctx.reply('⚠️ فایل قابل شناسایی نیست. لطفاً دوباره امتحان کن.');
    }

    const fileLink = await ctx.telegram.getFileLink(fileId);

    recentFiles.unshift(fileLink.href);
    if (recentFiles.length > 10) recentFiles.pop();

    ctx.reply(`✅ فایل شما دریافت شد.\n🔗 لینک مستقیم:\n${fileLink.href}`);
  } catch (error) {
    console.error('خطا در دریافت لینک فایل:', error);
    ctx.reply('❌ دریافت لینک فایل با شکست مواجه شد. لطفاً دوباره تلاش کن.');
  }
});

// پیام‌های غیر از فایل
bot.on('message', (ctx) => {
  if (!ctx.message.document && !ctx.message.photo && !ctx.message.video) {
    ctx.reply('⚠️ لطفاً فقط فایل، عکس یا ویدیو ارسال کن.');
  }
});

// راه‌اندازی ربات
bot.launch().then(() => {
  console.log('🤖 ربات با موفقیت راه‌اندازی شد');
});

// کنترل صحیح خروج ربات
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
