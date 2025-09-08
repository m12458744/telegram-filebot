require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const recentFiles = [];

bot.telegram.setMyCommands([
  { command: 'send_file', description: '📤 ارسال فایل' },
  { command: 'recent_files', description: '📂 فایل‌های اخیر' },
  { command: 'help', description: 'ℹ️ راهنما' },
  { command: 'settings', description: '🛠 تنظیمات' },
  { command: 'news', description: '📢 اخبار و اطلاعیه‌ها' },
  { command: 'support', description: '💬 ارتباط با پشتیبانی' },
  { command: 'exit', description: '❌ خروج' }
]).then(() => {
  console.log('دستورات ربات تنظیم شدند');
});

bot.start((ctx) => {
  ctx.reply(
    'سلام 👋\nبه ربات تبدیل فایل به لینک خوش آمدید! لطفاً یکی از گزینه‌های زیر را انتخاب کنید.',
    Markup.inlineKeyboard([
      [Markup.button.callback('📤 ارسال فایل', 'send_file')],
      [Markup.button.callback('📂 فایل‌های اخیر', 'recent_files')],
      [Markup.button.callback('ℹ️ راهنما', 'help')],
      [Markup.button.callback('🛠 تنظیمات', 'settings')],
      [Markup.button.callback('📢 اخبار و اطلاعیه‌ها', 'news')],
      [Markup.button.callback('💬 ارتباط با پشتیبانی', 'support')],
      [Markup.button.callback('❌ خروج', 'exit')]
    ])
  );
});

// دستورات بات

bot.command('send_file', (ctx) => {
  ctx.reply('لطفاً فایل، عکس یا ویدیو خود را ارسال کنید.');
});

bot.command('recent_files', (ctx) => {
  if (recentFiles.length === 0) {
    ctx.reply('📂 هنوز فایل ارسالی ندارید.');
  } else {
    const list = recentFiles.map((item, i) => `${i + 1}. [لینک فایل](${item})`).join('\n');
    ctx.replyWithMarkdown(`📂 فایل‌های اخیر شما:\n${list}`);
  }
});

bot.command('help', (ctx) => {
  ctx.reply('📌 فایل یا عکس یا ویدیو ارسال کن یا از کانال/گروه فوروارد کن تا لینک مستقیم دریافت کنی.');
});

bot.command('settings', (ctx) => {
  ctx.reply('⚙️ تنظیمات در این نسخه محدود است. به زودی قابلیت‌های بیشتری اضافه خواهد شد.');
});

bot.command('news', (ctx) => {
  ctx.reply('📢 اینجا می‌توانید آخرین اخبار و اطلاعیه‌های ربات را مشاهده کنید. فعلاً خبری نیست!');
});

bot.command('support', (ctx) => {
  ctx.reply('💬 برای ارتباط با پشتیبانی لطفاً به @YourSupportUsername پیام دهید.');
});

bot.command('exit', (ctx) => {
  ctx.reply('👋 خداحافظ! هر زمان خواستی دوباره از /start استفاده کن.');
});

// هندلر دریافت فایل و لینک مستقیم

bot.on(['document', 'photo', 'video'], async (ctx) => {
  try {
    let fileId;
    let fileSize;

    if (ctx.message.document) {
      fileId = ctx.message.document.file_id;
      fileSize = ctx.message.document.file_size;
    } else if (ctx.message.photo) {
      const photo = ctx.message.photo[ctx.message.photo.length - 1];
      fileId = photo.file_id;
      fileSize = photo.file_size;
    } else if (ctx.message.video) {
      fileId = ctx.message.video.file_id;
      fileSize = ctx.message.video.file_size;
    }

    const MAX_FILE_SIZE = 20 * 1024 * 1024;
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return ctx.reply('⚠️ حجم فایل ارسالی بیش از حد مجاز (20 مگابایت) است. لطفاً فایل کوچکتر ارسال کنید.');
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

bot.on('message', (ctx) => {
  if (!ctx.message.document && !ctx.message.photo && !ctx.message.video) {
    ctx.reply('⚠️ لطفاً فقط فایل، عکس یا ویدیو ارسال کن یا فوروارد کن.');
  }
});

bot.launch().then(() => {
  console.log('🤖 ربات با موفقیت راه‌اندازی شد');
});
