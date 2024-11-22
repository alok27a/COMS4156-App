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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import Card from "../../components/Utility/Card";
import Sidebar from "../../components/Caregiver/CaregiverSidebar";
import { useParams } from "react-router-dom";

const CaregiverRegisteredEvents = () => {
  const { userId } = useParams();
  const toast = useToast();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [isAttendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    photoUrl: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://eventease-439518.ue.r.appspot.com/api/events/all"
        );
        const data = await response.json();

        if (response.ok && data.data) {
          setRegisteredEvents(data.data);
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

  const handleViewDetails = async (eventId) => {
    try {
      const response = await fetch(
        `https://eventease-439518.ue.r.appspot.com/api/events/${eventId}/attendees`
      );
      const data = await response.json();

      if (response.ok && data.data) {
        setAttendees(data.data);
        setAttendeeModalOpen(true);
      } else {
        throw new Error(data.message || "Failed to fetch attendees.");
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

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEditFormData({
      name: event.name,
      description: event.description,
      photoUrl: event.photoUrl,
    });
    setEditModalOpen(true);
  };

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

        <Box>
          {/* Section for Events with Buttons */}
          <Heading size="lg" mb={4} textAlign="center">
            My Events
          </Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
            {filteredEvents
              .filter((event) => String(event.host?.id) === userId)
              .map((event) => (
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
                        <Text overflowY="auto" maxHeight="60px">
                          {event.description}
                        </Text>
                      </Box>
                      <Stack direction="column" spacing={3} mt={4}>
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
                        <Button
                          colorScheme="blue"
                          onClick={() => handleViewDetails(event.id)}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Stack>
                  </Card>
                </GridItem>
              ))}
          </Grid>

          {/* Section for Events Without Buttons */}
          <Heading size="lg" mt={8} mb={4} textAlign="center">
            Other Events
          </Heading>
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
            {filteredEvents
              .filter((event) => String(event.host?.id) !== userId)
              .map((event) => (
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
                        <Text overflowY="auto" maxHeight="60px">
                          {event.description}
                        </Text>
                      </Box>
                    </Stack>
                  </Card>
                </GridItem>
              ))}
          </Grid>
        </Box>
      </Stack>

      {/* Attendee Modal */}
      <Modal
        isOpen={isAttendeeModalOpen}
        onClose={() => setAttendeeModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Attendees</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>User ID</Th>
                  <Th>Name</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {attendees.map((attendee) => (
                  <Tr key={attendee.user.id}>
                    <Td>{attendee.user.id}</Td>
                    <Td>
                      {attendee.user.firstName} {attendee.user.lastName}
                    </Td>
                    <Td>{attendee.status}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setAttendeeModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
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
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl>
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
            <Button colorScheme="blue" onClick={saveEditedEvent}>
              Save
            </Button>
            <Button onClick={() => setEditModalOpen(false)} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Sidebar>
  );
};

export default CaregiverRegisteredEvents;
