import * as readline from 'readline'
import { CSVStore } from './store'

function generateHeader(header: string[]) {
  return header.join('|')
}

function generateBody(body: string[][]) {
  const separatedRows = body.map((row) => {
    return row.join('|')
  })
  return separatedRows.join('\n')
}

function mapProcessToKey(key: Buffer) {
  switch (key.toString()) {
    case 'c':
      process.exit();
      break;

    case 'a':
      process.stdout.write('a');
      break;
  
    case 'b':
      process.stdout.cursorTo(1,1);
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
  store.on('setData', (data: CSVStore['csvData']) => {
    makeRawMode()
    process.stdout.clearScreenDown()

    const header = data?.header ?? []
    const body = data?.body ?? []
    process.stdout.write(generateHeader(header))
    process.stdout.write(generateBody(body))
  })
}
