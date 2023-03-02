import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { Account, AccountRole, deleteAccount } from "src/libs/apis/account";
import { notify } from "src/libs/notify";
import SubmitButton from "../common/submit-button";

type Props = {
  isOpen: boolean;
  onClose: (...args: any[]) => any;
  deletingAccount: Account;
  callback: (...args: any[]) => any;
}
export default function DeleteAccountModal (props: Props) {
  const { isOpen, onClose, deletingAccount, callback } = props;

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function uiDeleteAccount() {
    setIsSubmitting(true);
    const resp = await deleteAccount(deletingAccount._id || '');
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
          <Text fontSize="md">Are you sure to delete account <strong>{deletingAccount.username}</strong> ?</Text>
          <Text fontSize="sm" opacity=".7" mt="15px">This action is not reversible</Text>
        </ModalBody>

        <ModalFooter>
          <SubmitButton
            colorScheme='red'
            onClick={uiDeleteAccount}
            disabled={window.getUserRole() === AccountRole.ADMIN ? false : true}
            isSubmitting={isSubmitting}
          >
            Delete
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
