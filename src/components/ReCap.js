import React, { forwardRef } from "react";

import {
  Text,
  VStack,
  AspectRatio,
  Stack,
  SimpleGrid,
  Box,
  Center,
} from "@chakra-ui/react";
import { useLanguage } from "./LanguageToggle";
import translations from "./Translation";

const ReCap = forwardRef((props, ref) => {
  const { language } = useLanguage();

  const cardsData = [
    {
      title: translations[language].recap.participants,
      number: "480",
      backgroundImage:
        process.env.PUBLIC_URL + "images/recap_participants_card.png",
    },
    {
      title: translations[language].recap.churches,
      number: "31",
      backgroundImage: process.env.PUBLIC_URL + "images/recap_church_card.png",
    },
    {
      title: translations[language].recap.ngos,
      number: "22",
      backgroundImage: process.env.PUBLIC_URL + "images/recap_ngo_card.png",
    },
    {
      title: translations[language].recap.peopleReached,
      number: "814",
      backgroundImage: process.env.PUBLIC_URL + "images/recap_reached_card.png",
    },
  ];

  return (
    <VStack
      w="100%"
      bgColor="#F9EEE3"
      gap="5"
      p={{ sm: "5rem" }}
      py={{ base: "2.5rem" }}
      px={{ base: "1rem", md: "2rem", lg: "3rem", xl: 0 }}
      textColor="#183B5D"
      ref={ref}
      alignItems={{ base: "flex-start", md: "center" }}
    >
      <Text
        fontFamily="Antonio"
        fontWeight="700"
        fontSize={{ base: "1.75rem", md: "2.25rem" }}
      >
        {translations[language].recap.title}
      </Text>

      <Text
        fontFamily="Manrope"
        fontWeight="400"
        fontSize={{ base: "0.875rem", md: "1.25rem" }}
        textAlign={{ base: "left", md: "center", lg: "center" }}
        px={{ base: "0rem", md: "5rem", lg: "8rem" }}
      >
        {translations[language].recap.description}
      </Text>

      <Stack
        direction={{ base: "column", lg: "row" }}
        w="100%"
        marginTop={{ base: "1.313rem", sm: "0rem", lg: "1.5rem" }}
        alignItems="center"
        justifyContent={"center"}
      >
        <Center>
          <AspectRatio
            width={{ base: "22rem", md: "25rem", lg: "50vw" }}
            ratio={16 / 9}
          >
            <iframe
              title="video-embed"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              src="https://www.youtube.com/embed/-eJF2S0YZPs?si=YK4vQbOCQ_H66NPR"
            />
          </AspectRatio>
        </Center>

        <Center>
          <SimpleGrid
            columns={2}
            spacing={{ base: "0.938rem", lg: "1.25rem" }}
            marginLeft={{ sm: "1rem" }}
            marginTop={{ base: "1.621rem", lg: "0rem" }}
          >
            {cardsData.map((card) => (
              <Box
                key={card.title}
                width={{ base: "9.813rem", lg: "11.95rem", xl: "13.75rem" }}
                height={{ base: "8.188rem", lg: "10rem", xl: "11.5rem" }}
                alignItems="center"
                justifyContent="center"
                backgroundImage={card.backgroundImage}
                backgroundSize="contain"
              >
                <VStack
                  p={{ base: "1rem", lg: "2rem" }}
                  h="100%"
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Text
                    fontFamily="Antonio"
                    fontSize={{ base: "2rem", sm: "2rem", lg: "2.75rem" }}
                    fontWeight="700"
                    textAlign="center"
                  >
                    {card.number}
                  </Text>
                  <Text
                    fontFamily="Manrope"
                    fontSize={{ base: "0.875rem", sm: "0.5rem", lg: "1rem" }}
                    fontWeight="800"
                    textAlign="center"
                    letterSpacing="0.12rem"
                  >
                    {card.title}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Center>
      </Stack>
    </VStack>
  );
});

export default ReCap;
