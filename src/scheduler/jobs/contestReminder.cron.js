import cron from "node-cron";
import Contest from "../../contests/contest.model.js";
import { sendTelegramMessage } from "../../telegram/telegram.service.js";

const PLATFORM_EMOJI = {
  codeforces: "🟦",
  leetcode: "🟩",
  codechef: "🟧",
};

function formatRemainingTime(ms) {
  const totalMinutes = Math.floor(ms / (1000 * 60));

  if (totalMinutes < 60) {
    return `${totalMinutes} minutes`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minutes`;
}

export function startContestReminderCron() {
  // Runs every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();
    const from = new Date(now.getTime() + 55 * 60 * 1000);
    const to = new Date(now.getTime() + 65 * 60 * 1000);

    try {
      const contests = await Contest.find({
        notified: true,
        reminderSent: false,
        startTime: {
          $gte: from,
          $lte: to,
        },
      });

      for (const contest of contests) {
        const emoji = PLATFORM_EMOJI[contest.platform] || "🏆";
        const remainingMs = contest.startTime.getTime() - Date.now();
        const remainingText = formatRemainingTime(remainingMs);
        const message = `
⏰ <b>Contest Reminder</b>

${emoji} <b>${contest.platform.toUpperCase()}</b>

<b>${contest.name}</b>
Starts in <b>${remainingText}</b>

<b>URL: </b>${contest.contestLink}
            `;
        await sendTelegramMessage(message);

        contest.reminderSent = true;
        await contest.save();
      }
    } catch (error) {
      console.error("Contest reminder cron failed:", error.message);
    }
  });
}
