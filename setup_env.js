const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to ask questions sequentially
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnv() {
    console.log("Let's set up your .env file for the Discord bot!");

    const steamApiKey = await askQuestion("Enter your Steam API Key: ");
    const steamId = await askQuestion("Enter the Steam ID to check (e.g., 76561198811767137): ");
    const discordToken = await askQuestion("Enter your Discord Bot Token: ");
    const channelId = await askQuestion("Enter the Discord Channel ID: ");
    const discordIdToMention = await askQuestion("Enter the Discord ID to mention: ");

    // Construct .env content
    const envContent = `
STEAM_API_KEY=${steamApiKey}
STEAM_ID_TO_CHECK=${steamId}
DISCORD_TOKEN=${discordToken}
CHANNEL_ID=${channelId}
DISCORD_ID_TO_MENTION=${discordIdToMention}
`.trim();

    // Write to .env file
    fs.writeFile('.env', envContent, (err) => {
        if (err) {
            console.error("❌ Error writing .env file:", err);
        } else {
            console.log("✅ .env file created successfully!");
        }
        rl.close();
    });
}

// Run the setup
setupEnv();