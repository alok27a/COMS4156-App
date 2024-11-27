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
import { useDisclosure } from "@chakra-ui/react";

const CaregiverRegisteredEvents = () => {
  const { userId } = useParams();
  const toast = useToast();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isAttendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    photoUrl: "",
  });
  const [isRSVPModalOpen, setRSVPModalOpen] = useState(false);
  const [rsvpMethod, setRsvpMethod] = useState("");
  const [rsvpData, setRsvpData] = useState({
    userId: "",
    message: "",
    subject: "",
  });
  const [currentEventId, setCurrentEventId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [assignTaskData, setAssignTaskData] = useState({
    userId: "",
    task: {
      name: "",
      description: "",
      status: "PENDING",
    },
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
      const attendeesResponse = await fetch(
        `https://eventease-439518.ue.r.appspot.com/api/events/${eventId}/attendees`
      );
      const attendeesData = await attendeesResponse.json();
      const tasksResponse = await fetch(
        `https://eventease-439518.ue.r.appspot.com/api/tasks/event/${eventId}`
      );
      const tasksData = await tasksResponse.json();

      if (attendeesResponse.ok && attendeesData.data) {
        setAttendees(attendeesData.data);
      } else {
        throw new Error(attendeesData.message || "Failed to fetch attendees.");
      }
      if (tasksResponse.ok && tasksData.data) {
        setTasks(tasksData.data);
      } else {
        throw new Error(tasksData.message || "Failed to fetch tasks.");
      }
      setAttendeeModalOpen(true);
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
        {
          method: "DELETE",
        }
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

  const handleRSVPUser = (eventId) => {
    setCurrentEventId(eventId);
    setRSVPModalOpen(true);
  };

  const handleRSVPSubmit = async () => {
    try {
      const url =
        rsvpMethod === "SMS"
          ? "https://cors-anywhere.herokuapp.com/https://eventease-439518.ue.r.appspot.com/api/send-message"
          : "https://cors-anywhere.herokuapp.com/https://eventease-439518.ue.r.appspot.com/api/send-email";
      const payload =
        rsvpMethod === "SMS"
          ? {
              eventId: currentEventId.toString(),
              userId: rsvpData.userId,
              message: rsvpData.message,
            }
          : {
              eventId: currentEventId.toString(),
              userId: rsvpData.userId,
              subject: rsvpData.subject,
              message: rsvpData.message,
            };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        toast({
          title: "RSVP Sent",
          description: `RSVP sent successfully via ${rsvpMethod}.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setRSVPModalOpen(false);
        setRsvpData({ userId: "", message: "", subject: "" });
        setCurrentEventId(null);
      } else {
        throw new Error("Failed to send RSVP.");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("task.")) {
      setAssignTaskData((prevData) => ({
        ...prevData,
        task: {
          ...prevData.task,
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setAssignTaskData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmitTask = async (eventId) => {
    if (!eventId) {
      toast({
        title: "Error",
        description: "Event ID is required to assign a task.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://eventease-439518.ue.r.appspot.com/api/tasks?userId=${assignTaskData.userId}&eventId=${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(assignTaskData),
        }
      );
      if (response.ok) {
        toast({
          title: "Task Assigned",
          description: "The task was successfully assigned.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error("Failed to assign task.");
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
                        <Button
                          colorScheme="blue"
                          mr={3}
                          onClick={() => {
                            setSelectedEvent(event);
                            onOpen();
                          }}
                        >
                          Assign Task
                        </Button>
                        <Button
                          colorScheme="blue"
                          onClick={() => handleRSVPUser(event.id)}
                        >
                          RSVP a User
                        </Button>
                      </Stack>
                    </Stack>
                  </Card>
                </GridItem>
              ))}
          </Grid>
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
          </Grid>{" "}
        </Box>{" "}
      </Stack>
      {/* Attendee Modal */}
      <Modal
        isOpen={isAttendeeModalOpen}
        onClose={() => setAttendeeModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Event Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading size="md" mb={4}>
              Attendees
            </Heading>
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
            <Heading size="md" mt={6} mb={4}>
              Assigned Tasks
            </Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Task ID</Th>
                  <Th>Task Name</Th>
                  <Th>Assigned To</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tasks.map((task) => (
                  <Tr key={task.id}>
                    <Td>{task.id}</Td>
                    <Td>{task.name}</Td>
                    <Td>{task.userID.id}</Td>
                    <Td>{task.status}</Td>
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

      {/* RSVP Modal */}
      <Modal isOpen={isRSVPModalOpen} onClose={() => setRSVPModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send RSVP</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!rsvpMethod ? (
              <Stack spacing={4}>
                <Button colorScheme="blue" onClick={() => setRsvpMethod("SMS")}>
                  Send via SMS
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={() => setRsvpMethod("Email")}
                >
                  Send via Email
                </Button>
              </Stack>
            ) : (
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>User ID</FormLabel>
                  <Input
                    placeholder="Enter User ID"
                    value={rsvpData.userId}
                    onChange={(e) =>
                      setRsvpData((prev) => ({
                        ...prev,
                        userId: e.target.value,
                      }))
                    }
                  />
                </FormControl>
                {rsvpMethod === "Email" && (
                  <FormControl>
                    <FormLabel>Subject</FormLabel>
                    <Input
                      placeholder="Enter Subject"
                      value={rsvpData.subject}
                      onChange={(e) =>
                        setRsvpData((prev) => ({
                          ...prev,
                          subject: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    placeholder="Enter Message"
                    value={rsvpData.message}
                    onChange={(e) =>
                      setRsvpData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleRSVPSubmit}
              isDisabled={
                !rsvpData.userId ||
                !rsvpData.message ||
                (rsvpMethod === "Email" && !rsvpData.subject)
              }
            >
              Send RSVP
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setRsvpMethod("");
                setRSVPModalOpen(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Assign Task Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>User ID</FormLabel>
              <Input
                name="userId"
                value={assignTaskData.userId}
                onChange={handleInputChange}
                placeholder="Enter User ID"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Task Name</FormLabel>
              <Input
                name="task.name"
                value={assignTaskData.task.name}
                onChange={handleInputChange}
                placeholder="Enter Task Name"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="task.description"
                value={assignTaskData.task.description}
                onChange={handleInputChange}
                placeholder="Enter Task Description"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleSubmitTask(selectedEvent.id)}
            >
              Assign Task
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Sidebar>
  );
};
export default CaregiverRegisteredEvents;
