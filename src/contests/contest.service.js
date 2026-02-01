import Contest from "./contest.model.js";
import { sendTelegramMessage } from "../telegram/telegram.service.js";

// ✅ Platform → Emoji mapping
const PLATFORM_EMOJI = {
  codeforces: "🟦",
  leetcode: "🟩",
  codechef: "🟧",
};

export async function processContests(contests) {
  contests = contests.flat();
  let insertedCount = 0;

  for (const contest of contests) {
    try {
      const document = await Contest.create(contest);
      const res = document.toObject();

      insertedCount++;

      const emoji = PLATFORM_EMOJI[res.platform] || "🏆";

      const message = `
${emoji} <b>${res.platform.toUpperCase()} Contest Announced</b>

<b>${res.name}</b>
Starts: ${new Date(res.startTime).toLocaleString("en-IN")}
${res.durationMinutes ? `Duration: ${res.durationMinutes} mins` : ""}
      `;

      await sendTelegramMessage(message);

      document.notified = true;
      await document.save();
      
    } catch (error) {
      // Duplicate contest (already exists)
      if (error.code === 11000) {
        continue;
      }

      console.error(
        "❌ Failed to process contest:",
        contest.name,
        error.message,
      );
    }
  }

  return insertedCount;
}
