import { Box, Button, Stack, Checkbox, Text, Alert, AlertIcon } from '@chakra-ui/react';
import { useRecoilValue } from 'recoil';
import { useState, ChangeEvent, useEffect } from 'react';
import exportFromJSON from 'export-from-json';
import { Select } from 'chakra-react-select';

import dayjs from '../../../services/dayjs';
import { allScholarsSelector } from '../../../recoil/scholars';
import { preferencesAtom } from 'src/recoil/preferences';

interface SelectedType {
  [field: string]: boolean;
}

type ExportType = 'json' | 'csv';

export const ExportFileModal = (): JSX.Element => {
  const scholars = useRecoilValue(allScholarsSelector);
  const preferences = useRecoilValue(preferencesAtom);

  const [selected, setSelected] = useState<SelectedType>({
    address: false,
    name: false,
    slp: false,
    scholarShare: false,
    managerShare: false,
    investorShare: false,
    slpDay: false,
    yesterdaySlp: false,
    todaySlp: false,
    pvpElo: false,
    paymentAddress: false,
    discordId: false,
    lastClaim: false,
    nextClaim: false,
  });

  const [type, setType] = useState<ExportType>('csv');
  const [exportIsDisabled, setExportIsDisabled] = useState(true);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    setSelected(oldSelected => {
      const newSelected = { ...oldSelected };
      newSelected[name] = checked;

      return newSelected;
    });
  };

  const handleExport = () => {
    const dataToExport = scholars.map(scholar => {
      const data = {};

      Object.keys(selected).forEach(field => {
        if (!selected[field]) return;
        if (data[field] === null) return;

        if (field === 'slp') {
          data[field] = preferences.includeRoninBalance ? scholar.slp + scholar.roninSlp : scholar.slp;
          return;
        }

        if (field === 'lastClaim' || field === 'nextClaim') {
          data[field] = dayjs.unix(scholar[field]);
          return;
        }

        if (field === 'scholarShare') {
          data[field] = scholar.shares.scholar;
          return;
        }

        if (field === 'managerShare') {
          data[field] = scholar.shares.manager;
          return;
        }

        if (field === 'investorShare') {
          data[field] = scholar.shares.investor ?? 0;
          return;
        }

        if (field === 'todaySlp') {
          data[field] = scholar.todaySlp ?? undefined;
          return;
        }

        data[field] = scholar[field];
      });

      return data;
    });

    exportFromJSON({
      data: dataToExport,
      fileName: `scholars_${dayjs().format('YYYY-MM-DDTHH:mm:ss')}`,

      exportType: type,
    });
  };

  const hasSelected = Object.values(selected).some(isChecked => isChecked);

  const selectAll = () => {
    setSelected(prev => {
      const draft = { ...prev };
      Object.keys(draft).forEach(key => {
        draft[key] = true;
      });
      return draft;
    });
  };

  const unselectAll = () => {
    setSelected(prev => {
      const draft = { ...prev };
      Object.keys(draft).forEach(key => {
        draft[key] = false;
      });
      return draft;
    });
  };

  useEffect(() => {
    const disabled = !Object.keys(selected).filter(field => selected[field]).length;

    setExportIsDisabled(disabled);
  }, [selected]);

  return (
    <Box p={4}>
      <Stack spacing={4}>
        <Alert rounded="md">
          <AlertIcon />

          <Text>
            Make sure to wait for the scholars to fully load before exporting them, otherwise, the data may be
            incomplete.
          </Text>
        </Alert>

        <Stack>
          <Text fontWeight="bold">Fields</Text>

          <Box>
            <Button onClick={hasSelected ? unselectAll : selectAll}>
              {hasSelected ? 'Unselect All' : 'Select All'}
            </Button>
          </Box>

          <Checkbox onChange={handleCheckboxChange} name="address" isChecked={selected.address}>
            Ronin Address
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="name" isChecked={selected.name}>
            Name
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="slp" isChecked={selected.slp}>
            SLP
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="scholarShare" isChecked={selected.scholarShare}>
            Scholar Share
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="managerShare" isChecked={selected.managerShare}>
            Manager Share
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="investorShare" isChecked={selected.investorShare}>
            Investor Share
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="slpDay" isChecked={selected.slpDay}>
            SLP per day
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="yesterdaySlp" isChecked={selected.yesterdaySlp}>
            SLP Yesterday
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="todaySlp" isChecked={selected.todaySlp}>
            SLP Today
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="pvpElo" isChecked={selected.pvpElo}>
            Arena
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="paymentAddress" isChecked={selected.paymentAddress}>
            Payment Address
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="discordId" isChecked={selected.discordId}>
            Discord ID
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="lastClaim" isChecked={selected.lastClaim}>
            Last Claim
          </Checkbox>

          <Checkbox onChange={handleCheckboxChange} name="nextClaim" isChecked={selected.nextClaim}>
            Next Claim
          </Checkbox>
        </Stack>

        <Box>
          <Select
            options={[
              {
                label: 'JSON',
                value: 'json',
              },
              {
                label: 'CSV',
                value: 'csv',
              },
            ]}
            onChange={(sel: any) => setType((sel?.value ?? 'csv') as ExportType)}
            name="exportType"
            closeMenuOnSelect
            defaultValue={{
              label: 'CSV',
              value: 'CSV',
            }}
          />
        </Box>

        <Button onClick={handleExport} disabled={exportIsDisabled} w="64">
          Export
        </Button>
      </Stack>
    </Box>
  );
};
