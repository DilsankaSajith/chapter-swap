import {
  Box,
  Text,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Input,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Button,
  useDisclosure,
  VStack,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import UserSuggests from "../components/UserSuggests";
import Book from "../components/Book";
import SearchResult from "../components/SearchResult";
import { useState } from "react";
import { useGetBooksQuery } from "../slices/booksApiSlice";
import { useParams } from "react-router-dom";
import SearchBox from "../components/SearchBox";

const HomeScreen = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const { keyword } = useParams();

  const { data: books, isLoading, error } = useGetBooksQuery({ keyword });

  const { isOpen, onClose, onOpen } = useDisclosure();

  const getSearchedBooks = async () => {
    setIsLoadingApi(true);
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=AIzaSyAZSylKGokr4-0iwOB8RNAD1LgilQxnHlw`
    );
    setIsLoadingApi(false);
    setSearchedBooks(data.items);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.dark">
          <ModalHeader>Add Book with Google Books API</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Search a book..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              bg="accent.default"
              _hover={{ bg: "accent.event" }}
              color="black"
              width="full"
              onClick={() => getSearchedBooks()}
              borderRadius="sm"
            >
              Search
            </Button>
          </ModalFooter>

          {searchedBooks.length >= 0 ? (
            <Box py="16px" px="24px">
              <Text>Search Results (Most relevent results shown first)</Text>
              <Divider padding="10px" />
              <VStack maxHeight="sm" overflow="scroll">
                {isLoadingApi ? (
                  <Spinner p="24px" m="64px" />
                ) : (
                  searchedBooks.map((searchedBook) => (
                    <SearchResult
                      key={searchedBook.id}
                      searchedBook={searchedBook}
                      onClose={onClose}
                    />
                  ))
                )}
              </VStack>
            </Box>
          ) : (
            <Text py="16px" px="24px">
              Search for a book
            </Text>
          )}
        </ModalContent>
      </Modal>
      {isLoading ? (
        <Spinner p="24px" m="64px" />
      ) : error ? (
        <Text>{error.data?.message}</Text>
      ) : (
        <Box>
          <Flex alignItems="center" justifyContent="space-between" mb="3">
            <Text fontSize="3xl" fontWeight="medium" mb={8}>
              Latest Books
            </Text>
            <Flex
              alignItems="center"
              justifyContent="center"
              width="50px"
              height="50px"
              bg="accent.default"
              borderRadius="full"
              cursor="pointer"
              _hover={{ bg: "accent.event" }}
              color="black"
              transition="ease 0.2s"
              onClick={onOpen}
            >
              <FaPlus className="nav-icon" />
            </Flex>
          </Flex>
          <SearchBox />

          <Grid templateColumns="repeat(6, 1fr)" gap="32px">
            <GridItem colSpan={{ base: 6, lg: 4 }}>
              <SimpleGrid columns={4} gap="10px" minChildWidth="150px">
                {!books.length ? (
                  <Text fontSize="xl">No search results</Text>
                ) : (
                  books.map((book) => <Book key={book.id} book={book} />)
                )}
              </SimpleGrid>
            </GridItem>

            <GridItem as="aside" colSpan={{ base: 6, lg: 2 }}>
              <UserSuggests />
            </GridItem>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default HomeScreen;
