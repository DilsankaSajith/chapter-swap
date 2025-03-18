import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import { FaPencilAlt } from "react-icons/fa";

const EditProfileButton = () => {
  return (
    <Flex
      position="absolute"
      bottom="0"
      right="0"
      alignItems="center"
      justifyContent="center"
      width="50px"
      height="50px"
      bg="accent.default"
      borderRadius="full"
      border="4px"
      borderColor="#ffffff"
      cursor="pointer"
      _hover={{ bg: "accent.event" }}
      color="black"
      transition="ease 0.2s"
    >
      <FaPencilAlt className="nav-icon" />
    </Flex>
  );
};

export default EditProfileButton;
