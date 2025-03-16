import { Avatar, Box, Button, Flex, Text, VStack } from "@chakra-ui/react";

const UserSuggests = () => {
  return (
    <Box
      bg="gray.dark"
      p={6}
      borderRadius="md"
      border="1px"
      borderColor="gray.light"
    >
      <Text color="gray.500" fontSize="lg" fontWeight="medium" mb="3">
        Follow Users
      </Text>

      <VStack gap="16px">
        <Flex alignItems="center" justifyContent="space-between" width="full">
          <Flex alignItems="center" gap="8px">
            <Avatar src="/images/user.jpg" size="sm" />
            <Text>Jane Doe</Text>
          </Flex>
          <Button
            borderRadius="sm"
            size="sm"
            bg="accent.default"
            _hover={{ bg: "accent.event" }}
            color="black"
          >
            Follow
          </Button>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" width="full">
          <Flex alignItems="center" gap="8px">
            <Avatar src="/images//user.jpg" size="sm" />
            <Text>Jane Doe</Text>
          </Flex>
          <Button
            borderRadius="sm"
            size="sm"
            bg="accent.default"
            _hover={{ bg: "accent.event" }}
            color="black"
          >
            Follow
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default UserSuggests;
