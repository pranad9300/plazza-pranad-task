export function readVersioned<T>(raw: string | undefined, version: number, fallback: T): T {
  if (raw === undefined || raw.trim() === '') {
    return fallback;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('version' in parsed) ||
      !('data' in parsed)
    ) {
      return fallback;
    }
    const envelope = parsed as { version: unknown; data: unknown };
    if (envelope.version !== version) {
      return fallback;
    }
    return envelope.data as T;
  } catch {
    return fallback;
  }
}

export function writeVersioned<T>(version: number, data: T): string {
  return JSON.stringify({ version, data });
}
