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
      h="50px"
      rounded="xl"
      justifyContent="flex-start"
      colorScheme="purple"
      variant="navigation"
      px={10}
      my={1}
      pl={6}
      iconSpacing={4}
      disabled={disabled}
      isActive={Router.asPath === path}
      {...rest}
    >
      {name}
    </Button>
  </ChakraLink>
);
