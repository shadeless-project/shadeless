import { Box, Flex, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React from 'react';
import { notify } from 'src/libs/notify';
import SubmitButton from '../common/submit-button';
import { JaelesScanner, defaultJaelesScanner, getAllScanners } from 'src/libs/apis/scanners';
import ScannerTable from './scanner-table';
import DeleteScannerModal from './delete-scanner';
import AddScannerModal from './add-scanner';
import EditScannerModal from './edit-scanner';

export default function JaelesScannerPage() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scanners, setScanners] = React.useState<JaelesScanner[]>([]);

  const [editingScanner, setEditingScanner] = React.useState<JaelesScanner>(defaultJaelesScanner);
  const [deletingScanner, setDeletingScanner] = React.useState<JaelesScanner>(defaultJaelesScanner);
  const [isLoading, setIsLoading] = React.useState(true);

  const { isOpen: isOpenModalDel, onOpen: onOpenModalDel, onClose: onCloseModalDel } = useDisclosure();
  const { isOpen: isOpenEditModal, onOpen: onOpenEditModal, onClose: onCloseEditModal } = useDisclosure();

  async function uiLoadJaelesScanners() {
    setIsLoading(true);
    const resp = await getAllScanners();
    setIsLoading(false);
    if (resp.statusCode === 200) {
      setScanners(resp.data);
    } else {
      notify(toast, resp);
    }
  }
  React.useEffect(() => { uiLoadJaelesScanners() }, []);

  return (
    <Box
      p="10px"
      borderRadius="var(--component-border)"
      boxShadow="sm"
      bg="custom.white"
    >
      <Flex
        justifyContent="space-between"
        alignContent="center"
        alignItems="center"
        p="15px"
      >
        <Text
          as="h2"
          fontSize="3xl"
        >
          Jaeles Scanners {isLoading ? <Spinner ml="10px" /> : <Text as="span">({scanners.length})</Text>}
        </Text>
        <SubmitButton onClick={onOpen}>
          Add new scanner
        </SubmitButton>
      </Flex>

      <ScannerTable
        scanners={scanners}
        isLoading={isLoading}
        setDeletingScanner={setDeletingScanner}
        onOpenModalDel={onOpenModalDel}
        setEditingScanner={setEditingScanner}
        onOpenEditModal={onOpenEditModal}
      />

      <DeleteScannerModal
        isOpen={isOpenModalDel}
        onClose={onCloseModalDel}
        callback={uiLoadJaelesScanners}
        deletingScanner={deletingScanner}
      />

      <AddScannerModal
        isOpen={isOpen}
        onClose={onClose}
        callback={uiLoadJaelesScanners}
      />

      <EditScannerModal
        scanner={editingScanner}
        isOpen={isOpenEditModal}
        onClose={onCloseEditModal}
        callback={uiLoadJaelesScanners}
      />

    </Box>
  );
}
