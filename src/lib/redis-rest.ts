const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redisEnabled = !!redisUrl && !!redisToken;

function buildUrl(cmd: string, args: Array<string | number> = []) {
  if (!redisUrl) return "";
  const encoded = [cmd, ...args].map((arg) =>
    encodeURIComponent(String(arg)),
  );
  return `${redisUrl}/${encoded.join("/")}`;
}

async function redisRequest<T>(
  cmd: string,
  args: Array<string | number> = [],
): Promise<T | null> {
  if (!redisEnabled) return null;
  const url = buildUrl(cmd, args);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${redisToken}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    return null;
  }
  const data = (await res.json()) as { result: T };
  return data.result ?? null;
}

export async function redisGet(key: string): Promise<string | null> {
  return redisRequest<string>("get", [key]);
}

export async function redisSet(
  key: string,
  value: string,
  ttlSeconds?: number,
): Promise<"OK" | null> {
  if (ttlSeconds && ttlSeconds > 0) {
    return redisRequest<"OK">("set", [key, value, "ex", ttlSeconds]);
  }
  return redisRequest<"OK">("set", [key, value]);
}

export async function redisIncr(key: string): Promise<number | null> {
  return redisRequest<number>("incr", [key]);
}

export async function redisExpire(
  key: string,
  ttlSeconds: number,
): Promise<number | null> {
  return redisRequest<number>("expire", [key, ttlSeconds]);
}
