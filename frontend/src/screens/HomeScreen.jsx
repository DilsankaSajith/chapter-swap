import {
  Box,
  Text,
  Grid,
  GridItem,
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
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa6';
import axios from 'axios';
import UserSuggests from '../components/UserSuggests';
import Book from '../components/Book';
import SearchResult from '../components/SearchResult';
import { useState } from 'react';
import {
  useCreateBookMutation,
  useGetBooksQuery,
} from '../slices/booksApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import ImageSlider from '../components/ImageSlider';

const HomeScreen = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // Add book manual states
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const { keyword } = useParams();
  const {
    data: books,
    isLoading,
    error,
    refetch,
  } = useGetBooksQuery({ keyword });
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenManual,
    onClose: onCloseManual,
    onOpen: onOpenManual,
  } = useDisclosure();
  const { userInfo } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const toast = useToast();

  const [createBookAPI, { isLoading: loadingCreate }] = useCreateBookMutation();

  const getSearchedBooks = async () => {
    setIsLoadingApi(true);
    const { data } = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=AIzaSyAZSylKGokr4-0iwOB8RNAD1LgilQxnHlw`
    );
    setIsLoadingApi(false);
    setSearchedBooks(data.items);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'chapterswap');
    data.append('cloud_name', 'deqbtjlgk');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/deqbtjlgk/image/upload',
      {
        method: 'POST',
        body: data,
      }
    );

    const uploadedImageURL = await res.json();
    setImage(uploadedImageURL.url);
    setUploadingImage(false);
  };

  const addBookManually = async () => {
    try {
      if (!userInfo) {
        toast({
          title: 'You have to sign in to perform this action',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
        return;
      }

      const newBook = {
        isbn,
        title,
        author,
        description,
        image,
        category,
      };

      await createBookAPI(newBook).unwrap();
      toast({
        title: 'Book added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onCloseManual();
      refetch();
    } catch (err) {
      toast({
        title: err?.data?.message || err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {/* Manual book adding model */}
      <Modal isOpen={isOpenManual} onClose={onCloseManual}>
        <ModalOverlay />
        <ModalContent bg="gray.dark">
          <ModalHeader>Add your book</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={3} isRequired>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel>Isbn</FormLabel>
              <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel>Author</FormLabel>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel>Image</FormLabel>
              <Input
                type="file"
                p={1}
                cursor="pointer"
                onChange={handleFileUpload}
              />
            </FormControl>
            <FormControl mb={3} isRequired>
              <FormLabel>Category</FormLabel>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <VStack w="full" px="25px" pb="25px">
            <Button
              bg="accent.default"
              _hover={{ bg: 'accent.event' }}
              color="black"
              w="full"
              borderRadius="sm"
              onClick={addBookManually}
              disabled={uploadingImage}
              isLoading={loadingCreate}
            >
              Add
            </Button>
            <Button onClick={onCloseManual} w="full" borderRadius="sm">
              Cancel
            </Button>
          </VStack>
        </ModalContent>
      </Modal>

      {/* API book adding model */}
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

          <ModalFooter display="flex" flexDir="column" gap={3}>
            <Button
              bg="accent.default"
              _hover={{ bg: 'accent.event' }}
              color="black"
              width="full"
              onClick={() => getSearchedBooks()}
              borderRadius="sm"
            >
              Search
            </Button>
            <Button
              bg="accent.default"
              _hover={{ bg: 'accent.event' }}
              color="black"
              width="full"
              onClick={() => {
                onClose();
                onOpenManual();
              }}
              borderRadius="sm"
            >
              Add Manually
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
        <div className="flex w-50vw h-[500px] items-center justify-center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.dark"
            color="accent.default"
            size="xl"
          />
        </div>
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
              _hover={{ bg: 'accent.event' }}
              color="black"
              transition="ease 0.2s"
              onClick={onOpen}
            >
              <FaPlus className="nav-icon" />
            </Flex>
          </Flex>
          <SearchBox />

          <Grid templateColumns="repeat(6, 1fr)" gap={6}>
            <GridItem
              as="aside"
              colSpan={1}
              display={{ base: 'none', lg: 'block' }}
            >
              <Sidebar />
            </GridItem>

            <GridItem colSpan={{ base: 6, lg: 3 }}>
              <ImageSlider />
              <SimpleGrid columns={{ base: 4, lg: 4 }} gap={3}>
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
