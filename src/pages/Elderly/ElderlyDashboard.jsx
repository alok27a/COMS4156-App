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

  // Fetch events from API
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
          setEvents(
            data.data.map((event) => ({
              id: event.id,
              name: event.name,
              description: event.description,
              location: event.location,
              date: event.date,
              time: event.time || "TBA",
              host: `${event.host.firstName} ${event.host.lastName}`,
              photoUrl: "https://via.placeholder.com/150", // Placeholder for event images
            }))
          );
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
      console.log(data);

      if (data.success) {
        toast({
          title: "RSVP Successful",
          description: "You have successfully RSVPed for the event.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "RSVP Failed",
          description: data.message || "An unexpected error occurred.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while RSVPing.",
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

            {/* Search Input */}
            <Input
              placeholder="Search events by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="md"
            />

            {/* Filter Options */}
            <Flex gap={4} mt={4}>
              <Input
                placeholder="Filter by location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Flex>
          </Stack>
        </Card>

        {/* Event Cards */}
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
                minHeight="350px" // Min height to keep cards uniform, but allows expanding if needed
                overflow="hidden" // Prevent overflow of card content
              >
                <Stack align="center" spacing={3} textAlign="center" flex="1">
                  {/* Image section */}
                  <Image
                    src={event.photoUrl}
                    alt={event.name}
                    boxSize="150px"
                    objectFit="cover"
                    borderRadius="md"
                    mb={3} // Adds space between image and content
                  />

                  {/* Event details */}
                  <Box
                    flex="1"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Heading size="md" mb={2}>
                      {event.name}
                    </Heading>

                    {/* Description with wrapping */}
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      mb={2}
                      whiteSpace="normal" // Allows the description to wrap to the next line
                    >
                      {event.description}
                    </Text>

                    {/* Other details */}
                    <Text fontSize="sm" color="gray.500">
                      Location: {event.location}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Date: {event.date}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Time: {event.time}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Host: {event.host}
                    </Text>
                  </Box>

                  {/* RSVP Button */}
                  <Button
                    colorScheme="blue"
                    mt={2}
                    onClick={() => handleRSVP(event.id)}
                    w="full" // Makes the button span full width
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
