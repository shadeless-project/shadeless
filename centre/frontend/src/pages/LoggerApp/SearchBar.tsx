import { ChevronDownIcon, QuestionIcon, SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, Checkbox, Divider, Input, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip, useToast } from "@chakra-ui/react";
import React from "react";
import { INSTRUCTION_FILTER_URL } from "src/libs/apis/types";
import { notify } from "src/libs/notify";
import { ParserError, query2Object, ParserPacketProperties, Query2ObjectResult } from "src/libs/query.parser";
import MyTooltip from "../common/tooltip";
import { FilterBodyType } from "./App";

type SuggestBtnProps = {
  onClick: (...args: any[]) => any;
  children: string;
  type: string;
}
function SuggestBtn(props: SuggestBtnProps) {
  return (
    <Tooltip
      label={props.type}
      placement="top"
      fontSize="xs"
      aria-label='Suggestion type'
    >
      <Button
        className="suggest-btn"
        onClick={props.onClick}
        m="5px"
        borderRadius="20px"
        bg="gray.100"
        color="gray.600"
        {...props.children.toLowerCase().includes('body') && {
          bg: "gray.700",
          color: "white",
          _hover: { 'opacity': '.7' }
        }}
        fontSize="xs"
        size="xs"
      >
        {props.children}
      </Button>
    </Tooltip>
  );
}

function getChoosingBody(cur: FilterBodyType): string {
  if (cur.body !== undefined) return 'body';
  if (cur.requestBody !== undefined) return 'requestBody';
  if (cur.responseBody !== undefined) return 'responseBody';
  return 'body';
}
function getValueBody(cur: FilterBodyType): string {
  const key = getChoosingBody(cur);
  const casted = cur as any;
  if (!casted[key]) casted[key] = '';
  return casted[key];
}

