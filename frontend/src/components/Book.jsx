import {
  Card,
  CardBody,
  Image,
  Text,
  Flex,
  Stack,
  Button,
  Box,
  useToast,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { HiMiniCog6Tooth } from 'react-icons/hi2';
import { useSelector } from 'react-redux';
import { useDeleteBookMutation } from '../slices/booksApiSlice';
import { useState } from 'react';
import { useUpdateBookMutation } from '../slices/booksApiSlice';

const Book = ({ book }) => {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [description, setDescription] = useState(book.description);
  const [category, setCategory] = useState(book.category);

  const { userInfo } = useSelector((store) => store.auth);

  const [deleteBook, { isLoading: loadingDelete }] = useDeleteBookMutation();
  const [updateBook, { isLoading: loadingUpdate }] = useUpdateBookMutation();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateBook({
        bookId: book._id,
        title,
        author,
        description,
        category,
      });
      toast({
        title: 'Book updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      toast({
        title: err?.data?.message || err.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteBook(id).unwrap();
        toast({
          title: 'Book removed',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: err?.data?.message || err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box position="relative">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.dark">
          <ModalHeader>Edit your book</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={3}>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Author</FormLabel>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Description</FormLabel>
              <Textarea
                height="200px"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Textarea>
            </FormControl>

            <FormControl mb={3}>
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
              onClick={submitHandler}
              isLoading={loadingUpdate}
            >
              Save
            </Button>
            <Button onClick={onClose} w="full" borderRadius="sm">
              Cancel
            </Button>
          </VStack>
        </ModalContent>
      </Modal>

      <Link to={`/book/${book._id}`}>
        <Box
          maxW="sm"
          bg="gray.dark"
          borderRadius="sm"
          border="1px"
          borderColor="gray.light"
          transition="ease 0.3s"
          _hover={{ bg: 'gray.800' }}
        >
          <Box w="full" h="120px" overflow="hidden">
            <Image src={book.image} alt="book1" borderRadius="sm" />
          </Box>

          <Box px={1} pb={1}>
            <Text
              fontWeight="normal"
              fontSize="sm"
              mt="2"
              fontFamily="Joan"
              letterSpacing="1px"
              isTruncated
            >
              {book.title}
            </Text>
            <Text color="gray.500" fontSize="xs" isTruncated>
              {book.author}
            </Text>

            <Flex alignItems="center" gap="8px">
              <FaStar style={{ color: '#ffbc03' }} />
              <span>{book.rating}</span>
            </Flex>
          </Box>
        </Box>
      </Link>
      {userInfo?._id === book.user._id || userInfo?.isAdmin ? (
        <Stack direction="row" position="absolute" top={1} right={1}>
          <Menu>
            <MenuButton>
              <Flex
                alignItems="center"
                justifyContent="center"
                width="36px"
                height="36px"
                bg="accent.default"
                borderRadius="full"
                cursor="pointer"
                _hover={{ bg: 'accent.event' }}
                transition="ease 0.3s"
                color="#000"
                boxShadow="lg"
              >
                <HiMiniCog6Tooth className="nav-icon" />
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onOpen}>Edit</MenuItem>
              <MenuItem
                onClick={() => {
                  deleteHandler(book._id);
                }}
              >
                {loadingDelete ? <Spinner /> : 'Delete'}
              </MenuItem>
            </MenuList>
          </Menu>

          {/* <Button
            onClick={() => {
              deleteHandler(book._id);
            }}
          >
            {loadingDelete ? <Spinner /> : <FaTrash />}
          </Button> */}
        </Stack>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default Book;
