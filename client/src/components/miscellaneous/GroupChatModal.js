import { Box, Button, FormControl, Input, Modal, ModalBody,
ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const GroupChatModal = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName,setGroupChatName]=useState();
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [search,setSearch]=useState('');
    const [searchResult,setSearchResult]=useState();
    const [loading,setLoading]=useState(false);
    const toast=useToast();

    const {user,chats,setChats}=ChatState();


    const handleSearch=async(query)=>{
        setSearch(state=>query);
        if(!query){return;}
        try {
            setLoading(true);
            const config ={headers:{Authorization:user.token}}

            const {data} = await axios.get(`/api/user?search=${query}`,config)  // i replaced the query with search state to get the right value on time 
            setLoading(false);
            setSearchResult(data);
            console.log(data);
        } catch (error) {
            toast({
                title:"Error Occured!",
                desription:'Faild to load the search results',
                status:"error",
                duration:3000,
                isClosable:true,
                position:"bottom-left"
            });
        }
    }
    const handleSubmit=async ()=>{
        
        if( selectedUsers.length<2 || !groupChatName ){
            toast({
                title:"Please fill all fields",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"top"
            });
            return;
        }

        try {

            const config ={headers:{Authorization:user.token}}
            const {data} = await axios.post('/api/chat/group',{
                name:groupChatName,
                users:JSON.stringify(selectedUsers.map(u=>u._id)),
            },config)

            setChats([data,...chats]);
            onClose();
            toast({
                title:"New Group Chat Created",
                status:"success",
                duration:3000,
                isClosable:true,
                position:"bottom"
            });
        } catch (error) {
            toast({
                title:"Error Occured",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"bottom"
            });
        }
    }
    const handleGroup= (userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title:"User already added",
                status:"warning",
                duration:3000,
                isClosable:true,
                position:"top"
            });
            return;
        }
        setSelectedUsers([...selectedUsers,userToAdd]);
    }

    const handleDelete=(user)=>{
        setSelectedUsers(selectedUsers.filter(sel=>sel._id !== user._id))
    }

    

  return (
    <>
    <span onClick={onOpen}>{children}</span>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
        fontSize={"35px"}
        fontFamily="Work sans"
        d="flex"
        justifyContent={'center'}
        >Create Group Chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody 
        d='flex' flexDir={'column'} alignItems="center"
        >
         <FormControl>
             <Input placeholder={"Chat Name"} mb={3} onChange={(e)=>setGroupChatName(e.target.value)} />
         </FormControl>
         <FormControl>
             <Input placeholder={"Add Users"} mb={1} onChange={(e)=>handleSearch(e.target.value)} />
         </FormControl>

    {
        <Box w="100%" d="flex"  flexWrap={'wrap'}>
{

        selectedUsers&& selectedUsers.map(u=>(
            <UserBadgeItem key={user._id}user={u} handleFunction={()=>handleDelete(u)}/>
            ))
        }
        </Box>
    }


       {loading?<div>loading</div>:(
           searchResult&& searchResult.slice(0,4).map(user=>(
               <UserListItem user={user} key={user._id} handleFunction={()=>handleGroup(user)}/>
           ))
       )}

        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' onClick={handleSubmit}>
            Create
          </Button>
         
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default GroupChatModal