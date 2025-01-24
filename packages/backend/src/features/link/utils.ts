import { generateToken } from "~/utils/crypto";


const LINK_CODE_LENGTH = 6;
const LINK_CODE_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

export function getRedisKey(code: string) {
  return `link:code:${code}`;
}

export function getSocketRoom(code: string) {
  return `link:anonymous:${code}`;
}

export function generateLinkCode() {
  return generateToken(LINK_CODE_LENGTH, LINK_CODE_ALPHABET);
}
