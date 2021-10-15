import {
  Menu,
  MenuList,
  MenuItem,
  Text,
  IconButton,
  useClipboard,
  Tooltip,
  Flex,
  Portal,
  useOutsideClick,
  Box,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { MdContentCopy } from 'react-icons/md';
import { useRecoilValue } from 'recoil';

import { scholarSelector } from '../../../../recoil/scholars';

interface ScholarAddressProps {
  address: string;
  showButton?: boolean;
}

export function ScholarAddress({ address, showButton = true }: ScholarAddressProps) {
  const scholar = useRecoilValue(scholarSelector(address));

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);
  const menuRef = useRef(null);

  useOutsideClick({
    ref: containerRef,
    handler: () => setIsOpen(false),
  });

  const shortAddress = `${address.substr(0, 5)}...${address.substr(address.length - 5)}`;

  const { onCopy: onCopyAddress } = useClipboard(address.replace('0x', 'ronin:'));
  const { onCopy: onCopyPaymentAddress } = useClipboard(scholar.paymentAddress?.replace('0x', 'ronin:'));

  return (
    <Flex align="center" ref={containerRef}>
      <Tooltip label={<Text maxW="200px">{address}</Text>}>
        <Text minW="100px" opacity={0.8}>
          {shortAddress}
        </Text>
      </Tooltip>

      {showButton && (
        <IconButton
          aria-label="Open copy address menu"
          minW="25px"
          icon={<MdContentCopy />}
          variant="link"
          onClick={e => {
            e.stopPropagation();
            setIsOpen(prev => !prev);
          }}
        />
      )}

      <Menu isLazy isOpen={isOpen}>
        <Portal containerRef={menuRef}>
          <MenuList onClick={e => e.stopPropagation()}>
            <MenuItem
              onClick={() => {
                onCopyAddress();
                setIsOpen(false);
              }}
            >
              Copy address
            </MenuItem>

            <MenuItem
              onClick={() => {
                onCopyPaymentAddress();
                setIsOpen(false);
              }}
              isDisabled={!scholar.paymentAddress}
            >
              Copy payment address
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>

      <Box position="relative">
        <div ref={menuRef} />
      </Box>
    </Flex>
  );
}
