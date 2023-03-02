import { FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, Textarea, useToast } from "@chakra-ui/react";
import React from "react";
import { Account, AccountRole, deleteAccount, editAccount } from "src/libs/apis/account";
import { notify } from "src/libs/notify";
import RequiredTooltip from "../common/required-tooltip";
import SubmitButton from "../common/submit-button";

type Props = {
  isOpen: boolean;
  onClose: (...args: any[]) => any;
  account: Account;
  callback: (...args: any[]) => any;
}
export default function EditAccountModal (props: Props) {
  const { isOpen, onClose, account, callback } = props;

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function uiEditAccount() {
    setIsSubmitting(true);
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLInputElement).value;
    const role = (document.getElementById('role') as HTMLInputElement).value;
    const resp = await editAccount(account._id || '', username, email, description, role as AccountRole);
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
          Edit account <strong>{account.username}</strong>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="sm">
          <FormLabel fontSize="sm">
            Username
          </FormLabel>
          <Input
            id="username"
            size="md"
            mt="-3px"
            fontSize="xs"
            placeholder={account.username}
            _placeholder={{opacity: '0.6'}}
            defaultValue={account.username}
          />
          <FormLabel mt="17px" fontSize="sm">
            Email
          </FormLabel>
          <Input
            id="email"
            mt="-3px"
            size="md"
            fontSize="xs"
            placeholder="default@mail.com"
            defaultValue={account.email}
          />
          <FormLabel mt="17px" fontSize="sm">
            Description
          </FormLabel>
          <Textarea
            id="description"
            mt="-3px"
            size="xs"
            defaultValue={account.description}
            placeholder="Purpose of this account is ..."
          />
          <FormLabel mt="17px" fontSize="sm">
            Role&nbsp;
            <RequiredTooltip />
          </FormLabel>
          <Select id="role" w="150px" defaultValue={account.role}>
            <option value={AccountRole.NORMAL}>{AccountRole.NORMAL}</option>
            <option value={AccountRole.ADMIN}>{AccountRole.ADMIN}</option>
          </Select>
        </ModalBody>

        <ModalFooter>
          <SubmitButton
            onClick={uiEditAccount}
            isSubmitting={isSubmitting}
          >
            Edit
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
