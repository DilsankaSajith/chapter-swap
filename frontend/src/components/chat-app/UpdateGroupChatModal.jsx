import {
  Box,
  Button,
  FormControl,
  IconButton,
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
import { HiEye } from "react-icons/hi2";
import { ChatState } from "../../context/ChatProvider";
import { useSelector } from "react-redux";
import { useState } from "react";
import UserBadgeItem from "./UserBadgeItem";
import {
  useAddUserToGroupChatMutation,
  useGetUsersQuery,
  useRemoveUserFromGroupChatMutation,
  useRenameGroupChatMutation,
} from "../../slices/chatApiSlice";
import UserListItem from "./UserListItem";

const UpdateGroupChatModal = () => {
  const [groupChatName, setGroupChatName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { selectedChat, setSelectedChat } = ChatState();
  const { userInfo } = useSelector((store) => store.auth);

  const [renameGroupChat, { isLoading: loadingRenameGroupChat }] =
    useRenameGroupChatMutation();
  const [addUser, { isLoading: loadingAddUser }] =
    useAddUserToGroupChatMutation();
  const [removeUser, { isLoading: loadingRemoveUser }] =
    useRemoveUserFromGroupChatMutation();
  const { data: users, isLoading: loadingUsers } =
    useGetUsersQuery(searchQuery);
  const toast = useToast();

  const handleRemove = async (userToRemove) => {
    if (selectedChat.groupAdmin._id !== userInfo._id) {
      toast({
        title: "Only admins can remove someone",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const updatedChat = await removeUser({
        chatId: selectedChat._id,
        userId: userToRemove._id,
      }).unwrap();
      setSelectedChat(updatedChat);
      userToRemove._id == userInfo._id
        ? setSelectedChat()
        : setSelectedChat(updatedChat);
      toast({
        title: "User removed",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: err?.data?.message || err?.error,
        variant: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== userInfo._id) {
      toast({
        title: "Only admins can add someone",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const updatedChat = await addUser({
        chatId: selectedChat._id,
        userId: userToAdd._id,
      }).unwrap();
      setSelectedChat(updatedChat);
      toast({
        title: "User added",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: err?.data?.message || err?.error,
        variant: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRename = async () => {
    try {
      const updatedChat = await renameGroupChat({
        chatId: selectedChat._id,
        chatName: groupChatName,
      }).unwrap();
      setSelectedChat(updatedChat);
      onClose();
    } catch (err) {
      toast({
        title: err?.data?.message || err?.error,
        variant: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <IconButton onClick={onOpen} icon={<HiEye />} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"gray.dark"}>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexWrap="wrap">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            <FormControl display="flex" alignItems="center">
              <Input
                placeholder="Chat Name"
                my={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                borderRadius="sm"
              />
              <Button
                bg="accent.default"
                color="#000000"
                size="md"
                _hover={{ bg: "accent.event" }}
                borderRadius="sm"
                borderLeftRadius="none"
                onClick={handleRename}
                isLoading={loadingRenameGroupChat}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add users to group"
                mb={1}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </FormControl>

            {/* Render searched users */}
            <Box
              display="flex"
              flexDir="column"
              my={4}
              minH="300px"
              overflowY="scroll"
            >
              {loadingUsers || loadingAddUser || loadingRemoveUser ? (
                <Spinner />
              ) : (
                users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              borderRadius="sm"
              size="sm"
              bg="danger.default"
              _hover={{ bg: "danger.event" }}
              color="black"
              onClick={() => handleRemove(userInfo)}
            >
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UpdateGroupChatModal;
