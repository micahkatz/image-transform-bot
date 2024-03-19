import fetch from 'node-fetch'
import secret from '../secret.json'
import { sendResponse } from '../utils.js'
import lightScenes from '../constants/lightScenes.js'
const deskLights = secret.deskLights

const setColor = ({ r, g, b }) => {
    var myHeaders = new Headers();
    myHeaders.append("Govee-API-Key", secret['govee-api-key']);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "device": deskLights.mac,
        "model": deskLights.model,
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
const changePowerState = (shouldTurnOn = true) => {
    var myHeaders = new Headers();
    myHeaders.append("Govee-API-Key", secret['govee-api-key']);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "device": deskLights.mac,
        "model": deskLights.model,
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
const setBrightness = (brightness = 50) => {
    var myHeaders = new Headers();
    myHeaders.append("Govee-API-Key", secret['govee-api-key']);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "device": deskLights.mac,
        "model": deskLights.model,
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
const setScene = (sceneId) => {
    var myHeaders = new Headers();
    myHeaders.append("Govee-API-Key", secret['govee-api-key']);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({

        "requestId": "uuid",
        "payload": {
            "device": deskLights.mac,
            "sku": deskLights.model,
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

const controlDeskLights = async (kind = 'SET_RED', args, res) => {
    if (kind.includes('SET_SCENE')) {
        const sceneId = kind.replace('SET_SCENE_', '')
        const numericalSceneId = parseInt(sceneId)
        setScene(numericalSceneId)
        const foundScene = lightScenes.find(item=> item.value.id === numericalSceneId)
        console.log({foundScene})
        return sendResponse(res, `✅ Set Micah\'s Desk Lights to \`${foundScene?.name || 'Scene'}\``)
    }
    switch (kind) {
        case 'SET_RED':
            setColor({ r: 255, g: 0, b: 0 })
            sendResponse(res, `✅ Set Micah\'s Desk Lights to Red`)
            break;
        case 'SET_GREEN':
            setColor({ r: 0, g: 255, b: 0 })
            sendResponse(res, `✅ Set Micah\'s Desk Lights to Green`)
            break;
        case 'SET_BLUE':
            setColor({ r: 0, g: 0, b: 255 })
            sendResponse(res, `✅ Set Micah\'s Desk Lights to Blue`)
            break;
        case 'SET_YELLOW':
            setColor({ r: 255, g: 255, b: 0 })
            sendResponse(res, `✅ Set Micah\'s Desk Lights to Yellow`)
            break;
        case 'SET_PURPLE':
            setColor({ r: 128, g: 0, b: 128 })
            sendResponse(res, `✅ Set Micah\'s Desk Lights to Purple`)
            break;
        case 'SET_CYAN':
            setColor({ r: 0, g: 255, b: 255 })
            sendResponse(res, `✅ Set Micah\'s Desk Lights to Cyan`)
            break;
        case 'SET_ORANGE':
            setColor({ r: 255, g: 165, b: 0 })
            sendResponse(res, `✅ Set Micah\'s Desk Lights to Orange`)
            break;
        case 'SET_PINK':
            setColor({ r: 255, g: 192, b: 203 })
            sendResponse(res, `✅ Set Micah\'s Desk Lights to Pink`)
            break;
        case 'SET_TURQUOISE':
            setColor({ r: 64, g: 224, b: 208 })
            sendResponse(res, `✅ Set Micah\'s Desk Lights to Turquoise`)
            break;
        case 'SET_LAVENDER':
            setColor({ r: 230, g: 230, b: 250 })
            sendResponse(res, `✅ Set Micah\'s Desk Lights to Lavender`)
            break;
        case 'POWER_ON':
            changePowerState(true)
            sendResponse(res, `✅ Turned on Micah\'s Desk Lights`)
            break;
        case 'POWER_OFF':
            changePowerState(false)
            sendResponse(res, `✅ Turned off Micah\'s Desk Lights`)
            break;
        case 'SET_BRIGHTNESS_HIGH':
            setBrightness(100)
            sendResponse(res, `✅ Set Brightness for Micah\'s Desk Lights to 100\%`)
            break;
        case 'SET_BRIGHTNESS_MED':
            setBrightness(50)
            sendResponse(res, `✅ Set Brightness for Micah\'s Desk Lights to 50\%`)
            break;
        case 'SET_BRIGHTNESS_LOW':
            setBrightness(10)
            sendResponse(res, `✅ Set Brightness for Micah\'s Desk Lights to 10\%`)
            break;
        case 'ALERT':

            var shouldPowerOn = true
            const maxIterations = 5
            var isFirstTime = true

            for (let intervalIndex = 0; intervalIndex < maxIterations; intervalIndex++) {
                shouldPowerOn = !shouldPowerOn
                const powerStateResponse = await changePowerState(shouldPowerOn)
                const textResponse = await powerStateResponse.text()
                console.log('powerstateresponse', textResponse, powerStateResponse.status, powerStateResponse.ok)
                if (!powerStateResponse.ok) {
                    return sendResponse(res, `😢There was an error\n\n\`${textResponse}\``)
                } else if (isFirstTime) {
                    sendResponse(res, `✅ Alerting Micah by spamming his desk lights`)
                    isFirstTime = false
                }
                await new Promise(r => setTimeout(r, 2000));
            }

            break;
    }
}

export { controlDeskLights }