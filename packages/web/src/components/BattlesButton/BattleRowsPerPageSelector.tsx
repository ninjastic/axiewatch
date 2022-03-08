import { Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';

interface BattleRowsPerPageSelectorProps {
  value: number;
  onChange(value: number): void;
}

export const BattleRowsPerPageSelector = ({ value, onChange }: BattleRowsPerPageSelectorProps): JSX.Element => {
  return (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<FiChevronDown />} w="145px" variant="outline" textAlign="left">
        {!value ? 'Rows per page...' : `${value} rows`}
      </MenuButton>

      <MenuList>
        <MenuItem onClick={() => onChange(10)}>10</MenuItem>
        <MenuItem onClick={() => onChange(20)}>20</MenuItem>
        <MenuItem onClick={() => onChange(25)}>25</MenuItem>
        <MenuItem onClick={() => onChange(40)}>40</MenuItem>
        <MenuItem onClick={() => onChange(50)}>50</MenuItem>
        <MenuItem onClick={() => onChange(60)}>60</MenuItem>
      </MenuList>
    </Menu>
  );
};
