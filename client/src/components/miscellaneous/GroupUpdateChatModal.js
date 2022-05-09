import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'

const GroupUpdateChatModal = ({fetchAgain,setFetchAgain}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChtName,setGroupChatName]=useState("");
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [renameLoading,setRenameloading]=useState(false);
    
    const {selectedChat,setSelectedChat,user}=ChatState();
    const toast=useToast();
    

    const handleRemove=async(removedUser)=>{
        if(selectedChat.groupAdmin._id !== user._id && removedUser._id !== user._id){
            toast({
                title:"Only Admin can remove users",
                desription:'Faild to load the search results',
                status:"warning",
                duration:3000,
                isClosable:true,
                position:"top"
            }); 
            return;
    }
     try {
         setLoading(true);
         const config ={headers:{Authorization:user.token}};
         const {data}=await axios.put(`/api/chat/groupremove`,{
            chatId:selectedChat._id,
            userId:removedUser._id
           },config)
         removedUser._id===user._id?setSelectedChat():setSelectedChat(data);
         setFetchAgain(!fetchAgain);
         setLoading(false);
        } catch (error) {
            toast({
                title:"Error Occored",
                desription:'Faild to load the search results',
                status:"erroe",
                duration:3000,
                isClosable:true,
                position:"bottom-left"
            }); 
            setLoading(false);
     }

}
    const handleAddUser=async(addedUser)=>{
        if(selectedChat.users.find((u)=>u._id===addedUser._id)){
            toast({
                title:"user already exist in the group",
                desription:'Faild to load the search results',
                status:"warning",
                duration:3000,
                isClosable:true,
                position:"bottom-left"
            }); 
            return;
        }
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title:"Only Admin can add users",
                desription:'Faild to load the search results',
                status:"warning",
                duration:3000,
                isClosable:true,
                position:"top"
            }); 
            return;
        }

        try {
            setLoading(true)
            const config ={headers:{Authorization:user.token}}
            const {data}=await axios.put(`/api/chat/groupadd`,{
            chatId:selectedChat._id,
            userId:addedUser._id
           },config)
            
           setSelectedChat(data);
           setFetchAgain(!fetchAgain);
           setLoading(false);
        } catch (error) {
            toast({
                title:"Error Occored",
                desription:'Faild to load the search results',
                status:"erroe",
                duration:3000,
                isClosable:true,
                position:"bottom-left"
            }); 
            setLoading(false)
        }

    }

    const handleRename=async()=>{
        if(!groupChtName) return
        try {
            setRenameloading(true);
            const config ={headers:{Authorization:user.token}}
            const {data}=await axios.put(`/api/chat/rename`,{
                chatId:selectedChat._id,
                chatName:groupChtName
            },config)

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameloading(false);

        } catch (error) {
            toast({
                title:"Error Occured!",
                desription:'Faild to load the search results',
                status:"error",
                duration:3000,
                isClosable:true,
                position:"bottom-left"
            }); 
            setRenameloading(false);
        }
        setGroupChatName('');
    }
    const hanldeSearch= async(query)=>{
       
        setSearch(state=>query);
        if(!query){return;}
        try {
            setLoading(true);
            const config ={headers:{Authorization:user.token}}

            const {data} = await axios.get(`/api/user?search=${query}`,config)  // i replaced the query with search state to get the right value on time 
            setLoading(false);
            setSearchResult(data);
            
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
        setLoading(false);
    }
  return (
    <>
      <IconButton
      d={{base:"flex"}} icon={<ViewIcon/>}
      onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box 
            w="100%" d="flex" flexWrap="wrap" pb={3}
            >
                {selectedChat.users.map(u=>(
                      <UserBadgeItem key={u._id}user={u} handleFunction={()=>handleRemove(u)}/>
                ))}
            </Box>

               <FormControl d="flex">
                <Input placeholder='Chat Name' mb={3}
                value={groupChtName}
                onChange={(e)=>setGroupChatName(e.target.value)}  />
                    <Button 
                    variant={"solid"}
                    colorScheme="teal"
                    ml={1}
                    isLoading={renameLoading}
                    onClick={handleRename}>
                        Update
                    </Button>
                </FormControl>    
               <FormControl >
                    <Input placeholder='Add User to froup' mb={1}
                    onChange={(e)=>hanldeSearch(e.target.value)} />

                </FormControl> 
                    {
                        loading ? (
                            <Spinner size={"lg"}/>
                        ):
                        (
                            searchResult.map((user)=>(
                                <UserListItem key={user._id}
                                user={user}
                                handleFunction={()=>handleAddUser(user)}
                                />
                            ))
                        )
                    }


          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red'  onClick={()=>handleRemove(user)}>
              Leave Group
            </Button>
     
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupUpdateChatModal