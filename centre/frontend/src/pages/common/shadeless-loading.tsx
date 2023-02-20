import { Box, Progress, Text } from "@chakra-ui/react";

export default function ShadelessLoading() {
  return (
    <Box
      position="absolute"
      top="40vh"
      left="25%"
      width="50%"
      m="auto"
    >
      <Text
        as="h2"
        fontSize="2xl"
        mb="7px"
        fontWeight="bold"
        textAlign="center"
      >
        Shadeless
      </Text>
      <Progress
        hasStripe
        colorScheme="black"
        isIndeterminate
      />
    </Box>
  )
}