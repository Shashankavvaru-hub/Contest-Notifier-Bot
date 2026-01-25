import connectDB from "./config/db.js";
import { startContestFetcherCron } from "./scheduler/jobs/contestFetcher.cron.js";
import { startContestReminderCron } from "./scheduler/jobs/contestReminder.cron.js";

export async function startApp() {
  await connectDB();
  startContestFetcherCron();
  startContestReminderCron();
}
