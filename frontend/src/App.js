import { Outlet } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import Header from "./components/Header";

const App = () => {
  return (
    <>
      <Header />
      <Container maxWidth="6xl" my="8">
        <Outlet />
      </Container>
    </>
  );
};

export default App;
