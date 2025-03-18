import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import FollowUser from "./FollowUser";
import { useGetAllUsersQuery } from "../slices/usersApiSlice";
import { useSelector } from "react-redux";

const UserSuggests = () => {
  const { userInfo } = useSelector((store) => store.auth);
  const { data: users, isLoading, error } = useGetAllUsersQuery();

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

      {isLoading ? (
        <Spinner />
      ) : (
        <VStack gap="16px">
          {users
            .filter((user) => user._id !== userInfo?._id)
            .map((user) => (
              <FollowUser key={user._id} user={user} />
            ))}
        </VStack>
      )}
    </Box>
  );
};

export default UserSuggests;
