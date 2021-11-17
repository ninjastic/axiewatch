import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';
import { useRecoilState, useRecoilValue } from 'recoil';

import { scholarFieldsAtom, scholarSort } from '../../recoil/scholars';

export const ScholarsSorter = (): JSX.Element => {
  const [sort, setSort] = useRecoilState(scholarSort);
  const fields = useRecoilValue(scholarFieldsAtom);

  return (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<FiChevronDown />} w="165px" variant="outline" textAlign="left">
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
