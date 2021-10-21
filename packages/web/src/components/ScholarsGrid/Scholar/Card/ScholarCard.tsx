import { Box } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';

import { useCreateModal } from '../../../../services/hooks/useCreateModal';
import { scholarSelector } from '../../../../recoil/scholars';
import { Card } from '../../../Card';
import { ScholarDetails } from './ScholarDetails';
import { ScholarOverview } from './ScholarOverview';
import { ErroredCard } from './ErroredCard';

interface ScholarCardParams {
  address: string;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

export const ScholarCard = ({ address, isLoading, isError, refetch }: ScholarCardParams): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  const scholarDetailsModal = useCreateModal({
    id: 'scholarDetailsModal',
    title: () => scholar.name,
    content: () => <ScholarDetails address={address} />,
  });

  return (
    <Card rounded="lg" h="280px" cursor={isError ? 'auto' : 'pointer'} opacity={scholar.inactive ? 0.4 : 1}>
      {isError && <ErroredCard address={address} refetch={refetch} />}

      {!isError && (
        <Box onClick={!isLoading ? scholarDetailsModal.onOpen : undefined}>
          <ScholarOverview address={address} isLoading={isLoading} refetch={refetch} />
        </Box>
      )}
    </Card>
  );
};
