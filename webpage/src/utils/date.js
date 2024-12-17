import { format } from "date-fns";

export function formatDate(date) {
  return format(date, "d MMM yyyy");
}

export function formatDateAndTime(date) {
  return format(date, "d MMM yyyy HH:mm");
}
