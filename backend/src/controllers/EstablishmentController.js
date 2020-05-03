const connection = require("../database/connection");

module.exports = {
  async index(req, res) {
    const [count] = await connection("establishments").count();

    const establishments = await connection("establishments").select([
      "establishments.*",
    ]);

    res.header("X-Total-count", count["count(*)"]);

    return res.json(establishments);
  },

  async create(req, res) {
    const {
      name,
      description,
      photo_url,
      phone_number,
      whatsapp_available,
      address,
      coordinate,
    } = req.body;
    const { uid } = req.headers;

    try {
      const establishment = await connection("establishments").insert({
        firebase_uid: uid,
        name,
        description,
        photo_url,
        phone_number,
        whatsapp_available,
        address,
        coordinate: connection.raw(
          `ST_PointFromText('POINT(${coordinate.latitude} ${coordinate.longitude})')`
        ),
      });

      return res.status(201).json(establishment);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  async edit(req, res) {
    const {
      name,
      description,
      photo_url,
      phone_number,
      whatsapp_available,
      address,
      coordinate,
    } = req.body;
    const { establishmentId } = req.params;
    const { uid } = req.headers;

    try {
      let establishment = await connection("establishments")
        .where("_id", establishmentId)
        .select("establishments.*")
        .first();

      if (establishment.firebase_uid !== uid) {
        return res.status(401).json({
          error: "Insufficient Permissions",
        });
      }

      await connection("establishments")
        .update({
          name: name || establishment.name,
          description: description || establishment.description,
          photo_url: photo_url || establishment.photo_url,
          phone_number: phone_number || establishment.phone_number,
          whatsapp_available:
            whatsapp_available || establishment.whatsapp_available,
          address: address || establishment.address,
          coordinate: coordinate
            ? connection.raw(
                `ST_PointFromText('POINT(${coordinate.latitude} ${coordinate.longitude})')`
              )
            : connection.raw(
                `ST_PointFromText('POINT(${establishment.coordinate.x} ${establishment.coordinate.y})')`
              ),
        })
        .where("_id", establishmentId);

      establishment = await connection("establishments")
        .where("_id", establishmentId)
        .select("establishments.*")
        .first();

      return res.status(200).json(establishment);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  async delete(req, res) {
    const { establishmentId } = req.params;
    const { uid } = req.headers;

    try {
      const establishment = await connection("establishments")
        .where("_id", establishmentId)
        .select("firebase_uid")
        .first();

      if (establishment.firebase_uid !== uid) {
        return res.status(401).json({
          error: "Insufficient Permissions",
        });
      }

      await connection("establishments").where("_id", establishmentId).delete();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};
