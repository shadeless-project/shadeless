import React from 'react';
import { Box } from '@chakra-ui/react';
import ShowProjectsBox from 'src/pages/setting/show-project';
import CreateProjectBox from 'src/pages/setting/create-project';
import { getAllProjects, Project } from 'src/libs/apis/projects';
import DownloadBurp from './setting/download-burp';

function SettingPage () {
  const [projects, setProjects] = React.useState<Project[]>([]);

  const getProjects = async () => {
    const response = await getAllProjects();
    setProjects(response.data);
  };
  React.useEffect(() => {
    getProjects();
  }, []);

  return (
    <Box>
      <DownloadBurp />
      <CreateProjectBox
        getProjects={getProjects}
      />
      <ShowProjectsBox
        projects={projects}
        getProjects={getProjects}
      />
    </Box>
  );
}

export default SettingPage;
