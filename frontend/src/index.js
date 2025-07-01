import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store.js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import "./index.css";
import HomeScreen from "./screens/HomeScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import BookScreen from "./screens/BookScreen.jsx";
import BookRequestsScreen from "./screens/BookRequestsScreen.jsx";
import MyRequestsScreen from "./screens/MyRequestsScreen.jsx";
import RequestScreen from "./screens/RequestScreen.jsx";
import ChatScreen from "./screens/ChatScreen.jsx";
import ChatProvider from "./context/ChatProvider.js";
import UserProfileScreen from "./screens/UserProfileScreen.jsx";
import FavoriteBooksScreen from "./screens/FavoriteBooksScreen.jsx";

const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("gray.100", "#101010")(props),
    },
  }),
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const colors = {
  gray: {
    light: "#2A3035",
    dark: "#161C23",
  },
  accent: {
    default: "#20B46A",
    event: "#0BEA7A",
    light: "#0ffc85",
  },
  danger: {
    default: "#B42020",
    event: "#EA120B",
  },
};

const theme = extendTheme({
  config,
  styles,
  colors,
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />}></Route>
      <Route path="/search/:keyword" element={<HomeScreen />}></Route>
      <Route path="/login" element={<LoginScreen />}></Route>
      <Route path="/register" element={<RegisterScreen />}></Route>
      <Route path="/book/:id" element={<BookScreen />}></Route>
      <Route path="/profile/:id" element={<UserProfileScreen />}></Route>

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />}></Route>
        <Route path="/bookRequests" element={<BookRequestsScreen />}></Route>
        <Route path="/myRequests" element={<MyRequestsScreen />}></Route>
        <Route path="/requests/:id" element={<RequestScreen />}></Route>
        <Route path="/chats" element={<ChatScreen />}></Route>
        <Route path="/favorites" element={<FavoriteBooksScreen />}></Route>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChatProvider>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ChakraProvider>
  </ChatProvider>
);