type SearchBarProps = {
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
export default function SearchBar (props: SearchBarProps) {
  const { setApplyingFilter, filter, setFilter } = props;

  const toast = useToast();

  const [filterBody, setFilterBody] = React.useState<FilterBodyType>({
    body: '',
    requestBody: undefined,
    responseBody: undefined,
  });
  const [showFilterBody, setShowFilterBody] = React.useState<boolean>(localStorage.getItem('showFilterBody') === "true");
  const [uniqueEndpointsToggle, setUniqueEndpointsToggle] = React.useState<boolean>(localStorage.getItem('uniqueEndpointsToggle') === "true");

  const [filterFocus, setFilterFocus] = React.useState(false);
  const [suggests, setSuggests] = React.useState<{name: string, type: string}[]>([]);

  async function applyFilter() {
    try {
      const criteria = query2Object(filter.now);
      setApplyingFilter({
        criteria,
        ...showFilterBody ? filterBody : {},
        queryDistinct: uniqueEndpointsToggle,
      });
    } catch (err) {
      const e = err as ParserError;
      notify(toast, { statusCode: 500, data: '', error: `${e.type}: ${e.message}` }, 'filter-error-toast');
    }
  }

  function clickSuggest(suggest: string) {
    let removeCharsFilter = new String(filter.now);
    while (removeCharsFilter !== '' && removeCharsFilter[removeCharsFilter.length - 1] !== ' ') removeCharsFilter = removeCharsFilter.slice(0, -1);
    setFilter({ now: removeCharsFilter + suggest, before: filter.now });
    setFilterFocus(false);
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

  const suggestTypeNum = suggests.filter(s => s.type === 'Number');
  const suggestTypeString = suggests.filter(s => s.type === 'String');
  const suggestTypeComplex = suggests.filter(s => s.type !== 'Number' && s.type !== 'String');

  return (
    <Box w="95%" ml="2.5%">
      <Box>
        <Text fontWeight="bold" as="span" mr="10px" fontSize="sm">
          Filter
          <Text as="span" cursor="pointer" onClick={() => window.open(INSTRUCTION_FILTER_URL, 'githubWindow', 'noopener noreferrer')}>
            &nbsp;
            <MyTooltip label="Click to learn how to write filter">
              <QuestionIcon />
            </MyTooltip>
          </Text>
        </Text>
        <Box mx="auto" display="inline-block" w={{ base:"60%", lg:"80%"}}>
          <Input
            size="sm"
            onBlur={(e) => {
              if (!e.relatedTarget?.className.includes('suggest-btn')) setFilterFocus(false)
            }}
            onFocus={() => setFilterFocus(true)}
            onChange={(e) => setFilter({ before: filter.now, now: e.target.value} )}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                document.getElementById('apply-filter-btn')?.click();
              }
            }}
            placeholder="(staticScore <= 50 && responseHeaders contains 'text/html') || reflectedParameters != null"
            _placeholder={{ opacity: '.6' }}
            value={filter.now}
          />
          {suggests.length !== 0 &&
            <Box
              bg="white"
              position="absolute"
              w={{ base:"51.6%", lg:"70.4%"}}
              p="15px"
              zIndex="1"
              border="1px solid black"
              boxShadow="md"
            >
              {suggestTypeNum.length > 0 &&
                <>
                  <Text fontSize="xs" fontStyle="italic">Numbers:</Text>
                  {suggestTypeNum.map((suggest, idx) =>
                    <SuggestBtn
                      key={`suggestion-${suggest}-${idx}`}
                      type={suggest.type}
                      onClick={() => clickSuggest(suggest.name)}
                    >
                        {suggest.name}
                    </SuggestBtn>
                  )}
                </>
              }
              {(suggestTypeNum.length > 0 && (suggestTypeString.length > 0 || suggestTypeComplex.length > 0)) &&
                <Divider mb="10px" mt="5px" />
              }
              {suggestTypeString.length > 0 &&
                <>
                  <Text fontSize="xs" fontStyle="italic">Strings:</Text>
                  {suggestTypeString.map((suggest, idx) =>
                    <SuggestBtn
                      key={`suggestion-${suggest}-${idx}`}
                      type={suggest.type}
                      onClick={() => clickSuggest(suggest.name)}
                    >
                        {suggest.name}
                    </SuggestBtn>
                  )}
                </>
              }

              {(suggestTypeNum.length > 0 && suggestTypeString.length > 0 && suggestTypeComplex.length > 0) &&
                <Divider my="10px" />
              }
              {suggestTypeComplex.length > 0 &&
                <>
                  <Text fontSize="xs" fontStyle="italic">Complex types:</Text>
                  {suggestTypeComplex.map((suggest, idx) =>
                    <SuggestBtn
                      key={`suggestion-${suggest}-${idx}`}
                      type={suggest.type}
                      onClick={() => clickSuggest(suggest.name)}
                    >
                        {suggest.name}
                    </SuggestBtn>
                  )}
                </>
              }
            </Box>
            }
        </Box>
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
          <MenuList
            fontSize="sm"
          >
            <MenuItem
              onClick={(e) => {
                if (e.target.toString().includes('object HTMLSpanElement')) return;
                const newVal = !showFilterBody;
                setShowFilterBody(newVal);
                localStorage.setItem('showFilterBody', newVal.toString());
              }}
            >
              <Checkbox isChecked={showFilterBody}>Query with body</Checkbox>
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                if (e.target.toString().includes('object HTMLSpanElement')) return;
                const newVal = !uniqueEndpointsToggle;
                setUniqueEndpointsToggle(newVal);
                localStorage.setItem('uniqueEndpointsToggle', newVal.toString());
              }}
            >
              <Checkbox isChecked={uniqueEndpointsToggle}>Unique endpoints only</Checkbox>
            </MenuItem>
            <MenuItem color="red">Delete matched packets</MenuItem>
          </MenuList>
        </Menu>
        <Box
          display={showFilterBody ? 'block' : 'none'}
          mt="7px"
        >
          <Menu>
            <MenuButton
              size="xs"
              bg="black"
              color="white"
              p="8px"
              ml="-5px"
              _hover={{opacity: '.6'}}
              _active={{opacity: '.5'}}
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              && {getChoosingBody(filterBody)} contains
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => {
                const val = getValueBody(filterBody);
                setFilterBody({ requestBody: undefined, responseBody: undefined, body: val });
              }}>
                body
              </MenuItem>
              <MenuItem onClick={() => {
                const val = getValueBody(filterBody);
                console.log(val);
                setFilterBody({ requestBody: val, responseBody: undefined, body: undefined });
              }}>requestBody</MenuItem>
              <MenuItem onClick={() => {
                const val = getValueBody(filterBody);
                setFilterBody({ requestBody: undefined, responseBody: val, body: undefined });
              }}>responseBody</MenuItem>
            </MenuList>
          </Menu>
          <Input
            placeholder={'something'}
            w="30%"
            size="sm"
            ml="5px"
            _placeholder={{ opacity: '.6' }}
            onChange={(e) => {
              const key = getChoosingBody(filterBody);
              setFilterBody({...filterBody, [key]: e.target.value});
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
