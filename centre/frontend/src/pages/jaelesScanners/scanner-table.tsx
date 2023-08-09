import { Code, Menu, MenuButton, MenuItem, MenuList, Progress, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import ConfigIcon from "../common/config-icon";
import { JaelesScanner, getAllSignatures } from "src/libs/apis/scanners";
import React from "react";

type ScannerTableProps = {
  scanners: JaelesScanner[];
  isLoading: boolean;
  setDeletingScanner: React.Dispatch<React.SetStateAction<JaelesScanner>>;
  onOpenModalDel: () => void;
  setEditingScanner: React.Dispatch<React.SetStateAction<JaelesScanner>>;
  onOpenEditModal: () => void;
}
export default function ScannerTable (props: ScannerTableProps) {
  const {
    scanners,
    isLoading,
    setDeletingScanner,
    onOpenModalDel,
    setEditingScanner,
    onOpenEditModal,
  } = props;

  const [signatures, setSignatures] = React.useState<string[]>([]);
  async function uiLoadSignatures() {
    const resp = await getAllSignatures();
    if (resp.statusCode === 200) {
      setSignatures(resp.data);
    }
  }
  React.useEffect(() => { uiLoadSignatures() }, []);

  return (
    <TableContainer p="10px">
      <Table size="xs" fontSize="xs">
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Scanner command</Th>
            <Th># signatures</Th>
            <Th>Created at</Th>
          </Tr>
        </Thead>
        <Tbody>
          {scanners.map((scanner, index) =>
            <Tr
              key={`scanner-${scanner._id}`}
              _hover={{ bg: 'custom.hover-grey' }}
            >
              <Td>{index+1}</Td>
              <Td>{scanner.name}</Td>
              <Td>{scanner.description}</Td>
              <Td>
                <Code fontSize="2xs" p="1">jaeles scan -u &lt;target&gt; -L 4 -s "{scanner.scanKeyword}" -H &lt;injected_headers&gt; -v</Code>
              </Td>
              <Td>
                {signatures.filter(sig => sig.toLowerCase().includes(scanner.scanKeyword)).length}
              </Td>
              <Td>{window.formatDate(scanner.createdAt)}</Td>
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
                        setEditingScanner(scanner);
                        onOpenEditModal();
                      }}
                    >
                      Edit scanner
                    </MenuItem>
                    <MenuItem
                      color="red.500"
                      onClick={() => {
                        setDeletingScanner(scanner);
                        onOpenModalDel();
                      }}
                    >
                      Remove
                    </MenuItem>
                  </MenuList>
                </Menu>
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
    </TableContainer>
  );
}
