import React from 'react';
import { Route, useLocation, Switch, Link } from 'wouter';

import AppPage from 'src/pages/LoggerApp/App';
import ProjectsPage from 'src/pages/projects/ProjectsPage';

import Page404 from './Page404';
import { Box, Text } from '@chakra-ui/react';
import Navbar from './common/navbar';
import SettingPage from './setting/SettingPage';
import CensorPage from './censor/CensorsPage';
import AccountsPage from './accounts/AccountsPage';

function Routes () {
  const [location, setLocation] = useLocation();
  const [myLocation, setMyLocation] = React.useState<string[]>([]);
  const [myLocationHref, setMyLocationHref] = React.useState<string[]>([]);

  React.useEffect(() => {
    const locs = location.split('/').filter(v => v !== '');
    const locsHref = ['/' + locs[0]];
    for (let i = 1; i < locs.length; ++i)
      locsHref.push( locsHref[i-1] + '/' + locs[i]);
    setMyLocation(locs);
    setMyLocationHref(locsHref);
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
        {myLocation.map((loc,idx) =>
          <React.Fragment key={`location-${loc}-${idx}`}>
            &nbsp;/&nbsp;
            <Link href={myLocationHref[idx]}>
              <Text
                cursor="pointer"
                as="span"
                color="custom.primary"
                _hover={{ textDecor: 'underline' }}
              >
                {loc}
              </Text>
            </Link>
          </React.Fragment>
        )}
      </Box>

      <Switch>
        <Route path="/projects/:name">
          {(params) => {
            setLocation(`/projects/${params.name}/logger`);
            return <></>
          }}
        </Route>
        <Route path="/projects/:name/:page">
          {(params) => <AppPage project={params.name} page={params.page} />}
        </Route>
        <Route path="/:pageType">
          {(params) => {
            switch (params.pageType) {
              case 'projects':
                return <SettingPage body={<ProjectsPage />}/>
              case 'censors':
                return <SettingPage body={<CensorPage />}/>
              case 'accounts':
                return <SettingPage body={<AccountsPage />}/>
            }
            return <SettingPage body={<Page404 />} />
          }}
        </Route>
        <Route>
          <Box
            mt="var(--component-distance)"
            w="var(--component-width)"
            mx="auto"
          >
            <Page404 />
          </Box>
        </Route>
      </Switch>
    </Box>
  );
}

export default Routes;
