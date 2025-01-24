import type Redis from "ioredis";
import { generateLinkCode, getRedisKey } from "~/features/link/utils";
import type { Terminal } from "~/models";
import { generateToken } from "~/utils/crypto";


interface Options {
  redis: Redis;
}

type EphemeralTokenMetadata = Pick<Terminal, "restaurantId" | "ref" | "name">;

export const LINK_CODE_TTL = 5 * 60;

const EPHEMERAL_TOKEN_TTL = 10;
const EPHEMERAL_TOKEN_PREFIX = "link:ephemeral:";

let redis: Redis | null = null;

export const link = {
  initialize: (options: Options): void => {
    redis = options.redis;
  },
  getLinkCde: async (address: string): Promise<string | null> => {
    if (redis === null) {
      throw new Error("Link not initialized");
    }

    let code: string | null = null;

    for (let i = 0; i < 10; i++) {
      code = generateLinkCode();

      if (await link.checkCode(code)) {
        break;
      }
    }

    if (code === null) {
      return null;
    }

    await redis.set(getRedisKey(code), address, "EX", LINK_CODE_TTL + 10);

    return code;
  },
  checkCode: async (code: string): Promise<boolean> => {
    if (redis === null) {
      throw new Error("Link not initialized");
    }

    const count = await redis.exists(getRedisKey(code));

    return count > 0;
  },
  deleteCode: async (code: string): Promise<void> => {
    if (redis === null) {
      throw new Error("Link not initialized");
    }

    await redis.del(getRedisKey(code));
  },
  getEphemeralToken: async (meta: EphemeralTokenMetadata): Promise<string> => {
    if (redis === null) {
      throw new Error("Link not initialized");
    }

    const token = generateToken(64);
    const value = JSON.stringify(meta);

    await redis.set(`${EPHEMERAL_TOKEN_PREFIX}:${token}`, value, "EX", EPHEMERAL_TOKEN_TTL);

    return token;
  },
  checkEphemeralToken: async (token: string): Promise<EphemeralTokenMetadata | null> => {
    if (redis === null) {
      throw new Error("Link not initialized");
    }

    const value = await redis.get(`${EPHEMERAL_TOKEN_PREFIX}:${token}`);
    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  },
  deleteEphemeralToken: async (token: string): Promise<void> => {
    if (redis === null) {
      throw new Error("Link not initialized");
    }

    await redis.del(`${EPHEMERAL_TOKEN_PREFIX}:${token}`);
  },
};
