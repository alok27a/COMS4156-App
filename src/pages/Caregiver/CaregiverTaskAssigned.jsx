import React, { useEffect, useState } from "react";
import {
    Stack,
    Heading,
    Text,
    Button,
    Box,
    Input,
    Grid,
    GridItem,
    useToast,
    Badge,
} from "@chakra-ui/react";
import Card from "../../components/Utility/Card";
import Sidebar from "../../components/Caregiver/CaregiverSidebar";
import axios from "axios"; // Ensure axios is installed
import { useParams } from "react-router-dom";


const CaregiverAssignedTasks = () => {
    const toast = useToast();
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    // const userId = 1; // Replace with dynamic user ID if needed
    const { userId } = useParams();
    // Fetch assigned tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // console.log(userId)
                const response = await axios.get(
                    `https://eventease-439518.ue.r.appspot.com/api/tasks/user/${userId}`
                );
                if (response.data && response.data.success) {
                    // Transform API data into the required format
                    const transformedTasks = response.data.data.map((task) => ({
                        id: task.id,
                        title: task.name,
                        description: task.description,
                        status: task.status,
                    }));

                    console.log(response.data)
                    setTasks(transformedTasks);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to fetch tasks.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                toast({
                    title: "Error",
                    description: "Unable to fetch tasks. Please try again later.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchTasks();
    }, [userId, toast]);

    // Mark task as completed
    const handleMarkAsCompleted = (taskId) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId ? { ...task, status: "COMPLETED" } : task
            )
        );
        toast({
            title: "Task Completed",
            description: `You have completed the task.`,
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    };

    // Filter tasks based on search term
    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Sidebar>
            <Stack p={4} gap={3}>
                <Card>
                    <Stack gap={3}>
                        <Heading>Your Assigned Tasks</Heading>
                        <Text>View and manage the tasks assigned to you.</Text>
                        <Input
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="md"
                            mb={4}
                        />
                    </Stack>
                </Card>

                <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
                    {filteredTasks.map((task) => (
                        <GridItem key={task.id}>
                            <Card
                                p={4}
                                borderWidth="1px"
                                borderRadius="md"
                                boxShadow="md"
                                bg={task.status === "COMPLETED" ? "green.50" : "yellow.50"}
                                _hover={{
                                    bg: task.status === "COMPLETED" ? "green.100" : "yellow.100",
                                }}
                                h="200px"
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                            >
                                <Stack spacing={3}>
                                    <Box>
                                        <Heading size="md">{task.title}</Heading>
                                        <Text mt={2}>{task.description}</Text>
                                    </Box>
                                    <Badge
                                        colorScheme={
                                            task.status === "COMPLETED" ? "green" : "orange"
                                        }
                                    >
                                        {task.status}
                                    </Badge>
                                </Stack>
                                {task.status !== "COMPLETED" && (
                                    <Button
                                        colorScheme="blue"
                                        mt={4}
                                        onClick={() => handleMarkAsCompleted(task.id)}
                                    >
                                        Mark as Completed
                                    </Button>
                                )}
                            </Card>
                        </GridItem>
                    ))}
                </Grid>
            </Stack>
        </Sidebar>
    );
};

export default CaregiverAssignedTasks;
