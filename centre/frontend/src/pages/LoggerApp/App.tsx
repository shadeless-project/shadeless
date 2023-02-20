import React from 'react';
import LoggerBody from './LoggerBody';
import LoggerDashboard from './LoggerDashboard';
import { defaultQuery2ObjectResult, Query2ObjectResult } from 'src/libs/query.parser';
import { LoggerContext } from './LoggerAppContext';

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
    <LoggerContext.Provider value={project}>
      <LoggerDashboard
        currentProject={project}
        applyingFilter={applyingFilter} 
      />
      <LoggerBody
        applyingFilter={applyingFilter}
        setApplyingFilter={setApplyingFilter}
      />
    </LoggerContext.Provider>
  );
}

export default AppPage;
