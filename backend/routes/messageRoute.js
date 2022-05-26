const express = require('express');
const { sendMessage, allMessages } = require('../controllers/messageController');
const auth = require('../middlwares/auth');
const router =express.Router();

router.route('/').post(auth,sendMessage)
 router.route('/:chatId').get(auth,allMessages)


module.exports = router;