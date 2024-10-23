import { InteractionResponseType, InteractionType } from 'discord-interactions';
import 'dotenv/config';
import express from 'express';
import { commandHandler } from './handlers.js';
import { VerifyDiscordRequest, getRandomEmoji } from './utils.js';
import { initAudioBot } from './audio.js';
// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
    // Interaction type and data
    const { type, id, data, channel_id } = req.body;
    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name, options } = data;

        return commandHandler({ res, name, channel_id, options });
    }
});

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
    initAudioBot();
});
