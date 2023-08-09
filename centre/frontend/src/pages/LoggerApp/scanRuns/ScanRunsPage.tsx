import { Box, Flex, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { notify } from 'src/libs/notify';
import { ScanRunDetail, defaultScanRun, defaultScanRunDetail, getProjectScanRuns } from 'src/libs/apis/scanRuns';
import { LoggerContext } from '../LoggerAppContext';
import ScanRunLogDetailModal from './scanRunLogModal';
import ScanRunsTable from './ScanRunsTable';

export default function ScanRunsPage() {
  const toast = useToast();

  const currentProject = useContext(LoggerContext);
  const [scanRunDetails, setScanRunDetails] = React.useState<ScanRunDetail[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [viewingScanRun, setViewingScanRun] = React.useState<ScanRunDetail>(defaultScanRunDetail);
  const { isOpen: isOpenModalViewScanRun, onOpen: onOpenModalViewScanRun, onClose: onCloseModalViewScanRun } = useDisclosure();

  async function uiLoadProjectScanRuns() {
    setIsLoading(true);
    const resp = await getProjectScanRuns(currentProject);
    setIsLoading(false);
    if (resp.statusCode === 200) {
      setScanRunDetails(resp.data);
    } else {
      notify(toast, resp);
    }
  }
  React.useEffect(() => { uiLoadProjectScanRuns() }, []);

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
          Scan Runs history {isLoading ? <Spinner ml="10px" /> : <Text as="span">({scanRunDetails.length})</Text>}
        </Text>
      </Flex>

      <ScanRunsTable
        scanRuns={scanRunDetails}
        isLoading={isLoading}
        setViewingScanRun={setViewingScanRun}
        onOpenModalViewScanRun={onOpenModalViewScanRun}
      />

      {viewingScanRun._id !== defaultScanRun._id &&
        <ScanRunLogDetailModal
          id={viewingScanRun._id}
          isOpen={isOpenModalViewScanRun}
        />
      }

    </Box>
  );
}
