import { format, formatDistanceToNowStrict } from 'date-fns';

export const getFormattedDate = (date: Date) => format(date, 'dd MMM yyyy');
export const getDateDistance = (date: Date) =>
  formatDistanceToNowStrict(date, {
    addSuffix: true,
  });
