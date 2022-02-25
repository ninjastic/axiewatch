import { Tooltip, Link, Tag, Text, Stack, Image, Box, SkeletonCircle, HStack, Flex } from '@chakra-ui/react';
import { gql } from 'graphql-request';
import { useQuery } from 'react-query';
import { useMemo } from 'react';

import { axieInfinityGraphQl } from '../../services/api';
import { Axie, AxieClass } from 'src/recoil/scholars';
import { AxieIcon } from '../Icons/AxieIcon';
import { AxieTraits } from '../AxieTraits';
import { parseAxieData } from 'src/services/utils/parseAxieData';
import { AxieInfo } from '../AxieInfo';

const query = gql`
  query GetAxieDetail($axieId: ID!) {
    axie(axieId: $axieId) {
      ...AxieDetail
    }
  }

  fragment AxieDetail on Axie {
    id
    image
    class
    chain
    name
    genes
    owner
    birthDate
    bodyShape
    class
    sireId
    sireClass
    matronId
    matronClass
    stage
    title
    breedCount
    level
    figure {
      atlas
      model
      image
    }
    parts {
      ...AxiePart
    }
    stats {
      ...AxieStats
    }
    auction {
      ...AxieAuction
    }
    ownerProfile {
      name
    }
    battleInfo {
      ...AxieBattleInfo
    }
    children {
      id
      name
      class
      image
      title
      stage
    }
  }

  fragment AxieBattleInfo on AxieBattleInfo {
    banned
    banUntil
    level
    __typename
  }

  fragment AxiePart on AxiePart {
    id
    name
    class
    type
    specialGenes
    stage
    abilities {
      ...AxieCardAbility
      __typename
    }
    __typename
  }

  fragment AxieCardAbility on AxieCardAbility {
    id
    name
    attack
    defense
    energy
    description
    backgroundUrl
    effectIconUrl
    __typename
  }

  fragment AxieStats on AxieStats {
    hp
    speed
    skill
    morale
    __typename
  }

  fragment AxieAuction on Auction {
    startingPrice
    endingPrice
    startingTimestamp
    endingTimestamp
    duration
    timeLeft
    currentPrice
    currentPriceUSD
    suggestedPrice
    seller
    listingIndex
    state
    __typename
  }
`;

interface GraphQLResponse {
  axie: Axie;
}

interface AxieCardProps {
  data: Axie;
}

const AxieCard = ({ data }: AxieCardProps): JSX.Element => {
  return (
    <Stack>
      <Flex align="center" justify="center" direction="column">
        <Image
          src={data.image}
          w="96px"
          h={{ lg: '72px' }}
          alt={`Axie ${data.id}`}
          fallback={
            <Box d="flex" alignItems="center" justifyContent="center" w="96px" h={{ lg: '72px' }}>
              <SkeletonCircle />
            </Box>
          }
          transition="all .2s ease-out"
          _hover={{ transform: 'translateY(-4px)', opacity: 0.9 }}
        />
      </Flex>

      <AxieInfo axieData={data} />
      <AxieTraits axieData={data} />
    </Stack>
  );
};

interface AxieTagProps {
  id: number;
}

export const AxieTag = ({ id }: AxieTagProps): JSX.Element => {
  const axieUrl = useMemo(() => `https://marketplace.axieinfinity.com/axie/${id}/?referrer=axie.watch`, [id]);

  const { data, isLoading, isError } = useQuery(
    ['axie', id],
    async () => {
      const { axie } = await axieInfinityGraphQl.request<GraphQLResponse>(query, { axieId: id });

      if (axie.class) {
        return parseAxieData(axie);
      }

      return axie;
    },
    {
      staleTime: 1000 * 60 * 60 * 12,
    }
  );

  if (isError) {
    return <Tag color="red.300">Error</Tag>;
  }

  return (
    <Tooltip
      label={
        <Box w="300px">
          <AxieCard data={data} />
        </Box>
      }
      isDisabled={isLoading || !data?.class}
    >
      <Link href={axieUrl} target="_blank">
        <Tag>
          <Box>
            <HStack>
              {isLoading && <SkeletonCircle size="3" />}
              {data && data.class && <AxieIcon type={data.class?.toLowerCase() as AxieClass} />}
              {data && !data?.class && <Text>🥚</Text>}
              <Text>{id}</Text>
            </HStack>
          </Box>
        </Tag>
      </Link>
    </Tooltip>
  );
};
