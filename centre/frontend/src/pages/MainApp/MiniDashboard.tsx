import { Box, Button, Grid, SkeletonText, Stat, StatLabel, StatNumber, Text, Tooltip, useToast } from "@chakra-ui/react";
import React from "react";
import { DashboardAdditionalDataType, DashboardPackets, defaultDashboardPacket, getDashboardAdditionalData, getDashboardPackets, getPackets } from "src/libs/apis/packets";
import { notify } from "src/libs/notify";
import { Query2ObjectResult } from "src/libs/query.parser";
import storage from 'src/libs/storage';

type MiniDashboardProps = {
  currentProject: string;
  applyingFilter: Query2ObjectResult;
};
export default function MiniDashboard (props: MiniDashboardProps) {
  const {
    applyingFilter,
    currentProject,
  } = props;

  const toast = useToast();

  const [dashboardData, setDashboardData] = React.useState<DashboardPackets>(defaultDashboardPacket);
  const [isLoading, setIsLoading] = React.useState(true);

  async function getMostAndLeastPackets(numLeast: number, numMost: number) {
    const applyFilterMin = JSON.parse(JSON.stringify(applyingFilter));
    applyFilterMin.queryDistinct = true;
    applyFilterMin.criteria.count = numLeast;
    const respMin = getPackets(
      currentProject,
      applyFilterMin,
      0, 50, true,
    );

    const applyFilterMax = JSON.parse(JSON.stringify(applyingFilter));
    applyFilterMax.queryDistinct = true;
    applyFilterMax.criteria.count = numMost;
    const respMost = getPackets(currentProject, applyFilterMax, 0, 999999999, true);

    const result = await Promise.all([
      respMin,
      respMost,
    ]);
    return result.map(r => r.data);
  }

  React.useEffect(() => {
    async function getDashboardInfo() {
      setIsLoading(true);
      setDashboardData(defaultDashboardPacket);
      const resp = await getDashboardPackets(storage.getProject(), applyingFilter);
      if (resp.statusCode === 200) {
        if (resp.data.packetMin === null && resp.data.packetMost === null) {
          const results = await Promise.all([
            getMostAndLeastPackets(
              resp.data.numLeastAppeared,
              resp.data.numMostAppeared,
            ),
            getDashboardAdditionalData(storage.getProject(), {
              ...applyingFilter,
              type: DashboardAdditionalDataType.NUM_PACKETS
            }),
            getDashboardAdditionalData(storage.getProject(), {
              ...applyingFilter,
              type: DashboardAdditionalDataType.ORIGINS
            }),
            getDashboardAdditionalData(storage.getProject(), {
              ...applyingFilter,
              type: DashboardAdditionalDataType.UNIQUE_ENDPOINTS
            })
          ]);
          resp.data.packetMin = results[0][0];
          resp.data.packetMost = results[0][1];
          resp.data.numPackets = results[1].data as number;
          resp.data.origins = results[2].data as string[];
          resp.data.uniqueEndpoints = results[3].data as number;
        }
        setDashboardData(resp.data);
        setIsLoading(false);
      } else notify(toast, resp);
    }
    getDashboardInfo();
  }, [applyingFilter]);

  function clickCopyOrigins() {
    function copyToClipboard(s: string, message: string) {
      const el = document.createElement('textarea');
      el.value = s;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      notify(toast, { statusCode: 200, data: message, error: '' });
    }
    copyToClipboard(dashboardData.origins.join(','), 'Copied matched origins');
  }
  return (
    <Box width="95%" mx="auto" mt="2vh">
      <Grid gridTemplateColumns={{base:"1fr", lg: "1fr 1fr"}} gridGap="10px">

        <Grid gridTemplateColumns="1fr 1fr 1fr" gridGap="10px">
          <Stat
            bg="background.primary-white"
            p="5px"
            pl="10px"
            boxShadow="sm"
            borderRadius="3px"
          >
            <StatLabel
              fontSize="sm"
              opacity='.5'
            >
              Filtered origins
            </StatLabel>
            {!isLoading &&
              <Box>
                <StatNumber
                  fontSize="md"
                  ml="2px"
                >
                  {dashboardData.origins.length}/{dashboardData.numAllOrigins} <Text fontSize="xs" opacity='.5' as="span">records</Text>
                </StatNumber>
                <Tooltip fontSize="2xs" placement="top" label="Copy to clipboard all origins">
                  <Button
                    position="absolute"
                    top="0"
                    right="0"
                    height="100%"
                    width="1vw"
                    borderRadius="0"
                    colorScheme="blackAlpha"
                    onClick={clickCopyOrigins}
                  ></Button>
                </Tooltip>
              </Box>
            }
            <SkeletonText display={isLoading ? 'block' : 'none'} noOfLines={2} mt="8px" />
          </Stat>

          <Stat
            bg="background.primary-white"
            p="5px"
            pl="10px"
            boxShadow="sm"
            borderRadius="3px"
          >
            <StatLabel
              fontSize="sm"
              opacity='.5'
            >
              Filtered packets
            </StatLabel>
            {!isLoading &&
              <StatNumber
                fontSize="md"
                ml="2px"
              >
                {dashboardData.numPackets}/{dashboardData.numAllPackets} <Text fontSize="xs" opacity='.5' as="span">records</Text>
              </StatNumber>
            }
            <SkeletonText display={isLoading ? 'block' : 'none'} noOfLines={2} mt="8px" />
          </Stat>

          <Stat
            bg="background.primary-white"
            p="5px"
            pl="10px"
            boxShadow="sm"
            borderRadius="3px"
          >
            <StatLabel
              fontSize="sm"
              opacity='.5'
            >
              Unique endpoints
            </StatLabel>
            {!isLoading &&
              <StatNumber
                fontSize="md"
                ml="2px"
              >
                {dashboardData.uniqueEndpoints} <Text fontSize="xs" opacity='.5' as="span">records</Text>
              </StatNumber>
            }
            <SkeletonText display={isLoading ? 'block' : 'none'} noOfLines={2} mt="8px" />
          </Stat>
        </Grid>

        <Grid gridTemplateColumns="1fr 1fr" gridGap="10px">
          <Stat
            bg="background.primary-white"
            overflow="auto"
            p="5px"
            pl="10px"
            pb="10px"
            boxShadow="sm"
            borderRadius="3px"
          >
            <StatLabel
              fontSize="sm"
              opacity='.5'
            >
              Most repetitive endpoint&nbsp;
              {dashboardData !== null && dashboardData.packetMost?.length != 0 && <Text as="span" fontSize="xs" opacity="1">({(dashboardData.packetMost as any)[0].count} times)</Text>}
            </StatLabel>
            <StatNumber
              fontSize="md"
              ml="2px"
              maxHeight="50px"
            >
              <Text
                as="span"
                fontSize="xs"
                whiteSpace='pre-wrap'
                wordBreak="break-word"
              >
                {dashboardData !== null && dashboardData.packetMost?.map(p =>
                  <Text
                    color="black"
                    key={`dashboard-id-max-${p._id}`}
                    _hover={{ textDecor: 'underline' }}
                  >
                    <a rel="noopener noreferrer" href={`${p.origin}${p.path}`}>{p.origin}{p.path}</a>
                  </Text>
                )}
              </Text>
            </StatNumber>
            <SkeletonText display={isLoading ? 'block' : 'none'} noOfLines={2} mt="8px" />
          </Stat>

          <Stat
            bg="background.primary-white"
            p="5px"
            pl="10px"
            overflowY="auto"
            boxShadow="sm"
            borderRadius="3px"
          >
            <StatLabel
              fontSize="sm"
              opacity='.5'
            >
              Least repetitive endpoint&nbsp;
              {dashboardData.packetMin !== null && dashboardData.packetMin.length != 0 && <Text as="span" fontSize="xs" opacity="1">({(dashboardData.packetMin[0] as any).count} times) (max 50 only) </Text>}
            </StatLabel>
            <StatNumber
              fontSize="md"
              ml="2px"
              maxHeight="50px"
            >
              <Text
                as="span"
                fontSize="xs"
                whiteSpace='pre-wrap'
                wordBreak="break-word"
              >
                {dashboardData.packetMin !== null && dashboardData.packetMin.map(p =>
                  <Text
                    color="black"
                    key={`dashboard-id-min-${p._id}`}
                    _hover={{ textDecor: 'underline' }}
                  >
                    <a rel="noopener noreferrer" href={`${p.origin}${p.path}`}>{p.origin}{p.path}</a>
                  </Text>
                )}
              </Text>
            </StatNumber>
            <SkeletonText display={isLoading ? 'block' : 'none'} noOfLines={2} mt="8px" />
          </Stat>
        </Grid>
      </Grid>
    </Box>
  )
}
