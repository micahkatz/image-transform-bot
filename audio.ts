import {
    NoSubscriberBehavior,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    entersState,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    joinVoiceChannel,
} from '@discordjs/voice';
import { GatewayIntentBits } from 'discord-api-types/v10';
import {
    Client,
    Constants,
    TextChannel,
    VoiceBasedChannel,
    VoiceChannel,
} from 'discord.js';

import { createDiscordJSAdapter } from './adapter.js';

import 'dotenv/config';

const player = createAudioPlayer();

function playSong() {
    /**
     * Here we are creating an audio resource using a sample song freely available online
     * (see https://www.soundhelix.com/audio-examples)
     *
     * We specify an arbitrary inputType. This means that we aren't too sure what the format of
     * the input is, and that we'd like to have this converted into a format we can use. If we
     * were using an Ogg or WebM source, then we could change this value. However, for now we
     * will leave this as arbitrary.
     */
    const randomSongNumber = Math.floor(Math.random() * 17) + 1; // Generate a random number between 1 and 17

    const resource = createAudioResource(
        `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${randomSongNumber}.mp3`,
        {
            inputType: StreamType.Arbitrary,
        }
    );

    /**
     * We will now play this to the audio player. By default, the audio player will not play until
     * at least one voice connection is subscribed to it, so it is fine to attach our resource to the
     * audio player this early.
     */
    player.play(resource);

    /**
     * Here we are using a helper function. It will resolve if the player enters the Playing
     * state within 5 seconds, otherwise it will reject with an error.
     */
    return entersState(player, AudioPlayerStatus.Playing, 5000);
}

player.on(AudioPlayerStatus.Idle, () => {
    playSong();
});

async function connectToChannel(channel: VoiceBasedChannel) {
    /**
     * Here, we try to establish a connection to a voice channel. If we're already connected
     * to this voice channel, @discordjs/voice will just return the existing connection for us!
     */
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: createDiscordJSAdapter(channel),
    });

    /**
     * If we're dealing with a connection that isn't yet Ready, we can set a reasonable
     * time limit before giving up. In this example, we give the voice connection 30 seconds
     * to enter the ready state before giving up.
     */
    try {
        /**
         * Allow ourselves 30 seconds to join the voice channel. If we do not join within then,
         * an error is thrown.
         */
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        /**
         * At this point, the voice connection is ready within 30 seconds! This means we can
         * start playing audio in the voice channel. We return the connection so it can be
         * used by the caller.
         */
        return connection;
    } catch (error) {
        /**
         * At this point, the voice connection has not entered the Ready state. We should make
         * sure to destroy it, and propagate the error by throwing it, so that the calling function
         * is aware that we failed to connect to the channel.
         */
        try {
            connection && connection.destroy();
        } catch (err) {
            console.log('Connection already destroyed');
        }
        return null;
    }
}
export function initAudioBot() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildVoiceStates,
        ],
    });
    client.on('ready', async () => {
        console.log('Discord.js client is ready!');

        /**
         * Try to get our song ready to play for when the bot joins a voice channel
         */
        try {
            await playSong();
            console.log('Song is ready to play!');
        } catch (error) {
            /**
             * The song isn't ready to play for some reason :(
             */
            console.error(error);
        }
    });
    var connection = null;
    client.on('voiceStateUpdate', async (oldState, newState) => {
        const { guild } = newState;
        const { guild: oldGuild } = oldState;
        const channelId = process.env.DISCORD_VC_ID;
        const messagesChannelId = process.env.DISCORD_MESSAGES_CHANNEL_ID;
        let voiceChannel = (await guild.channels.fetch(channelId, {
            force: true,
        })) as VoiceChannel;
        let oldVoiceChannel = (await oldGuild.channels.fetch(
            channelId
        )) as VoiceChannel;
        let messagesChannel = (await guild.channels.fetch(messagesChannelId, {
            force: true,
        })) as TextChannel;

        voiceChannel.members;
        const membersThatAreNotBots = voiceChannel.members.filter(
            (member) => !member.user.bot
        );
        const oldMembersThatAreNotBots = oldVoiceChannel.members.filter(
            (member) => !member.user.bot
        );
        const numActiveInVoiceChannel = membersThatAreNotBots?.size || 0;
        const oldNumActiveInVoiceChannel = oldMembersThatAreNotBots?.size || 0;
        console.log('oldnumActiveInVoiceChannel', oldNumActiveInVoiceChannel);
        console.log('numActiveInVoiceChannel', numActiveInVoiceChannel);
        // TODO: add back
        // if (numActiveInVoiceChannel === oldNumActiveInVoiceChannel) {
        //     console.log('state has not changed');
        //     return;
        // }
        if (numActiveInVoiceChannel === 1) {
            try {
                connection = await connectToChannel(voiceChannel);
                // TODO: add back
                // messagesChannel.send('BOT TEST MESSAGE');

                /**
                 * We have successfully connected! Now we can subscribe our connection to
                 * the player. This means that the player will play audio in the user's
                 * voice channel.
                 */
                connection.subscribe(player);
            } catch (error) {
                /**
                 * Unable to connect to the voice channel within 30 seconds :(
                 */
                console.error(error);
            }
        } else if (connection) {
            try {
                player.stop();
                connection.destroy();
            } catch (err) {
                console.log('Connection already destroyed');
            }
        }
    });

    void client.login(process.env.DISCORD_TOKEN);
}
