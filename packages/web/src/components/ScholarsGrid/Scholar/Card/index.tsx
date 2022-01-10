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
  isLoading?: boolean;
}

export const ScholarCard = ({ address, isLoading }: ScholarCardParams): JSX.Element => {
  const scholar = useRecoilValue(scholarSelector(address));

  const shouldSkeletonLoading = isLoading || !scholar.loaded;

  const scholarDetailsModal = useCreateModal({
    id: 'scholarDetailsModal',
    title: scholar.name,
    content: <ScholarDetails address={address} />,
  });

  return (
    <Card rounded="lg" h="270px" cursor={scholar.errored ? 'auto' : 'pointer'} opacity={scholar.inactive ? 0.4 : 1}>
      {scholar.errored && <ErroredCard address={address} />}

      {!scholar.errored && (
        <Box onClick={scholarDetailsModal.onOpen}>
          <ScholarOverview address={address} isLoading={shouldSkeletonLoading} />
        </Box>
      )}
    </Card>
  );
};
