import { QuestionIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Box, Button, Checkbox, Code, Divider, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Progress, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import React from "react";
import { Censor, CensorType, CENSOR_CONDITION, createCensor, defaultCensor, deleteCensor, getCensors } from "src/libs/apis/censors";
import { notify } from "src/libs/notify";
import { getUserRole } from "src/libs/storage";

type CensorTableProps = {
  censors: Censor[];
  setDeletingCensor: React.Dispatch<React.SetStateAction<Censor>>;
  onOpenModalDel: () => void;
  isLoading: boolean;
}
function CensorTable (props: CensorTableProps) {
  const { censors, onOpenModalDel, setDeletingCensor, isLoading } = props;
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
            <Th w="40px" textAlign="center">#</Th>
            <Th maxW="50px">Method</Th>
            <Th>Origin</Th>
            <Th>Path</Th>
            <Th w="60px">Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {censors.map((c, index) =>
            <Tr key={`censor-${c._id}`}>
              <Td textAlign="center">{index+1}</Td>
              {CENSOR_CONDITION.map(cond =>
                <Td key={`censor-${c._id}-cond-${cond}`}>
                  {c.condition[cond]}
                </Td>
              )}
              <Td>
                <Tooltip placement="top" fontSize="2xs" label="Delete censor">
                  <Button
                    ml="10px"
                    colorScheme="red"
                    size="2xs"
                    p="2px"
                    borderRadius="1"
                    onClick={() => {
                      setDeletingCensor(c);
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
      {censors.length === 0 &&
        <Text
          fontSize="sm"
          textAlign="center"
          fontStyle="italic"
          p="5px"
          borderX="1px solid black"
          borderBottom="1px solid black"
        >
          No censor found
        </Text>
      }
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

type CensorPageProps = {
  project: string;
}
export default function CensorPage(props: CensorPageProps) {
  const { project } = props;

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [censors, setCensors] = React.useState<Censor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCensorAllProject, setIsCensorAllProject] = React.useState(false);

  const [censorMethod, setCensorMethod] = React.useState('');
  const [censorOrigin, setCensorOrigin] = React.useState('');
  const [censorPath, setCensorPath] = React.useState('');

  const { isOpen: isOpenModalDel, onOpen: onOpenModalDel, onClose: onCloseModalDel } = useDisclosure();
  const [deletingCensor, setDeletingCensor] = React.useState<Censor>(defaultCensor);

  async function uiLoadCensors() {
    const resp = await getCensors(project);
    setIsLoading(false);
    if (resp.statusCode === 200) {
      setCensors(resp.data);
    } else {
      notify(toast, resp);
    }
  }

  async function uiCreateCensor() {
    const resp = await createCensor(project, {
      method: censorMethod,
      origin: censorOrigin,
      path: censorPath,
    }, isCensorAllProject);
    notify(toast, resp);
    if (resp.statusCode === 200) {
      location.href = '/censor';
    }
  }
  async function uiDeleteCensor() {
    const resp = await deleteCensor(deletingCensor._id || '');
    notify(toast, resp);
    if (resp.statusCode === 200) {
      setIsLoading(true);
      onCloseModalDel();
      await uiLoadCensors();
    }
  }

  React.useEffect(() => {
    function loadCensorOnUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      setCensorMethod(urlParams.get('censorMethod') || '');
      setCensorOrigin(urlParams.get('censorOrigin') || '');
      setCensorPath(urlParams.get('censorPath') || '');
      if (urlParams.toString() !== '') {
        setTimeout(() => document.getElementById('click-add-censor')?.click(), 150);
      }
    }
    uiLoadCensors();
    loadCensorOnUrl();
  }, [project]);

  const [globalCensors, setGlobalCensors] = React.useState<Censor[]>([]);
  const [projectCensors, setProjectCensors] = React.useState<Censor[]>([]);
  React.useEffect(() => {
    setGlobalCensors(censors.filter(c => c.type === CensorType.ALL));
    setProjectCensors(censors.filter(c => c.type === CensorType.ONE && c.project === project));
  }, [censors]);

  return (
    <Box
      mx="auto"
      w="50%"
      mt="3vh"
      p="10px"
      borderRadius="3px"
      bg="background.primary-white"
      fontSize="sm"
    >
      <Button
        id='click-add-censor'
        size="sm"
        bg="black"
        mt="15px"
        color="white"
        _hover={{ opacity: ".6" }}
        onClick={onOpen}
      >
        Add censor
      </Button>

      <Text
        fontWeight="bold"
        fontSize="3xl"
        mt="30px"
      >
        # Global censors
      </Text>
      <CensorTable
        censors={globalCensors}
        isLoading={isLoading}
        setDeletingCensor={setDeletingCensor}
        onOpenModalDel={onOpenModalDel}
      />

      <Text
        fontWeight="bold"
        fontSize="3xl"
        mt="30px"
      >
        # Project censors
      </Text>
      <CensorTable
        censors={projectCensors}
        isLoading={isLoading}
        setDeletingCensor={setDeletingCensor}
        onOpenModalDel={onOpenModalDel}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Adding censor
            <Text as="span" cursor="pointer">
            &nbsp;
            <Tooltip fontSize="2xs" label="Packets matched with below conditions will have their body censored in logs. This prevent username/password leak to other collaborators" aria-label='Filter tutorial'>
              <QuestionIcon />
            </Tooltip>
          </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="sm">
            <Text
              mb="3px"
              fontWeight="700"
            >
              Method
            </Text>
            <Input
              size="sm"
              placeholder="GET"
              value={censorMethod}
              onChange={(e) => setCensorMethod(e.target.value)}
            />

            <Text
              mt="10px"
              mb="3px"
              fontWeight="700"
            >
              Origin
            </Text>
            <Input
              size="sm"
              placeholder={`https://${project}.com`}
              value={censorOrigin}
              onChange={(e) => setCensorOrigin(e.target.value)}
            />

            <Text
              mt="10px"
              mb="3px"
              fontWeight="700"
            >
              Path
            </Text>
            <Input
              size="sm"
              placeholder="/auth/login"
              value={censorPath}
              onChange={(e) => setCensorPath(e.target.value)}
            />

            <Divider mt="20px" mb="5px" />
            <Text>This will censor packets that has:</Text>
            <Code
              p="5px"
              mt="5px"
              fontSize="xs"
            >
              method == '{censorMethod}' && origin == '{censorOrigin}' && path == '{censorPath}'
            </Code>
            <Checkbox 
              mt="20px"
              isChecked={isCensorAllProject}
              onChange={(e) => setIsCensorAllProject(e.target.checked)}
            >
              <Text fontSize="sm">Apply this censor for all projects</Text>
            </Checkbox>
          </ModalBody>

          <ModalFooter>
            <Button
              color="white"
              bg="black"
              mr={3}
              onClick={uiCreateCensor}
              _hover={{opacity: '.6'}}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Modal isOpen={isOpenModalDel} onClose={onCloseModalDel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Deleting modal (Admin only)
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="sm">
            <Text>Are you sure to delete censor for packets that has:</Text>
            <Code
              p="5px"
              mt="5px"
              fontSize="xs"
            >
              method == '{deletingCensor.condition.method}' && origin == '{deletingCensor.condition.origin}' && path == '{deletingCensor.condition.path}'
            </Code>
          </ModalBody>

          <ModalFooter>
            <Button
              color="white"
              bg="black"
              mr={3}
              onClick={uiDeleteCensor}
              _hover={{opacity: '.6'}}
              disabled={getUserRole() === 'admin' ? false : true}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}
