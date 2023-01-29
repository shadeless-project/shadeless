import React from 'react';
import {
  Box,
  Button,
  Grid,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Text,
} from '@chakra-ui/react';

import { notify } from 'src/libs/notify';
import DoneRow from './done-row';
import TodoRow from './todo-row';
import HackingRow from './hacking-row';
import { defaultProject, deleteProject, editProjectStatus, Project, ProjectStatus } from 'src/libs/apis/projects';
import storage from 'src/libs/storage';

type Props = {
  projects: Project[]
  getProjects: () => Promise<void>
}
function ShowProjectsBox(props: Props) {
  const { projects, getProjects } = props;
  const toast = useToast();
  const currentProject = storage.getProject();

  // For deleting project
  const [deletingProject, setDeletingProject] = React.useState<Project>(defaultProject);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // For viewing
  const [todoProjects, setTodoProjects] = React.useState<Project[]>([]);
  const [hackingProjects, setHackingProjects] = React.useState<Project[]>([]);
  const [doneProjects, setDoneProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    const todo = projects.filter(p => p.status === ProjectStatus.TODO);
    const hacking = projects.filter(p => p.status === ProjectStatus.HACKING);
    const done = projects.filter(p => p.status === ProjectStatus.DONE);
    setTodoProjects(todo);
    setHackingProjects(hacking);
    setDoneProjects(done);
  }, [projects]);

  const setHacking = async (project: Project) => {
    storage.set('project', project.name);
    const response = await editProjectStatus(ProjectStatus.HACKING, project.name);
    notify(toast, response);
    await getProjects();
  };
  const setDone = async (project: Project) => {
    if (currentProject === project.name) storage.delete('project');
    const response = await editProjectStatus(ProjectStatus.DONE, project.name);
    notify(toast, response);
    await getProjects();
  };
  const onClickDeleteProject = async (project: Project) => {
    setDeletingProject(project);
    onOpen();
  };
  const deleteProjectOnly = async (project: Project) => {
    if (currentProject === project.name) storage.delete('project');
    const response = await deleteProject(project.name, { all: false });
    await storage.cleanNumPacketsPerPage();
    notify(toast, response);
    await getProjects();
    onClose();
  };
  const deleteAll = async (project: Project) => {
    if (currentProject === project.name) storage.delete('project');
    const response = await deleteProject(project.name, { all: true });
    await storage.cleanNumPacketsPerPage();
    notify(toast, response);
    await getProjects();
    onClose();
  };
  return (
    <Box
      mt="5vh"
      mx="10%"
      borderRadius="3px"
      px="2%" py="2%"
      bg="white"
      boxShadow="sm"
    >
      <Grid
        gridTemplateColumns={['1fr', '1fr', '1fr 1fr 1fr']}
        gap="5px"
      >
        <Box>
          <Heading as="h3" textAlign="center">Todo 📝</Heading>
          {todoProjects.map(project =>
            <TodoRow
              project={project}
              setHacking={setHacking}
              deleteButton={onClickDeleteProject}
              key={`todo-${project.name}`}
            />
          )}
        </Box>
        <Box>
          <Heading as="h3" textAlign="center">Hacking 🕵️</Heading>
          {hackingProjects.map(project =>
            <HackingRow
              project={project}
              setDone={setDone}
              setHacking={setHacking}
              deleteButton={onClickDeleteProject}
              key={`hacking-${project.name}`}
            />
          )}
        </Box>
        <Box>
          <Heading as="h3" textAlign="center">Done 💾</Heading>
          {doneProjects.map(project =>
            <DoneRow
              project={project}
              setHacking={setHacking}
              deleteButton={onClickDeleteProject}
              key={`done-${project.name}`}
            />
          )}
        </Box>
      </Grid>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent p="10px">
          <ModalHeader>Are you sure to delete
            <Text as="span" color="black" mx="5px" fontSize="2xl">{deletingProject.name}</Text>?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              - <Text as="span" color="orange">Project only</Text>: delete project only (creating project with same name still persist packets data).
            </Text>
            <Text>
              - <Text as="span" color="red">Delete all</Text>: delete project with every packets inside that project
            </Text>

          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="orange"
              mr={2}
              onClick={() => deleteProjectOnly(deletingProject)}
            >
              Project only
            </Button>
            <Button
              colorScheme="red"
              onClick={() => deleteAll(deletingProject)}
            >
              Delete all
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}

export default ShowProjectsBox;
