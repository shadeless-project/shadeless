/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, useLocation, Switch } from 'wouter';

import AppPage from 'src/pages/MainApp/App';
import SettingPage from 'src/pages/Setting';

import Footer from 'src/pages/common/footer';
import storage from 'src/libs/storage';
import Page404 from './Page404';
import { notify } from 'src/libs/notify';
import { Box, Progress, Text, useToast } from '@chakra-ui/react';
import CensorPage from './censor/Censor';
import { getAllProjects } from 'src/libs/apis/projects';
import Navbar from './common/navbar';
import AccountPage from './accounts/Accounts';

function Routes () {
  const setLocation = useLocation()[1];

  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentProject, setCurrentProject] = React.useState('');

  React.useEffect(() => {
    const checkHasChosenProject = async () => {
      const resp = await getAllProjects();
      const curProject = storage.getProject() || '';
      setIsLoading(false);
      if (curProject === '' || !resp.data.find(p => curProject === p.name)) {
        setLocation('/setting');
        notify(toast, { statusCode: 404, data: '', error: `Not found project ${storage.getProject()} in database` });
        return;
      }
      setCurrentProject(curProject);
    }
    checkHasChosenProject();
  }, []);

  return (
    <Box
      bg="background.primary-grey"
      pb="10vh"
    >
      {isLoading ?
        <Box
          position="absolute"
          top="40vh"
          left="25%"
          width="50%"
          m="auto"
        >
          <Text
            as="h2"
            fontSize="2xl"
            mb="7px"
            fontWeight="bold"
            textAlign="center"
          >
            Shadeless
          </Text>
          <Progress
            hasStripe
            colorScheme="black"
            isIndeterminate
          />
        </Box>
        :
        <>
          <Navbar />
          <Switch>
            <Route path="/setting">
              <SettingPage />
              <Footer />
            </Route>

            <Route path="/">
              <AppPage project={currentProject} />
              <Footer />
            </Route>
            <Route path="/censor">
              <CensorPage project={currentProject} />
              <Footer />
            </Route>
            <Route path="/accounts">
              <AccountPage />
              <Footer />
            </Route>
            <Route>
              <Page404 />
              <Footer />
            </Route>
          </Switch>
        </>
      }
    </Box>
  );
}

export default Routes;
