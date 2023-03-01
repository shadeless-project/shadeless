import { SmallCloseIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, RenderProps } from '@chakra-ui/react';
import { ApiResponse } from './apis/types';

const HTTP_STATUS_OK = 200;

export function notify<T>(toast: any, response: ApiResponse<T>, id: string = 'default') {
  const status = (response.statusCode === HTTP_STATUS_OK) ? 'success' : 'error';
  const title = (status === 'success') ? 'Success' : 'Error';
  let description = (status === 'success') ? response.data : response.error;
  if (description === 'Bad Request') description = (response.data as any)[0];
  if (!(toast.isActive(id))) {
    toast({
      position: 'top-right',
      id,
      title,
      status,
      description,
      duration: 4000,
      render: (props: RenderProps) => {
        return (
          <Box
            boxShadow="md"
            borderRadius="3px"
            p={3}
            fontSize="xs"
            color="white"
            fontWeight="600"
            {...props.status === 'success' ? {
              bg: "green.500",
            } : {
              bg: "red.500",
            }}
          >
            {props.description}
            <Button
              ml="15px"
              bg="inherit"
              size="2xs"
              onClick={props.onClose}
              float="right"
              _hover={{ opacity: '.5' }}
            >
              <SmallCloseIcon />
            </Button>
          </Box>
        );
      },
    });
  }
}
