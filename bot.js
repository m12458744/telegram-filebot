const axios = require('axios');
const FormData = require('form-data');

bot.on(['document', 'photo', 'video'], async (ctx) => {
  try {
    const fileId = ctx.message.document?.file_id || ctx.message.photo?.slice(-1)[0]?.file_id || ctx.message.video?.file_id;
    if (!fileId) return ctx.reply('❌ فایل دریافت نشد');

    const fileLink = await ctx.telegram.getFileLink(fileId);

    // دانلود فایل با timeout طولانی (5 دقیقه)
    const response = await axios.get(fileLink.href, { responseType: 'stream', timeout: 300000 });

    const form = new FormData();
    form.append('file', response.data, {
      filename: 'file_' + Date.now()
    });

    // آپلود فایل با تنظیمات مناسب حجم و timeout
    const uploadRes = await axios.post('https://otpbale.freehost.io/uploads/upload.php', form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 300000
    });

    if (uploadRes.data?.url) {
      ctx.reply(`✅ فایل شما دریافت شد.\n🔗 لینک مستقیم:\n${uploadRes.data.url}`);
    } else {
      console.error('Upload failed response:', uploadRes.data);
      ctx.reply('❌ خطا در آپلود فایل');
    }
  } catch (err) {
    console.error('Upload error:', err.response?.data || err.message);
    ctx.reply('❌ دریافت یا آپلود فایل با خطا مواجه شد.');
  }
});
