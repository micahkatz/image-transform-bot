import fetch from 'node-fetch'
import secret from '../secret.json' assert { type: "json" };
import { sendResponse } from '../utils.js'
import lightScenes from '../constants/lightScenes.js'
import moment from 'moment-timezone'
const deskLights = secret.deskLights
const bedLights = secret.bedLights

const setColor = async(device, { r, g, b }) => {
    console.log(device)
    var myHeaders = new Headers();
    myHeaders.append("Govee-API-Key", secret['govee-api-key']);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "device": device.mac,
        "model": device.model,
        "cmd": {
            "name": "color",
            "value": {
                "r": r,
                "g": g,
                "b": b
            }
        }
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch("https://developer-api.govee.com/v1/devices/control", requestOptions)
}
const changePowerState = (device, shouldTurnOn = true) => {
    var myHeaders = new Headers();
    myHeaders.append("Govee-API-Key", secret['govee-api-key']);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "device": device.mac,
        "model": device.model,
        "cmd": {
            "name": "turn",
            "value": shouldTurnOn ? "on" : "off"
        }
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch("https://developer-api.govee.com/v1/devices/control", requestOptions)
}
const setBrightness = (device, brightness = 50) => {
    var myHeaders = new Headers();
    myHeaders.append("Govee-API-Key", secret['govee-api-key']);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "device": device.mac,
        "model": device.model,
        "cmd": {
            "name": "brightness",
            "value": brightness
        }
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch("https://developer-api.govee.com/v1/devices/control", requestOptions)
}
const setScene = (device, sceneId) => {
    var myHeaders = new Headers();
    myHeaders.append("Govee-API-Key", secret['govee-api-key']);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({

        "requestId": "uuid",
        "payload": {
            "device": device.mac,
            "sku": device.model,
            "capability": {
                "type": "devices.capabilities.dynamic_scene",
                "instance": "lightScene",
                "value": sceneId
            }
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch("https://openapi.api.govee.com/router/api/v1/device/control", requestOptions)
}


function isBetween845And930Weekday(dateTime) {
    const isWeekday = dateTime.day() >= 1 && dateTime.day() <= 5; // Monday to Friday
    const start = moment.tz('America/Chicago').set({ year: 2024, month: 4, date: 6,hour: 8, minute: 44, seconds:0 })
    const end = moment.tz('America/Chicago').set({ year: 2024, month: 4, date: 6,hour: 9, minute: 30, seconds:0 })
    const isBetween = dateTime.set({year: 2024, month: 4, date: 6}).isBetween(start,end);
    console.log({isWeekday, isBetween, dateTime: dateTime.toLocaleString(), start: start.toLocaleString(), end: end.toLocaleString()})
    return isWeekday && isBetween;
}

const leetCodeBrag = async (num, res) => {
    const device = deskLights
    var shouldPowerOn = true
    const maxIterations = parseInt(num * 2)
    var isFirstTime = true

    setColor(device, { r: 0, g: 255, b: 0 })
    await new Promise(r => setTimeout(r, 2000));



    // for (let intervalIndex = 0; intervalIndex < maxIterations; intervalIndex++) {
    //     shouldPowerOn = !shouldPowerOn
    //     const powerStateResponse = await changePowerState(device, shouldPowerOn)
    //     const textResponse = await powerStateResponse.text()
    //     console.log('powerstateresponse', textResponse, powerStateResponse.status, powerStateResponse.ok)
    //     if (!powerStateResponse.ok) {
    //     //    return sendResponse(res, `😢There was an error\n\n\`${textResponse}\``)
    //     } else if (isFirstTime) {
    //         isFirstTime = false
    //         // sendResponse( `✅ Bragged about doing ${num} LC problems today`)
    //     }
    //     await new Promise(r => setTimeout(r, 2000));
    // }

   }
const controlDeskLights = async (kind = 'SET_RED', args, res) => 
    controlDevice(kind, args, res, deskLights, 'Desk Lights')
const controlBedLights = async (kind = 'SET_RED', args, res) => {

    if (isBetween845And930Weekday(moment())) {
        console.log("It's between 8:45 AM and 9:30 AM on a weekday.");
        return await controlDevice(kind, args, res, bedLights, 'Bed Lights')
    }
    console.log("It's not between 8:45 AM and 9:30 AM on a weekday.");

    return sendResponse(res, `❌ You can only change Micah\'s Bed Lights between 8:45 AM and 9:30 AM on a weekday 🥺🥺🥺`)

}

// // Test cases
// const testCases = [
//     // Saturday
//     { dateTime: moment.tz({ year: 2024, month: 4, date: 4, hour: 8, minute: 44, second: 59 }, 'America/Chicago'), expected: false }, // May 4 at 8:44am
//     { dateTime: moment.tz({ year: 2024, month: 4, date: 4, hour: 8, minute: 45 }, 'America/Chicago'), expected: false }, // May 4 at 8:45am
//     { dateTime: moment.tz({ year: 2024, month: 4, date: 4, hour: 9, minute: 30 }, 'America/Chicago'), expected: false }, // May 4 at 9:30am
//     { dateTime: moment.tz({ year: 2024, month: 4, date: 4, hour: 9, minute: 30, second: 1 }, 'America/Chicago'), expected: false }, // May 4 at 9:30:01am
    
//     // Sunday
//     { dateTime: moment.tz({ year: 2024, month: 4, date: 5, hour: 8, minute: 45 }, 'America/Chicago'), expected: false }, // May 5 at 8:45am
//     { dateTime: moment.tz({ year: 2024, month: 4, date: 5, hour: 9, minute: 30 }, 'America/Chicago'), expected: false }, // May 5 at 9:30am
//     { dateTime: moment.tz({ year: 2024, month: 4, date: 5, hour: 9, minute: 30, second: 1 }, 'America/Chicago'), expected: false }, // May 5 at 9:30:01am
    
//     // Wednesday
//     // { dateTime: moment.tz({ year: 2024, month: 4, date: 8, hour: 8, minute: 44, second: 59 }, 'America/Chicago'), expected: false }, // May 8 at 8:44am
//     { dateTime: moment.tz({ year: 2024, month: 4, date: 8, hour: 8, minute: 45 }, 'America/Chicago'), expected: true }, // May 8 at 8:45am
//     { dateTime: moment.tz({ year: 2024, month: 4, date: 8, hour: 9, minute: 15 }, 'America/Chicago'), expected: true }, // May 8 at 9:15am
//     { dateTime: moment.tz({ year: 2024, month: 4, date: 8, hour: 9, minute: 30 }, 'America/Chicago'), expected: true }, // May 8 at 9:30am
//     { dateTime: moment.tz({ year: 2024, month: 4, date: 8, hour: 9, minute: 30, second: 1 }, 'America/Chicago'), expected: false }, // May 8 at 9:30:01am
// ]

// testCases.forEach((testCase, index) => {
//     const result = isBetween845And930Weekday(testCase.dateTime);
//     console.log(`Test Case ${index + 1}: ${result === testCase.expected ? 'Passed' : 'Failed'}`);
// });

const controlDevice = async (kind = 'SET_RED', args, res, device, deviceName) => {
    if (kind.includes('SET_SCENE')) {
        const sceneId = kind.replace('SET_SCENE_', '')
        const numericalSceneId = parseInt(sceneId)
        setScene(device, numericalSceneId)
        const foundScene = lightScenes.find(item=> item.value.id === numericalSceneId)
        return sendResponse(res, `✅ Set Micah\'s ${deviceName} to \`${foundScene?.name || 'Scene'}\``)
    }
    switch (kind) {
        case 'SET_RED':
            setColor(device, { r: 255, g: 0, b: 0 })
            sendResponse(res, `✅ Set Micah\'s ${deviceName} to Red`)
            break;
        case 'SET_GREEN':
            setColor(device, { r: 0, g: 255, b: 0 })
            sendResponse(res, `✅ Set Micah\'s ${deviceName} to Green`)
            break;
        case 'SET_BLUE':
            setColor(device, { r: 0, g: 0, b: 255 })
            sendResponse(res, `✅ Set Micah\'s ${deviceName} to Blue`)
            break;
        case 'SET_YELLOW':
            setColor(device, { r: 255, g: 255, b: 0 })
            sendResponse(res, `✅ Set Micah\'s ${deviceName} to Yellow`)
            break;
        case 'SET_PURPLE':
            setColor(device, { r: 128, g: 0, b: 128 })
            sendResponse(res, `✅ Set Micah\'s ${deviceName} to Purple`)
            break;
        case 'SET_CYAN':
            setColor(device, { r: 0, g: 255, b: 255 })
            sendResponse(res, `✅ Set Micah\'s ${deviceName} to Cyan`)
            break;
        case 'SET_ORANGE':
            setColor(device, { r: 255, g: 165, b: 0 })
            sendResponse(res, `✅ Set Micah\'s ${deviceName} to Orange`)
            break;
        case 'SET_PINK':
            setColor(device, { r: 255, g: 192, b: 203 })
            sendResponse(res, `✅ Set Micah\'s ${deviceName} to Pink`)
            break;
        case 'SET_TURQUOISE':
            setColor(device, { r: 64, g: 224, b: 208 })
            sendResponse(res, `✅ Set Micah\'s ${deviceName} to Turquoise`)
            break;
        case 'SET_LAVENDER':
            setColor(device, { r: 230, g: 230, b: 250 })
            sendResponse(res, `✅ Set Micah\'s ${deviceName} to Lavender`)
            break;
        case 'POWER_ON':
            changePowerState(device, true)
            sendResponse(res, `✅ Turned on Micah\'s ${deviceName}`)
            break;
        case 'POWER_OFF':
            changePowerState(device, false)
            sendResponse(res, `✅ Turned off Micah\'s ${deviceName}`)
            break;
        case 'SET_BRIGHTNESS_HIGH':
            setBrightness(device, 100)
            sendResponse(res, `✅ Set Brightness for Micah\'s ${deviceName} to 100\%`)
            break;
        case 'SET_BRIGHTNESS_MED':
            setBrightness(device, 50)
            sendResponse(res, `✅ Set Brightness for Micah\'s ${deviceName} to 50\%`)
            break;
        case 'SET_BRIGHTNESS_LOW':
            setBrightness(device, 10)
            sendResponse(res, `✅ Set Brightness for Micah\'s ${deviceName} to 10\%`)
            break;
        case 'ALERT':

            var shouldPowerOn = true
            const maxIterations = 5
            var isFirstTime = true

            for (let intervalIndex = 0; intervalIndex < maxIterations; intervalIndex++) {
                shouldPowerOn = !shouldPowerOn
                const powerStateResponse = await changePowerState(device, shouldPowerOn)
                const textResponse = await powerStateResponse.text()
                console.log('powerstateresponse', textResponse, powerStateResponse.status, powerStateResponse.ok)
                if (!powerStateResponse.ok) {
                    return sendResponse(res, `😢There was an error\n\n\`${textResponse}\``)
                } else if (isFirstTime) {
                    sendResponse(res, `✅ Alerting Micah by spamming his ${deviceName}`)
                    isFirstTime = false
                }
                await new Promise(r => setTimeout(r, 2000));
            }

            break;
    }
}

export { controlDeskLights,controlBedLights, leetCodeBrag }