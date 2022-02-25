import {
  Box,
  Input,
  InputGroup,
  FormControl,
  HStack,
  Button,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';
import { useMemo, useEffect, useRef, ChangeEvent, useState, useCallback } from 'react';
import { FiFile } from 'react-icons/fi';
import { BsInfoCircle } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import { toast } from 'react-toastify';

import { Pagination } from 'src/components/Pagination';
import { Card } from 'src/components/Card';
import { ScholarMap, scholarsMap } from 'src/recoil/scholars';
import { modalSelector } from 'src/recoil/modal';

interface AxieManagementImportData {
  managerShare: number;
  eth: string;
  name: string;
  scholarPayoutAddress: string;
  investorPercentage: number;
  investorRonin: string;
}

export const OtherImportForm = (): JSX.Element => {
  const [scholars, setScholars] = useRecoilState(scholarsMap);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedFileContent, setSelectedFileContent] = useState<string>('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const inputRef = useRef<HTMLInputElement>();

  const { onClose } = useRecoilValue(modalSelector('newScholarModal'));

  const shortAddress = useCallback(
    (address: string) => (address ? `${address.substr(0, 5)}...${address.substr(address.length - 5)}` : null),
    []
  );

  const fileParsedContent: AxieManagementImportData[] | null = useMemo(() => {
    if (selectedFileContent) {
      try {
        return JSON.parse(selectedFileContent);
      } catch (error) {
        console.log('Invalid file JSON');
        return null;
      }
    } else {
      return null;
    }
  }, [selectedFileContent]);

  const pageData = fileParsedContent?.slice((page - 1) * perPage, page * perPage);
  const numberOfPages = Math.ceil(fileParsedContent?.length / perPage);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImport = () => {
    if (fileParsedContent.length) {
      const scholarsToAdd = fileParsedContent.reduce((_toAdd, scholar) => {
        const addressWithoutRonin = scholar.eth.replace('ronin:', '0x');

        const scholarAlreadyExists = scholars.find(
          schol => schol.address.toLowerCase() === addressWithoutRonin.toLowerCase()
        );

        const duplicatedNewScholar = _toAdd.find(n => n.address.toLowerCase() === addressWithoutRonin);

        if (scholarAlreadyExists || duplicatedNewScholar) {
          return _toAdd;
        }

        return [
          ..._toAdd,
          {
            name: scholar.name,
            address: addressWithoutRonin,
            paymentAddress: scholar.scholarPayoutAddress,
            shares: {
              scholar: 100 - Number(scholar.investorPercentage ?? 0) - Number(scholar.managerShare ?? 0),
              manager: Number(scholar.managerShare ?? 0),
              investor: Number(scholar.investorPercentage ?? 0),
            },
            inactive: false,
          },
        ];
      }, [] as ScholarMap[]);

      if (scholarsToAdd.length) {
        setScholars(old => [...old, ...scholarsToAdd]);
      }

      toast(`Added ${scholarsToAdd.length} of ${fileParsedContent.length} scholars.`, {
        type: 'success',
      });

      onClose();
    }
  };

  useEffect(() => {
    if (selectedFile) {
      selectedFile.text().then(text => setSelectedFileContent(text));
    }
  }, [selectedFile]);

  return (
    <Box mb={3}>
      <Box borderWidth={1} borderRadius="lg" p={3}>
        <Text fontWeight="bold">Import from other websites</Text>

        <FormControl isRequired mt={3}>
          <InputGroup>
            <Input type="file" name="file" onChange={handleChange} ref={inputRef} multiple={false} hidden />

            <Button onClick={() => inputRef.current?.click()} leftIcon={<FiFile />}>
              From axie.management JSON file
            </Button>
          </InputGroup>
        </FormControl>
      </Box>

      {fileParsedContent && (
        <Box mt={5}>
          <HStack>
            <BsInfoCircle />
            <Text my={1}>Found {fileParsedContent.length} scholars to import</Text>
          </HStack>

          <Card mt={1} p={3}>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Address</Th>
                  <Th>Shares %</Th>
                  <Th>Payment Address</Th>
                </Tr>
              </Thead>

              <Tbody>
                {pageData.map(scholar => {
                  const scholarShare = 100 - scholar.investorPercentage - scholar.managerShare;

                  return (
                    <Tr key={scholar.eth}>
                      <Td whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" maxW="100px">
                        {scholar.name}
                      </Td>
                      <Td>{shortAddress(scholar.eth)}</Td>
                      <Td>
                        {scholarShare}/{scholar.managerShare}/{scholar.investorPercentage}
                      </Td>

                      <Td>{shortAddress(scholar.scholarPayoutAddress)}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Card>

          <Pagination page={page} setPage={setPage} numberOfPages={numberOfPages} />
        </Box>
      )}

      {selectedFile && !fileParsedContent && (
        <Box mt={5}>
          <Text textAlign="center" color="red.300">
            Oopss... looks like the file is invalid, make sure you are importing the right JSON formatted file.
          </Text>
        </Box>
      )}

      {fileParsedContent && (
        <Button w="100%" onClick={handleImport}>
          Import
        </Button>
      )}
    </Box>
  );
};
