import { Box,
  Flex, Spinner, Text, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Censor, CensorType, defaultCensor, getCensors } from "src/libs/apis/censors";
import SubmitButton from "../common/submit-button";
import { LoggerContext } from "../LoggerApp/LoggerAppContext";
import AddCensorModal from "./add-censor";
import CensorTable from "./censor-table";
import DeleteCensorModal from "./delete-censor";

export default function CensorPage() {
  const currentProject = useContext(LoggerContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [censors, setCensors] = React.useState<Censor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const { isOpen: isOpenModalDel, onOpen: onOpenModalDel, onClose: onCloseModalDel } = useDisclosure();
  const [deletingCensor, setDeletingCensor] = React.useState<Censor>(defaultCensor);

  const { isOpen: isOpenModalDel, onOpen: onOpenModalDel, onClose: onCloseModalDel } = useDisclosure();
  const [deletingCensor, setDeletingCensor] = React.useState<Censor>(defaultCensor);

  async function uiLoadCensors() {
    setIsLoading(true);
    setCensors([]);
    const resp = await getCensors(currentProject);
    setIsLoading(false);
    setCensors(resp.data);
    console.log(resp.data);
  }

  React.useEffect(() => { uiLoadCensors() }, [currentProject]);

  const [globalCensors, setGlobalCensors] = React.useState<Censor[]>([]);
  const [projectCensors, setProjectCensors] = React.useState<Censor[]>([]);
  React.useEffect(() => {
    setGlobalCensors(censors.filter(c => c.type === CensorType.ALL));
    setProjectCensors(censors.filter(c => c.type === CensorType.ONE && c.project === currentProject));
  }, [censors]);

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
          Global censors {isLoading ? <Spinner ml="10px" /> : <Text as="span">({globalCensors.length})</Text>}
        </Text>
        <SubmitButton
          id='click-add-censor'
          onClick={onOpen}
          disabled={isLoading}
        >
          Add censor
        </SubmitButton>
      </Flex>

      <CensorTable
        censors={globalCensors}
        isLoading={isLoading}
        setDeletingCensor={setDeletingCensor}
        onOpenModalDel={onOpenModalDel}
      />

      {currentProject !== '' &&
        <React.Fragment>
          <Text
            as="h2"
            fontSize="3xl"
            p="15px"
          >
            Project censors {isLoading ? <Spinner ml="10px" /> : <Text as="span">({projectCensors.length})</Text>}
          </Text>
          <CensorTable
            censors={projectCensors}
            isLoading={isLoading}
            setDeletingCensor={setDeletingCensor}
            onOpenModalDel={onOpenModalDel}
          />
        </React.Fragment>
      }

      <AddCensorModal
        isOpen={isOpen}
        onClose={onClose}
        callback={uiLoadCensors}
      />
      <DeleteCensorModal
        isOpen={isOpenModalDel}
        onClose={onCloseModalDel}
        deletingCensor={deletingCensor}
        callback={uiLoadCensors}
      />
    </Box>
  );
}
