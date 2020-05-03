const admin = require("../configs/firebaseAdmin");

async function verifyToken(req, res, next) {
  const idToken = req.headers.authentication;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    if (decodedToken) {
      req.headers.uid = decodedToken.uid;

      return next();
    } else {
      return res.status(401).send("You are not authorized!");
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send("You are not authorized!");
  }
}

module.exports = verifyToken;
