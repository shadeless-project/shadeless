import { FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, Tooltip } from "@chakra-ui/react";
import React from "react";
import { editProject, Project } from "src/libs/apis/projects";
import SubmitButton from "../common/submit-button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  callback: (...args: any[]) => any;
}
export default function EditProjectModal (props: Props) {
  const { isOpen, onClose, project } = props;

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [edittingProject, setEdittingProject] = React.useState<Project>(project);

  async function uiEditProject() {
    setIsSubmitting(true);
    const resp = await editProject(edittingProject, edittingProject.name);
    setIsSubmitting(false);
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
            Description
          </FormLabel>
          <Textarea
            rows={6}
            bg="custom.white"
            size="md"
            mt="-3px"
            value={edittingProject.description}
            fontSize="sm"
            placeholder="- Scope: https://tuyendung.viettel.vn/..."
            _placeholder={{opacity: '0.6'}}
            onChange={(e) => console.log(e.target.value)}
          />
        </ModalBody>

        <ModalFooter>
          <SubmitButton
            onClick={uiEditProject}
            isSubmitting={isSubmitting}
          >
            Create
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
