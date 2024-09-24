// djs bot with slash command
import { Client, Events, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';
dotenv.config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

export default function runDiscordBot(callback) {
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

    const commands = [
        new SlashCommandBuilder()
            .setName('welcome')
            .setDescription('Welcome new members to Glacier!')
    ];

    const rest = new REST({ version: '9' }).setToken(token);

    function combine(a, b) {
        for (const key of Object.keys(b)) {
            a[key] = b[key];
        }

        return a;
    }

    (async () => {
        try {
            console.log('(discord helper) Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationCommands(clientId),
                {
                    body: commands.map(command => combine(command.toJSON(), {
                        "context": [0, 1, 2],
                        "interaction_types": [0]
                    }))
                },
            );

            callback((req, res) => {
                // Get all forum posts from forum channel "1276627399605354546" and return them as JSON:
                // {title, content: [{author, content}]}
                const forumChannel = client.channels.cache.get('1276627399605354546');
                const getThreadsData = async () => {
                    const posts = await Promise.all(
                        forumChannel.threads.cache.map(async (thread) => {
                            const fetchedMessages = await thread.messages.fetch({ limit: 100 });
                            return {
                                title: thread.name,
                                content: fetchedMessages.reverse().map((message) => {
                                    return {
                                        author: message.author.username,
                                        content: message.content,
                                    };
                                }),
                            };
                        })
                    );

                    return posts;
                };
                getThreadsData()
                    .then((posts) => res.json(posts))
                    .catch((error) => {
                        console.error('Error fetching threads:', error);
                        res.status(500).json({ error: 'Failed to fetch threads' });
                    });
            }, ()=>{
                client.channels.cache.get('1287437652781437072').send('Glacier is offline - it may have restarted due to updates or inactivity.');
            })

            console.log('(discord helper) Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();

    client.on(Events.ClientReady, () => {
        console.log(`(discord helper) Logged in as ${client.user.tag}!`);
        client.channels.cache.get('1287437652781437072').send('Glacier is online.');
    });

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        if (commandName === 'ping') {
            await interaction.reply('Pong!');
        }
    });

    client.login(token);
}