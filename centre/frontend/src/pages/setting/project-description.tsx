import React from 'react';
import { Box, Divider, Grid, Heading, Text } from '@chakra-ui/react';
import { Project } from 'src/libs/apis/projects';
import { dateToString } from 'src/libs/timing';

type Props = {
  project: Project;
};
function ProjectDescription (props: Props) {
  const { project } = props;
  return (
    <Box mb="10px">
      <Grid gridTemplateColumns="1fr 1fr" alignItems="center">
        <Heading
          as="h4"
          fontSize="2xl"
          w="100%"
          justifySelf="start"
        >
          {project.name}
        </Heading>
        <Text
          as="i"
          fontSize="xs"
          justifySelf="end"
          verticalAlign="middle"
        >
          Created at: {dateToString(project.createdAt)}
        </Text>
      </Grid>
      <Divider my="8px" />

      <Heading
        as="h5"
        mt="10px"
        lineHeight="1.4em"
        fontWeight="100"
        ml="10px"
        fontSize="xs"
        w="100%"
        justifySelf="start"
        whiteSpace="pre-wrap"
      >
        {project.description}
      </Heading>
    </Box>
  );
}

export default ProjectDescription;
