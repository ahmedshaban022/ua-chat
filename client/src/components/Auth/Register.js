import React, { useState  } from 'react';
import {useHistory} from "react-router-dom";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import axios from 'axios';
const Register = () => {
    const [name,setName] =useState();
    const [email,setEmail] =useState();
    const [password,setPassword] =useState();
    const [confirmPassword,setConfirmPassword] =useState();
    const [pic,setPic] =useState();
    const [showPass,setShowPass]=useState(false);
    const [showConfPass,setShoConPass]=useState(false);
    const [loading,setLoading]=useState(false);
    const toast = useToast()
     const history = useHistory();
    
    const postDetails=(file)=>{
        setLoading(true);
        if(file===undefined){
            toast({
                title: 'Please Select an Image!',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position:"bottom",
              });
              setLoading(false)
              return;
        }
        if(file.type==="image/jpeg" || file.type==="image/png"){
            const data=new FormData();
            data.append('file',file);
            data.append('upload_preset',"ua-chat");
            data.append('cloud_name',"ua-shop");
            fetch("https://api.cloudinary.com/v1_1/ua-shop/image/upload",{
                method:'post',
                body:data,
            }).then(res=>{
                res.json().then(d=>{
                    console.log(d.url.toString())
                    setPic(d.url.toString());
                    setLoading(false);
                })
            }).catch(err=>{
                console.log(err);
                setLoading(false);
            })
        }else{
            toast({
                title: 'Please Select a correct Image!',
                status: 'info',
                duration: 3000,
                isClosable: true,
                position:"bottom",
              })

        }
    }

    const submitHandler= async()=>{
        setLoading(true);
        if(!name|| !email || !password || !confirmPassword){
            toast({
                title: 'All Feilds are required',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position:"bottom",
              });
              setLoading(false);
              return;
        }
        if(password !== confirmPassword){
            toast({
                title: 'Password not match confirm password',
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
            const {data} = await axios.post('/api/user/register',
            {name,email,password,pic},config);

            toast({
                title: 'Registration Success',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position:"bottom",
              });
              localStorage.setItem('userInfo',JSON.stringify(data));
              setLoading(false);
               history.push('/chats');
        } catch (error) {
        
            toast({
                title: 'Email already exist',
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position:"bottom",
              });
              setLoading(false)
        }

    }




  return (
    <VStack spacing='5px'>
     <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter  Your Name' 
            onChange={(e)=>{setName(e.target.value)}}
            />
        </FormControl>

        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter  Your Email' 
            onChange={(e)=>{setEmail(e.target.value)}}
            />
        </FormControl>

        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input type={showPass?"text":"password"} placeholder='Enter Password' 
            onChange={(e)=>{setPassword(e.target.value)}}
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size='sm' onClick={()=>setShowPass(!showPass)}>
                {showPass? "Hide":"Show"} </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id='confirm-password' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
            <Input type={showConfPass?"text":"password"} placeholder='Confirm  Password' 
            onChange={(e)=>{setConfirmPassword(e.target.value)}}
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size='sm' onClick={()=>setShoConPass(!showConfPass)}>
                {showConfPass? "Hide":"Show"} </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id='pic' isRequired>
            <FormLabel>Upload you picture</FormLabel>
            <Input type="file"
            p={1.5}
            accept="image/*"
            onChange={(e)=>{postDetails(e.target.files[0])}}
            />
        </FormControl>

        <Button colorScheme="green" 
        width="100%" style={{marginTop:15}} onClick={submitHandler} 
        isLoading={loading}
        >
            Register
        </Button>

</VStack>
  )
}

export default Register