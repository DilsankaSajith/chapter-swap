import { Flex, Avatar, Text, Button, useToast } from "@chakra-ui/react";
import {
  useFollowUserMutation,
  useMyProfileQuery,
  useUnfollowUserMutation,
} from "../slices/usersApiSlice";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const FollowUser = ({ user }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const { userInfo } = useSelector((store) => store.auth);

  const [followUser, { isLoading: loadingFollow }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: loadingUnfollow }] =
    useUnfollowUserMutation();
  const {
    data: userDetails,
    isLoading: loadingUser,
    error: errorUserLoading,
  } = useMyProfileQuery();

  const followHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate("/login");
      return;
    }
    try {
      await followUser(user._id).unwrap();

      toast({
        title: `You followed ${user.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: err?.data?.message || err?.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const unfollowHandler = async (e) => {
    e.preventDefault();
    try {
      await unfollowUser(user._id).unwrap();

      toast({
        title: `You unfollowed ${user.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: err?.data?.message || err?.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex alignItems="center" justifyContent="space-between" width="full">
      <Link to={`/profile/${user._id}`}>
        <Flex alignItems="center" gap="8px" cursor="pointer">
          <Avatar src={user.profilePicture} name={user.name} size="sm" />
          <Text>{user.name}</Text>
        </Flex>
      </Link>
      {userDetails?.follwings.includes(user._id) ? (
        <Button
          borderRadius="sm"
          size="sm"
          bg="accent.light"
          _hover={{ bg: "accent.event" }}
          color="black"
          isLoading={loadingUnfollow}
          onClick={unfollowHandler}
        >
          Following
        </Button>
      ) : (
        <Button
          borderRadius="sm"
          size="sm"
          bg="accent.default"
          _hover={{ bg: "accent.event" }}
          color="black"
          isLoading={loadingFollow}
          onClick={followHandler}
        >
          Follow
        </Button>
      )}
    </Flex>
  );
};

export default FollowUser;
