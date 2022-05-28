import { Box, FormControl, IconButton, Input, Spinner, Text,  useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import {ArrowBackIcon} from '@chakra-ui/icons'
import {getSender,getSenderFull} from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import GroupUpdateChatModal from './miscellaneous/GroupUpdateChatModal'
import axios from 'axios'
import './style.css';
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
import typingImg from './typing.gif'
const ENDPOINT = "https://ua-live-chat.herokuapp.com";
let socket,selectedChatCompare;
const SingleChat = ({fetchAgain,setFetchAgain}) => {

    const {user,selectedChat,setSelectedChat,notification,setNotification} = ChatState();
    const [messages,setMessages]=useState([]);
    const [loading,setLoading]=useState(false);
    const [newMessage,setNewMessage]=useState();
    const [socketConnected,setSocketConnected]=useState(false);
    const [typing,setTyping]=useState(false);
    const [isTyping,setIsTyping]=useState(false);

    const toast=useToast();

const fetchMessages=async()=>{

    if(!selectedChat) return;
    try {
        const config={
            headers:{
                Authorization:user.token
            }};
            setLoading(true);
            const {data}=await axios.get(`/api/message/${selectedChat._id}`,config);

            console.log(data);

            setMessages(data);    
            setLoading(false);
            socket.emit('join chat',selectedChat._id);
    } catch (error) {
        toast({
            title:"Error Occored",
            desription:'Faild to load the search results',
            status:"erroe",
            duration:3000,
            isClosable:true,
            position:"bottom"
        }); 
        setLoading(false);
    }
}

useEffect(()=>{
    socket= io(ENDPOINT);
    socket.emit("setup",user);
    socket.on('connected',()=> setSocketConnected(true));
    socket.on('typing',()=>{setIsTyping(true); });
    socket.on('stop typing',()=>{setIsTyping(false); });
},[]) ;


useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
}, [selectedChat]);


useEffect(() => {
    
  socket.on('message recived',(newMessageRecieved)=>{
      
    if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id ){
        if(!notification.includes(newMessageRecieved)){
            setNotification([newMessageRecieved,...notification]);
            setFetchAgain(!fetchAgain)
        }

        
    }else{
        setMessages([...messages,newMessageRecieved])
    }
  })
});



    const sendMessage=async (event)=>{
        if(event.key==="Enter" && newMessage){
            socket.emit('stop typing',selectedChat._id)
            try {
                const config={
                    headers:{
                        "Content-type":"application/json",
                        Authorization:user.token
                    }
                }
                setNewMessage('');

                const {data}=await axios.post('/api/message',{
                    content:newMessage,
                    chatId:selectedChat._id,
                },config);
                
                socket.emit('new message',data)
                setMessages([...messages,data])
            } catch (error) {
                toast({
                    title:"Error Occored",
                    desription:'Faild to load the search results',
                    status:"erroe",
                    duration:3000,
                    isClosable:true,
                    position:"bottom"
                }); 
            }
        }
    }

    const typingHandler=(e)=>{
        setNewMessage(e.target.value);
        if(!socketConnected)return;

        if(!typing){
            setTyping(true);
            socket.emit('typing',selectedChat._id);
        }
        let lastTypingTime= new Date().getTime();
        let timerLength= 3000;
        setTimeout(()=>{
            let timeNow=new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if(timeDiff>= timerLength && typing){
                socket.emit('stop typing',selectedChat._id);
                setTyping(false)
            }
        },timerLength)
    }

  return (
    <>
    {selectedChat?(
        <>
        <Text 
         fontSize={{base:"28px",md:"30px"}}
         pb={3}
         px={2}
         w="100%"
         fontFamily={"Work sans"}
         d="flex"
         justifyContent={{base:"space-between"}}
         alignItems="center"
        >
            
            <IconButton 
            d={{base:"flex",md:"none"}}
            icon={<ArrowBackIcon/>}
            onClick={()=>setSelectedChat("")}
            />
            {!selectedChat.isGroupChat?(
                <>
                {getSender(user,selectedChat.users)}
                <ProfileModal user={getSenderFull(user,selectedChat.users)} />
                </>
            ):(
            <>
            {selectedChat.chatName.toUpperCase()}
            <GroupUpdateChatModal fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain} 
            fetchMessages={fetchMessages}
            />
            </>
            )}

        </Text>
            <Box 
            d="flex"
            flexDir={"column"}
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY='hidden'
            >
                { loading? (
                    <Spinner
                    size="xl"
                    w={20}
                    h={20}
                    alignSelf="center"
                    margin="auto"
                    />
                ):(
                    <div className='messages'>
                        <ScrollableChat messages={messages}/>
                    </div>
                )}
                <FormControl 
                onKeyDown={sendMessage}
                isRequired
                mt={3}
                >
                    {isTyping?<div className='typing-animation'><img src={typingImg} alt=""/></div>:(<></>)}
                    <Input 
                    variant={"filled"}
                    bg="#E0E0E0"
                    placeholder='Enter a message..'
                    onChange={typingHandler}
                    value={newMessage}
                    />

                </FormControl>
            </Box>

        </>
    ):(
        <Box 
        d='flex' alignItems="center" justifyContent="center" h="100%" >
           <Text fontSize="3xl" pb={3} fontFamily="Work sans">
               Click on a user to start a Chat
               </Text> 
        </Box>
    )}
    </>
  )
}

export default SingleChat