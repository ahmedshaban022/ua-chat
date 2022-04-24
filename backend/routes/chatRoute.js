const express=require('express');
const { accessChat, fetchChats, createGroup, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chatController');
const auth = require('../middlwares/auth');

const router=express.Router();

router.route('/').post(auth,accessChat);
router.route('/').get(auth,fetchChats);
router.route('/group').post(auth,createGroup);
router.route('/rename').put(auth,renameGroup);
router.route('/groupadd').put(auth,addToGroup);
 router.route('/groupremove').put(auth,removeFromGroup);


module.exports=router;