import { Axie } from '../../recoil/scholars';
import { getTraits, getQualityAndPureness } from './axieUtils';

interface ParsedAxieData extends Axie {
  traits: ReturnType<typeof getTraits>;
  quality: number;
}

export function parseAxieData(data: Axie): ParsedAxieData {
  const traits = getTraits(data.genes);
  const { quality } = getQualityAndPureness(traits, data.class);

  return {
    ...data,
    traits,
    quality,
  };
}
