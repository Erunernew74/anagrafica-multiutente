const express = require('express');
const router = express.Router();
const imageUpload = require('../middleware/image-upload')

const { 
    register, 
    login,
    logout,
    jwtVerify, 
    resetPassword,
    verifyToken,
    sendPassword,
    userUpdate
} = require('../controllers/userController');

router.post('/register', imageUpload.single('image'), register);
router.post('/login', login)
router.post('/logout', logout)
router.get("/jwt-verify", jwtVerify)

//* Codice per il recupero della password se ce la dimentichiamo
//* Verifichiamo se la mail è presente nel db
//* rotta presente in FormEmail.jsx
router.post("/reset-password", resetPassword);

//* Verifichaimo se il token mandatogli è corretto
router.get("/reset-password/:token", verifyToken);

//* Recupero della password per cui viene spedita la nuova password al db
router.post("/reset-password/:token", sendPassword);

//* Rotta per l'update utente
router.put('/update-profile', verifyToken, imageUpload.single('image'),  userUpdate)
module.exports = router;