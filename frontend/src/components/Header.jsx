import {
  Flex,
  Text,
  Box,
  HStack,
  Container,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { FaBell, FaFacebookMessenger, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((store) => store.auth);

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Container maxWidth="6xl" py="2">
        <Flex alignItems="center" justifyContent="space-between">
          <Link to="/">
            <Text fontSize="xl" fontWeight="medium">
              ChapterSwap
            </Text>
          </Link>

          {userInfo ? (
            <HStack>
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
                onClick={() => navigate("/chats")}
              >
                <FaFacebookMessenger className="nav-icon" />
              </Flex>
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
              >
                <FaBell className="nav-icon" />
              </Flex>
              <Avatar
                size="sm"
                name={userInfo.name}
                src={userInfo.profilePicture}
              />

              <Menu>
                <MenuButton
                  borderRadius="sm"
                  as={Button}
                  rightIcon={<FaChevronDown />}
                  bg="gray.dark"
                  _hover={{ bg: "gray.700" }}
                >
                  {userInfo.name}
                </MenuButton>
                <MenuList>
                  <Link to="/profile">
                    <MenuItem>Profile</MenuItem>
                  </Link>
                  <Link to="/bookRequests">
                    <MenuItem>Requests for me</MenuItem>
                  </Link>
                  <Link to="/myRequests">
                    <MenuItem>My requests</MenuItem>
                  </Link>
                  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          ) : (
            <HStack gap={4}>
              <Link to="/login">
                <Text
                  fontWeight="medium"
                  _hover={{ color: "gray.300" }}
                  transition="ease 0.3s"
                >
                  Sign in
                </Text>
              </Link>
              <Link to="/register">
                <Text
                  bg="accent.default"
                  _hover={{ bg: "accent.event" }}
                  color="black"
                  fontWeight="medium"
                  transition="ease 0.3s"
                  borderRadius="sm"
                  paddingX={"10px"}
                  paddingY={"5px"}
                >
                  Join now
                </Text>
              </Link>
            </HStack>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
