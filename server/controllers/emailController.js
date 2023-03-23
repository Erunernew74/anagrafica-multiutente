const Email = require('../models/emailModel');
const User = require('../models/userModel');

exports.insertEmailById = async(id, email) => {
    const emailsWithId = email.map((em) => {
        return{
            idUser: id,
            tipologiaEmail: em.tipologiaEmail,
            email: em.email
        }
    })

    const newEmail = await Email.insertMany(emailsWithId);
    const newEmailId = newEmail.map((em) => em._id);

    await User.updateOne({_id: id}, {$push: {email: newEmailId}});
    return newEmail
}

exports.getEmail = async(req, res) => {
    try {
        //* Funzione che mi fa vedere l email per ogni utente loggato
        const data = await User.findOne({_id: req.user._id}).populate("email");
        return res.status(200).json({data: data.email})
    } catch (error) {
        console.log(error)
        return res.status(400).json({msg:`Errore nell'inserimento di una email`})
    }
}

exports.deleteEmail = async(req, res) => {
    const { emailId } = req.params;
    try {
        await Email.deleteOne({_id: emailId});
        await User.updateOne({_id: req.user._id}, {$push:{email:emailId}});
        return res.status(200).json({msg:`Email cancellata con successo`})
    } catch (error) {
        console.log(error)
        return res.status(400).json({msg: `Errore nella cancellazione della mail`})
    }
}