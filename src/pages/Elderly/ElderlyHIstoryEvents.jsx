import React, { useEffect, useState } from "react";
import {
    Stack,
    Heading,
    Text,
    Image,
    Box,
    useToast,
    Grid,
    GridItem,
} from "@chakra-ui/react";
import Card from "../../components/Utility/Card";
import Sidebar from "../../components/Elderly/ElderlySidebar";
import { useParams } from "react-router-dom";

const ElderlyHistoryEvents = () => {
    const { userId } = useParams();
    const toast = useToast();
    const [historyEvents, setHistoryEvents] = useState([]);

    // Simulate an API call to fetch history events
    useEffect(() => {
        const fetchHistoryEvents = async () => {
            try {
                // Replace this with a real API call
                const response = await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve([
                            {
                                id: 201,
                                name: "Painting Workshop",
                                description: "A relaxing painting workshop for all skill levels.",
                                photoUrl: "https://via.placeholder.com/150",
                                date: "2024-10-15",
                            },
                            {
                                id: 202,
                                name: "Mindfulness Meditation",
                                description: "A session to practice mindfulness and reduce stress.",
                                photoUrl: "https://via.placeholder.com/150",
                                date: "2024-11-05",
                            },
                        ]);
                    }, 1000)
                );
                setHistoryEvents(response);
            } catch (error) {
                toast({
                    title: "Error Fetching Events",
                    description: "Unable to load event history.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchHistoryEvents();
    }, [toast]);

    return (
        <Sidebar userId={userId}>
            <Stack p={4} gap={3}>
                <Card>
                    <Stack gap={3}>
                        <Heading>Event History</Heading>
                        <Text>Below is a list of events you have attended:</Text>
                    </Stack>
                </Card>

                {historyEvents.length > 0 ? (
                    <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
                        {historyEvents.map((event) => (
                            <GridItem key={event.id}>
                                <Card
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    boxShadow="md"
                                    bg="gray.50"
                                    _hover={{ bg: "gray.100" }}
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
                                            <Text mt={2} fontSize="sm" color="gray.500">
                                                Date: {event.date}
                                            </Text>
                                        </Box>
                                    </Stack>
                                </Card>
                            </GridItem>
                        ))}
                    </Grid>
                ) : (
                    <Card>
                        <Text>No past events to display.</Text>
                    </Card>
                )}
            </Stack>
        </Sidebar>
    );
};

export default ElderlyHistoryEvents;
