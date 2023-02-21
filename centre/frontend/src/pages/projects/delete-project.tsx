import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useToast } from "@chakra-ui/react";
import { deleteProject, Project } from "src/libs/apis/projects";
import { notify } from "src/libs/notify";

type DeleteModalProjectProps = {
  deletingProject: Project;
  isOpen: boolean;
  onClose: () => void;
  callback: (...args: any[]) => any;
}
export default function DeleteProjectModal(props: DeleteModalProjectProps) {
  const { isOpen, onClose, deletingProject, callback } = props;
  const toast = useToast();

  async function uiDeleteProject() {
    const resp = await deleteProject(deletingProject.name);
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
        <ModalHeader>Deleting project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="xl">Are you sure to delete project <strong>{deletingProject.name}</strong> ?</Text>
          <Text mt="10px" fontSize="sm">This will remove all data of {deletingProject.name} !</Text>

        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' onClick={uiDeleteProject}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
