import { Button } from '@chakra-ui/react';
import { HiOutlineFilter } from 'react-icons/hi';
import { useRecoilValue } from 'recoil';

import { useCreateModal } from '../../services/hooks/useCreateModal';
import { getNumberOfFilters } from '../../services/utils/getNumberOfFilters';
import { scholarAxiesFilter } from '../../recoil/scholars';
import { AxiesFilterModal } from './AxiesFilterModal';

export const AxiesFilterButton = (): JSX.Element => {
  const filter = useRecoilValue(scholarAxiesFilter);

  const numberOfFilters = getNumberOfFilters(filter);

  const axiesFilterModal = useCreateModal({
    id: 'axiesFilterModal',
    title: 'Filters',
    content: <AxiesFilterModal />,
    size: '2xl',
  });

  return (
    <Button aria-label="Filter" leftIcon={<HiOutlineFilter />} variant="ghost" onClick={axiesFilterModal.onOpen}>
      Filters {numberOfFilters ? `(${numberOfFilters})` : null}
    </Button>
  );
};
