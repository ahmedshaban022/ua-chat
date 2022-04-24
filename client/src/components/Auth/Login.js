import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement,  useToast, VStack } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react';
import {useHistory} from "react-router-dom";

const Login = () => {
   
    const [email,setEmail] =useState();
    const [password,setPassword] =useState();
    const [showPass,setShowPass]=useState(false);
    const [loading,setLoading]=useState(false);
    const history=useHistory()
    const toast = useToast()

   

    const submitHandler= async()=>{

        setLoading(true);
        if( !email || !password ){
            toast({
                title: 'Email and password Feilds are required',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position:"bottom",
              });
              setLoading(false);
              return;
        }

        try {
            const config={
                headers:{"Content-type":"application/json"},
            };
            const {data}= await axios.post('/api/user/login',
            {email,password},config);
            console.log(data);
            setLoading(false);
            toast({
                title: 'Login Success',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position:"bottom",
              });
              
              localStorage.setItem('userInfo',JSON.stringify(data));
              setLoading(false);
              history.push('/chats');
            
        } catch (error) {
           
            setLoading(false);
            toast({
                title: 'Email or password is wrong !',
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position:"bottom",
              });
              return;
        }
        
         
    }

  return (
    <VStack spacing='5px' color="black">

        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter  Your Email' 
            onChange={(e)=>{setEmail(e.target.value)}} value={email}
            />
        </FormControl>

        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input type={showPass?"text":"password"} placeholder='Enter Password' 
            onChange={(e)=>{setPassword(e.target.value)}} value={password}
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size='sm' onClick={()=>setShowPass(!showPass)}>
                {showPass? "Hide":"Show"} </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <Button colorScheme="green" 
        width="100%" style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>
            Login
        </Button>

        <Button variant='solid' colorScheme="red" 
        width="100%" style={{marginTop:15}} onClick={()=>{setEmail("guest@example.com"); setPassword("123456")}}>
            Get Guest User Credntials
        </Button>
    </VStack>
  )
}

export default Login