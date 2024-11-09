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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Input as ChakraInput,
    Textarea,
    useDisclosure,
} from "@chakra-ui/react";
import Card from "../../components/Utility/Card";
import Sidebar from "../../components/Caregiver/CaregiverSidebar";

const Dashboard = () => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [newEvent, setNewEvent] = useState({ name: "", description: "", photoUrl: "" });

    useEffect(() => {
        const dummyEvents = [
            { id: 1, name: "Community Yoga", description: "Yoga session in the park.", photoUrl: "https://via.placeholder.com/150" },
            { id: 2, name: "Cooking Workshop", description: "Learn delicious meals.", photoUrl: "https://via.placeholder.com/150" },
            { id: 3, name: "Gardening", description: "Basics of gardening.", photoUrl: "https://via.placeholder.com/150" },
            { id: 4, name: "Art Therapy", description: "Express yourself through art.", photoUrl: "https://via.placeholder.com/150" },
        ];
        setEvents(dummyEvents);
    }, []);

    const handleCreateEvent = () => {
        setEvents([...events, { ...newEvent, id: events.length + 1 }]);
        toast({
            title: "Event Created",
            description: `${newEvent.name} has been added.`,
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        setNewEvent({ name: "", description: "", photoUrl: "" });
        onClose();
    };

    const handleDeleteEvent = (eventId) => {
        setEvents(events.filter((event) => event.id !== eventId));
        toast({
            title: "Event Deleted",
            description: `Event ID ${eventId} has been removed.`,
            status: "error",
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
                        <Heading>Welcome to the Caregiver Dashboard</Heading>
                        <Text>Create, manage, and review events for elderly care.</Text>
                        <Input
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="md"
                            mb={4}
                        />
                        <Button colorScheme="green" onClick={onOpen}>
                            Create Event
                        </Button>
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
                                        <Button colorScheme="blue" onClick={() => toast({ title: "Edit Event", description: `Edit event ID: ${event.id}`, status: "info", duration: 5000, isClosable: true })}>
                                            Edit
                                        </Button>
                                        <Button colorScheme="red" onClick={() => handleDeleteEvent(event.id)}>
                                            Delete
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Card>
                        </GridItem>
                    ))}
                </Grid>

                {/* Create Event Modal */}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Create New Event</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <FormControl id="name" isRequired>
                                <FormLabel>Event Name</FormLabel>
                                <ChakraInput
                                    placeholder="Enter event name"
                                    value={newEvent.name}
                                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                />
                            </FormControl>
                            <FormControl id="description" mt={4} isRequired>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    placeholder="Enter event description"
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                />
                            </FormControl>
                            <FormControl id="photoUrl" mt={4}>
                                <FormLabel>Photo URL</FormLabel>
                                <ChakraInput
                                    placeholder="Enter photo URL"
                                    value={newEvent.photoUrl}
                                    onChange={(e) => setNewEvent({ ...newEvent, photoUrl: e.target.value })}
                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={handleCreateEvent}>
                                Create Event
                            </Button>
                            <Button variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Stack>
        </Sidebar>
    );
};

export default Dashboard;
