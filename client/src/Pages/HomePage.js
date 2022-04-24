import React from "react";
import {Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react"
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";

export default function HomePage() {
  return <Container maxW='xl' centerContent>
    <Box 
    d='flex'
    justifyContent='center'
    p={3}
    bg={"white"}
    w="100%"
    m="40px 0 15px 0"
    borderRadius='lg'
    borderWidth='1px'
    >
      <Text fontSize='4xl' fontFamily="Work sans" color="black">
        UA-Chat
      </Text >
    </Box >
    <Box borderRadius='lg' borderWidth='1px' w="100%" bg={"white"} p={4} color="black">

    <Tabs variant='soft-rounded' colorScheme='green'>
  <TabList mb={'1em'}>
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Register</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <Register/>
    </TabPanel>
  </TabPanels>
</Tabs>



    </Box>
    </Container>;
}
