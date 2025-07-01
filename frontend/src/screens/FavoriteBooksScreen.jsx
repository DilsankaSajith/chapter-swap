import { GridItem, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { useGetFavoriteBooksQuery } from "../slices/booksApiSlice";
import Book from "../components/Book";

const FavoriteBooksScreen = () => {
  const { data: favoriteBooks, isLoading } = useGetFavoriteBooksQuery();

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Text fontSize="3xl" fontWeight="medium" mb={8}>
            Saved Books
          </Text>

          <GridItem colSpan={{ base: 6, lg: 3 }}>
            <SimpleGrid columns={{ base: 4, lg: 4 }} gap={3}>
              {!favoriteBooks.length ? (
                <Text fontSize="xl">No books added to favorites</Text>
              ) : (
                favoriteBooks.map((book) => <Book key={book.id} book={book} />)
              )}
            </SimpleGrid>
          </GridItem>
        </>
      )}
    </>
  );
};

export default FavoriteBooksScreen;
