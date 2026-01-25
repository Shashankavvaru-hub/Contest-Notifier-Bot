# ContestNotifierBot – Contest Alerts

ContestNotifierBot is a **Telegram-based contest alert system** designed for competitive programmers. It automatically fetches upcoming coding contests from **Codeforces**, **LeetCode**, and **CodeChef**, stores them in a database, and sends timely reminders via a Telegram broadcast channel—ensuring you never miss a contest.

Built for scalability, the system uses a centralized broadcast channel architecture to deliver alerts to unlimited users without individual message overhead.

---

## Features

- **Automated Contest Fetching**: Continuously monitors multiple contest platforms
- **Multi-Platform Support**: Integrates with Codeforces, LeetCode, and CodeChef
- **Direct Contest Links**: Inline buttons to quickly access contests
- **Scalable Broadcasting**: Telegram channel-based delivery supporting unlimited subscribers
- **User Onboarding**: Telegram bot with `/start` command for channel enrollment
- **Clean Architecture**: Well-structured backend with separation of concerns and scheduled jobs

---

## System Architecture

```
Contest Data Sources
  ↓
  ├─ Codeforces (REST API)
  ├─ LeetCode (GraphQL)
  └─ CodeChef (REST API)
  ↓
Fetcher Cron Jobs (Automated Contest Collection)
  ↓
MongoDB Database (Persistent Storage)
  ↓
Reminder Cron Job (Alert Processing)
  ↓
Telegram Channel (User Notifications)
```

---

## Technology Stack

| Category                 | Technology                                           |
| ------------------------ | ---------------------------------------------------- |
| **Runtime**              | Node.js                                              |
| **Database**             | MongoDB with Mongoose ODM                            |
| **Task Scheduling**      | node-cron                                            |
| **HTTP Client**          | Axios                                                |
| **Telegram Integration** | node-telegram-bot-api                                |
| **API Integrations**     | REST APIs (Codeforces, CodeChef), GraphQL (LeetCode) |

---

## Supported Platforms

| Platform   | Integration Type |
| ---------- | ---------------- |
| Codeforces | REST API         |
| LeetCode   | GraphQL API      |
| CodeChef   | REST API         |

---

## Telegram Integration

### Broadcast Channel

All contest alerts are distributed through a dedicated **Telegram Channel**, enabling:

- Centralized message delivery to all subscribers
- Unlimited user scaling without per-user messaging overhead
- Consistent notification format across the user base

### Onboarding Bot

Users interact with a dedicated Telegram bot to:

- Receive a welcome message via the `/start` command
- Get a direct button link to join the contest alerts channel
- Streamline the onboarding experience

---

## Reminder Logic

The system implements an efficient reminder mechanism:

- **Frequency**: Reminder cron job runs every 10 minutes
- **Window**: Identifies contests starting within the next 1 hour
- **Deduplication**: Each contest receives exactly one reminder notification
- **State Management**: Database flags prevent duplicate alert transmission

This approach balances real-time notification delivery with system efficiency.

---

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Telegram Configuration
BOT_TOKEN=your_telegram_bot_token
CHAT_ID=your_channel_chat_id
TELEGRAM_CHANNEL_URL=https://t.me/YourChannelName
TELEGRAM_API_BASE=https://api.telegram.org
```

### Required Variables Explanation

| Variable               | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| `MONGO_URI`            | MongoDB connection string for contest storage             |
| `BOT_TOKEN`            | Telegram Bot API token from BotFather                     |
| `CHAT_ID`              | Telegram channel ID for alert broadcasting                |
| `TELEGRAM_CHANNEL_URL` | Public URL to your Telegram channel                       |
| `TELEGRAM_API_BASE`    | Telegram API endpoint (default: https://api.telegram.org) |
