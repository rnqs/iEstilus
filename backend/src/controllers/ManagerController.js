const connection = require("../database/connection");

module.exports = {
  async create(req, res) {
    const { uid } = req.headers;

    const manager = await connection("managers").insert({
      firebase_uid: uid,
    });

    return res.status(201).json(manager);
  },
};
