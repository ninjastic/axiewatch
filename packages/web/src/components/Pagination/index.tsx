import { Input, Flex, Button, HStack, Text, useNumberInput } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

interface PageInputProps {
  page: number;
  numberOfPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  showNumberOfPages?: boolean;
  isNextDisabled?: boolean;
}

export const Pagination = ({
  page,
  numberOfPages,
  setPage,
  showNumberOfPages = true,
  isNextDisabled,
}: PageInputProps): JSX.Element => {
  const [inputValue, setInputValue] = useState(page);
  const pageInputRef = useRef<HTMLInputElement>(null);

  const handlePageChange = (step: string) => {
    let newPageValue = Number(page);

    if (step === 'increase') newPageValue += 1;
    else if (step === 'decrease') newPageValue -= 1;

    setPage(newPageValue);
  };

  const { getInputProps } = useNumberInput({
    step: 1,
    defaultValue: 1,
    min: 1,
    max: numberOfPages,
    value: inputValue,
    onChange: value => setInputValue(Math.max(Math.min(Number(value), numberOfPages), 1)),
    onBlur: e => setPage(Math.max(Math.min(Number(e.target.value), numberOfPages), 1)),
  });

  const input = getInputProps({
    onKeyDown: event => event.key === 'Enter' && pageInputRef.current?.blur(),
  });

  useEffect(() => {
    setInputValue(page);
  }, [page]);

  return (
    <Flex align="center" justify="space-between" py={5}>
      <Button onClick={() => handlePageChange('decrease')} isDisabled={page <= 1}>
        Prev
      </Button>

      <HStack>
        <Text>Page</Text>

        <Input maxW="65px" {...input} ref={pageInputRef} />

        {showNumberOfPages && <Text>of {Math.max(numberOfPages, 1)}</Text>}
      </HStack>

      <Button onClick={() => handlePageChange('increase')} isDisabled={isNextDisabled ?? page >= numberOfPages}>
        Next
      </Button>
    </Flex>
  );
};
