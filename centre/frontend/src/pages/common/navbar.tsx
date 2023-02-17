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
  useDisclosure,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  useToast,
  Tag,
} from '@chakra-ui/react';
import { Link } from 'wouter';
import { HamburgerIcon } from '@chakra-ui/icons';
import storage from 'src/libs/storage';
import { editProject, getOneProject } from 'src/libs/apis/projects';
import SubmitButton from './submit-button';
import { notify } from 'src/libs/notify';
import { getProjectUsers, User } from 'src/libs/apis/users';

function Navbar () {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);

  const choosingProject = storage.getProject();

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [users, setUsers] = React.useState<User[]>([]);

  const submitEditProject = async () => {
    setIsSubmitting(true);
    const resp = await editProject({ description }, choosingProject);
    notify(toast, resp);
    setIsSubmitting(false);
    if (resp.statusCode === 200) onClose();
  };

  function logout() {
    localStorage.setItem('authorization', '');
    location.href = '/';
    location.reload();
  }

  React.useEffect(() => {
    async function getProjectDetail() {
      const resp = await getOneProject(choosingProject);
      if (resp.statusCode !== 200 && location.pathname !== '/setting') {
        location.href = '/setting';
      } else {
        setDescription(resp.data.description);
      }
    }
    async function getProjectUser() {
      const resp = await getProjectUsers(choosingProject);
      if (resp.statusCode !== 200 && location.pathname !== '/setting') {
        location.href = '/setting';
      } else {
        if (resp.statusCode === 200) setUsers(resp.data);
      }
    }
    Promise.all([
      getProjectDetail(),
      getProjectUser(),
    ]).then(() => {});
  }, []);

  return (
    <>
      <>
        <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Project {choosingProject}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text
                mt="5px"
                as="h1"
                mb="10px"
                fontSize="2xl"
              >
                Description:
              </Text>
              <Textarea
                whiteSpace='pre-wrap'
                value={description}
                rows={5}
                mb="10px"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setDescription(e.currentTarget.value);
                }}
              />

              <Text
                mt="5px"
                as="h1"
                mb="10px"
                fontSize="2xl"
              >
                Contributors:
              </Text>
              {users.length === 0 && <Text fontSize="xs" ml="5px">There is no user yet</Text>}
              <Box>
                {users.map(u =>
                  <Tag m="3px" key={u.codeName} cursor="pointer">
                    {u.codeName}
                  </Tag>
                )}
              </Box>

              <SubmitButton
                onClick={submitEditProject}
                isSubmitting={isSubmitting}
                color="white"
                bg="black"
                _hover={{"opacity":".5"}}
                mb="10px"
                mt="15px"
              >
                Save
              </SubmitButton>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>

      <Flex
      zIndex={10}
      fontWeight="600"
      px="3%"
      boxShadow="md"
      bg="background.primary-white"
      justifyContent={'space-between'}
      alignItems="center"
    >
      <HStack spacing={8}>
        <Text
          fontSize="4xl"
          py="10px"
          cursor="pointer"
          onClick={() => location.href = '/'}
        >
          Shadeless
        </Text>
        <Text
          cursor="pointer"
          _hover={{ textDecor:"underline" }}
          textDecor={location.pathname === '/censor' ? 'underline' : ''}
          onClick={() => location.href = '/censor'}
        >
          Censor
        </Text>
      </HStack>

      <Menu>
        <MenuButton as={Button}
          bg="background.primary-white"
          _hover={{ bg: 'background.focus-grey' }}
          _active={{ bg: 'background.focus-grey' }}
        >
          <Text
            as="i"
            fontWeight="600"
            color="black"
            mr="20px"
          >
            {choosingProject}
          </Text>
          <HamburgerIcon />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={onOpen}>
            Config <strong>&nbsp;{choosingProject}</strong>
          </MenuItem>
          <Link href='/setting'>
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
    </>
  );
}

export default Navbar;
