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

    try {
      const contests = await Contest.find({
        notified: true,
        reminderSent: false,
        startTime: { $gt: now },
      });

      for (const contest of contests) {
        const diffMs = contest.startTime.getTime() - now.getTime();

        // Send reminder once contest is within 1 hour
        if (diffMs <= 60 * 60 * 1000 && diffMs > 0) {
          const emoji = PLATFORM_EMOJI[contest.platform] || "🏆";
          const remainingText = formatRemainingTime(diffMs);

          const message = `
⏰ <b>Contest Reminder</b>

${emoji} <b>${contest.platform.toUpperCase()}</b>

<b>${contest.name}</b>
Starts in <b>${remainingText}</b>

<b>URL:</b> ${contest.contestLink}
          `;

          await sendTelegramMessage(message);

          // Atomic update to avoid duplicate reminders
          await Contest.updateOne(
            { _id: contest._id, reminderSent: false },
            { $set: { reminderSent: true } },
          );
        }
      }
    } catch (error) {
      console.error("Contest reminder cron failed:", error.message);
    }
  });
}
