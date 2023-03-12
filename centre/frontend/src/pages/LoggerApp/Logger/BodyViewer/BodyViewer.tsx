import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Grid, Text, Tooltip, useToast } from "@chakra-ui/react";
import React, { useContext } from "react";
import { getFileContentFromId } from "src/libs/apis/files";
import { Packet } from "src/libs/apis/packets";
import { notify } from "src/libs/notify";
import HalfPacket from "./packet-body-detail";
import UtilityButton from "./utility-btn";
import { ParserError } from "src/libs/query.parser";
import { LoggerContext } from "../../LoggerAppContext";
import MyTooltip from "src/pages/common/tooltip";
import { useLocation } from "wouter";

type PacketDetailProps = {
  setIsShowingDetail: React.Dispatch<React.SetStateAction<boolean>>;
  packet: Packet;
  setFilter: React.Dispatch<React.SetStateAction<{
    before: string;
    now: string;
  }>>;
}
export default function BodyViewer(props: PacketDetailProps) {
  const { setIsShowingDetail, packet, setFilter } = props;
  const currentProject = useContext(LoggerContext);

  const toast = useToast();
  const setLocation = useLocation()[1];

  const storageHeight = localStorage.getItem('detailHeight') || '45';
  const [choosingHeight, setChoosingHeight] = React.useState(storageHeight);
  const [showChooseHeight, setShowChooseHeight] = React.useState(false);

  const supportedHeight = ['45', '55', '65', '80'];
  const heightLeft = supportedHeight.filter(h => h !== choosingHeight);

  function changeHeight(h: string) {
    localStorage.setItem('detailHeight', h);
    setChoosingHeight(h);
    setShowChooseHeight(false);
  }

  function notifyCopyClipboard(s: string, message: string) {
    window.copyToClipboard(s);
    notify(toast, { statusCode: 200, data: message, error: '' });
  }

  async function timeTravel(packet: Packet) {
    notify(toast, { statusCode: 200, data: `Applying time travel query on ${packet.requestPacketId}`, error: '' });
    location.hash = `#${packet.requestPacketId}`;
    try {
      const query = `requestPacketPrefix == "${packet.requestPacketPrefix}" and requestPacketIndex >= ${packet.requestPacketIndex - 20} and requestPacketIndex <= ${packet.requestPacketIndex + 20}`;
      setFilter({ now: query, before: '' });
      await window.sleep(300);
      document.getElementById('apply-filter-btn')?.click();
    } catch (err) {
      const e = err as ParserError;
      notify(toast, { statusCode: 500, data: '', error: `${e.type}: ${e.message}` }, 'filter-error');
    }
  }

  const [isLoading, setIsLoading] = React.useState(true);
  const [errRequest, setErrRequest] = React.useState<string>('');
  const [errResponse, setErrResponse] = React.useState<string>('');
  const [requestBody, setRequestBody] = React.useState<string>('');
  const [responseBody, setResponseBody] = React.useState<string>('');

  React.useEffect(() => {
    const getBodies = async () => {
      const [reqBody, errReq] = await getFileContentFromId(currentProject, packet.requestBodyHash);
      const [resBody, errRes] = await getFileContentFromId(currentProject, packet.responseBodyHash);
      setRequestBody(reqBody);
      if (errReq) setErrRequest(errReq.message);
      else setErrRequest('');
      setResponseBody(resBody);
      if (errRes) setErrResponse(errRes.message);
      else setErrResponse('');
      setIsLoading(false);
    };
    setIsLoading(true);
    setErrRequest('');
    setErrResponse('');
    setRequestBody('');
    setResponseBody('');
    getBodies();
  }, [packet]);

  const [contentRequest, setContentRequest] = React.useState('');
  const [contentResponse, setContentResponse] = React.useState('');

  React.useEffect(() => {
    const req = packet.requestHeaders.reduce((prev, cur) => prev + cur + '\r\n', '');
    const res = packet.responseHeaders.reduce((prev, cur) => prev + cur + '\r\n', '');
    const reqBody = (requestBody !== null) ? requestBody : '';
    const resBody = (responseBody !== null) ? responseBody : '';
    setContentRequest(req + '\r\n' + reqBody);
    setContentResponse(res + '\r\n' + resBody);
  }, [packet, requestBody, responseBody]);


  return (
    <Box
      maxHeight={`${choosingHeight}vh`}
      bg="custom.white"
      color="custom.black"
      position="fixed"
      bottom="0"
      left="0"
      zIndex="10"
      width="100%"
    >
      <Flex
        w="100%"
        bg="custom.focus-primary"
        borderColor="custom.black"
        borderTopWidth="1px"
        alignItems="center"
        px="1%"
        py="2px"
      >
        <Text fontWeight="500" fontSize="2xs" mr="10px">
          <Text cursor="default" as="span">| <MyTooltip label="Contributor">{packet.codeName}</MyTooltip> | <MyTooltip label="PacketID">{packet.requestPacketId}</MyTooltip> |</Text>
        </Text>

        <UtilityButton
          tooltip="Copy URL"
          bg="red.200"
          onClick={
            () => notifyCopyClipboard(
              `${packet.origin}${packet.path}${packet.querystring !== null ? `?${packet.querystring}` : ''}`,
              'Copied URL',
            )
          }
        >
          URL
        </UtilityButton>
        <UtilityButton
          tooltip="Copy full request"
          bg="purple.200"
          onClick={() => notifyCopyClipboard(contentRequest, 'Copied full request')}
        >
          Req
        </UtilityButton>
        <UtilityButton
          tooltip="Copy full response"
          bg="gray.100"
          onClick={() => notifyCopyClipboard(contentResponse, 'Copied full response')}
        >
          Res
        </UtilityButton>
        <UtilityButton
          tooltip="Time travel"
          bg="gray.400"
          fontSize="xs"
          onClick={() => timeTravel(packet)}
        >
          ⏱️
        </UtilityButton>

        <Box ml="auto" color="black" fontSize="2xs">
          <UtilityButton
            tooltip="Censor this packet"
            bg="gray.100"
            fontSize="xs"
            onClick={() => window.location.replace(`/projects/${currentProject}/censors?censorMethod=${packet.method}&censorOrigin=${packet.origin}&censorPath=${packet.path}`)}
          >
            🕶️
          </UtilityButton>
          <Button
            fontSize="2xs"
            size="xs"
            bg="inherit"
            borderRadius="0"
            mb="1px"
            _hover={{
              "opacity": ".5"
            }}
            onClick={() => setShowChooseHeight(!showChooseHeight)}
          >
            {choosingHeight}%
          </Button>
          <Box bg="white" position="absolute" display={showChooseHeight ? 'block' : 'none'}>
            {heightLeft.map(h =>
              <Box
                boxShadow="sm"
                p="5px"
                w="35px"
                border="1px solid black"
                borderTop="none"
                cursor="pointer"
                key={`height-${h}`}
                onClick={() => changeHeight(h)}
              >
                {h}%
              </Box>
            )}
          </Box>
          <Button
            id="packet-detail-close-btn"
            bg="inherit"
            size="xs"
            fontSize="md"
            _hover={{
              "opacity": ".3"
            }}
            onClick={() => setIsShowingDetail(false)}
            borderRadius={0}
          >
            <ChevronDownIcon />
          </Button>
        </Box>
      </Flex>
      <Box
        boxShadow="sm"
        maxHeight={`${choosingHeight}vh`}
        fontSize="2xs"
        borderTop="1px solid black"
      >
        <Grid gridTemplateColumns="1fr 1fr">
          <HalfPacket
            maxHeight={`${choosingHeight}vh`}
            error={errRequest}
            isLoading={isLoading}
            content={contentRequest}
            reflected={packet.reflectedParameters}
          />
          <HalfPacket
            maxHeight={`${choosingHeight}vh`}
            error={errResponse}
            isLoading={isLoading}
            content={contentResponse}
            reflected={packet.reflectedParameters}
          />
        </Grid>
      </Box>
    </Box>
  )
}
