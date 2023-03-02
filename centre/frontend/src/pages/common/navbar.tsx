import {
  Flex,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Box,
  Img,
} from '@chakra-ui/react';
import { Link, useLocation } from 'wouter';
import { HamburgerIcon } from '@chakra-ui/icons';
import DocumentationIcon from './documentation-icon';
import MyTooltip from './tooltip';
import { INSTRUCTION_SHADELESS } from "src/libs/apis/types";

function Navbar () {
  const setLocation = useLocation()[1];
  function logout() {
    localStorage.setItem('authorization', '');
    setLocation('/');
    location.reload();
  }
  return (
    <>
      <Box
        zIndex={10}
        fontWeight="600"
        boxShadow="sm"
        bg="custom.white"
      >
        <Flex
          margin="auto"
          width="var(--component-width)"
          justifyContent='space-between'
          alignItems="center"
        >
          <HStack spacing={8}>
            <Text
              fontSize="3xl"
              py="10px"
              cursor="pointer"
              onClick={() => location.href = '/'}
            >
              Shadeless
            </Text>
          </HStack>

          <Box>
            <MyTooltip label="View source code">
              <Button mr="20px" bg="inherit" p="0" onClick={() => location.href = "https://github.com/shadeless-project/"}>
                <Img src="/github.svg" w="20px" h="20px" />
              </Button>
            </MyTooltip>
            <MyTooltip label="View documentation">
              <Button mr="20px" bg="inherit" p="0" onClick={() => location.href = INSTRUCTION_SHADELESS}>
                <DocumentationIcon w="20px" h="20px" />
              </Button>
            </MyTooltip>
            <Menu>
              <MenuButton as={Button}
                bg="custom.white"
                _hover={{ bg: 'custom.focus-grey' }}
                _active={{ bg: 'custom.focus-grey' }}
              >
                {window.getUser().username}&nbsp;&nbsp;<HamburgerIcon />
              </MenuButton>
              <MenuList>
                <Link href='/projects'>
                  <MenuItem>
                    Choose project
                  </MenuItem>
                </Link>
                <Link href='/accounts'>
                  <MenuItem>
                    Accounts setting
                  </MenuItem>
                </Link>
                <MenuItem onClick={logout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export default Navbar;
