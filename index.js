const axios = require('axios');
const colors = require('colors');
const Discord = require('discord.js');
const config = require('./config.json');
// TCP client
const net = require('net');
const client = new Discord.Client({
	intents: []
});
const {
	REST,
	Routes
} = require('discord.js');
const rest = new REST({
	version: '10'
}).setToken(config.discord.token);

client.on("ready", async () => {
	console.log(`${colors.cyan("[INFO]")} Logged in as ${colors.green(client.user.tag)}`)
	// Load Commands
	console.log(`${colors.cyan("[INFO]")} Loading Commands...`)
	const commands = require('./commands.json');
	await (async () => {
		try {
			console.log(`${colors.cyan("[INFO]")} Registering Commands...`)
			let start = Date.now()
			// Register commands
			await rest.put(
				Routes.applicationCommands(client.user.id), {
					body: commands
				},
			);
			console.log(`${colors.cyan("[INFO]")} Successfully registered commands. Took ${colors.green((Date.now() - start) / 1000)} seconds.`);
		} catch (error) {
			console.error(error);
		}
	})();

	// Log startup time in seconds
	console.log(`${colors.cyan("[INFO]")} Startup took ${colors.green((Date.now() - initTime) / 1000)} seconds.`)
});

client.on("interactionCreate", async interaction => {
	if (interaction.isCommand()) {
		switch (interaction.commandName) {
			case "give": // Give the user a random VNC server
				await interaction.deferReply({
					ephemeral: false
				});
				// Get a random VNC server
				await axios.get("https://computernewb.com/vncresolver/api/scans/vnc/random").then(async (response) => {
					// Get the screenshot URL
					let screenshotURL = `https://computernewb.com/vncresolver/api/scans/vnc/screenshot/${response.data.id}`;
					// Create the embed
					const embed = {
						title: "VNC Server",
						footer: {
							text: `ID: ${response.data.id}`
						},
						image: {
							"url": screenshotURL
						},
						fields: [{
								name: "Address",
								value: `${response.data.ip}:${response.data.port}`,
								inline: true
							},
							{
								name: "Hostname",
								value: response.data.hostname ? response.data.hostname : "Unknown",
								inline: true
							},
							{
								name: "Client Name",
								value: response.data.clientname ? response.data.clientname : "Unknown",
								inline: true
							},
							{
								name: "Screen Resolution",
								value: response.data.screenres ? response.data.screenres : "Unknown",
								inline: true
							},
							{
								name: "Location",
								value: `${response.data.city}, ${response.data.state}, ${response.data.country}`,
								inline: true
							},
							{
								name: "ASN",
								value: response.data.asn ? response.data.asn : "Unknown",
								inline: true
							},
						],
					}
					// Send the embed
					await interaction.editReply({
						embeds: [embed],
						components: reply_comps
					});
				}).catch(async (error) => {
					// If there was an error, send it
					await interaction.editReply({
						content: `An error occurred: ${error}`
					});
				});
				break;
		}
	} else if (interaction.isButton()) {
		switch (interaction.customId) {
			case "give": // Give the user a random VNC server
				// Get a random VNC server
				await axios.get("https://computernewb.com/vncresolver/api/scans/vnc/random").then(async (response) => {
					// Get the screenshot URL
					let screenshotURL = `https://computernewb.com/vncresolver/api/scans/vnc/screenshot/${response.data.id}`;
					// Create the embed
					const embed = {
						title: "VNC Server",
						image: {
							"url": screenshotURL
						},
						footer: {
							text: `ID: ${response.data.id}`
						},
						fields: [{
								name: "Address",
								value: `${response.data.ip}:${response.data.port}`,
								inline: true
							},
							{
								name: "Hostname",
								value: response.data.hostname ? response.data.hostname : "Unknown",
								inline: true
							},
							{
								name: "Client Name",
								value: response.data.clientname ? response.data.clientname : "Unknown",
								inline: true
							},
							{
								name: "Screen Resolution",
								value: response.data.screenres ? response.data.screenres : "Unknown",
								inline: true
							},
							{
								name: "Location",
								value: `${response.data.city}, ${response.data.state}, ${response.data.country}`,
								inline: true
							},
							{
								name: "ASN",
								value: response.data.asn ? response.data.asn : "Unknown",
								inline: true
							},
						],
					}
					// Edit the original message
					await interaction.update({
						embeds: [embed],
						components: reply_comps
					});

				}).catch(async (error) => {
					// If there was an error, send it
					await interaction.update({
						content: `An error occurred: ${error}`
					});
				});
				break;
			case "send": // Send the user a random VNC server
				await interaction.deferReply({
					ephemeral: false
				});
				// Get a random VNC server
				await axios.get("https://computernewb.com/vncresolver/api/scans/vnc/random").then(async (response) => {
					// Get the screenshot URL
					let screenshotURL = `https://computernewb.com/vncresolver/api/scans/vnc/screenshot/${response.data.id}`;
					// Create the embed
					const embed = {
						title: "VNC Server",
						image: {
							"url": screenshotURL
						},
						footer: {
							text: `ID: ${response.data.id}`
						},
						fields: [{
								name: "Address",
								value: `${response.data.ip}:${response.data.port}`,
								inline: true
							},
							{
								name: "Hostname",
								value: response.data.hostname ? response.data.hostname : "Unknown",
								inline: true
							},
							{
								name: "Client Name",
								value: response.data.clientname ? response.data.clientname : "Unknown",
								inline: true
							},
							{
								name: "Screen Resolution",
								value: response.data.screenres ? response.data.screenres : "Unknown",
								inline: true
							},
							{
								name: "Location",
								value: `${response.data.city}, ${response.data.state}, ${response.data.country}`,
								inline: true
							},
							{
								name: "ASN",
								value: response.data.asn ? response.data.asn : "Unknown",
								inline: true
							},
						],
					}
					// Send the embed
					await interaction.editReply({
						embeds: [embed],
						components: reply_comps
					});
				}).catch(async (error) => {
					// If there was an error, send it
					await interaction.editReply({
						content: `${error}`,
						components: reply_comps
					});
				});
				break;
			case "test": // Test the vnc server
				await interaction.deferReply({
					ephemeral: false
				});
				// get the vnc server address from the embed
				let vncAddress = interaction.message.embeds[0].fields[0].value;
				// Test if a connection can be made
				// Open TCP connection
				let socket = new net.Socket();
				socket.setTimeout(10000);
				let start = Date.now();
				socket.connect({
					host: vncAddress.split(":")[0],
					port: vncAddress.split(":")[1]
				}, async () => {
					// If the connection was successful, send the time it took to connect
					await interaction.editReply({
						content: `:white_check_mark: Connection successful! Ping ${Date.now() - start}ms to connect.`
					}).then(() => {
						//delete after 5 seconds
						setTimeout(() => {
							interaction.deleteReply();
						}
						, 5000);
					});;
					// Destroy the socket
					socket.destroy();
				}).on("error", async (error) => {
					// If there was an error, send it
					await interaction.editReply({
						content: `:x: ${error}\nTook ${Date.now() - start}ms`
					}).then(() => {
						//delete after 5 seconds
						setTimeout(() => {
							interaction.deleteReply();
						}
						, 5000);
					});
					// Destroy the socket
					socket.destroy();
				}).on("timeout", async () => {
					// If the connection timed out, send that
					await interaction.editReply({
						content: `:x: Connection timed out! Took ${Date.now() - start}ms`
					}).then(() => {
						//delete after 5 seconds
						setTimeout(() => {
							interaction.deleteReply();
						}
						, 5000);
					});
					// Destroy the socket
					socket.destroy();
				});
				break;
		}
	}


});

