import { Stack, Flex, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { BiCheckCircle } from 'react-icons/bi';
import { MdClear } from 'react-icons/md';

import { getNumberOfFilters } from '../../services/utils/getNumberOfFilters';
import { modalSelector } from '../../recoil/modal';
import { scholarAxiesFilter, ScholarAxiesFilter } from '../../recoil/scholars';
import {
  FilterBreedInput,
  FilterClassSelect,
  FilterPurityInput,
  FilterOwnerSelect,
  FiltersPartsSelector,
} from './Filters';

export const AxiesFilterModal = (): JSX.Element => {
  const modal = useRecoilValue(modalSelector('axiesFilterModal'));

  const [filter, setFilter] = useRecoilState(scholarAxiesFilter);
  const resetFilter = useResetRecoilState(scholarAxiesFilter);
  const [formValues, setFormValues] = useState<ScholarAxiesFilter>(filter);

  const handleSave = () => {
    setFilter(formValues);
    modal.onClose();
  };

  const clearFilters = () => {
    resetFilter();
    modal.onClose();
  };

  return (
    <Stack p={5} spacing={6}>
      <FilterBreedInput setFilter={setFormValues} formValues={formValues} />

      <FilterPurityInput setFilter={setFormValues} formValues={formValues} />

      <FilterOwnerSelect setFilter={setFormValues} formValues={formValues} />

      <FilterClassSelect setFilter={setFormValues} formValues={formValues} />

      <FiltersPartsSelector setFilter={setFormValues} formValues={formValues} />

      <Flex align="center" justify="space-between">
        <Button leftIcon={<MdClear />} onClick={clearFilters} isDisabled={!getNumberOfFilters(filter)}>
          Clear Filters
        </Button>

        <Button leftIcon={<BiCheckCircle />} onClick={handleSave}>
          Save
        </Button>
      </Flex>
    </Stack>
  );
};
