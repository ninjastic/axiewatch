import { Box, Text, Stack, Link, HStack } from '@chakra-ui/react';

export default function FeedbackPage() {
  return (
    <Box h="full" maxW="1450px" margin="auto" p={3}>
      <Text fontWeight="bold" fontSize={24}>
        Report a bug or send us a suggestion!
      </Text>

      <Text opacity={0.8}>
        Axie Watch is in development to make tracking your scholars easier. Let us know about your needs!
      </Text>

      <Stack h="100%" pt={10} spacing={3}>
        <Text fontWeight="bold" fontSize={24}>
          Links
        </Text>

        <HStack>
          <Text fontWeight="bold" fontSize={16} textAlign="center">
            - Feature request and roadmap:
          </Text>

          <Link href="https://axiewatch.hellonext.co/" target="_blank">
            https://axiewatch.hellonext.co
          </Link>
        </HStack>

        <HStack>
          <Text fontWeight="bold" fontSize={16} textAlign="center">
            - Bug report:
          </Text>

          <Link href="https://forms.gle/TkQ6UGD4KM58viay5" target="_blank">
            https://forms.gle/TkQ6UGD4KM58viay5
          </Link>
        </HStack>

        <HStack>
          <Text fontWeight="bold" fontSize={16} textAlign="center">
            - Discord:
          </Text>

          <Link href="https://discord.com/invite/WhVg8GXc" target="_blank">
            https://discord.com/invite/WhVg8GXc
          </Link>
        </HStack>
      </Stack>
    </Box>
  );
}
