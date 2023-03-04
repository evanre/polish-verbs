import * as React from "react";
import { ChakraProvider, ColorModeScript, extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const config: ThemeConfig = {
    initialColorMode: 'system',
    useSystemColorMode: true,
};
const theme = extendTheme({ config })


root.render(
    <React.StrictMode>
        <ChakraProvider>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
        </ChakraProvider>
    </React.StrictMode>
);
