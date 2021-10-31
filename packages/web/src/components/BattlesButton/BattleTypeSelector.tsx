import { Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react';
import { FiChevronDown } from 'react-icons/fi';

interface BattleTypeSelectorProps {
  value: string;
  onChange(value: string): void;
}

export const BattleTypeSelector = ({ value, onChange }: BattleTypeSelectorProps): JSX.Element => {
  return (
    <Menu isLazy>
      <MenuButton as={Button} rightIcon={<FiChevronDown />} w="145px" variant="outline" textAlign="left">
        {!value ? 'Only show...' : value}
      </MenuButton>

      <MenuList>
        <MenuItem onClick={() => onChange('All')}>All</MenuItem>
        <MenuItem onClick={() => onChange('PVP')}>PVP</MenuItem>
        <MenuItem onClick={() => onChange('PVE')}>PVE</MenuItem>
      </MenuList>
    </Menu>
  );
};
