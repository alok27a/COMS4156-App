import React, { useEffect, useState } from "react";
import {
    Stack,
    Heading,
    Text,
    Box,
    useToast,
    Grid,
    GridItem,
    Badge,
} from "@chakra-ui/react";
import Card from "../../components/Utility/Card";
import Sidebar from "../../components/Elderly/ElderlySidebar";
import { useParams } from "react-router-dom";

const ElderlyRegisteredEvents = () => {
    const { userId } = useParams();
    const toast = useToast();
    const [registeredEvents, setRegisteredEvents] = useState([]);

    // Fetch registered events
    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            try {
                const response = await fetch(
                    `https://eventease-439518.ue.r.appspot.com/api/events/rsvp/user/${userId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch registered events.");
                }

                const data = await response.json();

                if (data.success && data.data) {
                    // Extract events and status from the API response
                    const events = data.data.map((item) => ({
                        id: item.event.id,
                        name: item.event.name,
                        description: item.event.description,
                        location: item.event.location,
                        date: item.event.date,
                        time: item.event.time,
                        status: item.status, // Add status to each event
                    }));
                    setRegisteredEvents(events);
                } else {
                    throw new Error("Invalid response from server.");
                }
            } catch (error) {
                toast({
                    title: "Error Fetching Events",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchRegisteredEvents();
    }, [userId, toast]);

    // Function to get color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case "CONFIRMED":
                return "green";
            case "PENDING":
                return "yellow";
            case "CANCELLED":
                return "red";
            default:
                return "gray";
        }
    };

    return (
        <Sidebar userId={userId}>
            <Stack p={4} gap={3}>
                <Card>
                    <Stack gap={3}>
                        <Heading>Registered Events</Heading>
                        <Text>Here are the events you have registered for:</Text>
                    </Stack>
                </Card>

                {registeredEvents.length > 0 ? (
                    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
                        {registeredEvents.map((event) => (
                            <GridItem key={event.id}>
                                <Card
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    boxShadow="md"
                                    bg="blue.50"
                                    _hover={{ bg: "blue.100" }}
                                    h="300px" // Fixed height for uniform card size
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="space-between"
                                >
                                    <Stack spacing={3}>
                                        <Heading size="md">{event.name}</Heading>
                                        <Text>{event.description}</Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Location: {event.location}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Date: {event.date}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            Time: {event.time}
                                        </Text>
                                        <Box>
                                            <Badge colorScheme={getStatusColor(event.status)}>
                                                {event.status}
                                            </Badge>
                                        </Box>
                                    </Stack>
                                </Card>
                            </GridItem>
                        ))}
                    </Grid>
                ) : (
                    <Card>
                        <Text>No registered events to display.</Text>
                    </Card>
                )}
            </Stack>
        </Sidebar>
    );
};

export default ElderlyRegisteredEvents;
