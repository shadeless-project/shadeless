import { Progress, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import { ScanRunDetail, parseScanRunStatus } from "src/libs/apis/scanRuns";

type ScanRunsTableProps = {
  scanRuns: ScanRunDetail[];
  isLoading: boolean;
  setViewingScanRun: React.Dispatch<React.SetStateAction<ScanRunDetail>>;
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
            <Th>Target</Th>
            <Th>Status</Th>
            <Th>Found</Th>
            <Th>Created at</Th>
          </Tr>
        </Thead>
        <Tbody>
          {scanRuns.map((scanRun, index) =>
            <Tr
              key={`scanRun-${scanRun._id}`}
              _hover={{ bg: 'custom.hover-grey' }}
            >
              <Td>{index+1}</Td>
              <Td>{scanRun.scanner.name}</Td>
              <Td>
                <Text as="strong">{scanRun.packet.method}</Text>&nbsp;
                {`${scanRun.packet.origin}${scanRun.packet.path}${ scanRun.packet.querystring ? `?${scanRun.packet.querystring}` : '' }`}
              </Td>

              <Td>
                {parseScanRunStatus(scanRun.status)}
              </Td>
              <Td></Td>
              <Td>{window.formatDate(scanRun.createdAt)}</Td>
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
