import { Box, Button, Divider, Flex, SkeletonText, Text, useToast } from "@chakra-ui/react";
import React, { useContext } from "react";
import { defaultProject, getOneProject, Project } from "src/libs/apis/projects";
import { notify } from "src/libs/notify";
import { LoggerContext } from "./LoggerAppContext";
import { useLocation } from "wouter";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Tabs } from "./App";

type Props = {
  choosingTab: Tabs;
}
export default function LoggerHeader (props: Props) {
  const { choosingTab } = props;

  const currentProject = useContext(LoggerContext);
  const [myLocation, setLocation] = useLocation();

  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [project, setProject] = React.useState<Project>(defaultProject);

  React.useEffect(() => {
    async function uiLoadProject() {
      setIsLoading(true);
      const resp = await getOneProject(currentProject);
      setIsLoading(false);

      if (resp.statusCode !== 200) {
        notify(toast, resp);
        setLocation('/projects');
      } else {
        setProject(resp.data);
      }
    }
    uiLoadProject();
  }, [currentProject]);

  return (
    <Box
      width="var(--component-width)"
      mx="auto"
      mt="var(--component-distance)"
      bg="custom.white"
      borderRadius="var(--component-border)"
      px="1.5%"
    >
      <Flex pt="10px" justifyContent="space-between">
        <Box width="80%">
          {isLoading ? <SkeletonText noOfLines={5} /> :
            <React.Fragment>
              <Text
                ml="2%"
                fontSize="2xl"
                fontWeight="bold"
              >
                {currentProject}
              </Text>
              <Text
                fontSize="xs"
                ml="1%"
                mt="10px"
              >
                Description:
              </Text>
              <Text
                fontSize="xs"
                opacity=".8"
                wordBreak="break-word"
                whiteSpace='pre-wrap'
                lineHeight="1.5em"
                ml="3%"
              >
                {project.description}
              </Text>

              <Text
                fontSize="xs"
                ml="1%"
                mt="10px"
              >
                Created at: <Text as="span" opacity=".8">{window.formatDate(project.createdAt)}</Text>
              </Text>
            </React.Fragment>
          }
        </Box>

        <Box mr="2%">
          <Button
            p="0"
            bg="inherit"
            _hover={{'opacity': '.6'}}
            _active={{'opacity': '.8'}}
            onClick={() => setLocation(`/projects?editProject=${currentProject}`)}
          >
            <EditIcon />
          </Button>
          <Button
            p="0"
            bg="inherit"
            _hover={{'opacity': '.6'}}
            _active={{'opacity': '.8'}}
            onClick={() => setLocation(`/projects?deleteProject=${currentProject}`)}
          >
            <DeleteIcon />
          </Button>
        </Box>
      </Flex>

      <Divider mt="10px"/>

      <Button
        bg="inherit"
        borderRadius={0}
        py="2em"
        px="3.5em"
        fontSize="xs"
        height="100%"
        borderColor="custom.primary"
        {...choosingTab === Tabs.LOGGER && {
          borderBottomWidth: '3px',
          fontWeight: '600'
        }}
        onClick={() => setLocation(`/projects/${project.name}/logger`)}
      >
        Logger
      </Button>
      <Button
        bg="inherit"
        borderRadius={0}
        py="2em"
        px="3.5em"
        fontSize="xs"
        height="100%"
        borderColor="custom.primary"
        {...choosingTab === Tabs.CENSORS && {
          borderBottomWidth: '3px',
          fontWeight: '600'
        }}
        onClick={() => setLocation(`/projects/${project.name}/censors`)}
      >
        Censors
      </Button>
    </Box>
  );
}
