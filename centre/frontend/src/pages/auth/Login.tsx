import { Box, Button, Flex, FormControl, FormLabel, Grid, Image, Input, Link, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { login } from "src/libs/apis/auth";
import { INSTRUCTION_SHADELESS } from "src/libs/apis/types";
import { useLocation } from "wouter";
import ClosedEyeIcon from "../common/closed-eye-icon";
import EyeIcon from "../common/eye-icon";
import RequiredTooltip from "../common/required-tooltip";
import SubmitButton from "../common/submit-button";

function parseSafeUrl(url: string): string {
  try {
    const u = new URL(url, 'http://localhost/');
    return u.pathname;
  } catch (err) {
    return '/';
  }
}

export default function Login() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [location, setLocation] = useLocation();
  if (location !== '/login') setLocation(`/login?redirect=${location}`);

  async function submit() {
    setIsSubmitting(true);
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const resp = await login(username, password);
    setIsSubmitting(false);
    if (resp.statusCode === 200) {
      const { data } = resp;
      console.log(data);
      localStorage.setItem('account', JSON.stringify(data));
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect') || '';
      alert(redirect);
      window.location.href = parseSafeUrl(redirect);
    } else {
      alert(resp.error);
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
              <RequiredTooltip />
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
              <RequiredTooltip />
            </FormLabel>

            <Input
              type={!showPassword ? "password" : 'text' }
              bg="custom.white"
              id="password"
              size="md"
              mt="-3px"
              fontSize="sm"
              placeholder="***********"
              pr="10%"
              onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('login-btn')?.click() }}
            />
            <Button
              bg="inherit"
              mt="-3px"
              position="absolute"
              zIndex={3}
              right="0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <ClosedEyeIcon /> : <EyeIcon />}
            </Button>

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
