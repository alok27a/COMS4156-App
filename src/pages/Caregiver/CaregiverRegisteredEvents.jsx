import React, { useEffect, useState } from "react";
import {
    Stack,
    Heading,
    Text,
    Button,
    Image,
    Box,
    Input,
    Grid,
    GridItem,
    useToast,
} from "@chakra-ui/react";
import Card from "../../components/Utility/Card";
import Sidebar from "../../components/Caregiver/CaregiverSidebar";

const CaregiverRegisteredEvents = () => {
    const toast = useToast();
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetching registered events (dummy data for now)
    useEffect(() => {
        const dummyEvents = [
            { id: 1, name: "Community Yoga", description: "Yoga session in the park.", photoUrl: "https://via.placeholder.com/150" },
            { id: 2, name: "Art Therapy", description: "Express yourself through art.", photoUrl: "https://via.placeholder.com/150" },
            { id: 3, name: "Gardening Basics", description: "Learn to grow plants.", photoUrl: "https://via.placeholder.com/150" },
        ];
        setRegisteredEvents(dummyEvents);
    }, []);

    // Unregister from an event
    const handleUnregisterEvent = (eventId) => {
        setRegisteredEvents(registeredEvents.filter((event) => event.id !== eventId));
        toast({
            title: "Unregistered Successfully",
            description: `You have been unregistered from the event.`,
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    };

    // Filter events based on search term
    const filteredEvents = registeredEvents.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Sidebar>
            <Stack p={4} gap={3}>
                <Card>
                    <Stack gap={3}>
                        <Heading>Your Registered Events</Heading>
                        <Text>View and manage events you are registered for.</Text>
                        <Input
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="md"
                            mb={4}
                        />
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
                                bg="purple.50"
                                _hover={{ bg: "purple.100" }}
                                h="300px"
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
                                        <Text overflowY="auto" maxHeight="60px">
                                            {event.description}
                                        </Text>
                                    </Box>
                                    <Stack direction="row" spacing={3} mt={2}>
                                        <Button
                                            colorScheme="blue"
                                            onClick={() =>
                                                toast({
                                                    title: "View Event Details",
                                                    description: `Details of event ID: ${event.id}`,
                                                    status: "info",
                                                    duration: 5000,
                                                    isClosable: true,
                                                })
                                            }
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            colorScheme="red"
                                            onClick={() => handleUnregisterEvent(event.id)}
                                        >
                                            Unregister
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Card>
                        </GridItem>
                    ))}
                </Grid>
            </Stack>
        </Sidebar>
    );
};

export default CaregiverRegisteredEvents;
