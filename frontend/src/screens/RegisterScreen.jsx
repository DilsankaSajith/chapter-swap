import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
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
  const [profilePicture, setProfilePicture] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

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
        profilePicture,
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUploadingImage(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "chapterswap");
    data.append("cloud_name", "deqbtjlgk");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/deqbtjlgk/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const uploadedImageURL = await res.json();
    setProfilePicture(uploadedImageURL.url);
    setUploadingImage(false);
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
        <FormControl isRequired>
          <FormLabel mb="1">Fullname</FormLabel>
          <Input
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel mb="1">Profile picture</FormLabel>
          <Input
            type="file"
            p={1}
            cursor="pointer"
            onChange={handleFileUpload}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mb="1">Email address</FormLabel>
          <Input
            type="email"
            placeholder="me@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mb="1">Phone</FormLabel>
          <Input
            type="text"
            placeholder="+94 555 555 555"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mb="1">Address</FormLabel>
          <Input
            type="text"
            placeholder="123 Maplewood Lane"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mb="1">City</FormLabel>
          <Input
            type="text"
            placeholder="Springfield"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mb="1">State</FormLabel>
          <Input
            type="text"
            placeholder="IL"
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mb="1">Postal code</FormLabel>
          <Input
            type="text"
            placeholder="62704"
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mb="1">Password</FormLabel>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel mb="1">Confirm password</FormLabel>
          <Input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          disabled={uploadingImage}
        >
          Sign up
        </Button>
      </VStack>
    </>
  );
};

export default RegisterScreen;
