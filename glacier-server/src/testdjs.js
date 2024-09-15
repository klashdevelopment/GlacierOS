// express server
import express from 'express';
import runDiscordBot from './discord.js';

const app = express();
const port = 6000;

runDiscordBot(app);

app.listen(port, () => {
    console.log(`test server started on port ${port}`);
});