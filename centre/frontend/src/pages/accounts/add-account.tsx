import { FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, Textarea, useToast } from "@chakra-ui/react";
import React from "react";
import { AccountRole, createNewAccount } from "src/libs/apis/account";
import { notify } from "src/libs/notify";
import RequiredTooltip from "../common/required-tooltip";
import SubmitButton from "../common/submit-button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  callback: (...args: any[]) => any;
}
export default function AddAccountModal(props: Props) {
  const { isOpen, onClose, callback } = props;

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function uiCreateAccount() {
    setIsSubmitting(true);
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const passwordRecheck = (document.getElementById('password-recheck') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLInputElement).value;
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const resp = await createNewAccount(
      username,
      password,
      passwordRecheck,
      email,
      description,
      role as AccountRole
    );
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
          Adding new account
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="sm">
          <FormLabel fontSize="sm">
            Username&nbsp;
            <RequiredTooltip />
          </FormLabel>
          <Input
            id="username"
            size="md"
            mt="-3px"
            fontSize="xs"
            placeholder="admin"
            _placeholder={{opacity: '0.6'}}
          />
          <FormLabel mt="17px" fontSize="sm">
            Password&nbsp;
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
            Password recheck&nbsp;
            <RequiredTooltip />
          </FormLabel>
          <Input
            id="password-recheck"
            type="password"
            mt="-3px"
            size="md"
            placeholder="***********"
          />
          <FormLabel mt="17px" fontSize="sm">
            Email&nbsp;
          </FormLabel>
          <Input
            id="email"
            mt="-3px"
            size="md"
            placeholder="default@mail.com"
          />
          <FormLabel mt="17px" fontSize="sm">
            Description
          </FormLabel>
          <Textarea
            id="description"
            mt="-3px"
            size="xs"
            placeholder="Purpose of this account is ..."
          />
          <FormLabel mt="17px" fontSize="sm">
            Role&nbsp;
            <RequiredTooltip />
          </FormLabel>
          <Select id="role" w="150px">
            <option value={AccountRole.NORMAL}>{AccountRole.NORMAL}</option>
            <option value={AccountRole.ADMIN}>{AccountRole.ADMIN}</option>
          </Select>
        </ModalBody>

        <ModalFooter>
          <SubmitButton
            onClick={uiCreateAccount}
            isSubmitting={isSubmitting}
          >
            Submit
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
