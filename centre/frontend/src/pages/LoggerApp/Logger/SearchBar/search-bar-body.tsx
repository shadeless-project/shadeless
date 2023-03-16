import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Button, Input, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { FilterBodyTypes } from "../../App";

type SearchBarBodyProps = {
  isShowing: boolean;
  filterBodyType: FilterBodyTypes;
  setFilterBodyType: React.Dispatch<React.SetStateAction<FilterBodyTypes>>;
  setFilterBody: React.Dispatch<React.SetStateAction<string>>;
}
export default function SearchBarBody(props: SearchBarBodyProps) {
  const {
    isShowing,
    setFilterBody,
    filterBodyType,
    setFilterBodyType,
  } = props;
  return (
    <Box
      display={isShowing ? 'block' : 'none'}
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
          && {filterBodyType} matches regex
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => setFilterBodyType(FilterBodyTypes.BODY)}>body</MenuItem>
          <MenuItem onClick={() => setFilterBodyType(FilterBodyTypes.REQUEST_BODY)}>requestBody</MenuItem>
          <MenuItem onClick={() => setFilterBodyType(FilterBodyTypes.RESPONSE_BODY)}>responseBody</MenuItem>
        </MenuList>
      </Menu>
      <Input
        placeholder={'(sentAt|timestamp|[a-z0-9]{32})'}
        w="30%"
        size="sm"
        ml="5px"
        _placeholder={{ opacity: '.6' }}
        onChange={(e) => setFilterBody(e.target.value)}
      />
    </Box>
  );
}
