import { SimpleGrid, Icon, GridItem } from '@chakra-ui/react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useRecoilValue } from 'recoil';
import { useState, useMemo } from 'react';

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
  isLoading?: boolean;
}

export const ScholarListItem = ({ address, isLoading = false }: ItemParams): JSX.Element => {
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

  const scholar = useRecoilValue(scholarSelector(address));
  const scholarFields = useRecoilValue(scholarFieldsAtom);

  const shouldSkeletonLoading = isLoading || !scholar.loaded;

  const fields = useMemo(
    () =>
      ({
        name: {
          element: <ScholarFieldName address={address} isLoading={shouldSkeletonLoading} />,
          size: 5,
        },
        slp: {
          element: <ScholarFieldSlp address={address} isLoading={shouldSkeletonLoading} />,
          size: 3,
        },
        scholarShare: {
          element: <ScholarFieldScholarShare address={address} isLoading={shouldSkeletonLoading} />,
          size: 3,
        },
        managerShare: {
          element: <ScholarFieldManagerShare address={address} isLoading={shouldSkeletonLoading} />,
          size: 3,
        },
        investorShare: {
          element: <ScholarFieldInvestorShare address={address} isLoading={shouldSkeletonLoading} />,
          size: 3,
        },
        arenaElo: {
          element: <ScholarFieldArenaElo address={address} isLoading={shouldSkeletonLoading} />,
          size: 3,
        },
        todaySlp: {
          element: <ScholarFieldTodaySlp address={address} isLoading={shouldSkeletonLoading} />,
          size: 3,
        },
        yesterdaySlp: {
          element: <ScholarFieldYesterdaySlp address={address} isLoading={shouldSkeletonLoading} />,
          size: 3,
        },
        slpDay: {
          element: <ScholarFieldSlpDay address={address} isLoading={shouldSkeletonLoading} />,
          size: 3,
        },
        adventureSlp: {
          element: <ScholarFieldAdventureSlp address={address} isLoading={shouldSkeletonLoading} />,
          size: 4,
        },
        lastClaim: {
          element: <ScholarFieldLastClaim address={address} isLoading={shouldSkeletonLoading} />,
          size: 4,
        },
        nextClaim: {
          element: <ScholarFieldNextClaim address={address} isLoading={shouldSkeletonLoading} />,
          size: 4,
        },
      } as {
        [key in ScholarFields]: {
          element: JSX.Element;
          size: number;
        };
      }),
    [address, shouldSkeletonLoading]
  );

  const renderFields = useMemo(
    () =>
      scholarFields.map(field =>
        fields[field] ? (
          <GridItem key={field} colSpan={fields[field].size}>
            {fields[field].element}
          </GridItem>
        ) : null
      ),
    [fields, scholarFields]
  );

  const columns = useMemo(
    () =>
      scholarFields.reduce((prev, field) => {
        if (!fields[field]) return prev;
        return prev + fields[field].size;
      }, 0),
    [fields, scholarFields]
  );

  if (scholar.errored) {
    return <ErroredItem address={address} />;
  }

  return (
    <Card w="100%" minH="75px" opacity={scholar.inactive ? 0.4 : 1}>
      <SimpleGrid
        alignItems="center"
        minH="75px"
        w="100%"
        cursor={!isLoading ? 'pointer' : 'default'}
        onClick={!isLoading ? handleToggle : undefined}
        columns={columns + 1}
        gap={5}
        px={5}
      >
        {renderFields}

        {!isLoading && scholar.loaded ? (
          <GridItem ml={-5} colSpan={1}>
            {show && <Icon fontSize="2xl" as={BsChevronUp} opacity={!isLoading ? 0.5 : 1} />}
            {!show && <Icon fontSize="2xl" as={BsChevronDown} opacity={!isLoading ? 0.5 : 1} />}
          </GridItem>
        ) : null}
      </SimpleGrid>

      <Collapsed address={address} show={show} />
    </Card>
  );
};
