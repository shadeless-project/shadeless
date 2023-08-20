import { AddIcon, ArrowDownIcon, ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Flex, Grid, IconButton, Input, Select, Switch, Text, useToast } from '@chakra-ui/react';
import React from 'react';
import { FfufDetectType, FfufFuzzMode, FfufFuzzer, FfufSettingType } from 'src/libs/apis/types';
import { notify } from 'src/libs/notify';

let cntUniqueWordlist = 0;

function getPlaceholderByDetectType(type: FfufDetectType): string {
  if (type === FfufDetectType.TIME) return '>6000';
  if (type === FfufDetectType.KEYWORD) return '<regex>';
  return '';
}

function generateDefaultFuzzer(): FfufFuzzer {
  return {
    "name": `Error-based (New)`,
    "wordlist": "ERROR",
    "detect": FfufDetectType.KEYWORD,
    "detectValue": "60481729|(Usage:)|(uid=)|(id: command not found)|(id: not found)|('id' not found)|('id' is not recognized as)|(mysql_fetch_)|(not a valid MySQL)|(not a legal PLSQL identifer)|(mysql_connect)|(SELECT\s+[^:>]+\sFROM\s+[^:>]+\sWHERE\s+)|(at\s[[:alnum:]\/\._]+\sline\s\d+)|ociparse\(\)|(must be a syntactically valid variable)|(CFSQLTYPE)|(Unknown column)|(Microsoft OLE DB Provider for SQL)|(SQL QUERY FAILURE)|(Syntax error.{1,50}in query)|(You have an error in your SQL syntax)|(Unclosed quotation mark)",
    "overwriteHeader": true,
    "fuzzMode": FfufFuzzMode.CLUSTERBOMB,
  }
}

