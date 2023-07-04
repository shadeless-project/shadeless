import { Box, Code, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, Textarea, useToast } from "@chakra-ui/react";
import React from "react";
import { notify } from "src/libs/notify";
import SubmitButton from "../common/submit-button";
import { JaelesScanner, editScanner, getAllSignatures } from "src/libs/apis/scanners";

type Props = {
  isOpen: boolean;
  onClose: (...args: any[]) => any;
  scanner: JaelesScanner;
  callback: (...args: any[]) => any;
}
export default function EditScannerModal (props: Props) {
  const { isOpen, onClose, scanner, callback } = props;

  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [scanKeyword, setScanKeyword] = React.useState(scanner.scanKeyword);
  const [signatures, setSignatures] = React.useState<string[]>([]);
  const [showingSignatures, setShowingSignatures] = React.useState<string[]>([]);

  React.useEffect(() => { setScanKeyword(scanner.scanKeyword) }, [scanner.scanKeyword])

  async function uiLoadSignatures() {
    const resp = await getAllSignatures();
    if (resp.statusCode === 200) {
      setSignatures(resp.data);
    } else {
      notify(toast, resp);
    }
  }

  async function uiEditScanner() {
    setIsSubmitting(true);
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLInputElement).value;
    const resp = await editScanner(scanner._id || '', name, description, scanKeyword);
    setIsSubmitting(false);
    notify(toast, resp);
    if (resp.statusCode === 200) {
      onClose();
      callback();
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
          Edit scanner <strong>{scanner.name}</strong>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="sm">
          <FormLabel fontSize="sm">
            Name
          </FormLabel>
          <Input
            id="name"
            size="md"
            mt="-3px"
            fontSize="xs"
            placeholder={scanner.name}
            _placeholder={{opacity: '0.6'}}
            defaultValue={scanner.name}
          />
          <FormLabel mt="17px" fontSize="sm">
            Description
          </FormLabel>
          <Textarea
            id="description"
            mt="-3px"
            size="xs"
            defaultValue={scanner.description}
            placeholder="Purpose of this account is ..."
          />
          <FormLabel fontSize="sm">
            Scan keyword
          </FormLabel>
          <Input
            id="scanKeyword"
            size="md"
            mt="-3px"
            fontSize="xs"
            placeholder={scanner.scanKeyword}
            _placeholder={{opacity: '0.6'}}
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
            onClick={uiEditScanner}
            isSubmitting={isSubmitting}
          >
            Edit
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
