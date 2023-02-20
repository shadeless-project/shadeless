import { Box, Button, Grid, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'wouter';

type ButtonNavigationProps = {
  children: string;
}
function ButtonNavigation({ children }: ButtonNavigationProps) {
  return (
    <Link href={'/' + children.toLowerCase()}>
      <Text
        fontSize="md"
        w="100%"
        px="20px"
        py="5px"
        cursor="pointer"
        _hover={{"bg": "custom.hover-grey"}}
        borderColor="custom.primary"
        borderLeftWidth={location.pathname.slice(1) === children.toLowerCase() ? "2.5px" : ""}
      >
        {children}
      </Text>
    </Link>
  );
}

type SettingPageProps = {
  body: JSX.Element;
}
export default function SettingPage ({ body }: SettingPageProps) {
  return (
    <Grid
      mt="var(--component-distance)"
      gridTemplateColumns="auto 85%"
      gridAutoRows="100%"
      width="var(--component-width)"
      mx="auto"
      gap="20px"
    >
      <Box
        bg="custom.white"
        alignSelf="start"
        borderRadius="var(--component-border)"
        padding="15px"
      >
        <ButtonNavigation>Projects</ButtonNavigation>
        <ButtonNavigation>Censors</ButtonNavigation>
        <ButtonNavigation>Accounts</ButtonNavigation>
      </Box>
      {body}
    </Grid>
  );
}
