const express=require('express');
const auth = require('../middlwares/auth');

const router=express.Router();

// router.route('/').post(auth,accessChat);
// router.route('/').get(auth,fetchChats);
// router.route('/group').post(auth,createGroup);
// router.route('/rename').put(auth,renameGroup);
// router.route('/groupremove').put(auth,removeFromGroup);
// router.route('/groupadd').put(auth,addToGroup);


module.exports=router;