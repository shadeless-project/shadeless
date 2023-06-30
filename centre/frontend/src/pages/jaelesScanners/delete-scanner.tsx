import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { notify } from "src/libs/notify";
import SubmitButton from "../common/submit-button";
import { JaelesScanner, deleteScanner } from "src/libs/apis/jaeles";

type Props = {
  isOpen: boolean;
  onClose: (...args: any[]) => any;
  deletingScanner: JaelesScanner;
  callback: (...args: any[]) => any;
}
export default function DeleteScannerModal (props: Props) {
  const { isOpen, onClose, deletingScanner, callback } = props;

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function uiDeleteScanner() {
    setIsSubmitting(true);
    const resp = await deleteScanner(deletingScanner._id || '');
    setIsSubmitting(false);

    notify(toast, resp);
    if (resp.statusCode === 200) {
      onClose();
      callback();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Deleting account
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="sm">
          <Text fontSize="md">Are you sure to delete scanner <strong>{deletingScanner.name}</strong> ?</Text>
          <Text fontSize="sm" opacity=".7" mt="15px">This action is not reversible</Text>
        </ModalBody>

        <ModalFooter>
          <SubmitButton
            colorScheme='red'
            onClick={uiDeleteScanner}
            isSubmitting={isSubmitting}
          >
            Delete
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
