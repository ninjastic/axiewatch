import { Button, ButtonProps } from '@chakra-ui/react';
import { HiOutlineFilter } from 'react-icons/hi';
import { useRecoilValue } from 'recoil';

import { useCreateModal } from '../../services/hooks/useCreateModal';
import { allScholarsSelector, scholarFilter } from '../../recoil/scholars';
import { ScholarsFilterModal } from './ScholarsFilterModal';

export const ScholarsFilterButton = ({ variant = 'ghost' }: ButtonProps): JSX.Element => {
  const scholars = useRecoilValue(allScholarsSelector);
  const filter = useRecoilValue(scholarFilter);

  const getNumberOfFilters = (() => {
    let total = 0;
    if (filter.SLP.above || filter.SLP.under) total += 1;
    if (filter.onlyClaimable) total += 1;
    return total;
  })();

  const isLoaded = scholars.filter(scholar => scholar.loaded || scholar.errored).length === scholars.length;

  const scholarsFilterModal = useCreateModal({
    id: 'scholarsFilterModal',
    title: 'Filters',
    content: <ScholarsFilterModal />,
  });

  return (
    <Button
      aria-label="Filter"
      leftIcon={<HiOutlineFilter />}
      variant={variant}
      onClick={scholarsFilterModal.onOpen}
      disabled={!isLoaded}
    >
      Filters {getNumberOfFilters ? `(${getNumberOfFilters})` : null}
    </Button>
  );
};
