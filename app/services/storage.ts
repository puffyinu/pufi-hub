export function save<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(key, JSON.stringify(value));
}

export function load<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  const item = localStorage.getItem(key);

  if (!item) return null;

  return JSON.parse(item) as T;
}

export function remove(key: string): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(key);
}

export function clear(): void {
  if (typeof window === "undefined") return;

  localStorage.clear();
}
