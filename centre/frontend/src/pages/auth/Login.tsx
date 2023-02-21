import { Box, FormControl, FormLabel, Grid, Image, Input, Link, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { login } from "src/libs/apis/auth";
import { INSTRUCTION_SHADELESS } from "src/libs/apis/types";
import { useLocation } from "wouter";
import SubmitButton from "../common/submit-button";

export default function Login() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [location, setLocation] = useLocation();
  if (location !== '/login') setLocation('/login');

  async function submit() {
    setIsSubmitting(true);
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const resp = await login(username, password);
    setIsSubmitting(false);
    if (resp.statusCode === 200) {
      const jwt = resp.data;
      localStorage.setItem('authorization', jwt);
      window.location.href = '/';
    } else {
      setError(resp.error);
      setTimeout(() => {setError('')}, 4000);
    }
  }
  return (
    <Grid
      height="100vh"
      gridTemplateColumns="1fr 1fr"
    >
      <Box bg="custom.black">
        <Image
          w="150px"
          h="150px"
          src="/icon.png"
          mx="auto"
          bg="custom.focus-primary"
          borderRadius="10em"
          mt="20vh"
        ></Image>
        <Text
          textAlign="center"
          as="h1"
          fontSize="7xl"
          fontWeight="bold"
          color="custom.focus-primary"
        >
          Shadeless
        </Text>
        <Text
          textAlign="center"
          as="h2"
          mt="-40px"
          fontSize="7xl"
          fontWeight="bold"
          color="custom.focus-primary"
          opacity=".1"
        >
          Shadeless
        </Text>
      </Box>
      <Box bg="custom.white">
        <Box
          p="2%"
          borderRadius="7px"
          mx="auto"
          w="60%"
          minW="400px"
          mt="30vh"
        >
          <FormControl>
            <FormLabel
              fontSize="md"
              fontWeight="600"
            >
              Username&nbsp;
              <Tooltip placement="top" fontSize="2xs" label="Required"><Text as="span" color="red.600">*</Text></Tooltip>
            </FormLabel>
            <Input
              bg="custom.white"
              id="username"
              size="md"
              mt="-3px"
              fontSize="sm"
              placeholder="admin"
              _placeholder={{opacity: '0.6'}}
            />
            <FormLabel
              mt="17px"
              fontSize="md"
              fontWeight="600"
            >
              Password&nbsp;
              <Tooltip placement="top" fontSize="2xs" label="Required"><Text as="span" color="red.600">*</Text></Tooltip>
            </FormLabel>
            <Input
              type="password"
              bg="custom.white"
              id="password"
              size="md"
              mt="-3px"
              fontSize="sm"
              placeholder="***********"
              onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('login-btn')?.click() }}
            />

            {error !== '' &&
              <Text
                color="red.500"
                fontWeight="bold"
                mt="10px"
              >
                {error}
              </Text>
            }
            <SubmitButton
              id="login-btn"
              mt="15px"
              isSubmitting={isSubmitting}
              onClick={submit}
              w="100%"
              submittingText="Logging in"
              mb="10px"
            >
              Login
            </SubmitButton>

            <Link
              color="custom.primary"
              fontWeight="600"
              fontSize="md"
              href={INSTRUCTION_SHADELESS}
              rel="noopener noreferer"
            >
              Learn more about Shadeless &gt;&gt;&gt;
            </Link>
          </FormControl>
        </Box>
      </Box>
    </Grid>
  );
}
