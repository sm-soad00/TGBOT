module.exports = {
  config: {
    name: "broadcast",
    credits: "Nayan",
    prefix: "auto",
    permission: 0,
    aliases: ["bc"],
    description: "Broadcast Msg To all grp mamber",
    tags: ["General"],
  },
    start: async ({ event, api, admin }) => {
    const usersMap = new Map();


      const msg = event.msg
      const chatId = msg.chat.id;
      const broadcastMessage = event.body; // Extract broadcast message
        const userId = msg.from.id;


      console.log(msg)
      if (!admin.includes(String(userId))) {
        api.sendMessage(chatId, '❌ You are not authorized to use this command.', {
          reply_to_message_id: msg.message_id,
        });
        return;
      }

      if (!broadcastMessage) {
        api.sendMessage(chatId, '❌ Please provide a message to broadcast!', {
          reply_to_message_id: msg.message_id,
        });
        return;
      }


      usersMap.forEach((userInfo, userId) => {
        api.sendMessage(userId, broadcastMessage).catch((err) => {
          console.error(`Failed to send message to ${userId}:`, err);
        });
      });

      api.sendMessage(chatId, `✅ Broadcast sent to ${usersMap.size} users.`, {
        reply_to_message_id: msg.message_id,
      });

    api.on('message', (msg) => {
      const userId = msg.from.id;
      const userInfo = {
        username: msg.from.username || 'N/A',
        phoneNumber: msg.contact?.phone_number || 'N/A',
        userId: msg.from.id,
        messageId: msg.message_id,
      };

      usersMap.set(userId, userInfo); // Save user info for broadcasting
    });
  },
};

