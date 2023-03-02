import { Tooltip, TooltipProps } from "@chakra-ui/react";

interface Props extends TooltipProps {
  children: any;
}
export default function MyTooltip(props: Props) {
  const { label, children } = props;
  return (
    <Tooltip
      placement="top"
      fontSize="2xs"
      {...props}
    >
      {children}
    </Tooltip>
  );
}
