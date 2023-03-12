import { Box, SkeletonText, Text } from '@chakra-ui/react';
import React from 'react';

const MARK_OPENING = '<mark style="background-color: green; color: white; padding: 1px">';
const MARK_CLOSING = '</mark>';

type PacketBodyDetailProps = {
  error: string;
  content: string;
  reflected: any;
  isLoading: boolean;
  maxHeight: string;
}
export default function PacketBodyDetail(props: PacketBodyDetailProps) {
  const { content, reflected, isLoading, error, maxHeight } = props;
  const [htmlContent, setHtmlContent] = React.useState('');

  React.useEffect(() => {
    let contentResult = window.escapeHtml(content);
    const checkMarkedValue = new Map<string, boolean>();
    for (const key in reflected) {
      const val = reflected[key];
      if (!checkMarkedValue.get(val)) {
        checkMarkedValue.set(val, true);
        contentResult = contentResult.replaceAll(val, MARK_OPENING + val + MARK_CLOSING);
      }
    }
    setHtmlContent(contentResult);
  }, [content]);

  return (
    <Box
      maxHeight={maxHeight}
      p="10px"
      borderRight="1px solid black"
      overflowY="scroll"
      pb="5vh"
    >
      <Text
        whiteSpace='pre-wrap'
        wordBreak="break-word"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      >
      </Text>
      <SkeletonText display={isLoading ? 'block' : 'none'} noOfLines={5} />
      <Text color="red.700">
        {error}
      </Text>
    </Box>
  );
}
