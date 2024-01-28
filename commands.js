import 'dotenv/config';
import {  InstallGlobalCommands } from './utils.js';

const effectChoices = [
  {name: 'Invert', value: 'invert'},
  {name: 'Nuke', value: 'nuke'},
  {name: 'Deepfry', value: 'deepfry'},
  {name: 'Wide', value: 'wide'},
  {name: 'Pixelate', value: 'pixelate'},
  {name: 'Paint', value: 'paint'},
  {name: 'Black/White', value: 'bw'},
  {name: 'Grey', value: 'grey'},
  {name: 'Ultra-Nuke', value: 'ultranuke'},
  {name: 'Ultra-Deepfry', value: 'ultradeepfry'},
  {name: 'AI Expand', value: 'ai-expand'},
  {name: 'AI Restore', value: 'ai-restore'},
]

// Simple test command
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



const ALL_COMMANDS = [EFFECTS];

const setupSlashCommands = async() => {
  const response = await InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
  console.log(response, ALL_COMMANDS)
}

setupSlashCommands()