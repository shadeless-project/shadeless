import React from 'react';
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
} from '@chakra-ui/react';
import { Link } from 'wouter';
import { HamburgerIcon } from '@chakra-ui/icons';

function Navbar () {
  function logout() {
    localStorage.setItem('authorization', '');
    location.href = '/';
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

          <Menu>
            <MenuButton as={Button}
              bg="custom.white"
              _hover={{ bg: 'custom.focus-grey' }}
              _active={{ bg: 'custom.focus-grey' }}
            >
              <HamburgerIcon />
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
        </Flex>
      </Box>
    </>
  );
}

export default Navbar;
