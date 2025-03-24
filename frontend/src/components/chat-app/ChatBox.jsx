import React from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = () => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg={"gray.dark"}
      w={{ base: "100%", md: "68%" }}
      borderWidth="1px"
      borderRadius="sm"
      borderColor="gray.light"
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;
