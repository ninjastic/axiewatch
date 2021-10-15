import dayjs from '../dayjs';
import { APIScholarResponse } from '../../types/api';

interface ParsedScholarData {
  slp: number;
  roninSlp: number;
  totalSlp: number;
  claimableSlp: number;
  yesterdaySlp: number | null;
  todaySlp: number | null;
  lastClaim: number;
  nextClaim: number;
  slpDay: number;
  pvpElo: number;
  pvpRank: number;
  pvpErrored: boolean;
  loaded: boolean;
  errored: boolean;
}

type ParseScholarDataOptions = {
  includeTodayOnAverageSlp: boolean;
};

interface ParseScholarDataProps {
  data: APIScholarResponse;
  options?: ParseScholarDataOptions;
}

export function parseScholarData({ data, options }: ParseScholarDataProps): ParsedScholarData {
  const {
    total,
    blockchain_related: { balance, checkpoint },
    claimable_total,
    last_claimed_item_at,
  } = data.scholar;

  const slp = Math.abs(total - balance);
  const roninSlp = balance;
  const totalSlp = total + checkpoint - balance;
  const claimableSlp = claimable_total;

  const pvpElo = data.pvp?.elo ?? 0;
  const pvpRank = data.pvp?.rank ?? 0;
  const pvpErrored = data.pvp === null;

  const lastClaim = last_claimed_item_at;
  const nextClaim = last_claimed_item_at === 0 ? 0 : dayjs.unix(last_claimed_item_at).add(2, 'weeks').unix();

  const getYesterdaySlp = () => {
    if (data.slp?.yesterday) {
      if (data.slp.today) {
        return data.slp?.today?.totalSlp - data.slp?.yesterday?.totalSlp;
      }

      return totalSlp - data.slp?.yesterday?.totalSlp;
    }

    return null;
  };

  const todaySlp = data.slp?.today ? totalSlp - data.slp?.today.totalSlp : null;

  const accumulated = data.slp?.dates.reduce(
    (acc, entry, index, array) => {
      const prevEntry = array[index - 1];
      if (!prevEntry) return acc;

      if (dayjs.utc(entry.day).isBefore(dayjs.unix(last_claimed_item_at).endOf('day'))) {
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

  const daysFromLastClaim = Math.ceil(Math.max(dayjs.utc().diff(dayjs.unix(last_claimed_item_at), 'hours'), 1) / 24);

  const slpDayFallback = Math.floor(slp / daysFromLastClaim);

  return {
    slp,
    roninSlp,
    totalSlp,
    claimableSlp,
    yesterdaySlp: getYesterdaySlp(),
    todaySlp,
    lastClaim,
    nextClaim,
    slpDay: slpDay ?? slpDayFallback,
    pvpElo,
    pvpRank,
    pvpErrored,
    loaded: true,
    errored: false,
  };
}
