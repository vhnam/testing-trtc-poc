import dayjs, { type ConfigType } from 'dayjs';

export const formatDateTime = (value: ConfigType, format?: string) => {
  return dayjs(value).format(format ?? 'MMM DD YYYY, HH:mm');
};
