import { Box, Skeleton, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import FollowUser from './FollowUser';
import { useGetAllUsersQuery } from '../slices/usersApiSlice';
import { useSelector } from 'react-redux';

const UserSuggests = () => {
  const { userInfo } = useSelector((store) => store.auth);
  const { data: users, isLoading, error } = useGetAllUsersQuery();

  return (
    <Box
      bg="gray.dark"
      p={6}
      borderRadius="sm"
      border="1px"
      borderColor="gray.light"
    >
      <Text color="gray.500" fontSize="lg" fontWeight="medium" mb="3">
        Follow Users
      </Text>

      {isLoading ? (
        <Stack>
          <Skeleton height="50px" />
          <Skeleton height="50px" />
          <Skeleton height="50px" />
          <Skeleton height="50px" />
        </Stack>
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
