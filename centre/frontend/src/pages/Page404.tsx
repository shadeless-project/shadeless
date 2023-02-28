import { Box, Text } from '@chakra-ui/react';
import { useLocation } from 'wouter';

function Page404 () {
  const [location] = useLocation();
  return (
    <Box
      borderRadius="var(--component-border)"
      boxShadow="sm"
      bg="custom.white"
      p="10px"
    >
      <Text
        mt="20vh"
        as="h1"
        fontSize="4xl"
        textAlign="center"
        fontWeight="bold"
      >
        404 Not found!!!
      </Text>
      <Text
        mb="35vh"
        as="h2"
        fontSize="xl"
        textAlign="center"
      >
        Path at {location} is not found
      </Text>
    </Box>
  );
}

export default Page404;
