import { Box, IconButton, Text } from "@chakra-ui/react";
import { HiArrowLeft } from "react-icons/hi2";
import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../utils/helpers";
import { useSelector } from "react-redux";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

const SingleChat = () => {
  const { selectedChat, setSelectedChat } = ChatState();

  const { userInfo } = useSelector((store) => store.auth);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
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
            <UpdateGroupChatModal />
          </Text>

          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="gray.800"
            w="100%"
            h="100%"
            borderRadius="sm"
            overflowY="hidden"
          ></Box>
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
