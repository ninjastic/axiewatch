import {
  Button,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Box,
  Text,
  Flex,
  Portal,
  useOutsideClick,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { BiExport } from 'react-icons/bi';

import { useCreateModal } from '../../../services/hooks/useCreateModal';
import { ExportFileModal } from './ExportFileModal';
import { ExportDashboardModal } from './ExportDashboardModal';

export function ExportButton() {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);
  const menuRef = useRef(null);

  useOutsideClick({
    ref: containerRef,
    handler: () => setIsOpen(false),
  });

  const exportFileModal = useCreateModal({
    id: 'exportFileModal',
    title: () => 'Export Scholars',
    content: () => <ExportFileModal />,
    size: '2xl',
  });

  const exportDashboardModal = useCreateModal({
    id: 'exportDashboardModal',
    title: () => (
      <Box>
        <Text>Export Dashboard</Text>
        <Text fontSize="sm" fontWeight="normal" opacity={0.8}>
          Create your shareable dashboard.
        </Text>
      </Box>
    ),
    content: () => <ExportDashboardModal />,
    size: '2xl',
  });

  return (
    <Flex align="center" ref={containerRef}>
      <Menu isLazy isOpen={isOpen}>
        <Portal containerRef={menuRef}>
          <MenuButton as={Button} leftIcon={<BiExport />} variant="ghost" onClick={() => setIsOpen(prev => !prev)}>
            Export
          </MenuButton>

          <MenuList>
            <MenuItem
              onClick={() => {
                exportFileModal.onOpen();
                setIsOpen(false);
              }}
            >
              File (.csv, .json)
            </MenuItem>
            <MenuItem
              onClick={() => {
                exportDashboardModal.onOpen();
                setIsOpen(false);
              }}
            >
              Dashboard URL
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
