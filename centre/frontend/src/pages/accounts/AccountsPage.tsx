import { Box, Flex, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React from 'react';
import { Account, AccountRole, defaultAccount, getAllAccounts } from 'src/libs/apis/account';
import { notify } from 'src/libs/notify';
import SubmitButton from '../common/submit-button';
import AccountTable from './account-table';
import AddAccountModal from './add-account';
import DeleteAccountModal from './delete-account';

export default function AccountsPage() {
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
  React.useEffect(() => { uiLoadAccounts() }, []);

  return (
    <Box
      p="10px"
      borderRadius="var(--component-border)"
      boxShadow="sm"
      bg="custom.white"
    >
      <Flex
        justifyContent="space-between"
        alignContent="center"
        alignItems="center"
        p="15px"
      >
        <Text
          as="h2"
          fontSize="3xl"
        >
          Accounts {isLoading ? <Spinner ml="10px" /> : <Text as="span">({accounts.length})</Text>}
        </Text>
        <SubmitButton
          onClick={onOpen}
          disabled={window.getUserRole() === AccountRole.ADMIN ? false : true}
        >
          Add account
        </SubmitButton>
      </Flex>

      <AccountTable
        accounts={accounts}
        isLoading={isLoading}
        setDeletingAccount={setDeletingAccount}
        onOpenModalDel={onOpenModalDel}
      />

      <DeleteAccountModal
        isOpen={isOpenModalDel}
        onClose={onCloseModalDel}
        callback={uiLoadAccounts}
        deletingAccount={deletingAccount}
      />

      <AddAccountModal
        isOpen={isOpen}
        onClose={onClose}
        callback={uiLoadAccounts}
      />

    </Box>
  );
}
