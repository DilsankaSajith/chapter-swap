import { Flex, Avatar, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import FollowUserButton from "./FollowUserButton";

const FollowUser = ({ user }) => {
  return (
    <Flex alignItems="center" justifyContent="space-between" width="full">
      <Link to={`/profile/${user._id}`}>
        <Flex alignItems="center" gap="8px" cursor="pointer">
          <Avatar src={user.profilePicture} name={user.name} size="sm" />
          <Text>{user.name}</Text>
        </Flex>
      </Link>
      <FollowUserButton user={user} />
    </Flex>
  );
};

export default FollowUser;
