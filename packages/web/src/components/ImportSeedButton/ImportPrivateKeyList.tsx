import { Box, Stack, HStack, Text, Checkbox, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import pluralize from 'pluralize';
import { toast } from 'react-toastify';

import { ScholarSelector } from '../../recoil/scholars';
import { bulkUpdateWalletSelector } from '../../recoil/wallets';
import { Address } from '../../services/utils/derivateFromSeed';

interface Match {
  scholar: ScholarSelector;
  wallet: Address;
}

interface ImportPrivateKeyListProps {
  data: Match[];
  onClose: () => void;
}

export const ImportPrivateKeyList = ({ data, onClose }: ImportPrivateKeyListProps): JSX.Element => {
  const setWallets = useSetRecoilState(bulkUpdateWalletSelector);

  const [checkedList, setCheckedList] = useState(new Array(data.length).fill(false));

  const handleChange = (index: number, value: boolean) => {
    setCheckedList(old => {
      const newArray = [...old];
      newArray[index] = value;

      return newArray;
    });
  };

  const handleImport = () => {
    const results = [] as Array<{ address: string; privateKey: string }>;

    data.forEach((entry, index) => {
      const isChecked = checkedList[index];

      if (isChecked) {
        results.push({
          address: entry.wallet.address,
          privateKey: entry.wallet.privateKey,
        });
      }
    });

    if (results.length) {
      setWallets(results);
      onClose();

      toast(`${results.length} ${pluralize('private-key', results.length)} imported!`, {
        type: 'success',
      });
    }
  };

  return (
    <Stack spacing={5}>
      <Text as="span">
        We found{' '}
        <Text fontWeight="bold" as="span">
          {data.length}
        </Text>{' '}
        matching {pluralize('private-key', data.length)} from your wallet seed.{' '}
        <Text opacity={0.9} as="span">
          Please select the ones you would like to import:
        </Text>
      </Text>

      <Stack spacing={2}>
        <Checkbox
          isChecked={checkedList.every(Boolean)}
          isIndeterminate={checkedList.some(Boolean) && !checkedList.every(Boolean)}
          onChange={e => setCheckedList(new Array(data.length).fill(e.target.checked))}
        >
          Select All
        </Checkbox>

        {data.map((entry, index) => (
          <Box key={entry.scholar.address} bg="gray.800" p={3} rounded="md">
            <Checkbox isChecked={checkedList[index]} onChange={e => handleChange(index, e.target.checked)}>
              <HStack>
                <Text>{entry.scholar.name}</Text>

                <Text>
                  ({entry.scholar.address.substr(0, 5)}...
                  {entry.scholar.address.substr(entry.scholar.address.length - 5)})
                </Text>
              </HStack>
            </Checkbox>
          </Box>
        ))}
      </Stack>

      <Button onClick={handleImport}>Import</Button>
    </Stack>
  );
};
