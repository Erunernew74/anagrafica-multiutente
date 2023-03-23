const NumeriTelefono = require('../models/numeriTelefonoModel');
const User = require('../models/userModel');

//* Inserimento numeri di telefono:
//* Non è una rotta diretta perché essendo una tabella collegata allo User andremo ad inserire i valori nello user così da effettuare l'update 
exports.insertNumeriTelefonoById = async(id, numeriTelefono) => {

    const numeriTelefonoWithId = numeriTelefono.map((numero) => {
        return{
            idUser:id,
            tipologiaNumero: numero.tipologiaNumero,
            numeroTelefono: numero.numeroTelefono
        }
    })
    const newNumeriTelefono = await NumeriTelefono.insertMany(numeriTelefonoWithId);
    const newNumeriTelefonoId = newNumeriTelefono.map((numero) => numero._id);

    await User.updateOne({_id:id}, {$push: {numeriTelefono: newNumeriTelefonoId}});
    return newNumeriTelefono
}

exports.getNumeriTelefono = async(req, res) => {
    try {
        //* Funzione che mi fa vedere i numeri di telefono per ogni utente
        const data = await User.findOne({_id: req.user._id}).populate("numeriTelefono");
        return res.status(200).json({data: data.numeriTelefono})
    } catch (error) {
        console.log(error)
        return res.status(400).json({msg: 'Errore'})
    }
}

//* Per eliminare un numero di telefono dalla tabella che vedo al caricamentod ella pagina
exports.deleteNumeroTelefono = async(req, res) => {
    const { numeroId } = req.params;
    try {
        await NumeriTelefono.deleteOne({_id:numeroId});
        await User.updateOne({_id: req.user._id}, {$pull: {numeri: numeroId}});
        return res.status(200).json({msg:`Numero cancellato correttamente`})
    } catch (error) {
        console.log(error)
        return res.status(400).json({msg:`Errrore nella cancellazione del numero`})
    }
}

//* Per eliminare un numero che magari ho sbagliato a scrivere e che non voglio salvare nel database
exports.deleteNumeroTelefonoDaElenco = async(req, res) => {
    const { id: idNumero } = req.params;

    try {
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({msg:`Errrore nella cancellazione del numero`})
    }
}