// Random shit

// Contents
const reply_comps = [{
	type: 1,
	components: [{
			type: 2,
			emoji: {
				animated: false,
				name: "🔁"
			},
			style: 4,
			custom_id: "give"
		},
		{
			type: 2,
			emoji: {
				animated: false,
				name: "📡"
			},
			style: 1,
			custom_id: "test"
		},
		{
			type: 2,
			emoji: {
				animated: false,
				name: "▶️"
			},
			style: 2,
			custom_id: "send"
		}
	]
}]

// Error handling
process.on('unhandledRejection', error => {
	console.error(`${colors.red("[ERROR]")} Unhandled promise rejection:\n${error}`);
});
process.on('uncaughtException', error => {
	console.error(`${colors.red("[ERROR]")} Uncaught exception:\n${error}`);
});
process.on('warning', error => {
	console.error(`${colors.orange("[WARNING]")} \n${error}`);
});

// Handle SIGINT gracefully
process.on('SIGINT', async () => {
	await console.log(`${colors.cyan("[INFO]")} Stop received, exiting...`);
	await client.user.setPresence({
		status: "invisible",
		activities: []
	});
	await client.destroy();
	await console.log(`${colors.cyan("[INFO]")} Goodbye!`);
	process.exit(0);
});


console.log(`${colors.cyan("[INFO]")} Starting...`)
// Start timer to see how long startup takes
const initTime = Date.now()
// Login to Discord
client.login(config.discord.token);