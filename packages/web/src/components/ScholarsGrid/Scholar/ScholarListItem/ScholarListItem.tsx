import { SimpleGrid, Icon, GridItem } from '@chakra-ui/react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';
import { useState, Fragment, useMemo } from 'react';

import { scholarFieldsAtom, scholarSelector, ScholarFields } from '../../../../recoil/scholars';
import { Card } from '../../../Card';
import { ErroredItem } from './ErroredItem';
import { Collapsed } from './Collapsed';
import {
  ScholarFieldName,
  ScholarFieldAdventureSlp,
  ScholarFieldArenaElo,
  ScholarFieldLastClaim,
  ScholarFieldScholarShare,
  ScholarFieldManagerShare,
  ScholarFieldInvestorShare,
  ScholarFieldNextClaim,
  ScholarFieldSlp,
  ScholarFieldSlpDay,
  ScholarFieldTodaySlp,
  ScholarFieldYesterdaySlp,
} from './Fields';

interface ItemParams {
  address: string;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export const ScholarListItem = ({ address, isLoading, isError, refetch }: ItemParams): JSX.Element => {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

  const scholar = useRecoilValue(scholarSelector(address));
  const scholarFields = useRecoilValue(scholarFieldsAtom);

  const fields = useMemo(
    () =>
      ({
        name: {
          element: <ScholarFieldName address={address} />,
          size: 5,
        },
        slp: {
          element: <ScholarFieldSlp address={address} isLoading={isLoading} />,
          size: 4,
        },
        scholarShare: {
          element: <ScholarFieldScholarShare address={address} isLoading={isLoading} />,
          size: 4,
        },
        managerShare: {
          element: <ScholarFieldManagerShare address={address} isLoading={isLoading} />,
          size: 4,
        },
        investorShare: {
          element: <ScholarFieldInvestorShare address={address} isLoading={isLoading} />,
          size: 4,
        },
        arenaElo: {
          element: <ScholarFieldArenaElo address={address} isLoading={isLoading} refetch={refetch} />,
          size: 3,
        },
        todaySlp: {
          element: <ScholarFieldTodaySlp address={address} isLoading={isLoading} />,
          size: 3,
        },
        yesterdaySlp: {
          element: <ScholarFieldYesterdaySlp address={address} isLoading={isLoading} />,
          size: 4,
        },
        slpDay: {
          element: <ScholarFieldSlpDay address={address} isLoading={isLoading} />,
          size: 4,
        },
        adventureSlp: {
          element: <ScholarFieldAdventureSlp address={address} isLoading={isLoading} />,
          size: 4,
        },
        lastClaim: {
          element: <ScholarFieldLastClaim address={address} isLoading={isLoading} />,
          size: 4,
        },
        nextClaim: {
          element: <ScholarFieldNextClaim address={address} isLoading={isLoading} />,
          size: 4,
        },
      } as {
        [key in ScholarFields]: {
          element: JSX.Element;
          size: number;
        };
      }),
    [address, isLoading, refetch]
  );

  const columns = useMemo(
    () =>
      scholarFields.reduce((prev, field) => {
        if (!fields[field]) return prev;
        return prev + fields[field].size;
      }, 0),
    [fields, scholarFields]
  );

  if (isError) {
    return <ErroredItem address={address} refetch={refetch} />;
  }

  return (
    <Card w="100%" minH="90px" opacity={scholar.inactive ? 0.4 : 1}>
      <SimpleGrid
        alignItems="center"
        minH="90px"
        w="100%"
        cursor="pointer"
        onClick={handleToggle}
        columns={columns + 1}
        gap={8}
        px={5}
      >
        {scholarFields.map(field => (fields[field] ? <Fragment key={field}>{fields[field].element}</Fragment> : null))}

        <GridItem ml={-5} colSpan={1}>
          {show && <Icon fontSize="2xl" as={BsChevronUp} opacity={!isLoading ? 0.5 : 1} />}

          {!show && <Icon fontSize="2xl" as={BsChevronDown} opacity={!isLoading ? 0.5 : 1} />}
        </GridItem>
      </SimpleGrid>

      <Collapsed address={address} show={show} />
    </Card>
  );
};
