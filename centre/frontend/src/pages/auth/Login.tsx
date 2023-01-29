import { Box, Button, FormControl, FormLabel, Image, Input, Link, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { login } from "src/libs/apis/auth";
import { INSTRUCTION_EXT_URL } from "src/libs/apis/types";
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
    <Box 
      display="grid"
      height="100vh"
      gridTemplateColumns="1fr 1fr"
    >
      <Box 
        bg="rgb(20,20,20)"
      >
        <Image 
          w="150px" 
          h="150px" 
          src="/icon.png"
          mx="auto"
          bg="grey"
          borderRadius="10em"
          mt="16vh"
        ></Image>
        <Text
          textAlign="center"
          as="h1"
          fontSize="7xl"
          fontWeight="bold"
          color="white"
        >
          Shadeless
        </Text>
        <Text
          textAlign="center"
          as="h2"
          mt="-40px"
          fontSize="7xl"
          fontWeight="bold"
        >
          Shadeless
        </Text>
      </Box>
      <Box
        bg="background.primary-white !important"
      >
        <Box
        p="2%"
        borderRadius="7px"
        mx="auto"
        w="60%"
        minW="400px"
        mt="30vh"
      >
        <FormControl>
          <FormLabel fontSize="sm">Username&nbsp;
            <Tooltip placement="top" fontSize="2xs" label="Required"><Text as="span" color="red.600">*</Text></Tooltip>
          </FormLabel>
          <Input 
            id="username" 
            size="md" 
            mt="-3px"
            fontSize="xs"
            placeholder="admin"
            _placeholder={{opacity: '0.6'}} 
          />
          <FormLabel mt="17px" fontSize="sm">
            Password&nbsp;
            <Tooltip placement="top" fontSize="2xs" label="Required"><Text as="span" color="red.600">*</Text></Tooltip>
          </FormLabel>
          <Input
            id="password"
            type="password"
            mt="-3px"
            size="md"
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
            bg="black"
            color="white"
            isSubmitting={isSubmitting}
            onClick={submit}
            _hover={{opacity: '.6'}}
            w="100%"
            submittingText="Logging in"
            mb="10px"
          >
            Login
          </SubmitButton>

          <Link 
            color="blue"
            fontSize="sm"
            href={INSTRUCTION_EXT_URL}
            rel="noopener noreferer"
          >
            Learn more about Shadeless &gt;&gt;&gt;
          </Link>
        </FormControl>
      </Box>
      </Box>
    </Box>
  );
}
