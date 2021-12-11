import { gql } from 'graphql-request';
import { useQuery } from 'react-query';
import { MD5 } from 'crypto-js';

import { axieInfinityGraphQl } from '../api';
import { Axie } from '../../recoil/scholars';
import { parseAxieData, ParsedAxieData } from '../utils/parseAxieData';

interface GraphQLResponse {
  [response: string]: {
    results: Axie[];
    total: number;
  };
}

interface UseBatchScholarAxieData {
  scholarAxies: ParsedAxieData[];
  isLoading: boolean;
  isFetching: boolean;
  isRefetching: boolean;
}

interface UseBatchScholarAxieProps {
  addresses: string[];
  size?: number;
}

export const useBatchScholarAxie = ({ addresses, size = 200 }: UseBatchScholarAxieProps): UseBatchScholarAxieData => {
  const hashedKey = MD5(`${JSON.stringify(addresses)}${size}`).toString();

  async function load() {
    const chunksLength = 20;

    const chunks = [...Array(Math.ceil(addresses.length / chunksLength))].map((_, index) => {
      const start = chunksLength * index;
      const end = start + chunksLength;

      return addresses.slice(start, end);
    });

    const promises = await Promise.all(
      chunks.map(async chunk => {
        const queries = chunk.reduce(
          (prev, address, index) =>
            `${prev}
    
          r${index}: axies(
            criteria: { stages: [1,4] }
            size: ${size},
            owner: "${address}"
          ) {
            total
            results {
              ...AxieBrief
            }
          }`,
          ''
        );

        const query = gql`
        query {
          ${queries}
        }
    
        fragment AxieBrief on Axie {
          id
          name
          stage
          class
          breedCount
          image
          title
          owner
          genes
          battleInfo {
            banned
          }
          auction {
            currentPrice
            currentPriceUSD
          }
          parts {
            id
            name
            class
            type
            specialGenes
          }
          stats {
            hp
            speed
            skill
            morale
          }
          birthDate
        }
      `;

        const response = await axieInfinityGraphQl.request<GraphQLResponse>(
          gql`
            ${query}
          `
        );

        return Object.values(response)
          .map(result => result.results.map(axie => parseAxieData(axie)))
          .filter(value => value);
      })
    );

    return promises.flat(2);
  }

  const { data, isLoading, isFetching, isRefetching } = useQuery(['batchScholarAxies', hashedKey], async () => load(), {
    enabled: addresses.length > 0,
    staleTime: 1000 * 60 * 15,
  });

  return { scholarAxies: data ?? [], isLoading, isFetching, isRefetching };
};
