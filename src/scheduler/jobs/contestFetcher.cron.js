import cron from "node-cron";
import { fetchCodeforcesContests } from "../../contests/sources/codeforces/codeforces.fetcher.js";
import { fetchCodeChefContests } from "../../contests/sources/codechef/codechef.fetcher.js";
import { processContests } from "../../contests/contest.service.js";
import { fetchLeetCodeContests } from "../../contests/sources/leetcode/leetcode.fetcher.js";

export function startContestFetcherCron() {
  // Runs every 3 hours
  cron.schedule(
    "0 */3 * * *",
    async () => {
      try {
        const contests = [
          ...(await fetchCodeChefContests()),
          ...(await fetchCodeforcesContests()),
          ...(await fetchLeetCodeContests()),
        ];
        if (!contests.length) {
          console.log("No contests fetched");
          return;
        }

        const insertedCount = await processContests(contests);

        console.log(
          `Contest fetcher finished. New contests added: ${insertedCount}`,
        );
      } catch (error) {
        console.error("Contest fetcher cron failed:", error.message);
      }
    },
    {
      timezone: "Asia/Kolkata",
    },
  );
}