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
import { HiCheck, HiTrash, HiXMark } from "react-icons/hi2";
import {
  useAcceptRequestMutation,
  useGetRequestsForMeQuery,
  useRejectRequestMutation,
} from "../slices/requestsApiSlice";
import { Link, useNavigate } from "react-router-dom";

const BookRequestsScreen = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { data: bookRequests, isLoading, error } = useGetRequestsForMeQuery();
  const [rejectRequest, { isLoading: loadingReject }] =
    useRejectRequestMutation();
  const [acceptRequest, { isLoading: loadingAccept }] =
    useAcceptRequestMutation();

  const acceptHandler = async (bookId) => {
    try {
      if (window.confirm("Are you sure?")) {
        await acceptRequest(bookId).unwrap();
        toast({
          title: "Request accepted",
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

  const rejectHandler = async (bookId) => {
    try {
      if (window.confirm("Are you sure?")) {
        await rejectRequest(bookId).unwrap();
        toast({
          title: "Request rejected",
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
        Requests for Me
      </Text>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>title</Th>
              <Th>user</Th>
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
                <Td>{bookRequest.user.name}</Td>
                <Td>{bookRequest.createdAt.substring(0, 10)}</Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      borderRadius="sm"
                      size="sm"
                      bg="accent.default"
                      _hover={{ bg: "accent.event" }}
                      color="black"
                      isLoading={loadingAccept}
                      onClick={() => acceptHandler(bookRequest._id)}
                      leftIcon={<HiCheck />}
                    >
                      {bookRequest.isAccepted ? "Accepted" : "Accept"}
                    </Button>

                    <Button
                      borderRadius="sm"
                      size="sm"
                      bg="danger.default"
                      _hover={{ bg: "danger.event" }}
                      color="black"
                      isLoading={loadingReject}
                      onClick={() => rejectHandler(bookRequest._id)}
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

export default BookRequestsScreen;