export default function FfufPage() {
  const toast = useToast();
  const storageSetting = window.localStorage.getItem('ffuf_setting') as unknown as string;
  const [ffufSetting, setFfufSetting] = React.useState<FfufSettingType>(JSON.parse(storageSetting) as unknown as FfufSettingType);
  const [] = React.useState(0);

  function saveFfuf() {
    const setting = {
      ...ffufSetting,
      thread: parseInt(ffufSetting.thread as any),
      delay: parseFloat(ffufSetting.delay as any),
    }
    if (!window.isSetupFfufCorrect(setting)) {
      notify(toast, { statusCode: 500, data: '', error: `Error: cannot save ffuf object, something is wrong with ffuf object` }, 'ffuf-object-error');
      return;
    }
    window.localStorage.setItem('ffuf_setting', JSON.stringify(setting));
    notify(toast, { statusCode: 200, data: 'Successfully save ffuf setting', error: `` }, 'ffuf-object-error');
  }

  return (
    <Box
      p="10px"
      borderRadius="var(--component-border)"
      boxShadow="sm"
      bg="custom.white"
    >
      <Flex
        alignContent="center"
        alignItems="center"
        p="15px"
      >
        <Text
          as="h2"
          fontSize="3xl"
        >
          ffuf setting
        </Text>
        <Button
          ml="15px"
          onClick={saveFfuf}
          colorScheme='green'
        >
          Save
        </Button>
      </Flex>

      <Box p="15px">
        <Text as="span">
          Proxy:
        </Text>
        <Input
          ml="10px"
          fontSize="sm"
          width="300px"
          onChange={(e) => {
            setFfufSetting({
              ...ffufSetting,
              proxy: e.target.value,
            })
          }}
          placeholder='http://localhost:8080'
          value={ffufSetting.proxy}
        />

        <Text ml="20px" as="span">
          Threads:
        </Text>
        <Input
          ml="10px"
          fontSize="sm"
          width="300px"
          onChange={(e) => {
            setFfufSetting({
              ...ffufSetting,
              thread: e.target.value
            })
          }}
          placeholder='40'
          value={ffufSetting.thread}
        />
      </Box>

      <Box p="15px">
        <Text as="span">
          Delay between 2 requests (secs):
        </Text>
        <Input
          ml="10px"
          fontSize="sm"
          width="300px"
          onChange={(e) => {
            setFfufSetting({
              ...ffufSetting,
              delay: e.target.value
            })
          }}
          placeholder='0.1'
          value={ffufSetting.delay}
        />
      </Box>

      <Box p="15px" mt="10px" shadow="xs">
        <Text as="span" fontSize="2xl">
          # Wordlist
        </Text>
        <IconButton
          borderRadius="200%"
          size="xs"
          ml="7px"
          mt="-7px"
          fontSize="2xs"
          colorScheme='green'
          aria-label='Add more wordlist'
          icon={<AddIcon />}
          onClick={() => {
            const { wordlists } = ffufSetting;
            const names = wordlists.map(v => v.name);
            let newName = `wordlist_${cntUniqueWordlist}`;
            while (names.includes(newName)) newName = `wordlist_${++cntUniqueWordlist}`;
            wordlists.push({ name: newName, path: `/path/to/wordlist_${cntUniqueWordlist}.txt` });
            setFfufSetting({
              ...ffufSetting,
              wordlists,
            });
          }}
        />

        {ffufSetting.wordlists.map((wordlist, index) =>
          <React.Fragment key={`wordlist-${index}`}>
            <Grid px="5%" my="15px" gridTemplateColumns='0.3fr 1fr 0.1fr' gap="5">
              <Box>
                <Text as="span">Name: </Text>
                <Input
                  ml="10px"
                  p="2"
                  fontSize="sm"
                  width={{ "sm": "40%", "md": "43%", "lg": "47%", "xl": "55%" }}
                  onChange={(e) => {
                    const { wordlists } = ffufSetting;
                    wordlists[index].name = e.target.value;
                    setFfufSetting({
                      ...ffufSetting,
                      wordlists,
                    });
                  }}
                  value={wordlist.name}
                />
              </Box>
              <Box>
                <Text as="span">Path: </Text>
                <Input
                  ml="1%"
                  p="2"
                  width={{ sm: "70%", lg: "80%" }}
                  value={wordlist.path}
                  onChange={(e) => {
                    const { wordlists } = ffufSetting;
                    wordlists[index].path = e.target.value;
                    setFfufSetting({
                      ...ffufSetting,
                      wordlists,
                    });
                  }}
                />
              </Box>
              <Box>
                <IconButton
                  borderRadius="3px"
                  size="md"
                  fontSize="md"
                  colorScheme='red'
                  aria-label='Remove this wordlist'
                  icon={<DeleteIcon />}
                  onClick={() => {
                    const { wordlists } = ffufSetting;
                    const newWordlists = wordlists.filter((_, idx) => idx !== index);
                    setFfufSetting({
                      ...ffufSetting,
                      wordlists: newWordlists,
                    });
                  }}
                />
              </Box>
            </Grid>
            <Divider w="100%" display={index === ffufSetting.wordlists.length - 1 ? 'none' : 'default'} />
          </React.Fragment>
        )}
      </Box>

      <Box p="15px" mt="10px" shadow="xs">
        <Text as="span" fontSize="2xl">
          # Fuzz setting
        </Text>
        <IconButton
          borderRadius="200%"
          size="xs"
          ml="7px"
          mt="-7px"
          fontSize="2xs"
          colorScheme='green'
          aria-label='Add more fuzz type'
          icon={<AddIcon />}
          onClick={() => {
            const { fuzzers } = ffufSetting;
            fuzzers.push(generateDefaultFuzzer());
            setFfufSetting({
              ...ffufSetting,
              fuzzers,
            });
          }}
        />
        {ffufSetting.fuzzers.map((fuzzer, index) =>
          <React.Fragment key={`ffuf-fuzzer-${index}-${fuzzer.name}-${fuzzer.fuzzMode}-${fuzzer.wordlist}`}>
            <Grid p="1em" borderRadius="3px" border="1px solid black" px="1%" my="15px" gridTemplateColumns='1fr 1fr 1fr 1fr' gap="3">
              <Box>
                <Text as="span">Name: </Text>
                <Input
                  p="2"
                  fontSize="sm"
                  width={{ "sm": "40%", "md": "45%", "lg": "50%", "xl": "60%" }}
                  onChange={(e) => {
                    const { fuzzers } = ffufSetting;
                    fuzzers[index].name = e.target.value;
                    setFfufSetting({
                      ...ffufSetting,
                      fuzzers,
                    });
                  }}
                  value={fuzzer.name}
                />
                <br />
                <Text as="span">Wordlist: </Text>
                <Select
                  ml="5px"
                  size="sm"
                  display="inline-block"
                  w="initial"
                  defaultValue={fuzzer.wordlist}
                  onChange={(e) => {
                    const { fuzzers } = ffufSetting;
                    fuzzers[index].wordlist = e.target.value;
                    setFfufSetting({
                      ...ffufSetting,
                      fuzzers,
                    })
                  }}
                >
                  {ffufSetting.wordlists.map(({ name }) =>
                    <option
                      value={name}
                      key={`ffuf-fuzzer-${index}-wordlist-${name}`}
                    >
                      {name}
                    </option>
                  )}
                </Select>
              </Box>
              <Box mt="4px">
                <Text as="span">Detect: </Text>
                <Select
                  size="sm"
                  ml="5px"
                  display="inline-block"
                  w="initial"
                  defaultValue={fuzzer.detect}
                  onChange={(e) => {
                    const { fuzzers } = ffufSetting;
                    fuzzers[index].detect = e.target.value as FfufDetectType;
                    if (fuzzers[index].detect === FfufDetectType.NONE || fuzzers[index].detect === FfufDetectType.REFLECT) {
                      fuzzers[index].detectValue = '';
                    }
                    setFfufSetting({
                      ...ffufSetting,
                      fuzzers,
                    })
                  }}
                >
                  <option value={FfufDetectType.NONE}>{FfufDetectType.NONE}</option>
                  <option value={FfufDetectType.KEYWORD}>{FfufDetectType.KEYWORD}</option>
                  <option value={FfufDetectType.TIME}>{FfufDetectType.TIME}</option>
                  <option value={FfufDetectType.REFLECT}>{FfufDetectType.REFLECT}</option>
                </Select>
                <br />
                <Text as="span">Detect value: </Text>
                <Input
                  p="2"
                  placeholder={getPlaceholderByDetectType(fuzzer.detect)}
                  fontSize="sm"
                  width={{ "sm": "40%", "md": "45%", "lg": "50%", "xl": "60%" }}
                  onChange={(e) => {
                    const { fuzzers } = ffufSetting;
                    fuzzers[index].detectValue = e.target.value;
                    setFfufSetting({
                      ...ffufSetting,
                      fuzzers,
                    });
                  }}
                  value={fuzzer.detectValue || '<none>'}
                  disabled={fuzzer.detect === FfufDetectType.NONE || fuzzer.detect === FfufDetectType.REFLECT}
                />
              </Box>
              <Box mt="6px">
                <Text as="span">Fuzz header: </Text>
                <Switch ml="2px" size='md' isChecked={fuzzer.overwriteHeader} onChange={(e) => {
                  const { fuzzers } = ffufSetting;
                  fuzzers[index].overwriteHeader = !fuzzers[index].overwriteHeader;
                  setFfufSetting({
                    ...ffufSetting,
                    fuzzers,
                  });
                }} />
                <br />

                <Text as="span">Mode: </Text>
                <Select
                  size="sm"
                  ml="5px"
                  display="inline-block"
                  w="initial"
                  defaultValue={fuzzer.fuzzMode}
                  onChange={(e) => {
                    const { fuzzers } = ffufSetting;
                    fuzzers[index].fuzzMode = e.target.value as FfufFuzzMode;
                    setFfufSetting({
                      ...ffufSetting,
                      fuzzers,
                    })
                  }}
                >
                  <option value={FfufFuzzMode.CLUSTERBOMB}>{FfufFuzzMode.CLUSTERBOMB}</option>
                  <option value={FfufFuzzMode.SNIPER}>{FfufFuzzMode.SNIPER}</option>
                </Select>
              </Box>
              <Box>
                <IconButton
                  borderRadius="3px"
                  size="md"
                  fontSize="md"
                  colorScheme='red'
                  mx="3px"
                  aria-label='Remove this wordlist'
                  icon={<DeleteIcon />}
                  onClick={() => {
                    const { fuzzers } = ffufSetting;
                    const newFuzzers = fuzzers.filter((_, idx) => idx !== index);
                    setFfufSetting({
                      ...ffufSetting,
                      fuzzers: newFuzzers,
                    });
                  }}
                />
                {index < ffufSetting.fuzzers.length - 1 &&
                  <IconButton
                    borderRadius="3px"
                    size="md"
                    fontSize="md"
                    colorScheme='blue'
                    mx="3px"
                    aria-label='Move this fuzzer down'
                    icon={<ArrowDownIcon />}
                    onClick={() => {
                      const { fuzzers } = ffufSetting;
                      const tmp = fuzzers[index + 1];
                      fuzzers[index + 1] = fuzzers[index];
                      fuzzers[index] = tmp;
                      setFfufSetting({
                        ...ffufSetting,
                        fuzzers,
                      });
                    }}
                  />
                }
                {index > 0 &&
                  <IconButton
                    borderRadius="3px"
                    size="md"
                    fontSize="md"
                    mx="3px"
                    colorScheme='blue'
                    aria-label='Move this fuzzer up'
                    icon={<ArrowUpIcon />}
                    onClick={() => {
                      const { fuzzers } = ffufSetting;
                      const tmp = fuzzers[index - 1];
                      fuzzers[index - 1] = fuzzers[index];
                      fuzzers[index] = tmp;
                      setFfufSetting({
                        ...ffufSetting,
                        fuzzers,
                      });
                    }}
                  />
                }
              </Box>
            </Grid>
          </React.Fragment>
        )}
      </Box>

    </Box>
  );
}
