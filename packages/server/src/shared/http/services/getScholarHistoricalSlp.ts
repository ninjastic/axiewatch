import { cache } from 'src/services/cache';
import Tracking from 'src/models/Tracking';
import dayjs from 'src/services/dayjs';

interface ScholarHistoricalDate {
  day: string;
  totalSlp: number;
}

export interface ScholarHistoricalSlpData {
  dates: ScholarHistoricalDate[];
  yesterday: ScholarHistoricalDate | undefined;
  today: ScholarHistoricalDate | undefined;
}

export const getScholarHistoricalSlp = async (address: string): Promise<ScholarHistoricalSlpData> => {
  const cacheKey = `v1:scholarHistoricalSlp:${address}:fix`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const dates = await Tracking.query()
    .select('*')
    .where('address', address.toLowerCase())
    .andWhere('createdAt', '>', dayjs.utc().subtract(14, 'days').startOf('day').toISOString())
    .orderBy('createdAt', 'desc')
    .limit(14)
    .then(data =>
      data.reverse().map(entry => ({
        day: dayjs(entry.createdAt).format('YYYY-MM-DD'),
        totalSlp: entry.slpAmount,
      }))
    );

  const yesterday = dates.find(date => {
    const dayUnix = dayjs.utc(date.day).startOf('day').unix();
    const yesterdayUnix = dayjs.utc().subtract(1, 'day').startOf('day').unix();
    const todayUnix = dayjs.utc().startOf('day').unix();
    if (dayUnix === yesterdayUnix && dayUnix < todayUnix) return true;
    return false;
  });

  const today = dates.find(date => {
    const dayUnix = dayjs.utc(date.day).startOf('day').unix();
    const todayUnix = dayjs.utc().startOf('day').startOf('day').unix();
    if (dayUnix >= todayUnix) return true;
    return false;
  });

  const historical = {
    dates,
    yesterday,
    today,
  };

  await cache.set(cacheKey, JSON.stringify(historical), 'PX', cacheTime);
  return historical;
};
