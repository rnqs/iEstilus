const connection = require("../database/connection");
const st = require("../database/postgis");

module.exports = {
  async index(req, res) {
    if (req.query.uid) {
      const establishments = await connection("establishments")
        .select()
        .where({ firebase_uid: req.query.uid });

      return res.json(establishments);
    }

    const [count] = await connection("establishments").count();

    let establishments = await connection("establishments").select([
      "establishments.*",
      st.asGeoJSON("coordinate"),
    ]);

    establishments.forEach((establishment) => {
      const { coordinates } = JSON.parse(establishment.coordinate);
      establishment.coordinate = {};
      establishment.coordinate.latitude = coordinates[1];
      establishment.coordinate.longitude = coordinates[0];
    });

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
        coordinate: st.geomFromText(
          `Point(${coordinate.longitude} ${coordinate.latitude})`,
          4326
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
        .select(["establishments.*", st.asGeoJSON("coordinate")])
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
            ? st.geomFromText(
                `Point(${coordinate.longitude} ${coordinate.latitude})`,
                4326
              )
            : st.geomFromText(
                `Point(${establishment.coordinate.longitude} ${establishment.coordinate.latitude})`,
                4326
              ),
        })
        .where("_id", establishmentId);

      establishment = await connection("establishments")
        .where("_id", establishmentId)
        .select(["establishments.*", st.asGeoJSON("coordinate")])
        .first();

      const { coordinates } = JSON.parse(establishment.coordinate);
      establishment.coordinate = {};
      establishment.coordinate.latitude = coordinates[1];
      establishment.coordinate.longitude = coordinates[0];

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
