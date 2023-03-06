import * as React from 'react';
import Fuse from 'fuse.js';
import {
    Flex,
    FormControl,
    Text,
    Heading,
    Input,
    InputGroup,
    InputRightElement, Button, VStack, StackDivider, HStack, background, Image, ButtonGroup, Tag, TagLabel, TagLeftIcon
} from "@chakra-ui/react";
import capitalize from 'lodash/capitalize';
import { CgCloseO, CgMathMinus, CgMathPlus } from "react-icons/cg";

import verbsObj from '../verbs.json';

interface Verb {
    verb: string
    fullVerb: string
    list: string[]
    link: string
    img: string
}

export const SearchForm = () => {
    const fuse = React.useMemo(() => new Fuse(Object.values(verbsObj), {
        includeScore: true,
        threshold: 0.3,
        keys: ['verb', 'list'],
    }), [verbsObj])

    const [filterText, setFilterText] = React.useState<string>('');
    const [filteredVerbs, setFilteredVerbs] = React.useState<Fuse.FuseResult<Verb>[]>([]);
    const [selectedVerbs, setSelectedVerbs] = React.useState<Verb['fullVerb'][]>([]);

    React.useEffect(() => {
        setFilteredVerbs(fuse.search(filterText));
    }, [filterText]);

    const updateSelectedVerbs = (fullVerb: string) => {
        selectedVerbs.includes(fullVerb) ? setSelectedVerbs(selectedVerbs.filter(v => v !== fullVerb)) : setSelectedVerbs([...selectedVerbs, fullVerb]);
    };

    return (
        <>
            <Heading mb="5%">
                Polish Verbs Conjunctions
            </Heading>
            <FormControl maxW={"500px"} >
                <InputGroup size="lg">
                    <Input
                        placeholder="Start typing..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                    <InputRightElement children={
                        <Button
                            onClick={() => setFilterText('')}
                            isDisabled={!filterText}
                            aria-label="Clear search"
                        >
                            <CgCloseO />
                        </Button>
                    } />
                </InputGroup>
            </FormControl>

            <HStack spacing={2}>
                {['sm', 'md', 'lg'].map((size) => (
                    <Button leftIcon={<CgMathPlus />} key={size} variant='outline'>
                        {size}
                    </Button>
                ))}
            </HStack>

            {filteredVerbs.length > 0 && (
                <VStack
                    divider={<StackDivider />}
                    borderWidth='1px'
                    borderRadius='md'
                    p={3}
                    my={4}
                    w='100%'
                    alignItems='stretch'
                >
                    {
                        filteredVerbs.map(({ item }) => (
                            <Flex
                                key={item.fullVerb}
                                p={3}
                                borderRadius={'md'}
                                flexWrap={'wrap'}
                                alignItems={'flex-start'}
                            >
                                <ButtonGroup
                                    mr={3}
                                >
                                    <Button
                                        onClick={() => updateSelectedVerbs(item.fullVerb)}
                                    >
                                        {selectedVerbs.includes(item.fullVerb) ? <CgMathMinus /> : <CgMathPlus />}
                                    </Button>
                                    <Button
                                        onClick={() => setFilterText('')}
                                        isDisabled={!filterText}
                                        aria-label="Clear search"
                                    >
                                        <CgCloseO />
                                    </Button>
                                </ButtonGroup>
                                <Heading size={'lg'}>
                                    {capitalize(item.verb)}
                                </Heading>
                                <Text
                                    mt={2}
                                >
                                    {item.list.join(', ')}
                                </Text>
                            </Flex>
                        ))
                    }
                </VStack>
            )}

            <VStack
                divider={<StackDivider />}
                borderWidth='1px'
                borderRadius='md'
                p={3}
                my={4}
                w='100%'
                alignItems='stretch'
            >
                {selectedVerbs.length > 0 ? (
                    selectedVerbs.map((fullVerb) => (
                        <Flex
                            key={fullVerb}
                            p={3}
                            borderRadius={'md'}
                            flexWrap={'wrap'}
                            alignItems={'flex-start'}
                        >
                            <Button
                                mr={3}
                                onClick={() => updateSelectedVerbs(fullVerb)}
                            >
                                {selectedVerbs.includes(fullVerb) ? <CgMathMinus /> : <CgMathPlus />}
                            </Button>
                            <Heading size={'lg'}>
                                {capitalize(verbsObj[fullVerb].verb)}
                            </Heading>
                            <Image
                                src={'/images/' + verbsObj[fullVerb].img}
                                alt={verbsObj[fullVerb].fullVerb}
                                w={'100%'}
                                h={'auto'}
                                borderRadius={'3xl'}
                                mt={3}
                            />
                        </Flex>
                    ))
                ) : (
                    <Text textAlign="center" m={5}>Nothin' selected yet</Text>
                )}
            </VStack>
        </>
    );
};
