import {
  Box,
  Flex,
  Avatar,
  Text,
  HStack,
  VStack,
  Button,
  useToast,
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
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetBooksQuery } from "../slices/booksApiSlice";
import { useMyProfileQuery, useProfileMutation } from "../slices/usersApiSlice";
import Book from "../components/Book";
import EditProfileButton from "../components/EditProfileButton";

const ProfileScreen = () => {
  const { userInfo } = useSelector((store) => store.auth);

  const { data: books, isLoading, error, refetch } = useGetBooksQuery();
  const { data: user, isLoading: loadingUser } = useMyProfileQuery();
  const [updateProfile, { isLoading: loadingUpdate }] = useProfileMutation();

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [phone, setPhone] = useState(userInfo.phone);
  const [address, setAddress] = useState(userInfo.address);
  const [city, setCity] = useState(userInfo.city);
  const [state, setState] = useState(userInfo.state);
  const [postalCode, setPostalCode] = useState(userInfo.postalCode);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateProfile({
        name,
        email,
        phone,
        address,
        city,
        state,
        postalCode,
      });
      toast({
        title: "Details updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refetch();
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.dark">
          <ModalHeader>Edit details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={3}>
              <FormLabel>Fullname</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Email</FormLabel>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Phone</FormLabel>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Address</FormLabel>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>City</FormLabel>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>State</FormLabel>
              <Input value={state} onChange={(e) => setState(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Postal code</FormLabel>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
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

      {loadingUser ? (
        <Spinner />
      ) : (
        <Flex direction={{ base: "column", md: "row" }} gap="10px">
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
                name="Segun Adebayo"
                src={user.profilePicture}
                mb={3}
              />
              <EditProfileButton />
            </Box>
            <Text fontSize="2xl" fontWeight="medium">
              {user.name}
            </Text>
            <Text color="gray.500">
              {user.email} | {user.phone}
            </Text>
            <Text color="gray.500">
              {user.address}, {user.city}, {user.state}
            </Text>

            <HStack alignItems="center" gap={4} my={6}>
              <VStack alignItems="center" gap="-10px">
                <Text fontSize="2xl">42</Text>
                <Text>Books</Text>
              </VStack>
              <Text fontSize="3xl" fontWeight="thin">
                |
              </Text>
              <VStack alignItems="center" gap="-10px">
                <Text fontSize="2xl">{user.followers.length}</Text>
                <Text>Followers</Text>
              </VStack>
              <Text fontSize="3xl" fontWeight="thin">
                |
              </Text>
              <VStack alignItems="center" gap="-10px">
                <Text fontSize="2xl">{user.follwings.length}</Text>
                <Text>Followings</Text>
              </VStack>
            </HStack>

            <Button
              bg="accent.default"
              width="full"
              color="#000000"
              size="sm"
              mt={8}
              _hover={{ bg: "accent.event" }}
              onClick={onOpen}
            >
              Edit Details
            </Button>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default ProfileScreen;
