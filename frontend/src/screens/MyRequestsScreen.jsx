import {
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Link as LinkUI,
  Flex,
  Button,
  useToast,
  Text,
} from "@chakra-ui/react";
import { HiTrash, HiXMark } from "react-icons/hi2";
import {
  useCancelRequestMutation,
  useGetMyRequestsQuery,
} from "../slices/requestsApiSlice";
import { Link, useNavigate } from "react-router-dom";

const MyRequestsScreen = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { data: bookRequests, isLoading, error } = useGetMyRequestsQuery();
  const [cancelRequest, { isLoading: loadingReject }] =
    useCancelRequestMutation();

  const cancelHandler = async (bookId) => {
    try {
      if (window.confirm("Are you sure?")) {
        await cancelRequest(bookId).unwrap();
        toast({
          title: "Request canceled",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: err?.data?.message || err.message,
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
        My Requests
      </Text>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>title</Th>
              <Th>owner</Th>
              <Th>date</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookRequests.map((bookRequest) => (
              <Tr key={bookRequest._id}>
                <Td>
                  <Link to={`/book/${bookRequest.book._id}`}>
                    <Image w="50px" src={bookRequest.book.image} />
                  </Link>
                </Td>
                <Td>
                  <Link to={`/book/${bookRequest.book._id}`}>
                    <LinkUI>{bookRequest.book.title}</LinkUI>
                  </Link>
                </Td>
                <Td>{bookRequest.owner.name}</Td>
                <Td>{bookRequest.createdAt.substring(0, 10)}</Td>
                <Td>
                  <Flex gap={2} alignItems="center">
                    <Text color={"accent.event"}>
                      {bookRequest.isAccepted ? "Accepted" : ""}
                    </Text>
                    <Button
                      borderRadius="sm"
                      size="sm"
                      bg="danger.default"
                      _hover={{ bg: "danger.event" }}
                      color="black"
                      isLoading={loadingReject}
                      onClick={() => cancelHandler(bookRequest._id)}
                      disabled={bookRequest.isDelivered}
                    >
                      <HiTrash />
                    </Button>

                    <Button
                      borderRadius="sm"
                      size="sm"
                      bg="white"
                      _hover={{ bg: "gray.200" }}
                      color="black"
                      onClick={() => navigate(`/requests/${bookRequest._id}`)}
                    >
                      Details
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MyRequestsScreen;
