

module.exports = {
  event: 'new_chat_members',
  handle: async ({ msg, bot, moments, event }) => {
    const chatId = msg.chat.id;
    const newUser = msg.new_chat_members[0];

    const timestamp = moments.tz('Asia/Dhaka').format('hh:mm:ss');
    const joinDate = new Date(msg.date * 1000).toLocaleDateString();

    const profilePhoto = await global.userInfo(newUser.username);

    const welcomeMessage = `
🎉 Hai ${newUser.username}! 🎉
Welcome to the group ${msg.chat.title}.
Hour: ${timestamp}
Day: ${joinDate}
Hope you enjoy your stay. 😊
`;

    bot.sendPhoto(chatId, profilePhoto.image, { caption: welcomeMessage });
  },
};