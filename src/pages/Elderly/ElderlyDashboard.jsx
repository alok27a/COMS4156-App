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
} from "@chakra-ui/react";
import Card from "../../components/Utility/Card";
import Sidebar from "../../components/Elderly/ElderlySidebar";

const Dashboard = () => {
    const toast = useToast();
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const dummyEvents = [
            {
                id: 1,
                name: "Community Yoga",
                description:
                    "Join us for a refreshing yoga session in the park.",
                photoUrl: "https://via.placeholder.com/150",
            },
            {
                id: 2,
                name: "Cooking Workshop",
                description:
                    "Learn how to make delicious meal with chef.",
                photoUrl: "https://via.placeholder.com/150",
            },
            {
                id: 3,
                name: "Gardening",
                description:
                    "Discover the basics of gardening.",
                photoUrl: "https://via.placeholder.com/150",
            },
            {
                id: 4,
                name: "Art Therapy",
                description:
                    "Express yourself through art in a guided session.",
                photoUrl: "https://via.placeholder.com/150",
            },
        ];

        setEvents(dummyEvents);
    }, []);

    const handleRSVP = (eventId) => {
        toast({
            title: "RSVP Successful",
            description: `You've successfully RSVPed for event ID: ${eventId}`,
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    };

    const filteredEvents = events.filter((event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Sidebar>

            <Stack p={4} gap={3}>
                <Card>
                    <Stack gap={3}>
                        <Heading>Welcome to Your Dashboard</Heading>
                        <Text>Check out upcoming events below and RSVP!</Text>
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
                                bg="teal.50"
                                _hover={{ bg: "teal.100" }}
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
                                    <Button
                                        colorScheme="blue"
                                        mt={2}
                                        onClick={() => handleRSVP(event.id)}
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
