const { imgur } = require("nayan-imgur-upload-apis");
module.exports = {
  config: {
    name: "imgur",
    credits: "Nayan",
    prefix: "auto",
    aliases: ["up"],
    tags: ["General"],
  },
  start: async ({ event, api, config}) => {

    try {
    const chatId = event.threadId
    const msg = event.message
    if ('reply_to_message' in msg) {
      const repliedMessage = msg.reply_to_message;


      let fileId;
      if (repliedMessage.photo) {
        fileId = repliedMessage.photo[repliedMessage.photo.length - 1].file_id;
      } else if (repliedMessage.video) {
        fileId = repliedMessage.video.file_id;
      } else {
        return api.sendMessage(
          chatId,
          '❌ Please reply to a photo or video message with /imgur to upload it.',
          { reply_to_message_id: msg.message_id }
        );
      }


      const waitMsg = await api.sendMessage(chatId, "Uploading to Imgur...", { reply_to_message_id: msg.message_id });

      const getMediaLink = async (fileId) => {
        const file = await api.getFile(fileId);
        return `https://api.telegram.org/file/bot${config.telegramBotToken}/${file.file_path}`;
      };

      const mediaUrl = await getMediaLink(fileId);
      const encodedMediaUrl = encodeURI(mediaUrl);
        console.log(encodedMediaUrl)


      const result = await imgur(encodedMediaUrl);


      const imgurLink = result.data.link;
await api.sendMessage(chatId, `✅ Uploaded to Imgur:\n[${imgurLink}](${imgurLink})`, {
            parse_mode: 'Markdown',
            reply_to_message_id: event.msg.message_id,
          });


          await api.deleteMessage(chatId, waitMsg.message_id);
        }} catch (error) {
          console.error('Error uploading to Imgur:', error);
          api.sendMessage(chatId, mess.error || "❌ Failed to upload to Imgur.", { reply_to_message_id: msg.message_id });
          await api.deleteMessage(chatId, waitMsg.message_id);
        }
      }
}