const express = require('express');
const { registerUser, loginUser, allUsers ,} = require('../controllers/userController');
const auth = require('../middlwares/auth');
const router = express.Router();

router.route('/').get(auth,allUsers)
router.post('/login',loginUser);
router.post('/register',registerUser);


module.exports=router