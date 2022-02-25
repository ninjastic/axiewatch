import {
  Slide,
  Box,
  Text,
  Flex,
  Image,
  Icon,
  Button,
  Input,
  SkeletonCircle,
  Collapse,
  useDisclosure,
  useNumberInput,
} from '@chakra-ui/react';
import { HiPlus } from 'react-icons/hi';
import { useRecoilState, useRecoilValue } from 'recoil';
import { GraphQLResponse } from 'graphql-request/dist/types';
import { useEffect, useRef, useState } from 'react';
import { gql } from 'graphql-request';
import { useQuery } from 'react-query';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';

import { axieInfinityGraphQl } from '../../services/api';
import { breedingStateAtom, isBreedingModeAtom } from 'src/recoil/breeding';
import { Card } from '../Card';
import { useCreateModal } from 'src/services/hooks/useCreateModal';
import { BreedingResultCard } from './BreedingResultModal';
import { Axie } from 'src/recoil/scholars';
import { parseAxieData } from 'src/services/utils/parseAxieData';

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

interface SelectedAxieBreedingProps {
  axie: Axie;
  id: number;
}

const SelectedAxieBreeding = ({ axie, id }: SelectedAxieBreedingProps): JSX.Element => {
  const [breedingState, setBreedingState] = useRecoilState(breedingStateAtom);
  const [axieData, setAxieData] = useState(axie);
  const [customIdValue, setCustomIdValue] = useState<string>('');
  const idInputRef = useRef<HTMLInputElement>(null);

  const { getInputProps } = useNumberInput({
    min: 1,
    value: customIdValue,
    onChange: value => setCustomIdValue(value),
    onBlur: e => {
      if (e.target.value) {
        setBreedingState(prev => {
          const draft = Array.from(prev);
          draft[id] = {
            ...draft[id],
            id: e.target.value,
          };
          return draft;
        });
        setCustomIdValue('');
      }
    },
  });

  const input = getInputProps({
    onKeyDown: event => event.key === 'Enter' && idInputRef.current?.blur(),
  });

  const { data } = useQuery(
    ['axie', axieData?.id],
    async () => {
      const response = await axieInfinityGraphQl.request<GraphQLResponse>(query, { axieId: axieData?.id });

      if (response.axie.class) {
        return parseAxieData(response.axie);
      }

      return axie;
    },
    {
      enabled: Boolean(!axieData?.class && axieData?.id && axieData?.id !== '0'),
      staleTime: 1000 * 60 * 60 * 12,
    }
  );

  useEffect(() => {
    setAxieData(axie);
  }, [axie]);

  useEffect(() => {
    if (data) {
      setAxieData(data);
      setBreedingState(prev => {
        const draft = Array.from(prev);
        draft[id] = data;
        return draft;
      });
    }
  }, [data, id, setBreedingState]);

  return (
    <Box w="94px" h="94px" px={2} mx={2}>
      {axieData ? (
        <Flex
          flexDirection="column"
          align="center"
          justify="center"
          cursor="pointer"
          onClick={() =>
            setBreedingState(() => {
              const index = breedingState.findIndex(p => p?.id === axieData.id);
              if (index === 0) return [undefined, breedingState[1]];
              return [breedingState[0], undefined];
            })
          }
        >
          {axieData.image ? <Image src={axieData.image} alt={`Axie ${axieData.id}`} /> : <SkeletonCircle size="8" />}

          <Box position="relative" top="-45px" right="-20px">
            <MdClose />
          </Box>
          <Text fontSize="sm" textOverflow="ellipsis" overflowX="hidden" whiteSpace="nowrap" maxW="100px" mt="-10px">
            {axieData.name || `#${axieData.id}`}
          </Text>
        </Flex>
      ) : (
        <Flex flexDirection="column" align="center" justify="center">
          <Image src="/images/axies/empty-axie.png" alt="Empty Axie" w="72px" />
          <Input mt={3} size="sm" placeholder="ID" borderRadius="lg" {...input} ref={idInputRef} />
        </Flex>
      )}
    </Box>
  );
};

export const BreedingFloatingCard = (): JSX.Element => {
  const [breedingState, setBreedingState] = useRecoilState(breedingStateAtom);
  const isBreedingMode = useRecoilValue(isBreedingModeAtom);
  const { isOpen, onOpen, onToggle } = useDisclosure();

  const resultModal = useCreateModal({
    id: 'breedingResultModal',
    title: 'Breeding Simulator',
    content: <BreedingResultCard />,
    size: '4xl',
  });

  useEffect(() => {
    if (!isBreedingMode) {
      setBreedingState([]);
    } else {
      onOpen();
    }
  }, [isBreedingMode, onOpen, setBreedingState]);

  return (
    <Slide direction="bottom" in={isBreedingMode} style={{ zIndex: 10, maxWidth: 350, margin: 'auto' }}>
      <Card borderWidth={1} mb={3}>
        <Flex justify="space-between" align="center" onClick={onToggle} cursor="pointer" p={3} py={2}>
          <Text fontWeight="bold">Breeding Simulator Mode</Text>

          <Icon as={isOpen ? BsChevronUp : BsChevronDown} aria-label="Toggle breeding simulator collapse" size="32px" />
        </Flex>

        <Collapse in={isOpen}>
          <Flex align="center" justify="space-between" mt={4} px={2}>
            <SelectedAxieBreeding axie={breedingState[0]} id={0} />

            <Icon as={HiPlus} aria-label="Plus icon" fontSize="32px" />

            <SelectedAxieBreeding axie={breedingState[1]} id={1} />
          </Flex>

          <Flex align="center" justify="center" mb={2}>
            <Button isDisabled={!(breedingState[0]?.traits && breedingState[1]?.traits)} onClick={resultModal.onOpen}>
              Simulate
            </Button>
          </Flex>
        </Collapse>
      </Card>
    </Slide>
  );
};
