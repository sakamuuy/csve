import * as readline from 'readline'
import { CSVStore } from './store'
import { DEFAULT_CELL_SIZE, EDITOR_CELL_DELIMITER, ELLIPSIS_CHARACTER, PADDING_CHARACTER } from './token';

function paddingCell(text: string) {
  const count = ((str) => {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      (str[i].match(/[ -~]/)) ? len += 1 : len += 2;
    }
    return len;
  })(text)
  
  const remain = DEFAULT_CELL_SIZE - count
  if (remain > 0) {
    const padding = new Array(remain).join(PADDING_CHARACTER)
    return text + padding;
  }
  if (remain < 1) {
    const ellipsis = text.slice(0, DEFAULT_CELL_SIZE - 2) + ELLIPSIS_CHARACTER
    return ellipsis;
  }
  return text;
}

function generateHeader(header: string[]) {
  const paddedHeader = header.map((h) => paddingCell(h))
  return paddedHeader.join(EDITOR_CELL_DELIMITER)
}

function generateBody(body: string[][]) {
  const separatedRows = body.map((row) => {
    const paddedRow = row.map((c) => paddingCell(c))
    return paddedRow.join(EDITOR_CELL_DELIMITER)
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
    process.stdout.write('\n')
    process.stdout.write(generateBody(body))
  })
}
