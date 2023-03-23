const mongoose = require('mongoose');

const numeriTelefonoSchema = new mongoose.Schema({
    tipologiaNumero:{
        type: String
    },
    numeroTelefono:{
        type: String
    },
    idUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

const NumeriTelefono = mongoose.model('numeriTelefono', numeriTelefonoSchema);
module.exports = NumeriTelefono;