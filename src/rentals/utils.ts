import dayjs from "../lib/day";

export const isBetween = (target: Date, start: Date, end: Date): boolean => {
  return dayjs(target).isBetween(dayjs(start), dayjs(end), "day", "[]");
};
