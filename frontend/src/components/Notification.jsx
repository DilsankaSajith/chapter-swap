import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import NotificationBadge from './NotificationBadge';
import {
  useGetAllNotificationsQuery,
  useReadNotificationMutation,
} from '../slices/notificationApiSlice';
import NotificationItem from './NotificationItem';
import { Link } from 'react-router-dom';

const Notification = () => {
  const {
    data: notifications,
    isLoading,
    refetch,
  } = useGetAllNotificationsQuery();
  const [readNotification, { isLoading: loadingReadNotification }] =
    useReadNotificationMutation();

  const unreadNotificationCount =
    notifications?.filter((notification) => notification.isRead === false)
      ?.length || 0;

  const markAsRead = async (id) => {
    await readNotification(id).unwrap();
    refetch();
  };

  return (
    <Menu>
      {isLoading ? (
        <></>
      ) : (
        <>
          <MenuButton
            position="relative"
            width="36px"
            height="36px"
            bg="gray.dark"
            borderRadius="full"
            cursor="pointer"
            _hover={{ bg: 'gray.700' }}
            transition="ease 0.1s"
          >
            <Flex alignItems="center" justifyContent="center">
              <FaBell className="nav-icon" />
            </Flex>

            {unreadNotificationCount > 0 && (
              <NotificationBadge value={unreadNotificationCount} />
            )}
          </MenuButton>
          <MenuList>
            {!notifications.length ? (
              <Text p={2}>No Notifications</Text>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification._id}
                  to={
                    notification.type === 'Followed'
                      ? `/profile/${notification.sender._id}`
                      : notification.type === 'Book Added'
                      ? `/book/${notification.book._id}`
                      : notification.type === 'Requested'
                      ? '/bookRequests'
                      : notification.type === 'Accepted'
                      ? '/myRequests'
                      : notification.type === 'Delivered' ||
                        notification.type === 'Arrived'
                      ? `/requests/${notification.request}`
                      : notification.type === 'Canceled' ||
                        notification.type === 'Rejected'
                      ? ''
                      : ''
                  }
                  onClick={() => markAsRead(notification._id)}
                >
                  <MenuItem key={notification._id} mb={3}>
                    <NotificationItem notification={notification} />
                  </MenuItem>
                </Link>
              ))
            )}
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default Notification;
