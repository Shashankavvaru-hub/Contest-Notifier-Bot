import cron from "node-cron";
import Contest from "../../contests/contest.model.js";
import { sendTelegramMessage } from "../../telegram/telegram.service.js";

const PLATFORM_EMOJI = {
  codeforces: "🟦",
  leetcode: "🟩",
  codechef: "🟧",
};

export function startContestReminderCron() {
  // Runs every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    try {
      const contests = await Contest.find({
        reminderSent: false,
        startTime: {
          $gt: now,   
          $lte: oneHourLater,
        },
      });

      for (const contest of contests) {
        const emoji = PLATFORM_EMOJI[contest.platform] || "🏆";
        const message = `
⏰ <b>Contest Reminder</b>
${emoji} <b>${contest.platform.toUpperCase()}</b>
<b>${contest.name}</b>
Starts in <b>1 hour</b>
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
