import * as readline from 'readline'
import keypress from 'keypress.js'
import { CSVStore } from './store'

function mapProcessToKey(key: Buffer) {
  switch (key.toString()) {
    case 'c':
      process.exit() 
      break;
  
    default:
      break;
  }
}

function makeRawMode() {
  readline.emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)
  process.stdin.on('data', mapProcessToKey)
}

export function launchEditor(store: CSVStore) {
  store.on('setData', (data: string[][]) => {
    makeRawMode()
    process.stdout.write(data[0][0])
  })
}
