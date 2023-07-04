import { Code, Menu, MenuButton, MenuItem, MenuList, Progress, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import { ScanRun } from "src/libs/apis/scanRuns";

type ScanRunsTableProps = {
  scanRuns: ScanRun[];
  isLoading: boolean;
  setViewingScanRun: React.Dispatch<React.SetStateAction<ScanRun>>;
  onOpenModalViewScanRun: () => void;
}
export default function ScanRunsTable (props: ScanRunsTableProps) {
  const {
    scanRuns,
    isLoading,
    setViewingScanRun,
    onOpenModalViewScanRun,
  } = props;

  return (
    <TableContainer p="10px">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Scanner command</Th>
            <Th># of run signatures</Th>
            <Th>Created at</Th>
          </Tr>
        </Thead>
        <Tbody>
          {scanRuns.map((scanRun, index) =>
            <Tr
              key={`scanRun-${scanRun._id}`}
              _hover={{ bg: 'custom.hover-grey' }}
            >
              <Td pl="20px">{index+1}</Td>
              <Td>{scanner.name}</Td>
              <Td>{scanner.description}</Td>
              <Td>
                <Code fontSize="xs" p="2">jaeles scan -u &lt;target&gt; -L 4 -s "{scanner.scanKeyword}" -v</Code>
              </Td>
              <Td textAlign="center">
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
