import { DeleteIcon, QuestionIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text, Textarea, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AccountRole } from "src/libs/apis/account";
import { deletePackets } from "src/libs/apis/packets";
import { INSTRUCTION_FILTER_URL } from "src/libs/apis/types";
import { notifyErr, notifySuccess } from "src/libs/notify";
import { ParserError, query2Object, ParserPacketProperties, Query2ObjectResult, PacketColumnProperty } from "src/libs/query.parser";
import MyTooltip from "../../../common/tooltip";
import { FilterBodyTypes } from "../../App";
import { LoggerContext } from "../../LoggerAppContext";
import DeleteVerification from "./delete-verification";
import SearchBarBody from "./search-bar-body";
import Suggestions from "./suggestions";

function auto_grow() {
  const element = document.getElementById('search-bar');
  if (!element) return;
  element.style.height = "5px";
  element.style.height = (element.scrollHeight) + "px";
}

type SearchBarProps = {
  showFilterBody: boolean;
  uniqueEndpointsToggle: boolean;
  setApplyingFilter: React.Dispatch<React.SetStateAction<Query2ObjectResult>>;
  filter: {
    before: string;
    now: string;
  };
  setFilter: React.Dispatch<React.SetStateAction<{
    before: string;
    now: string;
  }>>;
}
export default function SearchBar(props: SearchBarProps) {
  const {
    setApplyingFilter,
    filter,
    setFilter,
    showFilterBody,
    uniqueEndpointsToggle,
  } = props;

  const toast = useToast();
  const currentProject = useContext(LoggerContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterBody, setFilterBody] = React.useState<string>('');
  const [filterBodyType, setFilterBodyType] = React.useState<FilterBodyTypes>(FilterBodyTypes.BODY);

  const [filterFocus, setFilterFocus] = React.useState(false);
  const [suggests, setSuggests] = React.useState<PacketColumnProperty[]>([]);

  function clickSuggest(suggest: string) {
    let removeCharsFilter = new String(filter.now);
    while (removeCharsFilter !== '' && removeCharsFilter[removeCharsFilter.length - 1] !== ' ') removeCharsFilter = removeCharsFilter.slice(0, -1);
    setFilter({ now: removeCharsFilter + suggest, before: filter.now });
    setFilterFocus(false);
  }

  async function applyFilter() {
    try {
      const criteria = query2Object(filter.now);
      setApplyingFilter({
        criteria,
        ...showFilterBody ? {
          [filterBodyType]: filterBody,
        } : {},
        queryDistinct: uniqueEndpointsToggle,
      });
    } catch (err) {
      const e = err as ParserError;
      notifyErr(toast, `${e.type}: ${e.message}`, 'filter-error-toast');
    }
  }

  async function uiDeletePackets() {
    try {
      const criteria = query2Object(filter.now);
      await deletePackets(currentProject, {
        criteria,
        ...showFilterBody ? {
          [filterBodyType]: filterBody,
        } : {},
        queryDistinct: uniqueEndpointsToggle,
      });
      notifySuccess(toast, 'Success, the server is deleting matched packets in the background');
      onClose();
    } catch (err) {
      const e = err as ParserError;
      notifyErr(toast, `${e.type}: ${e.message}`, 'filter-error-toast');
    }
  }

  React.useEffect(() => {
    const lastChar = filter.now.trimEnd()[filter.now.trimEnd().length - 1];
    if (
      filterFocus &&
      (filter.now.startsWith(filter.before) || filter.before.startsWith(filter.now)) &&
      (filter.now[filter.now.length - 1] !== ' ' || lastChar === '|' || lastChar === '&')
    ) {
      const tokens = filter.now.split(' ');
      const curVal = tokens[tokens.length - 1];
      const suggests = ParserPacketProperties.filter(prop => prop.name.toLowerCase().includes(curVal.toLowerCase()));
      setSuggests(suggests);
    } else {
      setSuggests([]);
    }
  }, [filter, filterFocus]);

  return (
    <Box w="95%" ml="2.5%">
      <Flex
        justifyContent='space-between'
        alignItems="center"
      >
        <Text as="span" w="80px">
          Filter&nbsp;
          <Text
            as="span"
            cursor="pointer"
            onClick={() => window.open(INSTRUCTION_FILTER_URL, 'githubWindow', 'noopener noreferrer')}
          >
            <MyTooltip label="Click to learn how to write filter">
              <QuestionIcon />
            </MyTooltip>
          </Text>
        </Text>

        <Flex
          justifyContent='space-between'
          alignItems="center"
          w="100%"
        >
          <Box display="inline-block" w="90%">
            <Textarea
              id="search-bar"
              mt="-6px"
              size="sm"
              rows={1}
              overflow="hidden"
              onBlur={(e) => {
                if (!e.relatedTarget?.className.includes('suggest-btn')) setFilterFocus(false)
              }}
              onFocus={() => setFilterFocus(true)}
              onChange={(e) => {
                auto_grow();
                setFilter({ before: filter.now, now: e.target.value });
              }}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && (e.keyCode == 13 || e.keyCode == 10)) {
                  document.getElementById('apply-filter-btn')?.click();
                }
              }}
              placeholder="(staticScore <= 50 && responseHeaders contains 'text/html') || reflectedParameters != null"
              _placeholder={{ opacity: '.6' }}
              value={filter.now}
            />
            <Suggestions
              suggests={suggests}
              onClickBtnSuggest={clickSuggest}
            />
          </Box>
          <Box minW="130px">
            <Button
              id="apply-filter-btn"
              mt="-3px" ml="10px"
              size="sm"
              color="white"
              bg="black"
              _hover={{
                opacity: '.6'
              }}
              onClick={applyFilter}
            >
              Query
            </Button>
            <Menu closeOnSelect={false}>
              <MenuButton
                p="0"
                size="sm"
                fontSize="sm"
                mt="-3px"
                bg="gray.100"
                ml="5px"
                as={Button}
              >
                <SettingsIcon />
              </MenuButton>
              <MenuList fontSize="sm">
                {/* <MenuItem icon={<DownloadIcon />}>Download matched</MenuItem> */}
                {/* <Divider /> */}
                <MenuItem
                  icon={<DeleteIcon />}
                  color="red"
                  onClick={() => {
                    if (window.getUserRole() !== AccountRole.ADMIN) alert('Only admin can delete packets');
                    else onOpen();
                  }}
                >
                  Delete matched
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <DeleteVerification
        isOpen={isOpen}
        onClose={onClose}
        query={filter.now}
        confirmedDeleteCallback={uiDeletePackets}
        uniqueEndpointsToggle={uniqueEndpointsToggle}
      />
      <SearchBarBody
        isShowing={showFilterBody}
        setFilterBody={setFilterBody}
        filterBodyType={filterBodyType}
        setFilterBodyType={setFilterBodyType}
      />
    </Box>
  )
}
