import { useParams } from "react-router-dom";
import { useGetOtherProfileQuery } from "../slices/usersApiSlice";
import {
  Box,
  Flex,
  Avatar,
  Text,
  HStack,
  VStack,
  Spinner,
  Grid,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/react";
import Book from "../components/Book";
import { useGetBooksQuery } from "../slices/booksApiSlice";
import { useEffect, useState } from "react";

const UserProfileScreen = () => {
  const { id: profileId } = useParams();
  const { data: userData, isLoading: loadingUserData } =
    useGetOtherProfileQuery(profileId);
  const { data: books, isLoading: loadingBooks } = useGetBooksQuery("");
  const [ownBooks, setOwnBooks] = useState([]);

  useEffect(() => {
    if (books) {
      const myBooks = books.filter((book) => book.user === profileId);
      setOwnBooks(myBooks);
    }
  }, [books]);

  return (
    <div>
      {loadingUserData || loadingBooks ? (
        <Spinner />
      ) : (
        <Flex
          direction={{ base: "column", md: "row" }}
          gap="10px"
          justifyContent="space-between"
        >
          <Box
            display="flex"
            alignItems="center"
            flexDir="column"
            bg="gray.dark"
            p={6}
            borderRadius="md"
            border="1px"
            borderColor="gray.light"
          >
            <Box position="relative">
              <Avatar
                size="2xl"
                name={userData.name}
                src={userData.profilePicture}
                mb={3}
              />
              {/* <EditProfileButton /> */}
            </Box>
            <Text fontSize="2xl" fontWeight="medium">
              {userData.name}
            </Text>
            <Text color="gray.500">
              {userData.email} | {userData.phone}
            </Text>
            <Text color="gray.500">
              {userData.address}, {userData.city}, {userData.state}
            </Text>

            <HStack alignItems="center" gap={4} my={6}>
              <VStack alignItems="center" gap="-10px">
                <Text fontSize="2xl">{userData.points}</Text>
                <Text>Points</Text>
              </VStack>
              <Text fontSize="3xl" fontWeight="thin">
                |
              </Text>
              <VStack alignItems="center" gap="-10px">
                <Text fontSize="2xl">{userData.followers.length}</Text>
                <Text>Followers</Text>
              </VStack>
              <Text fontSize="3xl" fontWeight="thin">
                |
              </Text>
              <VStack alignItems="center" gap="-10px">
                <Text fontSize="2xl">{userData.follwings.length}</Text>
                <Text>Followings</Text>
              </VStack>
            </HStack>
          </Box>

          <Grid templateColumns="repeat(6, 1fr)" gap="32px" width="full">
            <GridItem colSpan={{ base: 6, lg: 4 }}>
              <SimpleGrid columns={4} gap={3}>
                {!ownBooks.length ? (
                  <Text fontSize="xl">No Books Added Yet</Text>
                ) : (
                  ownBooks.map((book) => <Book key={book.id} book={book} />)
                )}
              </SimpleGrid>
            </GridItem>
          </Grid>
        </Flex>
      )}
    </div>
  );
};

export default UserProfileScreen;
