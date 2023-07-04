import { Box, Divider, Flex, Grid, Input, InputGroup, InputRightElement, SkeletonText, Spinner, Text, Textarea, Tooltip, useToast } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { notify } from 'src/libs/notify';
import { Search2Icon } from '@chakra-ui/icons';
import { ScanRunDetail, defaultScanRunDetail, getScanRunDetail } from 'src/libs/apis/scanRuns';

type ScanRunLogDetailModal = {
  id: string;
}
export default function ScanRunLogDetailModal(props: ScanRunLogDetailModal) {
  const { id } = props;

  const toast = useToast();

  const [isLoading, setIsLoading] = React.useState(true);
  const [scanRunDetail, setScanRunDetail] = React.useState<ScanRunDetail>(defaultScanRunDetail)
  const [scanLog, setScanLog] = React.useState('');

  async function uiLoadScanRunLog(id: string) {
    setIsLoading(true);

    const resp = await getScanRunDetail(id);
    if (resp.statusCode === 200) {
      setScanRunDetail(resp.data);
    } else {
      notify(toast, resp);
    }

    const respLog = await getScanRunLog(id);

    setIsLoading(false);
  }
  React.useEffect(() => { uiLoadScanRunLog() }, [id]);

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
          Scan runs history {isLoading ? <Spinner ml="10px" /> : <Text as="span">({scanRuns.length})</Text>}
        </Text>
      </Flex>
      <Divider />
      <Grid gridTemplateColumns="1fr 1fr">
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
                _hover={{"bg": "custom.hover-grey"}}
                fontSize="xs"
                bg={urlSigId === sig ? 'custom.grey' : 'inherit'}
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
      </Grid>
    </Box>
  );
}
