import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Drawer,
 DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay,
Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList,

Text, Tooltip, useToast } from '@chakra-ui/react';
import {Spinner} from '@chakra-ui/spinner'
import {useDisclosure} from '@chakra-ui/hooks'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import  {ChatState} from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal';
import axios from 'axios'
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

const SideDrawer = () => {

    const [search,setSearch]=useState('');
    const [searchResult,setSearchResult]=useState('');
    const [loading,setLoading]=useState(false);
    const [loadingChat,setLoadingChat]=useState();
    const {user,setSelectedChat,chats,setChats}=ChatState();
    const history=useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast=useToast();
    const logoutHandler=()=>{
        localStorage.removeItem("userInfo");
        history.push('/');
    }

    const handleSearch= async()=>{
        if(!search){
            toast({
                title:"Search field is empty !",
                status:"warning",
                duration:3000,
                isClosable:true,
                position:"top-left"
            });
            return;
        }
        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:user.token
                }
            };
            const {data} = await axios.get(`/api/user?search=${search}`,config);
            setLoading(false);
            setSearchResult(data);
           

        } catch (error) {
             toast({
                title:"Error Occured!",
                desription:"Failed to load search result",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"bottom-left"
            });
        }
    }
 
    const accessChat= async (userId)=>{
        try {
            setLoadingChat(true)
            const config={
                headers:{
                    "Content-type":"application/json",
                    Authorization:user.token
                }};
            const {data}=await axios.post(`/api/chat`,{userId},config);

            if(!chats.find((c)=>c._id === data._id))
            setChats([data,...chats])

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title:"Error fetching data!",
                desription:error.message,
                status:"error",
                duration:3000,
                isClosable:true,
                position:"bottom-left"
            });
        }
    }

      return (
    <>
    <Box 
    d="flex"
    justifyContent={'space-between'}
    alignItems='center'
    bg='white'
    w='100%'
    p='5px 10px 5px 10px'
    borderWidth={'5px'}
    >
        <Tooltip label="Users Search" hasArrow placement='bottom-start'>
        <Button variant='ghost' onClick={onOpen}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <Text d={{base:"none",md:"flex"}} px='4'>
            Search User
        </Text>
        </Button>
        </Tooltip>

        <Text fontSize='2xl' fontFamily='work sans'>
            UA-Chat
        </Text>
        <div>
            <Menu >
                <MenuButton p='1'>
                    <BellIcon fontSize={'2xl'} m='1'/>
                </MenuButton>
                {/* <MenuList ></MenuList> */}

            </Menu>
            <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                   <Avatar size={'sm'} cursor='pointer' name={user.name} src={user.pic} />
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user}>

                    <MenuItem>My Profile</MenuItem>
                    </ProfileModal>
                    <MenuDivider />
                    
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>

    </Box>
    <Drawer placement='left' onClose={onClose}  isOpen={isOpen}>
    <DrawerOverlay />
        <DrawerContent>
            <DrawerHeader borderBottom={'1px'}>Search Users</DrawerHeader>
         
         <DrawerBody>
             <Box d='flex' pb={2}>
                <Input 
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                />
                <Button  onClick={handleSearch} >Go</Button>
             </Box>
             {
                 loading ? (
                     <ChatLoading />
                 ) :(
                    searchResult && searchResult.map(user=>(
                        <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction ={()=>accessChat(user._id)}

                        />
                    )) 
                 )
             }
            { loadingChat && <Spinner ml={'auto'} d='flex' />}
         </DrawerBody>
         </DrawerContent>
    </Drawer>

        </>
  )
}

export default SideDrawer