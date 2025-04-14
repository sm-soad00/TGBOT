const axios = require("axios");

module.exports.config = {
  name: "video",
  alices: ["videos"],
  version: "1.0.0",
  permission: 0,
  credits: "Nayan",
  prefix: true,
  description: "Get various types of videos via inline keyboard",
  category: "media",
  usages: "/video or /videos",
  cooldowns: 5,
};

module.exports.start = async ({ event, api }) => {
  const { message } = event;
  const chatId = message.chat.id;

  const videoSelectionMarkup = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Love', callback_data: '/video/love' },
          { text: 'CPL', callback_data: '/video/cpl' }
        ],
        [
          { text: 'Short Video', callback_data: '/video/shortvideo' },
          { text: 'Sad Video', callback_data: '/video/sadvideo' }
        ],
        [
          { text: 'Status', callback_data: '/video/status' },
          { text: 'Shairi', callback_data: '/video/shairi' }
        ],
        [
          { text: 'Baby', callback_data: '/video/baby' },
          { text: 'Anime', callback_data: '/video/anime' }
        ],
        [
          { text: 'Humaiyun', callback_data: '/video/humaiyun' },
          { text: 'Islam', callback_data: '/video/islam' }
        ],
        [
          { text: 'Horny', callback_data: '/video/horny' },
          { text: 'Hot', callback_data: '/video/hot' }
        ],
        [
          { text: 'Random', callback_data: '/video/mixvideo' }
        ]
      ]
    }
  };

  const waitMsg = await api.sendMessage(chatId, "Select Video Type", videoSelectionMarkup);

  api.once('callback_query', async (callbackQuery) => {
    const name = callbackQuery.data;
    await api.deleteMessage(chatId, waitMsg.message_id);

    const waitVoiceMsg = await api.sendMessage(chatId, "Please wait...", { reply_to_message_id: message.message_id });

    try {
      const apis = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
      const n = apis.data.api;
      const data = await axios.get(`${n}${name}`);
      console.log(data.data);
      const url = data.data.data || data.data.url.url;
      const caption = data.data.nayan || `${data.data.cp}`;

      const replyMarkup = {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Bot Owner', url: 'https://t.me/MOHAMMADNAYAN' }]
          ]
        }
      };

      await api.sendVideo(chatId, url, { caption: caption, reply_to_message_id: message.message_id, ...replyMarkup });
      await api.deleteMessage(chatId, waitVoiceMsg.message_id);
    } catch (error) {
      await api.deleteMessage(chatId, waitVoiceMsg.message_id);
      console.error('Error getting file info:', error);
      api.sendMessage(chatId, "❌ Failed to fetch video. Try again later.", { reply_to_message_id: message.message_id });
    }
  });
};
