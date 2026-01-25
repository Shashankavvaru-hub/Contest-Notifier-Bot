import axios from "axios";

const CODECHEF_API = "https://www.codechef.com/api/list/contests/all";

export async function fetchCodeChefContests() {
  try {
    const res = await axios.get(CODECHEF_API, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const data = res.data;
    if (!data || !Array.isArray(data.future_contests)) {
      return [];
    }

    return data.future_contests
      .map((c) => {
        const startTime = new Date(c.contest_start_date);
        const endTime = new Date(c.contest_end_date);

        if (isNaN(startTime) || isNaN(endTime)) return null;

        return {
          contestId: c.contest_code,
          name: c.contest_name,
          platform: "codechef",
          startTime,
          durationMinutes: c.contest_duration,
          contestLink: `https://www.codechef.com/${c.contest_code}`,
        };
      })
      .filter(Boolean);
  } catch (error) {
    console.error("CodeChef fetch failed:", error.message);
    return [];
  }
}
