import { Button, ButtonProps, Spinner } from '@chakra-ui/react';

interface SubmitBtnProps extends ButtonProps {
  onClick: () => void;
  isSubmitting?: boolean;
  submittingText?: string;
}
function SubmitButton (props: SubmitBtnProps) {
  const { isSubmitting, submittingText } = props;
  const submitText = submittingText || "Submitting";
  return (
    <Button
      {...props}
      isLoading={isSubmitting}
      loadingText={submitText}
    >
      {isSubmitting && <Spinner />}{props.children}
    </Button>
  );
}

export default SubmitButton;
