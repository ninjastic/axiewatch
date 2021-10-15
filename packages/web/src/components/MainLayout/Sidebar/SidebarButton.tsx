import { Button, chakra, ButtonProps } from '@chakra-ui/react';
import Router from 'next/router';
import Link from 'next/link';

const ChakraLink = chakra(Link);

interface SidebarButtonProps extends ButtonProps {
  name: string;
  path: string;
  disabled?: boolean;
}

export const SidebarButton = ({ name, path, disabled = false, ...rest }: SidebarButtonProps): JSX.Element => (
  <ChakraLink href={path}>
    <Button
      w="100%"
      h="50px"
      rounded="none"
      variant="ghost"
      justifyContent="flex-start"
      px={10}
      disabled={disabled}
      _before={
        Router.asPath === path
          ? {
              content: '""',
              width: '4px',
              height: '100%',
              position: 'absolute',
              left: '0px',
              bg: 'white',
            }
          : {}
      }
      {...rest}
    >
      {name}
    </Button>
  </ChakraLink>
);
