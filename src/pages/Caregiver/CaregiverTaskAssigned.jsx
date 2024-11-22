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

const CaregiverAssignedTasks = () => {
    const toast = useToast();
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch assigned tasks (dummy data for now)
    useEffect(() => {
        const dummyTasks = [
            { id: 1, title: "Grocery Shopping", description: "Buy groceries for Mrs. Smith.", status: "Pending" },
            { id: 2, title: "Medication Reminder", description: "Remind Mr. Brown to take his medicine at 8 PM.", status: "Completed" },
            { id: 3, title: "Laundry Assistance", description: "Help Ms. Green with her laundry.", status: "Pending" },
        ];
        setTasks(dummyTasks);
    }, []);

    // Mark task as completed
    const handleMarkAsCompleted = (taskId) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId ? { ...task, status: "Completed" } : task
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
                                bg={task.status === "Completed" ? "green.50" : "yellow.50"}
                                _hover={{
                                    bg: task.status === "Completed" ? "green.100" : "yellow.100",
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
                                            task.status === "Completed" ? "green" : "orange"
                                        }
                                    >
                                        {task.status}
                                    </Badge>
                                </Stack>
                                {task.status === "Pending" && (
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
