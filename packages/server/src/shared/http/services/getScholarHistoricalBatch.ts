import { MD5 } from 'crypto-js';

import { cache } from 'src/services/cache';
import Tracking from 'src/models/Tracking';
import dayjs from 'src/services/dayjs';

interface ScholarHistoricalDate {
  day: string;
  totalSlp: number;
}

interface ScholarDate {
  [address: string]: {
    dates: ScholarHistoricalDate[];
    yesterday: ScholarHistoricalDate | undefined;
    today: ScholarHistoricalDate | undefined;
  };
}

export const getScholarHistoricalBatch = async (addresses: string[]): Promise<ScholarDate> => {
  const hashedKey = MD5(JSON.stringify(addresses)).toString();
  const cacheKey = `v1:scholarHistoricalSlp:${hashedKey}`;
  const cacheTime = 1000 * 60 * 15; // 15 minutes

  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const dates = await Tracking.query()
    .select('*')
    .whereIn(
      'address',
      addresses.map(address => address.toLowerCase())
    )
    .andWhere('createdAt', '>', dayjs.utc().subtract(14, 'days').startOf('day').toISOString())
    .orderBy('createdAt', 'desc')
    .then(date => date.reverse());

  const scholarDates: ScholarDate = {};

  dates.forEach(date => {
    const dateParsed = {
      day: dayjs(date.createdAt).format('YYYY-MM-DD'),
      totalSlp: date.slpAmount,
    };

    if (scholarDates[date.address]) {
      scholarDates[date.address].dates.push(dateParsed);
    } else {
      scholarDates[date.address] = {
        dates: [dateParsed],
        yesterday: undefined,
        today: undefined,
      };
    }
  });

  Object.entries(scholarDates).forEach(([address, data]) => {
    scholarDates[address].yesterday = data.dates.find(date => {
      const dayUnix = dayjs.utc(date.day).startOf('day').unix();
      const yesterdayUnix = dayjs.utc().subtract(1, 'day').startOf('day').unix();
      const todayUnix = dayjs.utc().startOf('day').unix();
      if (dayUnix === yesterdayUnix && dayUnix < todayUnix) return true;
      return false;
    });

    scholarDates[address].today = data.dates.find(date => {
      const dayUnix = dayjs.utc(date.day).startOf('day').unix();
      const todayUnix = dayjs.utc().startOf('day').startOf('day').unix();
      if (dayUnix >= todayUnix) return true;
      return false;
    });
  });

  await cache.set(cacheKey, JSON.stringify(scholarDates), 'PX', cacheTime);
  return scholarDates;
};
