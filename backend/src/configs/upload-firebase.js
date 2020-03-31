const multer = require('multer');
const path = require('path');

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);
            console.log(name);
            cb(null, `${name}-${Date.now()}${ext}`);
        },
    }),
};

const admin = require("firebase-admin");

const serviceAccount = require("./tcc-f-18eb7-00aaab946e3b.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "tcc-f-18eb7.appspot.com"
});

const bucket = admin.storage().bucket();

//bucket.upload(filename, {
//    destination,
//    metadata: {
//        metadata: {
//            firebaseStorageDownloadTokens: uuidv4(),
//        }
//    },
//})

// 'bucket' is an object defined in the @google-cloud/storage library.
// See https://googlecloudplatform.github.io/google-cloud-node/#/docs/storage/latest/storage/bucket
// for more details.