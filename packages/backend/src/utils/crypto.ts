import { randomBytes, scrypt } from "crypto";


const ALPHA_LOWER = "abcdefghijklmnopqrstuvwxyz";
const ALPHA_UPPER = ALPHA_LOWER.toLowerCase();
const DIGITS = "0123456789";
const ALPHA_NUMERIC = ALPHA_LOWER + ALPHA_UPPER + DIGITS;

export function hashPassword(password: string) {
  return new Promise<string>((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");

    scrypt(password, salt, 64, (err, derived) => {
      if (err) {
        reject(err);
      }

      resolve(`${salt}.${derived.toString("hex")}`);
    });
  });
}

export function verifyPassword(password: string, hash: string) {
  return new Promise<boolean>((resolve, reject) => {
    const [salt, key] = hash.split(".");
    if (typeof salt == "undefined") {
      return reject(new Error("Missing salt"));
    }

    scrypt(password, salt, 64, (err, derived) => {
      if (err) {
        reject(err);
      }

      resolve(derived.toString("hex") === key);
    });
  });
}

/**
 * Generates a cryptographically secure token from a custom alphabet with uniform distribution.
 *
 * @param length
 * @param alphabet
 * @returns
 */
export function generateToken(length: number, alphabet = ALPHA_NUMERIC): string {
  if (alphabet.length > 256) {
    throw new Error("Alphabet too large");
  }

  const indices = getUniformRandomIndices(length, alphabet.length);

  return indices.map(index => alphabet[index]).join("");
}

/**
 * Generates cryptographically secure random indices in the range [0, rangeSize).
 * Uses a rejection sampling approach to ensure a uniform distribution.
 *
 * @param count
 * @param rangeSize
 * @returns
 */
function getUniformRandomIndices(count: number, rangeSize: number): number[] {
  const result: number[] = [];

  // The largest multiple of rangeSize below 256:
  // We'll accept only bytes < limit, and discard the rest to avoid bias.
  const limit = Math.floor(256 / rangeSize) * rangeSize;

  while (result.length < count) {
    // We request enough bytes to (hopefully) get the remaining needed indices,
    // but might loop again if some are out of the accepted range (rejection).
    const needed = count - result.length;
    const buffer = randomBytes(needed);

    for (let i = 0; i < buffer.length && result.length < count; i++) {
      const randomByte = buffer[i];
      if (typeof randomByte == "undefined") {
        throw new Error("This should never happen");
      }

      // Only use this byte if it's within our accepted range
      if (randomByte < limit) {
        result.push(randomByte % rangeSize);
      }
    }
  }

  return result;
}
