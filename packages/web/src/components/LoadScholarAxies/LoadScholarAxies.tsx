import { useQuery } from 'react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { gql } from 'graphql-request';
import { useEffect } from 'react';

import { axieInfinityGraphQl } from '../../services/api';
import { scholarAxies, scholarSelector, Axie } from '../../recoil/scholars';
import { parseAxieData } from '../../services/utils/parseAxieData';

interface ResponseData {
  total: number;
  results: Axie[];
}

interface Response {
  axies: ResponseData;
}

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
    __typename
  }
`;

interface LoadScholarAxiesProps {
  address: string;
}

export const LoadScholarAxies = ({ address }: LoadScholarAxiesProps): JSX.Element => {
  const setAxies = useSetRecoilState(scholarAxies(address));
  const scholar = useRecoilValue(scholarSelector(address));

  const { data } = useQuery(
    ['axies', address],
    async () => {
      const response = await axieInfinityGraphQl.request<Response>(GetAxieBriefListQuery, {
        auctionType: 'All',
        criteria: {
          stages: [4],
        },
        from: 0,
        owner: address,
        size: 24,
        sort: 'IdDesc',
      });

      return response.axies;
    },
    {
      staleTime: 1000 * 60 * 15,
      retry: false,
    }
  );

  useEffect(() => {
    if (data) {
      const axies = data.results.map(axie => parseAxieData(axie));

      setAxies({
        address,
        name: scholar.name,
        axies,
        loaded: true,
        errored: false,
      });
    }
  }, [address, data, scholar.name, setAxies]);

  return null;
};
