import axios from "axios";

export async function fetchCodeforcesContests() {
  try {
    const response = await axios.get(process.env.CODEFORCES_API_URL);
    const contests = response.data.result;
    const upcomingContests = contests
      .filter((contest) => contest.phase === "BEFORE")
      .map((contest) => ({
        contestId: contest.id.toString(),
        name: contest.name,
        platform: "codeforces",
        startTime: new Date(contest.startTimeSeconds * 1000),
        durationMinutes: Math.floor(contest.durationSeconds / 60),
        contestLink: `https://codeforces.com/contest/${contest.id}`,
      }));
    return upcomingContests;
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error);
    return [];
  }
}
