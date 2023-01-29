import React, { ReactNode } from 'react';
import {
  Box,
  Flex,
  useColorModeValue,
  Link,
  useDisclosure,
  BoxProps,
  Button,
  ButtonProps,
} from '@chakra-ui/react';
import storage from 'src/libs/storage';

interface ToggleSidebarBtnProps extends ButtonProps {
  onClick: () => void;
}
function ToggleSidebarBtn ({ onClick, children, ...rest }: ToggleSidebarBtnProps) {
  return (
    <Button
      position={children === '>>' ? 'absolute' : 'static'}
      size="xs"
      float={children === '>>' ? 'left' : 'right'}
      onClick={onClick}
      shadow="md"
      borderRadius="0"
      {...rest}
    >
      {children}
    </Button>
  )
}

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  React.useEffect(() => {
    if (storage.getSideBarOpening()) onOpen();
  }, []);
  return (
    <Box>
      <SidebarContent
        mt="1px"
        zIndex={1}
        boxShadow="sm"
        onClose={onClose}
        display={isOpen ? 'block' : 'none'}
      />
      <ToggleSidebarBtn
        onClick={() => { storage.setSideBarOpening(true); onOpen(); }}
        display={isOpen ? 'none' : 'grid'}
      >
        &gt;&gt;
      </ToggleSidebarBtn>
      <Box>
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      boxShadow="sm"
      w="52"
      pos="absolute"
      h="full"
      {...rest}
    >
      <ToggleSidebarBtn onClick={() => { storage.setSideBarOpening(false); onClose(); }}>
        &lt;&lt;
      </ToggleSidebarBtn>
      <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
      >
        Hello
      </Flex>
    </Link>
    </Box>
  );
};
