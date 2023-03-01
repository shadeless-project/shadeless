import { Box, Divider, Grid, Text } from '@chakra-ui/react';
import { SHADELESS_VERSION } from 'src/libs/apis/types';
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
        ml={location.pathname.slice(1) === children.toLowerCase() ? "-2.5px" : ""}
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
      >
        <Box p="15px">
          <ButtonNavigation>Projects</ButtonNavigation>
          <ButtonNavigation>Censors</ButtonNavigation>
          <ButtonNavigation>Accounts</ButtonNavigation>
        </Box>
        <Divider />
        <Box cursor="default" p="15px" fontSize="2xs" opacity=".7">
          Version: {SHADELESS_VERSION}
        </Box>
      </Box>
      {body}
    </Grid>
  );
}
