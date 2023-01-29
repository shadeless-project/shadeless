import { Box, Text } from "@chakra-ui/react";
import { INSTRUCTION_EXT_URL } from "src/libs/apis/types";

export default function DownloadBurp() {
  function getShadelessBurp() {
    const url = "/api/files/shadeless-burp";
    window.open(url);
  }
  return (
    <Box
      mx="auto"
      w="80%"
      mt="3vh"
      fontSize="xs"
      bg="background.primary-white"
      p="8px"
    >
      <Text ml="20px" as="span" fontStyle="italic" >Get newest Shadeless Burp version&nbsp;</Text>
      <Text
        as="span" 
        color="blue"
        _hover={{
          "textDecor": "underline"
        }}
        cursor="pointer"
        onClick={getShadelessBurp}
      >
        here
      </Text>

      <br/>
      
      <Text ml="20px" as="span" fontStyle="italic" >How to use Shadeless&nbsp;</Text>
      <Text
        as="span" 
        color="blue"
        _hover={{
          "textDecor": "underline"
        }}
        cursor="pointer"
        onClick={() => window.location.href = INSTRUCTION_EXT_URL}
      >
        here
      </Text>

    </Box>
  );
}