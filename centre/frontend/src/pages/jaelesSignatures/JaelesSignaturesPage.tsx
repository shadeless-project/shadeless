import { Box, Button, Divider, Flex, Grid, Input, InputGroup, InputLeftElement, InputRightElement, SkeletonText, Spinner, Text, Textarea, Tooltip, useToast } from '@chakra-ui/react';
import React from 'react';
import { notify } from 'src/libs/notify';
import { getAllSignatures, getOneSignature } from 'src/libs/apis/jaeles';
import { useLocation } from 'wouter';
import { QuestionIcon, Search2Icon } from '@chakra-ui/icons';

export default function JaelesSignaturesPage() {
  const toast = useToast();

  const urlSigId = new URLSearchParams(window.location.search).get('sig');

  const setLocation = useLocation()[1];
  const [signatures, setSignatures] = React.useState<string[]>([]);
  const [showingSignatures, setShowingSignatures] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [isLoadingSigFile, setIsLoadingSigFile] = React.useState(false);
  const [sig, setSig] = React.useState('');

  async function uiLoadSignatures() {
    setIsLoading(true);
    const resp = await getAllSignatures();
    setIsLoading(false);
    if (resp.statusCode === 200) {
      setSignatures(resp.data);
    } else {
      notify(toast, resp);
    }
  }
  async function uiLoadOneSignature(fileName: string) {
    setIsLoadingSigFile(true);
    const resp = await getOneSignature(fileName);
    if (resp.statusCode === 200) {
      setSig(resp.data);
    } else {
      setSig('ERROR! ' + resp.error);
    }
    setIsLoadingSigFile(false);
  }
  React.useEffect(() => { uiLoadSignatures() }, []);
  React.useEffect(() => {
    if (urlSigId) uiLoadOneSignature(urlSigId);
  }, [urlSigId]);
  React.useEffect(() => {
    setShowingSignatures(signatures.filter(s => s.toLowerCase().includes(search)));
  }, [search, signatures]);

  return (
    <Box
      p="10px"
      borderRadius="var(--component-border)"
      boxShadow="sm"
      bg="custom.white"
    >
      <Flex
        justifyContent="space-between"
        alignContent="center"
        alignItems="center"
        p="15px"
      >
        <Text
          as="h2"
          fontSize="3xl"
        >
          Jaeles Signatures {isLoading ? <Spinner ml="10px" /> : <Text as="span">({signatures.length})</Text>}
        </Text>
      </Flex>
      <Divider />
      <Grid gridTemplateColumns="0.25fr 1fr">
        <Box padding="10px">
          <InputGroup size="sm">
            <InputRightElement pointerEvents='none'>
              <Search2Icon color='gray.300' />
            </InputRightElement>
            <Input 
              p="14px"
              placeholder='Search ...'
              borderWidth="1px"
              borderBottom="none"
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Box 
            maxHeight="400px" 
            overflow="auto" 
            border="1.3px solid"
            borderColor="custom.grey"
            borderBottom="none"
          >
            {showingSignatures.map(sig =>
              <Text
                cursor="pointer"
                padding="2"
                width="100%"
                key={`signature-${sig}`}
                bg="transparent"
                _hover={{"bg": "custom.grey"}}
                fontSize="xs"
                textDecor={urlSigId === sig ? 'underline' : 'none'}
                onClick={() => setLocation(`?sig=${sig}`)}
              >
                {sig}
              </Text>  
            )}
          </Box>
          <Divider my="10px" />
          <Text p="2" fontSize="2xs" opacity=".7">
            Signatures are hardcoded. If you want to use your own signatures, place those files in /centre/backend/signatures/prod/
          </Text>
        </Box>
        <Box padding="3">
          <SkeletonText display={isLoadingSigFile ? 'block' : 'none'} noOfLines={5} mt="8px" />
          {sig !== "" ? 
            <Textarea
              fontSize="xs"
              bg="custom.grey"
              _hover={{"cursor":"default"}}
              value={sig}
              rows={sig.split('\n').length}
              disabled
            />
          : 
            <Text
              _hover={{"cursor":"default"}}
              color="custom.black"
              textAlign="center"
              mt="10px"
            >
              Choose a signature file to view its content !
            </Text>
          }
          
        </Box>
      </Grid>
    </Box>
  );
}
