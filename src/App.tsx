import * as React from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SearchForm } from "./components/SearchForm";
import { Container, Flex } from "@chakra-ui/react";

export const App = () => {
    return (
        <Flex direction="column" minH="100vh">
            <Header />
            <Container as="main" maxW={'6xl'} w={'100%'} p={1} flexGrow={1} centerContent>
                <SearchForm />
            </Container>
            <Footer />
        </Flex>
    );
}
