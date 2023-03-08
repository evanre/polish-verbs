import * as React from 'react';
import {
    Box,
    chakra,
    Container,
    Stack,
    Text,
    VisuallyHidden,
    useColorModeValue,
} from '@chakra-ui/react';
import { CgWebsite } from 'react-icons/cg';

const SocialButton = ({
    children,
    label,
    href,
}: {
    children: React.ReactNode;
    label: string;
    href: string;
}) => (
    <chakra.button
        bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
        rounded={'full'}
        w={8}
        h={8}
        cursor={'pointer'}
        as={'a'}
        href={href}
        display={'inline-flex'}
        alignItems={'center'}
        justifyContent={'center'}
        transition={'background 0.3s ease'}
        _hover={{
            bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
        }}>
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
    </chakra.button>
);

export const Footer = () => (
    <Box
        as="footer"
        bg={useColorModeValue('gray.50', 'gray.900')}
        color={useColorModeValue('gray.700', 'gray.200')}>
        <Container
            as={Stack}
            maxW={'6xl'}
            py={4}
            direction={{base: 'column', md: 'row'}}
            spacing={4}
            justify={{base: 'center', md: 'space-between'}}
            align={{base: 'center', md: 'center'}}
            textAlign={'center'}
        >
            <Text>Made by <a href="https://zhuchenko.com" target="_blank" rel="noreferrer">Yevhen Zhuchenko</a>. Tables from <a href="https://www.tastingpoland.com" target="_blank" rel="noreferrer">Tasting Poland</a></Text>
            <Stack direction={'row'} spacing={6}>
                <SocialButton label={'Website'} href={'https://zhuchenko.net'}>
                    <CgWebsite />
                </SocialButton>
            </Stack>
        </Container>
    </Box>
);