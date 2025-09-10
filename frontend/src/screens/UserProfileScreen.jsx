import { useParams } from 'react-router-dom';
import {
  useCreateReportMutation,
  useGetOtherProfileQuery,
} from '../slices/usersApiSlice';
import {
  Box,
  Flex,
  Avatar,
  Text,
  HStack,
  VStack,
  Spinner,
  Grid,
  GridItem,
  SimpleGrid,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  useDisclosure,
  Input,
  useToast,
} from '@chakra-ui/react';
import Book from '../components/Book';
import { useGetBooksQuery } from '../slices/booksApiSlice';
import FollowUserButton from '../components/FollowUserButton';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const UserProfileScreen = () => {
  const { id: profileId } = useParams();
  const { data: userData, isLoading: loadingUserData } =
    useGetOtherProfileQuery(profileId);
  const { data: books, isLoading: loadingBooks } = useGetBooksQuery('');
  const [submitApiReport, { isLoading: loadingSubmitReport }] =
    useCreateReportMutation();

  const { userInfo } = useSelector((store) => store.auth);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  const [message, setMessage] = useState('');

  if (loadingBooks || loadingUserData) {
    return (
      <div className="w-[70vw] h-[500px] flex items-center justify-center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.dark"
          color="accent.default"
          size="xl"
        />
      </div>
    );
  }

  const myBooks = books.filter((book) => book.user._id === profileId);

  const submitReport = async (e) => {
    e.preventDefault();
    try {
      const report = {
        message: message,
        reporter: userInfo._id,
        reported: profileId,
      };

      await submitApiReport(report).unwrap();

      toast({
        title: 'Report submitted successfully',
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

    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.dark">
          <ModalHeader>Add your book</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={3} isRequired>
              <FormLabel>Message</FormLabel>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
              onClick={submitReport}
              disabled={loadingSubmitReport}
              isLoading={loadingSubmitReport}
            >
              Submit
            </Button>
            <Button onClick={onClose} w="full" borderRadius="sm">
              Cancel
            </Button>
          </VStack>
        </ModalContent>
      </Modal>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap="10px"
        justifyContent="space-between"
      >
        <Box
          display="flex"
          alignItems="center"
          flexDir="column"
          bg="gray.dark"
          p={6}
          borderRadius="md"
          border="1px"
          borderColor="gray.light"
        >
          <Box position="relative">
            <Avatar
              size="2xl"
              name={userData.name}
              src={userData.profilePicture}
              mb={3}
            />
            {/* <EditProfileButton /> */}
          </Box>
          <Text fontSize="2xl" fontWeight="medium">
            {userData.name}
          </Text>
          <Text color="gray.500">
            {userData.email} | {userData.phone}
          </Text>
          <Text color="gray.500">
            {userData.address}, {userData.city}, {userData.state}
          </Text>

          <HStack alignItems="center" gap={4} my={6}>
            <VStack alignItems="center" gap="-10px">
              <Text fontSize="2xl">{userData.points}</Text>
              <Text>Points</Text>
            </VStack>
            <Text fontSize="3xl" fontWeight="thin">
              |
            </Text>
            <VStack alignItems="center" gap="-10px">
              <Text fontSize="2xl">{userData.followers.length}</Text>
              <Text>Followers</Text>
            </VStack>
            <Text fontSize="3xl" fontWeight="thin">
              |
            </Text>
            <VStack alignItems="center" gap="-10px">
              <Text fontSize="2xl">{userData.follwings.length}</Text>
              <Text>Followings</Text>
            </VStack>
          </HStack>

          <div className="flex flex-col w-full items-center gap-3">
            <FollowUserButton user={userData} width={'full'} />
            <Button
              variant="ghost"
              colorScheme="red"
              borderRadius="sm"
              className="w-full"
              onClick={onOpen}
            >
              Report abuse
            </Button>
          </div>
        </Box>

        <Grid templateColumns="repeat(6, 1fr)" gap="32px" width="full">
          <GridItem colSpan={{ base: 6, lg: 4 }}>
            <SimpleGrid columns={4} gap={3}>
              {!myBooks.length ? (
                <Text fontSize="xl">No Books Added Yet</Text>
              ) : (
                myBooks.map((book) => <Book key={book.id} book={book} />)
              )}
            </SimpleGrid>
          </GridItem>
        </Grid>
      </Flex>
    </>
  );
};

export default UserProfileScreen;
