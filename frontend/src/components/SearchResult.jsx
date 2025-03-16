import {
  Flex,
  Image,
  VStack,
  Text,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useCreateBookMutation } from "../slices/booksApiSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SearchResult = ({ searchedBook, onClose }) => {
  const [createBookAPI, { isLoading: loadingCreate }] = useCreateBookMutation();

  const toast = useToast();
  const navigate = useNavigate();

  const { userInfo } = useSelector((store) => store.auth);

  const newBook = {
    isbn: searchedBook.volumeInfo.industryIdentifiers?.[0].identifier,
    title: searchedBook.volumeInfo.title,
    author: searchedBook.volumeInfo.authors?.[0],
    description: searchedBook.volumeInfo.description,
    image: searchedBook.volumeInfo.imageLinks?.thumbnail,
    category: searchedBook.volumeInfo.categories?.[0],
  };

  const createBook = async () => {
    if (!userInfo) {
      toast({
        title: "You have to sign in to perform this action",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    await createBookAPI(newBook);
    toast({
      title: "Book added",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      width="full"
      mt="16px"
    >
      <Flex gap="10px" alignItems="flex-start">
        <Image
          src={searchedBook.volumeInfo?.imageLinks?.thumbnail}
          maxWidth="100px"
        />
        <VStack alignItems="flex-start" gap="1px">
          <Text fontWeight="medium">{searchedBook.volumeInfo.title}</Text>
          <Text color="gray.500">{searchedBook.volumeInfo.authors?.[0]}</Text>
        </VStack>
      </Flex>
      <Button colorScheme="blue" mr="8px" onClick={createBook}>
        {loadingCreate ? <Spinner /> : <Text>Add</Text>}
      </Button>
    </Flex>
  );
};

export default SearchResult;
