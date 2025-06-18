import {
  Box,
  Button,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { HiArrowLeft } from "react-icons/hi2";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../utils/helpers";
import { useSelector } from "react-redux";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useState } from "react";
import {
  useFetchMessagesQuery,
  useSendMessageMutation,
} from "../../slices/messageApiSlice";
import ScrollableChat from "./ScrollableChat";
import { GoPaperAirplane } from "react-icons/go";

const SingleChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { selectedChat, setSelectedChat } = ChatState();
  const { userInfo } = useSelector((store) => store.auth);

  const {
    data: apiMessages,
    isLoading,
    error,
    refetch,
  } = useFetchMessagesQuery(selectedChat?._id);
  const [sendMessageApi, { isLoading: loadingSendMessage }] =
    useSendMessageMutation();

  const toast = useToast();

  const sendMessage = async () => {
    try {
      if (newMessage) {
        const message = await sendMessageApi({
          content: newMessage,
          chatId: selectedChat._id,
        }).unwrap();
        setNewMessage("");
        setMessages([...messages, message]);
        refetch();
      }
    } catch (err) {
      toast({
        title: err?.data?.message || err?.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize="xl"
            p={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<HiArrowLeft />}
              onClick={() => setSelectedChat("")}
            />
            <Text fontSize="2xl" fontWeight="medium">
              {!selectedChat.isGroupChat
                ? getSender(userInfo, selectedChat.users).name
                : selectedChat.chatName}
            </Text>
            {selectedChat.isGroupChat && <UpdateGroupChatModal />}
          </Box>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            p={3}
            bg="gray.800"
            w="100%"
            h="100%"
            borderRadius="sm"
            overflowY="hidden"
          >
            {isLoading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={apiMessages} />
              </div>
            )}
            <FormControl
              display="flex"
              isRequired
              mt="3"
              alignItems="center"
              justifyContent="space-between"
            >
              <Input
                type="text"
                placeholder="Type message..."
                borderRightRadius={0}
                value={newMessage}
                onChange={typingHandler}
              />
              <Button
                borderRadius="sm"
                size="md"
                bg="accent.default"
                _hover={{ bg: "accent.event" }}
                color="black"
                borderLeftRadius={0}
                onClick={sendMessage}
                isLoading={loadingSendMessage}
              >
                <GoPaperAirplane />
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="2xl">Click on a user to start chatting</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
