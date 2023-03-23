const express = require('express');
const router = express.Router();

const {getNumeriTelefono, deleteNumeroTelefono} = require('../controllers/numeriTelefonoController');

router.get('/get-numeri', getNumeriTelefono);
router.delete('/delete/:numeroId', deleteNumeroTelefono);


module.exports = router;


