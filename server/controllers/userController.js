const User = require("../models/userModel");
const fs = require("fs");
// const imageUpload = require('../middleware/image-upload');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const {insertNumeriTelefonoById} = require('./numeriTelefonoController');
const {insertEmailById} = require('../controllers/emailController')

exports.register = async (req, res) => {
  try {
    const { nomeUtente, usernameUtente, ext, password, passwordVerify } =
      req.body;

    if (
      !nomeUtente ||
      !usernameUtente ||
      !ext ||
      !password ||
      !passwordVerify
    ) {
      return res
        .status(400)
        .json({ msg: `Inserire tutti i dati per la registrazione` });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: `Password troppo corta` });
    }

    if (password !== passwordVerify) {
      return res.status(400).json({ msg: `Le due password non coincidono` });
    }

    const existingUser = await User.findOne({ usernameUtente });
    if (existingUser) {
      return res.status(400).json({ msg: `Utente già presente nel database` });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User({
      nomeUtente,
      usernameUtente,
      ext,
      passwordHash,
    });

    const { id } = await newUser.save();

    //* Qui se vogliamo inserire delle imamgini
    fs.rename(
      `./uploads/images/${req.body.tmpId}.${req.body.ext}`,
      `./uploads/images/${id}.${ext}`,
      function (err) {
        if (err) console.log("ERROR: " + err);
      }
    );

    return res.status(200).json({
      msg: "Registrazione avvenuta con successo",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: `Errore` });
  }
};

exports.login = async (req, res) => {
  try {
    const { usernameUtente, password } = req.body;
    if (!usernameUtente || !password) {
      return res.status(200).json({ msg: `Attenzione! Dati mancanti` });
    }

    const existingUser = await User.findOne({ usernameUtente }).lean();
    if (!existingUser) {
      return res.status(400).json({ msg: `Utente non presente nel database` });
    }

    //* Compariamo la password fornita dall'utente con quella salvata nel database
    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!passwordCorrect) {
      return res.status(400).json({ msg: `Email o password non corrette` });
    }

    //* Da qui prendiamo i dati dell'utente per metterli nel profilo
    //* Creiamo anche il nuovo token
    const user = existingUser;

    delete user.passwordHash;
    res.cookie("user", JSON.stringify(user), { expiresIn: "1d" });
    const token = jwt.sign(
      {
        user: existingUser,
        usernameUtente: existingUser.usernameUtente,
      },
      process.env.JWT_SECRET
    );

    //* Login ok
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        credentials: true,
        samesite: true,
        optionsSuccessStatus: 200,
      })
      .json({ msg: "Login ok", user: user });
  } catch (error) { }
};

//* Rotta per il logout
exports.logout = async (req, res) => {
  res
    .clearCookie("usernameUtente")
    .clearCookie("user")
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      credentials: true,
      samesite: true,
      optionsSuccessStatus: 200,
      maxAge: 0,
    })
    .json({
      msg: "Logout avvenuto con successo!",
    });
};

//* Fetch per verificare e validare il token per la registrazione e il login - Per le autorizzazioni
//* ROTTA: router.get('/jwt-verify', jwtVerify)
exports.jwtVerify = async (req, res) => {
  try {
    let token = req.cookies["token"];
    if (!token || token == undefined) {
      return res.status(401).json({ errorMessage: "Unauthorized" });
    }

    //* Validazione del token
    jwt.verify(req.cookies["token"], process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return res.status(400).json({ msg: "Unauthorized" });
      }

      const cookieUser = JSON.parse(req.cookies["user"]);

      token = jwt.sign({ user: cookieUser }, process.env.JWT_SECRET);
      res.cookie("user", JSON.stringify(cookieUser), { expiresIn: "15min" });
      res
        .cookie("token", token, {
          httpOnly: true,
          credentials: true,
          samesite: true,
          optionsSuccessStatus: 200,
        })
        .json({ msg: "Authorized" });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Unauthorized",
    });
  }
};

//* Codice per il recupero della password se ce la dimentichiamo:

//* Verifichiamo se la mail è presente nel db
//* ROTTA: router.post('/reset-password', resetPassword)
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const isValidEmail = await User.findOne({ email });
    if (!isValidEmail) return res.status(200).json({});
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "15min",
    });

    await sendResetPassword(email, token);
    res.status(200).json({});
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error });
  }
};

//* Verifichaimo se il token mandatogli è corretto
//* ROTTA: router.get('/reset-password/:token', verifyToken)
//* Middlewares che permette agli utenti di entrare solo nel proprio account
exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);

    req.user = data.user;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Not authorized" });
  }
};

//* Recupero della password per cui viene spedita la nuova password al db
//* ROTTA: router.post('/reset-password/:token', sendPassword)
exports.sendPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const password = await bcrypt.hash(newPassword, 10);
  const data = jwt.verify(token, process.env.JWT_SECRET);
  const nameUpdated = await User.findOneAndUpdate(
    { email: data.email },
    { passwordHash: password },
    { new: true }
  );

  console.log(nameUpdated);

  res.status(200).json({ msg: "Password has been changed!" });
};


exports.userUpdate = async (req, res) => {
  const id = req.user._id;
  try {
    const {nomeUtente, cognomeUtente, usernameUtente, ext} = req.body;

    //* Inserimento dei valori della tabella NumeriTelefono
    let {numeriTelefono} = req.body;
    //* Devo eseguire il parse perché nella fetch effettuo lo stringify dato che ho a che fare con una immagine
    numeriTelefono = JSON.parse(numeriTelefono)
    //* Verifichaimo che se il campo è vuoto non venga salvato nel database
    if(numeriTelefono){
      numeriTelefono = numeriTelefono.filter((numero) => (numero.tipologiaNumero !== "") && (numero.numeroTelefono !== "")) 
      //* Solo se l'array è maggiore di zero andremo a salvarlo nel db
      if(numeriTelefono && numeriTelefono.length > 0){
        await insertNumeriTelefonoById(id, numeriTelefono)
      }
    }

    //* Inserimento dei valori della tabella Email
    let {email} = req.body;
    //* Devo eseguire il parse perché nella fetch effettuo lo stringify dato che ho a che fare con una immagine
    email = JSON.parse(email);
    if(email){
      email = email.filter((em) => (em.tipologiaEmail !== '') && (em.email !== ''))
      if(email && email.length > 0){
        await insertEmailById(id, email)
      }
    }

    await User.findByIdAndUpdate(id, {
      nomeUtente,
      cognomeUtente,
      usernameUtente,
      ext,
    })

    req.user.nomeUtente = nomeUtente;
    req.user.cognomeUtente = cognomeUtente;
    req.user.usernameUtente = usernameUtente;
    req.user.ext = ext ? ext : req.user.ext; 

     //* Codice Per togliere la vecchia immagine ed inserire quella nuova
     if(req.body.tmpId) {
      await User.updateOne(
        {_id: id},
        {ext: req.body.ext}
      )
        const oldImage = id+"."+req.user.ext;
       //* Eliminiamo la vecchia immagine
       try{
       fs.unlinkSync(`./uploads/images/${oldImage}`)
       }catch(err){
        console.log(err)
       }
       //* Carichiamo la nuova immagine  
       fs.rename(
         `./uploads/images/${req.body.tmpId}.${req.body.ext}`,
         `./uploads/images/${id}.${req.body.ext}`,
         function (err) {
           if (err) console.log("ERROR: " + err);
         }
       );
    }
    
    return res.status(200).json({msg:`Profilo aggiornato`, userUpdate:req.user})


  } catch (error) {
    console.log(error)
    return res.status(400).json({msg:`Profilo non trovato`})
  }
}
