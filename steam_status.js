require('dotenv').config();
const { Client, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID_TO_CHECK = process.env.STEAM_ID_TO_CHECK;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const DISCORD_ID_TO_MENTION = process.env.DISCORD_ID_TO_MENTION;

const client = new Client({ intents: ['Guilds', 'GuildMessages'] });

let lastStatus = null;
let messageId = null;

async function checkSteamStatus() {
    try {
        const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${STEAM_ID_TO_CHECK}`;
        const response = await axios.get(url);
        const player = response.data.response.players[0];

        if (!player) return null;

        const stateMap = {
            0: 'Offline',
            1: 'Online',
            2: 'Busy',
            3: 'Away',
            4: 'Snooze',
            5: 'Looking to trade',
            6: 'Looking to play'
        };

        return {
            name: player.personaname,
            status: stateMap[player.personastate] || 'Unknown',
            game: player.gameextrainfo || (player.gameid ? `AppID ${player.gameid}` : 'Not in a game'),
            lastLogoff: player.lastlogoff ? new Date(player.lastlogoff * 1000).toLocaleString() : 'N/A',
            playingCSGO: player.gameid === '730'
        };
    } catch (error) {
        console.error('❌ Error fetching Steam status:', error.message);
        return null;
    }
}

async function updateDiscordEmbed() {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) {
        console.error('❌ Channel not found.');
        return;
    }

    const status = await checkSteamStatus();
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
    const statusChanged = lastStatus !== statusString;

    if (!messageId) {
        const message = await channel.send({
            content: statusChanged ? `<@${DISCORD_ID_TO_MENTION}>` : '',
            embeds: [embed]
        });
        messageId = message.id;
    } else if (statusChanged) {
        await channel.messages.edit(messageId, {
            content: `<@${DISCORD_ID_TO_MENTION}>`,
            embeds: [embed]
        });
    } else {
        await channel.messages.edit(messageId, {
            content: '',
            embeds: [embed]
        });
    }

    lastStatus = statusString;
}

client.once('ready', () => {
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    setInterval(updateDiscordEmbed, 30000);
    updateDiscordEmbed();
});

client.login(DISCORD_TOKEN);

client.on('error', (error) => console.error('❌ Discord Client Error:', error));