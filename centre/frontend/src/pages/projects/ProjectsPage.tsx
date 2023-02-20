import React from 'react';
import {
  Box, Button, Divider, Flex, Skeleton, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr,
} from '@chakra-ui/react';
import { getAllProjects, Project } from 'src/libs/apis/projects';

export default function ProjectsPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [projects, setProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    async function uiGetAllProjects() {
      setProjects([]);
      setIsLoading(true);
      const resp = await getAllProjects();
      setProjects(resp.data);
      setIsLoading(false);
    }
    uiGetAllProjects();
  }, []);
  return (
    <Box
      borderRadius="var(--component-border)"
      boxShadow="sm"
      bg="custom.white"
    >
      {isLoading ? 
        <Skeleton></Skeleton>
      :
        <React.Fragment>
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
              Projects ({projects.length})
            </Text>
            <Button>Add project</Button>
          </Flex>
          <Divider mt="10px" w="100%" />
          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Name</Th>
                  <Th>Description</Th>
                  <Th>Created at</Th>
                </Tr>
              </Thead>
              <Tbody>
                {projects.map((p, idx) =>
                  <Tr key={`project-id-${p._id}`}>
                    <Td>{idx + 1}</Td>
                    <Td>{p.name}</Td>
                    <Td>{p.description}</Td>
                    <Td>{p.createdAt.toString()}</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </React.Fragment>
      }
    </Box>
  );
}