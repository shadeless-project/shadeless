import { Box, Flex, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React from 'react';
import { Account, AccountRole, defaultAccount, getAllAccounts } from 'src/libs/apis/account';
import { notify } from 'src/libs/notify';
import SubmitButton from '../common/submit-button';
import MyTooltip from '../common/tooltip';
import AccountTable from './account-table';
import AddAccountModal from './add-account';
import DeleteAccountModal from './delete-account';
import EditAccountModal from './edit-account';
import ResetPasswordAccountModal from './reset-account';

export default function AccountsPage() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accounts, setAccounts] = React.useState<Account[]>([]);

  const [resetingPassAccount, setResetingPassAccount] = React.useState<Account>(defaultAccount);
  const [editingAccount, setEditingAccount] = React.useState<Account>(defaultAccount);
  const [deletingAccount, setDeletingAccount] = React.useState<Account>(defaultAccount);

  const [isLoading, setIsLoading] = React.useState(true);
  const { isOpen: isOpenModalDel, onOpen: onOpenModalDel, onClose: onCloseModalDel } = useDisclosure();
  const { isOpen: isOpenResetPassword, onOpen: onOpenResetPassword, onClose: onCloseResetPassword } = useDisclosure();
  const { isOpen: isOpenEditModal, onOpen: onOpenEditModal, onClose: onCloseEditModal } = useDisclosure();

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
          <MyTooltip mb="10px" label={window.getUserRole() === AccountRole.ADMIN ? '' : 'Only admin can create new account'}>
            Add account
          </MyTooltip>
        </SubmitButton>
      </Flex>

      <AccountTable
        accounts={accounts}
        isLoading={isLoading}
        setDeletingAccount={setDeletingAccount}
        onOpenModalDel={onOpenModalDel}
        onOpenEditModal={onOpenEditModal}
        setEditingAccount={setEditingAccount}
        setResetingPassAccount={setResetingPassAccount}
        onOpenResetPassword={onOpenResetPassword}
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

      <EditAccountModal
        account={editingAccount}
        isOpen={isOpenEditModal}
        onClose={onCloseEditModal}
        callback={uiLoadAccounts}
      />

      <ResetPasswordAccountModal
        account={resetingPassAccount}
        isOpen={isOpenResetPassword}
        onClose={onCloseResetPassword}
        callback={uiLoadAccounts}
      />

    </Box>
  );
}
