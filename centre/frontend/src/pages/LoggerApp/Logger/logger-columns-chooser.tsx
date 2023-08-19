import { Box, Button, ButtonProps, Flex, useDisclosure, useToast } from "@chakra-ui/react";
import React from "react";
import { notifyErr } from "src/libs/notify";
import { ParserPacketProperties } from "src/libs/query.parser"
import LoggerColumnChooserModal from "./logger-column-chooser-modal";

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
      _hover={{ "opacity": ".6" }}
      _active={{ "opacity": ".8" }}
      {...props}
      onClick={() => onClick(children)}
      fontSize="xs"
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
      {index >= 0 ?
        <Box m="3px">
          <Button
            borderRightRadius="0"
            borderRadius="2em"
            size="sm"
            bg="custom.primary"
            color="custom.white"
            _hover={{ "opacity": ".6" }}
            _active={{ "opacity": ".8" }}
            onClick={() => onClickIndex(index, name)}
            fontSize="xs"
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

function fromStringToChooseColumnType(val: string) {
  const value = val.split(':');
  return {
    index: +value[0],
    name: value[1],
  }
}
const MAX_COLUMNS = 12;
const ColumnNames = ParserPacketProperties.map(prop => prop.name);
const defaultColumns = `1:${ColumnNames[2]},2:${ColumnNames[3]},3:${ColumnNames[4]},4:${ColumnNames[20]},5:${ColumnNames[15]},6:${ColumnNames[6]},7:${ColumnNames[9]},8:${ColumnNames[11]},9:${ColumnNames[13]},10:${ColumnNames[18]}`;
const defaultArrColumns = defaultColumns.split(',').map(val => fromStringToChooseColumnType(val));

export type ChoosingColumnType = {
  index: number;
  name: string;
}

type Props = {
  callbackUpdateColumns: (cols: ChoosingColumnType[]) => any;
}
export default function LoggerColumnsChooser(props: Props) {
  const { callbackUpdateColumns } = props;
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [initWeightModal, setInitWeightModal] = React.useState(0);
  const [columnNameModal, setColumnNameModal] = React.useState('');

  const [choosingColumns, setChoosingColumns] = React.useState<ChoosingColumnType[]>([]);
  React.useEffect(() => {
    const storageChoosingColumns = localStorage.getItem('choosingColumns') ?? defaultColumns;
    try {
      setChoosingColumns(storageChoosingColumns.split(',').map(val => fromStringToChooseColumnType(val)));
      callbackUpdateColumns(storageChoosingColumns.split(',').map(val => fromStringToChooseColumnType(val)));
    } catch (err) {
      setChoosingColumns(defaultArrColumns);
      callbackUpdateColumns(defaultArrColumns);
    }
  }, []);

  const onClickIndex = (index: number, name: string) => {
    setInitWeightModal(index);
    setColumnNameModal(name);
    onOpen();
  }

  const onClick = (name: string) => {
    const foundIndex = choosingColumns.findIndex(v => v.name === name);
    if (foundIndex > -1) {
      localStorage.setItem(`cacheColumn:${name}`, choosingColumns[foundIndex].index.toString());
      choosingColumns.splice(foundIndex, 1);
      setChoosingColumns(choosingColumns);
      callbackUpdateColumns(choosingColumns);
    } else {
      if (choosingColumns.length === MAX_COLUMNS) {
        notifyErr(toast, `Can only choose max ${MAX_COLUMNS} columns`)
      } else {
        let tryGetCacheIndex = localStorage.getItem(`cacheColumn:${name}`) ?? 0;
        tryGetCacheIndex = +tryGetCacheIndex;
        if (typeof tryGetCacheIndex !== 'number') tryGetCacheIndex = 0;
        choosingColumns.push({
          name,
          index: tryGetCacheIndex,
        });
        setChoosingColumns(choosingColumns);
        callbackUpdateColumns(choosingColumns);
      }
    }
  }

  const updateWeight = (name: string, newWeight: number) => {
    const foundIndex = choosingColumns.findIndex(v => v.name === name);
    if (foundIndex > -1) {
      choosingColumns[foundIndex].index = newWeight;
    }
    setChoosingColumns(choosingColumns);
    callbackUpdateColumns(choosingColumns);
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
      <LoggerColumnChooserModal
        isOpen={isOpen}
        initWeight={initWeightModal}
        onClose={onClose}
        columnName={columnNameModal}
        updateWeight={updateWeight}
      />
    </Flex>
  );
}
