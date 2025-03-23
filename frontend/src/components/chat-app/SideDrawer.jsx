import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import {
  useAccessChatMutation,
  useGetUsersQuery,
} from "../../slices/chatApiSlice";
import UserListItem from "./UserListItem";
import { ChatState } from "../../context/ChatProvider";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const { setSelectedChat, chats, setChats } = ChatState();

  const { data: apiUsers, isLoading } = useGetUsersQuery(search);
  const [accessChat, { isLoading: loadingAccessChat }] =
    useAccessChatMutation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setUsers(apiUsers);
  };

  const handleAccessChat = async (userId) => {
    try {
      const chat = await accessChat({ userId }).unwrap();

      if (!chats.find((c) => c._id === chat._id)) {
        setChats([chat, ...chats]);
      }

      setSelectedChat(chat);
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

  return (
    <>
      <Box>
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            leftIcon={<HiMagnifyingGlass />}
            onClick={onOpen}
          >
            <Text d={{ base: "none", md: "flex" }}>Search user</Text>
          </Button>
        </Tooltip>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={"gray.dark"}>
          <DrawerCloseButton />
          <DrawerHeader>Join with friends</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2} gap={0} mb={4}>
              <Input
                placeholder="Search by name or email..."
                borderRightRadius={0}
                borderLeftRadius="sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                borderRadius="sm"
                size="md"
                bg="accent.default"
                _hover={{ bg: "accent.event" }}
                color="black"
                borderLeftRadius={0}
                onClick={handleSubmit}
              >
                Go
              </Button>
            </Box>
            {isLoading ? (
              <Spinner />
            ) : (
              <Box>
                {users.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAccessChat(user._id)}
                  />
                ))}
                {loadingAccessChat && <Spinner />}
              </Box>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
