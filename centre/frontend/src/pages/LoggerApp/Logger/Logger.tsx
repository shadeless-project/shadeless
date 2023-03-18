import { Box, Table, Thead, Tbody, Tr, Th, useToast, Td, Progress, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import { getPackets, Packet, defaultPacket } from "src/libs/apis/packets";
import SearchBar from "./SearchBar/SearchBar";
import { notify } from "src/libs/notify";
import { ApiResponse } from "src/libs/apis/types";
import { Query2ObjectResult } from "src/libs/query.parser";
import { LoggerContext } from "../LoggerAppContext";
import MyTooltip from "../../common/tooltip";
import BodyViewer from "./BodyViewer/BodyViewer";
import LoggerOptions from "./logger-options";

export const NUM_PACKETS_PER_PAGE = 30;

type LoggerProps = {
  applyingFilter: Query2ObjectResult;
  setApplyingFilter: React.Dispatch<React.SetStateAction<Query2ObjectResult>>;
}
export default function Logger(props: LoggerProps) {
  const {
    applyingFilter,
    setApplyingFilter,
  } = props;
  const currentProject = useContext(LoggerContext);

  const toast = useToast();
  const urlHash = location.hash.slice(1);
  const [filter, setFilter] = React.useState({
    before: '',
    now: '',
  });
  const [isLoadingPackets, setIsLoadingPackets] = React.useState(true);
  const [endOfPackets, setEndOfPackets] = React.useState(false);
  const [packetInterval, setPacketInterval] = React.useState({
    from: 0,
    to: NUM_PACKETS_PER_PAGE,
  });
  const [placeMouseClick, setPlaceMouseClick] = React.useState({ x: -1, y: -1 });
  const [packets, setPackets] = React.useState<Packet[]>([]);
  const [isShowingDetail, setIsShowingDetail] = React.useState(false);
  const [choosingPacket, setChoosingPacket] = React.useState(defaultPacket);

  const [showConfigColumns, setShowConfigColumns] = React.useState(localStorage.getItem('showConfigColumns') === "true");
  const [showFilterBody, setShowFilterBody] = React.useState<boolean>(localStorage.getItem('showFilterBody') === "true");
  const [uniqueEndpointsToggle, setUniqueEndpointsToggle] = React.useState<boolean>(localStorage.getItem('uniqueEndpointsToggle') === "true");

  function isSmaller(a: Packet, b: Packet): number {
    const d1 = new Date(a.createdAt || 0) as any;
    const d2 = new Date(b.createdAt || 0) as any;
    if (a.codeName !== b.codeName) {
      if (d1 !== d2) return d1 < d2 ? -1 : 1;
      return (a._id || '') < (b._id || '') ? -1 : 1;
    }
    if (Math.abs(d1 - d2) < 30 * 1000) {
      return a.requestPacketIndex < b.requestPacketIndex ? -1 : 1;
    }
    return d1 - d2;
  }
  function mergeArrPackets(arr1: Packet[], arr2: Packet[]) {
    const s = new Set<string>();
    const res: Packet[] = [];
    arr1.forEach(p => {
      if (!s.has(p._id || '')) {
        s.add(p._id || '');
        res.push(p);
      }
    });
    arr2.forEach(p => {
      if (!s.has(p._id || '')) {
        s.add(p._id || '');
        res.push(p);
      }
    });
    return res.sort((a, b) => -isSmaller(a, b));
  }

  async function clickPacket(e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, p: Packet) {
    if (Math.abs(e.pageX - placeMouseClick.x) < 5 && Math.abs(e.pageY - placeMouseClick.y) < 5) {
      setIsShowingDetail(true);
      setChoosingPacket(p);
    }
  }
  async function getFirstPackets() {
    const packets = await getPackets(
      currentProject,
      applyingFilter,
      0,
      NUM_PACKETS_PER_PAGE,
    );
    if (packets.statusCode !== 200) {
      notify(toast, packets as any as ApiResponse<string>, 'get-packet-err-toast');
    } else {
      packets.data.sort((a, b) => -isSmaller(a, b));
      setPackets(packets.data);
      const newFrom = packets.data.length;
      const newTo = newFrom + NUM_PACKETS_PER_PAGE;
      setPacketInterval({ from: newFrom, to: newTo })
      setIsLoadingPackets(false);
    }
  }
  async function getPacketsInInterval(from: number, to: number) {
    const newPacketsResponse = await getPackets(
      currentProject,
      applyingFilter,
      from,
      to - from,
    );
    if (newPacketsResponse.statusCode !== 200) notify(toast, newPacketsResponse as any as ApiResponse<string>, 'get-packet-err-toast');
    else {
      if (newPacketsResponse.data.length === 0) {
        setIsLoadingPackets(false);
        setPacketInterval({ from, to });
        setEndOfPackets(true);
        notify(toast, {
          statusCode: 200,
          error: 'End of packets',
          data: 'End of packets',
        }, 'get-packet-err-toast');
        return;
      }
      const newPackets = mergeArrPackets(packets, newPacketsResponse.data);
      if (newPackets.length !== packets.length) {
        const newFrom = from + newPacketsResponse.data.length;
        const newTo = newFrom + NUM_PACKETS_PER_PAGE;
        setPackets(newPackets);
        setIsLoadingPackets(false);
        setPacketInterval({ from: newFrom, to: newTo })
      } else {
        await getPacketsInInterval(to, to + NUM_PACKETS_PER_PAGE);
      }
    }
  }

  React.useEffect(() => {
    setPackets([]);
    setEndOfPackets(false);
    setIsLoadingPackets(true);
    setPacketInterval({ from: 0, to: NUM_PACKETS_PER_PAGE });
    getFirstPackets();
  }, [applyingFilter, currentProject]);

  React.useEffect(() => {
    async function handleScrollBottomPage() {
      if (endOfPackets) return;
      if (isLoadingPackets) return;
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20) {
        setIsLoadingPackets(true);
        await getPacketsInInterval(packetInterval.from, packetInterval.to);
      }
    };
    window.addEventListener("scroll", handleScrollBottomPage);
    return () => window.removeEventListener("scroll", handleScrollBottomPage);
  }, [isLoadingPackets, packetInterval, applyingFilter, currentProject]);

  return (
    <Box
      mx="auto"
      mt="var(--component-distance)"
      bg="custom.white"
      w="var(--component-width)"
      borderRadius="var(--component-border)"
      p="1em"
    >
      <LoggerOptions
        showFilterBody={showFilterBody}
        setShowFilterBody={setShowFilterBody}
        uniqueEndpointsToggle={uniqueEndpointsToggle}
        setUniqueEndpointsToggle={setUniqueEndpointsToggle}
        showConfigColumns={showConfigColumns}
        setShowConfigColumns={setShowConfigColumns}
      />
      <SearchBar
        filter={filter}
        setFilter={setFilter}
        setApplyingFilter={setApplyingFilter}
        showFilterBody={showFilterBody}
        uniqueEndpointsToggle={uniqueEndpointsToggle}
      />
      <Table
        border="1.3px solid gray"
        borderRadius="10px"
        mt="20px"
        size="xs"
        fontSize="xs"
      >
        <Thead fontSize="2xs">
          <Tr>
            <Th textAlign="center">
              <MyTooltip label="The index correspond with Burpsuite Shadeless log">ID</MyTooltip>
            </Th>
            <Th textAlign="center">
              <MyTooltip label="Number of packets look-alike with this packet">CNT</MyTooltip>
            </Th>
            <Th textAlign="center">
              <MyTooltip label="Heuristical static score of the packet (from 0 to 100)">Score</MyTooltip>
            </Th>
            <Th textAlign="center">Status</Th>
            <Th>Method</Th>
            <Th>Origin</Th>
            <Th>Path</Th>
            <Th><MyTooltip label="parameters">Params</MyTooltip></Th>
            <Th><MyTooltip label="reflectedParameters">Reflected</MyTooltip></Th>
          </Tr>
        </Thead>
        <Tbody>
          {packets.map(p =>
            <Tr
              animation="newAddedRow 1s"
              key={`packet-${p._id}`}
              lineHeight="20px"
              cursor="pointer"
              _hover={{ bg: 'custom.grey' }}
              onClick={(e) => clickPacket(e, p)}
              onMouseDown={(e) => setPlaceMouseClick({ x: e.pageX, y: e.pageY })}
              {...(choosingPacket._id === p._id || urlHash === p.requestPacketId) && {
                bg: 'custom.black',
                color: 'custom.white',
                _hover: { 'opacity': '.7' },
                fontWeight: "500"
              }}
            >
              <Td textAlign="center">{p.requestPacketIndex}</Td>
              <Td textAlign="center">{p.count}</Td>
              <Td textAlign="center">{p.staticScore}</Td>
              <Td textAlign="center">{p.responseStatus}</Td>
              <Td >{p.method}</Td>
              <Td minW="200px">{p.origin}</Td>
              <Td maxW="320px">{p.path}</Td>
              <Td maxW="280px">[{p.parameters.join(', ')}]</Td>
              <Td maxW="180px" pr="5px">[{Object.keys(p.reflectedParameters || {}).join(', ')}]</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      {packets.length === 0 && !isLoadingPackets &&
        <Text
          fontSize="sm"
          mt="10px"
          textAlign="center"
          fontStyle="italic"
          p="5px"
        >
          No packet matched
        </Text>
      }
      <Progress
        display={isLoadingPackets ? 'block' : 'none'}
        colorScheme="black"
        isIndeterminate
        lineHeight="5x"
        hasStripe
        size="xs"
        mt="20px"
      />

      {isShowingDetail &&
        <BodyViewer
          setIsShowingDetail={setIsShowingDetail}
          setFilter={setFilter}
          packet={choosingPacket}
        />
      }
    </Box>
  );
}