import { Box, Button, Divider, Text } from "@chakra-ui/react";
import React from "react";
import { PacketColumnProperty } from "src/libs/query.parser";
import MyTooltip from "src/pages/common/tooltip";

type SuggestBtnProps = {
  onClick: (...args: any[]) => any;
  children: string;
  type: string;
}
function SuggestBtn(props: SuggestBtnProps) {
  return (
    <MyTooltip label={props.type}>
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
    </MyTooltip>
  );
}

type SuggestionsProps = {
  suggests: PacketColumnProperty[];
  onClickBtnSuggest: (...args: any[]) => any;
}
export default function Suggestions(props: SuggestionsProps) {
  const { suggests, onClickBtnSuggest } = props;

  const [suggestsNum, setSuggestsNum] = React.useState<PacketColumnProperty[]>([]);
  const [suggestsString, setSuggestsString] = React.useState<PacketColumnProperty[]>([]);
  const [suggestsComplex, setSuggestsComplex] = React.useState<PacketColumnProperty[]>([]);

  React.useEffect(() => {
    const suggestTypeNum = suggests.filter(s => s.type === 'Number');
    const suggestTypeString = suggests.filter(s => s.type === 'String');
    const suggestTypeComplex = suggests.filter(s => s.type !== 'Number' && s.type !== 'String');

    setSuggestsNum(suggestTypeNum);
    setSuggestsString(suggestTypeString);
    setSuggestsComplex(suggestTypeComplex);
  }, [suggests]);

  return (
    <React.Fragment>
      {suggests.length !== 0 &&
        <Box
          bg="white"
          position="absolute"
          w="65%"
          p="15px"
          zIndex="1"
          border="1px solid black"
          boxShadow="md"
        >
          {suggestsNum.length > 0 &&
            <React.Fragment>
              <Text fontSize="xs" fontStyle="italic">Numbers:</Text>
              {suggestsNum.map((suggest, idx) =>
                <SuggestBtn
                  key={`suggestion-${suggest}-${idx}`}
                  type={suggest.type}
                  onClick={() => onClickBtnSuggest(suggest.name)}
                >
                  {suggest.name}
                </SuggestBtn>
              )}
            </React.Fragment>
          }
          {(suggestsNum.length > 0 && (suggestsString.length > 0 || suggestsComplex.length > 0)) &&
            <Divider mb="10px" mt="5px" />
          }
          {suggestsString.length > 0 &&
            <React.Fragment>
              <Text fontSize="xs" fontStyle="italic">Strings:</Text>
              {suggestsString.map((suggest, idx) =>
                <SuggestBtn
                  key={`suggestion-${suggest}-${idx}`}
                  type={suggest.type}
                  onClick={() => onClickBtnSuggest(suggest.name)}
                >
                    {suggest.name}
                </SuggestBtn>
              )}
            </React.Fragment>
          }

          {(suggestsNum.length > 0 && suggestsString.length > 0 && suggestsComplex.length > 0) &&
            <Divider my="10px" />
          }
          {suggestsComplex.length > 0 &&
            <React.Fragment>
              <Text fontSize="xs" fontStyle="italic">Complex types:</Text>
              {suggestsComplex.map((suggest, idx) =>
                <SuggestBtn
                  key={`suggestion-${suggest}-${idx}`}
                  type={suggest.type}
                  onClick={() => onClickBtnSuggest(suggest.name)}
                >
                  {suggest.name}
                </SuggestBtn>
              )}
            </React.Fragment>
          }
        </Box>
        }
    </React.Fragment>
  );
}
