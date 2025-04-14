module.exports = {
  config: {
    name: "start",
    credits: "Nayan",
    prefix: true,
    aliases: ["start"],
    permission: 0,
    description: "Welcome message and bot introduction",
    tags: ["main"],
  },
  start: async ({ event, api, config }) => {
      const From = event.msg.chat.id;
      const user = event.msg.from;
      const caption = `Hi ${user.first_name}! Welcome to NAYAN-BOT. I'm a Telegram bot created by Nayan to help you 😄. Please type /menu to see all our menu lists.`;

     
      api.sendMessage(From, caption, { reply_to_message_id: event.msg.message_id });
    }
  };
