import { Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';

interface BattleRowsPerPageSelectorProps {
  value: number;
  onChange(value: number): void;
}

export function BattleRowsPerPageSelector({ value, onChange }: BattleRowsPerPageSelectorProps) {
  return (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<FiChevronDown />} w="145px" variant="ghost">
        {!value ? 'Rows per page...' : `${value} rows`}
      </MenuButton>

      <MenuList>
        <MenuItem onClick={() => onChange(10)}>10</MenuItem>
        <MenuItem onClick={() => onChange(25)}>25</MenuItem>
        <MenuItem onClick={() => onChange(50)}>50</MenuItem>
      </MenuList>
    </Menu>
  );
}
