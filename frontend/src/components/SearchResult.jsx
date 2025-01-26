import { Flex, Image, VStack, Text, Button, useToast } from "@chakra-ui/react";
import React from "react";

const SearchResult = ({ searchedBook, onClose }) => {
  const toast = useToast();

  const createBook = () => {
    console.log(searchedBook);
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
          <Text color="gray.500">{searchedBook.volumeInfo.authors}</Text>
        </VStack>
      </Flex>
      <Button colorScheme="blue" mr="8px" onClick={createBook}>
        Add
      </Button>
    </Flex>
  );
};

export default SearchResult;
