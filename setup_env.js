const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnv() {
    console.log("Let's set up your .env file for the Discord bot!");

    const steamApiKey = await askQuestion("Enter your Steam API Key: ");
    const numUsers = parseInt(await askQuestion("How many Steam users do you want to track? (e.g., 2): "), 10);

    if (isNaN(numUsers) || numUsers < 1) {
        console.error("❌ Please enter a valid number of users (1 or more).");
        rl.close();
        return;
    }

    const steamIds = [];
    for (let i = 1; i <= numUsers; i++) {
        const steamId = await askQuestion(`Enter Steam ID #${i} (e.g., 76561198811767137): `);
        steamIds.push(steamId);
    }

    const discordToken = await askQuestion("Enter your Discord Bot Token: ");
    const channelId = await askQuestion("Enter the Discord Channel ID: ");
    const discordIdToMention = await askQuestion("Enter the Discord ID to mention: ");

    // Construct .env content dynamically
    let envContent = `STEAM_API_KEY=${steamApiKey}\n`;
    steamIds.forEach((id, index) => {
        envContent += `STEAM_ID_TO_CHECK_${index + 1}=${id}\n`;
    });
    envContent += `DISCORD_TOKEN=${discordToken}\nCHANNEL_ID=${channelId}\nDISCORD_ID_TO_MENTION=${discordIdToMention}`;

    fs.writeFile('.env', envContent, (err) => {
        if (err) {
            console.error("❌ Error writing .env file:", err);
        } else {
            console.log("✅ .env file created successfully!");
        }
        rl.close();
    });
}

setupEnv();