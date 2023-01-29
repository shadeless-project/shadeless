import React from 'react';
import { Box } from '@chakra-ui/react';
import Logger from './Logger';
import MiniDashboard from './MiniDashboard';
import { defaultQuery2ObjectResult, Query2ObjectResult } from 'src/libs/query.parser';

export type FilterBodyType = {
  body?: string;
  requestBody?: string;
  responseBody?: string;
}

type AppPageProps = {
  project: string;
}
function AppPage (props: AppPageProps) {
  const { project } = props;
  const [applyingFilter, setApplyingFilter] = React.useState<Query2ObjectResult>(defaultQuery2ObjectResult);

  return (
    <>
      {project !== '' &&
        <Box>
          <MiniDashboard
            currentProject={project}
            applyingFilter={applyingFilter} 
          />
          <Logger
            currentProject={project}
            applyingFilter={applyingFilter}
            setApplyingFilter={setApplyingFilter}
          />
        </Box>
      }
    </>
  );
}

export default AppPage;
