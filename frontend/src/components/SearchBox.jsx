import React, { useState } from "react";
import { FormControl, Input, Button } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword("");
    } else {
      navigate("/");
    }
  };

  return (
    <FormControl display="flex">
      <Input
        type="text"
        mb="6"
        placeholder="Search a book..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        borderRightRadius={0}
      />
      <Button
        borderRadius="sm"
        size="md"
        bg="accent.default"
        _hover={{ bg: "accent.event" }}
        color="black"
        borderLeftRadius={0}
        onClick={submitHandler}
      >
        <FaSearch />
      </Button>
    </FormControl>
  );
};

export default SearchBox;
