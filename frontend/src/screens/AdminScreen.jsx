import {
  Badge,
  Button,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Pencil, Trash } from 'lucide-react';
import { useGetAllUsersQuery } from '../slices/usersApiSlice';
import { useGetBooksQuery } from '../slices/booksApiSlice';
import { useGetRequestsQuery } from '../slices/requestsApiSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Chart as ChartJS, defaults } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const AdminScreen = () => {
  const { data: users, isLoading: isLoadingUsers } = useGetAllUsersQuery();
  const { data: books, isLoading: isLoadingBooks } = useGetBooksQuery('');
  const { data: requests = [], isLoading: isLoadingRequests } =
    useGetRequestsQuery();

  const navigate = useNavigate();

  const { userInfo } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  defaults.responsive = true;
  defaults.maintainAspectRatio = false;

  if (isLoadingRequests)
    return (
      <div className="w-screen h-[500px] flex items-center justify-center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.dark"
          color="accent.default"
          size="xl"
        />
      </div>
    );

  const deliveredCount = requests.filter((req) => req.isDelivered).length;
  const arrivedCount = requests.filter((req) => req.isArrived).length;
  const successCount = requests.filter(
    (req) => req.isDelivered && req.isArrived
  ).length;

  return (
    <>
      {isLoadingUsers || isLoadingBooks || isLoadingRequests ? (
        <div className="w-screen h-[500px] flex items-center justify-center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.dark"
            color="accent.default"
            size="xl"
          />
        </div>
      ) : (
        <section>
          <div className="h-[300px]">
            <Bar
              data={{
                labels: ['Delivered', 'Arrived', 'Success'],
                datasets: [
                  {
                    label: 'Requests',
                    data: [deliveredCount, arrivedCount, successCount],
                    backgroundColor: '#20B46A',
                  },
                ],
              }}
            />
          </div>
          {/* Requests Table */}
          <div className="relative my-6">
            <div className="absolute z-10 inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#101010] pointer-events-none" />
            <div className="w-full max-h-[500px] max-w-full overflow-scroll">
              <span className="text-xl font-bold block mb-4">
                Requests({requests.length})
              </span>
              <TableContainer className="adminTable">
                <Table size="md">
                  <Thead>
                    <Tr>
                      <Th>Request ID</Th>
                      <Th>Book</Th>
                      <Th>Requested By</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {requests.map((req) => (
                      <Tr key={req._id}>
                        <Td isTruncated maxW="20px">
                          {req._id}
                        </Td>
                        <Td>
                          <div className="flex flex-col items-start align-left">
                            <Text
                              className="font-medium"
                              isTruncated
                              maxW="100px"
                            >
                              {req.book.title}
                            </Text>
                            <span className="text-sm text-gray-500">
                              {req.owner.name}
                            </span>
                          </div>
                        </Td>
                        <Td>{req.user.name}</Td>
                        <Td>
                          {req.isArrived && req.isDelivered ? (
                            <Badge colorScheme="green">Success</Badge>
                          ) : (
                            <Badge colorScheme="red">Pending</Badge>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row w-full md:justify-between">
            {/* Users Table */}
            <div className="relative">
              <div className="absolute z-10 inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#101010] pointer-events-none" />
              <span className="text-xl font-bold block mb-4">
                Users({users.length})
              </span>
              <div className="w-full max-w-full max-h-[500px] overflow-scroll">
                <TableContainer className="adminTable">
                  <Table size="md">
                    <Thead>
                      <Tr>
                        <Th>User</Th>
                        <Th>Points</Th>
                        <Th>Manage</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((user) => (
                        <Tr key={user._id}>
                          <Td>
                            <div className="flex flex-col items-start align-left">
                              <span className="font-medium">{user.name}</span>
                              <span className="text-sm text-gray-500">
                                {user.email}
                              </span>
                            </div>
                          </Td>

                          <Td>{user.points}</Td>
                          <Td>
                            <div className="flex items-center gap-2">
                              <Button size="sm">
                                <Pencil size={16} />
                              </Button>
                              <Button size="sm">
                                <Trash size={16} />
                              </Button>
                            </div>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            </div>

            {/* Books Table */}
            <div className="relative w-full">
              <div className="absolute z-10 inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#101010] pointer-events-none" />
              <span className="text-xl font-bold block mb-4">
                Books({books.length})
              </span>
              <div className="w-full max-h-[500px] max-w-full overflow-scroll">
                <TableContainer className="adminTable">
                  <Table size="md">
                    <Thead>
                      <Tr>
                        <Th>Book</Th>
                        <Th>Added by</Th>
                        <Th>Manage</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {books.map((book) => (
                        <Tr key={book._id}>
                          <Td isTruncated maxW="20px">
                            {book.title}
                          </Td>
                          <Td>
                            <div className="flex flex-col items-start align-left">
                              <span className="font-medium">
                                {book.user.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {book.user.email}
                              </span>
                            </div>
                          </Td>
                          <Td>
                            <div className="flex items-center gap-2">
                              <Button size="sm">
                                <Pencil size={16} />
                              </Button>
                              <Button size="sm">
                                <Trash size={16} />
                              </Button>
                            </div>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AdminScreen;
