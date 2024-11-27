import React, { useEffect, useState } from "react";
import {
  Stack,
  Heading,
  Text,
  Button,
  Image,
  Box,
  useToast,
  Input,
  Grid,
  GridItem,
  Flex,
} from "@chakra-ui/react";
import Card from "../../components/Utility/Card";
import Sidebar from "../../components/Elderly/ElderlySidebar";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { userId } = useParams();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://eventease-439518.ue.r.appspot.com/api/events/all"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch events.");
        }
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
        } else {
          throw new Error("Failed to load events.");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchEvents();
  }, [toast]);

  const handleRSVP = async (eventId) => {
    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://eventease-439518.ue.r.appspot.com/api/events/${eventId}/rsvp/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "ATTENDING",
            notes: "Looking forward to the event!",
            reminderSent: true,
            eventRole: "PARTICIPANT",
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast({
          title: "RSVP Successful",
          description: "You have successfully RSVPed for the event.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(data.message || "An unexpected error occurred.");
      }
    } catch (error) {
      toast({
        title: "RSVP Failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredEvents = events
    .filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((event) =>
      location
        ? event.location.toLowerCase().includes(location.toLowerCase())
        : true
    );

  return (
    <Sidebar userId={userId}>
      <Stack p={4} gap={3}>
        <Card>
          <Stack gap={3}>
            <Heading>Welcome to Your Dashboard</Heading>
            <Text>Check out upcoming events below and RSVP!</Text>
            <Input
              placeholder="Search events by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="md"
            />
            <Flex gap={4} mt={4}>
              <Input
                placeholder="Filter by location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Flex>
          </Stack>
        </Card>

        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
          {filteredEvents.map((event) => (
            <GridItem key={event.id}>
              <Card
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                bg="teal.50"
                _hover={{ bg: "teal.100" }}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                minHeight="350px"
                overflow="hidden"
              >
                <Stack align="center" spacing={3} textAlign="center" flex="1">
                  <Image
                    src={event.images && event.images.length > 0 ? event.images[0].url : 'https://via.placeholder.com/150'}
                    alt={event.name}
                    boxSize="150px"
                    objectFit="cover"
                    borderRadius="md"
                    mb={3}
                    fallbackSrc="https://via.placeholder.com/150"
                  />
                  <Box
                    flex="1"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Heading size="md" mb={2}>
                      {event.name}
                    </Heading>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      mb={2}
                      whiteSpace="normal"
                    >
                      {event.description}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Location: {event.location}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Date: {event.date}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Time: {event.time || "TBA"}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Host: {`${event.host.firstName} ${event.host.lastName}`}
                    </Text>
                  </Box>
                  <Button
                    colorScheme="blue"
                    mt={2}
                    onClick={() => handleRSVP(event.id)}
                    w="full"
                  >
                    RSVP
                  </Button>
                </Stack>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </Stack>
    </Sidebar>
  );
};

export default Dashboard;