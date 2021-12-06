import bodyParts from '../../constants/body-parts.json';
import traitmapping from '../../constants/traitmapping.json';

type AxieClass = 'beast' | 'bug' | 'aquatic' | 'bird' | 'reptile' | 'plant';

const classGeneMap = {
  '0000': 'beast',
  '0001': 'bug',
  '0010': 'bird',
  '0011': 'plant',
  '0100': 'aquatic',
  '0101': 'reptile',
} as { [group: string]: AxieClass };

const geneColorMap = {
  '0000': {
    '0010': 'ffec51',
    '0011': 'ffa12a',
    '0100': 'f0c66e',
    '0110': '60afce',
  },
  '0001': { '0010': 'ff7183', '0011': 'ff6d61', '0100': 'f74e4e' },
  '0010': { '0010': 'ff9ab8', '0011': 'ffb4bb', '0100': 'ff778e' },
  '0011': { '0010': 'ccef5e', '0011': 'efd636', '0100': 'c5ffd9' },
  '0100': {
    '0010': '4cffdf',
    '0011': '2de8f2',
    '0100': '759edb',
    '0110': 'ff5a71',
  },
  '0101': {
    '0010': 'fdbcff',
    '0011': 'ef93ff',
    '0100': 'f5e1ff',
    '0110': '43e27d',
  },
  // nut hidden_1
  '1000': {
    '0010': 'D9D9D9',
    '0011': 'D9D9D9',
    '0100': 'D9D9D9',
    '0110': 'D9D9D9',
  },
  // star hidden_2
  '1001': {
    '0010': 'D9D9D9',
    '0011': 'D9D9D9',
    '0100': 'D9D9D9',
    '0110': 'D9D9D9',
  },
  // moon hidden_3
  '1010': {
    '0010': 'D9D9D9',
    '0011': 'D9D9D9',
    '0100': 'D9D9D9',
    '0110': 'D9D9D9',
  },
} as {
  [cls: string]: {
    [bin: string]: string;
  };
};

const PROBABILITIES = { d: 0.375, r1: 0.09375, r2: 0.03125 };

const parts = ['eyes', 'mouth', 'ears', 'horn', 'back', 'tail'] as const;

const MAX_QUALITY = 6 * (PROBABILITIES.d + PROBABILITIES.r1 + PROBABILITIES.r2);

function getClassFromGroup(group: string) {
  const bin = group.slice(0, 4);
  if (!(bin in classGeneMap)) {
    return 'Unknown Class';
  }
  return classGeneMap[bin];
}

function getRegionFromGroup(group: string) {
  const regionGeneMap = { '00000': 'global', '00001': 'japan' } as {
    [group: string]: string;
  };

  const regionBin = group.slice(8, 13);
  return regionGeneMap[regionBin] ?? 'Unknown Region';
}

function getPatternsFromGroup(group: string) {
  return {
    d: group.slice(2, 8),
    r1: group.slice(8, 14),
    r2: group.slice(14, 20),
  };
}

function strMul(str: string, num: number) {
  let s = '';
  for (let i = 0; i < num; i += 1) {
    s += str;
  }
  return s;
}

function genesToBin(genes: BigInt) {
  let genesString = genes.toString(2);
  genesString = strMul('0', 256 - genesString.length) + genesString;
  return genesString;
}

function getColor(bin: string, cls: string) {
  let color;
  if (bin === '0000') {
    color = 'ffffff';
  } else if (bin === '0001') {
    color = '7a6767';
  } else {
    color = geneColorMap[cls][bin];
  }
  return color;
}

function getColorsFromGroup(group: string, cls: string) {
  return {
    d: getColor(group.slice(20, 24), cls),
    r1: getColor(group.slice(24, 28), cls),
    r2: getColor(group.slice(28, 32), cls),
  };
}

function getPartName(cls: AxieClass, part: string, region: string, binary: string, skinBinary = '00') {
  let trait;

  const mapping = traitmapping as {
    [axieClass in AxieClass]: {
      [part: string]: {
        [bin: string]: {
          [region: string]: string;
        };
      };
    };
  };

  if (binary in mapping[cls][part]) {
    if (skinBinary === '11') {
      trait = mapping[cls][part][binary].mystic;
    } else if (skinBinary === '10') {
      trait = mapping[cls][part][binary].xmas;
    } else if (region in mapping[cls][part][binary]) {
      trait = mapping[cls][part][binary][region];
    } else if ('global' in mapping[cls][part][binary]) {
      trait = mapping[cls][part][binary].global;
    } else {
      trait = `UNKNOWN Regional ${cls} ${part}`;
    }
  } else {
    trait = `UNKNOWN ${cls} ${part}`;
  }

  return trait;
}

function getPartFromName(traitType: string, partName: string) {
  const traitId = `${traitType.toLowerCase()}-${partName.toLowerCase().replace(/\s/g, '-').replace(/[?'.]/g, '')}`;

  return bodyParts.find(part => part.partId === traitId);
}

