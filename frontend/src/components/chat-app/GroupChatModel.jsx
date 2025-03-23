import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  useCreateGroupChatMutation,
  useGetUsersQuery,
} from "../../slices/chatApiSlice";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModel = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { data: users, isLoading } = useGetUsersQuery(searchQuery);
  const [createGroupChat, { isLoading: loadingCreateGroupChat }] =
    useCreateGroupChatMutation();

  const submitHandler = async () => {
    try {
      await createGroupChat({
        name: groupChatName,
        users: JSON.stringify(selectedUsers),
      }).unwrap();
      toast({
        title: "Group chat created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (err) {
      toast({
        title: err?.data?.message || err?.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (userToRemove) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== userToRemove._id)
    );
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"gray.dark"}>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" w="full">
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users"
                mb={1}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </FormControl>
            {/* Selected users */}
            <Box display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {/* Render searched users */}
            <Box
              display="flex"
              flexDir="column"
              my={4}
              minH="300px"
              overflowY="scroll"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
              )}
            </Box>

            <Button
              bg="accent.default"
              width="full"
              color="#000000"
              size="md"
              my={4}
              _hover={{ bg: "accent.event" }}
              onClick={submitHandler}
              borderRadius="sm"
              isLoading={loadingCreateGroupChat}
            >
              Create Chat
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
