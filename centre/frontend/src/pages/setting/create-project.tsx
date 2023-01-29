import React from 'react';
import { Heading, Button, Input, Box, useToast, Textarea } from '@chakra-ui/react';
import { notify } from 'src/libs/notify';
import { createProject } from 'src/libs/apis/projects';

type Props = {
  getProjects: () => Promise<void>
}
function CreateProjectBox (props: Props) {
  const { getProjects } = props;

  const toast = useToast();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const onClickCreateProject = async function () {
    const resp = await createProject({ name, description });
    notify(toast, resp);
    getProjects();
  };

  return (
    <Box
      mt="2vh"
      bg="background.primary-white"
      mx="10%"
      px="2%" py="2%"
      boxShadow="sm"
      borderRadius="3px"
    >
      <Heading
        as="h2"
        size="xl"
        mb={3}
      >
        Create new project
      </Heading>
      <Input
        border="1px solid black"
        bg="background.primary-white"
        mb={3}
        placeholder="Project name: i.e viettel"
        onChange={(event) => setName(event.target.value)}
      />
      <Textarea
        border="1px solid black"
        bg="background.primary-white"
        mb={3}
        placeholder="Project description (your target): i.e viettel.vn, apk.com.vietteltelecom, lifebox.vn"
        onChange={(event) => setDescription(event.target.value)}
      />
      <Button
        colorScheme="green"
        onClick={onClickCreateProject}
      >
        Create
      </Button>
    </Box>
  );
}

export default CreateProjectBox;
