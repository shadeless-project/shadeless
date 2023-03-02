import React from 'react';
import {
  Box, Divider, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, SkeletonText, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure,
} from '@chakra-ui/react';
import { defaultProject, getAllProjects, Project } from 'src/libs/apis/projects';
import DeleteProjectModal from './delete-project';
import AddProjectModal from './add-project';
import SubmitButton from '../common/submit-button';
import ProjectStat from './project-stat';
import EditProjectModal from './edit-project';
import { ChevronDownIcon } from '@chakra-ui/icons';
import ConfigIcon from '../common/config-icon';
import { AccountRole } from 'src/libs/apis/account';

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const [deletingProject, setDeletingProject] = React.useState<Project>(defaultProject);
  const [edittingProject, setEdittingProject] = React.useState<Project>(defaultProject);

  async function uiGetAllProjects() {
    setProjects([]);
    setIsLoading(true);
    const resp = await getAllProjects();
    setProjects(resp.data);
    setIsLoading(false);
  }
  React.useEffect(() => {
    uiGetAllProjects();
  }, []);

  React.useEffect(() => {
    function loadOnUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      const updateProjectName = urlParams.get('editProject');
      const updatingProject = projects.find(project => project.name === updateProjectName);
      if (updatingProject) {
        setEdittingProject(updatingProject);
        window.history.pushState({}, '', location.pathname);
        setTimeout(onOpenEdit, 150);
      }

      const deletingProjectName = urlParams.get('deleteProject');
      const deletingProject = projects.find(project => project.name === deletingProjectName);
      if (deletingProject) {
        setDeletingProject(deletingProject);
        window.history.pushState({}, '', location.pathname);
        setTimeout(onOpen, 150);
      }
    }
    loadOnUrl();
  }, [projects]);

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
          Projects {isLoading ? <Spinner ml="10px" /> : <Text as="span">({projects.length})</Text>}
        </Text>
        <SubmitButton
          disabled={isLoading}
          onClick={onOpenAdd}
        >
          Add project
        </SubmitButton>
      </Flex>
      <Divider mt="10px" w="100%" />
      <TableContainer p="10px">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Statistics</Th>
              <Th>Created at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {projects.map((p, idx) =>
              <Tr
                id={`project-id-${p._id}`}
                key={`project-id-${p._id}`}
                cursor="pointer"
                _hover={{ bg: 'custom.hover-grey' }}
                _active={{ bg: 'custom.focus-grey' }}
                onClick={(e) => {
                  const tag = (e.target as HTMLElement).tagName;
                  if (tag !== 'path' && tag !== 'BUTTON')
                    window.location.href = `/projects/${p.name}`
                }}
              >
                <Td>{idx + 1}</Td>
                <Td>{p.name}</Td>
                <Td
                  maxW="500px"
                  wordBreak="break-word"
                  whiteSpace='pre-wrap'
                  lineHeight="1.5em"
                >
                  {p.description}
                </Td>
                <Td><ProjectStat projectName={p.name} /></Td>
                <Td>{window.formatDate(p.createdAt)}</Td>
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
                        onClick={() => window.location.href = `/projects/${p.name}/logger`}
                      >
                        Go to dashboard
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setEdittingProject(p);
                          onOpenEdit();
                        }}
                      >
                        Edit project
                      </MenuItem>
                      {window.getUserRole() === AccountRole.ADMIN &&
                        <MenuItem
                          color="red.500"
                          onClick={() => {
                            setDeletingProject(p);
                            onOpen();
                          }}
                        >
                          Remove
                        </MenuItem>
                      }
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        {isLoading && <SkeletonText p="10px" noOfLines={3} />}
      </TableContainer>
      <AddProjectModal
        isOpen={isOpenAdd}
        onClose={onCloseAdd}
        callback={uiGetAllProjects}
      />
      <EditProjectModal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        project={edittingProject}
        callback={uiGetAllProjects}
      />
      <DeleteProjectModal
        isOpen={isOpen}
        onClose={onClose}
        deletingProject={deletingProject}
        callback={uiGetAllProjects}
      />

      <Text fontSize="2xs" ml="3em" opacity=".7">
        Note: just use Shadeless Burp and config with your desired project's name. Shadeless automatically create project for you.
      </Text>
    </Box>
  );
}
