import { ReactText, useState } from 'react';
import Router from 'next/router';
import { Icon, HamburgerIcon } from '@chakra-ui/icons';
import { IoLogoYoutube } from 'react-icons/io';
import {
  Grid,
  Flex,
  IconButton,
  Box,
  Image,
  SkeletonCircle,
  useDisclosure,
  Button,
  CloseButton,
  Drawer,
  DrawerContent,
  Link,
  DrawerOverlay,
  Divider,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';

import { DiscordIcon, AnalysisIcon, BagIcon, TrackerIcon } from './icons';
import { NavbarContent } from './NavbarContent';
import { ColorSwitchIcon } from './ColorSwitchIcon';
import AlertsIcon from './icons/AlertsIcon';
import { SignInButton } from '@src/components/SignInButton';

interface LinkItemProps {
  name: string;
  icon: React.FC;
  link: string;
}

interface NavItemProps {
  icon: React.FC;
  children: ReactText;
  link: string;
  target?: string;
  isActive?: boolean;
}

interface NavButtonProps {
  icon: React.FC;
  link: string;
  currentTool: string;
  name: string;
}

interface SidebarProps {
  onClose: () => void;
  currentTool: string;
}

interface HeaderProps {
  currentTool: 'Marketplace' | 'Tracker' | 'Analyzer';
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Marketplace V2', icon: BagIcon, link: 'https://market.elitebreeders.club' },
  { name: 'Tracker', icon: TrackerIcon, link: 'https://tracker.elitebreeders.club' },
  { name: 'Analyzer', icon: AnalysisIcon, link: 'https://analyzer.elitebreeders.club' },
  { name: 'Alerts', icon: AlertsIcon, link: 'https://alerts.elitebreeders.club' },
];

const NavItem = ({ icon, children, link, isActive, target }: NavItemProps) => (
  <Link href={link} style={{ textDecoration: 'none' }} target={target}>
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bg={isActive ? 'purple.200' : ''}
      _hover={{
        bg: 'purple.300',
      }}
    >
      {icon && <Icon mr="4" fontSize="16" as={icon} />}
      {children}
    </Flex>
  </Link>
);

const NavButton = ({ icon, link, name, currentTool }: NavButtonProps) => (
  <Link href={link} style={{ textDecoration: 'none' }}>
    <Button
      isActive={name === currentTool}
      variant="navigation"
      colorScheme="purple"
      leftIcon={<Icon as={icon} />}
      mr={2}
      size="md"
    >
      {name}
    </Button>
  </Link>
);

const SidebarContent = ({ onClose, currentTool }: SidebarProps) => (
  <Box bg="#11151d" w="full" pos="fixed" h="full" color="white" overflowY="auto">
    <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
      <Flex alignItems="center">
        <Image mr={3} width="38px" height="38px" borderRadius="full" src="/images/ebc-small-logo.jpeg" alt="ebc" />
        <Heading fontSize="lg" fontWeight="bold">
          {currentTool}
        </Heading>
      </Flex>

      <CloseButton display="flex" onClick={onClose} />
    </Flex>

    <Box display={{ base: 'block', lg: 'none' }}>
      {LinkItems.map(item => (
        <NavItem key={item.name} icon={item.icon} link={item.link} isActive={item.name === currentTool}>
          {item.name}
        </NavItem>
      ))}
    </Box>

    <Box mx={8} my={4}>
      <Divider />
    </Box>

    <NavbarContent />
  </Box>
);

const Header = ({ currentTool }: HeaderProps): JSX.Element => {
  const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure();
  const [imageLoaded, setImageLoaded] = useState(false);

  const bg = useColorModeValue('light.bgLevel1', 'dark.bgLevel4');

  Router.events.on('routeChangeStart', () => onNavClose());

  return (
    <Grid
      sx={{
        p: 3,
        h: '80px',
        gridTemplateColumns: { base: 'repeat(2, 50%)', lg: 'repeat(3, 33.33%)' },
        background: bg,
        position: 'fixed',
        overflow: 'hidden',
        width: '100%',
        zIndex: 'banner',
        display: 'grid',
        alignItems: 'center',
      }}
    >
      <Drawer
        autoFocus={false}
        isOpen={isNavOpen}
        placement="left"
        onClose={onNavClose}
        returnFocusOnClose={false}
        onOverlayClick={onNavClose}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent onClose={onNavClose} currentTool={currentTool} />
        </DrawerContent>
      </Drawer>
      <Flex
        sx={{
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image borderRadius="full" onLoad={() => setImageLoaded(true)} src="/images/ebc-small-logo.jpeg" alt="ebc" />
          <SkeletonCircle isLoaded={imageLoaded} startColor="white" endColor="gray" width="38px" height="38px" />
        </Box>

        <Heading
          sx={{
            ml: 3,
            fontSize: { base: 'lg', lg: 'xl' },
          }}
        >
          {currentTool}
        </Heading>
      </Flex>

      <Flex sx={{ display: { base: 'none', lg: 'flex' }, justifyContent: 'center' }}>
        {LinkItems.map(item => (
          <NavButton key={item.name} icon={item.icon} currentTool={currentTool} link={item.link} name={item.name} />
        ))}
      </Flex>

      <Flex sx={{ justifyContent: 'flex-end' }}>
        <IconButton
          aria-label="Discord"
          alignSelf="center"
          icon={<DiscordIcon />}
          variant="accent"
          onClick={() => window.open('https://discord.gg/bRV67Kc77u', '_blank')}
          size="sm"
          fontSize="lg"
          colorScheme="purple"
          sx={{
            display: { base: 'none', '2xl': 'block' },
            mr: 3,
          }}
        />

        <IconButton
          aria-label="Youtube"
          alignSelf="center"
          icon={<IoLogoYoutube />}
          variant="accent"
          onClick={() => window.open('https://www.youtube.com/watch?v=EecgUWIX-8k', '_blank')}
          size="sm"
          fontSize="lg"
          colorScheme="red"
          sx={{
            display: { base: 'none', '2xl': 'flex' },
            mr: 3,
          }}
        />

        <Box
          sx={{
            display: { base: 'none', '2xl': 'block' },
            position: 'relative',
          }}
          alignSelf="center"
          mr={3}
        >
          <ColorSwitchIcon />
        </Box>

        <Box mr={{ base: 0, lg: 2 }}>
          <SignInButton />
        </Box>

        <IconButton
          variant="accent"
          alignSelf="center"
          aria-label="Menu"
          icon={<HamburgerIcon />}
          onClick={onNavOpen}
          size="sm"
          fontSize="lg"
          colorScheme="purple"
          sx={{
            display: { base: 'block', '2xl': 'none' },
            ml: 3,
          }}
        />
      </Flex>
    </Grid>
  );
};

export default Header;
