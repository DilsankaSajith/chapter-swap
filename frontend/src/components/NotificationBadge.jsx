import { Box, Text } from "@chakra-ui/react";

const NotificationBadge = ({ value }) => {
  return (
    <Box
      position="absolute"
      top="-1"
      right="-1"
      fontSize="0.7em"
      colorScheme="red"
      borderRadius="full"
      px="2"
      bg={"danger.event"}
      width="20px"
      height="20px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontWeight="bold">{value}</Text>
    </Box>
  );
};

export default NotificationBadge;
