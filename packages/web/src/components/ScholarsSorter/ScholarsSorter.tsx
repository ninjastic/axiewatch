import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { useRecoilState, useRecoilValue } from 'recoil';

import { allScholarsSelector, scholarFieldsAtom, scholarSort } from '../../recoil/scholars';

export const ScholarsSorter = (): JSX.Element => {
  const scholars = useRecoilValue(allScholarsSelector);
  const [sort, setSort] = useRecoilState(scholarSort);
  const fields = useRecoilValue(scholarFieldsAtom);

  const isLoaded = scholars.filter(scholar => scholar.loaded || scholar.errored).length === scholars.length;

  return (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<FiChevronDown />} w="145px" variant="ghost" disabled={!isLoaded}>
        {!sort ? 'Sort by...' : sort}
      </MenuButton>

      <MenuList>
        <MenuItem onClick={() => setSort('')}>Default</MenuItem>
        <MenuItem onClick={() => setSort('Name')}>Name</MenuItem>
        <MenuItem onClick={() => setSort('Total SLP')}>Total SLP</MenuItem>
        {fields.includes('todaySlp') && <MenuItem onClick={() => setSort('SLP Today')}>SLP Today</MenuItem>}

        {fields.includes('yesterdaySlp') && <MenuItem onClick={() => setSort('SLP Yesterday')}>SLP Yesterday</MenuItem>}

        <MenuItem onClick={() => setSort('SLP per Day')}>SLP per Day</MenuItem>

        <MenuItem onClick={() => setSort('Arena Elo')}>Arena Elo</MenuItem>
        <MenuItem onClick={() => setSort('Next Claim')}>Next Claim</MenuItem>
      </MenuList>
    </Menu>
  );
};
