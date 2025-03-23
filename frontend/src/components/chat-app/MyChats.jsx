import { Avatar, Box, Button, Divider, Stack, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useFetchChatsQuery } from "../../slices/chatApiSlice";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { useSelector } from "react-redux";
import { getSender } from "../../utils/helpers";
import GroupChatModel from "./GroupChatModel";

const MyChats = () => {
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const { data: apiChats, isLoading } = useFetchChatsQuery();

  const { userInfo } = useSelector((store) => store.auth);

  // useEffect(() => {
  //   if (apiChats) setChats(apiChats);
  // }, [apiChats]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      w={{ base: "100%", md: "31%" }}
      borderWidth="1px"
      borderRadius="sm"
      borderColor="gray.light"
      bg="gray.dark"
    >
      <Box
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        p={5}
      >
        <Text fontSize="2xl" fontWeight="medium">
          Chats
        </Text>
        <GroupChatModel>
          <Button
            borderRadius="sm"
            size="sm"
            bg="accent.default"
            _hover={{ bg: "accent.event" }}
            color="black"
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModel>
      </Box>

      <Box display="flex" flexDir="column" w="100%" h="100%" overflowY="hidden">
        {isLoading ? (
          <ChatLoading />
        ) : (
          <Stack overflowY="scroll" gap={0}>
            {apiChats.map((chat) => (
              <>
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "gray.800" : "gray.dark"}
                  p={3}
                  borderRadius="sm"
                  key={chat._id}
                  display="flex"
                  alignItems="center"
                  gap={2}
                  borderRight={selectedChat === chat ? "2px" : ""}
                  borderRightColor={selectedChat === chat ? "accent.event" : ""}
                  _hover={{ bg: "gray.800" }}
                >
                  <Avatar
                    size="sm"
                    name={
                      chat.isGroupChat
                        ? chat.chatName
                        : getSender(userInfo, chat.users).name
                    }
                    src={
                      chat.isGroupChat
                        ? ""
                        : getSender(userInfo, chat.users).profilePicture
                    }
                  />
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(userInfo, chat.users).name
                      : chat.chatName}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {!chat.isGroupChat
                      ? getSender(userInfo, chat.users).email
                      : "Group Chat"}
                  </Text>
                </Box>
              </>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
