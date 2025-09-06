bot.on(['photo', 'video', 'document'], async (ctx) => {
  let fileId;

  if (ctx.message.photo) {
    fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  } else if (ctx.message.video) {
    fileId = ctx.message.video.file_id;
  } else if (ctx.message.document) {
    fileId = ctx.message.document.file_id;
  }

  if (fileId) {
    const link = await ctx.telegram.getFileLink(fileId);
    await ctx.reply(`لینک دانلود فایل شما:\n${link.href}`);
  } else {
    await ctx.reply('لطفا فایل ارسال کنید.');
  }
});
