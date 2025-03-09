# Steam Status Tracker Discord Bot

This is a Discord bot that tracks a dynamic number of Steam users' activity using the Steam Web API. It periodically checks their status, sends updates as Discord embeds to a specified channel, and mentions a Discord user when any status changes. The bot updates existing embeds rather than posting new messages, keeping the channel clean.

## Features
- Monitors a user-defined number of Steam users' online status, current game, and last logoff time.
- Sends updates to a Discord channel as embedded messages (one embed per user).
- Mentions a specified Discord user when any Steam status changes (e.g., goes online/offline or switches games).
- Works in environments like GitHub Codespace (no UDP server queries, only HTTP-based Steam API).

## Prerequisites
- **Node.js**: Version 16.x or higher (https://nodejs.org/).
- **Steam API Key**: Obtain from [Steam Community Developer Portal](https://steamcommunity.com/dev/apikey).
- **Discord Bot Token**: Create a bot at [Discord Developer Portal](https://discord.com/developers/applications).
- **Discord Server**: Invite your bot to a server with appropriate permissions.

## Dependencies
The project relies on the following npm packages:
- `discord.js`: For interacting with the Discord API.
- `axios`: For making HTTP requests to the Steam API.
- `dotenv`: For loading environment variables from a `.env` file.

Install them with:
```bash
npm install discord.js axios dotenv