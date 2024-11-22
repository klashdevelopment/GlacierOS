// djs bot with slash command
import { ActivityType, Client, Events, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv';
import applist from "../client/applist.json" with {type: "json"};
dotenv.config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

var links = {};

export default function runDiscordBot(callback) {
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

    const commands = [
        new SlashCommandBuilder()
            .setName('welcome')
            .setDescription('Welcome new members to Glacier!')
            .addUserOption(option => option.setName('user').setDescription('The user to welcome').setRequired(true))
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
                client.channels.cache.get('1307158665622720562').send('Glacier\'s primary server is offline - it may have restarted due to updates or inactivity.');
            })

            console.log('(discord helper) Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();

    function getRandomGame(){
        var game = applist[Math.floor(Math.random() * applist.length)];
        if(!game.category.includes('Games')) return getRandomGame();
        return game;
    }

    async function updateStatus() {
        client.user.setPresence({
            activities: [{
                name: `${getRandomGame().name} on Glacier`,
                type: ActivityType.Playing,
                url: 'https://glacier.fly.dev/'
            }], 
            status: 'online' 
        });
    }

    client.on(Events.ClientReady, async () => {
        console.log(`(discord helper) Logged in as ${client.user.tag}!`);
        client.channels.cache.get('1307158665622720562').send('Glacier\'s '+((process.env.NODE_ENV || 'development') == 'development' ? 'development' : 'primary')+' server has booted up.');
        try {
            fetch('https://raw.githack.com/klashdevelopment/glacier-data-repo/main/links.json')
            .then(res => res.json())
            .then(data => {
                links = data;
            })
        } catch (err) {
            links = {};
            console.log("Unable to fetch links for links bot.");
        }
        setTimeout(()=>{
            updateStatus();
            setInterval(updateStatus, 1000 * 60 * 60);
        }, 1000);
    });

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        if (commandName === 'welcome') {
            await interaction.reply({
                content: "Sending welcome!",
                ephemeral: true
            });
            const user = interaction.options.getUser('user');
            await interaction.guild.channels.cache.get('1307158665622720562').send(`Welcome to Glacier, ${user}!`);
        }
    });

    client.login(token);
}