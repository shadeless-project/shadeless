import { Tooltip } from "@chakra-ui/react";

type Props = {
  label: string;
  children: any;
}
export default function MyTooltip(props: Props) {
  const { label, children } = props;
  return (
    <Tooltip
      placement="top" fontSize="2xs" label={label}
    >
      {children}
    </Tooltip>
  );
}