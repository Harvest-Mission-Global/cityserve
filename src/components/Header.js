import { HStack, Text, Link, Button, Img, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "./LanguageToggle";
import translations from "./Translation";

const Header = ({ recapRef, joinusRef }) => {
  const { language } = useLanguage();

  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const scrollToRecap = () => {
    if (recapRef.current) {
      recapRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToParticipate = () => {
    if (joinusRef.current) {
      joinusRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <VStack gap="0.4" background="black">
      <HStack
        w="100%"
        h="9vh"
        bgColor="#F8F8F8"
        paddingX={{ base: "5vw", md: "5vw", lg: "5vw", xl: "5vw" }}
        justifyContent="space-between"
        fontFamily="Manrope"
        letterSpacing="0.12em"
        fontWeight="800"
        pos="fixed"
        top="0"
        zIndex="10"
      >
        <Link
          fontFamily="Antonio"
          fontSize={{ base: "1.3rem", md: "1.8rem" }}
          textColor="#0053A4"
          _hover={{ cursor: "pointer" }}
          href="/"
        >
          CITYSERVE
        </Link>

        {/* Desktop version */}
        <HStack
          flex={1}
          gap="2.5rem"
          display={{ base: "none", lg: "flex" }}
          justifyContent="end"
        >
          <Link onClick={scrollToRecap}>
            <Text fontSize="1rem">{translations[language].header.recap}</Text>
          </Link>
          <Link onClick={scrollToParticipate}>
            <Text fontSize="1rem">
              {translations[language].header.participate}
            </Text>
          </Link>
          <Button
            bgColor="#1769B8"
            textColor="#F8F8F8"
            fontSize="0.75rem"
            fontWeight="800"
            //href="https://forms.gle/ucGjxo2caEK36wYb6"
            as={Link}
            _hover={{ bg: "#183B5D", textDecor: "none" }}
            target="_blank"
            borderRadius="0.6rem"
            p="1.5rem"
            isDisabled
          >
            {translations[language].interestForm}
          </Button>
          <LanguageToggle />
        </HStack>

        {/* Mobile version */}
        <HStack
          display={{ base: "flex", lg: "none" }}
          w="25%"
          justifyContent="end"
        >
          <Button
            backgroundColor="transparent"
            onClick={toggleDropdown}
            variant="unstyled"
          >
            <Img
              src={process.env.PUBLIC_URL + "images/three_dots.svg"}
              boxSize={7}
              mr={2}
              my="auto"
            />
          </Button>
          <LanguageToggle />
        </HStack>
      </HStack>

      <HStack
        w="100%"
        h={{ base: "5vh", md: "7.5vh" }}
        bgColor="#F8F8F8"
        paddingX="5vw"
        justifyContent="space-between"
        fontFamily="Manrope"
        letterSpacing="0.12em"
        fontWeight="800"
        fontSize={{ base: "0.7rem", md: "1rem" }}
        display={isOpen ? "flex" : "none"}
        pos="fixed"
        top="9vh"
        zIndex={10}
      >
        <Link onClick={scrollToRecap}>
          <Text>{translations[language].header.recap}</Text>
        </Link>
        <Link onClick={scrollToParticipate}>
          <Text>{translations[language].header.participate}</Text>
        </Link>
        <Button
          bgColor="#1769B8"
          textColor="#F8F8F8"
          fontSize={{ base: "0.3rem", md: "0.75rem" }}
          fontWeight="800"
          // href="https://forms.gle/ucGjxo2caEK36wYb6"
          as={Link}
          target="_blank"
          borderRadius="0.7rem"
          h="70%"
          p={{ base: "1rem", md: "1.5rem" }}
          isDisabled
        >
          {translations[language].interestForm}
        </Button>
      </HStack>
    </VStack>
  );
};

export default Header;
