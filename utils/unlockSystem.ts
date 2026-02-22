import { AppRoute } from '../types';

// ============================================================
// UNLOCK SCHEDULE — IA Heroes Live 14
// All times in Europe/Madrid timezone
// ============================================================

const ADMIN_KEY = 'LH2026pro';
const ADMIN_STORAGE_KEY = 'ia-heroes-admin';

interface UnlockEntry {
  dayId: AppRoute;
  label: string;
  // ISO 8601 string representing the unlock moment in Europe/Madrid
  // We store as UTC equivalent so Date comparison works correctly
  unlockUTC: Date;
}

// Helper: create a Date from Madrid local time components
function madridToUTC(year: number, month: number, day: number, hour: number, minute: number): Date {
  // Build an ISO string and let the Intl API figure out the offset
  const pad = (n: number) => String(n).padStart(2, '0');
  const isoLocal = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`;

  // Use a formatter to get the offset for that specific date in Madrid
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Madrid',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });

  // Brute-force approach: we know CET is UTC+1 and CEST is UTC+2
  // Feb 23-26 2026 is winter time (CET = UTC+1)
  const offset = 1; // hours ahead of UTC
  return new Date(Date.UTC(year, month - 1, day, hour - offset, minute, 0));
}

const UNLOCK_SCHEDULE: UnlockEntry[] = [
  {
    dayId: AppRoute.DAY_1,
    label: 'Lunes 23 Feb · 21:00h',
    unlockUTC: madridToUTC(2026, 2, 23, 21, 0),
  },
  {
    dayId: AppRoute.DAY_2,
    label: 'Martes 24 Feb · 21:00h',
    unlockUTC: madridToUTC(2026, 2, 24, 21, 0),
  },
  {
    dayId: AppRoute.DAY_3,
    label: 'Miércoles 25 Feb · 20:30h',
    unlockUTC: madridToUTC(2026, 2, 25, 20, 30),
  },
  {
    dayId: AppRoute.DAY_4,
    label: 'Jueves 26 Feb · 21:00h',
    unlockUTC: madridToUTC(2026, 2, 26, 21, 0),
  },
];

// The CTA banner shares Day 3's unlock time
export const CTA_BANNER_UNLOCK = UNLOCK_SCHEDULE[2].unlockUTC;

// ============================================================
// Public API
// ============================================================

/** Check whether a given day is unlocked right now */
export function isDayUnlocked(dayId: AppRoute, isAdmin: boolean = false): boolean {
  if (isAdmin) return true;

  const entry = UNLOCK_SCHEDULE.find(e => e.dayId === dayId);
  if (!entry) return true; // HOME or unknown routes are always accessible

  return new Date() >= entry.unlockUTC;
}

/** Check whether the CTA banner should be visible */
export function isCTABannerVisible(isAdmin: boolean = false): boolean {
  if (isAdmin) return true;
  return new Date() >= CTA_BANNER_UNLOCK;
}

/** Get the human-readable unlock label for a day */
export function getUnlockLabel(dayId: AppRoute): string {
  const entry = UNLOCK_SCHEDULE.find(e => e.dayId === dayId);
  return entry?.label || '';
}

/** Get time remaining until unlock, formatted in Spanish */
export function getTimeUntilUnlock(dayId: AppRoute): string {
  const entry = UNLOCK_SCHEDULE.find(e => e.dayId === dayId);
  if (!entry) return '';

  const now = new Date();
  const diff = entry.unlockUTC.getTime() - now.getTime();
  if (diff <= 0) return '';

  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);

  return parts.join(' ');
}

// ============================================================
// Admin bypass
// ============================================================

/** Call once on app init — reads ?admin= param and persists to sessionStorage */
export function initializeAdminBypass(): boolean {
  // Check sessionStorage first (already activated this session)
  if (typeof window !== 'undefined') {
    if (sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true') {
      return true;
    }

    // Check URL param
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === ADMIN_KEY) {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');

      // Clean URL so the key isn't visible in the address bar
      const url = new URL(window.location.href);
      url.searchParams.delete('admin');
      window.history.replaceState({}, '', url.toString());

      return true;
    }
  }

  return false;
}

/** Check current admin state from sessionStorage */
export function isAdminMode(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
}
