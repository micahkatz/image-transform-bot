import { InteractionResponseType, InteractionType } from 'discord-interactions';
import { sendResponse, GetChannelMessages, sendImage } from './utils.js';
import {
    getAllAttachments,
    getEffect,
    uploadImage,
} from './helpers/imageTransformations.js';
import {
    controlDeskLights,
    controlBedLights,
    leetCodeBrag,
} from './helpers/deskControl.js';

import OpenAI from 'openai';

const openai = new OpenAI();
export async function commandHandler({
    res,
    name: commandName,
    channel_id,
    options: args,
}) {
    switch (commandName) {
        case 'image':
            const messageResponse = await GetChannelMessages(channel_id);
            const messages: any = await messageResponse.json();
            let allAttachments = [];
            messages.forEach((message) => {
                allAttachments = [
                    ...allAttachments,
                    ...getAllAttachments(message),
                ];
            });
            console.log({ allAttachments });

            const recentAttachment = allAttachments[0];
            console.log({
                recentAttachment,
                args,
            });

            if (recentAttachment && recentAttachment.url) {
                if (args.length > 0) {
                    var transformationList = [];
                    args.forEach((arg) => {
                        console.log('geteffect', arg, arg.value);
                        transformationList.push(getEffect(arg.value));
                    });

                    const options = {
                        transformation: transformationList,
                    };
                    uploadImage(
                        recentAttachment.url,
                        options,
                        (outputUrl, public_id) => {
                            sendImage(res, outputUrl, public_id);
                        }
                    );
                } else {
                    uploadImage(
                        recentAttachment.url,
                        getEffect(null),
                        async (outputUrl, public_id) => {
                            sendImage(res, outputUrl, public_id);
                        }
                    );
                }
            }
            // return sendResponse(res, 'this is a test from switch')
            break;

        // case 'lc':
        //     console.log('LEETCODE COMMAND RUNNING', args);
        //     const lcNum = args?.[0]?.value;

        //     let lcResponse = `✅ Bragged about doing \`${args?.[0]?.value}\` LC problems today`;
        //     if (lcNum) {
        //         lcResponse = await leetCodeBrag(lcNum, res);
        //         return sendResponse(res, lcResponse);
        //     } else {
        //         return sendResponse(res, lcResponse);
        //     }
        case 'desk':
            console.log('DESK COMMAND RUNNING', args);
            const action = args?.[0]?.value;

            let textResposne = `✅ Updated Micah\'s Desk Lights to \`${args?.[0]?.value}\``;
            if (action) {
                await controlDeskLights(action, args, res);
            } else {
                return sendResponse(res, textResposne);
            }
            break;
        case 'bed':
            console.log('BED COMMAND RUNNING', args);
            const bedAction = args?.[0]?.value;

            let bedTextResposne = `✅ Updated Micah\'s Bed Lights to \`${args?.[0]?.value}\``;
            if (bedAction) {
                await controlBedLights(bedAction, args, res);
            } else {
                return sendResponse(res, bedTextResposne);
            }
            break;
    }
}
