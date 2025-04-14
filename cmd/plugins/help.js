module.exports = {
  config: {
    name: "help",
    credits: "Nayan",
    aliases: ["menu", "command", "commands"],
    prefix: true,
    permission: 0,
    description: "Displays the help menu with commands",
    tags: ["Utility"],
  },
  start: async ({ event, api, pluginsLoad, isAdmin }) => {
    const commandsPerPage = 10;
    const commandsPerRow = 2;

    const ck = isAdmin()

    const createKeyboard = (commands, page, totalPages) => {
      const rows = [];
      for (let i = 0; i < commands.length; i += commandsPerRow) {
        rows.push(
          commands.slice(i, i + commandsPerRow).map((cmd) => ({
            text: cmd,
            callback_data: `help:command:${cmd}`,
          }))
        );
      }

      const navigationButtons = [];
      if (page > 1) navigationButtons.push({ text: '⬅️ Previous', callback_data: `help:prev:${page - 1}` });
      if (page < totalPages) navigationButtons.push({ text: '➡️ Next', callback_data: `help:next:${page + 1}` });
      if (navigationButtons.length) rows.push(navigationButtons);

      return { inline_keyboard: rows };
    };

    const getAllCommands = () => {
      return pluginsLoad.map((plugin) => plugin.config.name);
    };

    const chatId = event.msg.chat.id;
    const commands = getAllCommands();
    const totalPages = Math.ceil(commands.length / commandsPerPage);

    const currentPage = 1;
    const start = (currentPage - 1) * commandsPerPage;
    const end = start + commandsPerPage;
    const pageCommands = commands.slice(start, end);

    const keyboard = createKeyboard(pageCommands, currentPage, totalPages);
    const text = `📋 *Help Menu* (Page ${currentPage}/${totalPages})\n\nSelect a command to execute.`;

    await api.sendMessage(chatId, text, {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    });

    api.on('callback_query', async (callbackQuery) => {
      const { id, data, message } = callbackQuery;
      const [action, type, param] = data.split(':');

      if (action === 'help') {
        if (type === 'next' || type === 'prev') {
          const currentPage = parseInt(param, 10);

          const start = (currentPage - 1) * commandsPerPage;
          const end = start + commandsPerPage;
          const pageCommands = commands.slice(start, end);

          const keyboard = createKeyboard(pageCommands, currentPage, totalPages);
          const newText = `📋 *Help Menu* (Page ${currentPage}/${totalPages})\n\nSelect a command to execute.`;

          // Prevent unnecessary updates
          if (
            message.text === newText &&
            JSON.stringify(message.reply_markup.inline_keyboard) === JSON.stringify(keyboard.inline_keyboard)
          ) {
            await api.answerCallbackQuery(id, { text: "This is already the current page." });
            return;
          }

          await api.editMessageText(newText, {
            chat_id: message.chat.id,
            message_id: message.message_id,
            reply_markup: keyboard,
            parse_mode: 'Markdown',
          });

          await api.answerCallbackQuery(id);
        }

        if (type === 'command') {
          const selectedCommand = param;
          const plugin = pluginsLoad.find((p) => p.config.name === selectedCommand);

          if (plugin) {
            const { name, credits, permission, description, aliases } = plugin.config;
            const permissionMessage = permission === 2 ? "⚠️ Admin only" : "✅ All users can use";
            const aliasesMessage = aliases && aliases.length ? `Aliases: ${aliases.join(", ")}` : "Aliases: undefined";

            await api.answerCallbackQuery(id, { text: `Command selected: ${selectedCommand}` });
            return api.sendMessage(
              chatId,
              `ℹ️ Command: *${name}*\nCredits: ${credits || "Unknown"}\nPermission: ${permissionMessage}\nDescription: ${description || "No description"}\n${aliasesMessage}`,
              { parse_mode: 'Markdown' }
            );
          } else {
            await api.answerCallbackQuery(id, { text: "Command not found." });
            return api.sendMessage(chatId, "⚠️ Command not found or not loaded.");
          }
        }
      }
    });
  },
};
