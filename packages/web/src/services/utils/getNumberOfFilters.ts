import { ScholarAxiesFilter } from '../../recoil/scholars';

export const getNumberOfFilters = (filter: ScholarAxiesFilter): number => {
  let total = 0;
  if (filter.breed.above || filter.breed.under) total += 1;
  if (filter.quality.above || filter.quality.under) total += 1;
  if (filter.class) total += 1;
  if (filter.owner) total += 1;
  if (filter.parts.length) total += 1;
  return total;
};
