import { Box, HStack, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import { useMemo } from 'react';

import { getTraits } from '../../services/utils/axieUtils';
import { Axie } from '../../recoil/scholars';
import { AxiePartIcon, AxiePartIconType } from '../Icons/AxiePartIcon';

interface AxiePartsProps {
  axieData: Axie;
}
export const AxieTraits = ({ axieData }: AxiePartsProps): JSX.Element => {
  const traits = useMemo(() => getTraits(axieData.genes), [axieData.genes]);

  const partTypes = useMemo(
    () => [traits.eyes, traits.ears, traits.mouth, traits.horn, traits.back, traits.tail],
    [traits]
  );

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} py={2} px={2} borderRadius={8} overflow="hidden">
      {useMemo(
        () =>
          partTypes.map(partType => (
            <Flex
              key={`${partType.d.partId}${partType.r1.partId}${partType.r2.partId}`}
              flexDirection="row"
              align="center"
              py={1}
            >
              <AxiePartIcon
                type={partType.d.type as AxiePartIconType}
                bg={partType.d.class.toLowerCase()}
                borderRadius="full"
                height="17px"
                width="17px"
              />

              {Object.entries(partType).map(([type, part]) => (
                <Box key={`${type}${part.partId}`} ml={2} w="full">
                  <HStack spacing={2}>
                    <Text
                      fontWeight="bold"
                      fontSize="xs"
                      color={part.class}
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      overflowX="hidden"
                      maxW="80px"
                    >
                      {part.name}
                    </Text>
                  </HStack>
                </Box>
              ))}
            </Flex>
          )),
        [partTypes]
      )}
    </Box>
  );
};
