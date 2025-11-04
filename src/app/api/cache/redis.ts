import Redis from 'ioredis';

const RAW_REDIS_URL =
  process.env.FLASH_SALES_REDIS_URL || process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;

const REDIS_URL = normalizeRedisUrl(RAW_REDIS_URL);
const REDIS_USERNAME = process.env.REDIS_USERNAME || undefined;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
const FORCE_TLS = process.env.REDIS_TLS === 'true';

const useTls = FORCE_TLS || (REDIS_URL ? REDIS_URL.startsWith('rediss://') : false);

const redis = REDIS_URL
  ? new Redis(REDIS_URL, {
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
      maxRetriesPerRequest: 2,
      enableAutoPipelining: true,
      enableOfflineQueue: true,
      connectTimeout: 1_500,
      retryStrategy: (attempt) => Math.min(attempt * 300, 3_000),
      lazyConnect: true,
      ...(useTls
        ? {
            tls: {
              rejectUnauthorized: process.env.REDIS_TLS_REJECT_UNAUTHORIZED !== 'false',
            },
          }
        : {}),
    })
  : null;

let cacheDisabled = !redis;
let cacheDisabledLogged = false;

if (redis) {
  redis.on('error', (error) => {
    console.warn('⚠️ Redis cache error encountered.', error);
    if (shouldDisableCache(error)) {
      disableCache();
    }
  });
} else {
  console.info('ℹ️ Redis cache disabled – no connection URL configured.');
}

function disableCache() {
  if (!cacheDisabledLogged) {
    console.warn('⚠️ Redis cache permanently disabled for this runtime.');
    cacheDisabledLogged = true;
  }

  cacheDisabled = true;

  if (redis) {
    try {
      redis.disconnect();
    } catch {
      // Swallow disconnect errors
    }
  }
}

function shouldDisableCache(error: unknown) {
  if (!error || typeof error !== 'object') return false;

  const err = error as { code?: string; message?: string; name?: string };
  const message = err.message ?? '';

  return (
    err.code === 'ENOTFOUND' ||
    err.code === 'ECONNREFUSED' ||
    err.code === 'ETIMEDOUT' ||
    err.code === 'NOAUTH' ||
    err.code === 'ERR_SSL_WRONG_VERSION_NUMBER' ||
    /authentication required/i.test(message) ||
    /wrong version number/i.test(message) ||
    (err.name === 'ReplyError' && /NOAUTH|authentication required/i.test(message))
  );
}

function normalizeRedisUrl(url?: string | null) {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('redis://') || trimmed.startsWith('rediss://')) {
    return trimmed;
  }

  if (trimmed.includes('://')) {
    return trimmed;
  }

  console.info('ℹ️ Redis URL missing scheme; defaulting to redis://', trimmed);
  return `redis://${trimmed}`;
}

export function isCacheEnabled() {
  return Boolean(redis) && !cacheDisabled;
}

export async function readCache(key: string) {
  if (!redis || cacheDisabled) return null;

  try {
    if (redis.status === 'wait' || redis.status === 'close' || redis.status === 'end') {
      await redis.connect();
    }

    return await redis.get(key);
  } catch (error) {
    console.warn('⚠️ Redis cache read failed; continuing without cache.', error);
    if (shouldDisableCache(error)) {
      disableCache();
    }
    return null;
  }
}

export async function writeCache(key: string, payload: unknown, ttlSeconds: number) {
  if (!redis || cacheDisabled) return;

  try {
    if (redis.status === 'wait' || redis.status === 'close' || redis.status === 'end') {
      await redis.connect();
    }

    await redis.set(key, JSON.stringify(payload), 'EX', ttlSeconds);
  } catch (error) {
    console.warn('⚠️ Redis cache write failed; response served without cache.', error);
    if (shouldDisableCache(error)) {
      disableCache();
    }
  }
}

export async function deleteCache(key: string) {
  if (!redis || cacheDisabled) return;

  try {
    if (redis.status === 'wait' || redis.status === 'close' || redis.status === 'end') {
      await redis.connect();
    }

    await redis.del(key);
  } catch (error) {
    console.warn('⚠️ Redis cache delete failed.', error);
    if (shouldDisableCache(error)) {
      disableCache();
    }
  }
}

export async function withCache<T>(key: string, ttlSeconds: number, handler: () => Promise<T>) {
  const cached = await readCacheJSON<T>(key);
  if (cached !== null) {
    return cached;
  }

  const data = await handler();
  await writeCache(key, data, ttlSeconds);
  return data;
}

export async function readCacheJSON<T>(key: string) {
  const cached = await readCache(key);
  if (!cached) return null;

  try {
    return JSON.parse(cached) as T;
  } catch (error) {
    console.warn('⚠️ Redis cache JSON parse failed; ignoring cached value.', error);
    return null;
  }
}
