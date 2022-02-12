type NewlineCharacterOptions = "CR" | "LF" | "CRLF";
export function getNewlineCharacterReg(option?: NewlineCharacterOptions) {
  switch (option) {
    case "CR":
      return /\r/;
    case "LF":
      return /\n/;
    case "CRLF":
      return /\r\n/;
    default:
      return /\n/;
  }
}

export const DEFAULT_DELIMITER = ",";

export const DEFAULT_CELL_SIZE = 16

export const PADDING_CHARACTER = " "

export const ELLIPSIS_CHARACTER = "…"

export const EDITOR_CELL_DELIMITER = "|"