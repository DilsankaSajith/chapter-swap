import { Avatar, Button, Flex, Text, VStack } from "@chakra-ui/react";

const UserSuggests = () => {
  return (
    <>
      <Text color="gray.500" fontSize="lg" fontWeight="medium" mb="3">
        Follow Users
      </Text>

      <VStack gap="16px">
        <Flex alignItems="center" justifyContent="space-between" width="full">
          <Flex alignItems="center" gap="8px">
            <Avatar src="/images/user.jpg" size="sm" />
            <Text>Jane Doe</Text>
          </Flex>
          <Button size="sm" colorScheme="blue">
            Follow
          </Button>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" width="full">
          <Flex alignItems="center" gap="8px">
            <Avatar src="/images//user.jpg" size="sm" />
            <Text>Jane Doe</Text>
          </Flex>
          <Button size="sm" colorScheme="blue">
            Follow
          </Button>
        </Flex>
      </VStack>
    </>
  );
};

export default UserSuggests;
