import { gql } from 'graphql-request';
import { useQuery } from 'react-query';

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
  scholarAxies: ParsedAxieData[][];
  isLoading: boolean;
}

export const useBatchScholarAxie = (addresses: string[]): UseBatchScholarAxieData => {
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
            criteria: { stages: [4] }
            size: 200,
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
            __typename
          }
          auction {
            currentPrice
            currentPriceUSD
            __typename
          }
          parts {
            id
            name
            class
            type
            specialGenes
            __typename
          }
          __typename
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

    return promises.flat(1);
  }

  const { data, isLoading } = useQuery('axies', async () => load(), {
    staleTime: 1000 * 60 * 5,
  });

  return { scholarAxies: data ?? [], isLoading };
};
