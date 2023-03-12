import { Button, ButtonProps, Text } from "@chakra-ui/react";

interface Props extends ButtonProps {
  isChecked: boolean;
  onClick: (...args: any[]) => any;
}
export default function OptionCheckBox(props: Props) {
  const { children, isChecked, onClick } = props;
  return (
    <Button
      {...props}
      color="white"
      borderRadius="2em"
      p="12px"
      fontSize="xs"
      onClick={onClick}
      _hover={{ opacity: '.6' }}
      _active={{ opacity: '.8' }}
    >
      <input
        type="checkbox"

        checked={isChecked}
        onChange={onClick}
        style={{"marginRight": "5px", cursor: "pointer", filter: "hue-rotate(210deg)"}}
      />
      <Text>{children}</Text>
    </Button>
  );
}
