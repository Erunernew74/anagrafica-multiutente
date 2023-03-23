const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    tipologiaEmail:{
        type: String
    },
    email:{
        type: String
    },
    idUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }

})

const Email = mongoose.model('email', emailSchema);
module.exports = Email;