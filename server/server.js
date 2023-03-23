const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors({
    origin: [`http://localhost:3000`],
    credentials: true,
    samesite: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ["set-cookie"],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH", "OPTIONS"]
}));
app.use(cookieParser());

const PORT = process.env.PORT || 8030

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, (err) => {
    if(err) return console.log(err)
    console.log(`Connected on db`)
})


//* Rotta che gestisce il sistema di login e register
const { verifyToken } = require('./controllers/userController')

const userRouter = require('./routers/userRouter');
app.use('/auth',userRouter);

const numeriTelefonoRouter = require('./routers/numeriTelefonoRouter');
app.use('/numeri', verifyToken, numeriTelefonoRouter)

const emailRouter = require('./routers/emailRouter');
app.use('/email', verifyToken, emailRouter)

//* Rotta che gestisce le immagini
app.use('/images', express.static(path.join(__dirname, 'uploads/images')))




// const User = require('./models/userModel');
// const NumeriTelefono = require('./models/numeriTelefonoModel');
// const Email = require('./models/emailModel')

// app.get("/user/:id",async (req,res)=>{
//     const user = await User.findById(req.params.id);
// })
// app.get("/user",async (req,res)=>{
//     const user = await User.find();
//     res.json(user)
// })
// app.get("/numeri",async (req,res)=>{
//     const numeri = await NumeriTelefono.find();
//     res.json(numeri)
// })

// app.get('/email', async(req, res) => {
//     const email = await Email.find()
//     res.json(email)
// })
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
