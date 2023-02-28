import { QuestionIcon } from "@chakra-ui/icons";
import { Checkbox, Code, Divider, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, Tooltip, useToast } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Censor, editCensor } from "src/libs/apis/censors";
import { notify } from "src/libs/notify";
import SubmitButton from "../common/submit-button";
import { LoggerContext } from "../LoggerApp/LoggerAppContext";

type Props = {
  isOpen: boolean;
  onClose: () => any;
  callback: (...args: any[]) => any;
  editingCensor: Censor;
}
export default function EditCensorModal(props: Props) {
  const { isOpen, onClose, editingCensor, callback } = props;
  const toast = useToast();

  const currentProject = useContext(LoggerContext);
  const [censorMethod, setCensorMethod] = React.useState('');
  const [censorOrigin, setCensorOrigin] = React.useState('');
  const [censorPath, setCensorPath] = React.useState('');
  const [censorDescription, setCensorDescription] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setCensorMethod(editingCensor.condition.method);
    setCensorOrigin(editingCensor.condition.origin);
    setCensorPath(editingCensor.condition.path);
    setCensorDescription(editingCensor.description);
  }, [editingCensor]);

  async function uiEditCensor() {
    setIsSubmitting(true);
    const resp = await editCensor(editingCensor._id || '', {
      method: censorMethod,
      origin: censorOrigin,
      path: censorPath,
    }, censorDescription);
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
          Editing censor
          <Text as="span" cursor="pointer">
          &nbsp;
          <Tooltip fontSize="2xs" label="Packets matched with below conditions will have their body censored in logs. This prevent username/password leak to other collaborators" aria-label='Filter tutorial'>
            <QuestionIcon />
          </Tooltip>
        </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="sm">
          <Text
            mb="3px"
            fontWeight="700"
          >
            Method&nbsp;
            <Tooltip placement="top" fontSize="2xs" label="Required"><Text as="span" color="red.600">*</Text></Tooltip>
          </Text>
          <Input
            size="sm"
            placeholder="GET"
            value={censorMethod}
            onChange={(e) => setCensorMethod(e.target.value)}
          />

          <Text
            mt="10px"
            mb="3px"
            fontWeight="700"
          >
            Origin&nbsp;
            <Tooltip placement="top" fontSize="2xs" label="Required"><Text as="span" color="red.600">*</Text></Tooltip>
          </Text>
          <Input
            size="sm"
            placeholder={`https://${currentProject || 'viettel'}.com`}
            value={censorOrigin}
            onChange={(e) => setCensorOrigin(e.target.value)}
          />

          <Text
            mt="10px"
            mb="3px"
            fontWeight="700"
          >
            Path&nbsp;
            <Tooltip placement="top" fontSize="2xs" label="Required"><Text as="span" color="red.600">*</Text></Tooltip>
          </Text>
          <Input
            size="sm"
            placeholder="/auth/login"
            value={censorPath}
            onChange={(e) => setCensorPath(e.target.value)}
          />

          <Divider mt="20px" mb="5px" />
          <Text>This will censor packets that has:</Text>
          <Code
            p="5px"
            mt="5px"
            fontSize="xs"
          >
            method == '{censorMethod}' && origin == '{censorOrigin}' && path == '{censorPath}'
          </Code>

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
            id="create-censor-description"
            size="md"
            mt="-3px"
            fontSize="sm"
            placeholder="This endpoint is login for SSO"
            _placeholder={{opacity: '0.6'}}
          />
          <Checkbox
            mt="20px"
            // isChecked={editingCensor.type} TODO
            onChange={(e) => {
              if (currentProject === '') alert('Could not unset this because you are at setting page');
              else setIsCensorAllProject(e.target.checked)
            }}
          >
            <Text fontSize="sm">Apply this censor for all projects</Text>
          </Checkbox>
        </ModalBody>

        <ModalFooter>
          <SubmitButton
            mr={3}
            isSubmitting={isSubmitting}
            onClick={uiCreateCensor}
          >
            Submit
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
