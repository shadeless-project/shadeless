import { Box, Button, ButtonProps, Flex, Grid, Text } from "@chakra-ui/react";
import React from "react";
import { ParserPacketProperties } from "src/libs/query.parser"

interface ChooserBtnProps extends ButtonProps {
  onClick: (...args: any[]) => any;
}
function ChooserBtn(props: ChooserBtnProps) {
  const { children, onClick } = props;
  return (
    <Button
      size="sm"
      p="1em"
      borderRadius="2em"
      _hover={{"opacity": ".6"}}
      _active={{"opacity": ".8"}}
      {...props}
      onClick={() => onClick(children) }
    >
      {children}
    </Button>
  )
}

type ColumnChooserBtnProps = {
  index: number;
  name: string;
  onClick: (...args: any[]) => any;
  onClickIndex: (...args: any[]) => any;
}
function ColumnChooserBtn(props: ColumnChooserBtnProps) {
  const { index, name, onClick, onClickIndex } = props;

  return (
    <React.Fragment>
      {index ?
        <Box m="3px">
          <Button
            borderRightRadius="0"
            borderRadius="2em"
            size="sm"
            bg="custom.primary"
            color="custom.white"
            _hover={{"opacity": ".6"}}
            _active={{"opacity": ".8"}}
            onClick={() => onClickIndex(index, name)}
          >
            {index}
          </Button>
          <ChooserBtn
            bg="custom.black"
            color="custom.white"
            borderLeftRadius="0"
            onClick={onClick}
          >
            {name}
          </ChooserBtn>
        </Box>
      :
        <ChooserBtn onClick={onClick} m="3px">
          {name}
        </ChooserBtn>
      }
    </React.Fragment>
  );
}

type Props = {

}

function fromStringToChooseColumnType(val:string) {
  const value = val.split(':');
  return {
    index: +value[0],
    name: value[1],
  }
}
const MAX_COLUMNS = 10;
const ColumnNames = ParserPacketProperties.map(prop => prop.name);
const defaultColumns = `1:${ColumnNames[2]},2:${ColumnNames[3]},3:${ColumnNames[19]},4:${ColumnNames[14]},5:${ColumnNames[5]},6:${ColumnNames[8]},7:${ColumnNames[10]},8:${ColumnNames[12]},9:${ColumnNames[17]}`;
const defaultArrColumns = defaultColumns.split(',').map(val => fromStringToChooseColumnType(val));

type ChoosingColumnType = {
  index: number;
  name: string;
}
export default function LoggerColumnsChooser(props: Props) {
  const [choosingColumns, setChoosingColumns] = React.useState<ChoosingColumnType[]>([]);
  React.useEffect(() => {
    const storageChoosingColumns = localStorage.getItem('choosingColumns') ?? defaultColumns;
    try {
      setChoosingColumns(storageChoosingColumns.split(',').map(val => fromStringToChooseColumnType(val)));
    } catch (err) {
      setChoosingColumns(defaultArrColumns);
      localStorage.setItem('choosingColumns', storageChoosingColumns);
    }
  }, []);

  const onClickIndex = (index: number, name: string) => {

  }

  const onClick = (name: string) => {
    const foundIndex = choosingColumns.findIndex(v => v.name === name);
    if (foundIndex > -1) {
      choosingColumns.splice(foundIndex, 1);
      updateColumns(choosingColumns);
      setChoosingColumns(choosingColumns);
    } else {
      
    }
  }

  return (
    <Flex flexFlow="row wrap">
      {ColumnNames.map(name =>
        <ColumnChooserBtn
          onClick={onClick}
          onClickIndex={onClickIndex}
          name={name}
          index={choosingColumns[choosingColumns.findIndex(v => v.name === name)]?.index}
        />
      )}
    </Flex>
  );
}