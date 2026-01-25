import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const message = `
👋 <b>Welcome to Contest Notifier Bot!</b>

I send alerts for upcoming coding contests on:
🟦 Codeforces • 🟩 LeetCode • 🟧 CodeChef

👉 Join the channel to receive all contest alerts.
  `;

  bot.sendMessage(chatId, message, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📢 Join Contest Alerts Channel",
            url: process.env.TELEGRAM_CHANNEL_URL,
          },
        ],
      ],
    },
  });
});
