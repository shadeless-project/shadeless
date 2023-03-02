import { Button } from "@chakra-ui/react";
import MyTooltip from "../common/tooltip";

type UtilBtnProps = {
  tooltip: string;
  bg: string;
  onClick: (...args: any[]) => any;
  children: any;

  fontSize?: string;
  ml?: string;
}
export default function UtilityButton(props: UtilBtnProps) {
  const { tooltip, onClick, children, bg } = props;
  const fontSize = props.fontSize || '2xs';
  const ml = props.ml || '0px';
  return (
    <MyTooltip label={tooltip}>
      <Button
        size="2xs"
        fontSize={fontSize}
        p="4px"
        mr="6px"
        ml={ml}
        bg={bg}
        _hover={{ opacity: '0.7' }}
        onClick={onClick}
      >
        {children}
      </Button>
    </MyTooltip>
  )
}
