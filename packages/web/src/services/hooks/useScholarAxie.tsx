import { useQuery, UseQueryResult } from 'react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { gql } from 'graphql-request';

import { axieInfinityGraphQl } from '../api';
import { scholarAxies, scholarSelector, Axie } from '../../recoil/scholars';
import { parseAxieData } from '../utils/parseAxieData';

const GetAxieBriefListQuery = gql`
  query GetAxieBriefList(
    $auctionType: AuctionType
    $criteria: AxieSearchCriteria
    $from: Int
    $sort: SortBy
    $size: Int
    $owner: String
  ) {
    axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {
      total
      results {
        ...AxieBrief
        __typename
      }
      __typename
    }
  }

  fragment AxieBrief on Axie {
    id
    name
    stage
    class
    genes
    breedCount
    owner
    image
    title
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
    stats {
      hp
      speed
      skill
      morale
    }
    __typename
  }
`;

interface ResponseData {
  total: number;
  results: Axie[];
}

interface Response {
  axies: ResponseData;
}

interface UseScholarAxieProps {
  address: string;
  size?: number;
  enabled?: boolean;
}

export const useScholarAxie = ({
  address,
  size = 24,
  enabled = true,
}: UseScholarAxieProps): UseQueryResult<ResponseData> => {
  const setAxies = useSetRecoilState(scholarAxies(address));
  const scholar = useRecoilValue(scholarSelector(address));

  const result = useQuery(
    ['scholarAxies', address, size],
    async () => {
      const response = await axieInfinityGraphQl.request<Response>(GetAxieBriefListQuery, {
        auctionType: 'All',
        criteria: {
          stages: [4],
        },
        from: 0,
        owner: address,
        size,
        sort: 'IdDesc',
      });

      const axies = response.axies.results.map(axie => parseAxieData(axie));

      setAxies({
        address,
        name: scholar.name,
        axies,
        loaded: true,
        errored: false,
      });

      return response.axies;
    },
    {
      enabled,
      staleTime: 1000 * 60 * 15,
    }
  );

  return result;
};
