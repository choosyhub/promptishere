import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertHoursToReadableTime(totalHours: number) {
  if (totalHours <= 0) {
    return "0 hours";
  }

  const USABLE_HOURS_PER_DAY = 18;
  const DAYS_IN_YEAR = 365;
  const DAYS_IN_MONTH = 30; // Using a 30-day average for months as per the logic.

  let totalDays = Math.floor(totalHours / USABLE_HOURS_PER_DAY);
  let remainingHours = Math.round(totalHours % USABLE_HOURS_PER_DAY);

  const years = Math.floor(totalDays / DAYS_IN_YEAR);
  totalDays %= DAYS_IN_YEAR;

  const months = Math.floor(totalDays / DAYS_IN_MONTH);
  const days = totalDays % DAYS_IN_MONTH;

  const parts = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (remainingHours > 0) parts.push(`${remainingHours} hour${remainingHours > 1 ? 's' : ''}`);

  return parts.length > 0 ? parts.join(', ') : "0 hours";
}


export function downloadJson(data: unknown, filename: string) {
  if (typeof window === "undefined") return;
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `${filename}.json`;
  link.click();
}

export const formatTime = (timeInSeconds: number) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .join(":");
};
