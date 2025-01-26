import {
  Box,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Input,
  Flex,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import UserSuggests from "../components/UserSuggests";
import Book from "../components/Book";
import { useEffect, useState } from "react";

const HomeScreen = () => {
  const [books, setBooks] = useState([]);

  const getBooks = async () => {
    const { data } = await axios.get("/api/books");
    setBooks(data);
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <Box position="relative">
      <Flex alignItems="center" justifyContent="space-between" mb="3">
        <Heading as="h2" fontWeight="medium">
          Latest Books
        </Heading>
        <Flex
          alignItems="center"
          justifyContent="center"
          width="50px"
          height="50px"
          bg="gray.dark"
          borderRadius="full"
          cursor="pointer"
          _hover={{ bg: "gray.700" }}
          transition="ease 0.1s"
        >
          <FaPlus className="nav-icon" />
        </Flex>
      </Flex>
      <Input mb="6" placeholder="Search a book..." />

      <Grid templateColumns="repeat(6, 1fr)" gap="32px">
        <GridItem colSpan={{ base: 6, lg: 4 }}>
          <SimpleGrid columns={4} gap="10px" minChildWidth="150px">
            {books.map((book) => (
              <Book key={book.id} book={book} />
            ))}
          </SimpleGrid>
        </GridItem>

        <GridItem as="aside" colSpan={{ base: 6, lg: 2 }}>
          <UserSuggests />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default HomeScreen;
