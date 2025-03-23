import { Box, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      px={2}
      py={1}
      borderRadius="sm"
      m={1}
      bg={"accent.default"}
      cursor="pointer"
      onClick={handleFunction}
      color="black"
      minW="100px"
    >
      <Text fontSize="sm">{user.name}</Text>
      <CloseIcon fontSize="xs" />
    </Box>
  );
};

export default UserBadgeItem;
