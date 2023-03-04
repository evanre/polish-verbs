import * as React from 'react';
import Fuse from 'fuse.js';
import {
    Box,
    Card,
    CardBody,
    Flex,
    FormControl,
    Text,
    Heading,
    Input,
    Spinner,
    InputGroup,
    InputRightElement, Button
} from "@chakra-ui/react";
import {CgCloseO} from "react-icons/cg";

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
    //const [selectedVerbs, setSelectedVerbs] = React.useState<Fuse.FuseResult<Verb>[]>([]);

    React.useEffect(() => {
        setFilteredVerbs(fuse.search(filterText));
    }, [filterText]);

    return (
        <Box padding="4">
            <Heading mb="5%">
                Polish Verbs Conjunctions
            </Heading>
            <FormControl mr="5%">
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

            <Flex m="8" justifyContent="center" flexWrap="wrap">
                {filteredVerbs.length ?
                    filteredVerbs.map(({ item }) => (
                    <Card key={item.fullVerb}>
                        <CardBody>
                            <Text>
                                {item.verb}
                            </Text>
                        </CardBody>
                    </Card>
                )) : <Spinner size='xl' />}
            </Flex>
        </Box>
    );
};
