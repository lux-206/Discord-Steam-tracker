# Steam Status Tracker Discord Bot

This is a Discord bot that tracks a specified Steam user's activity using the Steam Web API. It periodically checks the user's status, sends updates as Discord embeds to a specified channel, and mentions a Discord user when the status changes. The bot updates an existing embed rather than posting new messages, keeping the channel clean.

## Features
- Monitors a Steam user's online status, current game, and last logoff time.
- Sends updates to a Discord channel as an embedded message.
- Mentions a specified Discord user when the Steam status changes (e.g., goes online/offline or switches games).
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