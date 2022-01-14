import { Box, BoxProps, forwardRef, useColorModeValue } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export type CardProps = PropsWithChildren<BoxProps>;

export const Card = forwardRef<CardProps, 'div'>(({ children, ...props }, ref): JSX.Element => {
  const bg = useColorModeValue('light.card', 'dark.bgLevel2');
  const boxShadow = useColorModeValue('0 7px 20px -10px rgba(150,170,180,0.3)', 'md');
  const borderWidth = useColorModeValue('1px', '0px');
  const borderColor = useColorModeValue('gray.200', 'darkGray.600');

  return (
    <Box
      ref={ref}
      bg={bg}
      boxShadow={boxShadow}
      borderWidth={borderWidth}
      borderColor={borderColor}
      borderRadius="xl"
      p={4}
      {...props}
    >
      {children}
    </Box>
  );
});

export default Card;
