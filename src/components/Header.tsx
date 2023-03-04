import * as React from 'react';
import {
    Box,
    Flex,
    Link,
    Button,
    Stack,
    useColorModeValue,
    useColorMode,
} from '@chakra-ui/react';
import { CgMoon, CgSun } from "react-icons/cg";

export const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <Box as="header" bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
            <Flex maxW={'6xl'} m={'0 auto'} h={16} alignItems={'center'} justifyContent={'space-between'}>
                <Box>Polish Verbs <strong>Conjunctions</strong></Box>

                <Flex alignItems={'center'}>
                    <Stack direction={'row'} spacing={7}>
                        <Button onClick={toggleColorMode}>
                            {colorMode === 'light' ? <CgMoon /> : <CgSun />}
                        </Button>
                    </Stack>
                </Flex>
            </Flex>
        </Box>
    );
}