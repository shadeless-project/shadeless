import { Button, ButtonProps, Spinner } from '@chakra-ui/react';

interface SubmitBtnProps extends ButtonProps {
  onClick: () => void;
  isSubmitting?: boolean;
  submittingText?: string;
}
function SubmitButton (props: SubmitBtnProps) {
  const { isSubmitting, submittingText, colorScheme } = props;
  const submitText = submittingText || "Submitting";
  return (
    <Button
      {...!colorScheme && {
        bg:"custom.black",
        color:"custom.white",
        _hover: {
          opacity: '.7'
        },
        _active:{
          opacity: '.5'
        }
      }}
      {...props}
      isLoading={isSubmitting}
      loadingText={submitText}
    >
      {isSubmitting && <Spinner />}{props.children}
    </Button>
  );
}

export default SubmitButton;
