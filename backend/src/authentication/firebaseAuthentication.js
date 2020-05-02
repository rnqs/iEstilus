const admin = require('../configs/firebaseAdmin');

async function verifyToken(req, res, next) {
    const idToken = req.headers.authentication;
    const { firebaseUid } = req.body || req.params;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        if (decodedToken.uid == firebaseUid) {
            return next();
        } else {
            return res.status(401).send('You are not authorized!');
        }
    } catch (error) {
        return res.status(401).send('You are not authorized!');
    }
}

module.exports = verifyToken;