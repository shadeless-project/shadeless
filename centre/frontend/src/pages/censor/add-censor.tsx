import { QuestionIcon } from "@chakra-ui/icons";
import { Checkbox, Code, Divider, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, Tooltip, useToast } from "@chakra-ui/react";
import React, { useContext } from "react";
import { createCensor } from "src/libs/apis/censors";
import { notify } from "src/libs/notify";
import { useLocation } from "wouter";
import RequiredTooltip from "../common/required-tooltip";
import SubmitButton from "../common/submit-button";
import MyTooltip from "../common/tooltip";
import { LoggerContext } from "../LoggerApp/LoggerAppContext";

type Props = {
  isOpen: boolean;
  onOpen: () => any;
  onClose: () => any;
  callback: (...args: any[]) => any;
}
export default function AddCensorModal(props: Props) {
  const { isOpen, onClose, callback, onOpen } = props;

  const toast = useToast();
  const myLocation = useLocation()[0];
  const currentProject = useContext(LoggerContext);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [censorMethod, setCensorMethod] = React.useState('');
  const [censorOrigin, setCensorOrigin] = React.useState('');
  const [censorPath, setCensorPath] = React.useState('');
  const [isCensorAllProject, setIsCensorAllProject] = React.useState(false);

  async function uiCreateCensor() {
    setIsSubmitting(true);
    const resp = await createCensor(
      currentProject,
      {
        method: censorMethod,
        origin: censorOrigin,
        path: censorPath,
      },
      (document.getElementById('create-censor-description') as HTMLInputElement).value || '',
      isCensorAllProject,
    );
    setIsSubmitting(false);
    notify(toast, resp);
    if (resp.statusCode === 200) {
      callback();
      onClose();
    }
  }

  React.useEffect(() => {
    function loadCensorOnUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.toString() !== '') {
        setCensorMethod(urlParams.get('censorMethod') || '');
        setCensorOrigin(urlParams.get('censorOrigin') || '');
        setCensorPath(urlParams.get('censorPath') || '');
        window.history.pushState({}, '', location.pathname);
        setTimeout(onOpen, 150);
      }
    }
    loadCensorOnUrl();
    if (currentProject === '') setIsCensorAllProject(true);
  }, [currentProject, myLocation]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Adding censor
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
            <RequiredTooltip />
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
            <RequiredTooltip />
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
            <RequiredTooltip />
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
            _placeholder={{ opacity: '0.6' }}
          />
          <Checkbox
            mt="20px"
            isChecked={isCensorAllProject}
            isDisabled={currentProject === ''}
            onChange={(e) => setIsCensorAllProject(e.target.checked)}
          >
            <MyTooltip label={currentProject === '' ? "Please go to project specific to apply censor for that project" : ''}>
              <Text fontSize="sm">Apply this censor for all projects</Text>
            </MyTooltip>
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
