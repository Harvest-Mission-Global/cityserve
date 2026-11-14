import { Link, Container, Text, Box, HStack, Icon } from "@chakra-ui/react";
import { FaInstagram } from "react-icons/fa6";
import { MdMailOutline } from "react-icons/md";
import LanguageToggle from "./LanguageToggle";

const Footer = () => {
  return (
    <Box maxW="100vw" bgColor="#DAEDFA" p={0}>
      <Container maxW="container.xl" py="1rem" px={0}>
        <Box
          display={"flex"}
          w="100%"
          flexDir={{ base: "column", xl: "row" }}
          py={["0", "2em"]}
          alignItems={{ base: "flex-start", xl: "center" }}
          justifyContent={{ base: "center", xl: "space-between" }}
          rowGap={"1rem"}
          px={{ base: "1rem", md: "2rem", lg: "3rem", xl: 0 }}
        >
          <LanguageToggle />

          <Link
            fontFamily="'Antonio', sans-serif"
            fontSize={{ base: "1.125rem", md: "1.25rem" }}
            fontWeight="700"
            textTransform="uppercase"
            color="#0053A4"
            _hover={{ cursor: "pointer" }}
            href="/"
          >
            CITYSERVE HONG KONG
          </Link>
          <Text
            textAlign="center"
            color="#183B5D"
            fontSize={{ base: "0.625rem", md: "1rem" }}
            fontFamily="'Manrope', sans-serif"
            fontWeight="400"
          >
            © 2023-{new Date().getFullYear()} CityServe Hong Kong. All Rights Reserved.
          </Text>
          <Box
            display={"flex"}
            flexDir={{ base: "column", xl: "row" }}
            alignItems={{ base: "flex-start", xl: "center" }}
            justifyContent={{ base: "center", xl: "space-between" }}
            gap={{ base: "0.25rem", xl: "1rem" }}
          >
            <HStack alignItems={"center"}>
              <Icon
                as={FaInstagram}
                color="#183B5D"
                boxSize={{ base: "15px", md: "17.5px" }}
              />
              <Link
                color="#183B5D"
                fontSize={{ base: "0.875rem", md: "1.25rem" }}
                fontFamily="'Manrope', sans-serif"
                fontWeight="400"
                _hover={{ textDecoration: "underline" }}
                href="https://www.instagram.com/cityservehk/"
              >
                @cityservehk
              </Link>
            </HStack>
            <HStack alignItems={"center"}>
              <Icon
                as={MdMailOutline}
                color="#183B5D"
                boxSize={{ base: "15px", md: "17.5px" }}
              />

              <Link
                color="#183B5D"
                fontSize={{ base: "0.875rem", md: "1.25rem" }}
                fontFamily="'Manrope', sans-serif"
                fontWeight="400"
                wordBreak="break-word"
                href="mailto:admin@cityservehk.org"
              >
                admin@cityservehk.org
              </Link>
            </HStack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
export default Footer;
