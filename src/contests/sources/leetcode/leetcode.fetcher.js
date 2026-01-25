import axios from "axios";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

export async function fetchLeetCodeContests() {
  try {
    const response = await axios.post(
      LEETCODE_GRAPHQL_URL,
      {
        query: `
          query {
            allContests {
              title
              titleSlug
              startTime
              duration
            }
          }
        `,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    const contests = response.data?.data?.allContests;
    if (!Array.isArray(contests)) return [];

    const now = Date.now() / 1000; // milliseconds to seconds

    return contests
      // only upcoming contests
      .filter((c) => c.startTime > now)
      .map((c) => ({
        contestId: c.titleSlug,
        name: c.title,
        platform: "leetcode",
        startTime: new Date(c.startTime * 1000),
        durationMinutes: Math.floor(c.duration / 60),
        contestLink: `https://leetcode.com/contest/${c.titleSlug}`,
      }));
  } catch (error) {
    console.error("❌ LeetCode fetch failed:", error.message);
    return [];
  }
}
