require('dotenv').config();
const { Client, EmbedBuilder } = require('discord.js');
const { checkSteamStatus } = require('./steam_status');

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const DISCORD_ID_TO_MENTION = process.env.DISCORD_ID_TO_MENTION;

// Dynamically load all STEAM_ID_TO_CHECK_X variables
const steamIds = [];
let i = 1;
while (process.env[`STEAM_ID_TO_CHECK_${i}`]) {
    steamIds.push(process.env[`STEAM_ID_TO_CHECK_${i}`]);
    i++;
}

const client = new Client({ intents: ['Guilds', 'GuildMessages'] });

const statusTracker = new Map(); // steamId -> { lastStatus, messageId }

async function updateDiscordEmbed(steamId) {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) {
        console.error('❌ Channel not found.');
        return;
    }

    const status = await checkSteamStatus(steamId, STEAM_API_KEY);
    if (!status) return;

    const embed = new EmbedBuilder()
        .setTitle(`${status.name}'s Steam Status`)
        .setColor(status.playingCSGO ? '#00FF00' : '#FF0000')
        .addFields(
            { name: 'Status', value: status.status, inline: true },
            { name: 'Game', value: status.game, inline: true },
            { name: 'Last Logoff', value: status.lastLogoff }
        )
        .setTimestamp();

    const statusString = JSON.stringify(status);
    const tracker = statusTracker.get(steamId) || { lastStatus: null, messageId: null };
    const statusChanged = tracker.lastStatus !== statusString;

    if (!tracker.messageId) {
        const message = await channel.send({
            content: statusChanged ? `<@${DISCORD_ID_TO_MENTION}>` : '',
            embeds: [embed]
        });
        statusTracker.set(steamId, { lastStatus: statusString, messageId: message.id });
    } else if (statusChanged) {
        await channel.messages.edit(tracker.messageId, {
            content: `<@${DISCORD_ID_TO_MENTION}>`,
            embeds: [embed]
        });
        statusTracker.set(steamId, { lastStatus: statusString, messageId: tracker.messageId });
    } else {
        await channel.messages.edit(tracker.messageId, {
            content: '',
            embeds: [embed]
        });
        statusTracker.set(steamId, { lastStatus: statusString, messageId: tracker.messageId });
    }
}

client.once('ready', () => {
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    console.log(`Tracking ${steamIds.length} Steam users: ${steamIds.join(', ')}`);
    
    setInterval(async () => {
        for (const steamId of steamIds) {
            await updateDiscordEmbed(steamId);
        }
    }, 30000); // Check every 30 seconds

    // Initial check for all users
    steamIds.forEach(steamId => updateDiscordEmbed(steamId));
});

client.login(DISCORD_TOKEN);

client.on('error', (error) => console.error('❌ Discord Client Error:', error));