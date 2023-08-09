import React from 'react';
import Logger from './Logger/Logger';
import LoggerDashboard from './Logger/LoggerDashboard';
import { defaultQuery2ObjectResult, Query2ObjectResult } from 'src/libs/query.parser';
import { LoggerContext, LoggerDashboardContext } from './LoggerAppContext';
import AppHeader from './app-header';
import CensorPage from '../censor/CensorsPage';
import { Box } from '@chakra-ui/react';
import Page404 from '../Page404';
import ScanRunsPage from './scanRuns/ScanRunsPage';

export const enum Tabs {
  DEFAULT,
  LOGGER,
  CENSORS,
  SCAN_RUNS,
};

export type FilterBodyJsonType = {
  body?: string;
  requestBody?: string;
  responseBody?: string;
}

export enum FilterBodyTypes {
  BODY = 'body',
  REQUEST_BODY = 'requestBody',
  RESPONSE_BODY = 'responseBody',
}

type AppPageProps = {
  project: string;
  page: string;
}
function AppPage (props: AppPageProps) {
  const { project, page } = props;
  const [applyingFilter, setApplyingFilter] = React.useState<Query2ObjectResult>({
    ...defaultQuery2ObjectResult,
    queryDistinct: localStorage.getItem('uniqueEndpointsToggle') === "true",
  });

  const [choosingTab, setChoosingTab] = React.useState<Tabs>(Tabs.DEFAULT);
  const [dashboardNumPackets, setDasboardNumPackets] = React.useState(0);

  React.useEffect(() => {
    if (page === 'censors') {
      setChoosingTab(Tabs.CENSORS);
    } else if (page === 'logger') {
      setChoosingTab(Tabs.LOGGER);
    } else if (page === 'scan_runs') {
      setChoosingTab(Tabs.SCAN_RUNS);
    }
    else {
      setChoosingTab(Tabs.DEFAULT);
    }
  }, [project, page]);

  return (
    <LoggerContext.Provider value={project}>
      <LoggerDashboardContext.Provider value={dashboardNumPackets}>
        <AppHeader choosingTab={choosingTab} />

        {choosingTab === Tabs.LOGGER &&
          <React.Fragment>
            <LoggerDashboard
              dashboardNumPackets={dashboardNumPackets}
              setDasboardNumPackets={setDasboardNumPackets}
              applyingFilter={applyingFilter}
            />
            <Logger
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

        {choosingTab === Tabs.SCAN_RUNS &&
          <Box
            mt="var(--component-distance)"
            w="var(--component-width)"
            mx="auto"
          >
            <ScanRunsPage />
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
      </LoggerDashboardContext.Provider>
    </LoggerContext.Provider>
  );
}

export default AppPage;
