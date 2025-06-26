import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Flex
      alignItems="center"
      gap="8px"
      p={4}
      _hover={{ bg: "gray.700" }}
      cursor="pointer"
      borderRadius="sm"
      onClick={handleFunction}
    >
      <Avatar src={user.profilePicture} name={user.name} size="md" />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="sm" color="gray.400">
          {user.email}
        </Text>
      </Box>
    </Flex>
  );
};

export default UserListItem;
