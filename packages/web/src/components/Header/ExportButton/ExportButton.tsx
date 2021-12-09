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
  // Link,
  useOutsideClick,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { BiExport } from 'react-icons/bi';

import { useCreateModal } from '../../../services/hooks/useCreateModal';
import { ExportFileModal } from './ExportFileModal';
import { ExportDashboardModal } from './ExportDashboardModal';
import { ExportDiscordBot } from './ExportDiscordBot';

export const ExportButton = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);
  const menuRef = useRef(null);

  useOutsideClick({
    ref: containerRef,
    handler: () => setIsOpen(false),
  });

  const exportFileModal = useCreateModal({
    id: 'exportFileModal',
    title: 'Export Scholars',
    content: <ExportFileModal />,
    size: '2xl',
  });

  const exportDiscordBotModal = useCreateModal({
    id: 'exportDiscordBotModal',
    title: (
      <Box>
        <Text>Export to Lamp and Max&apos;s Axie Bot</Text>
        {/* <Text fontSize="sm" fontWeight="normal" opacity={0.9}>
          For instructions,{' '}
          <Link
            fontWeight="bold"
            href="https://lampandmaxaxie.notion.site/LampAndMax-Axie-Bot-Information-6ffe8465db214b8095cedbdba93dc86f"
            target="_blank"
          >
            click here.
          </Link>
        </Text> */}
      </Box>
    ),
    content: <ExportDiscordBot />,
    size: '6xl',
  });

  const exportDashboardModal = useCreateModal({
    id: 'exportDashboardModal',
    title: (
      <Box>
        <Text>Export Dashboard</Text>
        <Text fontSize="sm" fontWeight="normal" opacity={0.9}>
          Create your shareable dashboard.
        </Text>
      </Box>
    ),
    content: <ExportDashboardModal />,
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
                exportDiscordBotModal.onOpen();
                setIsOpen(false);
              }}
            >
              Lamp and Max&apos;s Axie Bot
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
};
