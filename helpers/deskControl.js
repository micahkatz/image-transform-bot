import fetch from 'node-fetch'
import secret from '../secret.json' assert { type: "json" };
import { sendResponse } from '../utils.js'
import lightScenes from '../constants/lightScenes.js'
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

    const response = await fetch("https://developer-api.govee.com/v1/devices/control", requestOptions)

    if(!response.ok){
        console.log('ERROR WITH SET COLOR', await response.text())
    }

    return response
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
const controlDeskLights = async (kind = 'SET_RED', args, res) => 
    controlDevice(kind, args, res, deskLights, 'Desk Lights')
const controlBedLights = async (kind = 'SET_RED', args, res) => 
    controlDevice(kind, args, res, bedLights, 'Bed Lights')


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

export { controlDeskLights,controlBedLights }