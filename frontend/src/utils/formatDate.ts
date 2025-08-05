import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format a date using a custom or default pattern.
 * @param date - Date string, number, or Date object
 * @param pattern - date-fns format pattern (default: 'PPpp')
 */
export function formatDate(date: string | number | Date, pattern = 'PPpp') {
  return format(new Date(date), pattern);
}

/**
 * Format a date as relative time (e.g., '3 minutes ago').
 * @param date - Date string, number, or Date object
 */
export function formatRelative(date: string | number | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function getImageUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('/uploads')) {
    return API_URL + url;
  }
  return url;
} 