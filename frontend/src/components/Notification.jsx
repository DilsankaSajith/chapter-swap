import { Flex } from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import NotificationBadge from "./NotificationBadge";

const Notification = () => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      width="36px"
      height="36px"
      bg="gray.dark"
      borderRadius="full"
      cursor="pointer"
      _hover={{ bg: "gray.700" }}
      transition="ease 0.3s"
      position="relative"
    >
      <FaBell className="nav-icon" />
      <NotificationBadge value={2} />
    </Flex>
  );
};

export default Notification;
