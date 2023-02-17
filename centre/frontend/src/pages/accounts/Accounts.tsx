import { useDisclosure, useToast } from '@chakra-ui/react';
import React from 'react';
import { getAllAccounts } from 'src/libs/apis/account';

export default function AccountPage() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCensorAllProject, setIsCensorAllProject] = React.useState(false);

  const [censorMethod, setCensorMethod] = React.useState('');
  const [censorOrigin, setCensorOrigin] = React.useState('');
  const [censorPath, setCensorPath] = React.useState('');

  const { isOpen: isOpenModalDel, onOpen: onOpenModalDel, onClose: onCloseModalDel } = useDisclosure();
  const [deletingCensor, setDeletingCensor] = React.useState<Censor>(defaultCensor);

  async function uiLoadAccounts() {
    setIsLoading(true);
    const resp = await getAllAccounts();
    setIsLoading(false);
    if (resp.statusCode === 200) {
      setCensors(resp.data);
    } else {
      notify(toast, resp);
    }
  }

  return (
    <>
      ACcount
    </>
  );
}
