import {
  Badge,
  Button,
  Input,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { Pencil, Trash } from 'lucide-react';
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useGetReportsQuery,
  useMakeAdminMutation,
} from '../slices/usersApiSlice';
import { useGetBooksQuery } from '../slices/booksApiSlice';
import { useGetRequestsQuery } from '../slices/requestsApiSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, defaults } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const AdminScreen = () => {
  const {
    data: users,
    isLoading: isLoadingUsers,
    refetch,
  } = useGetAllUsersQuery();
  const { data: books, isLoading: isLoadingBooks } = useGetBooksQuery('');
  const { data: reports, isLoading: isLoadingReports } = useGetReportsQuery();
  const { data: requests = [], isLoading: isLoadingRequests } =
    useGetRequestsQuery();
  const { userInfo } = useSelector((store) => store.auth);
  const [makeAdmin] = useMakeAdminMutation();
  const [deleteApiUser] = useDeleteUserMutation();

  const navigate = useNavigate();
  const toast = useToast();

  const [searchUser, setSearchUser] = useState('');
  const [searchBook, setSearchBook] = useState('');

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  defaults.responsive = true;
  defaults.maintainAspectRatio = false;

  const changeToAdmin = async (user) => {
    if (window.confirm('Are you sure want to make this user an admin?')) {
      try {
        await makeAdmin(user._id);
        toast({
          title: `${
            user.isAdmin
              ? `${user.name} is not an admin anymore`
              : `${user.name} is an admin now`
          }`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        refetch();
      } catch (err) {
        toast({
          title: err?.data?.message || err.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const deleteUser = async (user) => {
    if (window.confirm('Are you sure want to delete this user?')) {
      try {
        await deleteApiUser(user._id);
        toast({
          title: `${user.name} deleted`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        refetch();
      } catch (err) {
        toast({
          title: err?.data?.message || err.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchUser.toLowerCase())
    );
  }, [users, searchUser]);

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    return books.filter((book) =>
      book.title.toLowerCase().includes(searchBook.toLowerCase())
    );
  }, [books, searchBook]);

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
          <div className="h-[300px] mt-3">
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
                          <Link to={`/requests/${req._id}`}>{req._id}</Link>
                        </Td>
                        <Td>
                          <div className="flex flex-col items-start align-left">
                            <Text
                              className="font-medium"
                              isTruncated
                              maxW="200px"
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

          {/* Reports Table */}
          <div className="relative my-6">
            <div className="w-full max-h-[500px] max-w-full overflow-scroll">
              <span className="text-xl font-bold block mb-4">
                Reports({reports.length})
              </span>
              <TableContainer className="adminTable">
                <Table size="md">
                  <Thead>
                    <Tr>
                      <Th>Message</Th>
                      <Th>Complainer</Th>
                      <Th>Accused</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {reports.map((report) => (
                      <Tr key={report._id}>
                        <Td isTruncated maxW="100px">
                          {report.message}
                        </Td>
                        <Td>
                          <div className="flex flex-col items-start align-left">
                            <Text className="font-medium">
                              <Link to={`/profile/${report.reporter._id}`}>
                                {report.reporter.name}
                              </Link>
                            </Text>
                            <span className="text-sm text-gray-500">
                              {report.reporter.email}
                            </span>
                          </div>
                        </Td>
                        <Td>
                          <div className="flex flex-col items-start align-left">
                            <Text
                              className="font-medium"
                              isTruncated
                              maxW="100px"
                            >
                              <Link to={`/profile/${report.reported._id}`}>
                                {report.reported.name}
                              </Link>
                            </Text>
                            <span className="text-sm text-gray-500">
                              {report.reported.email}
                            </span>
                          </div>
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
            <div className="relative w-full">
              <span className="text-xl font-bold block mb-4 ">
                Users({users.length})
              </span>

              <Input
                placeholder="Search user..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
              <div className="w-full max-w-full max-h-[500px] overflow-scroll mt-6">
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
                      {filteredUsers.map((user) => (
                        <Tr key={user._id}>
                          <Td>
                            <div className="flex flex-col items-start align-left">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">
                                  <Link to={`/profile/${user._id}`}>
                                    {user.name}
                                  </Link>
                                </span>
                                {user.isAdmin && (
                                  <Badge colorScheme="green">Admin</Badge>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">
                                {user.email}
                              </span>
                            </div>
                          </Td>

                          <Td>{user.points}</Td>
                          <Td>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => changeToAdmin(user)}
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => deleteUser(user)}
                              >
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
            <div className="relative w-[70%]">
              <span className="text-xl font-bold block mb-4">
                Books({books.length})
              </span>
              <Input
                placeholder="Search book..."
                value={searchBook}
                onChange={(e) => setSearchBook(e.target.value)}
              />
              <div className="w-full max-h-[500px] max-w-full overflow-scroll mt-6">
                <TableContainer className="adminTable">
                  <Table size="md">
                    <Thead>
                      <Tr>
                        <Th>Book</Th>
                        <Th>Added by</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredBooks.map((book) => (
                        <Tr key={book._id}>
                          <Td isTruncated maxW="100px">
                            <Link to={`/book/${book._id}`}>{book.title}</Link>
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
