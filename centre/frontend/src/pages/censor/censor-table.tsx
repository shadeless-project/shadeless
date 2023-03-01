import { ChevronDownIcon } from "@chakra-ui/icons";
import { Code, Icon, Menu, MenuButton, MenuItem, MenuList, Progress, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Censor, CENSOR_CONDITION } from "src/libs/apis/censors";
import ConfigIcon from "../common/config-icon";

function getCensorConditionCode(condition: any) {
  return CENSOR_CONDITION.reduce((prev, cur, index) => prev + `${index > 0 ? ' && ' : ''}${cur} == '${condition[cur]}'`, '');
}
type CensorTableProps = {
  censors: Censor[];
  setDeletingCensor: React.Dispatch<React.SetStateAction<Censor>>;
  onOpenModalDel: () => void;
  setEditingCensor: React.Dispatch<React.SetStateAction<Censor>>;
  onOpenModalEdit: () => void;
  isLoading: boolean;
}
export default function CensorTable (props: CensorTableProps) {
  const {
    censors,
    onOpenModalDel,
    setDeletingCensor,
    onOpenModalEdit,
    setEditingCensor,
    isLoading,
  } = props;
  return (
    <React.Fragment>
      <TableContainer p="10px">
        <Table>
          <Thead>
            <Tr>
              <Th w="40px" textAlign="center">#</Th>
              <Th>Condition</Th>
              <Th>Description</Th>
              <Th>Created at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {censors.map((c, index) =>
              <Tr
                key={`censor-${c._id}`}
                _hover={{ bg: 'custom.hover-grey' }}
              >
                <Td textAlign="center">{index+1}</Td>
                <Td>
                  <Code
                    p="5px"
                    fontSize="xs"
                    borderRadius='5px'
                  >
                    {getCensorConditionCode(c.condition)}
                  </Code>
                </Td>
                <Td>{c.description}</Td>
                <Td>
                  <Text
                    fontSize="sm"
                    opacity='.7'
                    fontWeight='500'
                  >
                    {window.formatDate(c['createdAt'])}
                  </Text>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      p={2}
                      _hover={{ bg: 'custom.focus-grey' }}
                      _expanded={{ bg: 'custom.focus-grey' }}
                    >
                      <ConfigIcon />
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          setEditingCensor(c);
                          onOpenModalEdit();
                        }}
                      >
                        Edit censor
                      </MenuItem>
                      <MenuItem
                        color="red.500"
                        onClick={() => {
                          setDeletingCensor(c);
                          onOpenModalDel();
                        }}
                      >
                        Remove
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {censors.length === 0 &&
        <Text
          fontSize="sm"
          textAlign="center"
          p="5px"
          opacity='.8'
          cursor='default'
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
    </React.Fragment>
  );
}
