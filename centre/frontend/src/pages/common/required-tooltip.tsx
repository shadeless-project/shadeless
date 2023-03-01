import { Text } from "@chakra-ui/react";
import MyTooltip from "./tooltip";

export default function RequiredTooltip() {
  return (
    <MyTooltip label="Required">
      <Text as="span" color="red.600">*</Text>
    </MyTooltip>
  );
}