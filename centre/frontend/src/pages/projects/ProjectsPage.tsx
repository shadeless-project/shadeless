import React from 'react';
import {
  Box, Divider, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, SkeletonText, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure,
} from '@chakra-ui/react';
import { FaEllipsisV } from 'react-icons/fa';
import { defaultProject, getAllProjects, Project } from 'src/libs/apis/projects';
import DeleteProjectModal from './delete-project';
import AddProjectModal from './add-project';
import SubmitButton from '../common/submit-button';
import ProjectStat from './project-stat';
import EditProjectModal from './edit-project';

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
                <Td>{p.description}</Td>
                <Td><ProjectStat projectName={p.name} /></Td>
                <Td>{window.formatDate(p.createdAt)}</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      p={2}
                      _hover={{ bg: 'custom.focus-grey' }}
                      _expanded={{ bg: 'custom.focus-grey' }}
                    >
                      <Icon as={FaEllipsisV} />
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() => window.location.href = `/projects/${p.name}`}
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
                      <MenuItem
                        color="red.500"
                        onClick={() => {
                          setDeletingProject(p);
                          onOpen();
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
    </Box>
  );
}
