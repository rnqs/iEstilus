const connection = require("../database/connection");

module.exports = {
  async create(req, res) {
    const { uid } = req.headers;

    const manager = await connection("managers").where({ firebase_uid: uid });

    if (manager.length == 0) {
      const created = await connection("managers").insert({
        firebase_uid: uid,
      });

      return res.status(201).json(created && { firebase_uid: uid });
    }

    return res.status(200).json(manager[0]);
  },
};
