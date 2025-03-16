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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDeleteBookMutation } from "../slices/booksApiSlice";
import { useState } from "react";
import { useUpdateBookMutation } from "../slices/booksApiSlice";

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
        title: "Book updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      toast({
        title: err?.data?.message || err.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteBook(id).unwrap();
        toast({
          title: "Book removed",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        toast({
          title: err?.data?.message || err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box>
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
              _hover={{ bg: "accent.event" }}
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

      <Link to="/book/bookId">
        <Card
          maxW="sm"
          minH="350px"
          bg="gray.dark"
          borderRadius="md"
          border="1px"
          borderColor="gray.light"
          _hover={{ bg: "gray.700" }}
        >
          <CardBody>
            <Image
              src={book.image}
              alt="book1"
              borderRadius="lg"
              minW="125px"
            />

            <Text
              fontWeight="normal"
              fontSize="lg"
              mt="2"
              fontFamily="Joan"
              letterSpacing="1px"
            >
              {book.title}
            </Text>
            <Text color="gray.500">{book.author}</Text>

            <Flex alignItems="center" gap="8px">
              <FaStar style={{ color: "#ffbc03" }} />
              <span>{book.rating}</span>
            </Flex>
          </CardBody>
        </Card>
      </Link>
      {userInfo?._id === book.user && (
        <Stack direction="row" spacing={0} width="full">
          <Button
            size="xs"
            borderRadius="0"
            colorScheme="orange"
            variant="solid"
            width="full"
            onClick={onOpen}
          >
            <FaEdit />
          </Button>
          <Button
            size="xs"
            borderRadius="0"
            colorScheme="red"
            variant="solid"
            width="full"
            onClick={() => {
              deleteHandler(book._id);
            }}
          >
            {loadingDelete ? <Spinner /> : <FaTrash />}
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Book;
