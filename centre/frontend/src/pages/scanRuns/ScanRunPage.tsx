import { Box,
  Flex, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Censor, CensorType, defaultCensor, getCensors } from "src/libs/apis/censors";
import SubmitButton from "../common/submit-button";
import { LoggerContext } from "../LoggerApp/LoggerAppContext";
import { ScanRun, getScanRuns } from "src/libs/apis/jaeles";

export default function ScanRunsPage() {
  const currentProject = useContext(LoggerContext);

  const [scanRuns, setScanRuns] = React.useState<ScanRun[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  async function uiLoadScanRuns() {
    setIsLoading(true);
    const resp = await getScanRuns(currentProject);
    setIsLoading(false);
    setScanRuns(resp.data);
  }
  React.useEffect(() => { uiLoadScanRuns() }, [currentProject]);

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
          Scan runs {isLoading ? <Spinner ml="10px" /> : <Text as="span">({scanRuns.length})</Text>}
        </Text>
      </Flex>

      {currentProject !== '' &&
        <React.Fragment>
          <Text
            as="h2"
            fontSize="3xl"
            p="15px"
          >
            Project censors {isLoading ? <Spinner ml="10px" /> : <Text as="span">({projectCensors.length})</Text>}
          </Text>
          <ScanRunTable
            censors={projectCensors}
            isLoading={isLoading}
            setDeletingCensor={setDeletingCensor}
            onOpenModalDel={onOpenModalDel}
            setEditingCensor={setEditingCensor}
            onOpenModalEdit={onOpenModalEdit}
          />
        </React.Fragment>
      }

      <Text fontSize="2xs" ml="3em" opacity=".7">
        Note: wants to edit or delete existing censor ? Please ask admin account
      </Text>
    </Box>
  );
}
