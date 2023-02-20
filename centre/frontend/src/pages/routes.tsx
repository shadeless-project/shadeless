import React from 'react';
import { Route, useLocation, Switch } from 'wouter';

import AppPage from 'src/pages/LoggerApp/App';
import ProjectsPage from 'src/pages/projects/ProjectsPage';

import Page404 from './Page404';
import { Box, Link, Text } from '@chakra-ui/react';
import Navbar from './common/navbar';
import SettingPage from './setting/SettingPage';
import CensorPage from './censor/Censor';
import AccountPage from './accounts/Accounts';

function Routes () {
  const [location, setLocation] = useLocation();
  const [myLocation, setMyLocation] = React.useState<string[]>([]);

  React.useEffect(() => {
    const myLocation = location.split('/').filter(v => v !== '');
    setMyLocation(myLocation);
  }, [location]);

  return (
    <Box
      bg="custom.grey"
      pb="10vh"
    >
      <Navbar />
      <Box
        fontSize="sm"
        mx="auto"
        width="var(--component-width)"
        mt="var(--component-distance)"
      >
        /&nbsp;
        <Link color="custom.primary" href={"/" + myLocation[0]}>
          {myLocation[0]}
        </Link>
        {myLocation.length > 1 &&
          <Box display="inline">
            &nbsp;/&nbsp;
            <Text as="span">
              {myLocation[1]}
            </Text>
          </Box>
        }
      </Box>

      <Switch>
        <Route path="/projects/:name">
          {(params) => <AppPage project={params.name} />}
        </Route>
        <Route path="/:pageType">
          {(params) => {
            switch (params.pageType) {
              case 'projects':
                return <SettingPage body={<ProjectsPage />}/>
              case 'censors':
                return <SettingPage body={<CensorPage />}/>
              case 'censors':
                return <SettingPage body={<AccountPage />}/>
            }
            return <SettingPage body={<Page404 />} />
          }}
        </Route>
        <Route>
          <Page404 />
        </Route>
      </Switch>
    </Box>
  );
}

export default Routes;
