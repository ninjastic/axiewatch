import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

import { getTraits } from '../../services/utils/axieUtils';
import { Axie } from '../../recoil/scholars';

interface AxiePartsProps {
  axieData: Axie;
}
export const AxieTraits = ({ axieData }: AxiePartsProps): JSX.Element => {
  const traits = getTraits(axieData.genes);

  const colors = {
    aquatic: 'rgb(0, 184, 206)',
    reptile: 'rgb(200, 138, 224)',
    plant: 'rgb(108, 192, 0)',
    bird: 'rgb(255, 139, 189)',
    beast: 'rgb(255, 184, 18)',
    bug: 'rgb(255, 83, 65)',
  } as { [key: string]: string };

  const partTypes = [traits.eyes, traits.ears, traits.mouth, traits.horn, traits.back, traits.tail];

  return (
    <Table size="sm" variant="unstyled">
      <Thead>
        <Tr>
          <Th>D</Th>
          <Th>R1</Th>
          <Th>R2</Th>
        </Tr>
      </Thead>

      <Tbody>
        {partTypes.map((partType, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tr key={index} borderBottomWidth={1}>
            {Object.entries(partType).map(
              ([type, part]) =>
                part && (
                  <Td
                    key={`${type}${part.partId}`}
                    color={colors[part.class]}
                    fontSize="xs"
                    textOverflow="ellipsis"
                    overflowX="hidden"
                    whiteSpace="nowrap"
                    maxW="100px"
                  >
                    {part.name}
                  </Td>
                )
            )}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
