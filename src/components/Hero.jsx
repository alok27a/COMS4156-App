import React from "react";
import {
  Stack,
  Heading,
  Button,
  Container,
  Image,
  Flex,
  Box,
  useDisclosure,
  useToast,
  Text
} from "@chakra-ui/react";

import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import { useNavigate } from "react-router-dom";

import Security from "../assets/elderly.jpg";

const Hero = () => {
  const toast = useToast()
  const [show, setShow] = React.useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  // SIGN UP DETAILS
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [registerLoading, setRegisterLoading] = React.useState(false)

  const handleClick = () => setShow(!show)

  const signupUser = async () => {
    if (!firstName || !lastName || !username || !password || !email || !phoneNumber) {
      toast({
        title: 'Error!',
        description: "Missing Fields",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    } else {
      setRegisterLoading(true)
      try {
        let result = await fetch("https://cors-anywhere.herokuapp.com/https://eventease-439518.ue.r.appspot.com/api/users/add", {
          method: "POST",
          body: JSON.stringify({
            id:999,
            firstName,
            lastName,
            username,
            password,
            email,
            phoneNumber,
            role: "ELDERLY"
          }),
          headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
          }
        })
        let response = await result.json()
        if (response.success) {
          toast({
            title: 'Success!',
            description: response.message,
            status: 'success',
            duration: 9000,
            isClosable: true,
          })
        } else {
          throw new Error(response.message)
        }
      } catch (error) {
        toast({
          title: 'Error!',
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
      } finally {
        setRegisterLoading(false)
      }
    }
  }

  return (
    <Container maxW="container.xl" bg="">
      <Stack direction={{ base: "column", md: "row" }} py={8}>
        <Flex flex="1">
          <Stack justifyContent="center" gap={8}>
            <Box maxW="50ch">
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                A Platform for Event Management
              </Heading>
            </Box>
            <Stack direction="row" gap={8}>
              <Button colorScheme="blue" p={4} onClick={onOpen}>
                Sign Up
              </Button>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Create your account</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    <FormControl mb={3}>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        placeholder='Enter First Name'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </FormControl>
                    <FormControl mb={3}>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        placeholder='Enter Last Name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </FormControl>
                    <FormControl mb={3}>
                      <FormLabel>Username</FormLabel>
                      <Input
                        placeholder='Enter Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </FormControl>
                    <FormControl mb={3}>
                      <FormLabel>Email</FormLabel>
                      <Input
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormControl>
                    <FormControl mb={3}>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        placeholder='Enter Phone Number'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </FormControl>
                    <FormControl mb={3}>
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={show ? 'text' : 'password'}
                          placeholder='Enter password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputRightElement width='4.5rem'>
                          <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={signupUser} isLoading={registerLoading} loadingText="Submitting">
                      Submit
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Stack>
          </Stack>
        </Flex>
        <Flex flex="0.85" pt={{ base: 4, md: 0 }}>
          <Image src={Security} alt="Security" />
        </Flex>
      </Stack>
    </Container>
  );
};

export default Hero;