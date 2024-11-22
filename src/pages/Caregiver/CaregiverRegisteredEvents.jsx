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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Textarea,
} from "@chakra-ui/react";
import Card from "../../components/Utility/Card";
import Sidebar from "../../components/Caregiver/CaregiverSidebar";
import { useParams } from "react-router-dom";

const CaregiverRegisteredEvents = () => {
    const { userId } = useParams(); // Get the current user's ID from the route parameters
    const toast = useToast();
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: "",
        description: "",
        photoUrl: "",
    });

    // Fetch events from the API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(
                    "https://eventease-439518.ue.r.appspot.com/api/events/all"
                );
                const data = await response.json();

                if (response.ok && data.data) {
                    setRegisteredEvents(data.data); // Assuming `data.data` contains the event list
                } else {
                    throw new Error(data.message || "Failed to fetch events.");
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

    // Open Edit Modal
    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setEditFormData({
            name: event.name,
            description: event.description,
            photoUrl: event.photoUrl,
        });
        setEditModalOpen(true);
    };

    // Save changes for editing
    const saveEditedEvent = async () => {
        try {
            const response = await fetch(
                `https://cors-anywhere.herokuapp.com/https://eventease-439518.ue.r.appspot.com/api/events/${selectedEvent.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editFormData),
                }
            );

            if (response.ok) {
                toast({
                    title: "Event Updated",
                    description: "The event was successfully updated.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });

                // Update event in local state
                setRegisteredEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.id === selectedEvent.id
                            ? { ...event, ...editFormData }
                            : event
                    )
                );

                setEditModalOpen(false);
            } else {
                throw new Error("Failed to update event.");
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

    // Delete an event
    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await fetch(
                `https://cors-anywhere.herokuapp.com/https://eventease-439518.ue.r.appspot.com/api/events/${eventId}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                toast({
                    title: "Event Deleted",
                    description: "The event was successfully deleted.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });

                setRegisteredEvents((prevEvents) =>
                    prevEvents.filter((event) => event.id !== eventId)
                );
            } else {
                throw new Error("Failed to delete event.");
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
                                        src={event.photoUrl || "https://via.placeholder.com/150"}
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
                                        {String(event.host?.id) === userId && (
                                            <>
                                                <Button
                                                    colorScheme="teal"
                                                    onClick={() => handleEditEvent(event)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    colorScheme="red"
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </Stack>
                                </Stack>
                            </Card>
                        </GridItem>
                    ))}
                </Grid>
            </Stack>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Event</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Name</FormLabel>
                            <Input
                                value={editFormData.name}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, name: e.target.value })
                                }
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                value={editFormData.description}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, description: e.target.value })
                                }
                            />
                        </FormControl>
                        <FormControl mb={4}>
                            <FormLabel>Photo URL</FormLabel>
                            <Input
                                value={editFormData.photoUrl}
                                onChange={(e) =>
                                    setEditFormData({ ...editFormData, photoUrl: e.target.value })
                                }
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={saveEditedEvent}>
                            Save
                        </Button>
                        <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Sidebar>
    );
};

export default CaregiverRegisteredEvents;
