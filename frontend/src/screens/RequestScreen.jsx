import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Divider,
  Flex,
  Spinner,
  Text,
  Image,
  Button,
  useToast,
} from "@chakra-ui/react";
import {
  useGetRequestByIdQuery,
  useUpdateArrivedMutation,
  useUpdateDeliveredMutation,
} from "../slices/requestsApiSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const RequestScreen = () => {
  const toast = useToast();

  const { id: requestId } = useParams();
  const { data: request, isLoading } = useGetRequestByIdQuery(requestId);
  const [updateArrived, { isLoading: loadingUpdateArrived }] =
    useUpdateArrivedMutation();
  const [updateDelivered, { isLoading: loadingUpdateDelivered }] =
    useUpdateDeliveredMutation();
  const { userInfo } = useSelector((store) => store.auth);

  const updateArrivedHandler = async () => {
    try {
      await updateArrived(requestId).unwrap();
      toast({
        title: "Request marked as arrived",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: err?.data?.message || err?.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateDeliveredHandler = async () => {
    try {
      await updateDelivered(requestId).unwrap();
      toast({
        title: "Request marked as delivered",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: err?.data?.message || err?.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <Text fontSize="3xl" fontWeight="medium" mb={8}>
        {`Request ${requestId}`}
      </Text>

      <Box
        bg="gray.dark"
        p={6}
        borderRadius="md"
        border="1px"
        borderColor="gray.light"
      >
        <Text fontSize="2xl" fontWeight="medium" mb={4}>
          Shipping
        </Text>
        <Flex alignItems="center" gap={2} mb={2}>
          <Avatar
            name={request.user.name}
            src={request.user.profilePicture}
            mb={2}
            size="lg"
          />
          <Text fontSize="xl" mb={1}>
            {request.user.name}
          </Text>
        </Flex>
        <Text mb={1}>
          <span style={{ fontWeight: "bold" }}>Email:</span>{" "}
          {request.user.email}
        </Text>
        <Text mb={1}>
          <span style={{ fontWeight: "bold" }}>Address:</span>{" "}
          {`${request.address}, ${request.city}, ${request.state}, ${request.country} | ${request.postalCode} (Postal code)`}
        </Text>
        <Text mb={1}>
          <span style={{ fontWeight: "bold" }}>Phone:</span> {request.phone}
        </Text>
        <Alert status={request.isArrived ? "success" : "error"}>
          <AlertIcon />
          <AlertTitle>
            {request.isArrived
              ? `Delivery is arrived to ${request.user.name.split(" ")[0]}.`
              : `Delivery is not arrived to ${
                  request.user.name.split(" ")[0]
                } yet.`}
          </AlertTitle>
          <AlertDescription>
            {request.isArrived
              ? `Marked as arrived at ${request.arrivedAt.substring(0, 10)}`
              : userInfo._id !== request.user._id
              ? "You will be informed when the delivery marked as arrived."
              : ""}
          </AlertDescription>
        </Alert>
        {userInfo._id === request.user._id ? (
          <Button
            bg="accent.default"
            color="#000000"
            size="md"
            mt={2}
            _hover={{ bg: "accent.event" }}
            borderRadius="sm"
            isLoading={loadingUpdateArrived}
            onClick={updateArrivedHandler}
          >
            Mark as arrived
          </Button>
        ) : (
          ""
        )}

        <Divider my={4} />

        <Text fontSize="2xl" fontWeight="medium" mb={4}>
          Book
        </Text>
        <Flex alignItems="flex-start" gap={2} mb={2}>
          <Image
            name={request.book.title}
            src={request.book.image}
            mb={2}
            size="lg"
          />
          <Box>
            <Text fontSize="xl" mb={1}>
              {request.book.title}
            </Text>
            <Text mb={1}>
              <span style={{ fontWeight: "bold" }}>Author:</span>{" "}
              {request.book.author}
            </Text>
          </Box>
        </Flex>

        <Alert status={request.isDelivered ? "success" : "error"}>
          <AlertIcon />
          <AlertTitle>
            {request.isDelivered
              ? `Delivered to ${request.user.name.split(" ")[0]}.`
              : `Book is not delivered to ${
                  request.user.name.split(" ")[0]
                } yet.`}
          </AlertTitle>
          <AlertDescription>
            {request.isDelivered
              ? `Marked as delivered at ${request.deliveredAt.substring(0, 10)}`
              : userInfo._id === request.user._id
              ? "You will be informed when the delivery marked as delivered."
              : ""}
          </AlertDescription>
        </Alert>

        {userInfo._id !== request.user._id ? (
          <Button
            bg="accent.default"
            color="#000000"
            size="md"
            mt={2}
            _hover={{ bg: "accent.event" }}
            borderRadius="sm"
            isLoading={loadingUpdateArrived}
            onClick={updateDeliveredHandler}
          >
            Mark as delivered
          </Button>
        ) : (
          ""
        )}
      </Box>
    </>
  );
};

export default RequestScreen;
