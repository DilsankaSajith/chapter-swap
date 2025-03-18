import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((store) => store.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await register({
        name,
        email,
        phone,
        address,
        city,
        state,
        postalCode,
        password,
      }).unwrap();
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
        Sign up to ChapterSwap
      </Text>
      <VStack
        display="flex"
        alignItems="left"
        width={{ base: "100%", md: "40%" }}
        mx="auto"
      >
        <Text mb="1">Fullname</Text>
        <Input
          type="text"
          placeholder="John Doe"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Text mb="1">Email address</Text>
        <Input
          type="email"
          placeholder="me@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Text mb="1">Phone</Text>
        <Input
          type="text"
          placeholder="+94 555 555 555"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Text mb="1">Address</Text>
        <Input
          type="text"
          placeholder="123 Maplewood Lane"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Text mb="1">City</Text>
        <Input
          type="text"
          placeholder="Springfield"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <Text mb="1">State</Text>
        <Input
          type="text"
          placeholder="IL"
          required
          value={state}
          onChange={(e) => setState(e.target.value)}
        />

        <Text mb="1">Postal code</Text>
        <Input
          type="text"
          placeholder="62704"
          required
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />

        <Text mb="1">Password</Text>
        <Input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Text mb="1">Confirm password</Text>
        <Input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

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
          Sign up
        </Button>
      </VStack>
    </>
  );
};

export default RegisterScreen;
