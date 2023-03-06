import * as React from 'react';
import Fuse from 'fuse.js';
import {
    Box,
    Flex,
    FormControl,
    Text,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Tooltip,
    Checkbox,
    Stack,
    StackDivider,
    Image,
    useBoolean,
} from "@chakra-ui/react";
import capitalize from 'lodash/capitalize';
import { CgCloseO, CgMathMinus, CgMathPlus } from "react-icons/cg";

import _verbsObj from '../verbs.json';

interface Verb {
    verb: string
    fullVerb: string
    list: string[]
    link: string
    img: string
}

const verbsObj = _verbsObj as Record<string, Verb>;

export const SearchForm = () => {
    const fuse = React.useMemo(() => new Fuse(Object.values(verbsObj), {
        includeScore: true,
        threshold: 0.3,
        keys: ['verb', 'list'],
    }), [verbsObj])

    const [filterText, setFilterText] = React.useState<string>('');
    const [filteredVerbs, setFilteredVerbs] = React.useState<Fuse.FuseResult<Verb>[]>([]);
    const [selectedVerbs, setSelectedVerbs] = React.useState<Verb['fullVerb'][]>([]);
    const [isShowingList, { toggle: toggleIsShowingList}] = useBoolean(false);

    React.useEffect(() => {
        setFilteredVerbs(fuse.search(filterText));
    }, [filterText]);

    const updateSelectedVerbs = (fullVerb: string) => {
        selectedVerbs.includes(fullVerb) ? setSelectedVerbs(selectedVerbs.filter(v => v !== fullVerb)) : setSelectedVerbs([...selectedVerbs, fullVerb]);
    };

    return (
        <>
            <Heading my="5" display={{ base: 'none', md: 'block'}}>
                Polish Verbs Conjunctions
            </Heading>
            <FormControl as={Flex} gap={3} alignItems={'center'} justifyContent={'center'} flexWrap={'wrap'}>
                <InputGroup size="lg" maxW={'500px'}>
                    <Input
                        placeholder="Start typing..."
                        value={filterText}
                        isDisabled={isShowingList}
                        onChange={e => setFilterText(e.target.value)}
                    />
                    <InputRightElement children={
                        <Button
                            onClick={() => setFilterText('')}
                            size={'sm'}
                            variant={'ghost'}
                            isDisabled={!filterText}
                            aria-label="Clear search"
                        >
                            <CgCloseO />
                        </Button>
                    } />
                </InputGroup>
                <Box p={'3'} flexShrink={0}>
                    or
                    <Checkbox
                        ml={3}
                        isChecked={isShowingList}
                        onChange={() => {toggleIsShowingList(); setFilterText('');}}
                    >
                        show the full list
                    </Checkbox>
                </Box>
            </FormControl>

            {isShowingList && (
                <>
                    <Stack spacing={3} mt={5} direction='row' flexWrap={'wrap'} justifyContent='center'>
                        {Object.values(verbsObj).map(({ verb, fullVerb }) => (
                            <Tooltip key={fullVerb} hasArrow label={fullVerb}>
                                <Button
                                    variant={selectedVerbs.includes(fullVerb) ? 'solid' : 'outline'}
                                    colorScheme={selectedVerbs.includes(fullVerb) ? 'blue' : 'gray'}
                                    onClick={() => updateSelectedVerbs(fullVerb)}

                                    mb={'3 !important'}
                                >
                                    {verb}
                                </Button>
                            </Tooltip>
                        ))}
                    </Stack>
                    <Button w={'100%'} onClick={toggleIsShowingList}>Hide list</Button>
                </>
            )}

            {filteredVerbs.length > 0 && (
                <Stack
                    divider={<StackDivider />}
                    borderWidth='1px'
                    borderRadius='md'
                    direction={'column'}
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
                                <Button
                                    mr={3}
                                    onClick={() => updateSelectedVerbs(item.fullVerb)}
                                >
                                    {selectedVerbs.includes(item.fullVerb) ? <CgMathMinus /> : <CgMathPlus />}
                                </Button>
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
                    <Button
                        onClick={() => setFilterText('')}
                        isDisabled={!filterText}
                        my={3}
                        aria-label="Clear search"
                    >
                        Clear search
                    </Button>
                </Stack>
            )}

            <Stack
                divider={<StackDivider />}
                borderWidth='1px'
                borderRadius='md'
                direction={'column'}
                p={3}
                my={4}
                w='100%'
                alignItems='stretch'
            >
                {selectedVerbs.length > 0 ? (
                    <>
                        <Button onClick={() => setSelectedVerbs([])}>Clear all selected</Button>
                        {selectedVerbs.map((fullVerb) => (
                            <Flex
                                key={fullVerb}
                                p={3}
                                borderRadius={'md'}
                                flexWrap={'wrap'}
                                alignItems={'flex-start'}
                            >
                                <Button
                                    mr={3}
                                    size={'sm'}
                                    onClick={() => updateSelectedVerbs(fullVerb)}
                                >
                                    {selectedVerbs.includes(fullVerb) ? <CgMathMinus /> : <CgMathPlus />}
                                </Button>
                                <Heading size={'lg'}>
                                    {capitalize(fullVerb)}
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
                        ))}
                        <Button onClick={() => setSelectedVerbs([])}>Clear all selected</Button>
                    </>
                ) : (
                    <Text textAlign="center" m={5}>Nothin' selected yet</Text>
                )}
            </Stack>
        </>
    );
};
