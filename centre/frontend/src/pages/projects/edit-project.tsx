import { FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, Tooltip, useToast } from "@chakra-ui/react";
import React from "react";
import { editProject, Project } from "src/libs/apis/projects";
import { notify } from "src/libs/notify";
import SubmitButton from "../common/submit-button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  callback: (...args: any[]) => any;
}
export default function EditProjectModal (props: Props) {
  const { isOpen, onClose, project, callback } = props;
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function uiEditProject() {
    setIsSubmitting(true);
    const description = (document.getElementById('edit-project-description') as HTMLInputElement).value;
    const resp = await editProject({ description }, project.name);
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
        <ModalHeader>Edit {}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        <FormLabel
            mt="15px"
            fontSize="md"
            fontWeight="600"
          >
            Name
          </FormLabel>
          <Input
            defaultValue={project.name}
            disabled
            fontSize="sm"
            _placeholder={{opacity: '0.6'}}
          />
          <FormLabel
            mt="15px"
            fontSize="md"
            fontWeight="600"
          >
            Description
          </FormLabel>
          <Textarea
            rows={6}
            bg="custom.white"
            size="md"
            id="edit-project-description"
            mt="-3px"
            defaultValue={project.description}
            fontSize="sm"
            placeholder="- Scope: https://tuyendung.viettel.vn/..."
            _placeholder={{opacity: '0.6'}}
          />
        </ModalBody>

        <ModalFooter>
          <SubmitButton
            onClick={uiEditProject}
            isSubmitting={isSubmitting}
          >
            Edit project
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
