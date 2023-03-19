import { Code, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { useContext } from "react";
import SubmitButton from "src/pages/common/submit-button";
import { LoggerDashboardContext } from "../../LoggerAppContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  confirmedDeleteCallback: () => Promise<void>;
  uniqueEndpointsToggle: boolean;
}
export default function DeleteVerification(props: Props) {
  const {
    isOpen,
    onClose,
    query,
    uniqueEndpointsToggle,
    confirmedDeleteCallback,
  } = props;

  const numPackets = useContext(LoggerDashboardContext);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Deleting packets
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="sm">
          {uniqueEndpointsToggle &&
            <Text color="red.300" mb="15px">
              Warning: you're applying `uniqueEndpoint` feature. The `uniqueEndpoint` feature removes look-alike packets, which might cause server to delete wrong packets.
            </Text>
          }

          <Text mb="3px">
            This action will delete matched packets:
          </Text>
          <Code
            p="5px"
            mt="5px"
            fontSize="xs"
          >
            {query || 'All packets'}
          </Code>
          <Text mt="8px">
            Which will delete a total of <strong>{numPackets}</strong> packets in database
          </Text>
        </ModalBody>

        <ModalFooter>
          <SubmitButton
            mr={3}
            onClick={confirmedDeleteCallback}
            colorScheme="red"
          >
            Confirm delete
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
