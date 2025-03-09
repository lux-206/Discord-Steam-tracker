const axios = require('axios');

async function checkSteamStatus(steamId, apiKey) {
    try {
        const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;
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
            rawState: player.personastate, // Raw state number for display
            game: player.gameextrainfo || (player.gameid ? `AppID ${player.gameid}` : 'Not in a game'),
            lastLogoff: player.lastlogoff ? new Date(player.lastlogoff * 1000).toLocaleString() : 'N/A',
          //  playingCSGO: player.gameid === '730',
            accountCreated: player.timecreated ? new Date(player.timecreated * 1000).toLocaleString() : 'N/A',
            visibility: player.communityvisibilitystate === 3 ? 'Public' : 'Private/Friends Only'
        };
    } catch (error) {
        console.error(`❌ Error fetching Steam status for ${steamId}:`, error.message);
        return null;
    }
}

module.exports = { checkSteamStatus };
