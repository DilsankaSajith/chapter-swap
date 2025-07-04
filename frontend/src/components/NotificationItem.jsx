import { Avatar, Flex, Text } from "@chakra-ui/react";

const NotificationItem = ({ notification }) => {
  return (
    <Flex w="350px" alignItems="center" justifyContent="space-between">
      <Flex gap={3}>
        <Avatar
          size="md"
          name={notification.sender.name}
          src={notification.sender.profilePicture}
        />
        <div>
          <Text maxW="250px">{notification.message}</Text>
          <Text fontSize="sm" color={"gray.500"} mt={1}>
            {notification.createdAt.substring(0, 10)}
          </Text>
        </div>
      </Flex>

      {!notification.isRead && <div className="isReadIndicator"></div>}
    </Flex>
  );
};

export default NotificationItem;
