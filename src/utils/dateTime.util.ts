import { format, addDays, addHours, isBefore, isAfter, parseISO } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export const formatDateTime = (
  date: Date | string,
  formatString = 'yyyy-MM-dd HH:mm:ss'
) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
};

export const addDaysToDate = (date: Date, days: number) => {
  return addDays(date, days);
};

export const addHoursToDate = (date: Date, hours: number) => {
  return addHours(date, hours);
};

export const isDateBefore = (date: Date, compareTo: Date) => {
  return isBefore(date, compareTo);
};

export const isDateAfter = (date: Date, compareTo: Date) => {
  return isAfter(date, compareTo);
};

export const convertToUTC = (date: Date, timeZone: string) => {
  return zonedTimeToUtc(date, timeZone);
};

export const convertFromUTC = (date: Date, timeZone: string) => {
  return utcToZonedTime(date, timeZone);
};

export const parseDateString = (dateString: string) => {
  return parseISO(dateString);
};

export const getBusinessDaysBetween = (startDate: Date, endDate: Date) => {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

export const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};