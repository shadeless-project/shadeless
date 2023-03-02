import { Box, Text } from '@chakra-ui/react';
import { SHADELESS_VERSION } from 'src/libs/apis/types';

function Footer () {
  return (
    <Box
      as="footer"
      bg="custom.white"
      boxShadow="md"
      borderTop="1px"
      borderColor="custom.focus-grey"
      height="10vh"
      w="100%"
      pt="25px"
    >
      <Box textAlign='center'>
        <Text>
          Shadeless @ 2023<br/>
          Version {SHADELESS_VERSION}
        </Text>
      </Box>

    </Box>
  );
}

export default Footer;
