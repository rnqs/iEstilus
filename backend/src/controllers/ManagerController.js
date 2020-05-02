const connection = require("../database/connection");

module.exports = {
    async create(req, res) {
        const { firebaseUid } = req.body;

        const manager = await connection("manager").insert({
            firebase_uid: firebaseUid
        });

        return res.json(manager);
    }
};