import { ReactText, useState } from 'react';
import Router from 'next/router';
import { Icon, HamburgerIcon } from '@chakra-ui/icons';
import { IoLogoYoutube } from 'react-icons/io';
import {
  Grid,
  Text,
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
  DarkMode,
} from '@chakra-ui/react';

import { DiscordIcon, AnalysisIcon, BagIcon, TrackerIcon } from './icons';
import { NavbarContent } from './NavbarContent';
import { ColorSwitchIcon } from './ColorSwitchIcon';
import AlertsIcon from './icons/AlertsIcon';
import { SignInButton } from 'src/components/SignInButton';

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
      bg={isActive ? 'whiteAlpha.200' : ''}
      _hover={{
        bg: 'whiteAlpha.300',
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
      variant="ghost"
      leftIcon={<Icon as={icon} />}
      mr={2}
      fontFamily={
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";'
      }
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
        <Text fontSize="lg" fontFamily="Bowlby One SC" fontWeight="bold">
          {currentTool}
        </Text>
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

  Router.events.on('routeChangeStart', () => onNavClose());

  return (
    <Grid
      sx={{
        p: 3,
        h: '65px',
        background: '#11151d',
        boxShadow: 'md',
        position: 'fixed',
        overflow: 'hidden',
        width: '100%',
        zIndex: '300',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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

        <Text
          sx={{
            ml: 3,
            fontSize: { base: 'lg', lg: 'xl' },
            fontFamily: 'Bowlby One SC',
            color: 'white',
          }}
        >
          {currentTool}
        </Text>
      </Flex>

      <DarkMode>
        <Flex sx={{ display: { base: 'none', lg: 'flex' } }}>
          {LinkItems.map(item => (
            <NavButton key={item.name} icon={item.icon} currentTool={currentTool} link={item.link} name={item.name} />
          ))}
        </Flex>
      </DarkMode>

      <Flex sx={{ justifyContent: 'flex-end' }}>
        <Box mr={{ base: 0, lg: 2 }}>
          <SignInButton />
        </Box>

        <IconButton
          aria-label="Discord"
          icon={<DiscordIcon />}
          variant="ghost"
          onClick={() => window.open('https://discord.com/invite/mAHcqzmt8h', '_blank')}
          color="white"
          _hover={{
            bg: 'whiteAlpha.200',
          }}
          sx={{
            display: { base: 'none', '2xl': 'block' },
            mr: 1,
          }}
        />

        <IconButton
          aria-label="Youtube"
          icon={<IoLogoYoutube />}
          variant="ghost"
          onClick={() => window.open('https://www.youtube.com/watch?v=EecgUWIX-8k', '_blank')}
          color="white"
          _hover={{
            bg: 'whiteAlpha.200',
          }}
          sx={{
            display: { base: 'none', '2xl': 'flex' },
            pt: 0,
            mr: 1,
          }}
        />

        <Box
          sx={{
            display: { base: 'none', '2xl': 'block' },
            position: 'relative',
          }}
          alignSelf="center"
          mr={1}
        >
          <ColorSwitchIcon />
        </Box>

        <IconButton
          variant="outline"
          aria-label="Menu"
          icon={<HamburgerIcon />}
          onClick={onNavOpen}
          color="white"
          _hover={{
            bg: 'whiteAlpha.200',
          }}
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
