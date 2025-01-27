import { Flex, Image, VStack, Text, Button, useToast } from "@chakra-ui/react";
import axios from "axios";

const SearchResult = ({ searchedBook, onClose }) => {
  const toast = useToast();

  const newBook = {
    isbn: searchedBook.volumeInfo.industryIdentifiers?.[0].identifier,
    title: searchedBook.volumeInfo.title,
    author: searchedBook.volumeInfo.authors?.[0],
    description: searchedBook.volumeInfo.description,
    image: searchedBook.volumeInfo.imageLinks?.thumbnail,
    category: searchedBook.volumeInfo.categories?.[0],
  };

  const createBook = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      await axios.post("/api/books", newBook, config);
    } catch (error) {
      console.log(error.message);
    }
    toast({
      title: "Book added.",
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
        Add
      </Button>
    </Flex>
  );
};

export default SearchResult;
