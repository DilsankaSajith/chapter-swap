import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <Flex flexDir="column" gap={3}>
      <Link to="/bookRequests">
        <Flex
          alignItems="center"
          gap={2}
          p={2}
          _hover={{ bg: "gray.800" }}
          cursor="pointer"
          transition="ease 0.1s"
          borderRadius="sm"
        >
          <Image src="/images/inbox.png" w="30px" />
          <Text fontSize="md">Wants</Text>
        </Flex>
      </Link>

      <Link to="/myRequests">
        <Flex
          alignItems="center"
          gap={2}
          p={2}
          _hover={{ bg: "gray.800" }}
          cursor="pointer"
          transition="ease 0.1s"
          borderRadius="sm"
        >
          <Image src="/images/paper-plane.png" w="30px" />
          <Text fontSize="md">Asks</Text>
        </Flex>
      </Link>

      <Link to="/favorites">
        <Flex
          alignItems="center"
          gap={2}
          p={2}
          _hover={{ bg: "gray.800" }}
          cursor="pointer"
          transition="ease 0.1s"
          borderRadius="sm"
        >
          <Image src="/images/bookmark.png" w="30px" />
          <Text fontSize="md">Saved</Text>
        </Flex>
      </Link>
    </Flex>
  );
};

export default Sidebar;
