import React from 'react';
import LoggerBody from './LoggerBody';
import LoggerDashboard from './LoggerDashboard';
import { defaultQuery2ObjectResult, Query2ObjectResult } from 'src/libs/query.parser';
import { LoggerContext } from './LoggerAppContext';
import LoggerHeader from './logger-header';
import { useLocation } from 'wouter';
import CensorPage from '../censor/CensorsPage';
import { Box } from '@chakra-ui/react';
import Page404 from '../Page404';

export const enum Tabs {
  DEFAULT,
  LOGGER,
  CENSORS,
};

export type FilterBodyType = {
  body?: string;
  requestBody?: string;
  responseBody?: string;
}

type AppPageProps = {
  project: string;
  page: string;
}
function AppPage (props: AppPageProps) {
  const { project, page } = props;
  const [applyingFilter, setApplyingFilter] = React.useState<Query2ObjectResult>(defaultQuery2ObjectResult);

  const [choosingTab, setChoosingTab] = React.useState<Tabs>(Tabs.DEFAULT);

  React.useEffect(() => {
    if (page === 'censors') {
      setChoosingTab(Tabs.CENSORS);
    } else if (page === 'logger') {
      setChoosingTab(Tabs.LOGGER);
    } else {
      setChoosingTab(Tabs.DEFAULT);
    }
  }, [project, page]);

  return (
    <LoggerContext.Provider value={project}>
      <LoggerHeader choosingTab={choosingTab} />

      {choosingTab === Tabs.LOGGER &&
        <React.Fragment>
          <LoggerDashboard
            applyingFilter={applyingFilter}
          />
          <LoggerBody
            applyingFilter={applyingFilter}
            setApplyingFilter={setApplyingFilter}
          />
        </React.Fragment>
      }

      {choosingTab === Tabs.CENSORS &&
        <Box
          mt="var(--component-distance)"
          w="var(--component-width)"
          mx="auto"
        >
          <CensorPage />
        </Box>
      }

      {choosingTab === Tabs.DEFAULT &&
        <Box
          mt="var(--component-distance)"
          w="var(--component-width)"
          mx="auto"
        >
          <Page404 />
        </Box>
      }
    </LoggerContext.Provider>
  );
}

export default AppPage;
