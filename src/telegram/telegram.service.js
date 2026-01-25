import axios from "axios";
export async function sendTelegramMessage(message) {
  try {
    await axios.post(
      `${process.env.TELEGRAM_API_BASE}/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }
    );
  } catch (error) {
    console.error(
      "Failed to send Telegram message:",
      error.response?.data || error.message
    );
  }
}