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
  Spinner,
} from "@chakra-ui/react";
import Card from "../../components/Utility/Card";
import Sidebar from "../../components/Caregiver/CaregiverSidebar";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const toast = useToast();
  const { userId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEvent, setNewEvent] = useState({
    organizerId: userId, 
    name: "",
    time: "",
    date: "",
    location: "",
    description: "",
    capacity: "",
    budget: "",
    images: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/https://eventease-439518.ue.r.appspot.com/api/events/all"
        );
        const data = await response.json();

        if (response.ok) {
          setEvents(data.data || []); // Assuming API returns a "data" array
          setIsLoading(false);
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
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const handleCreateEvent = async () => {
    const formData = new FormData();
    formData.append("organizerId", newEvent.organizerId);
    formData.append("name", newEvent.name);
    formData.append("time", newEvent.time);
    formData.append("date", newEvent.date);
    formData.append("location", newEvent.location);
    formData.append("description", newEvent.description);
    formData.append("capacity", newEvent.capacity);
    formData.append("budget", newEvent.budget);
    if (newEvent.images) {
      Array.from(newEvent.images).forEach((image) =>
        formData.append("images", image)
      );
    }

    try {
      const response = await fetch(
        "https://cors-anywhere.herokuapp.com/https://eventease-439518.ue.r.appspot.com/api/events",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        toast({
          title: "Event Created",
          description: `${newEvent.name} has been added.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error(data.message || "Failed to create the event.");
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

        {isLoading ? (
          <Spinner size="xl" color="teal.500" alignSelf="center" mt={6} />
        ) : (
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
                      src={
                        event.images && event.images.length > 0
                          ? event.images[0].url
                          : "https://via.placeholder.com/150"
                      }
                      alt={event.name}
                      boxSize="150px"
                      objectFit="cover"
                      borderRadius="md"
                      mb={3}
                      fallbackSrc="https://via.placeholder.com/150"
                    />
                    <Box flex="1">
                      <Heading size="md" mb={2}>
                        {event.name}
                      </Heading>
                      <Text>{event.description}</Text>
                      <Text mt={2} fontSize="sm" color="gray.600">
                        {event.date} at {event.time}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Location: {event.location}
                      </Text>
                    </Box>
                  </Stack>
                </Card>
              </GridItem>
            ))}
          </Grid>
        )}

        {/* Create Event Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Form inputs for creating a new event */}
              <FormControl id="name" isRequired>
                <FormLabel>Event Name</FormLabel>
                <ChakraInput
                  placeholder="Enter event name"
                  value={newEvent.name}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="time" mt={4} isRequired>
                <FormLabel>Time</FormLabel>
                <ChakraInput
                  type="time"
                  placeholder="Enter event time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="date" mt={4} isRequired>
                <FormLabel>Date</FormLabel>
                <ChakraInput
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="location" mt={4} isRequired>
                <FormLabel>Location</FormLabel>
                <ChakraInput
                  placeholder="Enter location"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="description" mt={4} isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Enter event description"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="budget" mt={4} isRequired>
                <FormLabel>Budget</FormLabel>
                <Textarea
                  placeholder="Enter event budget"
                  value={newEvent.budget}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, budget: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="capacity" mt={4} isRequired>
                <FormLabel>Capacity</FormLabel>
                <Textarea
                  placeholder="Enter event capacity"
                  value={newEvent.capacity}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, capacity: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="images" mt={4}>
                <FormLabel>Images</FormLabel>
                <ChakraInput
                  type="file"
                  multiple
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, images: e.target.files })
                  }
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
