import React from "react";

import {
  Stack,
  Heading,
  Button,
  Container,
  Image,
  Flex,
  Box,
  Link,
  useDisclosure,
  useToast,
  toast,
  Textarea,
  useClipboard,
  Select,
  Text
} from "@chakra-ui/react";

import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputRightElement
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom";

import Security from "../assets/elderly.jpg";

const Hero = () => {
  const toast = useToast()

  const [show, setShow] = React.useState(false)
  const [show1, setShow1] = React.useState(false)
  const [token, setToken] = React.useState(false);

  // SIGN UP DETAILS
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [blood, setBlood] = React.useState("")
  const [categ, setCateg] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [age, setAge] = React.useState("")
  const [gender, setGender] = React.useState("")


  let [value, setValue] = React.useState('')
  const { onCopy, hasCopied } = useClipboard(value);
  const [registerLoading, setRegisterLoading] = React.useState(false)


  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  const handleClick = () => setShow(!show)

  let handleInputChange = (e) => {
    let inputValue = e.target.value
    setValue(inputValue)
  }

  const signupUser = async () => {
    if (categ == null || name == null || email == null || password == null || blood == null || address == null || age == null || gender == null) {
      toast({
        title: 'Error!',
        description: "Missing Fields",
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
    else {
      setRegisterLoading(true)
      let result = await fetch("https://organ-shield-backend.vercel.app/user/create", {
        method: "POST",
        body: JSON.stringify({
          "name": name,
          "email": email,
          "password": password,
          "blood_group": blood,
          "type": categ,
          "address": address,
          "age": age,
          "gender": gender
        }),
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
          "Access-Control-Allow-Origin": "*"
        }
      })
      setRegisterLoading(false)
      let test = await result.json()
      console.log(test)
      if (test.success) {
        console.log("result", test)
        toast({
          title: 'Success!',
          description: test.message,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      }
      else {
        toast({
          title: 'Error!',
          description: test.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
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
              <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Create your account</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    <FormControl mb={5}>
                      <FormLabel>Enter Name</FormLabel>
                      <Input
                        placeholder='Enter Here'
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                      />
                      <FormLabel>Enter E-Mail ID</FormLabel>
                      <Input
                        placeholder='Enter Here'
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                      />

                      <FormLabel>Password</FormLabel>
                      <InputGroup size='md'>
                        <Input
                          value={password}
                          onChange={(e) => { setPassword(e.target.value) }}
                          pr='4.5rem'
                          type={show ? 'text' : 'password'}
                          placeholder='Enter password'
                        />
                        <InputRightElement width='4.5rem'>
                          <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                          </Button>
                        </InputRightElement>
                      </InputGroup>

                

                      <FormLabel>Enter Age</FormLabel>
                      <Input
                        placeholder='Enter Here'
                        value={age}
                        onChange={(e) => { setAge(e.target.value) }}
                      />
                      <FormLabel>Enter Gender</FormLabel>
                      <Input
                        placeholder='Enter Here'
                        value={gender}
                        onChange={(e) => { setGender(e.target.value) }}
                      />


                    </FormControl>


                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={signupUser} isLoading={registerLoading} loadingText="Submitting">
                      Submit
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                  </ModalFooter>
                  {token && <Box
                    value={value}
                    onChange={handleInputChange}
                    w='100%'
                    p='5'
                    color='black'
                    bg='blue.200'
                  >
                    <Text fontSize='xl'>
                      Please Keep this Encrypted Key Safely!
                    </Text>
                    <br></br>
                    {value}
                    <br></br>
                    <Button onClick={onCopy} ml={2} leftIcon={<CopyIcon />} colorScheme='blue'>
                      {hasCopied ? "Copied" : "Copy"}
                    </Button>
                  </Box>}
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