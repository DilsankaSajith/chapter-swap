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
  Alert,
  AlertIcon,
  Select,
  Textarea,
  Card,
  CardBody,
  Stack,
  Heading,
  StackDivider,
} from "@chakra-ui/react";
import { HiBookmark, HiBookmarkSlash } from "react-icons/hi2";
import {
  useGetBookDetailsQuery,
  useCreateReviewMutation,
  useAddToFavoriteMutation,
} from "../slices/booksApiSlice";
import { useParams, useNavigate, Link } from "react-router-dom";
import Rating from "../components/Rating";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useCreateRequestMutation } from "../slices/requestsApiSlice";

const BookScreen = () => {
  const { userInfo } = useSelector((store) => store.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState(userInfo.address);
  const [city, setCity] = useState(userInfo.city);
  const [state, setState] = useState(userInfo.state);
  const [postalCode, setPostalCode] = useState(userInfo.postalCode);
  const [country, setCountry] = useState("Sri lanka");
  const [phone, setPhone] = useState(userInfo.phone);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { id: bookId } = useParams();

  const {
    data: book,
    isLoading,
    error,
    refetch,
  } = useGetBookDetailsQuery(bookId);
  const [
    createRequest,
    { isLoading: loadingCreateRequest, error: createRequestError },
  ] = useCreateRequestMutation();
  const [createReview, { isLoading: loadingBookReview }] =
    useCreateReviewMutation();
  const [addToFavoritesApi, { isLoading: loadingAddToFavorites }] =
    useAddToFavoriteMutation();

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

  const reviewSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({ bookId, rating, comment }).unwrap();
      toast({
        title: "Review submitted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refetch();
      setRating(0);
      setComment("");
    } catch (err) {
      toast({
        title: err?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addToFavorites = async () => {
    try {
      await addToFavoritesApi(book._id).unwrap();
    } catch (err) {
      toast({
        title: err?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
                  Confirm
                </Button>
                <Button onClick={onClose} w="full" borderRadius="sm">
                  Cancel
                </Button>
              </VStack>
            </ModalContent>
          </Modal>
          <Box
            bg="gray.dark"
            display="flex"
            flexDirection="column"
            p={6}
            borderRadius="md"
            border="1px"
            borderColor="gray.light"
            gap={8}
          >
            <Flex
              direction={"column"}
              alignItems={{ base: "center", md: "flex-start" }}
              gap={4}
            >
              <Flex w="full" justifyContent="space-between">
                <Image src={book.image} />

                {book.favoritedBy
                  .map((id) => id.toString())
                  .includes(userInfo._id.toString()) ? (
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
                    onClick={addToFavorites}
                    fontSize="xl"
                  >
                    {loadingAddToFavorites ? <Spinner /> : <HiBookmarkSlash />}
                  </Flex>
                ) : (
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
                    onClick={addToFavorites}
                    fontSize="xl"
                  >
                    {loadingAddToFavorites ? <Spinner /> : <HiBookmark />}
                  </Flex>
                )}
              </Flex>

              <Box>
                <Text fontSize="2xl" fontWeight="medium">
                  {book.title}
                </Text>
                <Text color="gray.500">
                  {book.author} | {book.category}
                </Text>
                <Text color="gray.500" mt={2}>
                  {book.description}
                </Text>
                <Rating
                  value={book.rating}
                  text={`${book.numReviews} reviews`}
                />

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Link to={`/profile/${book.user?._id}`}>
                    <Box
                      onClick={() => {}}
                      cursor="pointer"
                      bg="gray.800"
                      p={3}
                      borderRadius="sm"
                      display="flex"
                      alignItems="center"
                      gap={2}
                      _hover={{ bg: "gray.800" }}
                    >
                      <Avatar
                        size="xs"
                        name={`${book.user?.name}`}
                        src={`${book.user?.profilePicture}`}
                      />
                      <Box display="flex" flexDir="column">
                        <Text>{book.user?.name}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {book.user?.email}
                        </Text>
                      </Box>
                    </Box>
                  </Link>

                  {userInfo?._id === book.user?._id ? (
                    <></>
                  ) : (
                    <Flex gap={2} alignItems="center">
                      <Button
                        bg="accent.default"
                        color="#000000"
                        size="md"
                        width="150px"
                        borderRadius="sm"
                        _hover={{ bg: "accent.event" }}
                        onClick={onOpen}
                      >
                        Request
                      </Button>
                    </Flex>
                  )}
                </Box>
              </Box>
            </Flex>
            <Box
              display={{ base: "block", md: "flex" }}
              alignItems="baseline"
              gap={6}
            >
              <Box width={{ md: "50%" }}>
                <Text fontSize="2xl" fontWeight="medium">
                  Reviews
                </Text>
                {book.reviews.length === 0 ? (
                  <Alert status="info" mt={3}>
                    <AlertIcon />
                    No Reviews
                  </Alert>
                ) : (
                  <Card borderRadius="sm" bg="gray.800">
                    <CardBody>
                      <Stack divider={<StackDivider />} spacing="4">
                        {book.reviews.map((review) => (
                          <Box key={review._id}>
                            <Flex
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Heading size="xs">{review.name}</Heading>
                              <Text fontSize="sm" color="gray.500">
                                {review.createdAt.substring(0, 10)}
                              </Text>
                            </Flex>
                            <Rating value={review.rating} />

                            <Text fontSize="sm">{review.comment}</Text>
                          </Box>
                        ))}
                      </Stack>
                    </CardBody>
                  </Card>
                )}
              </Box>
              <Box width={{ md: "50%" }}>
                <Text fontSize="xl" fontWeight="medium" mt={6} mb={4}>
                  Write a review
                </Text>
                {loadingBookReview && <Spinner />}
                {userInfo ? (
                  <>
                    <FormControl
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <FormLabel>Rating</FormLabel>
                      <Select placeholder="Select rating">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Select>
                    </FormControl>
                    <FormControl
                      mt={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    >
                      <Textarea placeholder="Write your review here." />
                    </FormControl>
                    <Button
                      mt={3}
                      bg="accent.default"
                      _hover={{ bg: "accent.event" }}
                      color="black"
                      w="full"
                      borderRadius="sm"
                      disabled={loadingBookReview}
                      isLoading={loadingBookReview}
                      onClick={reviewSubmitHandler}
                    >
                      Submit
                    </Button>
                  </>
                ) : (
                  <Alert status="info" mt={3}>
                    <AlertIcon />
                    <Link>Sign in</Link> to write a review
                  </Alert>
                )}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default BookScreen;
