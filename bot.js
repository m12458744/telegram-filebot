const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

bot.on(['document', 'photo', 'video'], async (ctx) => {
  try {
    const fileId = ctx.message.document?.file_id || ctx.message.photo?.slice(-1)[0]?.file_id || ctx.message.video?.file_id;
    if (!fileId) return ctx.reply('❌ فایل دریافت نشد');

    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: 'stream' });

    const form = new FormData();
    form.append('file', response.data, {
      filename: 'file_' + Date.now()
    });

    const uploadRes = await axios.post('https://otpbale.freehost.io/api/upload.php', form, {
      headers: form.getHeaders()
    });

    const uploadedUrl = uploadRes.data?.url;
    if (uploadedUrl) {
      ctx.reply(`✅ فایل شما دریافت شد.\n🔗 لینک مستقیم:\n${uploadedUrl}`);
    } else {
      ctx.reply('❌ خطا در آپلود فایل');
    }
  } catch (err) {
    console.error('خطا:', err.message);
    ctx.reply('❌ دریافت یا آپلود فایل با خطا مواجه شد.');
  }
});