function getPartsFromGroup(part: string, group: string, region: string) {
  const skinBinary = group.slice(0, 2);
  const dClass = classGeneMap[group.slice(2, 6)];
  const dBin = group.slice(6, 12);
  const dName = getPartName(dClass, part, region, dBin, skinBinary);

  const r1Class = classGeneMap[group.slice(12, 16)];
  const r1Bin = group.slice(16, 22);
  const r1Name = getPartName(r1Class, part, region, r1Bin);

  const r2Class = classGeneMap[group.slice(22, 26)];
  const r2Bin = group.slice(26, 32);
  const r2Name = getPartName(r2Class, part, region, r2Bin);

  return {
    d: getPartFromName(part, dName),
    r1: getPartFromName(part, r1Name),
    r2: getPartFromName(part, r2Name),
  };
}

export type AxieGeneType = 'd' | 'r2' | 'r1';

export interface AxieGene {
  partId: string;
  class: string;
  specialGenes: string;
  type: string;
  name: string;
}

export interface AxieSale {
  id: string;
  skin: string;
  cls: AxieClass;
  tag: string;
  region: string;
  back: Record<AxieGeneType, AxieGene>;
  ears: Record<AxieGeneType, AxieGene>;
  mouth: Record<AxieGeneType, AxieGene>;
  eyes: Record<AxieGeneType, AxieGene>;
  tail: Record<AxieGeneType, AxieGene>;
  horn: Record<AxieGeneType, AxieGene>;
  pattern: Record<AxieGeneType, string>;
}

interface AxieTraits {
  cls: string;
  region: string;
  pattern: Record<AxieGeneType, string>;
  color: Record<AxieGeneType, string>;
  back: Record<AxieGeneType, AxieGene>;
  ears: Record<AxieGeneType, AxieGene>;
  horn: Record<AxieGeneType, AxieGene>;
  tail: Record<AxieGeneType, AxieGene>;
  eyes: Record<AxieGeneType, AxieGene>;
  mouth: Record<AxieGeneType, AxieGene>;
}

export const getTraits = (genes: string): AxieTraits => {
  const genesBin = genesToBin(BigInt(genes));

  const groups = [
    genesBin.slice(0, 32),
    genesBin.slice(32, 64),
    genesBin.slice(64, 96),
    genesBin.slice(96, 128),
    genesBin.slice(128, 160),
    genesBin.slice(160, 192),
    genesBin.slice(192, 224),
    genesBin.slice(224, 256),
  ];

  const cls = getClassFromGroup(groups[0]);
  const region = getRegionFromGroup(groups[0]);
  const pattern = getPatternsFromGroup(groups[1]);
  const color = getColorsFromGroup(groups[1], groups[0].slice(0, 4));
  const eyes = getPartsFromGroup('eyes', groups[2], region);
  const mouth = getPartsFromGroup('mouth', groups[3], region);
  const ears = getPartsFromGroup('ears', groups[4], region);
  const horn = getPartsFromGroup('horn', groups[5], region);
  const back = getPartsFromGroup('back', groups[6], region);
  const tail = getPartsFromGroup('tail', groups[7], region);

  return { cls, region, pattern, color, eyes, mouth, ears, horn, back, tail };
};

export const getQualityAndPureness = (traits: AxieTraits, cls: string): { quality: number; pureness: number } => {
  let quality = 0;
  let dPureness = 0;

  Object.values(parts).forEach(part => {
    if (traits[part].d.class.toLowerCase() === cls.toLowerCase()) {
      quality += PROBABILITIES.d;
      dPureness += 1;
    }
    if (traits[part].r1.class.toLowerCase() === cls.toLowerCase()) {
      quality += PROBABILITIES.r1;
    }
    if (traits[part].r2.class.toLowerCase() === cls.toLowerCase()) {
      quality += PROBABILITIES.r2;
    }
  });

  return { quality: quality / MAX_QUALITY, pureness: dPureness };
};

export const getTraitProbabilities = (momTraits: AxieTraits, dadTraits: AxieTraits): Record<string, number> => {
  const probabilities = {};

  Object.values(parts).forEach(part => {
    const momTrait = momTraits[part as typeof parts[number]];
    const dadTrait = dadTraits[part as typeof parts[number]];

    Object.entries(momTrait).forEach(([geneType, gene]) => {
      if (probabilities[gene.partId]) {
        probabilities[gene.partId] += PROBABILITIES[geneType];
      } else {
        probabilities[gene.partId] = PROBABILITIES[geneType];
      }
    });

    Object.entries(dadTrait).forEach(([geneType, gene]) => {
      if (probabilities[gene.partId]) {
        probabilities[gene.partId] += PROBABILITIES[geneType];
      } else {
        probabilities[gene.partId] = PROBABILITIES[geneType];
      }
    });
  });

  return probabilities;
};
