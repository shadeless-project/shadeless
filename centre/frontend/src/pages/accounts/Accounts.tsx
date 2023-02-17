import { Box, Button, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React from 'react';
import { Account, AccountRole, createNewAccount, defaultAccount, deleteAccount, getAllAccounts } from 'src/libs/apis/account';
import { notify } from 'src/libs/notify';
import { getUserRole } from 'src/libs/storage';
import AccountTable from './account-table';

export default function AccountPage() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isOpen: isOpenModalDel, onOpen: onOpenModalDel, onClose: onCloseModalDel } = useDisclosure();
  const [deletingAccount, setDeletingAccount] = React.useState<Account>(defaultAccount);

  async function uiLoadAccounts() {
    setIsLoading(true);
    const resp = await getAllAccounts();
    setIsLoading(false);
    if (resp.statusCode === 200) {
      setAccounts(resp.data);
    } else {
      notify(toast, resp);
    }
  }

  async function uiDeleteAccount() {
    const resp = await deleteAccount(deletingAccount._id || '');
    notify(toast, resp);
    if (resp.statusCode === 200) {
      onCloseModalDel();
      await uiLoadAccounts();
    }
  }

  async function uiCreateAccount() {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const passwordRecheck = (document.getElementById('password-recheck') as HTMLInputElement).value;
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const resp = await createNewAccount(username, password, passwordRecheck, role as AccountRole);
    notify(toast, resp);
    if (resp.statusCode === 200) {
      await uiLoadAccounts();
      onClose();
    }
  }

  React.useEffect(() => {
    uiLoadAccounts();
  }, []);

  return (
    <>
      <Box
        mx="auto"
        w="60%"
        mt="3vh"
        p="10px"
        borderRadius="3px"
        bg="background.primary-white"
        fontSize="sm"
      >
        <Button
          id='click-add-account'
          size="sm"
          bg="black"
          mt="15px"
          color="white"
          _hover={{ opacity: ".6" }}
          onClick={onOpen}
          disabled={getUserRole() === AccountRole.ADMIN ? false : true}
        >
          Add account
        </Button>

        <AccountTable
          accounts={accounts}
          isLoading={isLoading}
          setDeletingAccount={setDeletingAccount}
          onOpenModalDel={onOpenModalDel}
        />

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Adding new account
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody fontSize="sm">
              <FormLabel fontSize="sm">Username&nbsp;
                <Tooltip placement="top" fontSize="2xs" label="Required"><Text as="span" color="red.600">*</Text></Tooltip>
              </FormLabel>
              <Input
                id="username"
                size="md"
                mt="-3px"
                fontSize="xs"
                placeholder="admin"
                _placeholder={{opacity: '0.6'}}
              />
              <FormLabel mt="17px" fontSize="sm">
                Password&nbsp;
                <Tooltip placement="top" fontSize="2xs" label="Required"><Text as="span" color="red.600">*</Text></Tooltip>
              </FormLabel>
              <Input
                id="password"
                type="password"
                mt="-3px"
                size="md"
                placeholder="***********"
              />
              <FormLabel mt="17px" fontSize="sm">
                Password recheck&nbsp;
                <Tooltip placement="top" fontSize="2xs" label="Required"><Text as="span" color="red.600">*</Text></Tooltip>
              </FormLabel>
              <Input
                id="password-recheck"
                type="password"
                mt="-3px"
                size="md"
                placeholder="***********"
              />
              <Select id="role" mt="13px" w="150px">
                <option value={AccountRole.NORMAL}>{AccountRole.NORMAL}</option>
                <option value={AccountRole.ADMIN}>{AccountRole.ADMIN}</option>
              </Select>
            </ModalBody>

            <ModalFooter>
              <Button
                color="white"
                bg="black"
                mr={3}
                onClick={uiCreateAccount}
                _hover={{opacity: '.6'}}
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>


        <Modal isOpen={isOpenModalDel} onClose={onCloseModalDel}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Deleting account
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody fontSize="sm">
              <Text>Are you sure to delete {deletingAccount.username} ?</Text>
            </ModalBody>

            <ModalFooter>
              <Button
                color="white"
                bg="black"
                mr={3}
                onClick={uiDeleteAccount}
                _hover={{opacity: '.6'}}
                disabled={getUserRole() === AccountRole.ADMIN ? false : true}
              >
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </Box>
    </>
  );
}
