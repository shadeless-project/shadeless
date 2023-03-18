import { Box, Text } from "@chakra-ui/react";
import React from "react";
import OptionCheckBox from "./SearchBar/option-checkbox";

type Props = {
  showFilterBody: boolean;
  setShowFilterBody: React.Dispatch<React.SetStateAction<boolean>>;

  uniqueEndpointsToggle: boolean;
  setUniqueEndpointsToggle: React.Dispatch<React.SetStateAction<boolean>>;

  showConfigColumns: boolean;
  setShowConfigColumns: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function LoggerOptions(props: Props) {
  const {
    showFilterBody,
    setShowFilterBody,
    uniqueEndpointsToggle,
    setUniqueEndpointsToggle,
    showConfigColumns,
    setShowConfigColumns,
  } = props;

  return (
    <React.Fragment>
      <Box mb="15px" w="95%" ml="2.5%">
        <Text as="span" mr="18px">
          Options
        </Text>
        <OptionCheckBox
          isChecked={showFilterBody}
          onClick={(e) => {
            const newVal = !showFilterBody;
            setShowFilterBody(newVal);
            localStorage.setItem('showFilterBody', newVal.toString());
          }}
          bg="custom.black"
        >
          Query with body
        </OptionCheckBox>
        <OptionCheckBox
          isChecked={uniqueEndpointsToggle}
          bg="orange.600"
          ml="15px"
          onClick={async (e) => {
              const newVal = !uniqueEndpointsToggle;
              setUniqueEndpointsToggle(newVal);
              localStorage.setItem('uniqueEndpointsToggle', newVal.toString());
              await window.sleep(150);
              document.getElementById('apply-filter-btn')?.click();
            }}
          >
          Unique endpoints only
        </OptionCheckBox>
        <OptionCheckBox
          isChecked={showConfigColumns}
          bg="gray.600"
          ml="15px"
          onClick={(e) => {
              const newVal = !showConfigColumns;
              setShowConfigColumns(newVal);
              localStorage.setItem('showConfigColumns', newVal.toString());
            }}
          >
          Show config columns
        </OptionCheckBox>
      </Box>
    </React.Fragment>
  );
}
