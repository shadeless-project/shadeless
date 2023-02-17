import { SmallCloseIcon } from "@chakra-ui/icons";
import { Button, Progress, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react";
import { Censor, CENSOR_CONDITION } from "src/libs/apis/censors";

type CensorTableProps = {
  censors: Censor[];
  setDeletingCensor: React.Dispatch<React.SetStateAction<Censor>>;
  onOpenModalDel: () => void;
  isLoading: boolean;
}
export default function CensorTable (props: CensorTableProps) {
  const { censors, onOpenModalDel, setDeletingCensor, isLoading } = props;
  return (
    <>
      <Table
        border="1.3px solid gray"
        borderRadius="10px"
        mt="20px"
        size="xs"
        fontSize="xs"
      >
        <Thead fontSize="2xs">
          <Tr>
            <Th w="40px" textAlign="center">#</Th>
            <Th maxW="50px">Method</Th>
            <Th>Origin</Th>
            <Th>Path</Th>
            <Th w="60px">Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {censors.map((c, index) =>
            <Tr key={`censor-${c._id}`}>
              <Td textAlign="center">{index+1}</Td>
              {CENSOR_CONDITION.map(cond =>
                <Td key={`censor-${c._id}-cond-${cond}`}>
                  {c.condition[cond]}
                </Td>
              )}
              <Td>
                <Tooltip placement="top" fontSize="2xs" label="Delete censor">
                  <Button
                    ml="10px"
                    colorScheme="red"
                    size="2xs"
                    p="2px"
                    borderRadius="1"
                    onClick={() => {
                      setDeletingCensor(c);
                      onOpenModalDel();
                    }}
                  >
                    <SmallCloseIcon />
                  </Button>
                </Tooltip>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      {censors.length === 0 &&
        <Text
          fontSize="sm"
          textAlign="center"
          fontStyle="italic"
          p="5px"
          borderX="1px solid black"
          borderBottom="1px solid black"
        >
          No censor found
        </Text>
      }
      <Progress
        display={isLoading ? 'block' : 'none'}
        colorScheme="black"
        isIndeterminate
        lineHeight="5x"
        hasStripe
        size="xs"
        mt="20px"
      />
    </>
  );
}
