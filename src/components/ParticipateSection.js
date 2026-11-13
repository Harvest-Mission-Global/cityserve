import React, { forwardRef } from "react";

import {
  Text,
  Image,
  Container,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  VStack,
  Link,
  Button,
} from "@chakra-ui/react";
import { useLanguage } from "./LanguageToggle";
import translations from "./Translation";

const ParticipateSection = forwardRef((props, ref) => {
  const { language } = useLanguage();

  const InfoBox = (iconPath, title, subtitle, description, subdescription) => {
    return (
      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="flex-start"
        p="1rem"
        w={{ base: "100%", lg: "32%" }}
        gap="0.75rem"
        minH="100%"
        maxH="100%"
      >
        <Image
          src={process.env.PUBLIC_URL + "images/participate/" + iconPath}
          minH="6rem"
          maxH="6rem"
          mb={"1rem"}
        />

        <Text
          fontWeight={700}
          fontSize={{ base: "1.5rem", md: "1.75rem" }}
          fontFamily="'Antonio', sans-serif"
          textTransform={"uppercase"}
          textAlign={"center"}
          wordBreak="break-word"
          color="#183B5D"
        >
          {title}
        </Text>
        <Text
          fontWeight={800}
          fontSize={{ base: "0.875rem", md: "1rem" }}
          fontFamily="'Manrope', sans-serif"
          textTransform={"uppercase"}
          textAlign={"center"}
          wordBreak="break-word"
        >
          {subtitle}
        </Text>
        <Text
          fontWeight={400}
          fontSize={{ base: "0.875rem", md: "1.25rem" }}
          fontFamily="'Manrope', sans-serif"
          textAlign={"center"}
          wordBreak="break-word"
        >
          {description}
        </Text>
      </Box>
    );
  };

  const CustomDivider = () => {
    return (
      <Divider
        orientation="vertical"
        borderColor="#183B5D"
        borderWidth={"1px"}
        minHeight={"400px"}
        display={{ base: "none", lg: "block" }}
      />
    );
  };

  return (
    <Container
      maxW="container.xl"
      px={{ base: "1rem", md: "2rem", lg: "3rem", xl: 0 }}
      pt="5rem"
      pb={{ base: "0", lg: "5rem" }}
      ref={ref}
    >
      <Box
        display="flex"
        flexDirection={{ base: "column", lg: "row" }}
        p={0}
        maxW="100%"
        alignItems={{ base: "flex-start", lg: "center" }}
        justifyContent={{ base: "center", lg: "flex-start" }}
        gap={{ base: "1rem", lg: "10vw" }}
        mb={"4rem"}
      >
        <Text
          fontWeight={800}
          fontSize={{ base: "1.75rem", md: "2.25rem" }}
          textTransform={"uppercase"}
          maxW={{ base: "100%", lg: "35%" }}
          fontFamily="'Antonio', sans-serif"
        >
          {translations[language].participate.howTo}
        </Text>
        <Text
          fontWeight={400}
          fontSize={{ base: "0.875rem", md: "1.25rem" }}
          fontFamily="'Manrope', sans-serif"
          maxW={{ base: "100%", lg: "45%" }}
        >
          {translations[language].participate.avenues}
        </Text>
      </Box>

      <Box
        py={"1.25rem"}
        px={{ base: "0.85rem", md: "1.375rem" }}
        bgColor={"#DAEDFA"}
        borderRadius={{ base: 0, lg: "2rem" }}
      >
        <Tabs variant="unstyled" width="100%">
          <TabList
            width={"100%"}
            p={"0.25rem"}
            bg={"#FFFFFF"}
            borderRadius={"0.625rem"}
          >
            <Tab
              _selected={{ color: "#F9EEE3", bg: "#183B5D" }}
              borderRadius="0.625rem"
              color={"#183B5D"}
              textTransform={"uppercase"}
              flex={0.5}
              fontSize={{ base: "0.875rem", md: "1rem" }}
              py={"0.75rem"}
              // px={"0.2rem"}
              fontWeight={800}
              fontFamily={"Manrope, sans-serif"}
              letterSpacing={"0.1rem"}
              width={"33%"}
            >
              {translations[language].participate.forIndividuals}
            </Tab>
            <Tab
              _selected={{ color: "#F9EEE3", bg: "#183B5D" }}
              borderRadius="0.625rem"
              color={"#183B5D"}
              textTransform={"uppercase"}
              flex={0.5}
              fontSize={{ base: "0.875rem", md: "1rem" }}
              py={"0.75rem"}
              fontWeight={800}
              fontFamily={"Manrope, sans-serif"}
              letterSpacing={"0.1rem"}
              width={"33%"}
            >
              {translations[language].participate.forChurches}
            </Tab>
            <Tab
              _selected={{ color: "#F9EEE3", bg: "#183B5D" }}
              borderRadius="0.625rem"
              color={"#183B5D"}
              textTransform={"uppercase"}
              flex={0.5}
              fontSize={{ base: "0.875rem", md: "1rem" }}
              py={"0.75rem"}
              fontWeight={800}
              fontFamily={"Manrope, sans-serif"}
              letterSpacing={"0.1rem"}
              width={"33%"}
            >
              {translations[language].participate.forNGOs}
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box
                display="flex"
                flexDir="column"
                alignItems={"center"}
                justifyContent={"center"}
                mt={"1.25rem"}
                gap={{ base: "1.5rem", lg: "2rem" }}
              >
                <VStack w="100%" gap={10}>
                  <VStack gap={"2rem"} marginX={{ base: "1.25rem" }}>
                    <Text
                      fontFamily="Manrope"
                      fontSize={{ base: "0.875rem", md: "1.25rem" }}
                      fontWeight="400"
                      textAlign="center"
                    >
                      {translations[language].joinUs.description}
                      &nbsp;
                      <Link
                        href="mailto:admin@cityserve.hk"
                        target="_blank"
                        variant="underline"
                        fontWeight="700"
                        textDecoration="underline"
                      >
                        {translations[language].joinUs.link}
                      </Link>
                      .
                    </Text>
                  </VStack>

                  <Button
                    bgColor="#183B5D"
                    textColor="white"
                    fontFamily="Manrope"
                    fontWeight="900"
                    fontSize={{ base: "0.875rem", lg: "1rem" }}
                    letterSpacing="0.12rem"
                    textAlign="center"
                    borderRadius="0.625rem"
                    height="3.125rem"
                    width="17.5rem"
                    as={Link}
                    target="_blank"
                    // href="https://forms.gle/ucGjxo2caEK36wYb6"
                    sx={{
                      _hover: {
                        textDecoration: "none",
                        bg: "#1769B8", // Background color on hover
                        color: "white", // Text color on hover
                      },
                    }}
                    isDisabled
                  >
                    {translations[language].interestForm}
                  </Button>
                </VStack>
                {/* <Text
                  textTransform={"uppercase"}
                  fontSize={{ base: "0.875rem", md: "1rem" }}
                  fontFamily={"Manrope, sans-serif"}
                  fontWeight="800"
                  textAlign={"center"}
                  letterSpacing={"0.12rem"}
                >
                  {translations[language].participate.chooseMode}
                </Text> */}
              </Box>
            </TabPanel>
            <TabPanel>
              <Box
                display="flex"
                flexDir="column"
                alignItems={"center"}
                justifyContent={"center"}
                mt={"1.25rem"}
                gap={{ base: "1.5rem", lg: "2rem" }}
              >
                <Button
                  bgColor="#183B5D"
                  textColor="white"
                  fontFamily="Manrope"
                  fontWeight="900"
                  fontSize={{ base: "0.785rem", lg: "0.85rem" }}
                  letterSpacing="0.12rem"
                  textAlign="center"
                  borderRadius="0.625rem"
                  height="3.125rem"
                  width="fit-content"
                  as={Link}
                  target="_blank"
                  // href="https://forms.gle/44ri4bvJG7WuTaFf7"
                  sx={{
                    _hover: {
                      textDecoration: "none",
                      bg: "#1769B8", // Background color on hover
                      color: "white", // Text color on hover
                    },
                  }}
                  isDisabled
                >
                  {translations[language].church_interestForm}
                </Button>
                <Text
                  textTransform={"uppercase"}
                  fontSize={{ base: "0.875rem", md: "1rem" }}
                  fontFamily={"Manrope, sans-serif"}
                  fontWeight="800"
                  textAlign={"center"}
                  letterSpacing={"0.12rem"}
                >
                  {translations[language].participate.chooseMode}
                </Text>

                <Box
                  display={"flex"}
                  flexDir={{ base: "column", lg: "row" }}
                  alignItems={{ base: "flex-start" }}
                  justifyContent={"center"}
                  mt={"1.25rem"}
                  gap={"2rem"}
                >
                  {InfoBox(
                    "participant.svg",
                    translations[language].participate.participant,
                    "",
                    translations[language].participate.participantDescription,
                  )}
                  {CustomDivider()}
                  {InfoBox(
                    "partner.svg",
                    translations[language].participate.partner,
                    "",
                    translations[language].participate.partnerDescription,
                  )}
                  {CustomDivider()}
                  {InfoBox(
                    "planner.svg",
                    translations[language].participate.planner,
                    "",
                    translations[language].participate.plannerDescription,
                  )}
                </Box>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box
                display="flex"
                flexDir="column"
                alignItems={"center"}
                justifyContent={"center"}
                mt={"1.25rem"}
                gap={{ base: "1.5rem", lg: "2rem" }}
              >
                <Text
                  textTransform={"uppercase"}
                  fontSize={{ base: "0.875rem", md: "1rem" }}
                  fontFamily={"Manrope, sans-serif"}
                  fontWeight={800}
                  textAlign={"center"}
                  letterSpacing={"0.12rem"}
                >
                  {translations[language].participate.ifNGOs}
                </Text>
                <Box
                  display={"flex"}
                  flexDir={{ base: "column", lg: "row" }}
                  alignItems={{ base: "flex-start" }}
                  justifyContent={"center"}
                  mt={"1.25rem"}
                  gap={"2rem"}
                >
                  {InfoBox(
                    "engage.svg",
                    translations[language].participate.engage,
                    "",
                    translations[language].participate.engageDescription,
                    "",
                  )}
                  {CustomDivider()}
                  {InfoBox(
                    "empower.svg",
                    translations[language].participate.empower,
                    "",
                    translations[language].participate.empowerDescription,
                    "",
                  )}
                  {CustomDivider()}
                  {InfoBox(
                    "exhibit.svg",
                    translations[language].participate.exhibit,
                    "",
                    translations[language].participate.exhibitDescription,
                    "",
                  )}
                </Box>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
});

export default ParticipateSection;
