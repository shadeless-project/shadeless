import { Menu, MenuButton, MenuItem, MenuList, Progress, Table, TableContainer, Tag, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { Account, AccountRole } from "src/libs/apis/account";
import ConfigIcon from "../common/config-icon";
import RoleTag from "./role-tag";

type AccountTableProps = {
  accounts: Account[];
  isLoading: boolean;
  setDeletingAccount: React.Dispatch<React.SetStateAction<Account>>;
  onOpenModalDel: () => void;
  setResetingPassAccount: React.Dispatch<React.SetStateAction<Account>>;
  onOpenResetPassword: () => void;
  setEditingAccount: React.Dispatch<React.SetStateAction<Account>>;
  onOpenEditModal: () => void;
}
export default function AccountTable (props: AccountTableProps) {
  const {
    accounts,
    isLoading,
    onOpenModalDel,
    setDeletingAccount,
    onOpenResetPassword,
    setResetingPassAccount,
    onOpenEditModal,
    setEditingAccount,
  } = props;
  return (
    <TableContainer p="10px">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Username</Th>
            <Th>Role</Th>
            <Th>Email</Th>
            <Th>Description</Th>
            <Th>Created at</Th>
          </Tr>
        </Thead>
        <Tbody>
          {accounts.map((acc, index) =>
            <Tr
              key={`account-${acc._id}`}
              _hover={{ bg: 'custom.hover-grey' }}
            >
              <Td pl="20px">{index+1}</Td>
              <Td>{acc.username}</Td>
              <Td>
                <RoleTag role={acc.role} />
              </Td>
              <Td>{acc.email}</Td>
              <Td>{acc.description}</Td>
              <Td>{window.formatDate(acc.createdAt)}</Td>
              {window.getUserRole() === AccountRole.ADMIN &&
                <Td>
                  <Menu>
                    <MenuButton
                      p={2}
                      _hover={{ bg: 'custom.focus-grey' }}
                      _expanded={{ bg: 'custom.focus-grey' }}
                    >
                      <ConfigIcon />
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        disabled
                        onClick={() => {
                          setEditingAccount(acc);
                          onOpenEditModal();
                        }}
                      >
                        Edit account
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setResetingPassAccount(acc);
                          onOpenResetPassword();
                        }}
                      >
                        Reset password
                      </MenuItem>
                      {window.getUser().username !== acc.username &&
                        <MenuItem
                          color="red.500"
                          onClick={() => {
                            setDeletingAccount(acc);
                            onOpenModalDel();
                          }}
                        >
                          Remove
                        </MenuItem>
                      }
                    </MenuList>
                  </Menu>
                </Td>
              }
            </Tr>
          )}
        </Tbody>
      </Table>
      <Progress
        display={isLoading ? 'block' : 'none'}
        colorScheme="black"
        isIndeterminate
        lineHeight="5x"
        hasStripe
        size="xs"
        mt="20px"
      />
    </TableContainer>
  );
}
