const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nomeUtente:{
        type: String,
        required: true
    },
    cognomeUtente:{
        type: String//* Insermento successivo, cioè l'update del profile
    },
    usernameUtente:{
        type: String,
        required: true,
        unique: true
    },
    ext: {
        type: String,
        maxlength: 4
    },
    passwordHash:{
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isValid: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    numeriTelefono:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'numeriTelefono'
    }],
    email:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'email'
    }],
})

const User = mongoose.model('user', userSchema);
module.exports = User;