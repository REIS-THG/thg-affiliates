
import { subDays, format } from "date-fns";

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const getStartDate = (days: number): string => {
  return subDays(new Date(), days).toISOString().split('T')[0];
};
