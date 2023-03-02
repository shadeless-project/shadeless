import { FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, Tooltip, useToast } from "@chakra-ui/react";
import React from "react";
import { createProject } from "src/libs/apis/projects";
import { notify } from "src/libs/notify";
import RequiredTooltip from "../common/required-tooltip";
import SubmitButton from "../common/submit-button";

type DeleteModalProjectProps = {
  isOpen: boolean;
  onClose: () => void;
  callback: (...args: any[]) => any;
}
export default function AddProjectModal(props: DeleteModalProjectProps) {
  const { isOpen, onClose, callback } = props;
  const toast = useToast();

  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function uiCreateProject() {
    setIsSubmitting(true);
    setError('');
    const name = (document.getElementById('create-project-name') as HTMLInputElement).value;
    const description = (document.getElementById('create-project-description') as HTMLInputElement).value;
    const resp = await createProject({ name, description });
    notify(toast, resp);

    setIsSubmitting(false);
    if (resp.statusCode === 200) {
      onClose();
      callback();
    } else {
      setError('Error: project name has prohibitted characters');
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adding project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormLabel
            mt="15px"
            fontSize="md"
            fontWeight="600"
          >
            Project name&nbsp;
            <RequiredTooltip />
          </FormLabel>
          <Input
            bg="custom.white"
            id="create-project-name"
            size="md"
            mt="-3px"
            fontSize="sm"
            placeholder="viettel"
            _placeholder={{opacity: '0.6'}}
          />
          <FormLabel
            mt="10px"
            fontSize="md"
            fontWeight="600"
          >
            Description
          </FormLabel>
          <Textarea
            rows={6}
            bg="custom.white"
            id="create-project-description"
            size="md"
            mt="-3px"
            fontSize="sm"
            placeholder="- Scope: https://tuyendung.viettel.vn/..."
            _placeholder={{opacity: '0.6'}}
          />

          <Text mt="15px" fontWeight="500" color="red.600">{error}</Text>
        </ModalBody>

        <ModalFooter>
          <SubmitButton
            onClick={uiCreateProject}
            isSubmitting={isSubmitting}
          >
            Create
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
