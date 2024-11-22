import React, { useEffect, useState } from "react";
import {
    Stack,
    Heading,
    Text,
    Button,
    Image,
    Box,
    useToast,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import Card from "../../components/Utility/Card";
import Sidebar from "../../components/Elderly/ElderlySidebar";
import { useParams } from "react-router-dom";

const ElderlyRegisteredEvents = () => {
    const { userId } = useParams();
    const toast = useToast();
    const [registeredEvents, setRegisteredEvents] = useState([]);

    // Simulate an API call to fetch registered events
    useEffect(() => {
        const fetchRegisteredEvents = async () => {
            try {
                // Replace this with a real API call
                const response = await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve([
                            {
                                id: 101,
                                name: "Healthy Cooking Class",
                                description: "Learn to prepare nutritious meals.",
                                photoUrl: "https://via.placeholder.com/150",
                            },
                            {
                                id: 102,
                                name: "Senior Zumba",
                                description: "Dance and stay fit with a fun Zumba session.",
                                photoUrl: "https://via.placeholder.com/150",
                            },
                        ]);
                    }, 1000)
                );
                setRegisteredEvents(response);
            } catch (error) {
                toast({
                    title: "Error Fetching Events",
                    description: "Unable to load registered events.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchRegisteredEvents();
    }, [toast]);

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
                                    <Stack align="center" spacing={3} textAlign="center">
                                        <Image
                                            src={event.photoUrl}
                                            alt={event.name}
                                            boxSize="150px"
                                            objectFit="cover"
                                            borderRadius="md"
                                        />
                                        <Box flex="1">
                                            <Heading size="md" mb={2}>
                                                {event.name}
                                            </Heading>
                                            <Text
                                                overflowY="auto" // Allows scrolling for long text
                                                maxHeight="60px" // Limits the height of the description
                                            >
                                                {event.description}
                                            </Text>
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
