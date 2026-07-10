import type { WorldSession } from "@/app/types/world";
import { load, save, remove } from "@/app/services/storage";

const STORAGE_KEY = "pufi-session";
export const SESSION_EVENT = "pufi-session-changed";

function notifySessionChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SESSION_EVENT));
  }
}

let session: WorldSession | null =
  load<WorldSession>(STORAGE_KEY);

export function getSession(): WorldSession | null {
  return session;
}

export function setSession(data: WorldSession): void {
  session = data;
  save(STORAGE_KEY, data);
  notifySessionChanged();
}

export function clearSession(): void {
  session = null;
  remove(STORAGE_KEY);
  notifySessionChanged();
}

export function hasSession(): boolean {
  return session !== null;
}
