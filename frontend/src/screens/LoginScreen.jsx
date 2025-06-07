import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import {
  Button,
  FormControl,
  Input,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { setCredentials } from "../slices/authSlice";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((store) => store.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Please fill out all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
    } catch (err) {
      toast({
        title: err?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Text fontSize="2xl" mb="5" textAlign="center">
        Sign in to ChapterSwap
      </Text>
      <VStack
        display="flex"
        alignItems="left"
        width={{ base: "100%", md: "40%" }}
        mx="auto"
      >
        <FormControl>
          <Text mb="1">Email address</Text>
          <Input
            type="email"
            placeholder="me@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <Text mb="1">Password</Text>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button
          bg="accent.default"
          width="full"
          color="#000000"
          size="sm"
          mt={6}
          _hover={{ bg: "accent.event" }}
          onClick={submitHandler}
          isLoading={isLoading}
          borderRadius="sm"
        >
          Sign in
        </Button>
      </VStack>
    </>
  );
};

export default LoginScreen;
