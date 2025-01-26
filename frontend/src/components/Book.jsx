import { Card, CardBody, Image, Text, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const Book = ({ book }) => {
  return (
    <Link to="/book/bookId">
      <Card
        maxW="sm"
        minH="350px"
        bg="gray.dark"
        transition="ease 0.1s"
        _hover={{ bg: "gray.900" }}
      >
        <CardBody>
          <Image src={book.image} alt="book1" borderRadius="lg" minW="125px" />

          <Text
            fontWeight="normal"
            fontSize="lg"
            mt="2"
            fontFamily="Joan"
            letterSpacing="1px"
          >
            {book.title}
          </Text>
          <Text color="gray.500">{book.author}</Text>

          <Flex alignItems="center" gap="8px">
            <FaStar style={{ color: "#ffbc03" }} />
            <span>{book.rating}</span>
          </Flex>
        </CardBody>
      </Card>
    </Link>
  );
};

export default Book;
