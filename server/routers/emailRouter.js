const express = require('express');
const router = express.Router()

const {getEmail, deleteEmail} = require('../controllers/emailController')

router.get('/get-email', getEmail)
router.delete('/delete/:emailId', deleteEmail)

module.exports = router;