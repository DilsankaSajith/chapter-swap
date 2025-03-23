import {
  VStack,
  Spinner,
  Box,
  Flex,
  Image,
  Text,
  Avatar,
  Button,
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
  useToast,
} from "@chakra-ui/react";
import { useGetBookDetailsQuery } from "../slices/booksApiSlice";
import { useParams, useNavigate } from "react-router-dom";
import Rating from "../components/Rating";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useCreateRequestMutation } from "../slices/requestsApiSlice";

const BookScreen = () => {
  const { userInfo } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const [address, setAddress] = useState(userInfo.address);
  const [city, setCity] = useState(userInfo.city);
  const [state, setState] = useState(userInfo.state);
  const [postalCode, setPostalCode] = useState(userInfo.postalCode);
  const [country, setCountry] = useState("Sri lanka");
  const [phone, setPhone] = useState(userInfo.phone);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { id: bookId } = useParams();
  const { data: book, isLoading, error } = useGetBookDetailsQuery(bookId);
  const [
    createRequest,
    { isLoading: loadingCreateRequest, error: createRequestError },
  ] = useCreateRequestMutation();

  const submitHandler = async () => {
    const newRequest = {
      owner: book.user._id,
      book: book._id,
      address,
      city,
      state,
      postalCode,
      country,
      phone,
    };
    try {
      const createdRequest = await createRequest(newRequest).unwrap();
      toast({
        title: `${book.title} requested`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/requests/${createdRequest._id}`);
      onClose();
    } catch (err) {
      toast({
        title: err?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="gray.dark">
              <ModalHeader>Check your details</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl mb={3}>
                  <FormLabel>Address</FormLabel>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>City</FormLabel>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>State</FormLabel>
                  <Input
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Postal code</FormLabel>
                  <Input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Country</FormLabel>
                  <Input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                  isLoading={loadingCreateRequest}
                  onClick={submitHandler}
                >
                  Request
                </Button>
                <Button onClick={onClose} w="full" borderRadius="sm">
                  Cancel
                </Button>
              </VStack>
            </ModalContent>
          </Modal>
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
                      onClick={onOpen}
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
        </>
      )}
    </>
  );
};

export default BookScreen;
