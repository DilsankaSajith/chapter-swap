import { Button, useToast } from '@chakra-ui/react';
import {
  useFollowUserMutation,
  useMyProfileQuery,
  useUnfollowUserMutation,
} from '../slices/usersApiSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FollowUserButton = ({ user, width }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [followUser, { isLoading: loadingFollow }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: loadingUnfollow }] =
    useUnfollowUserMutation();
  const {
    data: userDetails,
    isLoading: loadingUser,
    error: errorUserLoading,
  } = useMyProfileQuery();
  const { userInfo } = useSelector((store) => store.auth);

  const followHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      await followUser(user._id).unwrap();

      toast({
        title: `You followed ${user.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: err?.data?.message || err?.error,
        status: 'error',
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
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: err?.data?.message || err?.error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {userDetails?.follwings.includes(user._id) ? (
        <Button
          borderRadius="sm"
          size="sm"
          bg="accent.light"
          _hover={{ bg: 'accent.event' }}
          color="black"
          isLoading={loadingUnfollow}
          onClick={unfollowHandler}
          width={width}
          fontSize="md"
          fontWeight="medium"
        >
          Following
        </Button>
      ) : (
        <Button
          borderRadius="sm"
          size="sm"
          bg="accent.default"
          _hover={{ bg: 'accent.event' }}
          color="black"
          isLoading={loadingFollow}
          onClick={followHandler}
          width={width}
          fontSize="md"
          fontWeight="medium"
        >
          Follow
        </Button>
      )}
    </>
  );
};

export default FollowUserButton;
