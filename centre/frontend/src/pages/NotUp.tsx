import { Box, Spinner, Text } from "@chakra-ui/react";
import { checkLogin } from "src/libs/apis/auth";
import React from 'react';

export default function NotUp() {
  React.useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        await checkLogin();
        window.location.href = '/';
      } catch (err) {}
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <Box bg="background.primary-grey">
      <Box
        bg="background.primary-white"
        p="20px"
        boxShadow="md"
        mt="30vh"
        mx="auto"
        w={{ base:"80%", sm:"65%", md: "55%", lg:"50", xl: "45%"}}
        borderRadius="5"
      >
        <Text
          as="h1"
          fontWeight="bold"
          fontSize="2xl"
        >
          Backend server is down, please wait for it to start
        </Text>
        <Text
          as="h2"
          fontWeight="300"
          fontSize="md"
        >
          This page will automatically refresh when backend is up.
        </Text>
        <Spinner
          mt="30px"
          ml="44%"
          thickness='4px'
          speed='1s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
        />
      </Box>
    </Box>
  );
}