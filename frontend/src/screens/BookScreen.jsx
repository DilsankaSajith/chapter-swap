import {
  Spinner,
  Box,
  Flex,
  Image,
  Text,
  Avatar,
  Button,
} from "@chakra-ui/react";
import { useGetBookDetailsQuery } from "../slices/booksApiSlice";
import { useParams } from "react-router-dom";
import Rating from "../components/Rating";
import { useSelector } from "react-redux";

const BookScreen = () => {
  const { userInfo } = useSelector((store) => store.auth);
  const { id: bookId } = useParams();

  const { data: book, isLoading, error } = useGetBookDetailsQuery(bookId);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Flex
          direction={{ base: "column", md: "row" }}
          alignItems={{ base: "center", md: "flex-start" }}
          gap={4}
          bg="gray.dark"
          p={6}
          borderRadius="md"
          border="1px"
          borderColor="gray.light"
        >
          <Box width="25%">
            <Image src={book.image} />
          </Box>
          <Box>
            <Text fontSize="2xl" fontWeight="medium">
              {book.title}
            </Text>
            <Text color="gray.500">
              {book.author} | {book.category}
            </Text>
            <Text color="gray.500" mt={4}>
              {book.description}
            </Text>
            <Rating value={book.rating} text={`${book.numReviews} reviews`} />

            <Flex alignItems="center" justifyContent="space-between">
              <Flex gap={2}>
                <Avatar
                  size="xs"
                  name={`${book.user?.name}`}
                  src={`${book.user?.profilePicture}`}
                />
                <Text>{book.user?.name}</Text>
              </Flex>
              {userInfo?._id === book.user?._id ? (
                <></>
              ) : (
                <Flex gap={2}>
                  <Button
                    bg="accent.default"
                    color="#000000"
                    size="sm"
                    _hover={{ bg: "accent.event" }}
                  >
                    Request this book
                  </Button>
                  <Button
                    variant="outline"
                    color="accent.default"
                    size="sm"
                    borderColor="accent.default"
                    _hover={{ bg: "accent.event", color: "#000000" }}
                  >
                    Add to favorites
                  </Button>
                </Flex>
              )}
            </Flex>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default BookScreen;
