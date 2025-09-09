import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/chat-app/SideDrawer';
import MyChats from '../components/chat-app/MyChats';
import ChatBox from '../components/chat-app/ChatBox';

const ChatScreen = () => {
  return (
    <div style={{ width: '100%' }}>
      <SideDrawer />
      <Box display="flex" justifyContent="space-between" w="100%" h="80vh">
        <MyChats />
        <ChatBox />
      </Box>
    </div>
  );
};

export default ChatScreen;
