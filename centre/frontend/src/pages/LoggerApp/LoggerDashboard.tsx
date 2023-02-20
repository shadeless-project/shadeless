import { Box, Button, Grid, SkeletonText, Spinner, Stat, StatLabel, StatNumber, Text, Tooltip, useToast } from "@chakra-ui/react";
import React, { useContext } from "react";
import { DashboardAdditionalDataType, DashboardPackets, defaultDashboardPacket, getDashboardAdditionalData, getDashboardPackets, getPackets, Packet } from "src/libs/apis/packets";
import { notify } from "src/libs/notify";
import { Query2ObjectResult } from "src/libs/query.parser";
import storage from 'src/libs/storage';
import { LoggerContext } from "./LoggerAppContext";

type LoggerDashboardProps = {
  applyingFilter: Query2ObjectResult;
};
export default function LoggerDashboard (props: LoggerDashboardProps) {
  const { applyingFilter } = props;
  const currentProject = useContext(LoggerContext);

  const toast = useToast();

  const [dashboardData, setDashboardData] = React.useState<DashboardPackets>(defaultDashboardPacket);
  const [isLoading, setIsLoading] = React.useState(true);

  const [isOriginsLoading, setIsOriginsLoading] = React.useState(true);
  const [dashboardOrigins, setDasboardOrigins] = React.useState<string[]>([]);

  const [isNumPacketsLoading, setIsNumPacketsLoading] = React.useState(true);
  const [dashboardNumPackets, setDasboardNumPackets] = React.useState(0);

  const [isUniqueEndpointsLoading, setIsUniqueEndpointsLoading] = React.useState(true);
  const [dashboardUniqueEndpoints, setDashboardUniqueEndpoints] = React.useState(0);

  const [isMostLeastPacketsLoading, setIsMostLeastPacketsLoading] = React.useState(true);
  const [mostLeastPackets, setMostLeastPackets] = React.useState<{ most: Packet[], least: Packet[] }>({
    most: [],
    least: [],
  });

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
      setIsOriginsLoading(true);
      setIsNumPacketsLoading(true);
      setIsUniqueEndpointsLoading(true);
      setIsMostLeastPacketsLoading(true);
      setIsLoading(true);
      setDashboardData(defaultDashboardPacket);
      const resp = await getDashboardPackets(storage.getProject(), applyingFilter);
      if (resp.statusCode === 200) {
        if (resp.data.origins === null) {
          getDashboardAdditionalData(storage.getProject(), {
            ...applyingFilter,
            type: DashboardAdditionalDataType.ORIGINS
          }).then(resp => {
            setIsOriginsLoading(false);
            setDasboardOrigins(resp.data);
          });
        } else {
          setIsOriginsLoading(false);
          setDasboardOrigins(resp.data.origins);
        }
        if (resp.data.numPackets === null) {
          getDashboardAdditionalData(storage.getProject(), {
            ...applyingFilter,
            type: DashboardAdditionalDataType.NUM_PACKETS
          }).then(resp => {
            setIsNumPacketsLoading(false);
            setDasboardNumPackets(resp.data);
          });
        } else {
          setIsNumPacketsLoading(false);
          setDasboardNumPackets(resp.data.numPackets);
        }
        if (resp.data.uniqueEndpoints === null) {
          getDashboardAdditionalData(storage.getProject(), {
            ...applyingFilter,
            type: DashboardAdditionalDataType.UNIQUE_ENDPOINTS
          }).then(resp => {
            setIsUniqueEndpointsLoading(false);
            setDashboardUniqueEndpoints(resp.data);
          });
        } else {
          setIsUniqueEndpointsLoading(false);
          setDashboardUniqueEndpoints(resp.data.uniqueEndpoints as number);
        }
        if (resp.data.packetMin === null && resp.data.packetMost === null) {
          getMostAndLeastPackets(
            resp.data.numLeastAppeared,
            resp.data.numMostAppeared,
          ).then(resp => {
            setIsMostLeastPacketsLoading(false);
            setMostLeastPackets({
              least: resp[0],
              most: resp[1],
            })
          });
        } else {
          setIsMostLeastPacketsLoading(false);
          setMostLeastPackets({
            least: resp.data.packetMin as Packet[],
            most: resp.data.packetMost as Packet[],
          })
        }
        setIsLoading(false);
        setDashboardData(resp.data);
      } else notify(toast, resp);
    }
    getDashboardInfo();
  }, [applyingFilter]);

  function clickCopyOrigins() {
    window.copyToClipboard(dashboardOrigins.join(',')); 
    notify(toast, { statusCode: 200, data: 'Copied matched origins', error: '' });
  }
  return (
    <Box 
      width="var(--component-width)" 
      mx="auto" 
      mt="1vh"
    >
      <Grid gridTemplateColumns={{base:"1fr", lg: "1fr 1fr"}} gridGap="10px">

        <Grid gridTemplateColumns="1fr 1fr 1fr" gridGap="10px">
          <Stat
            bg="custom.white"
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
            <Box>
              <StatNumber
                fontSize="md"
                ml="2px"
              >
                <Text as="span">
                  {isOriginsLoading ? <Spinner w="13px" h="13px" /> :
                    dashboardOrigins.length
                  }
                </Text>
                /
                <Text as="span">
                  {isLoading ? <Spinner w="13px" h="13px" /> :
                    dashboardData.numAllOrigins
                  }
                </Text>
                <Text fontSize="xs" opacity='.5' as="span">&nbsp;records</Text>
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
          </Stat>

          <Stat
            bg="custom.white"
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
            <StatNumber
              fontSize="md"
              ml="2px"
            >
              <Text as="span">
                {isNumPacketsLoading ? <Spinner w="13px" h="13px" /> :
                  dashboardNumPackets
                }
              </Text>
              /
              <Text as="span">
                {isLoading ? <Spinner w="13px" h="13px" /> :
                  dashboardData.numAllPackets
                }
              </Text>
              <Text as="span" fontSize="xs" opacity='.5'>&nbsp;records</Text>
            </StatNumber>
          </Stat>

          <Stat
            bg="custom.white"
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
            <StatNumber
              fontSize="md"
              ml="2px"
            >
              <Text as="span">
                {isUniqueEndpointsLoading ? <Spinner w="13px" h="13px" /> :
                  dashboardUniqueEndpoints
                }
              </Text>
              <Text fontSize="xs" opacity='.5' as="span">&nbsp;records</Text>
            </StatNumber>
          </Stat>
        </Grid>

        <Grid gridTemplateColumns="1fr 1fr" gridGap="10px">
          <Stat
            bg="custom.white"
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
              <Text as="span" fontSize="xs" opacity="1">
                ({isMostLeastPacketsLoading ? <Spinner w="13px" h="13px"/>:(mostLeastPackets.most as any)[0]?.count || 0} times)
              </Text>
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
                {!isMostLeastPacketsLoading && mostLeastPackets.most.map(p =>
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
            <SkeletonText display={isMostLeastPacketsLoading ? 'block' : 'none'} noOfLines={2} mt="8px" />
          </Stat>

          <Stat
            bg="custom.white"
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
              <Text as="span" fontSize="xs" opacity="1">
                ({isMostLeastPacketsLoading ? <Spinner w="13px" h="13px"/>:(mostLeastPackets.least as any)[0]?.count || 0} times) (max 50 only)
              </Text>
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
                {!isMostLeastPacketsLoading && mostLeastPackets.least.map(p =>
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
            <SkeletonText display={isMostLeastPacketsLoading ? 'block' : 'none'} noOfLines={2} mt="8px" />
          </Stat>
        </Grid>
      </Grid>
    </Box>
  )
}
