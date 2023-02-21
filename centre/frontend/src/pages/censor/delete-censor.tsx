import { Code, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { AccountRole } from "src/libs/apis/account";
import { Censor, deleteCensor } from "src/libs/apis/censors";
import { notify } from "src/libs/notify";
import SubmitButton from "../common/submit-button";

type Props = {
  isOpen: boolean;
  onClose: () => any;
  deletingCensor: Censor;
  callback: (...args: any[]) => any;
}
export default function DeleteCensorModal(props: Props) {
  const { isOpen, onClose, deletingCensor, callback } = props;
  const toast = useToast();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function uiDeleteCensor() {
    setIsSubmitting(true);
    const resp = await deleteCensor(deletingCensor._id || '');
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
          Deleting modal (Admin only)
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="sm">
          <Text>Are you sure to delete censor for packets that has:</Text>
          <Code
            p="5px"
            mt="5px"
            fontSize="xs"
          >
            method == '{deletingCensor.condition.method}' && origin == '{deletingCensor.condition.origin}' && path == '{deletingCensor.condition.path}'
          </Code>
        </ModalBody>

        <ModalFooter>
          <SubmitButton
            onClick={uiDeleteCensor}
            disabled={window.getUserRole() === AccountRole.ADMIN ? false : true}
            colorScheme="red"
            isSubmitting={isSubmitting}
          >
            Delete
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
