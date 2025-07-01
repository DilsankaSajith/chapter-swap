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
  Badge,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { FaBell, FaFacebookMessenger, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";
import { ChatState } from "../context/ChatProvider";
import { getSender } from "../utils/helpers";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((store) => store.auth);
  const { notifications, setNotifications, selectedChat, setSelectedChat } =
    ChatState();

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
    <Box bg="gray.dark" border="1px" borderColor="gray.light">
      <Container maxWidth="6xl" py="2">
        <Flex alignItems="center" justifyContent="space-between">
          <Link to="/">
            <Text fontSize="xl" fontWeight="medium">
              ChapterSwap
            </Text>
          </Link>

          {userInfo ? (
            <HStack>
              <Menu>
                <MenuButton
                  position="relative"
                  onClick={() => navigate("/chats")}
                >
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
                    <FaFacebookMessenger className="nav-icon" />
                  </Flex>
                  {notifications.length > 0 && (
                    <Badge
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      variant="solid"
                      colorScheme="red"
                      borderRadius="full"
                      w={5}
                      h={5}
                      position="absolute"
                      right={0}
                      top={0}
                    >
                      {notifications.length}
                    </Badge>
                  )}
                </MenuButton>
                <MenuList>
                  {!notifications.length && "No new messages"}
                  {notifications.map((notif) => (
                    <MenuItem
                      key={notif._id}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotifications(
                          notifications.filter((n) => n !== notif)
                        );
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${
                            getSender(userInfo, notif.chat.users).name
                          }`}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

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
                name={userInfo?.name}
                src={userInfo?.profilePicture}
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
                    <MenuItem>Wants</MenuItem>
                  </Link>
                  <Link to="/myRequests">
                    <MenuItem>Asks</MenuItem>
                  </Link>
                  <Link to="/favorites">
                    <MenuItem>Saved</MenuItem>
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
