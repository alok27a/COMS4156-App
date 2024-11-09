import { extendTheme,theme as base } from "@chakra-ui/react";

const theme = extendTheme({
    fonts:{
        heading: `Poppins, ${base.fonts?.heading}`,
        body:`Poppins, ${base.fonts?.body}`
    },
    initialColorMode: "dark",
    useSystemColorMode: true
})

export default theme