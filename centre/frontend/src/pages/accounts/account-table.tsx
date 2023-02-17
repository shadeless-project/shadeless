import { SmallCloseIcon } from "@chakra-ui/icons";
import { Button, Progress, Table, Tbody, Td, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { Account, AccountRole } from "src/libs/apis/account";
import { getUserRole } from "src/libs/storage";

type AccountTableProps = {
  accounts: Account[];
  setDeletingAccount: React.Dispatch<React.SetStateAction<Account>>;
  onOpenModalDel: () => void;
  isLoading: boolean;
}
export default function AccountTable (props: AccountTableProps) {
  const { accounts, onOpenModalDel, setDeletingAccount, isLoading } = props;
  return (
    <>
      <Table
        border="1.3px solid gray"
        borderRadius="10px"
        mt="20px"
        size="xs"
        fontSize="xs"
      >
        <Thead fontSize="2xs">
          <Tr>
            <Th pl="20px">#</Th>
            <Th>Username</Th>
            <Th>Role</Th>
            <Th>Created at</Th>
            <Th w="60px">Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {accounts.map((acc, index) =>
            <Tr key={`account-${acc._id}`}>
              <Td pl="20px">{index+1}</Td>
              <Td>{acc.username}</Td>
              <Td>{acc.role}</Td>
              <Td>{acc.createdAt.toString()}</Td>
              <Td>
                <Tooltip placement="top" fontSize="2xs" label="Delete account">
                  <Button
                    ml="10px"
                    colorScheme="red"
                    size="2xs"
                    p="2px"
                    borderRadius="1"
                    disabled={getUserRole() === AccountRole.ADMIN ? false : true}
                    onClick={() => {
                      setDeletingAccount(acc);
                      onOpenModalDel();
                    }}
                  >
                    <SmallCloseIcon />
                  </Button>
                </Tooltip>
              </Td>
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
    </>
  );
}
