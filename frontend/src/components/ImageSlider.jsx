import { Link } from "react-router-dom";
import { useGetTopBooksQuery } from "../slices/booksApiSlice";
import { Spinner } from "@chakra-ui/react";

const ImageSlider = () => {
  const { data: books, isLoading } = useGetTopBooksQuery();

  return isLoading ? <Spinner /> : <div></div>;
};

export default ImageSlider;
