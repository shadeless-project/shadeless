import { Box, Code, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, Textarea, useToast } from "@chakra-ui/react";
import React from "react";
import { notify } from "src/libs/notify";
import RequiredTooltip from "../common/required-tooltip";
import SubmitButton from "../common/submit-button";
import { createNewScanner, getAllSignatures } from "src/libs/apis/scanners";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  callback: (...args: any[]) => any;
}
export default function AddScannerModal(props: Props) {
  const { isOpen, onClose, callback } = props;

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [scanKeyword, setScanKeyword] = React.useState<string>('');
  const [signatures, setSignatures] = React.useState<string[]>([]);
  const [showingSignatures, setShowingSignatures] = React.useState<string[]>([]);

  async function uiLoadSignatures() {
    const resp = await getAllSignatures();
    if (resp.statusCode === 200) {
      setSignatures(resp.data);
    } else {
      notify(toast, resp);
    }
  }

  async function uiCreateScanner() {
    setIsSubmitting(true);
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLInputElement).value;
    const resp = await createNewScanner(
      name,
      description,
      scanKeyword,
    );
    notify(toast, resp);
    setIsSubmitting(false);
    if (resp.statusCode === 200) {
      callback();
      onClose();
    }
  }

  React.useEffect(() => { uiLoadSignatures() }, []);
  React.useEffect(() => {
    setShowingSignatures(signatures.filter(s => s.toLowerCase().includes(scanKeyword)));
  }, [signatures, scanKeyword])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Adding new scanner
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="sm">
          <FormLabel fontSize="sm">
            Name&nbsp;
            <RequiredTooltip />
          </FormLabel>
          <Input
            id="name"
            size="md"
            mt="-3px"
            fontSize="xs"
            placeholder="xss"
            _placeholder={{opacity: '0.6'}}
          />
          <FormLabel mt="17px" fontSize="sm">
            Description
          </FormLabel>
          <Textarea
            id="description"
            mt="-3px"
            size="xs"
            placeholder="A brief description for this scanner"
          />
          <FormLabel mt="17px" fontSize="sm">
            Scan keyword
            <RequiredTooltip />
          </FormLabel>
          <Input
            id="scanKeyword"
            mt="-3px"
            size="md"
            placeholder="sql"
            value={scanKeyword}
            onChange={(e) => setScanKeyword(e.target.value)}
          />
          <Text fontSize="sm" mt="17px" mb="5px">Run this scanner will trigger the following command:</Text>
          <Code fontSize="xs" p="2">jaeles scan -u &lt;target&gt; -L 4 -s "{scanKeyword}" -v</Code>
          <Text mt="17px" mb="5px" fontSize="sm">Which will run these signatures:</Text>
          <Box maxH="100px" overflow="auto" p="7px" border="1px solid" borderColor="custom.grey">
            {showingSignatures.map(sig =>
              <Text key={`add-scanner-signature-${sig}`}>{sig}</Text>
            )}
          </Box>


        </ModalBody>

        <ModalFooter>
          <SubmitButton
            onClick={uiCreateScanner}
            isSubmitting={isSubmitting}
          >
            Submit
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
