const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

//* Inseriamo le estensioni che ci interessano
const allowedFileType = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}

//* Customizziamo i valori di multer
const imageUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images')
        },
        filename: (req, file, cb) => {
            const ext = allowedFileType[file.mimetype];
            tmpId = uuidv4();
            req.body.ext = ext;
            req.body.tmpId = tmpId;
            cb(null, `${tmpId}.${ext}`) 
        }
    }),

    fileFilter: (req, file, cb) => {
        const isValid = !!allowedFileType[file.mimetype];

        const error = isValid ? null : new Error('Invalid mime type');

        cb(error, isValid)
    }
})

module.exports = imageUpload