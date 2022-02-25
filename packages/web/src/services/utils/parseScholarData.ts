import dayjs from '../dayjs';
import { APIScholarResponse } from '../../types/api';
import { ScholarState } from 'src/recoil/scholars';

type ParseScholarDataOptions = {
  includeTodayOnAverageSlp: boolean;
};

interface ParseScholarDataProps {
  data: APIScholarResponse;
  options?: ParseScholarDataOptions;
}

export function parseScholarData({ data, options }: ParseScholarDataProps): ScholarState {
  const { slp, roninSlp, totalSlp, lastClaim } = data.scholar || {};
  const { yesterday, today, dates } = data.historical || {};
  const { pve, pvp } = data;

  if (slp === undefined) {
    return {
      address: data.address,
      slp: 0,
      roninSlp: 0,
      totalSlp: 0,
      claimableSlp: 0,
      yesterdaySlp: 0,
      todaySlp: 0,
      lastClaim: 0,
      nextClaim: 0,
      slpDay: 0,
      pvpElo: 0,
      pvpRank: 0,
      pvpErrored: true,
      pveSlp: 0,
      loaded: true,
      errored: true,
      historical: null,
    };
  }

  const pvpElo = pvp?.elo ?? 0;
  const pvpRank = pvp?.rank ?? 0;
  const pvpErrored = pvp === null;

  const nextClaim = lastClaim === 0 ? 0 : dayjs.unix(lastClaim).add(2, 'weeks').unix();

  const getYesterdaySlp = () => {
    if (yesterday) {
      if (today) {
        return today?.totalSlp - yesterday?.totalSlp;
      }

      if (dayjs.utc().hour() <= 6) {
        return totalSlp - yesterday?.totalSlp;
      }
    }

    return null;
  };

  const todaySlp = today ? totalSlp - today.totalSlp : null;

  const accumulated = dates?.reduce(
    (acc, entry, index, array) => {
      const prevEntry = array[index - 1];
      if (!prevEntry) return acc;

      if (dayjs.utc(entry.day).isBefore(dayjs.unix(lastClaim).endOf('day'))) {
        if (dayjs.utc().diff(dayjs.utc(entry.day), 'hours') <= 30 && index === array.length - 1) {
          return [acc[0] + (totalSlp - entry.totalSlp), acc[1] + 1];
        }

        return acc;
      }
      if (dayjs.utc(prevEntry.day).add(1, 'day').day() !== dayjs.utc(entry.day).day()) return acc;

      if (options?.includeTodayOnAverageSlp && index === array.length - 1) {
        return [acc[0] + (entry.totalSlp - prevEntry.totalSlp) + (totalSlp - entry.totalSlp), acc[1] + 2];
      }

      return [acc[0] + entry.totalSlp - prevEntry.totalSlp, acc[1] + 1];
    },
    [0, 0] // [slp, days]
  );

  const slpDay = accumulated && accumulated[1] > 0 ? Math.floor(accumulated[0] / accumulated[1]) : null;

  const daysFromLastClaim = Math.ceil(Math.max(dayjs.utc().diff(dayjs.unix(lastClaim), 'hours'), 1) / 24);
  const slpDayFallback = Math.floor(slp / daysFromLastClaim);

  return {
    address: data.address,
    slp,
    roninSlp,
    totalSlp,
    claimableSlp: 0,
    yesterdaySlp: getYesterdaySlp(),
    todaySlp,
    lastClaim,
    nextClaim,
    slpDay: slpDay ?? slpDayFallback,
    pvpElo,
    pvpRank,
    pvpErrored,
    pveSlp: pve.slp,
    loaded: true,
    errored: false,
    historical: data.historical,
  };
}
