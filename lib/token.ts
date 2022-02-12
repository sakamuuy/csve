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
