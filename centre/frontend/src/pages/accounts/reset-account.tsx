import { FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { Account, AccountRole, resetPasswordAccount } from "src/libs/apis/account";
import { notify } from "src/libs/notify";
import RequiredTooltip from "../common/required-tooltip";
import SubmitButton from "../common/submit-button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  callback: (...args: any[]) => any;
  account: Account;
}
export default function ResetPasswordAccountModal(props: Props) {
  const { isOpen, onClose, callback, account } = props;

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function uiResetPassword() {
    setIsSubmitting(true);
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const passwordRecheck = (document.getElementById('password-recheck') as HTMLInputElement).value;
    const resp = await resetPasswordAccount(account._id || '', password, passwordRecheck);
    notify(toast, resp);
    setIsSubmitting(false);
    if (resp.statusCode === 200) {
      callback();
      onClose();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Resetting password
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="sm">
          <FormLabel fontSize="sm">
            Username
          </FormLabel>
          <Input
            size="md"
            mt="-3px"
            fontSize="xs"
            placeholder="admin"
            _placeholder={{opacity: '0.6'}}
            defaultValue={account.username}
            disabled
          />
          <FormLabel mt="17px" fontSize="sm">
            Email&nbsp;
          </FormLabel>
          <Input
            mt="-3px"
            size="md"
            fontSize="xs"
            placeholder="default@mail.com"
            defaultValue={account.email}
            disabled
          />

          <FormLabel mt="17px" fontSize="sm">
            New password&nbsp;
            <RequiredTooltip />
          </FormLabel>
          <Input
            id="password"
            type="password"
            mt="-3px"
            size="md"
            placeholder="***********"
          />
          <FormLabel mt="17px" fontSize="sm">
            New password recheck&nbsp;
            <RequiredTooltip />
          </FormLabel>
          <Input
            id="password-recheck"
            type="password"
            mt="-3px"
            size="md"
            placeholder="***********"
          />
        </ModalBody>

        <ModalFooter>
          <SubmitButton
            onClick={uiResetPassword}
            isSubmitting={isSubmitting}
          >
            Reset
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
