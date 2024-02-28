import dayjs from ".";

export const isBetween = (target: Date, start: Date, end: Date): boolean => {
  return dayjs(target).isBetween(dayjs(start), dayjs(end), "hour", "[]");
};

export const dateIsInThePast = (comparison: Date): boolean => {
  return dayjs(comparison).isBefore(dayjs());
};

export const dateIsInvalid = (date: Date): boolean => {
  return date.toString() === "Invalid Date";
};

export const endIsBeforeStart = (start: Date, end: Date): boolean => {
  return dayjs(end).isBefore(start);
};

export const differenceInDays = (start: Date, end: Date): number => {
  return dayjs(end).diff(dayjs(start), "days");
};
