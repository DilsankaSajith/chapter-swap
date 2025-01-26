import { Flex, Text, Box, HStack, Container, Avatar } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaBell, FaFacebookMessenger } from "react-icons/fa";

const Header = () => {
  return (
    <Box>
      <Container maxWidth="4xl" py="2">
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="medium">
            ChapterSwap
          </Text>

          <HStack>
            <Flex
              alignItems="center"
              justifyContent="center"
              width="50px"
              height="50px"
              bg="gray.dark"
              borderRadius="full"
              cursor="pointer"
              _hover={{ bg: "gray.700" }}
              transition="ease 0.1s"
            >
              <FaFacebookMessenger className="nav-icon" />
            </Flex>
            <Flex
              alignItems="center"
              justifyContent="center"
              width="50px"
              height="50px"
              bg="gray.dark"
              borderRadius="full"
              cursor="pointer"
              _hover={{ bg: "gray.700" }}
              transition="ease 0.1s"
            >
              <FaBell className="nav-icon" />
            </Flex>
            <Avatar size="md" src="/images/user.jpg" />
            <Link to="/profile">
              <Text
                fontWeight="medium"
                _hover={{ color: "gray.500" }}
                transition="ease 0.1s"
              >
                Sajith
              </Text>
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
