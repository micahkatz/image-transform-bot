import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';
import lightScenes from './constants/lightScenes.js'

const effectChoices = [
  { name: 'Invert', value: 'invert' },
  { name: 'Nuke', value: 'nuke' },
  { name: 'Deepfry', value: 'deepfry' },
  { name: 'Wide', value: 'wide' },
  { name: 'Pixelate', value: 'pixelate' },
  { name: 'Paint', value: 'paint' },
  { name: 'Black/White', value: 'bw' },
  { name: 'Grey', value: 'grey' },
  { name: 'Ultra-Nuke', value: 'ultranuke' },
  { name: 'Ultra-Deepfry', value: 'ultradeepfry' },
  { name: 'AI Expand', value: 'ai-expand' },
  { name: 'AI Restore', value: 'ai-restore' },
]

const EFFECTS = {
  name: 'image',
  description: 'Apply effect on an image',
  type: 1,
  options: [
    {
      type: 3,
      name: 'effect',
      description: 'Pick your object',
      required: true,
      choices: effectChoices
    },
    {
      type: 3,
      name: 'effect2',
      description: 'Pick your object',
      required: false,
      choices: effectChoices
    },
    {
      type: 3,
      name: 'effect3',
      description: 'Pick your object',
      required: false,
      choices: effectChoices
    },
    {
      type: 3,
      name: 'effect4',
      description: 'Pick your object',
      required: false,
      choices: effectChoices
    },
    {
      type: 3,
      name: 'effect5',
      description: 'Pick your object',
      required: false,
      choices: effectChoices
    },
    {
      type: 3,
      name: 'effect6',
      description: 'Pick your object',
      required: false,
      choices: effectChoices
    },

  ]
};

const actionChoices = [
  { name: 'Set Red', value: 'SET_RED' },
  { name: 'Set Green', value: 'SET_GREEN' },
  { name: 'Set Blue', value: 'SET_BLUE' },
  { name: 'Set Yellow', value: 'SET_YELLOW' },
  { name: 'Set Purple', value: 'SET_PURPLE' },
  { name: 'Set Cyan', value: 'SET_CYAN' },
  { name: 'Set Orange', value: 'SET_ORANGE' },
  { name: 'Set Pink', value: 'SET_PINK' },
  { name: 'Set Turquoise', value: 'SET_TURQUOISE' },
  { name: 'Set Lavender', value: 'SET_LAVENDER' },
  { name: 'Power On', value: 'POWER_ON' },
  { name: 'Power Off', value: 'POWER_OFF' },
  { name: 'Set Brightness', value: 'SET_BRIGHTNESS'},
  { name: 'Spam Micah\'s lights to alert him', value: 'ALERT'},
  { name: 'Set Brightness High', value: 'SET_BRIGHTNESS_HIGH'},
  { name: 'Set Brightness Med', value: 'SET_BRIGHTNESS_MED'},
  { name: 'Set Brightness Low', value: 'SET_BRIGHTNESS_LOW'},
]
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

const getLightScenesChoices = () => {
  let lightSceneChoices = lightScenes.map(scene => {
    const {name, value} = scene
    const {paramId, id} = value

    return {name: `Set ${name} Scene`, value: `SET_SCENE_${id}`}
  })
  shuffleArray(lightSceneChoices)
  return lightSceneChoices
}
const sceneChoices = getLightScenesChoices()
console.log(sceneChoices)
const DESK_CONTROL = {
  name: 'desk',
  description: 'Control Micah\'s Desk Lights',
  type: 1,
  options: [
    {
      type: 3,
      name: 'action',
      description: 'Pick your action',
      required: false,
      choices: actionChoices
    },
    {
      type: 3,
      name: 'scene',
      description: 'Pick your scene',
      required: false,
      choices: sceneChoices.slice(0, 24)
    },

  ]
};



const ALL_COMMANDS = [EFFECTS, DESK_CONTROL];

const setupSlashCommands = async () => {
  const response = await InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
  console.log(response, ALL_COMMANDS)
}

setupSlashCommands()