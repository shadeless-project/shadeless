import { QuestionIcon } from "@chakra-ui/icons";
import { Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip, useToast } from "@chakra-ui/react";
import React from "react";
import { notifyErr } from "src/libs/notify";
import RequiredTooltip from "src/pages/common/required-tooltip";
import SubmitButton from "src/pages/common/submit-button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initWeight: number;
  columnName: string;
  updateWeight: (title: string, newWeight: number) => void;
}
export default function LoggerColumnChooserModal(props: Props) {
  const { isOpen, onClose, initWeight, columnName, updateWeight } = props;

  const toast = useToast();
  const [weight, setWeight] = React.useState<string>('');

  React.useEffect(() => {
    setWeight(initWeight.toString());
  }, [initWeight]);

  function localUpdateWeight() {
    if ((+weight).toString() === weight) {
      updateWeight(columnName, +weight);
      onClose();
    } else {
      notifyErr(toast, 'Weight must be number >= 0');
    }
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Change `{columnName}` column weight
          <Text as="span" cursor="pointer">
            &nbsp;
            <Tooltip fontSize="2xs" label="Update the column weight. The logger table will show columns based on the weight from small to large">
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
            Weight&nbsp;
            <RequiredTooltip />
          </Text>
          <Input
            size="sm"
            placeholder="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('weight-update-btn')?.click() }}
          />
        </ModalBody>

        <ModalFooter>
          <SubmitButton
            id="weight-update-btn"
            mr={3}
            onClick={localUpdateWeight}
          >
            Submit
          </SubmitButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
